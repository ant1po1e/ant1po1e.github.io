import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'node:crypto';
import { verifyAuth } from './_lib/auth';
import { cookieReader } from './_lib/cookies';
import { getSupabaseAdmin, VAULT_BUCKET } from './_lib/supabaseAdmin';

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

  const supabase = getSupabaseAdmin();

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const name = `${randomSlug()}.${ext}`;
    // list()'s "search" option filters to exact-prefix matches within the
    // folder — this is Supabase Storage's equivalent of @vercel/blob's
    // head()-throws-if-missing check used here before.
    const { data, error } = await supabase.storage.from(VAULT_BUCKET).list('v', { search: name, limit: 1 });
    if (!error && (!data || data.length === 0)) {
      return res.status(200).json({ pathname: `v/${name}` });
    }
  }

  return res.status(500).json({ error: 'Could not find a free slug, please try again.' });
}
