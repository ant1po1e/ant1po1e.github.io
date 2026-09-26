import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAuth } from './_lib/auth';
import { cookieReader } from './_lib/cookies';

const TOKEN_URL = 'https://osu.ppy.sh/oauth/token';

interface CachedToken {
  value: string;
  expiresAt: number;
}

// Module-level cache — survives across invocations on a warm serverless
// instance, avoiding a token request on every single lookup.
let cachedToken: CachedToken | null = null;

async function getOsuToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.value;
  }

  const clientId = process.env.OSU_CLIENT_ID;
  const clientSecret = process.env.OSU_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('OSU_CLIENT_ID / OSU_CLIENT_SECRET environment variables are not set.');
  }

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
      scope: 'public',
    }),
  });
  if (!res.ok) {
    throw new Error(`osu! token request failed (${res.status}). Check OSU_CLIENT_ID / OSU_CLIENT_SECRET.`);
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return cachedToken.value;
}

function extractBeatmapsetId(link: string): string | null {
  const match = /beatmapsets\/(\d+)/.exec(link);
  return match ? match[1] : null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!verifyAuth(cookieReader(req))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const link = typeof req.query.link === 'string' ? req.query.link : '';
  const beatmapsetId = extractBeatmapsetId(link);
  if (!beatmapsetId) {
    return res.status(400).json({ error: 'Could not find a beatmapset ID in that link.' });
  }

  try {
    const token = await getOsuToken();
    const upstream = await fetch(`https://osu.ppy.sh/api/v2/beatmapsets/${beatmapsetId}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });

    if (upstream.status === 404) {
      return res.status(404).json({ error: 'Beatmapset not found on osu!.' });
    }
    if (!upstream.ok) {
      throw new Error(`osu! API request failed (${upstream.status})`);
    }

    const data = (await upstream.json()) as { title?: string; artist?: string };
    return res.status(200).json({ title: data.title || '', artist: data.artist || '' });
  } catch (err) {
    console.error('beatmap-meta handler error:', err);
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to fetch beatmap metadata.' });
  }
}
