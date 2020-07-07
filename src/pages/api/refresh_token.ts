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

// refreshes expired access tokens
export const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<RefreshResponse>
) => {
  await ensureConnection(); // for Tyeorm + HMR

  const refreshToken = req.cookies.wuid;

  // checks if we have cookie with refresh token
  if (!refreshToken) return res.send(emptyResponse);

  try {
    // checks if we indeed signed the token
    const { userId, tokenVersion } = verifyRefreshToken(refreshToken);

    const user = await User.findOne({ id: userId });

    // checks if token was created with current tokenVersion (revokable if need be)
    if (!user || tokenVersion !== user.tokenVersion)
      return res.send(emptyResponse);

    // also update reshreshToken with a new one
    // to reset the clock
    setRefreshCookie({ res }, createRefreshToken(user));

    res.send({
      ok: true,
      // finally send back a newly created access token
      accessToken: createAccessToken(user),
    });
  } catch (error) {
    console.error('error', error);
    return res.send(emptyResponse);
  }
};

export default cors(handler as RequestHandler);
