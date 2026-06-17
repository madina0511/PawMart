import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { getErrorMessage } from '../../common/utils/error.util';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findAll() {
    this.logger.log('Fetching all products');
    try {
      return this.productModel.find().lean().exec();
    } catch (error) {
      this.logger.error(`Failed to fetch products: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async findById(id: string) {
    this.logger.log(`Fetching product: ${id}`);
    try {
      const product = await this.productModel.findById(id).lean();
      if (!product) throw new NotFoundException('Product not found');
      return product;
    } catch (error) {
      this.logger.error(`Failed to fetch product: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async findByCategory(category: string) {
    this.logger.log(`Fetching products by category: ${category}`);
    try {
      return this.productModel.find({ category }).lean().exec();
    } catch (error) {
      this.logger.error(
        `Failed to fetch by category: ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async findByPetType(petType: string) {
    this.logger.log(`Fetching products by petType: ${petType}`);
    try {
      return this.productModel.find({ petType }).lean().exec();
    } catch (error) {
      this.logger.error(
        `Failed to fetch by petType: ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async search(query: string) {
    this.logger.log(`Searching products: ${query}`);
    try {
      return this.productModel
        .find({
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { tags: { $in: [new RegExp(query, 'i')] } },
          ],
        })
        .lean()
        .exec();
    } catch (error) {
      this.logger.error(`Failed to search products: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async create(input: CreateProductInput) {
    this.logger.log(`Creating product: ${input.name}`);
    try {
      const product = await this.productModel.create(input);
      this.logger.log(`Product created: ${product._id}`);
      return product.toObject();
    } catch (error) {
      this.logger.error(`Failed to create product: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async update(input: UpdateProductInput) {
    this.logger.log(`Updating product: ${input._id}`);
    try {
      const { _id, ...data } = input;
      const product = await this.productModel
        .findByIdAndUpdate(_id, { $set: data }, { new: true })
        .lean();
      if (!product) throw new NotFoundException('Product not found');
      return product;
    } catch (error) {
      this.logger.error(`Failed to update product: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting product: ${id}`);
    try {
      const result = await this.productModel.findByIdAndDelete(id).lean();
      if (!result) throw new NotFoundException('Product not found');
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete product: ${getErrorMessage(error)}`);
      throw error;
    }
  }
}
