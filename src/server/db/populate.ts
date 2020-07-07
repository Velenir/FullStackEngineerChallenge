import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { User, Review } from './entity/User';
import { DEFAULT_CONNECTION } from './connectionOptions';
import { USER_ROLE, GEN_SALT_ROUNDS } from '../consts';
import { hash } from 'bcryptjs';
import faker from 'faker';

//  run as `yarn populate` to pre-fill database
async function main() {
  try {
    await createConnection(DEFAULT_CONNECTION);
    const adminUser = new User();
    adminUser.firstName = 'Admin';
    adminUser.lastName = 'Adminovich';
    adminUser.email = 'admin@example.com';
    adminUser.password = await hash('admin', GEN_SALT_ROUNDS);
    adminUser.role = USER_ROLE.ADMIN;

    await adminUser.save();
    console.log('Saved a new user with id: ' + adminUser.id);

    const user = new User();
    user.firstName = 'Employed';
    user.lastName = 'Employee';
    user.email = 'employee@example.com';
    user.password = await hash('employee', GEN_SALT_ROUNDS);

    await user.save();

    const sampleReview1 = new Review();

    sampleReview1.reviewee = user;
    sampleReview1.reviewer = adminUser;

    await sampleReview1.save();

    const sampleReview2 = new Review();

    sampleReview2.reviewee = user;
    sampleReview2.reviewer = adminUser;
    sampleReview2.text = 'Employee is a good, hard-working guy!';
    sampleReview2.completed = true;

    await sampleReview2.save();

    console.log('Saved a new user with id: ' + user.id);

    for (let i = 0; i < 10; ++i) {
      const user = new User();
      user.firstName = faker.name.firstName();
      user.lastName = faker.name.lastName();
      user.email = faker.internet.email();
      user.password = await hash('employee', GEN_SALT_ROUNDS);

      await user.save();

      console.log('Saved a new user with id: ' + user.id);
    }

    // User.insert([], {})

    console.log('Loading users from the database...');
    const users = await User.find();
    console.log('Loaded users: ', users);
  } catch (error) {
    console.error('Error populating db:', error);
  }
}

main();
