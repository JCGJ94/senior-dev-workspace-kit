import type { PresetConfig } from './preset.interface.js';
import { fullPedritoPreset } from './full-pedrito.js';
import { minimalPreset } from './minimal.js';

const PRESETS: Record<string, PresetConfig> = {
  [fullPedritoPreset.name]: fullPedritoPreset,
  [minimalPreset.name]: minimalPreset,
};

export function getPreset(name: string): PresetConfig {
  const preset = PRESETS[name];
  if (!preset) {
    throw new Error(`Unknown preset: ${name}`);
  }
  return preset;
}

export function listPresets(): PresetConfig[] {
  return Object.values(PRESETS);
}
