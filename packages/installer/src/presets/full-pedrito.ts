import type { PresetConfig } from './preset.interface.js';

export const fullPedritoPreset: PresetConfig = {
  name: 'full-pedrito',
  description: 'Installs project runtime, persona, Engram, GGA and MCP placeholders.',
  includePersona: true,
  includeEngram: true,
  includeGGA: true,
  includeMCP: true,
};
