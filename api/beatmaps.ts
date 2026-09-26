import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAuth } from './_lib/auth';
import { cookieReader } from './_lib/cookies';
import { getSupabaseAdmin } from './_lib/supabaseAdmin';

// Keep in sync with BADGE_STYLE in src/pages/BeatmapsPage.tsx.
const KNOWN_BADGES = ['ranked', 'tournaments', 'contest', 'hs', 'collab', 'gd'];

function parseBody(req: VercelRequest): Record<string, unknown> {
  let body: unknown = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  return (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
}

interface BeatmapRow {
  id: string;
  link: string;
  title: string;
  artist: string;
  badges: string[] | null;
  last_updated: string;
}

function toBeatmap(row: BeatmapRow) {
  return {
    id: row.id,
    link: row.link,
    title: row.title,
    artist: row.artist,
    badges: row.badges || [],
    lastUpdated: row.last_updated,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!verifyAuth(cookieReader(req))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (err) {
    console.error('beatmaps handler: Supabase client init failed:', err);
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Supabase is not configured.' });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('beatmaps')
      .select('id, link, title, artist, badges, last_updated')
      .order('last_updated', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ beatmaps: (data || []).map(toBeatmap) });
  }

  if (req.method === 'POST') {
    const body = parseBody(req);
    const link = typeof body.link === 'string' ? body.link.trim() : '';
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const artist = typeof body.artist === 'string' ? body.artist.trim() : '';
    const badges = Array.isArray(body.badges)
      ? body.badges.filter((b): b is string => typeof b === 'string' && KNOWN_BADGES.includes(b))
      : [];

    if (!link || !title || !artist) {
      return res.status(400).json({ error: 'link, title and artist are required.' });
    }

    const { data, error } = await supabase
      .from('beatmaps')
      .insert({ link, title, artist, badges, last_updated: new Date().toISOString() })
      .select('id, link, title, artist, badges, last_updated')
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ beatmap: toBeatmap(data) });
  }

  if (req.method === 'DELETE') {
    const body = parseBody(req);
    const id = typeof body.id === 'string' ? body.id : '';
    if (!id) return res.status(400).json({ error: 'Missing id.' });

    const { error } = await supabase.from('beatmaps').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', 'GET, POST, DELETE');
  return res.status(405).json({ error: 'Method not allowed.' });
}
