/// <reference types="@cloudflare/workers-types" />

import type { Env } from './src/worker'

declare module '@cloudflare/vite-plugin' {
  interface WorkerBindings extends Env {}
} 