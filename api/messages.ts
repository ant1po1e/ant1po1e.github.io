import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAuth } from './_lib/auth';
import { cookieReader } from './_lib/cookies';

const ANON_EMAIL = 'anonymous@antipole.my.id';

type RawRow = Record<string, unknown>;

function pick(row: RawRow, keys: string[]): string {
  for (const key of Object.keys(row)) {
    if (keys.includes(key.toLowerCase().trim())) {
      const value = row[key];
      if (value !== null && value !== undefined && value !== '') return String(value);
    }
  }
  return '';
}

function normalize(row: RawRow, index: number) {
  const name = pick(row, ['name', 'nama']);
  const email = pick(row, ['email', 'e-mail']);
  const message = pick(row, ['message', 'pesan', 'msg', 'comment']);
  const timestampRaw = pick(row, ['timestamp', 'date', 'time', 'waktu', 'tanggal']);

  let timestamp: string | null = null;
  if (timestampRaw) {
    const parsed = new Date(timestampRaw);
    timestamp = Number.isNaN(parsed.getTime()) ? timestampRaw : parsed.toISOString();
  }

  return {
    id: `${index}-${timestampRaw || name || index}`,
    name: name || 'Unknown',
    email,
    message,
    timestamp,
    isAnonymous: email.toLowerCase() === ANON_EMAIL,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!verifyAuth(cookieReader(req))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Server-only env var — deliberately separate from the client-exposed
  // VITE_CONTACT_FORM_SCRIPT used to submit the form, since this one reads
  // back everyone's messages and should never ship in the client bundle.
  const scriptURL = process.env.CONTACT_MESSAGES_FEED_URL || process.env.CONTACT_FORM_SCRIPT;
  if (!scriptURL) {
    return res.status(500).json({ error: 'CONTACT_MESSAGES_FEED_URL is not configured.' });
  }

  try {
    const response = await fetch(scriptURL, { cache: 'no-store' });
    const data = await response.json();

    if (!response.ok) {
      console.error('Google Script Error:', data);
      return res.status(502).json({ error: 'Failed to load messages from the sheet.' });
    }

    const rows: RawRow[] = Array.isArray(data)
      ? data
      : Array.isArray((data as { messages?: unknown }).messages)
      ? (data as { messages: RawRow[] }).messages
      : Array.isArray((data as { rows?: unknown }).rows)
      ? (data as { rows: RawRow[] }).rows
      : [];

    const messages = rows
      .map((row, index) => normalize(row, index))
      .filter(m => m.message || m.name)
      .reverse();

    return res.status(200).json({ messages });
  } catch (err) {
    console.error('messages handler error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
