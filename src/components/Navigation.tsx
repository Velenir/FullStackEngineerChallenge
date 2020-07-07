import Link from 'next/link';
import { MeData } from 'client/types';
import { USER_ROLE } from 'server/consts';

interface UserNavigationProps {
  me: MeData;
}

interface NavigationProps {
  me?: MeData | null;
}

export const UserNavigation = ({ me }: UserNavigationProps) => {
  return (
    <>
      {me && (
        <Link href="/profile">
          <a>Profile</a>
        </Link>
      )}
      {me && (
        <Link href="/reviews">
          <a>Reviews</a>
        </Link>
      )}

      {me.role === USER_ROLE.ADMIN && (
        <Link href="/admin">
          <a>Admin</a>
        </Link>
      )}
    </>
  );
};

export const Navigation = ({ me }: NavigationProps) => {
  return (
    <>
      <Link href="/">
        <a>Home</a>
      </Link>

      <Link href="/about">
        <a>About</a>
      </Link>

      {!me && (
        <Link href="/login">
          <a>Login</a>
        </Link>
      )}

      {me && <UserNavigation me={me} />}
    </>
  );
};
