import Layout from '../components/Layout';
import { useLoginMutation, MeQuery, MeDocument } from '../generated/graphql';
import { LoginForm, LoginData } from '../components/LoginForm';
import { setAccessToken } from 'client/utils/accessToken';
import { useRouter } from 'next/router';

const Login = () => {
  const [loginUser, { error }] = useLoginMutation();

  const router = useRouter();

  const onSubmit = async (data: LoginData) => {
    const response = await loginUser({
      variables: data,
      update: (cache, { data }) => {
        if (!data) return;

        cache.writeQuery<MeQuery>({
          query: MeDocument,
          data: {
            me: data.login.user,
          },
        });
      },
    });
    if (response && response.data) {
      setAccessToken(response.data?.login.accessToken);

      router.push('/');
    }
  };

  return (
    <Layout title="Login">
      <h1>Login</h1>
      <p>This is the Login page</p>
      <div>
        <LoginForm onSubmit={onSubmit}>
          {error && <p>{error.message}</p>}
        </LoginForm>
      </div>
    </Layout>
  );
};

export default Login;
