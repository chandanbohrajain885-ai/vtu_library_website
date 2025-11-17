/// <reference path="../.astro/types.d.ts" />

declare global {
  interface SDKTypeMode {
    strict: true;
  }
}

// Environment variables type definitions
// Copy .env.example to .env and configure your HeyGen credentials
interface ImportMetaEnv {
  readonly VITE_HEYGEN_API_KEY: string;
  readonly VITE_HEYGEN_AVATAR_ID: string;
  readonly BASE_NAME: string;
  readonly NODE_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
