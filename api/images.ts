import type { VercelRequest, VercelResponse } from '@vercel/node';
import { list } from '@vercel/blob';
import { verifyAuth } from './lib/auth';
import { cookieReader } from './lib/cookies';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!verifyAuth(cookieReader(req))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { blobs } = await list({ prefix: 'v/' });

    const images = blobs
      .filter(b => b.pathname.startsWith('v/'))
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
      .map(b => ({
        url: b.url,
        pathname: b.pathname,
        name: b.pathname.replace(/^v\//, ''),
        size: b.size,
        uploadedAt: b.uploadedAt,
      }));

    return res.status(200).json({ images });
  } catch (err) {
    console.error('images handler error:', err);
    return res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
}
