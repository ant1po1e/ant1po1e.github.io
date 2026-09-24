import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAuth } from './_lib/auth';
import { cookieReader } from './_lib/cookies';
import { getSupabaseAdmin } from './_lib/supabaseAdmin';

const ANON_EMAIL = 'anonymous@antipole.my.id';
const MAX_LEN = { name: 200, email: 320, message: 5000 };

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (err) {
    // Most likely cause: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY isn't set
    // (or isn't enabled for this environment) in Vercel project settings.
    console.error('messages handler: Supabase client init failed:', err);
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Supabase is not configured.' });
  }

  if (req.method === 'POST') {
    // Public contact-form submission — replaces the old direct-from-browser
    // POST to a Google Apps Script URL. No auth required, but every field
    // is trimmed and length-capped before it touches the database.
    const body = parseBody(req);
    const isAnonymous = body.anonymous === true || body.anonymous === 'true';
    const name = typeof body.name === 'string' ? body.name.trim().slice(0, MAX_LEN.name) : '';
    const email = isAnonymous
      ? ANON_EMAIL
      : typeof body.email === 'string'
      ? body.email.trim().slice(0, MAX_LEN.email)
      : '';
    const message = typeof body.message === 'string' ? body.message.trim().slice(0, MAX_LEN.message) : '';

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'name, email and message are required.' });
    }

    const { error } = await supabase.from('messages').insert({ name, email, message, is_anonymous: isAnonymous });
    if (error) {
      console.error('messages insert error:', error);
      return res.status(500).json({ error: 'Could not save your message. Please try again later.' });
    }
    return res.status(200).json({ ok: true });
  }

  // Reading the inbox is vault-only.
  if (!verifyAuth(cookieReader(req))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { data, error } = await supabase
    .from('messages')
    .select('id, name, email, message, is_anonymous, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('messages select error:', error);
    return res.status(500).json({ error: 'Failed to load messages.' });
  }

  const messages = (data || []).map(row => ({
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    timestamp: row.created_at,
    isAnonymous: row.is_anonymous || row.email?.toLowerCase() === ANON_EMAIL,
  }));

  return res.status(200).json({ messages });
}
