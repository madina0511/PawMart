import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { ProductsService } from '../products/products.service';
import { getErrorMessage } from 'src/common/utils/error.util';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private productsService: ProductsService,
  ) {}

  async create(input: CreateOrderInput, userId: string) {
    this.logger.log(`Creating order for user: ${userId}`);
    try {
      let totalAmount = 0;
      const items = [];

      for (const item of input.items) {
        const product = await this.productsService.findById(item.productId);
        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product: ${product.name}`,
          );
        }
        totalAmount += product.price * item.quantity;
        items.push({
          productId: new Types.ObjectId(item.productId),
          quantity: item.quantity,
          price: product.price,
        });
      }

      const order = await this.orderModel.create({
        userId: new Types.ObjectId(userId),
        items,
        totalAmount,
        shippingAddress: input.shippingAddress,
      });

      this.logger.log(`Order created: ${order._id}`);
      return order.toObject();
    } catch (error) {
      this.logger.error(`Failed to create order: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async findAll() {
    this.logger.log('Fetching all orders');
    try {
      return this.orderModel.find().lean().exec();
      // findAll
    } catch (error) {
      this.logger.error(`Failed to fetch orders: ${getErrorMessage(error)}`);
      throw new InternalServerErrorException('Failed to fetch orders');
    }
  }

  async findByUser(userId: string) {
    this.logger.log(`Fetching orders for user: ${userId}`);
    try {
      return this.orderModel
        .find({ userId: new Types.ObjectId(userId) })
        .lean()
        .exec();
      // findByUser
    } catch (error) {
      this.logger.error(
        `Failed to fetch user orders: ${getErrorMessage(error)}`,
      );
      throw new InternalServerErrorException('Failed to fetch user orders');
    }
  }

  async findById(id: string) {
    this.logger.log(`Fetching order: ${id}`);
    try {
      const order = await this.orderModel.findById(id).lean();
      if (!order) throw new NotFoundException('Order not found');
      return order;
    } catch (error) {
      this.logger.error(`Failed to fetch order: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async updateStatus(input: UpdateOrderInput) {
    this.logger.log(`Updating order status: ${input._id} → ${input.status}`);
    try {
      const order = await this.orderModel
        .findByIdAndUpdate(
          input._id,
          { $set: { status: input.status } },
          { new: true },
        )
        .lean();
      if (!order) throw new NotFoundException('Order not found');
      return order;
    } catch (error) {
      this.logger.error(
        `Failed to update order status: ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }
}
