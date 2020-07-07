import Link from 'next/link';

import Layout from 'components/Layout';

const AdminPage = () => {
  return (
    <Layout title="Users List">
      <h1>Admin Page</h1>
      <p>
        <Link href="/admin/users">
          <a>View users</a>
        </Link>
        <Link href="/admin/add_user">
          <a>Add an employee</a>
        </Link>
        <Link href="/admin/reviews">
          <a>View reviews</a>
        </Link>
        <Link href="/admin/request_review">
          <a>Request a review</a>
        </Link>
      </p>
      <style jsx>{`
        p > a {
          padding: 1em;
        }
      `}</style>
    </Layout>
  );
};

export default AdminPage;
