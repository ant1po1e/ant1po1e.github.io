import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAuth } from './_lib/auth';
import { cookieReader } from './_lib/cookies';
import { getSupabaseAdmin } from './_lib/supabaseAdmin';

// No 0/O/1/I/l — avoids ambiguous-looking short links.
const SLUG_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
const UNIQUE_VIOLATION = '23505';

interface ShortLinkRow {
  slug: string;
  url: string;
  created_at: string;
  clicks: number;
}

function randomSlug(length = 6): string {
  let out = '';
  for (let i = 0; i < length; i++) {
    out += SLUG_CHARS[Math.floor(Math.random() * SLUG_CHARS.length)];
  }
  return out;
}

function isValidUrl(value: unknown): value is string {
  if (typeof value !== 'string' || value.length === 0 || value.length > 2048) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

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

function toShortLink(row: ShortLinkRow) {
  return { slug: row.slug, url: row.url, createdAt: row.created_at, clicks: row.clicks };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (err) {
    console.error('shortlinks handler: Supabase client init failed:', err);
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Supabase is not configured.' });
  }

  // Public redirect: /s/:slug is rewritten (see vercel.json) to
  // /api/shortlinks?redirect=:slug — no auth required for this branch.
  const redirectSlug = typeof req.query.redirect === 'string' ? req.query.redirect : '';
  if (redirectSlug) {
    const { data: match } = await supabase
      .from('shortlinks')
      .select('slug, url, clicks')
      .eq('slug', redirectSlug)
      .maybeSingle();

    if (!match) {
      return res.status(404).json({ error: 'Short link not found.' });
    }

    // Best-effort click counter — never let this delay or block the redirect.
    void supabase
      .from('shortlinks')
      .update({ clicks: match.clicks + 1 })
      .eq('slug', redirectSlug)
      .then(() => {}, () => {});

    res.setHeader('Cache-Control', 'no-store');
    return res.redirect(302, match.url);
  }

  // Everything else (list / create / delete) is vault-only.
  if (!verifyAuth(cookieReader(req))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('shortlinks')
      .select('slug, url, created_at, clicks')
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ links: (data || []).map(toShortLink) });
  }

  if (req.method === 'POST') {
    const body = parseBody(req);
    if (!isValidUrl(body.url)) {
      return res.status(400).json({ error: 'Please provide a valid http(s) URL.' });
    }

    // Rely on the slug's primary-key uniqueness constraint to resolve
    // collisions atomically, rather than reading the whole table first.
    let attempts = 0;
    while (attempts < 10) {
      const slug = randomSlug();
      const { data, error } = await supabase
        .from('shortlinks')
        .insert({ slug, url: body.url, clicks: 0 })
        .select('slug, url, created_at, clicks')
        .single();

      if (!error && data) {
        return res.status(200).json({ link: toShortLink(data) });
      }
      if (error && error.code !== UNIQUE_VIOLATION) {
        return res.status(500).json({ error: error.message });
      }
      attempts += 1;
    }

    return res.status(500).json({ error: 'Could not generate a unique slug, please try again.' });
  }

  if (req.method === 'DELETE') {
    const body = parseBody(req);
    if (typeof body.slug !== 'string' || !body.slug) {
      return res.status(400).json({ error: 'Missing slug.' });
    }
    const { error } = await supabase.from('shortlinks').delete().eq('slug', body.slug);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', 'GET, POST, DELETE');
  return res.status(405).json({ error: 'Method not allowed.' });
}
