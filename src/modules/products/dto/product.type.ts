import {
  Field,
  ID,
  ObjectType,
  Float,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
import { ProductCategory, PetType } from '../schemas/product.schema';

registerEnumType(ProductCategory, { name: 'ProductCategory' });
registerEnumType(PetType, { name: 'PetType' });

@ObjectType()
export class ProductType {
  @Field(() => ID)
  _id: string;

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

  @Field(() => [String])
  images: string[];

  @Field({ nullable: true })
  brand?: string;

  @Field(() => [String])
  tags: string[];

  @Field(() => Float)
  rating: number;

  @Field(() => Int)
  reviewCount: number;
}
