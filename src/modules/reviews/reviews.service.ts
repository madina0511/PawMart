import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './review.schema';
import { Product } from '../products/schemas/product.schema';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { getErrorMessage } from '../../common/utils/error.util';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);

  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Product.name) private productModel: Model<any>,
  ) {}

  async create(userId: string, input: CreateReviewInput): Promise<Review> {
    try {
      const review = new this.reviewModel({
        ...input,
        userId: new Types.ObjectId(userId),
        productId: new Types.ObjectId(input.productId),
      });
      await review.save();
      await this.updateProductRating(input.productId);
      return review;
    } catch (error) {
      this.logger.error(`create: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async update(
    id: string,
    userId: string,
    userRole: string,
    input: UpdateReviewInput,
  ): Promise<Review> {
    try {
      const review = await this.reviewModel.findById(id);
      if (!review) throw new NotFoundException('Review not found');

      // Faqat o'zi yoki admin edit qila oladi
      if (review.userId.toString() !== userId && userRole !== 'ADMIN') {
        throw new ForbiddenException('You can only edit your own reviews');
      }

      const updated = await this.reviewModel.findByIdAndUpdate(id, input, {
        new: true,
      });
      await this.updateProductRating(review.productId.toString());
      return updated;
    } catch (error) {
      this.logger.error(`update: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async delete(id: string, userId: string, userRole: string): Promise<boolean> {
    try {
      const review = await this.reviewModel.findById(id);
      if (!review) throw new NotFoundException('Review not found');

      // Faqat o'zi yoki admin o'chira oladi
      if (review.userId.toString() !== userId && userRole !== 'ADMIN') {
        throw new ForbiddenException('You can only delete your own reviews');
      }

      await this.reviewModel.findByIdAndDelete(id);
      await this.updateProductRating(review.productId.toString());
      return true;
    } catch (error) {
      this.logger.error(`delete: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async findByProduct(productId: string): Promise<Review[]> {
    try {
      return await this.reviewModel
        .find({ productId: new Types.ObjectId(productId) })
        .sort({ createdAt: -1 });
    } catch (error) {
      this.logger.error(`findByProduct: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async findByUser(userId: string): Promise<Review[]> {
    try {
      return await this.reviewModel
        .find({ userId: new Types.ObjectId(userId) })
        .sort({ createdAt: -1 });
    } catch (error) {
      this.logger.error(`findByUser: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  private async updateProductRating(productId: string): Promise<void> {
    try {
      const reviews = await this.reviewModel.find({
        productId: new Types.ObjectId(productId),
      });
      const count = reviews.length;
      const avg =
        count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;

      await this.productModel.findByIdAndUpdate(productId, {
        rating: Math.round(avg * 10) / 10,
        reviewCount: count,
      });
    } catch (error) {
      this.logger.error(`updateProductRating: ${getErrorMessage(error)}`);
    }
  }
}
