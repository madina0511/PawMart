import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductType } from './dto/product.type';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@Resolver()
export class ProductsResolver {
  constructor(private productsService: ProductsService) {}

  @Query(() => [ProductType])
  async products() {
    return this.productsService.findAll();
  }

  @Query(() => ProductType)
  async product(@Args('id', { type: () => ID }) id: string) {
    return this.productsService.findById(id);
  }

  @Query(() => [ProductType])
  async productsByCategory(@Args('category') category: string) {
    return this.productsService.findByCategory(category);
  }

  @Query(() => [ProductType])
  async productsByPetType(@Args('petType') petType: string) {
    return this.productsService.findByPetType(petType);
  }

  @Query(() => [ProductType])
  async searchProducts(@Args('query') query: string) {
    return this.productsService.search(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => ProductType)
  async createProduct(@Args('input') input: CreateProductInput) {
    return this.productsService.create(input);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => ProductType)
  async updateProduct(@Args('input') input: UpdateProductInput) {
    return this.productsService.update(input);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Boolean)
  async deleteProduct(@Args('id', { type: () => ID }) id: string) {
    return this.productsService.delete(id);
  }
}
