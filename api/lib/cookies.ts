import type { VercelRequest } from '@vercel/node';
import type { CookieAttributes, CookieReader } from './auth';

export function parseCookies(req: VercelRequest): Record<string, string> {
  // Vercel's Node runtime usually pre-parses cookies onto req.cookies, but
  // fall back to a manual parse of the raw header so this stays robust
  // across runtime versions.
  if (req.cookies && Object.keys(req.cookies).length > 0) {
    return req.cookies as Record<string, string>;
  }

  const header = req.headers.cookie;
  const out: Record<string, string> = {};
  if (!header) return out;

  header.split(';').forEach(pair => {
    const idx = pair.indexOf('=');
    if (idx === -1) return;
    const key = pair.slice(0, idx).trim();
    const value = pair.slice(idx + 1).trim();
    if (key) {
      try {
        out[key] = decodeURIComponent(value);
      } catch {
        out[key] = value;
      }
    }
  });

  return out;
}

export function cookieReader(req: VercelRequest): CookieReader {
  const cookies = parseCookies(req);
  return {
    get(name: string) {
      const value = cookies[name];
      return value !== undefined ? { value } : undefined;
    },
  };
}

export function serializeCookie(name: string, value: string, attrs: CookieAttributes): string {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  parts.push(`Path=${attrs.path}`);
  parts.push(`Max-Age=${attrs.maxAge}`);
  parts.push(`SameSite=${attrs.sameSite}`);
  if (attrs.httpOnly) parts.push('HttpOnly');
  if (attrs.secure) parts.push('Secure');
  return parts.join('; ');
}
