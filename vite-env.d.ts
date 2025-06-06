/// <reference types="vite/client" />
/// <reference types="@cloudflare/workers-types" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  // Add more env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 