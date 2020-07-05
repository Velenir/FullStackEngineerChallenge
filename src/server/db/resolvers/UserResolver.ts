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
import { USER_ROLE } from 'server/consts';
import { hash, compare } from 'bcryptjs';
import {
  setRefreshCookie,
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
} from 'server/utils/tokens';

const GEN_SALT_ROUNDS = 10;

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
  @Query(() => String)
  hello() {
    return 'hi!';
  }

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
    if (!user) throw new Error('invalid login or password');

    const correctPass = await compare(password, user.password);
    console.log('correctPass', correctPass);

    if (!correctPass) throw new Error('invalid login or password');

    const refreshToken = createRefreshToken(user);

    setRefreshCookie(ctx, refreshToken);

    const accessToken = createAccessToken(user);

    return {
      accessToken,
      user,
    };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: GQLContext) {
    setRefreshCookie(ctx, '');

    return true;
  }

  @Query(() => [User])
  @UseMiddleware(isAuth, isRole(USER_ROLE.ADMIN))
  users(): Promise<User[]> {
    return User.find();
  }

  @Mutation(() => [User])
  @UseMiddleware(isAuth, isRole(USER_ROLE.ADMIN))
  async updateUser(
    @Arg('updatedUser') updatedUser: UpdateUserRequest
  ): Promise<User[]> {
    console.log('UserResolver::updateUser', updatedUser);

    const { user_id, ...userData } = updatedUser;

    await User.update(user_id, userData);

    return User.find();
  }

  @Mutation(() => [User])
  @UseMiddleware(isAuth, isRole(USER_ROLE.ADMIN))
  async addUser(@Arg('newUser') newUser: AddUserRequest): Promise<User[]> {
    console.log('UserResolver::addUser', newUser);

    const hashedPassword = await hash(newUser.password, GEN_SALT_ROUNDS);

    await User.insert({
      ...newUser,
      password: hashedPassword,
    });

    return User.find();
  }

  @Mutation(() => [User])
  @UseMiddleware(isAuth, isRole(USER_ROLE.ADMIN))
  async deleteUser(@Arg('user_id') userId: number): Promise<User[]> {
    console.log('UserResolver::deleteUser', userId);

    await User.delete(userId);

    return User.find();
  }
}
