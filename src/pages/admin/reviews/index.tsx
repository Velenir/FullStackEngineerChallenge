import Layout from 'components/Layout';
import List from 'components/List';
import { useReviewQuery } from 'generated/graphql';
import { ReviewListItem } from 'components/ListItem';
import { ReviewType } from 'client/types';
import { useMemo } from 'react';

interface ReviewsBatch {
  completedReviews: ReviewType[];
  pendingReviews: ReviewType[];
}

const ReviewsPage = () => {
  const { data } = useReviewQuery({ fetchPolicy: 'cache-first' });

  const { completedReviews, pendingReviews } = useMemo(() => {
    if (!data?.reviews) {
      return {
        completedReviews: [],
        pendingReviews: [],
      };
    }

    return data?.reviews.reduce<ReviewsBatch>(
      (accum, review) => {
        if (review.completed) {
          accum.completedReviews.push(review);
        } else {
          accum.pendingReviews.push(review);
        }
        return accum;
      },
      {
        completedReviews: [],
        pendingReviews: [],
      }
    );
  }, [data?.reviews]);

  if (!data?.reviews) return null;

  return (
    <Layout title="Users List">
      <h1>Reviews</h1>
      <h3>Completed:</h3>
      <List
        items={completedReviews}
        itemComponent={ReviewListItem}
        prefix="/admin"
      />
      <h3>Pending:</h3>
      <List
        items={pendingReviews}
        itemComponent={ReviewListItem}
        prefix="/admin"
      />
    </Layout>
  );
};

export default ReviewsPage;
