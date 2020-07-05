import Link from 'next/link'
import Layout from '../components/Layout'
import { useLoginMutation, MeQuery, MeDocument } from '../generated/graphql'
import { LoginForm, LoginData } from '../components/LoginForm'
import { setAccessToken } from 'client/utils/accessToken'

const Login = () => {

  const [loginUser, { data, loading, error }] = useLoginMutation()

  const onSubmit = async (data: LoginData) => {
    console.log(data)

    const response = await loginUser({
      variables: data,
      update: (cache, { data }) => {
        if (!data) return

        cache.writeQuery<MeQuery>({
          query: MeDocument,
          data: {
            me: data.login.user,
          }
        })
      }
    })
    console.log('response', response.data);
    if (response && response.data) {

      setAccessToken(response.data?.login.accessToken)
    }
  }


  return (
    <Layout title="Login">
      <h1>Login</h1>
      <p>This is the Login page</p>
      <p>
        <Link href="/">
          <a>Go home</a>
        </Link>
      </p>
      <div>
        <LoginForm onSubmit={onSubmit}>
          {error && <p>{error.message}</p>}
        </LoginForm>
      </div>
    </Layout>
  )
}

export default Login
