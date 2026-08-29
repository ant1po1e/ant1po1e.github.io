/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BEATMAP_FEED_URL?: string;
  readonly VITE_CONTACT_FORM_SCRIPT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
