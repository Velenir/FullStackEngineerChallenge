import Link from 'next/link'
import Layout from '../components/Layout'
import { useAddUserMutation, UsersQuery, UsersDocument } from '../generated/graphql'
import { AddUserForm, AddUserData } from '../components/AddUserForm'
import { useAuth } from 'client/utils/useAuth'


const AddUsers = () => {

  const {isAdmin, loading, error} = useAuth()

  const [addUser] = useAddUserMutation()

  if (error) return (
    <p>{error.message}</p>
  )

  if (loading) return null

  if (!isAdmin) return <p>Access denied</p>

  const onSubmit = async (data: AddUserData) => {
    console.log('AddUserData', data)

    await addUser({
      variables: { newUser: data },
      update: (cache, { data }) => {
        if (!data) return

        cache.writeQuery<UsersQuery>({
          query: UsersDocument,
          data: {
            users: data.addUser,
          }
        })
      }
    })
  }


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
        <AddUserForm onSubmit={onSubmit}>
          {error && <p>{error.message}</p>}
        </AddUserForm>
      </div>
    </Layout>
  )
}

export default AddUsers
