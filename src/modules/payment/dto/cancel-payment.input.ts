import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CancelPaymentInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  paymentKey: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  cancelReason: string;
}
