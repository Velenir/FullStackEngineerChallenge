import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import Cors from 'micro-cors';
import { RequestHandler } from 'micro';
import {
  verifyRefreshToken,
  createAccessToken,
  setRefreshCookie,
  createRefreshToken,
} from 'server/utils/tokens';
import { ensureConnection } from 'server/db/ensureConnection';
import { User } from 'server/db/entity';

const cors = Cors({
  allowMethods: ['POST', 'OPTIONS'],
  origin: '*',
});

interface RefreshResponse {
  ok: boolean;
  accessToken: string;
}

const emptyResponse: RefreshResponse = { ok: false, accessToken: '' };

export const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<RefreshResponse>
) => {
  await ensureConnection();

  console.log('req', req.headers, req.cookies);
  const refreshToken = req.cookies.wuid;

  if (!refreshToken) return res.send(emptyResponse);

  try {
    const { userId, tokenVersion } = verifyRefreshToken(refreshToken);
    const allUsers = await User.find();
    console.log('allUsers', allUsers);

    const user = await User.findOne({ id: userId });

    if (!user || tokenVersion !== user.tokenVersion)
      return res.send(emptyResponse);

    setRefreshCookie({ res }, createRefreshToken(user));

    res.send({
      ok: true,
      accessToken: createAccessToken(user),
    });
  } catch (error) {
    console.error('error', error);
    return res.send(emptyResponse);
  }
};

export default cors(handler as RequestHandler);
