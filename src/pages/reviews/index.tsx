import Link from 'next/link';
import Layout from 'components/Layout';
import List from 'components/List';
import { useMyReviewsQuery, MyReviewsQuery } from 'generated/graphql';
import { ReviewListItem } from 'components/ListItem';
import { useAuth } from 'client/utils/useAuth';
import { useMemo } from 'react';
import { DataTypeFromQuery } from 'client/types';

type reviewType = DataTypeFromQuery<MyReviewsQuery['myReviews']>[0];

interface ReviewsBatch {
  reviewsOfMe: reviewType[];
  myCompletedReviews: reviewType[];
  myPendingReviews: reviewType[];
}

const ReviewsPage = () => {
  const { data } = useMyReviewsQuery({ fetchPolicy: 'cache-first' });

  const { user } = useAuth();

  const { reviewsOfMe, myCompletedReviews, myPendingReviews } = useMemo(() => {
    if (!data?.myReviews || !user) {
      return {
        reviewsOfMe: [],
        myCompletedReviews: [],
        myPendingReviews: [],
      };
    }

    const userId = user.id;

    return data?.myReviews.reduce<ReviewsBatch>(
      (accum, review) => {
        if (review.reviewee.id === userId) {
          accum.reviewsOfMe.push(review);
        } else {
          if (review.completed) {
            accum.myCompletedReviews.push(review);
          } else {
            accum.myPendingReviews.push(review);
          }
        }

        return accum;
      },
      {
        reviewsOfMe: [],
        myCompletedReviews: [],
        myPendingReviews: [],
      }
    );
  }, [data?.myReviews]);

  if (!data?.myReviews) return null;

  return (
    <Layout title="Users List">
      <h1>Reviews</h1>
      <h4>Pending reviews</h4>
      <List items={myPendingReviews} itemComponent={ReviewListItem} />
      <h4>Completed reviews</h4>
      <List items={myCompletedReviews} itemComponent={ReviewListItem} />
      <h4>Completed reviews of me</h4>
      <List items={reviewsOfMe} itemComponent={ReviewListItem} />
      <p>
        <Link href="/">
          <a>Go home</a>
        </Link>
      </p>
    </Layout>
  );
};

export default ReviewsPage;
