"use client";
import React, { useState, useRef, useEffect } from "react";

interface AudioPlayerProps {
  musicUrl?: string;
  autoPlay?: boolean;
}

export default function AudioPlayer({ musicUrl = "/audio/song.mp3", autoPlay = false }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  }, [autoPlay]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <audio ref={audioRef} src={musicUrl} loop preload="auto" />
      <button
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause Music" : "Play Music"}
        className="relative group p-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-[#E8E2DA] transition-transform duration-300 active:scale-95 hover:scale-105 flex items-center justify-center cursor-pointer"
      >
        {/* Vinyl Disc SVG */}
        <div className={`w-11 h-11 relative flex items-center justify-center ${isPlaying ? "animate-spin-slow" : ""}`}>
          <svg viewBox="0 0 45.75 45.75" className="w-full h-full drop-shadow-sm">
            <defs>
              <linearGradient id="vinyl-grad" x1="0" y1="22.8" x2="45.7" y2="22.8" gradientUnits="userSpaceOnUse">
                <stop offset="0.09" stopColor="#1a1a1a" />
                <stop offset="0.25" stopColor="#333333" />
                <stop offset="0.5" stopColor="#555555" />
                <stop offset="0.75" stopColor="#222222" />
                <stop offset="1" stopColor="#111111" />
              </linearGradient>
              <linearGradient id="label-grad" x1="12" y1="27" x2="33" y2="18" gradientUnits="userSpaceOnUse">
                <stop offset="0.4" stopColor="#C2A676" />
                <stop offset="0.8" stopColor="#8E7D6B" />
              </linearGradient>
            </defs>
            <circle cx="22.87" cy="22.87" r="22.5" fill="url(#vinyl-grad)" stroke="#111" strokeWidth="0.5" />
            {/* Grooves */}
            <circle cx="22.87" cy="22.87" r="18" fill="none" stroke="#444" strokeWidth="0.3" strokeDasharray="3 2" />
            <circle cx="22.87" cy="22.87" r="14" fill="none" stroke="#444" strokeWidth="0.3" strokeDasharray="2 1" />
            {/* Center Label */}
            <circle cx="22.87" cy="22.87" r="9" fill="url(#label-grad)" />
            {/* Center Spindle Hole */}
            <circle cx="22.87" cy="22.87" r="2.2" fill="#FAF8F5" />
          </svg>

          {/* Pause overlay icon when paused (explicitly requested by user: 'gk usah pake icon 🔇 , pake icon pause aja') */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full text-white">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )}

          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 rounded-full transition-opacity text-white">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            </div>
          )}
        </div>
      </button>
    </div>
  );
}
