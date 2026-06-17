import { Field, InputType, ID } from '@nestjs/graphql';
import { OrderStatus } from '../schemas/order.schema';

@InputType()
export class UpdateOrderInput {
  @Field(() => ID)
  _id: string;

  @Field(() => OrderStatus)
  status: OrderStatus;
}
