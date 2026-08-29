import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    define: {
      // Allow the frontend to read these two Vercel env vars even though
      // they don't have the VITE_ prefix Vite normally requires. This keeps
      // a single variable (e.g. CONTACT_FORM_SCRIPT) shared between the
      // frontend form submission and the backend /api/messages reader,
      // instead of needing two separately-named copies in Vercel.
      'import.meta.env.VITE_CONTACT_FORM_SCRIPT': JSON.stringify(
        process.env.VITE_CONTACT_FORM_SCRIPT || process.env.CONTACT_FORM_SCRIPT || ''
      ),
      'import.meta.env.VITE_BEATMAP_FEED_URL': JSON.stringify(
        process.env.VITE_BEATMAP_FEED_URL || process.env.BEATMAP_FEED_URL || ''
      ),
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
