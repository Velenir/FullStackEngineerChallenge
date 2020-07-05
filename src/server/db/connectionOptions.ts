import { User } from './entity/User';
import { ConnectionOptions } from 'typeorm';

export const DEFAULT_CONNECTION: ConnectionOptions = {
  type: 'sqlite',
  database: 'reviews-db.sqlite',
  synchronize: true,
  logging: true,
  entities: [User],
};
