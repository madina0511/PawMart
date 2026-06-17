import { Field, InputType, Float, Int, ID } from '@nestjs/graphql';
import { ProductCategory, PetType } from '../schemas/product.schema';

@InputType()
export class UpdateProductInput {
  @Field(() => ID)
  _id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => ProductCategory, { nullable: true })
  category?: ProductCategory;

  @Field(() => [PetType], { nullable: true })
  petType?: PetType[];

  @Field(() => Float, { nullable: true })
  price?: number;

  @Field(() => Int, { nullable: true })
  stock?: number;

  @Field(() => [String], { nullable: true })
  images?: string[];

  @Field({ nullable: true })
  brand?: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];
}
