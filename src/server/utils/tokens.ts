import { sign, verify } from 'jsonwebtoken';
import { GQLContext, ContextPayload } from '../types';
import { setCookie } from 'nookies';
import { User } from 'server/db/entity';

// normally would put SECRETS in .env, locally only
const REFRESH_SECRET = 'secret_refresh_string123';
const ACCESS_SECRET = 'secret_access_string234';

export const createRefreshToken = (user: User) => {
  return sign(
    // could put more data into the token if need be
    { userId: user.id, tokenVersion: user.tokenVersion }, // tokenVersion allows for mass-revoking all user's tokens
    REFRESH_SECRET,
    {
      expiresIn: '7d', // both refresh token and cookie expire together
    }
  );
};

export const createAccessToken = (user: User) => {
  return sign({ userId: user.id }, ACCESS_SECRET, {
    expiresIn: '20m', // shortish life time limit for each access token
    // afterwards a new request to /api/refresh_token comes
    // and new access token is created
  });
};

export const setRefreshCookie = (
  ctx: Pick<GQLContext, 'res'>,
  refreshToken: string
) => {
  const in7days = new Date();
  in7days.setDate(in7days.getDate() + 7);

  // wuid -- random meaningless name
  // so it'snot very obvious what the cookie is for
  setCookie(ctx, 'wuid', refreshToken, {
    httpOnly: true,
    expires: in7days,
    path: '/api/refresh_token',
  });
};

// only userId and tokenVersion in refreshToken
export const verifyRefreshToken = (
  refreshToken: string
): Required<Pick<ContextPayload, 'userId' | 'tokenVersion'>> => {
  return verify(refreshToken, REFRESH_SECRET) as Required<
    Pick<ContextPayload, 'userId' | 'tokenVersion'>
  >; // contains the whole payload
};

// only userId accessToken
export const verifyAccessToken = (
  accessToken: string
): Pick<ContextPayload, 'userId'> => {
  return verify(accessToken, ACCESS_SECRET) as Pick<ContextPayload, 'userId'>;
};
