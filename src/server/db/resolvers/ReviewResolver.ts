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

// GQL InputType
@InputType()
class AddReviewRequest {
  @Field(() => Int)
  reviewer_id: number;

  @Field(() => Int)
  reviewee_id: number;
}

// GQL InputType
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
  @UseMiddleware(isAuth, isRole(USER_ROLE.ADMIN)) // only admins
  async reviews(): Promise<Review[]> {
    const reviews = await Review.find();
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
  @UseMiddleware(isAuth)
  async review(
    @Arg('reviewId', () => Int) reviewId: number,
    @Ctx() ctx: GQLContext
  ): Promise<Review | null> {
    const review = await Review.findOne(reviewId);

    if (!review) return null;

    const { userId } = ctx.payload!;

    if (
      // only allow to see reviews for this user
      (review.reviewee.id === userId && review.completed) || // where he was reviewed
      review.reviewer.id === userId // that he needs to/ already reviewed
    )
      return review;

    throw new Error('Access denied');
  }

  @Mutation(() => [Review])
  @UseMiddleware(isAuth, isRole(USER_ROLE.ADMIN))
  async deleteReview(
    @Arg('reviewId', () => Int) reviewId: number
  ): Promise<Review[]> {
    await Review.delete(reviewId);

    return Review.find();
  }

  @Mutation(() => [Review])
  @UseMiddleware(isAuth, isRole(USER_ROLE.ADMIN))
  async requestReview(
    @Arg('newReview') newReview: AddReviewRequest
  ): Promise<Review[]> {
    // check that we don't allow same user for reviewee and reviewer
    if (newReview.reviewee_id === newReview.reviewer_id) {
      throw new Error("User can't review themselves");
    }

    // would normally Promise.all, but this reads better
    const reviewee = await User.findOneOrFail(newReview.reviewee_id);
    const reviewer = await User.findOneOrFail(newReview.reviewer_id);

    const previousReview = await Review.findOne({
      where: { reviewee, reviewer },
    });

    // no next review while one is already pending
    if (previousReview && !previousReview.completed) {
      throw new Error("There's already an ongoing review");
    }

    const review = new Review();
    review.reviewee = reviewee;
    review.reviewer = reviewer;

    await review.save();

    // return all reviews to easier update frontend
    const reviews = await Review.find();

    return reviews;
  }

  @Mutation(() => [Review])
  @UseMiddleware(isAuth) // only logge-n users allowed
  async completeReview(
    @Arg('review') completedReview: CompleteReview,
    @Ctx() ctx: GQLContext
  ): Promise<Review[]> {
    const { text, review_id } = completedReview;

    const review = await Review.findOneOrFail(review_id);

    // shouldn't happen with our frontend
    // but check anyway that doing assigned reviews
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
