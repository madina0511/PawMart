import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  ObjectType,
  Field,
  ID,
  Float,
  Int,
  registerEnumType,
} from '@nestjs/graphql';

export type PetDocument = Pet & Document;

export enum PetSpecies {
  DOG = 'DOG',
  CAT = 'CAT',
  BIRD = 'BIRD',
  FISH = 'FISH',
  RABBIT = 'RABBIT',
  OTHER = 'OTHER',
}

export enum PetStatus {
  AVAILABLE = 'AVAILABLE',
  SOLD = 'SOLD',
  RESERVED = 'RESERVED',
}

registerEnumType(PetSpecies, { name: 'PetSpecies' });
registerEnumType(PetStatus, { name: 'PetStatus' });

@Schema({ timestamps: true })
@ObjectType()
export class Pet {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Prop({ required: true })
  @Field()
  name: string;

  @Prop({ required: true, enum: PetSpecies })
  @Field(() => PetSpecies)
  species: PetSpecies;

  @Prop()
  @Field({ nullable: true })
  breed?: string;

  @Prop()
  @Field(() => Float, { nullable: true })
  age?: number;

  @Prop()
  @Field(() => Float, { nullable: true })
  weight?: number;

  @Prop({ required: true })
  @Field(() => Float)
  price: number;

  @Prop({ type: [String], default: [] })
  @Field(() => [String])
  images: string[];

  @Prop()
  @Field({ nullable: true })
  description?: string;

  @Prop({ required: true, enum: PetStatus, default: PetStatus.AVAILABLE })
  @Field(() => PetStatus)
  status: PetStatus;

  @Prop()
  @Field({ nullable: true })
  color?: string;

  @Prop()
  @Field(() => Boolean, { nullable: true })
  vaccinated?: boolean;

  @Prop()
  @Field(() => Boolean, { nullable: true })
  neutered?: boolean;
}

export const PetSchema = SchemaFactory.createForClass(Pet);
