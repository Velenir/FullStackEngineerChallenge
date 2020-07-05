import { MiddlewareFn } from 'type-graphql';
import { GQLContext } from '../../types';
import { verifyAccessToken } from '../../utils/tokens';

export const isAuth: MiddlewareFn<GQLContext> = ({ context }, next) => {
  // bearer <token>
  const { authorization } = context.req.headers;

  if (!authorization) throw new Error('Not authorized');

  const [, token] = authorization.split(' ');

  try {
    const payload = verifyAccessToken(token);

    context.payload = payload;
  } catch (error) {
    console.log(error);
    throw new Error('Not authorized');
  }

  return next();
};