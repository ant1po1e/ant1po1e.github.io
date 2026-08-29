import type { VercelRequest, VercelResponse } from '@vercel/node';
import { del } from '@vercel/blob';
import { verifyAuth } from './_lib/auth';
import { cookieReader } from './_lib/cookies';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!verifyAuth(cookieReader(req))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const { url } = body;

  if (!url || typeof url !== 'string' || !url.includes('/v/')) {
    return res.status(400).json({ error: 'Invalid image URL.' });
  }

  try {
    await del(url);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('delete handler error:', err);
    return res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
}
