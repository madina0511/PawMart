import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { registerEnumType } from '@nestjs/graphql';

export type PaymentDocument = Payment & Document;

export enum PaymentStatus {
  PENDING = 'PENDING',
  DONE = 'DONE',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
}

registerEnumType(PaymentStatus, { name: 'PaymentStatus' });

@Schema({ timestamps: true })
@ObjectType()
export class Payment {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  @Field(() => ID)
  orderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @Field(() => ID)
  userId: Types.ObjectId;

  @Prop({ required: true })
  @Field()
  paymentKey: string;

  @Prop({ required: true })
  @Field()
  orderId_toss: string;

  @Prop({ required: true })
  @Field(() => Float)
  amount: number;

  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
  @Field()
  status: string;

  @Prop()
  @Field({ nullable: true })
  method?: string;

  @Prop()
  @Field({ nullable: true })
  failReason?: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
