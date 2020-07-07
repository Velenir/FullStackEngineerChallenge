import Layout from 'components/Layout';
import {
  useOneUserQuery,
  useDeleteUserMutation,
  UsersQuery,
  UsersDocument,
  useUpdateUserMutation,
  OneUserQuery,
  OneUserDocument,
} from 'generated/graphql';
import { useRouter } from 'next/router';
import { Profile } from 'components/Profile';
import { useState } from 'react';
import { USER_ROLE } from 'server/consts';
import { AddOrEditUserForm, AddUserData } from 'components/AddUserForm';

const UserDetailsPage = () => {
  const { query } = useRouter();

  const userId = +query.id!;

  const { data } = useOneUserQuery({ variables: { userId } });
  const [deleteUser, { error: gqlDeleteError }] = useDeleteUserMutation();

  const [updateUser, { error: gqlUpdateError }] = useUpdateUserMutation();

  const [editing, setEditing] = useState(false);

  const router = useRouter();

  if (!data?.user) return null;

  const { user } = data;

  const title = `${user.firstName} ${user.lastName} details`;

  const onEditUser = () => setEditing((ed) => !ed);
  const onDeleteUser = async () => {
    await deleteUser({
      variables: { userId },
      update: (cache, { data }) => {
        if (!data) return;

        cache.writeQuery<UsersQuery>({
          query: UsersDocument,
          data: {
            users: data.deleteUser,
          },
        });
      },
    });

    router.push('/admin/users');
  };

  const onUpdateUser = async (data: AddUserData) => {
    const updatedUser = { ...data, user_id: userId };

    await updateUser({
      variables: { updatedUser },
      update: (cache, { data }) => {
        console.log('updatedUser', data);
        if (!data) return;

        const currentUpdatedUser = data.updateUser.find(
          (user) => user.id === userId
        );
        console.log('currentUpdatedUser', currentUpdatedUser);

        cache.writeQuery<UsersQuery>({
          query: UsersDocument,
          data: {
            users: data.updateUser,
          },
        });

        cache.writeQuery<OneUserQuery>({
          query: OneUserDocument,
          data: {
            user: currentUpdatedUser,
          },
        });
      },
    });

    setEditing(false);
  };

  return (
    <Layout title={title}>
      <div>
        <Profile user={user} />
        {user.role !== USER_ROLE.ADMIN && (
          <>
            <button onClick={onEditUser}>
              {editing ? 'Cancel Editing' : 'Edit'} User
            </button>
            <button onClick={onDeleteUser}>Delete User</button>
            {gqlDeleteError && <p>{gqlDeleteError.message}</p>}
          </>
        )}
        {editing && (
          <AddOrEditUserForm
            defaultValues={user}
            onSubmit={onUpdateUser}
            isAdding={false}
          >
            {gqlUpdateError && <p>{gqlUpdateError.message}</p>}
          </AddOrEditUserForm>
        )}
      </div>
    </Layout>
  );
};

export default UserDetailsPage;
