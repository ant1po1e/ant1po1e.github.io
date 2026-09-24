import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAuth } from './_lib/auth';
import { cookieReader } from './_lib/cookies';
import { getSupabaseAdmin, VAULT_BUCKET } from './_lib/supabaseAdmin';

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

  if (!pathname || typeof pathname !== 'string' || !pathname.startsWith('v/')) {
    return res.status(400).json({ error: 'Invalid file path.' });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.storage.from(VAULT_BUCKET).remove([pathname]);
    if (error) throw error;
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('delete handler error:', err);
    return res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
}
