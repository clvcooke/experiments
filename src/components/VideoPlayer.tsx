import React, { useRef, useState, useEffect } from 'react';
import { Play, Volume2, VolumeX, Heart, MessageCircle, Share2, Music2, Eye } from 'lucide-react';
import type { VideoItem } from '../data/videos';

interface VideoPlayerProps {
  video: VideoItem;
  isActive: boolean;
  index: number;
  totalVideos: number;
  autoAdvance: boolean;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onRequestNext?: () => void;
  onRequestPrev?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  isActive,
  index,
  totalVideos,
  autoAdvance,
  onEnded,
  onTimeUpdate,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(Math.floor(Math.random() * 1200) + 300);

  useEffect(() => {
    const videoElem = videoRef.current;
    if (!videoElem) return;

    if (isActive) {
      // Attempt play when active
      videoElem.currentTime = 0;
      const playPromise = videoElem.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay policy fallback
            setIsPlaying(false);
          });
      }
    } else {
      videoElem.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    const videoElem = videoRef.current;
    if (!videoElem) return;

    if (isPlaying) {
      videoElem.pause();
      setIsPlaying(false);
    } else {
      videoElem.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      const dur = videoRef.current.duration || video.durationSeconds;
      const pct = (cur / dur) * 100;
      setProgress(pct);
      if (onTimeUpdate) {
        onTimeUpdate(cur, dur);
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (onEnded) {
      onEnded();
    }
  };

  return (
    <div className="relative w-full h-full bg-black flex flex-col justify-between overflow-hidden select-none">
      {/* Background Video / Animated Canvas Fallback */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black" onClick={togglePlay}>
        {!hasError ? (
          <video
            ref={videoRef}
            src={video.videoUrl}
            className="w-full h-full object-cover"
            playsInline
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            onError={() => setHasError(true)}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-b ${video.fallbackGradient} flex flex-col items-center justify-center p-6 text-center animate-pulse`}>
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md mb-4 border border-white/20">
              <Eye className="w-10 h-10 text-white animate-bounce" />
            </div>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold tracking-wider uppercase mb-2">
              {video.category}
            </span>
            <h2 className="text-xl font-bold text-white mb-2">{video.title}</h2>
            <p className="text-sm text-gray-300 max-w-xs">{video.description}</p>
          </div>
        )}

        {/* Play Pause Center Overlay Icon */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] transition-all">
            <div className="w-16 h-16 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white shadow-2xl transform scale-110">
              <Play className="w-8 h-8 fill-white translate-x-0.5" />
            </div>
          </div>
        )}
      </div>

      {/* Top Bar Navigation Info */}
      <div className="relative z-10 pt-12 px-4 pb-4 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/30 to-transparent">
        <div className="flex items-center gap-2">
          <span className="bg-red-500/80 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
            EXP ITEM {index + 1}/{totalVideos}
          </span>
          <span className="text-xs text-gray-300 font-medium">
            {autoAdvance ? "Auto-Flow On" : "Manual Flow"}
          </span>
        </div>

        <button
          onClick={toggleMute}
          className="p-2.5 rounded-full bg-black/40 text-white border border-white/20 backdrop-blur-md active:scale-95 transition-transform"
          aria-label={isMuted ? "Unmute sound" : "Mute sound"}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-gray-300" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
        </button>
      </div>

      {/* Right Action Sidebar (TikTok Style) */}
      <div className="absolute right-3 bottom-24 z-10 flex flex-col items-center gap-5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
            setLikeCount((c) => (liked ? c - 1 : c + 1));
          }}
          className="flex flex-col items-center gap-1 group"
        >
          <div className={`p-3 rounded-full backdrop-blur-md transition-all ${liked ? 'bg-red-500/20 border border-red-500' : 'bg-black/40 border border-white/20'}`}>
            <Heart className={`w-6 h-6 transition-transform group-active:scale-125 ${liked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </div>
          <span className="text-xs font-semibold text-white shadow-sm">{likeCount}</span>
        </button>

        <div className="flex flex-col items-center gap-1">
          <div className="p-3 rounded-full bg-black/40 border border-white/20 backdrop-blur-md">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-semibold text-white shadow-sm">84</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="p-3 rounded-full bg-black/40 border border-white/20 backdrop-blur-md">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-semibold text-white shadow-sm">Share</span>
        </div>
      </div>

      {/* Bottom Information Overlay */}
      <div className="relative z-10 p-4 pr-16 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white hover:underline">{video.author}</span>
          <span className="text-xs text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
            {video.category}
          </span>
        </div>

        <p className="text-xs text-gray-200 line-clamp-2 leading-relaxed">{video.description}</p>

        <div className="flex items-center gap-1.5 text-xs text-gray-300 overflow-hidden">
          <Music2 className="w-3.5 h-3.5 text-gray-400 shrink-0 animate-spin" style={{ animationDuration: '4s' }} />
          <span className="truncate">{video.title} • Original Sound</span>
        </div>

        {/* Video Progress Bar */}
        <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden mt-1">
          <div
            className="bg-red-500 h-full transition-all duration-100 ease-linear rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
