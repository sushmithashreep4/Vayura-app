import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, VolumeX, Image as ImageIcon } from 'lucide-react';
import { getCountryVisual, type CountryVisualConfig } from '@/data/countryVisuals';

interface CinematicVideoBackgroundProps {
  countryCode?: string;
  className?: string;
  overlayOpacity?: 'light' | 'medium' | 'dark' | 'cinematic';
  showControls?: boolean;
  minHeight?: string;
  children?: React.ReactNode;
}

export function CinematicVideoBackground({
  countryCode = 'GLOBAL',
  className = '',
  overlayOpacity = 'cinematic',
  showControls = true,
  minHeight = 'min-h-[560px]',
  children,
}: CinematicVideoBackgroundProps) {
  const visual: CountryVisualConfig = getCountryVisual(countryCode);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Reset state when countryCode changes
  useEffect(() => {
    setVideoError(false);
    setVideoLoaded(false);
    setCurrentSourceIndex(0);
    setIsPlaying(true);
  }, [countryCode]);

  const videoSources = [visual.heroVideo, visual.heroVideoBackup].filter(Boolean);

  const handleVideoError = () => {
    if (currentSourceIndex < videoSources.length - 1) {
      setCurrentSourceIndex((prev) => prev + 1);
    } else {
      setVideoError(true);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  // Overlay styles for perfect text contrast
  const overlayClasses = {
    light: 'bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-slate-950/40',
    medium: 'bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-slate-950/50',
    dark: 'bg-gradient-to-t from-slate-950/95 via-slate-950/75 to-slate-950/60',
    cinematic: 'bg-gradient-to-b from-slate-950/85 via-slate-950/50 to-slate-950/95',
  }[overlayOpacity];

  return (
    <div className={`relative overflow-hidden w-full ${minHeight} bg-slate-950 ${className}`}>
      {/* ── Background Video & Fallback Transition Layer ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={countryCode + '-' + currentSourceIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
        >
          {/* Fallback Image is always present underneath */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-1000 ease-out"
            style={{
              backgroundImage: `url(${visual.fallbackImage})`,
            }}
          />

          {/* Active Video Element (if reduced motion is false and no terminal error) */}
          {!prefersReducedMotion && !videoError && (
            <video
              ref={videoRef}
              key={videoSources[currentSourceIndex]}
              src={videoSources[currentSourceIndex]}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              onLoadedData={() => setVideoLoaded(true)}
              onError={handleVideoError}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                videoLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── High-Contrast Vignette & Overlays ── */}
      <div className={`absolute inset-0 ${overlayClasses}`} />
      
      {/* Subtle radial glow matching destination accent */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle at 50% 25%, ${visual.accentTheme.bgGlow} 0%, transparent 70%)`,
        }}
      />

      {/* Grid Pattern Texture */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* ── Foreground Content ── */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>

      {/* ── Minimal Bottom Control Bar ── */}
      {showControls && (
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/50 text-xs text-slate-300 shadow-xl">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: visual.accentTheme.primaryHex }} />
            <span className="font-medium text-slate-200">{visual.flag} {visual.countryName}</span>
          </div>

          <div className="w-px h-3 bg-slate-700" />

          {!videoError && !prefersReducedMotion ? (
            <button
              onClick={togglePlay}
              className="p-1 hover:text-white transition-colors"
              title={isPlaying ? 'Pause background video' : 'Play background video'}
              aria-label="Toggle background playback"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          ) : (
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <ImageIcon className="w-3 h-3 text-slate-400" /> Photo Fallback
            </span>
          )}

          <VolumeX className="w-3.5 h-3.5 text-slate-500" aria-label="Always muted for accessibility" />
        </div>
      )}
    </div>
  );
}

