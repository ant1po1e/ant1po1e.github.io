import type { VercelRequest, VercelResponse } from '@vercel/node';
import { get } from '@vercel/blob';
import { Readable } from 'node:stream';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const raw = req.query.path;
  const pathname = Array.isArray(raw) ? raw.join('/') : raw || '';

  if (!pathname || !pathname.startsWith('v/')) {
    return res.status(400).json({ error: 'Invalid path.' });
  }

  try {
    const result = await get(pathname, { access: 'public' });
    if (!result) return res.status(404).json({ error: 'File not found.' });

    res.setHeader('Content-Type', result.blob.contentType || 'application/octet-stream');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.status(200);
    Readable.fromWeb(result.stream as never).pipe(res);
  } catch {
    return res.status(404).json({ error: 'File not found.' });
  }
}
