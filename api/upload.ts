import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAuth } from './_lib/auth';
import { cookieReader } from './_lib/cookies';
import { getSupabaseAdmin, VAULT_BUCKET } from './_lib/supabaseAdmin';

// Replaces @vercel/blob's onBeforeGenerateToken/onUploadCompleted handshake.
// The client already reserved `pathname` via /api/slug (authenticated), so
// this just re-checks it targets the vault's own "v/" prefix and mints a
// short-lived signed upload URL the client can PUT the file to directly —
// the file bytes never pass through this function.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!verifyAuth(cookieReader(req))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const { pathname } = body;

  if (typeof pathname !== 'string' || !pathname.startsWith('v/')) {
    return res.status(400).json({ error: 'Invalid upload path.' });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.storage.from(VAULT_BUCKET).createSignedUploadUrl(pathname);
    if (error || !data) throw error || new Error('Could not create signed upload URL.');

    return res.status(200).json({ path: data.path, token: data.token });
  } catch (err) {
    console.error('upload handler error:', err);
    return res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
  }
}
