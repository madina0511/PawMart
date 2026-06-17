import {
  Field,
  ID,
  ObjectType,
  Float,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
import { OrderStatus } from '../schemas/order.schema';

registerEnumType(OrderStatus, { name: 'OrderStatus' });

@ObjectType()
export class OrderItemType {
  @Field(() => ID)
  productId: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;
}

@ObjectType()
export class ShippingAddressType {
  @Field()
  name: string;

  @Field()
  address: string;

  @Field()
  phone: string;
}

@ObjectType()
export class OrderType {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  userId: string;

  @Field(() => [OrderItemType])
  items: OrderItemType[];

  @Field(() => Float)
  totalAmount: number;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field({ nullable: true })
  paymentId?: string;

  @Field(() => ShippingAddressType)
  shippingAddress: ShippingAddressType;
}
