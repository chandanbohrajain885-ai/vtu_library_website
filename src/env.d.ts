/// <reference path="../.astro/types.d.ts" />

declare global {
  interface SDKTypeMode {
    strict: true;
  }
}

// Environment variables type definitions
interface ImportMetaEnv {
  readonly VITE_HEYGEN_API_KEY: string;
  readonly VITE_HEYGEN_AVATAR_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
