import { NextApiResponse, NextApiRequest } from 'next';
import { USER_ROLE } from './consts';

export interface ContextPayload {
  userId: number;
  tokenVersion?: number;
  role?: USER_ROLE;
}

export interface GQLContext {
  req: NextApiRequest;
  res: NextApiResponse;
  payload?: ContextPayload;
}
