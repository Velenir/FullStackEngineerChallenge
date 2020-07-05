import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-micro';
import { buildSchema } from 'type-graphql';
import { UserResolver } from 'server/db/resolvers/UserResolver';

let apolloServer: ApolloServer;

export const createApolloServer = async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver],
  });

  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({
      req,
      res,
    }),
  });

  return server;
};

export const getApolloServer = async () => {
  //  don;t recreate on each api request
  return apolloServer || (apolloServer = await createApolloServer());
};
