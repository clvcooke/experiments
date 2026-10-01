import { useState, useCallback, useRef, useEffect } from 'react';
import type { VideoItem } from '../data/videos';
import type { BoundaryType } from '../components/EventBoundaryOverlay';

export interface ExperimentSettings {
  pauseDuration: number; // in seconds, e.g. 0, 2, 5
  boundaryType: BoundaryType; // 'none' | 'fixation' | 'black' | 'visual_cue' | 'custom_text'
  autoAdvance: boolean; // true = automatically proceed after boundary, false = user swipe
  customBoundaryText?: string;
  presetName?: string;
}

export interface WatchLog {
  videoId: string;
  videoTitle: string;
  watchDurationSeconds: number;
  completedAt: string;
  boundaryType: BoundaryType;
  pauseDuration: number;
}

export const DEFAULT_SETTINGS: ExperimentSettings = {
  pauseDuration: 2,
  boundaryType: 'fixation',
  autoAdvance: true,
  customBoundaryText: 'Event Boundary Pause...',
  presetName: 'Standard Fixation (2s)',
};

export const useExperimentState = (videos: VideoItem[], initialSettings: ExperimentSettings = DEFAULT_SETTINGS) => {
  const [settings, setSettings] = useState<ExperimentSettings>(initialSettings);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [inBoundary, setInBoundary] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [logs, setLogs] = useState<WatchLog[]>([]);

  const videoStartTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    videoStartTimeRef.current = Date.now();
  }, [currentIndex]);

  const logCurrentVideoWatch = useCallback(() => {
    const currentVid = videos[currentIndex];
    if (!currentVid) return;

    const watchTimeSec = (Date.now() - videoStartTimeRef.current) / 1000;
    const newLog: WatchLog = {
      videoId: currentVid.id,
      videoTitle: currentVid.title,
      watchDurationSeconds: Math.round(watchTimeSec * 10) / 10,
      completedAt: new Date().toISOString(),
      boundaryType: settings.boundaryType,
      pauseDuration: settings.pauseDuration,
    };

    setLogs((prev) => [...prev, newLog]);
  }, [currentIndex, videos, settings]);

  const handleVideoEnded = useCallback(() => {
    logCurrentVideoWatch();

    const isLastVideo = currentIndex >= videos.length - 1;

    if (settings.pauseDuration > 0 && settings.boundaryType !== 'none') {
      setInBoundary(true);
    } else {
      if (isLastVideo) {
        setIsFinished(true);
      } else if (settings.autoAdvance) {
        setCurrentIndex((prev) => prev + 1);
      }
    }
  }, [currentIndex, videos.length, settings, logCurrentVideoWatch]);

  const handleBoundaryComplete = useCallback(() => {
    setInBoundary(false);
    const isLastVideo = currentIndex >= videos.length - 1;

    if (isLastVideo) {
      setIsFinished(true);
    } else if (settings.autoAdvance) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, videos.length, settings.autoAdvance]);

  const goToNextVideo = useCallback(() => {
    if (inBoundary) {
      setInBoundary(false);
    }
    if (currentIndex < videos.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  }, [currentIndex, videos.length, inBoundary]);

  const goToPrevVideo = useCallback(() => {
    if (inBoundary) {
      setInBoundary(false);
    }
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex, inBoundary]);

  const updateSettings = useCallback((newSettings: Partial<ExperimentSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const resetExperiment = useCallback(() => {
    setCurrentIndex(0);
    setInBoundary(false);
    setIsFinished(false);
    setLogs([]);
    videoStartTimeRef.current = Date.now();
  }, []);

  return {
    settings,
    updateSettings,
    currentIndex,
    currentVideo: videos[currentIndex],
    inBoundary,
    isFinished,
    logs,
    handleVideoEnded,
    handleBoundaryComplete,
    goToNextVideo,
    goToPrevVideo,
    resetExperiment,
  };
};
