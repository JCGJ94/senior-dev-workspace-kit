import { z } from 'zod';

export const PedritoProfileSchema = z.object({
  version: z.literal('1'),
  name: z.string().min(1),
  description: z.string().default(''),
  exportedAt: z.string(),
  config: z.object({
    preset: z.string(),
    agents: z.array(z.string()).default([]),
    mcp: z.array(z.string()).default([]),
    gga: z.boolean().default(false),
  }),
  metadata: z.object({
    source: z.string().optional(),
  }).optional(),
});

export type PedritoProfile = z.infer<typeof PedritoProfileSchema>;

export class ProfileVersionError extends Error {
  constructor(version: string) {
    super(`Unsupported profile version: ${version}`);
  }
}

export class FetchError extends Error {
  constructor(target: string) {
    super(`Failed to fetch profile: ${target}`);
  }
}

export class NotInstalledError extends Error {
  constructor() {
    super('Pedrito is not installed yet');
  }
}
