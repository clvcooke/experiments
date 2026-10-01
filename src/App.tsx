import { useState, useEffect } from 'react';
import { Settings, RefreshCw, ChevronUp, ChevronDown } from 'lucide-react';
import { SAMPLE_VIDEOS } from './data/videos';
import { VideoPlayer } from './components/VideoPlayer';
import { EventBoundaryOverlay } from './components/EventBoundaryOverlay';
import { ConditionSelector } from './components/ConditionSelector';
import { MemoryAssessment } from './components/MemoryAssessment';
import { useExperimentState } from './hooks/useExperimentState';
import { getSettingsFromURL, buildShareableURL } from './utils/urlState';

export function App() {
  const initialSettings = getSettingsFromURL();
  const [isSelectorOpen, setIsSelectorOpen] = useState<boolean>(false);

  const {
    settings,
    updateSettings,
    currentIndex,
    currentVideo,
    inBoundary,
    isFinished,
    logs,
    handleVideoEnded,
    handleBoundaryComplete,
    goToNextVideo,
    goToPrevVideo,
    resetExperiment,
  } = useExperimentState(SAMPLE_VIDEOS, initialSettings);

  const nextVideo = SAMPLE_VIDEOS[currentIndex + 1];

  // Sync URL when settings change
  useEffect(() => {
    const shareableUrl = buildShareableURL(settings);
    if (window.location.href !== shareableUrl) {
      window.history.replaceState({}, '', shareableUrl);
    }
  }, [settings]);

  if (isFinished) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <MemoryAssessment
          videos={SAMPLE_VIDEOS}
          logs={logs}
          settings={settings}
          onRestart={resetExperiment}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* Mobile Feed Container */}
      <div className="relative w-full max-w-[420px] h-full sm:h-[92vh] sm:rounded-3xl sm:border sm:border-zinc-800 bg-black flex flex-col overflow-hidden shadow-2xl">

        {/* Top Sticky Bar */}
        <div className="absolute top-0 left-0 right-0 z-30 p-3 flex items-center justify-between bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSelectorOpen(true)}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-red-400" />
              <span>{settings.boundaryType} ({settings.pauseDuration}s)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetExperiment}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 transition-colors"
              title="Reset Trial"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Vertical Feed Content Area */}
        <div className="relative w-full h-full">
          {currentVideo && (
            <VideoPlayer
              key={currentVideo.id}
              video={currentVideo}
              isActive={!inBoundary && !isFinished}
              index={currentIndex}
              totalVideos={SAMPLE_VIDEOS.length}
              autoAdvance={settings.autoAdvance}
              onEnded={handleVideoEnded}
              onRequestNext={goToNextVideo}
              onRequestPrev={goToPrevVideo}
            />
          )}

          {/* Event Boundary Overlay Active during inter-video pause */}
          {inBoundary && (
            <EventBoundaryOverlay
              boundaryType={settings.boundaryType}
              durationSeconds={settings.pauseDuration}
              customText={settings.customBoundaryText}
              nextVideoTitle={nextVideo?.title}
              onBoundaryComplete={handleBoundaryComplete}
            />
          )}
        </div>

        {/* Up/Down Navigation Controls (Overlay) */}
        <div className="absolute left-3 bottom-20 z-20 flex flex-col gap-2">
          <button
            disabled={currentIndex === 0 || inBoundary}
            onClick={goToPrevVideo}
            className="p-2.5 rounded-full bg-black/50 border border-white/20 text-white disabled:opacity-30 backdrop-blur-md active:scale-95 transition-all"
            aria-label="Previous video"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <button
            disabled={inBoundary}
            onClick={goToNextVideo}
            className="p-2.5 rounded-full bg-black/50 border border-white/20 text-white disabled:opacity-30 backdrop-blur-md active:scale-95 transition-all"
            aria-label="Next video"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* Condition Selector Modal */}
      <ConditionSelector
        currentSettings={settings}
        onApplySettings={updateSettings}
        onReset={resetExperiment}
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
      />
    </div>
  );
}

export default App;
