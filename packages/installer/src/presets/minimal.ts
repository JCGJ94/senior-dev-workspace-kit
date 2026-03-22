import type { PresetConfig } from './preset.interface.js';

export const minimalPreset: PresetConfig = {
  name: 'minimal',
  description: 'Installs the project runtime with Claude Code essentials.',
  includePersona: false,
  includeEngram: true,
  includeGGA: false,
  includeMCP: false,
};
