import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { User } from './entity/User';
import { DEFAULT_CONNECTION } from './connectionOptions';

async function main() {
  try {
    await createConnection(DEFAULT_CONNECTION);
    const user = new User();
    user.firstName = 'Timber';
    user.lastName = 'Saw';
    user.email = 'timer@example.com';
    user.password = 'testpass';

    await user.save();

    console.log('Saved a new user with id: ' + user.id);

    console.log('Loading users from the database...');

    const users = await User.find();
    console.log('Loaded users: ', users);
  } catch (error) {
    console.error('Error populating db:', error);
  }
}

main();
