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

  @Mutation(() => [Review])
  @UseMiddleware(isAuth, isRole(USER_ROLE.ADMIN))
  async requestReview(
    @Arg('newReview') newReview: AddReviewRequest
  ): Promise<Review[]> {
    console.log('ReviewResolver::requestReview', newReview);

    const review = new Review();
    review.reviewee = await User.findOneOrFail(newReview.reviewee_id);
    review.reviewer = await User.findOneOrFail(newReview.reviewer_id);

    await review.save();
    console.log('review', review);

    const reviews = await Review.find({
      where: { reviewee: newReview.reviewee_id },
    });
    console.log('reviews', reviews);

    return reviews;
  }

  @Mutation(() => Review)
  @UseMiddleware(isAuth)
  async completeReview(
    @Arg('review') completedReview: CompleteReview,
    @Ctx() ctx: GQLContext
  ): Promise<Review> {
    console.log('ReviewResolver::completeReview', completedReview);

    const { text, review_id } = completedReview;

    const review = await Review.findOneOrFail(review_id);

    if (review.reviewer.id !== ctx.payload?.userId) {
      throw new Error("UserId doesn't match reviewer_id");
    }

    review.text = text;
    review.completed = true;

    await review.save();

    return review;
  }
}
