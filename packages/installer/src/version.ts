// PEDRITO_VERSION is injected at compile time via `bun build --define "PEDRITO_VERSION=..."`.
// In development (bun run src/cli.ts), the declare is undefined so the fallback kicks in.
declare const PEDRITO_VERSION: string;

export const VERSION =
  typeof PEDRITO_VERSION !== 'undefined' ? PEDRITO_VERSION : '5.0.0-dev';
