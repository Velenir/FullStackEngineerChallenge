import {
  Resolver,
  Query,
  Mutation,
  InputType,
  Field,
  Arg,
  Int,
} from 'type-graphql';
import { User, Review } from '../entity/User';

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

  @Query(() => [User])
  users(): Promise<User[]> {
    return User.find();
  }

  @Mutation(() => [User])
  async updateUser(
    @Arg('updatedUser') updatedUser: UpdateUserRequest
  ): Promise<User[]> {
    console.log('UserResolver::updateUser', updatedUser);

    const { user_id, ...userData } = updatedUser;

    await User.update(user_id, userData);

    return User.find();
  }

  @Mutation(() => [User])
  async addUser(@Arg('newUser') newUser: AddUserRequest): Promise<User[]> {
    console.log('UserResolver::addUser', newUser);

    // TODO: add hashing,jwt
    const hashedPassword = newUser.password;

    await User.insert({
      ...newUser,
      password: hashedPassword,
    });

    return User.find();
  }

  @Mutation(() => [User])
  async deleteUser(@Arg('user_id') userId: number): Promise<User[]> {
    console.log('UserResolver::deleteUser', userId);

    await User.delete(userId);

    return User.find();
  }
}
