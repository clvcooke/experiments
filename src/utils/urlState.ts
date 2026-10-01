import type { ExperimentSettings } from '../hooks/useExperimentState';
import { DEFAULT_SETTINGS } from '../hooks/useExperimentState';
import type { BoundaryType } from '../components/EventBoundaryOverlay';

export interface ConditionPreset {
  id: string;
  name: string;
  description: string;
  settings: ExperimentSettings;
}

export const EXPERIMENT_PRESETS: ConditionPreset[] = [
  {
    id: 'control_seamless',
    name: 'Control: Seamless Flow',
    description: '0s pause between videos with direct transition. Baseline condition.',
    settings: {
      pauseDuration: 0,
      boundaryType: 'none',
      autoAdvance: true,
      presetName: 'Control: Seamless Flow',
    },
  },
  {
    id: 'fixation_short',
    name: 'Condition A: 2s Fixation Cross',
    description: '2s fixation cross between videos to anchor visual focus at event boundary.',
    settings: {
      pauseDuration: 2,
      boundaryType: 'fixation',
      autoAdvance: true,
      presetName: 'Condition A: 2s Fixation Cross',
    },
  },
  {
    id: 'black_screen_long',
    name: 'Condition B: 5s Black Screen Pause',
    description: '5s silent black screen pause allowing complete cognitive reset.',
    settings: {
      pauseDuration: 5,
      boundaryType: 'black',
      autoAdvance: true,
      presetName: 'Condition B: 5s Black Screen Pause',
    },
  },
  {
    id: 'visual_cue_boundary',
    name: 'Condition C: Visual Context Cue',
    description: '3s animated boundary cue signaling category change and upcoming video.',
    settings: {
      pauseDuration: 3,
      boundaryType: 'visual_cue',
      autoAdvance: true,
      presetName: 'Condition C: Visual Context Cue',
    },
  },
  {
    id: 'manual_swipe_control',
    name: 'Condition D: Manual Participant Swipe',
    description: 'No auto-advance. Participant must manually swipe/tap to proceed.',
    settings: {
      pauseDuration: 0,
      boundaryType: 'none',
      autoAdvance: false,
      presetName: 'Condition D: Manual Participant Swipe',
    },
  },
];

export function getSettingsFromURL(): ExperimentSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;

  const params = new URLSearchParams(window.location.search);
  const pause = params.get('pause');
  const boundary = params.get('boundary');
  const autoAdvance = params.get('autoAdvance');
  const customText = params.get('customText');
  const presetId = params.get('preset');

  if (presetId) {
    const matched = EXPERIMENT_PRESETS.find((p) => p.id === presetId);
    if (matched) return matched.settings;
  }

  const validBoundaries: BoundaryType[] = ['none', 'fixation', 'black', 'visual_cue', 'custom_text'];
  const parsedBoundary = validBoundaries.includes(boundary as BoundaryType) ? (boundary as BoundaryType) : DEFAULT_SETTINGS.boundaryType;
  const parsedPause = pause !== null && !isNaN(Number(pause)) ? Number(pause) : DEFAULT_SETTINGS.pauseDuration;
  const parsedAuto = autoAdvance !== null ? autoAdvance === 'true' : DEFAULT_SETTINGS.autoAdvance;

  return {
    pauseDuration: parsedPause,
    boundaryType: parsedBoundary,
    autoAdvance: parsedAuto,
    customBoundaryText: customText || DEFAULT_SETTINGS.customBoundaryText,
    presetName: 'Custom Share Link',
  };
}

export function buildShareableURL(settings: ExperimentSettings): string {
  if (typeof window === 'undefined') return '';

  const matchedPreset = EXPERIMENT_PRESETS.find(
    (p) =>
      p.settings.pauseDuration === settings.pauseDuration &&
      p.settings.boundaryType === settings.boundaryType &&
      p.settings.autoAdvance === settings.autoAdvance
  );

  const url = new URL(window.location.href);
  url.search = ''; // clear existing query params

  if (matchedPreset) {
    url.searchParams.set('preset', matchedPreset.id);
  } else {
    url.searchParams.set('pause', settings.pauseDuration.toString());
    url.searchParams.set('boundary', settings.boundaryType);
    url.searchParams.set('autoAdvance', settings.autoAdvance.toString());
    if (settings.customBoundaryText) {
      url.searchParams.set('customText', settings.customBoundaryText);
    }
  }

  return url.toString();
}
