import React, { ReactNode } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useMeQuery, useLogoutMutation } from '../generated/graphql';
import { setAccessToken } from 'client/utils/accessToken';
import { USER_ROLE } from 'server/consts';
import { useRouter } from 'next/router';

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = 'This is the default title' }: Props) => {
  const { data, error } = useMeQuery();
  const [logout, { client }] = useLogoutMutation();

  const router = useRouter()

  if (error) return <p>{error.message}</p>

  const onLogout = async () => {
    await logout();
    setAccessToken('');

    await client?.resetStore();
    router.push('/')
  };

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        {data?.me && <p>Logged in as {data.me.email}</p>}
        {data?.me && (
          <button type="button" onClick={onLogout}>
            Logout
          </button>
        )}
        <nav>
          <Link href="/">
            <a>Home</a>
          </Link>{' '}
          |{' '}
          <Link href="/about">
            <a>About</a>
          </Link>{' '}
          |{' '}
          <Link href="/login">
            <a>Login</a>
          </Link>{' '}
          |{' '}
          <Link href="/register">
            <a>Register</a>
          </Link>{' '}
          |{' '}
          <Link href="/bye">
            <a>Bye</a>
          </Link>
          |{' '}
          <Link href="/users">
            <a>Users List</a>
          </Link>{' '}
          |{' '}
          {data?.me?.role === USER_ROLE.ADMIN && <Link href="/admin">
            <a>Admin</a>
          </Link>}{' '}
          {data?.me && <Link href="/profile">
            <a>Profile</a>
          </Link>}{' '}
          {data?.me && <Link href="/reviews">
            <a>Reviews</a>
          </Link>}{' '}
          | <a href="/api/users">Users API</a>
        </nav>
      </header>
      {children}
    </div>
  );
};

export default Layout;
