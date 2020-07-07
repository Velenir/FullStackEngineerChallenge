import Link from 'next/link';
import Layout from 'components/Layout';
import { AddOrEditUserForm, AddUserData } from 'components/AddUserForm';
import { useAuth } from 'client/utils/useAuth';
import {
  useAddUserMutation,
  UsersDocument,
  UsersQuery,
} from 'generated/graphql';
import { useRouter } from 'next/router';

const AddUsers = () => {
  const { isAdmin, loading, error } = useAuth();

  const [addUser, { error: gqlError }] = useAddUserMutation();

  const router = useRouter();

  if (error) return <p>{error.message}</p>;

  if (loading) return null;

  if (!isAdmin) return <p>Access denied</p>;

  const onSubmit = async (data: AddUserData) => {
    console.log('AddUserData', data);

    await addUser({
      variables: { newUser: data },
      update: (cache, { data }) => {
        if (!data) return;

        cache.writeQuery<UsersQuery>({
          query: UsersDocument,
          data: {
            users: data.addUser,
          },
        });
      },
    });

    router.push('/admin/users');
  };

  return (
    <Layout title="AddUsers">
      <h1>Add Users</h1>
      <p>This is the Add Users page</p>
      <p>
        <Link href="/">
          <a>Go home</a>
        </Link>
      </p>
      <div>
        <AddOrEditUserForm onSubmit={onSubmit}>
          {gqlError && <p>{gqlError.message}</p>}
        </AddOrEditUserForm>
      </div>
    </Layout>
  );
};

export default AddUsers;
