import { Resolver, Mutation, Query, Args, ID } from '@nestjs/graphql';
import { Logger, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Payment } from './payment.schema';
import { ConfirmPaymentInput } from './dto/confirm-payment.input';
import { CancelPaymentInput } from './dto/cancel-payment.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/schemas/user.schema';

@Resolver(() => Payment)
@UseGuards(JwtAuthGuard)
export class PaymentResolver {
  private readonly logger = new Logger(PaymentResolver.name);

  constructor(private readonly paymentService: PaymentService) {}

  @Mutation(() => Payment)
  async confirmPayment(
    @CurrentUser() user: any,
    @Args('confirmPaymentInput') input: ConfirmPaymentInput,
  ): Promise<Payment> {
    this.logger.log(`confirmPayment called by user: ${user._id}`);
    return this.paymentService.confirmPayment(user._id.toString(), input);
  }

  @Mutation(() => Payment)
  async cancelPayment(
    @CurrentUser() user: any,
    @Args('cancelPaymentInput') input: CancelPaymentInput,
  ): Promise<Payment> {
    this.logger.log(`cancelPayment called by user: ${user._id}`);
    return this.paymentService.cancelPayment(user._id.toString(), input);
  }

  @Query(() => Payment, { nullable: true })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async paymentByOrder(
    @Args('orderId', { type: () => ID }) orderId: string,
  ): Promise<Payment> {
    this.logger.log(`paymentByOrder: ${orderId}`);
    return this.paymentService.getPaymentByOrder(orderId);
  }
}
