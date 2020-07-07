import Layout from 'components/Layout';
import {
  useDeleteReviewMutation,
  useOneReviewQuery,
  ReviewQuery,
  useRequestReviewMutation,
  ReviewDocument,
} from 'generated/graphql';
import { useRouter } from 'next/router';
import { Review } from 'components/Review';

const ReviewDetailsPage = () => {
  const { query } = useRouter();

  const reviewId = +query.id!;

  const { data, error } = useOneReviewQuery({ variables: { reviewId } });
  const [deleteReview, { error: gqlDeleteError }] = useDeleteReviewMutation();

  const [
    requestReview,
    { error: gqlRequestError },
  ] = useRequestReviewMutation();

  const router = useRouter();

  if (!data?.review) return null;

  const { review } = data;
  const { reviewee, reviewer } = review;

  const title = `Review for ${reviewee.firstName} ${reviewee.lastName} by ${reviewer.firstName} ${reviewer.lastName} details`;

  const onDeleteReview = async () => {
    await deleteReview({
      variables: { reviewId },
      update: (cache, { data }) => {
        if (!data) return;

        cache.writeQuery<ReviewQuery>({
          query: ReviewDocument,
          data: {
            reviews: data.deleteReview,
          },
        });
      },
    });

    router.push('/admin/reviews');
  };

  const onRequestAgain = async () => {
    if (!review.completed) return;

    await requestReview({
      variables: {
        newReview: { reviewee_id: reviewee.id, reviewer_id: reviewer.id },
      },
      update: (cache, { data }) => {
        if (!data) return;

        cache.writeQuery<ReviewQuery>({
          query: ReviewDocument,
          data: {
            reviews: data.requestReview,
          },
        });
      },
    });

    router.push('/admin/reviews');
  };

  return (
    <Layout title={title}>
      <div>
        <Review review={review} />
        {review.completed && (
          <button onClick={onRequestAgain}>Request again</button>
        )}
        {gqlRequestError && <p>{gqlRequestError.message}</p>}
        <button onClick={onDeleteReview}>Delete review</button>
        {gqlDeleteError && <p>{gqlDeleteError.message}</p>}
        {error && <p>{error.message}</p>}
      </div>
    </Layout>
  );
};

export default ReviewDetailsPage;
