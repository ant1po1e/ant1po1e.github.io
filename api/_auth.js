import crypto from "node:crypto";

const COOKIE_NAME = "vault_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "AUTH_SECRET environment variable is not set. Add it in your Vercel project settings."
    );
  }
  return secret;
}

function sign(payload) {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createSessionCookie() {
  const expires = Date.now() + SESSION_TTL_SECONDS * 1000;
  const payload = `ok.${expires}`;
  const signature = sign(payload);
  const value = `${payload}.${signature}`;
  const isProd = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
  const cookie = [
    `${COOKIE_NAME}=${value}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${SESSION_TTL_SECONDS}`,
    isProd ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
  return cookie;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;
}

function parseCookies(header) {
  const out = {};
  if (!header) return out;
  header.split(";").forEach((part) => {
    const [k, ...rest] = part.trim().split("=");
    if (k) out[k] = rest.join("=");
  });
  return out;
}

export function verifyAuth(request) {
  const cookies = parseCookies(request.headers.cookie);
  const value = cookies[COOKIE_NAME];
  if (!value) return false;

  const lastDot = value.lastIndexOf(".");
  if (lastDot === -1) return false;
  const payload = value.slice(0, lastDot);
  const signature = value.slice(lastDot + 1);

  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

  const [, expiresStr] = payload.split(".");
  const expires = Number(expiresStr);
  if (!expires || Date.now() > expires) return false;

  return true;
}

export function checkPassword(candidate) {
  const real = process.env.SITE_PASSWORD;
  if (!real) {
    throw new Error(
      "SITE_PASSWORD environment variable is not set. Add it in your Vercel project settings."
    );
  }
  if (typeof candidate !== "string" || candidate.length === 0) return false;

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
