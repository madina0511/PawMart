import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  ObjectType,
  Field,
  ID,
  Float,
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

registerEnumType(PetSpecies, { name: 'PetSpecies' });

@Schema({ timestamps: true })
@ObjectType()
export class Pet {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @Field(() => ID)
  userId: Types.ObjectId;

  @Prop({ required: true })
  @Field()
  name: string;

  @Prop({ required: true, enum: PetSpecies })
  @Field()
  species: string;

  @Prop()
  @Field({ nullable: true })
  breed?: string;

  @Prop()
  @Field(() => Float, { nullable: true })
  age?: number;

  @Prop()
  @Field(() => Float, { nullable: true })
  weight?: number;

  @Prop()
  @Field({ nullable: true })
  healthNotes?: string;

  @Prop()
  @Field({ nullable: true })
  avatar?: string;
}

export const PetSchema = SchemaFactory.createForClass(Pet);
