import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
@ObjectType()
export class Review {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  @Field(() => ID)
  productId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @Field(() => ID)
  userId: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  @Field(() => Int)
  rating: number;

  @Prop({ required: true })
  @Field()
  comment: string;

  @Prop({ type: [String], default: [] })
  @Field(() => [String])
  images: string[];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
