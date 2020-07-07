import { User, Review } from './entity';
import { ConnectionOptions } from 'typeorm';

// because of next.js webpack config
// we can't use ormconfig.json
// or we'll get `can't import outside of module` error
export const DEFAULT_CONNECTION: ConnectionOptions = {
  type: 'sqlite',
  database: 'reviews-db.sqlite',
  synchronize: true,
  logging: true,
  entities: [User, Review],
};
