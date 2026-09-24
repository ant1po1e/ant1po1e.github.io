import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  checkPassword,
  buildSessionCookieValue,
  sessionCookieAttributes,
  verifyAuth,
  COOKIE_NAME,
} from './_lib/auth';
import { serializeCookie, cookieReader } from './_lib/cookies';

// Consolidates what used to be three separate functions (login / logout /
// me) into one, to stay well under the Hobby plan's 12 Serverless Function
// limit. vercel.json rewrites /api/login, /api/logout and /api/me to this
// file with ?action=... — the frontend's request paths never changed.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const action = typeof req.query.action === 'string' ? req.query.action : '';

  if (action === 'me') {
    const authenticated = verifyAuth(cookieReader(req));
    return res.status(200).json({ authenticated });
  }

  if (action === 'login') {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const { password } = body;

    try {
      if (!checkPassword(password)) {
        // small constant delay so failed attempts don't reveal timing info
        // beyond what the constant-time compare inside checkPassword already avoids
        await new Promise(resolve => setTimeout(resolve, 350));
        return res.status(401).json({ error: 'Incorrect password.' });
      }
    } catch (err) {
      return res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }

    res.setHeader('Set-Cookie', serializeCookie(COOKIE_NAME, buildSessionCookieValue(), sessionCookieAttributes()));
    return res.status(200).json({ ok: true });
  }

  if (action === 'logout') {
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
      }),
    );

    return res.status(200).json({ ok: true });
  }

  return res.status(400).json({ error: 'Unknown action.' });
}
