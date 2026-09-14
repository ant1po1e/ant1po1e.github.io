import type { VercelRequest, VercelResponse } from '@vercel/node';
import { head, put } from '@vercel/blob';
import { verifyAuth } from './_lib/auth';
import { cookieReader } from './_lib/cookies';

// All short links live in a single JSON "index" blob rather than one blob
// per link — this keeps reads (the vault table) to a single fetch instead
// of N, and keeps this feature to exactly one Serverless Function (see
// below: create / list / delete / redirect are all handled right here).
const INDEX_PATHNAME = 'shortlinks/index.json';

// No 0/O/1/I/l — avoids ambiguous-looking short links.
const SLUG_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

interface ShortLinkRecord {
  slug: string;
  url: string;
  createdAt: string;
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

async function readIndex(): Promise<ShortLinkRecord[]> {
  try {
    const meta = await head(INDEX_PATHNAME);
    const upstream = await fetch(meta.url, { cache: 'no-store' });
    if (!upstream.ok) return [];
    const data = await upstream.json();
    return Array.isArray(data) ? (data as ShortLinkRecord[]) : [];
  } catch {
    // Blob doesn't exist yet (first link ever created) — treat as empty.
    return [];
  }
}

async function writeIndex(records: ShortLinkRecord[]): Promise<void> {
  await put(INDEX_PATHNAME, JSON.stringify(records), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Public redirect: /s/:slug is rewritten (see vercel.json) to
  // /api/shortlinks?redirect=:slug — no auth required for this branch.
  const redirectSlug = typeof req.query.redirect === 'string' ? req.query.redirect : '';
  if (redirectSlug) {
    const records = await readIndex();
    const match = records.find(r => r.slug === redirectSlug);
    if (!match) {
      return res.status(404).json({ error: 'Short link not found.' });
    }

    // Best-effort click counter — never let this delay or block the redirect.
    void writeIndex(
      records.map(r => (r.slug === redirectSlug ? { ...r, clicks: r.clicks + 1 } : r)),
    ).catch(() => {});

    res.setHeader('Cache-Control', 'no-store');
    return res.redirect(302, match.url);
  }

  // Everything else (list / create / delete) is vault-only.
  if (!verifyAuth(cookieReader(req))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const records = await readIndex();
    records.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return res.status(200).json({ links: records });
  }

  if (req.method === 'POST') {
    const body = parseBody(req);
    if (!isValidUrl(body.url)) {
      return res.status(400).json({ error: 'Please provide a valid http(s) URL.' });
    }

    const records = await readIndex();
    const existingSlugs = new Set(records.map(r => r.slug));
    let slug = randomSlug();
    let attempts = 0;
    while (existingSlugs.has(slug) && attempts < 10) {
      slug = randomSlug();
      attempts += 1;
    }

    const record: ShortLinkRecord = {
      slug,
      url: body.url as string,
      createdAt: new Date().toISOString(),
      clicks: 0,
    };
    await writeIndex([record, ...records]);
    return res.status(200).json({ link: record });
  }

  if (req.method === 'DELETE') {
    const body = parseBody(req);
    if (typeof body.slug !== 'string' || !body.slug) {
      return res.status(400).json({ error: 'Missing slug.' });
    }
    const records = await readIndex();
    await writeIndex(records.filter(r => r.slug !== body.slug));
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', 'GET, POST, DELETE');
  return res.status(405).json({ error: 'Method not allowed.' });
}
