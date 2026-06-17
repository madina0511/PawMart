import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import axios from 'axios';
import { Payment, PaymentDocument, PaymentStatus } from './payment.schema';

import { ConfirmPaymentInput } from './dto/confirm-payment.input';
import { CancelPaymentInput } from './dto/cancel-payment.input';
import { getErrorMessage } from '../../common/utils/error.util';
import { Order, OrderDocument } from '../orders/schemas/order.schema';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly tossBaseUrl = 'https://api.tosspayments.com/v1/payments';
  private readonly secretKey = process.env.TOSS_SECRET_KEY;

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  private getAuthHeader() {
    const encoded = Buffer.from(`${this.secretKey}:`).toString('base64');
    return { Authorization: `Basic ${encoded}` };
  }

  async confirmPayment(
    userId: string,
    input: ConfirmPaymentInput,
  ): Promise<Payment> {
    try {
      this.logger.log(`confirmPayment: ${input.paymentKey}`);

      // 1. Toss API ga confirm so'rovi
      const response = await axios.post(
        `${this.tossBaseUrl}/confirm`,
        {
          paymentKey: input.paymentKey,
          orderId: input.orderId_toss,
          amount: input.amount,
        },
        {
          headers: {
            ...this.getAuthHeader(),
            'Content-Type': 'application/json',
          },
        },
      );

      const tossData = response.data;

      // 2. Payment saqlash
      const payment = new this.paymentModel({
        orderId: new Types.ObjectId(input.orderId),
        userId: new Types.ObjectId(userId),
        paymentKey: input.paymentKey,
        orderId_toss: input.orderId_toss,
        amount: input.amount,
        status: PaymentStatus.DONE,
        method: tossData.method,
      });
      await payment.save();

      // 3. Order status PAID ga yangilash
      await this.orderModel.findByIdAndUpdate(input.orderId, {
        status: 'PAID',
        paymentId: payment._id,
      });

      this.logger.log(`Payment confirmed: ${payment._id}`);
      return payment;
    } catch (error) {
      this.logger.error(`confirmPayment failed: ${getErrorMessage(error)}`);

      // Payment failed deb saqlash
      await this.paymentModel.create({
        orderId: new Types.ObjectId(input.orderId),
        userId: new Types.ObjectId(userId),
        paymentKey: input.paymentKey,
        orderId_toss: input.orderId_toss,
        amount: input.amount,
        status: PaymentStatus.FAILED,
        failReason: getErrorMessage(error),
      });

      throw error;
    }
  }

  async cancelPayment(
    userId: string,
    input: CancelPaymentInput,
  ): Promise<Payment> {
    try {
      this.logger.log(`cancelPayment: ${input.paymentKey}`);

      // 1. Toss API ga cancel so'rovi
      await axios.post(
        `${this.tossBaseUrl}/${input.paymentKey}/cancel`,
        { cancelReason: input.cancelReason },
        {
          headers: {
            ...this.getAuthHeader(),
            'Content-Type': 'application/json',
          },
        },
      );

      // 2. Payment status CANCELED ga yangilash
      const payment = await this.paymentModel.findOneAndUpdate(
        { paymentKey: input.paymentKey },
        { status: PaymentStatus.CANCELED },
        { new: true },
      );

      // 3. Order status CANCELLED ga yangilash
      if (payment) {
        await this.orderModel.findByIdAndUpdate(payment.orderId, {
          status: 'CANCELLED',
        });
      }

      return payment;
    } catch (error) {
      this.logger.error(`cancelPayment failed: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getPaymentByOrder(orderId: string): Promise<Payment> {
    try {
      return await this.paymentModel.findOne({
        orderId: new Types.ObjectId(orderId),
      });
    } catch (error) {
      this.logger.error(`getPaymentByOrder: ${getErrorMessage(error)}`);
      throw error;
    }
  }
}
