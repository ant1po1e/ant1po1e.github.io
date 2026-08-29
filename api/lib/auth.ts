import crypto from 'node:crypto';

export const COOKIE_NAME = 'vault_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error('AUTH_SECRET environment variable is not set. Add it in your Vercel project settings.');
  }
  return secret;
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', getSecret()).update(payload).digest('hex');
}

export function buildSessionCookieValue(): string {
  const expires = Date.now() + SESSION_TTL_SECONDS * 1000;
  const payload = `ok.${expires}`;
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export interface CookieAttributes {
  httpOnly: boolean;
  sameSite: 'Strict' | 'Lax' | 'None';
  path: string;
  maxAge: number;
  secure: boolean;
}

export function sessionCookieAttributes(): CookieAttributes {
  const isProd = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    sameSite: 'Strict',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
    secure: isProd,
  };
}

// Minimal structural type so verifyAuth doesn't depend on any particular
// request/cookie-parsing library — see api/lib/cookies.ts for the adapter.
export interface CookieReader {
  get(name: string): { value: string } | undefined;
}

export function verifyAuth(cookieStore: CookieReader): boolean {
  const value = cookieStore.get(COOKIE_NAME)?.value;
  if (!value) return false;

  const lastDot = value.lastIndexOf('.');
  if (lastDot === -1) return false;
  const payload = value.slice(0, lastDot);
  const signature = value.slice(lastDot + 1);

  let expected: string;
  try {
    expected = sign(payload);
  } catch {
    return false;
  }

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

  const [, expiresStr] = payload.split('.');
  const expires = Number(expiresStr);
  if (!expires || Date.now() > expires) return false;

  return true;
}

export function checkPassword(candidate: unknown): boolean {
  const real = process.env.SITE_PASSWORD;
  if (!real) {
    throw new Error('SITE_PASSWORD environment variable is not set. Add it in your Vercel project settings.');
  }
  if (typeof candidate !== 'string' || candidate.length === 0) return false;

  const a = Buffer.from(candidate);
  const b = Buffer.from(real);
  if (a.length !== b.length) {
    // still run a timing-safe compare against a same-length buffer to avoid
    // leaking length via timing, then return false
    crypto.timingSafeEqual(Buffer.alloc(b.length), Buffer.alloc(b.length));
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}
