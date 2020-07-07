import { MiddlewareFn } from 'type-graphql';
import { GQLContext } from '../../types';
import { verifyAccessToken } from '../../utils/tokens';

export const isAuth: MiddlewareFn<GQLContext> = ({ context }, next) => {
  // bearer <token>
  const { authorization } = context.req.headers;
  //  jwt sent on each api request

  if (!authorization) throw new Error('Not authorized');

  const [, token] = authorization.split(' ');

  try {
    // checking if signed by us
    const payload = verifyAccessToken(token);

    // make available in resolvers on context
    context.payload = payload;
  } catch (error) {
    console.error(error);
    throw new Error('Not authorized');
  }

  return next();
};
