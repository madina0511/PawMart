import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards, Logger } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderType } from './dto/order.type';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import { UserRole } from '../users/schemas/user.schema';
import { getErrorMessage } from '../../common/utils/error.util';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver()
export class OrdersResolver {
  private readonly logger = new Logger(OrdersResolver.name);

  constructor(private ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [OrderType])
  async myOrders(@CurrentUser() user: any) {
    this.logger.log(`Fetching orders for user: ${user._id}`);
    try {
      return this.ordersService.findByUser(user._id.toString());
    } catch (error) {
      this.logger.error(`Failed to fetch orders: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Query(() => [OrderType])
  async allOrders() {
    this.logger.log('Admin fetching all orders');
    try {
      return this.ordersService.findAll();
    } catch (error) {
      this.logger.error(
        `Failed to fetch all orders: ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => OrderType)
  async order(@Args('id', { type: () => ID }) id: string) {
    this.logger.log(`Fetching order: ${id}`);
    try {
      return this.ordersService.findById(id);
    } catch (error) {
      this.logger.error(`Failed to fetch order: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => OrderType)
  async createOrder(
    @Args('input') input: CreateOrderInput,
    @CurrentUser() user: any,
  ) {
    this.logger.log(`Creating order for user: ${user._id}`);
    try {
      return this.ordersService.create(input, user._id.toString());
    } catch (error) {
      this.logger.error(`Failed to create order: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => OrderType)
  async updateOrderStatus(@Args('input') input: UpdateOrderInput) {
    this.logger.log(`Updating order status: ${input._id}`);
    try {
      return this.ordersService.updateStatus(input);
    } catch (error) {
      this.logger.error(
        `Failed to update order status: ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }
}
