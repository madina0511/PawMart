import { InputType, Field, Float, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class ConfirmPaymentInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  paymentKey: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  orderId_toss: string;

  @Field(() => Float)
  @IsNumber()
  amount: number;

  @Field(() => ID)
  @IsNotEmpty()
  orderId: string;
}
