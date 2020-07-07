import Link from 'next/link';
import Layout from '../components/Layout';
import { useUsersQuery } from '../generated/graphql';

export default function Users() {
  const { data, error, loading } = useUsersQuery();
  console.log('data, error, loading', data, error, loading);

  if (error) return <div>Failed to load: {error.message}</div>;
  if (loading || !data) return <div>Loading...</div>;

  const { users } = data;

  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <h1>Hello Next.js 👋</h1>
      <p>
        <Link href="/about">
          <a>About</a>
        </Link>
        <Link href="/login">
          <a>Login</a>
        </Link>
        <Link href="/register">
          <a>Register</a>
        </Link>
      </p>
      <div>
        {users.map((user, i) => (
          <div key={i}>{user.email}</div>
        ))}
      </div>
    </Layout>
  );
}

const UsersPage = () => (
  <Layout title="Home | Next.js + TypeScript Example">
    <h1>Hello Next.js 👋</h1>
    <p>
      <Link href="/about">
        <a>About</a>
      </Link>
    </p>
  </Layout>
);

// export default IndexPage
