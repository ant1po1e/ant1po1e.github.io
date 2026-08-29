import type { VercelRequest, VercelResponse } from '@vercel/node';
import { head } from '@vercel/blob';
import { Readable } from 'node:stream';
import { verifyAuth } from './_lib/auth';
import { cookieReader } from './_lib/cookies';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!verifyAuth(cookieReader(req))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const pathname = typeof req.query.pathname === 'string' ? req.query.pathname : '';
  if (!pathname || !pathname.startsWith('v/')) {
    return res.status(400).json({ error: 'Invalid path.' });
  }

  try {
    const meta = await head(pathname);
    // Private/unlisted blobs still need the store token to actually fetch
    // their bytes — head() only returns metadata + a URL, not the content.
    const upstream = await fetch(meta.url, {
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
    });
    if (!upstream.ok || !upstream.body) {
      return res.status(404).json({ error: 'File not found.' });
    }

    res.setHeader('Content-Type', meta.contentType || 'application/octet-stream');
    res.setHeader('Cache-Control', 'private, no-store');
    res.status(200);
    Readable.fromWeb(upstream.body as never).pipe(res);
  } catch {
    return res.status(404).json({ error: 'File not found.' });
  }
}
