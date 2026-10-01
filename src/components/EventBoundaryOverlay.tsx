import React, { useEffect, useState } from 'react';
import { Plus, Timer, Sparkles, AlertCircle } from 'lucide-react';

export type BoundaryType = 'none' | 'fixation' | 'black' | 'visual_cue' | 'custom_text';

interface EventBoundaryOverlayProps {
  boundaryType: BoundaryType;
  durationSeconds: number;
  customText?: string;
  onBoundaryComplete: () => void;
  nextVideoTitle?: string;
}

export const EventBoundaryOverlay: React.FC<EventBoundaryOverlayProps> = ({
  boundaryType,
  durationSeconds,
  customText = "Event Boundary Pause...",
  onBoundaryComplete,
  nextVideoTitle,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(durationSeconds);

  useEffect(() => {
    setTimeLeft(durationSeconds);
    if (durationSeconds <= 0) {
      onBoundaryComplete();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(interval);
          onBoundaryComplete();
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [boundaryType, durationSeconds, onBoundaryComplete]);

  const progressPercentage = Math.max(0, Math.min(100, ((durationSeconds - timeLeft) / durationSeconds) * 100));

  if (boundaryType === 'none' || durationSeconds <= 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 select-none transition-all duration-300">
      {/* 1. Fixation Cross Boundary */}
      {boundaryType === 'fixation' && (
        <div className="flex flex-col items-center justify-center gap-6 animate-pulse">
          <div className="relative flex items-center justify-center">
            <Plus className="w-20 h-20 text-white stroke-[3]" />
            <div className="absolute w-32 h-32 rounded-full border border-white/20 animate-ping opacity-20" />
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <Timer className="w-3.5 h-3.5" />
            <span>FIXATION {timeLeft.toFixed(1)}s</span>
          </div>
        </div>
      )}

      {/* 2. Black Screen (Pure silence/pause) */}
      {boundaryType === 'black' && (
        <div className="w-full h-full bg-black flex items-end justify-center pb-8">
          <div className="text-[10px] font-mono text-gray-700 tracking-widest uppercase">
            [EVENT BOUNDARY - {timeLeft.toFixed(1)}s]
          </div>
        </div>
      )}

      {/* 3. Visual Cue / Boundary Marker */}
      {boundaryType === 'visual_cue' && (
        <div className="flex flex-col items-center justify-center gap-6 max-w-xs text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-xl backdrop-blur-md">
            <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">New Event Segment</h3>
            <p className="text-xs text-gray-400">
              Notice the context transition before the next video starts.
            </p>
            {nextVideoTitle && (
              <div className="mt-3 text-xs bg-indigo-950/60 text-indigo-200 border border-indigo-800/50 rounded-lg p-2 font-medium">
                Up next: <span className="font-semibold text-white">{nextVideoTitle}</span>
              </div>
            )}
          </div>
          <div className="w-48 bg-white/10 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-indigo-500 h-full transition-all ease-linear duration-100"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* 4. Custom Text Cue Boundary */}
      {boundaryType === 'custom_text' && (
        <div className="flex flex-col items-center justify-center gap-4 max-w-xs text-center">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-2">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white">{customText}</h3>
          <div className="text-xs font-mono text-amber-400 bg-amber-950/50 px-3 py-1 rounded border border-amber-800/40">
            Pause: {timeLeft.toFixed(1)}s remaining
          </div>
        </div>
      )}
    </div>
  );
};
