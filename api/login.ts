import type { VercelRequest, VercelResponse } from '@vercel/node';
import { checkPassword, buildSessionCookieValue, sessionCookieAttributes, COOKIE_NAME } from './_lib/auth';
import { serializeCookie } from './_lib/cookies';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
