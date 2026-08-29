import type { VercelRequest, VercelResponse } from '@vercel/node';
import { COOKIE_NAME } from './lib/auth';
import { serializeCookie } from './lib/cookies';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const isProd = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';

  res.setHeader(
    'Set-Cookie',
    serializeCookie(COOKIE_NAME, '', {
      httpOnly: true,
      sameSite: 'Strict',
      path: '/',
      maxAge: 0,
      secure: isProd,
    })
  );

  return res.status(200).json({ ok: true });
}
