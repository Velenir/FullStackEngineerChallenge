import { User, Review } from './entity';
import { ConnectionOptions } from 'typeorm';

const isDevelopment = process.env.NODE_ENV === 'development';

// because of next.js webpack config
// we can't use ormconfig.json
// or we'll get `can't import outside of module` error
export const DEFAULT_CONNECTION: ConnectionOptions = {
  type: 'sqlite',
  database: 'public/reviews-db.sqlite',
  synchronize: isDevelopment, // synchronize DB entities on HMR
  logging: isDevelopment, // log DB queries
  entities: [User, Review],
};
