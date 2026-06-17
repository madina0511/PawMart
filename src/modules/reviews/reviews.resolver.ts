import { Resolver, Mutation, Query, Args, ID } from '@nestjs/graphql';
import { Logger, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Review } from './review.schema';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => Review)
export class ReviewsResolver {
  private readonly logger = new Logger(ReviewsResolver.name);

  constructor(private readonly reviewsService: ReviewsService) {}

  @Mutation(() => Review)
  @UseGuards(JwtAuthGuard)
  async createReview(
    @CurrentUser() user: any,
    @Args('createReviewInput') input: CreateReviewInput,
  ): Promise<Review> {
    this.logger.log(`createReview by user: ${user._id}`);
    return this.reviewsService.create(user._id.toString(), input);
  }

  @Mutation(() => Review)
  @UseGuards(JwtAuthGuard)
  async updateReview(
    @CurrentUser() user: any,
    @Args('id', { type: () => ID }) id: string,
    @Args('updateReviewInput') input: UpdateReviewInput,
  ): Promise<Review> {
    this.logger.log(`updateReview: ${id} by user: ${user._id}`);
    return this.reviewsService.update(
      id,
      user._id.toString(),
      user.role,
      input,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteReview(
    @CurrentUser() user: any,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    this.logger.log(`deleteReview: ${id} by user: ${user._id}`);
    return this.reviewsService.delete(id, user._id.toString(), user.role);
  }

  @Query(() => [Review])
  async reviewsByProduct(
    @Args('productId', { type: () => ID }) productId: string,
  ): Promise<Review[]> {
    return this.reviewsService.findByProduct(productId);
  }

  @Query(() => [Review])
  @UseGuards(JwtAuthGuard)
  async myReviews(@CurrentUser() user: any): Promise<Review[]> {
    return this.reviewsService.findByUser(user._id.toString());
  }
}
