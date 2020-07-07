import Link from 'next/link';
import Layout from 'components/Layout';
import List from 'components/List';
import { useReviewQuery } from 'generated/graphql';
import { ReviewListItem } from 'components/ListItem';

const ReviewsPage = () => {
  const { data } = useReviewQuery({ fetchPolicy: 'cache-first' });

  if (!data?.reviews) return null;

  return (
    <Layout title="Users List">
      <h1>Reviews</h1>
      <List
        items={data.reviews}
        itemComponent={ReviewListItem}
        prefix="/admin"
      />
      <p>
        <Link href="/">
          <a>Go home</a>
        </Link>
        <Link href="/admin/request_review">
          <a>Request a review</a>
        </Link>
      </p>
    </Layout>
  );
};

export default ReviewsPage;
