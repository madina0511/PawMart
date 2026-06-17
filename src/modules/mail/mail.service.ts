import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { getErrorMessage } from '../../common/utils/error.util';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendWelcome(email: string, name: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: '🐾 Welcome to PawMart!',
        html: `
          <h2>Hello, ${name}!</h2>
          <p>Welcome to PawMart — the best pet shop for your furry friends! 🐶🐱</p>
          <p>Start shopping at <a href="https://pawmart.com">pawmart.com</a></p>
        `,
      });
      this.logger.log(`Welcome email sent to: ${email}`);
    } catch (error) {
      this.logger.error(`sendWelcome failed: ${getErrorMessage(error)}`);
    }
  }

  async sendPaymentConfirmed(
    email: string,
    name: string,
    orderId: string,
    amount: number,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: '✅ Payment Confirmed — PawMart',
        html: `
          <h2>Payment Confirmed!</h2>
          <p>Hi ${name}, your payment has been successfully processed.</p>
          <table>
            <tr><td><b>Order ID:</b></td><td>${orderId}</td></tr>
            <tr><td><b>Amount:</b></td><td>₩${amount.toLocaleString()}</td></tr>
          </table>
          <p>Your order is being prepared. We'll notify you when it ships!</p>
        `,
      });
      this.logger.log(`Payment email sent to: ${email}`);
    } catch (error) {
      this.logger.error(
        `sendPaymentConfirmed failed: ${getErrorMessage(error)}`,
      );
    }
  }

  async sendOrderStatus(
    email: string,
    name: string,
    orderId: string,
    status: string,
  ): Promise<void> {
    try {
      const statusMessages = {
        SHIPPING: '🚚 Your order is on the way!',
        DELIVERED: '📦 Your order has been delivered!',
      };
    } catch (error) {
      this.logger.error(`sendOrderStatus failed: ${getErrorMessage(error)}`);
    }
  }
}
