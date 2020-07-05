import { sign, verify } from 'jsonwebtoken';
import { GQLContext, ContextPayload } from '../types';
import { setCookie } from 'nookies';
import { User } from 'server/db/entity';

const REFRESH_SECRET = 'secret_refresh_string123';
const ACCESS_SECRET = 'secret_access_string234';

export const createRefreshToken = (user: User) => {
  return sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    REFRESH_SECRET,
    {
      expiresIn: '7d',
    }
  );
};

export const createAccessToken = (user: User) => {
  return sign({ userId: user.id }, ACCESS_SECRET, {
    expiresIn: '20m',
  });
};

export const setRefreshCookie = (
  ctx: Pick<GQLContext, 'res'>,
  refreshToken: string
) => {
  const in7days = new Date();
  in7days.setDate(in7days.getDate() + 7);

  setCookie(ctx, 'wuid', refreshToken, {
    httpOnly: true,
    expires: in7days,
    path: '/api/refresh_token',
  });
};

export const verifyRefreshToken = (
  refreshToken: string
): Required<ContextPayload> => {
  return verify(refreshToken, REFRESH_SECRET) as Required<ContextPayload>;
};

export const verifyAccessToken = (accessToken: string): ContextPayload => {
  return verify(accessToken, ACCESS_SECRET) as ContextPayload;
};
