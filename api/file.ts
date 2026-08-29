import type { VercelRequest, VercelResponse } from '@vercel/node';
import { get } from '@vercel/blob';
import { Readable } from 'node:stream';
import { verifyAuth } from './lib/auth';
import { cookieReader } from './lib/cookies';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!verifyAuth(cookieReader(req))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const pathname = typeof req.query.pathname === 'string' ? req.query.pathname : '';
  if (!pathname || !pathname.startsWith('v/')) {
    return res.status(400).json({ error: 'Invalid path.' });
  }

  try {
    const result = await get(pathname, { access: 'private' });
    if (!result) return res.status(404).json({ error: 'File not found.' });

    res.setHeader('Content-Type', result.blob.contentType || 'application/octet-stream');
    res.setHeader('Cache-Control', 'private, no-store');
    res.status(200);
    Readable.fromWeb(result.stream as never).pipe(res);
  } catch {
    return res.status(404).json({ error: 'File not found.' });
  }
}
