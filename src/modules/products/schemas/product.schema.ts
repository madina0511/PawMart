import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document & { _id: Types.ObjectId };

export enum ProductCategory {
  FOOD = 'FOOD',
  TOY = 'TOY',
  CARE = 'CARE',
  MEDICINE = 'MEDICINE',
  ACCESSORY = 'ACCESSORY',
}

export enum PetType {
  DOG = 'DOG',
  CAT = 'CAT',
  FISH = 'FISH',
  BIRD = 'BIRD',
  OTHER = 'OTHER',
}

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: String, enum: ProductCategory, required: true })
  category: ProductCategory;

  @Prop({ type: [String], enum: PetType, required: true })
  petType: PetType[];

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, default: 0 })
  stock: number;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop()
  brand?: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  reviewCount: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
