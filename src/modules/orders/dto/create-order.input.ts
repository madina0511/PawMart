import { Field, InputType, Int, Float, ID } from '@nestjs/graphql';

@InputType()
export class OrderItemInput {
  @Field(() => ID)
  productId: string;

  @Field(() => Int)
  quantity: number;
}

@InputType()
export class ShippingAddressInput {
  @Field()
  name: string;

  @Field()
  address: string;

  @Field()
  phone: string;
}

@InputType()
export class CreateOrderInput {
  @Field(() => [OrderItemInput])
  items: OrderItemInput[];

  @Field(() => ShippingAddressInput)
  shippingAddress: ShippingAddressInput;
}
