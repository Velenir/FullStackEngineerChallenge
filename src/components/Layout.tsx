import React, { ReactNode } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useMeQuery, useLogoutMutation } from '../generated/graphql';
import { setAccessToken } from 'client/utils/accessToken';
import { USER_ROLE } from 'server/consts';
import { useRouter } from 'next/router';
import { Navigation } from './Navigation';

const AdminAside = () => {
  return (
    <>
      <Link href="/admin/users">
        <a>View employees</a>
      </Link>
      <Link href="/admin/add_user">
        <a>Add an employee</a>
      </Link>
      <Link href="/admin/reviews">
        <a>View reviews</a>
      </Link>
      <Link href="/admin/request_review">
        <a>Request a review</a>
      </Link>
    </>
  );
};

type LayoutProps = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({
  children,
  title = 'This is the default title',
}: LayoutProps) => {
  const { data, error } = useMeQuery({ fetchPolicy: 'cache-first' });
  const [logout, { client }] = useLogoutMutation();

  const router = useRouter();

  if (error) return <p>{error.message}</p>;

  const onLogout = async () => {
    setAccessToken('');
    router.push('/');
    await logout();

    await client?.resetStore();
  };

  return (
    <div className="container">
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
      </header>
      <nav>
        <Navigation me={data?.me} />
      </nav>
      {data?.me?.role === USER_ROLE.ADMIN && (
        <aside>
          <AdminAside />
        </aside>
      )}
      <main>{children}</main>
      <style jsx>
        {`
          .container {
            display: grid;
            grid-template-columns: 20ch 1fr;
            grid-template-rows: 3em 4em minmax(350px, 1fr);
            grid-template-areas:
              'header header'
              '. navigation'
              'aside main';

            // align-items: center;
            // justify-items: center;
          }

          header {
            grid-area: header;
            display: flex;
            align-items: center;
          }

          header > * {
            margin-right: 0.5em;
          }

          nav {
            grid-area: navigation;
            justify-content: space-evenly;
          }
          main {
            grid-area: main;
            flex-direction: column;
          }

          nav,
          main {
            display: flex;
            align-items: center;
          }

          nav + main {
            grid-column-start: 1;
          }

          aside {
            grid-area: aside;
            display: flex;
            flex-direction: column;
            align-self: stretch;
            justify-content: space-evenly;
          }

          main,
          aside {
            border: 1px solid gray;
          }
        `}
      </style>
    </div>
  );
};

export default Layout;
