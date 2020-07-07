import { MiddlewareFn } from 'type-graphql';
import { GQLContext } from '../../types';
import { User } from '../entity/User';
import { USER_ROLE } from '../../consts';

export const isRole: (role: USER_ROLE) => MiddlewareFn<GQLContext> = (
  role
) => async ({ context }, next) => {
  // as isRole is always used after isAuth
  // can count on payload being available
  const id = context.payload!.userId;

  // checking if role matches
  // could also put role into access token
  const user = await User.findOne({ id });

  if (user?.role !== role) throw new Error('Access denied');

  // make role available in resolvers on context
  context.payload!.role = user.role;

  return next();
};
