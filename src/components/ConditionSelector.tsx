import React, { useState } from 'react';
import { Settings, Check, Copy, Sliders, Play, RotateCcw, X, Info } from 'lucide-react';
import type { ExperimentSettings } from '../hooks/useExperimentState';
import { EXPERIMENT_PRESETS, buildShareableURL } from '../utils/urlState';
import type { BoundaryType } from './EventBoundaryOverlay';

interface ConditionSelectorProps {
  currentSettings: ExperimentSettings;
  onApplySettings: (settings: ExperimentSettings) => void;
  onReset: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ConditionSelector: React.FC<ConditionSelectorProps> = ({
  currentSettings,
  onApplySettings,
  onReset,
  isOpen,
  onClose,
}) => {
  const [settings, setSettings] = useState<ExperimentSettings>(currentSettings);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handlePresetSelect = (presetId: string) => {
    const preset = EXPERIMENT_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setSettings(preset.settings);
    }
  };

  const handleCopyLink = () => {
    const url = buildShareableURL(settings);
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleStart = () => {
    onApplySettings(settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl text-white flex flex-col gap-6 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-500">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Experiment Condition Setup</h2>
              <p className="text-xs text-zinc-400">Event Boundary & Recall Testing Controls</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Presets */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5 text-zinc-400" />
            Quick Experimental Presets
          </label>
          <div className="grid grid-cols-1 gap-2.5">
            {EXPERIMENT_PRESETS.map((preset) => {
              const isSelected =
                settings.pauseDuration === preset.settings.pauseDuration &&
                settings.boundaryType === preset.settings.boundaryType &&
                settings.autoAdvance === preset.settings.autoAdvance;

              return (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-start justify-between ${
                    isSelected
                      ? 'bg-red-950/40 border-red-500/80 shadow-md shadow-red-950/20'
                      : 'bg-zinc-800/50 border-zinc-700/60 hover:bg-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  <div className="pr-3">
                    <div className="font-semibold text-sm text-zinc-100 mb-0.5">{preset.name}</div>
                    <div className="text-xs text-zinc-400 leading-snug">{preset.description}</div>
                  </div>
                  {isSelected && <Check className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Custom Parameters */}
        <div className="flex flex-col gap-4 bg-zinc-950 p-4 rounded-xl border border-zinc-800/80">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Custom Parameter Fine-Tuning
          </div>

          {/* Pause Duration Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-300 font-medium">Inter-Video Pause Duration</span>
              <span className="text-red-400 font-mono font-bold">{settings.pauseDuration} seconds</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={settings.pauseDuration}
              onChange={(e) => setSettings({ ...settings, pauseDuration: Number(e.target.value) })}
              className="w-full accent-red-500 h-2 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Boundary Visual Type Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-300 font-medium">Event Boundary Stimulus Type</label>
            <select
              value={settings.boundaryType}
              onChange={(e) => setSettings({ ...settings, boundaryType: e.target.value as BoundaryType })}
              className="bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-red-500"
            >
              <option value="none">None (Instant Cut / Baseline)</option>
              <option value="fixation">Fixation Cross (+ Visual Anchor)</option>
              <option value="black">Black Screen (Silent Interval)</option>
              <option value="visual_cue">Visual Context Cue (Segment Transition)</option>
              <option value="custom_text">Custom Text Overlay Message</option>
            </select>
          </div>

          {/* Custom Text Option if selected */}
          {settings.boundaryType === 'custom_text' && (
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-400">Custom Boundary Text</label>
              <input
                type="text"
                value={settings.customBoundaryText || ''}
                onChange={(e) => setSettings({ ...settings, customBoundaryText: e.target.value })}
                className="bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-xs text-white"
                placeholder="e.g. Pause for memory consolidation..."
              />
            </div>
          )}

          {/* Auto Advance Toggle */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-zinc-300 font-medium">Auto-Advance Video Feed</span>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, autoAdvance: !settings.autoAdvance })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoAdvance ? 'bg-red-600' : 'bg-zinc-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.autoAdvance ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Shareable Link Box */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs text-zinc-400">
            <span className="flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              Direct Participant Share Link:
            </span>
          </div>
          <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-xl border border-zinc-800">
            <input
              type="text"
              readOnly
              value={buildShareableURL(settings)}
              className="bg-transparent text-xs text-zinc-400 font-mono flex-1 overflow-hidden truncate outline-none px-2"
            />
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold transition-colors shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => {
              onReset();
              onClose();
            }}
            className="flex-1 py-3 px-4 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Trial
          </button>
          <button
            onClick={handleStart}
            className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            Start Session
          </button>
        </div>
      </div>
    </div>
  );
};
