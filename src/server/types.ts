import { NextApiResponse, NextApiRequest } from 'next';
import { USER_ROLE } from './consts';

// gets put onto request in isAuth middleware
// and partially in jwt
export interface ContextPayload {
  userId: number;
  tokenVersion?: number;
  role?: USER_ROLE;
}

// req, res added by Apollo server
// payload by resolver middlewares
export interface GQLContext {
  req: NextApiRequest;
  res: NextApiResponse;
  payload?: ContextPayload;
}
