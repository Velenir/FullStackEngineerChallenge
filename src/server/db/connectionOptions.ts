import { User, Review } from './entity';
import { ConnectionOptions } from 'typeorm';

export const DEFAULT_CONNECTION: ConnectionOptions = {
  type: 'sqlite',
  database: 'reviews-db.sqlite',
  synchronize: true,
  logging: true,
  entities: [User, Review],
};
