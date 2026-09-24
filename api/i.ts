import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Readable } from 'node:stream';
import { getSupabaseAdmin, VAULT_BUCKET } from './_lib/supabaseAdmin';

// Public, stable, same-domain URL for a vault file (e.g. for link previews /
// OG embeds), proxied from Supabase Storage's own public URL rather than
// redirecting to it directly.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const raw = req.query.path;
  const pathname = Array.isArray(raw) ? raw.join('/') : raw || '';

  if (!pathname || !pathname.startsWith('v/')) {
    return res.status(400).json({ error: 'Invalid path.' });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data: pub } = supabase.storage.from(VAULT_BUCKET).getPublicUrl(pathname);
    const upstream = await fetch(pub.publicUrl);
    if (!upstream.ok || !upstream.body) {
      return res.status(404).json({ error: 'File not found.' });
    }

    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/octet-stream');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.status(200);
    Readable.fromWeb(upstream.body as never).pipe(res);
  } catch {
    return res.status(404).json({ error: 'File not found.' });
  }
}
