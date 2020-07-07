import { useMeQuery } from 'generated/graphql';
import { Profile } from 'components/Profile';
import Layout from 'components/Layout';
// import { USER_ROLE } from "server/consts"

const ProfilePage = () => {
  const { data, error } = useMeQuery({ fetchPolicy: 'cache-first' });

  if (error) return <p>{error.message}</p>;
  if (!data?.me) return <p>Login first</p>;

  const { me } = data;

  return (
    <Layout title="Profile">
      <div>
        <Profile user={me} />
      </div>
    </Layout>
  );
};

export default ProfilePage;
