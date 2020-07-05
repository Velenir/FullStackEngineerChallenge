import {
  Resolver,
  Query,
  Mutation,
  InputType,
  Field,
  Arg,
  Int,
} from 'type-graphql';
import { User, Review } from '../entity';

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
  async reviews(): Promise<Review[]> {
    const reviews = await Review.find();
    console.log('reviews', reviews);
    return reviews;
  }

  @Mutation(() => [Review])
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
  async completeReview(
    @Arg('review') completedReview: CompleteReview
  ): Promise<Review> {
    console.log('ReviewResolver::completeReview', completedReview);

    const { text, review_id } = completedReview;

    // TODOD: get user from jwt/db
    // const rv = await Review.update({id: review_id, reviewee: userId}, {text, completed: true});

    const rv = await Review.findOneOrFail(review_id);
    console.log('rv', rv);

    rv.text = text;
    rv.completed = true;

    await rv.save();

    return rv;
  }
}
