export const VERSION = '4.0.0';

export { getDefaultConfig, loadConfig } from './config.js';
export type { GGAConfig } from './config.js';
export { checkCache, writeCache, clearCache, getCacheStats } from './cache.js';
export type { CacheEntry, CacheStats } from './cache.js';
export { getStagedFiles } from './staged.js';
export type { StagedFile } from './staged.js';
export { extractRules } from './rules.js';
export { buildPrompt, parseResponse } from './review.js';
export type { ReviewIssue, ReviewResult } from './review.js';
export { getProvider } from './providers/index.js';
export { runHook } from './hook.js';
