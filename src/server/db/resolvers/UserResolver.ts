import {
  Resolver,
  Query,
  Mutation,
  InputType,
  Field,
  Arg,
  Int,
  ObjectType,
  UseMiddleware,
  Ctx,
} from 'type-graphql';
import { User } from '../entity/User';
import { GQLContext } from 'server/types';
import { isAuth } from '../middlewares/isAuth';
import { isRole } from '../middlewares/isRole';
import { USER_ROLE, GEN_SALT_ROUNDS } from 'server/consts';
import { hash, compare } from 'bcryptjs';
import {
  setRefreshCookie,
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
} from 'server/utils/tokens';

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}

@InputType()
class AddUserRequest {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  password: string;
}
@InputType()
class UpdateUserRequest {
  @Field(() => Int)
  user_id: number;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password?: string;
}

@Resolver()
export class UserResolver {
  // data of currently logged user if any
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: GQLContext): Promise<User | null> {
    // bearer <token>
    const { authorization } = ctx.req.headers;

    if (!authorization) return null;

    const [, token] = authorization.split(' ');

    try {
      const payload = verifyAccessToken(token);

      return (await User.findOne(payload.userId!)) || null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(@Arg('userId', () => Int) userId: number) {
    // allows to revoke sessions
    // can be usefulin logout and when doing `log my other devices` functionality
    await User.getRepository().increment({ id: userId }, 'tokenVersion', 1);

    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() ctx: GQLContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });
    //  same error every time so a potential attacker doen't get tipped on what data is incorrect
    if (!user) throw new Error('invalid login or password');

    const correctPass = await compare(password, user.password);

    if (!correctPass) throw new Error('invalid login or password');

    const refreshToken = createRefreshToken(user);

    // refresh token in httpOnly cookie
    setRefreshCookie(ctx, refreshToken);

    const accessToken = createAccessToken(user);

    return {
      accessToken,
      user,
    };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: GQLContext) {
    // clear refresh token in cookie
    setRefreshCookie(ctx, '');

    return true;
  }

  @Query(() => [User])
  @UseMiddleware(isAuth, isRole(USER_ROLE.ADMIN))
  users(): Promise<User[]> {
    return User.find();
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth, isRole(USER_ROLE.ADMIN))
  async user(@Arg('userId', () => Int) userId: number): Promise<User | null> {
    return (await User.findOne(userId)) || null;
  }

  @Mutation(() => [User])
  @UseMiddleware(isAuth, isRole(USER_ROLE.ADMIN))
  async updateUser(
    @Arg('updatedUser') updatedUser: UpdateUserRequest
  ): Promise<User[]> {
    const { user_id, password, ...userData } = updatedUser;

    if (password) {
      // little hack not to deal with types or new objects
      (userData as Omit<UpdateUserRequest, 'user_id'>).password = await hash(
        password,
        GEN_SALT_ROUNDS
      );
    }

    await User.update(user_id, userData);

    return User.find();
  }

  @Mutation(() => [User])
  @UseMiddleware(isAuth, isRole(USER_ROLE.ADMIN))
  async addUser(@Arg('newUser') newUser: AddUserRequest): Promise<User[]> {
    // same procedure in update and add users
    const hashedPassword = await hash(newUser.password, GEN_SALT_ROUNDS);

    await User.insert({
      ...newUser,
      password: hashedPassword,
    });

    return User.find();
  }

  @Mutation(() => [User])
  @UseMiddleware(isAuth, isRole(USER_ROLE.ADMIN))
  async deleteUser(@Arg('userId', () => Int) userId: number): Promise<User[]> {
    await User.delete(userId); // this cascade-deletes reviews of and by this user

    return User.find();
  }
}
