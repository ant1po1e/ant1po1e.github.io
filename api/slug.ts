import type { VercelRequest, VercelResponse } from '@vercel/node';
import { head } from '@vercel/blob';
import crypto from 'node:crypto';
import { verifyAuth } from './_lib/auth';
import { cookieReader } from './_lib/cookies';

const SLUG_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const MAX_ATTEMPTS = 6;

function randomSlug(length = 5): string {
  let out = '';
  for (let i = 0; i < length; i++) {
    out += SLUG_CHARS[crypto.randomInt(0, SLUG_CHARS.length)];
  }
  return out;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!verifyAuth(cookieReader(req))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const ext = typeof req.query.ext === 'string' ? req.query.ext : '';
  if (!ext || !/^[a-z0-9]{1,10}$/i.test(ext)) {
    return res.status(400).json({ error: 'Invalid extension.' });
  }

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const pathname = `v/${randomSlug()}.${ext}`;
    try {
      // head() throws if the blob doesn't exist — that's the "free slug" case
      await head(pathname);
    } catch {
      return res.status(200).json({ pathname });
    }
  }

  return res.status(500).json({ error: 'Could not find a free slug, please try again.' });
}
