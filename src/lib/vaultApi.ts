import { supabase, VAULT_BUCKET } from './supabaseClient';

async function jsonFetch<T = unknown>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || `Request failed (${res.status})`);
  }
  return data as T;
}

export function checkSession() {
  return jsonFetch<{ authenticated: boolean }>('/api/me');
}

export function login(password: string) {
  return jsonFetch<{ ok: true }>('/api/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
}

export function logout() {
  return jsonFetch<{ ok: true }>('/api/logout', { method: 'POST' });
}

export interface VaultImage {
  url: string;
  pathname: string;
  name: string;
  size: number;
  uploadedAt: string;
}

export function fetchImages() {
  return jsonFetch<{ images: VaultImage[] }>('/api/images');
}

export function deleteImage(pathname: string) {
  return jsonFetch<{ ok: true }>('/api/delete', {
    method: 'POST',
    body: JSON.stringify({ pathname }),
  });
}

export interface AnonMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string | null;
  isAnonymous: boolean;
}

export function fetchMessages() {
  return jsonFetch<{ messages: AnonMessage[] }>('/api/messages');
}

function reserveSlug(ext: string) {
  return jsonFetch<{ pathname: string }>(`/api/slug?ext=${encodeURIComponent(ext)}`);
}

// Re-encodes an image file to WebP client-side using the canvas API, so
// every upload lands in storage already optimized. Animated GIFs are left
// untouched — canvas conversion would flatten them to a single frame.
function convertToWebP(file: File, quality = 0.85): Promise<File> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Canvas context unavailable'));
        return;
      }
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        blob => {
          URL.revokeObjectURL(objectUrl);
          if (!blob) {
            reject(new Error('WebP conversion failed'));
            return;
          }
          const newName = file.name.replace(/\.[^./\\]+$/, '') + '.webp';
          resolve(new File([blob], newName, { type: 'image/webp' }));
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Could not load image for conversion'));
    };

    img.src = objectUrl;
  });
}

// Only these raster formats get re-encoded to WebP. GIFs are skipped to
// keep animation, SVGs are already tiny vector text, and everything that
// isn't an image (video, audio, documents, archives, etc.) is uploaded as-is.
const WEBP_CONVERTIBLE_TYPES = new Set(['image/jpeg', 'image/png', 'image/bmp', 'image/tiff']);

function extFromFilename(name: string) {
  const match = /\.([a-zA-Z0-9]+)$/.exec(name);
  return match ? match[1].toLowerCase() : 'bin';
}

export interface VaultUploadResult {
  url: string;
  pathname: string;
}

// Two-step direct-to-storage upload, mirroring the old @vercel/blob flow:
// 1) reserve a free pathname (authenticated), 2) exchange it for a
// short-lived Supabase signed upload URL (authenticated), 3) PUT the file
// straight to Supabase Storage — the bytes never pass through our own
// serverless function, so there's no Vercel body-size limit to worry about.
export async function uploadFile(file: File, onProgress?: (percentage: number) => void): Promise<VaultUploadResult> {
  if (!supabase) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  const shouldConvert = WEBP_CONVERTIBLE_TYPES.has(file.type);
  const outFile = shouldConvert ? await convertToWebP(file) : file;
  const ext = shouldConvert ? 'webp' : extFromFilename(file.name);

  const { pathname } = await reserveSlug(ext);
  onProgress?.(10);

  const { path, token } = await jsonFetch<{ path: string; token: string }>('/api/upload', {
    method: 'POST',
    body: JSON.stringify({ pathname }),
  });
  onProgress?.(30);

  // supabase-js doesn't expose upload progress events (unlike
  // @vercel/blob's onUploadProgress), so we jump straight to 100% once the
  // PUT resolves rather than reporting granular percentages.
  const { error } = await supabase.storage.from(VAULT_BUCKET).uploadToSignedUrl(path, token, outFile, {
    contentType: outFile.type || 'application/octet-stream',
  });
  if (error) throw error;
  onProgress?.(100);

  const { data: pub } = supabase.storage.from(VAULT_BUCKET).getPublicUrl(path);
  return { url: pub.publicUrl, pathname: path };
}

// A short link under our own domain (e.g. https://yourdomain.com/i/v/foo.webp)
// instead of the raw Supabase Storage public URL.
export function toShareUrl(pathname: string) {
  const origin = window.location.origin.replace(/^(https?:\/\/)www\./, '$1');
  return `${origin}/i/${pathname}`;
}

export interface ShortLink {
  slug: string;
  url: string;
  createdAt: string;
  clicks: number;
}

export function fetchShortLinks() {
  return jsonFetch<{ links: ShortLink[] }>('/api/shortlinks');
}

export function createShortLink(url: string) {
  return jsonFetch<{ link: ShortLink }>('/api/shortlinks', {
    method: 'POST',
    body: JSON.stringify({ url }),
  });
}

export function deleteShortLink(slug: string) {
  return jsonFetch<{ ok: true }>('/api/shortlinks', {
    method: 'DELETE',
    body: JSON.stringify({ slug }),
  });
}

// The public-facing short URL (e.g. https://yourdomain.com/s/AbC123).
export function toShortUrl(slug: string) {
  const origin = window.location.origin.replace(/^(https?:\/\/)www\./, '$1');
  return `${origin}/s/${slug}`;
}
