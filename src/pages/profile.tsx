import { useMeQuery } from 'generated/graphql';
import { Profile } from 'components/Profile';
import Layout from 'components/Layout';
// import { USER_ROLE } from "server/consts"

const ProfilePage = () => {
  const { data } = useMeQuery();

  if (!data?.me) return null;

  const { me } = data;

  // const isAdmin = me.role === USER_ROLE.ADMIN

  return (
    <Layout title="Profile">
      <div>
        <Profile user={me} />
      </div>
    </Layout>
  );
};

export default ProfilePage;
