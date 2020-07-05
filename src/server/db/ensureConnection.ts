// workaround for HMR + TypeORM
// https://github.com/typeorm/typeorm/issues/6241#issuecomment-643690383
import { Connection, getConnectionManager, ConnectionOptions } from 'typeorm';
import { User } from './entity/User';
import { DEFAULT_CONNECTION } from './connectionOptions';

const options: Record<string, ConnectionOptions> = {
  default: {
    type: 'sqlite',
    database: 'reviews-db.sqlite',
    synchronize: true,
    logging: true,
    entities: [User],
  },
  con: DEFAULT_CONNECTION,
};

function entitiesChanged(prevEntities: any[], newEntities: any[]): boolean {
  if (prevEntities.length !== newEntities.length) return true;

  for (let i = 0; i < prevEntities.length; i++) {
    if (prevEntities[i] !== newEntities[i]) return true;
  }

  return false;
}

async function updateConnectionEntities(
  connection: Connection,
  entities: any[]
) {
  if (!entitiesChanged(connection.options.entities!, entities)) return;

  // @ts-ignore
  connection.options.entities = entities;

  // @ts-ignore
  connection.buildMetadatas();

  if (connection.options.synchronize) {
    await connection.synchronize();
  }
}

export async function ensureConnection(name = 'default'): Promise<Connection> {
  const connectionManager = getConnectionManager();

  if (connectionManager.has(name)) {
    const connection = connectionManager.get(name);

    if (process.env.NODE_ENV !== 'production') {
      await updateConnectionEntities(connection, options[name].entities!);
    }

    return connection;
  }

  return await connectionManager.create({ name, ...options[name] }).connect();
}
