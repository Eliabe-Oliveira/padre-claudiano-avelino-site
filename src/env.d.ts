/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly CONTACT_EMAIL?: string;
  readonly SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
