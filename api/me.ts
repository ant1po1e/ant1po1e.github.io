import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAuth } from './_lib/auth';
import { cookieReader } from './_lib/cookies';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const authenticated = verifyAuth(cookieReader(req));
  return res.status(200).json({ authenticated });
}
