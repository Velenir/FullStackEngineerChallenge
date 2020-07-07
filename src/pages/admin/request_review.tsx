import {
  useRequestReviewMutation,
  ReviewQuery,
  ReviewDocument,
} from 'generated/graphql';
import {
  RequestReviewForm,
  RequestReviewData,
} from 'components/RequestReviewForm';
import Layout from 'components/Layout';
import { useRouter } from 'next/router';

const RequestReviewPage = () => {
  const [requestReview, { error: gqlError }] = useRequestReviewMutation();

  const router = useRouter();

  const onRequestReview = async (data: RequestReviewData) => {
    const reviewee_id = +data.reviewee_id;
    const reviewer_id = +data.reviewer_id;
    await requestReview({
      variables: { newReview: { reviewee_id, reviewer_id } },
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
    <Layout title="AddUsers">
      <h1>Request Review</h1>
      <div>
        <RequestReviewForm onSubmit={onRequestReview}>
          {gqlError && <p>{gqlError.message}</p>}
        </RequestReviewForm>
      </div>
    </Layout>
  );
};

export default RequestReviewPage;
