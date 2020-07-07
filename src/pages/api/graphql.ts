import 'reflect-metadata';
import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import Cors from 'micro-cors';
import { getApolloServer } from 'server/apollo';
import { ensureConnection } from 'server/db/ensureConnection';

export const config = {
  api: {
    bodyParser: false,
  },
};
const cors = Cors({
  origin: '*',
});

// don't recreate handler between requests
let cachedHandler: NextApiHandler | null = null;

const getHandler = async (): Promise<NextApiHandler> => {
  if (cachedHandler) {
    return cachedHandler;
  }
  // apollo server is cached inside
  const apolloServer = await getApolloServer();

  return (cachedHandler = cors(
    apolloServer.createHandler({ path: '/api/graphql' })
  ));
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await ensureConnection(); // for Tyeorm + HMR
  const handler = await getHandler();
  return handler(req, res);
};
