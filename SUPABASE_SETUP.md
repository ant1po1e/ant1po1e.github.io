# Migrasi ke Supabase

Proyek ini sekarang memakai **Supabase** (Postgres + Storage) untuk menggantikan:

- Google Sheets (`VITE_BEATMAP_FEED_URL`, `CONTACT_MESSAGES_FEED_URL`) → tabel `beatmaps` dan `messages`
- `@vercel/blob` (vault image storage) → Supabase Storage bucket `vault`
- Index JSON blob untuk link shortener → tabel `shortlinks`

Login vault (password + signed cookie di `api/_lib/auth.ts`) **tidak diubah** — tetap pakai `SITE_PASSWORD` dan `AUTH_SECRET` seperti sebelumnya.

## 1. Buat project Supabase

1. Buka https://supabase.com/dashboard dan buat project baru.
2. Buka **Project Settings → API**, catat:
   - `Project URL` → `SUPABASE_URL` / `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ rahasia, jangan pernah pakai prefix `VITE_`)

## 2. Jalankan schema

Buka **SQL Editor** di dashboard Supabase, paste isi `supabase/schema.sql`, lalu jalankan. Ini akan membuat:

- Tabel `messages` (insert publik, select hanya lewat service role)
- Tabel `beatmaps` (select publik)
- Tabel `shortlinks` (select publik, tapi tulis tetap lewat service role)
- Storage bucket `vault` (publik, untuk file vault)

## 3. Isi data beatmaps (opsional)

Tabel `beatmaps` menggantikan spreadsheet lama. Isi manual lewat **Table Editor** di Supabase, kolom: `link`, `title`, `artist`, `badges` (array teks, contoh `{"Ranked","Loved"}`).

## 4. Set environment variables

Salin `.env.example` → `.env` (lokal) dan isi juga di **Vercel → Project Settings → Environment Variables**:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
SITE_PASSWORD=...
AUTH_SECRET=...
```

`VITE_SUPABASE_URL` dan `SUPABASE_URL` nilainya sama, begitu pula `SUPABASE_SERVICE_ROLE_KEY` selalu server-only.

## 5. Install & jalankan

```bash
pnpm install
pnpm dev
```

## 6. Migrasi data lama (opsional, sekali jalan)

Kalau kamu sudah punya data lama (file di Vercel Blob, `shortlinks/index.json`, pesan di Google Sheet), pakai `scripts/migrate-to-supabase.mjs`:

```bash
npm install @vercel/blob --no-save   # sementara, cuma buat script ini
cp scripts/.env.migrate.example scripts/.env.migrate
# isi scripts/.env.migrate: OLD_BLOB_READ_WRITE_TOKEN, OLD_CONTACT_MESSAGES_FEED_URL,
# SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
node --env-file=scripts/.env.migrate scripts/migrate-to-supabase.mjs
```

Script ini mindahin tiga hal sekaligus: file vault, index shortlinks, dan pesan kontak. Aman dijalankan berkali-kali (tidak akan duplikat). Setelah selesai dan sudah dicek datanya muncul di Supabase, boleh `npm uninstall @vercel/blob` lagi.


| Fitur | Sebelum | Sesudah |
|---|---|---|
| Beatmaps ("map") | fetch client-side ke Google Apps Script (`VITE_BEATMAP_FEED_URL`) | `supabase.from('beatmaps').select()` langsung dari browser (anon key, RLS select-only) |
| Contact messages | Form POST langsung ke Google Apps Script; admin baca via `CONTACT_MESSAGES_FEED_URL` | Form POST ke `/api/messages` (insert ke tabel `messages`); admin baca via `GET /api/messages` (service role) |
| Vault images | `@vercel/blob` upload/list/delete | Supabase Storage bucket `vault`: `/api/slug` cek nama bebas, `/api/upload` bikin signed upload URL, client upload langsung ke Storage, `/api/images` & `/api/delete` pakai service role |
| Link shortener | 1 JSON index blob (`shortlinks/index.json`) | Tabel `shortlinks`, slug unik dijamin oleh primary key |

Tidak ada perubahan pada kontrak `src/lib/vaultApi.ts` yang dipakai komponen UI (`VaultPage`, `UploadZone`, `MessagesSection`, `LinkShortener`, dll), kecuali:

- `deleteImage(url)` → `deleteImage(pathname)` (dan `VaultImage.pathname` yang dipakai, bukan `url`)
- Return type upload berubah dari `PutBlobResult` (`@vercel/blob`) menjadi `VaultUploadResult` (`{ url, pathname }`) — field yang dipakai UI sama saja.
