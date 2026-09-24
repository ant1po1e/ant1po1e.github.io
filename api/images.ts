import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAuth } from './_lib/auth';
import { cookieReader } from './_lib/cookies';
import { getSupabaseAdmin, VAULT_BUCKET } from './_lib/supabaseAdmin';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!verifyAuth(cookieReader(req))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const supabase = getSupabaseAdmin();
    // Storage's own list() is the source of truth for the file list — same
    // approach the @vercel/blob version used, no separate metadata table.
    const { data, error } = await supabase.storage.from(VAULT_BUCKET).list('v', {
      limit: 1000,
      sortBy: { column: 'created_at', order: 'desc' },
    });
    if (error) throw error;

    const images = (data || [])
      .filter(f => f.id) // drop the occasional folder placeholder entry
      .map(f => {
        const pathname = `v/${f.name}`;
        const { data: pub } = supabase.storage.from(VAULT_BUCKET).getPublicUrl(pathname);
        return {
          url: pub.publicUrl,
          pathname,
          name: f.name,
          size: (f.metadata as { size?: number } | null)?.size ?? 0,
          uploadedAt: f.created_at || new Date().toISOString(),
        };
      });

    return res.status(200).json({ images });
  } catch (err) {
    console.error('images handler error:', err);
    return res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
}
