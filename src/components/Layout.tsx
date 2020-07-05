import React, { ReactNode } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useMeQuery, useLogoutMutation } from '../generated/graphql'
import { setAccessToken } from 'client/utils/accessToken'

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = 'This is the default title' }: Props) => {

  const { data, error, loading } = useMeQuery()
  const [logout, { client }] = useLogoutMutation()

  const onLogout = async () => {
    await logout()
    setAccessToken('')

    client?.resetStore()
  }

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        {data?.me && <p>Logged in as {data.me.email}</p>}
        {data?.me && <button type="button" onClick={onLogout}>Logout</button>}
        <nav>
          <Link href="/">
            <a>Home</a>
          </Link>{' '}
          |{' '}
          <Link href="/about">
            <a>About</a>
          </Link>{' '}
          |{' '}<Link href="/login">
            <a>Login</a>
          </Link>{' '}
          |{' '}<Link href="/register">
            <a>Register</a>
          </Link>{' '}
          |{' '}<Link href="/bye">
            <a>Bye</a>
          </Link>
          |{' '}
          <Link href="/users">
            <a>Users List</a>
          </Link>{' '}
          | <a href="/api/users">Users API</a>
        </nav>
      </header>
      {children}
      <footer>
        <hr />
        <span>I'm here to stay (Footer)</span>
      </footer>
    </div>
  )
}

export default Layout
