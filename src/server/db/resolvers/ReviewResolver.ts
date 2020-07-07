import {
  Resolver,
  Query,
  Mutation,
  InputType,
  Field,
  Arg,
  Int,
  UseMiddleware,
  Ctx,
} from 'type-graphql';
import { User, Review } from '../entity';
import { isAuth } from '../middlewares/isAuth';
import { GQLContext } from 'server/types';
import { isRole } from '../middlewares/isRole';
import { USER_ROLE } from 'server/consts';

@InputType()
class AddReviewRequest {
  @Field(() => Int)
  reviewer_id: number;

  @Field(() => Int)
  reviewee_id: number;
}

@InputType()
class CompleteReview {
  @Field()
  text: string;

  @Field(() => Int)
  review_id: number;
}

@Resolver()
export class ReviewResolver {
  @Query(() => [Review])
  @UseMiddleware(isAuth, isRole(USER_ROLE.ADMIN))
  async reviews(): Promise<Review[]> {
    const reviews = await Review.find();
    console.log('reviews', reviews);
    return reviews;
  }

  @Query(() => [Review])
  @UseMiddleware(isAuth)
  async myReviews(@Ctx() ctx: GQLContext): Promise<Review[]> {
    const { userId } = ctx.payload!;

    // my reviews and completed reviews of me
    return Review.find({
      where: [{ reviewee: userId, completed: true }, { reviewer: userId }],
    });
  }

  @Query(() => Review, { nullable: true })
  @UseMiddleware(isAuth, isRole(USER_ROLE.ADMIN))
  async review(
    @Arg('reviewId', () => Int) reviewId: number
  ): Promise<Review | null> {
    return (await Review.findOne(reviewId)) || null;
  }

  @Mutation(() => [Review])
  @UseMiddleware(isAuth, isRole(USER_ROLE.ADMIN))
  async deleteReview(
    @Arg('reviewId', () => Int) reviewId: number
  ): Promise<Review[]> {
    console.log('ReviewResolver::deleteReview', reviewId);

    await Review.delete(reviewId);

    return Review.find();
  }

  @Mutation(() => [Review])
  @UseMiddleware(isAuth, isRole(USER_ROLE.ADMIN))
  async requestReview(
    @Arg('newReview') newReview: AddReviewRequest
  ): Promise<Review[]> {
    console.log('ReviewResolver::requestReview', newReview);

    if (newReview.reviewee_id === newReview.reviewer_id) {
      throw new Error("User can't review themselves");
    }

    const reviewee = await User.findOneOrFail(newReview.reviewee_id);
    const reviewer = await User.findOneOrFail(newReview.reviewer_id);

    const previousReview = await Review.findOne({
      where: { reviewee, reviewer },
    });

    if (previousReview && !previousReview.completed) {
      throw new Error("There's already an ongoing review");
    }

    const review = new Review();
    review.reviewee = reviewee;
    review.reviewer = reviewer;

    await review.save();

    const reviews = await Review.find();

    return reviews;
  }

  @Mutation(() => [Review])
  @UseMiddleware(isAuth)
  async completeReview(
    @Arg('review') completedReview: CompleteReview,
    @Ctx() ctx: GQLContext
  ): Promise<Review[]> {
    console.log('ReviewResolver::completeReview', completedReview);

    const { text, review_id } = completedReview;

    const review = await Review.findOneOrFail(review_id);

    if (review.reviewer.id !== ctx.payload?.userId) {
      throw new Error("UserId doesn't match reviewer_id");
    }

    if (review.completed) {
      throw new Error("Can't override a completed review");
    }

    review.text = text;
    review.completed = true;

    await review.save();

    const { userId } = ctx.payload;

    // my reviews and completed reviews of me
    return Review.find({
      where: [{ reviewee: userId, completed: true }, { reviewer: userId }],
    });
  }
}
