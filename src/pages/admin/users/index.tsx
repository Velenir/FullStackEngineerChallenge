import Link from 'next/link';

import Layout from 'components/Layout';
import List from 'components/List';
import { useUsersQuery, UsersQuery } from 'generated/graphql';
import { UserListItem } from 'components/ListItem';
import { DataTypeFromQuery } from 'client/types';

type UsersList = DataTypeFromQuery<UsersQuery['users'][0]>[];

const UsersPage = () => {
  const { data } = useUsersQuery();

  if (!data?.users) return null;

  return (
    <Layout title="Users List">
      <h1>Users List</h1>
      <List<UsersList>
        items={data.users}
        itemComponent={UserListItem}
        prefix="/admin"
      />
      <p>
        <Link href="/admin/add_user">
          <a>Add an employee</a>
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

export default UsersPage;
