import type { VercelRequest, VercelResponse } from '@vercel/node';
import { head } from '@vercel/blob';
import { Readable } from 'node:stream';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const pathname = typeof req.query.p === 'string' ? req.query.p : '';
  if (!pathname || !pathname.startsWith('v/')) {
    return res.status(400).json({ error: 'Invalid path.' });
  }

  try {
    const meta = await head(pathname);
    const upstream = await fetch(meta.url);
    if (!upstream.ok || !upstream.body) {
      return res.status(404).json({ error: 'File not found.' });
    }

    res.setHeader('Content-Type', meta.contentType || 'application/octet-stream');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.status(200);
    Readable.fromWeb(upstream.body as never).pipe(res);
  } catch {
    return res.status(404).json({ error: 'File not found.' });
  }
}
