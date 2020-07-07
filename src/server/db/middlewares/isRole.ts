import { MiddlewareFn } from 'type-graphql';
import { GQLContext } from '../../types';
import { User } from '../entity/User';
import { USER_ROLE } from '../../consts';

export const isRole: (role: USER_ROLE) => MiddlewareFn<GQLContext> = (
  role
) => async ({ context }, next) => {
  const id = context.payload!.userId;

  const user = await User.findOne({ id });

  if (user?.role !== role) throw new Error('Access denied');

  context.payload!.role = user.role;

  return next();
};
