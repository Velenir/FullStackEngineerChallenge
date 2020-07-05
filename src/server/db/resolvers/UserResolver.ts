import { Resolver, Query } from 'type-graphql';
import { User } from '../entity/User';

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
}
