import { Field, InputType, Float, Int } from '@nestjs/graphql';
import { ProductCategory, PetType } from '../schemas/product.schema';

@InputType()
export class CreateProductInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => ProductCategory)
  category: ProductCategory;

  @Field(() => [PetType])
  petType: PetType[];

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  stock: number;

  @Field(() => [String], { nullable: true })
  images?: string[];

  @Field({ nullable: true })
  brand?: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];
}
