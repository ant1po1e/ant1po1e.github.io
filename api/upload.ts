import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { verifyAuth } from './lib/auth';
import { cookieReader } from './lib/cookies';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!verifyAuth(cookieReader(req))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const body = (typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async pathname => {
        // Only allow uploads into the vault's own "v/" prefix — the pathname
        // itself was already reserved via /api/slug, so this just guards
        // against a tampered client request targeting an arbitrary path.
        if (!pathname.startsWith('v/')) {
          throw new Error('Invalid upload path.');
        }
        return {
          addRandomSuffix: false,
          maximumSizeInBytes: 25 * 1024 * 1024, // 25MB
        };
      },
      onUploadCompleted: async () => {
        // No external database to update — @vercel/blob's own list() is the
        // source of truth for the file list (see /api/images).
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (err) {
    console.error('upload handler error:', err);
    return res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
  }
}
