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
    const connection = await createConnection(DEFAULT_CONNECTION);
    await connection.synchronize(true);

    const adminUser = new User();
    adminUser.firstName = 'Admin';
    adminUser.lastName = 'Adminovich';
    adminUser.email = 'admin@example.com';
    adminUser.password = await hash('admin', GEN_SALT_ROUNDS);
    adminUser.role = USER_ROLE.ADMIN;

    await adminUser.save();
    console.log('Saved a new user with id: ' + adminUser.id);

    const employeeUser = new User();
    employeeUser.firstName = 'Employed';
    employeeUser.lastName = 'Employee';
    employeeUser.email = 'employee@example.com';
    employeeUser.password = await hash('employee', GEN_SALT_ROUNDS);

    await employeeUser.save();

    // by Admin of Employee
    const sampleReview1 = new Review();

    sampleReview1.reviewee = employeeUser;
    sampleReview1.reviewer = adminUser;

    await sampleReview1.save();

    // by Admin of Employee, already completed
    const sampleReview2 = new Review();

    sampleReview2.reviewee = employeeUser;
    sampleReview2.reviewer = adminUser;
    sampleReview2.text = 'Employee is a good, hard-working guy!';
    sampleReview2.completed = true;

    await sampleReview2.save();

    // by Employee of Admin
    const sampleReview3 = new Review();

    sampleReview3.reviewer = employeeUser;
    sampleReview3.reviewee = adminUser;

    await sampleReview3.save();

    console.log('Saved a new user with id: ' + employeeUser.id);

    const randomUsers = await Promise.all(
      Array.from({ length: 10 }, async () => {
        const user = new User();
        user.firstName = faker.name.firstName();
        user.lastName = faker.name.lastName();
        user.email = `${user.firstName}_${user.lastName}@example.com`;
        user.password = await hash('employee', GEN_SALT_ROUNDS);

        return user;
      })
    );

    await User.insert(randomUsers);

    console.log('Loading users from the database...');
    const users = await User.find();
    console.log('Loaded users: ', users);
  } catch (error) {
    console.error('Error populating db:', error);
  }
}

main();
