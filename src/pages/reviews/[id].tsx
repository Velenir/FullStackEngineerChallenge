import Layout from 'components/Layout';
import {
  useOneReviewQuery,
  useCompleteReviewMutation,
  MyReviewsQuery,
  MyReviewsDocument,
} from 'generated/graphql';
import { useRouter } from 'next/router';
import { Review } from 'components/Review';
import { SubmitReview, SubmitReviewData } from 'components/SubmitReviewForm';

const ReviewDetailsPage = () => {
  const { query } = useRouter();

  const reviewId = +query.id!;

  const { data, error } = useOneReviewQuery({ variables: { reviewId } });
  const [
    completeReview,
    { error: gqlDeleteError },
  ] = useCompleteReviewMutation();

  const router = useRouter();

  if (error) return <p>{error.message}</p>;

  if (!data?.review) return null;

  const { review } = data;
  const { reviewee, reviewer } = review;

  const title = `Review for ${reviewee.firstName} ${reviewee.lastName} by ${reviewer.firstName} ${reviewer.lastName}`;

  const onCompleteReview = async (data: SubmitReviewData) => {
    if (review.completed) return;

    const { errors } = await completeReview({
      variables: { review: { review_id: reviewId, text: data.text } },
      update: (cache, { data }) => {
        if (!data) return;

        cache.writeQuery<MyReviewsQuery>({
          query: MyReviewsDocument,
          data: {
            myReviews: data.completeReview,
          },
        });
      },
    });

    if (!errors) router.push('/reviews');
  };

  return (
    <Layout title={title}>
      <div>
        <Review review={review} />
        {!review.completed && (
          <SubmitReview onSubmit={onCompleteReview}>
            {gqlDeleteError && <p>{gqlDeleteError.message}</p>}
          </SubmitReview>
        )}
      </div>
    </Layout>
  );
};

export default ReviewDetailsPage;
