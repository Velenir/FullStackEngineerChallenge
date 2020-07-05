import { Resolver, Query, Mutation, InputType, Field, Arg } from 'type-graphql';
import { User } from '../entity/User';

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
}
