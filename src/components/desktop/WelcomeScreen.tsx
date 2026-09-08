import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDeX } from '../../context/DeXContext';
import { sound } from '../../services/soundService';
import {
  ArrowRight,
  Sparkles,
  Layers,
  Cpu,
  Monitor,
  CheckCircle2
} from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const { isWelcomeScreenOpen, setIsWelcomeScreenOpen, settings } = useDeX();
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Menginisialisasi sistem DeX...');
  const [isReady, setIsReady] = useState(false);

  // Boot sequence simulation
  useEffect(() => {
    if (!isWelcomeScreenOpen) return;

    let current = 0;
    const interval = setInterval(() => {
      // Advance progress smoothly
      const increment = Math.floor(Math.random() * 12) + 8;
      current = Math.min(100, current + increment);
      setProgress(current);

      if (current < 25) {
        setStatusText('Memuat modul kernel Samsung DeX...');
      } else if (current < 55) {
        setStatusText('Menyiapkan ruang kerja & akselerasi visual...');
      } else if (current < 80) {
        setStatusText('Memuat My Files, windowing engine & tools...');
      } else if (current < 99) {
        setStatusText('Mengonfigurasi preferensi tampilan...');
      } else {
        setStatusText('Selamat Datang di cahmales dex');
        setIsReady(true);
        clearInterval(interval);
      }
    }, 140);

    return () => clearInterval(interval);
  }, [isWelcomeScreenOpen]);

  // Auto enter after reaching 100% with a short gentle pause
  useEffect(() => {
    if (isReady && isWelcomeScreenOpen) {
      const timer = setTimeout(() => {
        handleEnterDesktop();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isReady, isWelcomeScreenOpen]);

  // Keyboard listener: Enter or Space to enter immediately
  useEffect(() => {
    if (!isWelcomeScreenOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        handleEnterDesktop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isWelcomeScreenOpen]);

  const handleEnterDesktop = () => {
    if (settings.soundEnabled) {
      sound.playStartup();
    }
    setIsWelcomeScreenOpen(false);
  };

  return (
    <AnimatePresence>
      {isWelcomeScreenOpen && (
        <motion.div
          id="dex-welcome-screen-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-between p-8 select-none bg-[#07090e] text-neutral-100 overflow-hidden"
        >
          {/* Ambient Background Aura */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-blue-600/15 blur-[120px]" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-[90px]" />
            <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black/80 to-transparent" />
          </div>

          {/* Top Header info */}
          <div className="w-full flex items-center justify-between relative z-10 max-w-5xl">
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SAMSUNG DeX PRO WORKSTATION</span>
            </div>
            <div className="text-xs text-neutral-500 font-mono">
              Build UP1A.260908.001
            </div>
          </div>

          {/* Center Main Identity Hero */}
          <div className="flex flex-col items-center justify-center text-center max-w-xl relative z-10 my-auto">
            {/* Stylized Glowing DeX Orb Emblem */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="relative mb-6"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-400 p-[2px] shadow-2xl shadow-blue-500/30 flex items-center justify-center">
                <div className="w-full h-full rounded-[22px] bg-neutral-950/90 backdrop-blur-md flex flex-col items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-radial from-blue-500/20 to-transparent" />
                  {/* DeX Hexagon/Pulse Icon */}
                  <div className="relative z-10 flex items-center justify-center">
                    <span className="font-extrabold text-3xl sm:text-4xl tracking-tighter bg-gradient-to-r from-blue-400 via-cyan-300 to-white bg-clip-text text-transparent">
                      DeX
                    </span>
                  </div>
                  <span className="relative z-10 text-[9px] font-mono tracking-widest text-cyan-400 uppercase mt-0.5 font-bold">
                    PRO
                  </span>
                </div>
              </div>

              {/* Pulsing subtle outer ring */}
              <div className="absolute -inset-2 rounded-[32px] border border-blue-500/30 animate-pulse pointer-events-none" />
            </motion.div>

            {/* Requested Hero Title: "cahmales dex" */}
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="space-y-2"
            >
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white capitalize">
                cahmales dex
              </h1>
              <p className="text-sm sm:text-base text-neutral-300 font-normal max-w-md mx-auto leading-relaxed">
                Pengalaman desktop multitasking Android bertenaga tinggi dengan sistem windowing profesional & manajemen file terintegrasi.
              </p>
            </motion.div>

            {/* Boot Status & Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-full max-w-md mt-8 space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400 flex items-center gap-2">
                  {progress < 100 ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  {statusText}
                </span>
                <span className="font-mono text-cyan-400 font-semibold">
                  {progress}%
                </span>
              </div>

              {/* Slim Progress Bar */}
              <div className="w-full h-1.5 bg-neutral-800/80 rounded-full overflow-hidden border border-neutral-700/40 p-[1px]">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-400 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut', duration: 0.2 }}
                />
              </div>

              {/* Instant Enter CTA button */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  id="welcome-enter-btn"
                  onClick={handleEnterDesktop}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 active:scale-95 transition-all cursor-pointer group"
                >
                  <span>Masuk ke Desktop</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <span className="text-[11px] text-neutral-500">
                  Tekan <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 font-mono text-[10px] text-neutral-300">Enter</kbd> untuk lewati
                </span>
              </div>
            </motion.div>
          </div>

          {/* Bottom Features pill highlight */}
          <div className="w-full flex items-center justify-center relative z-10 max-w-4xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-[11px] text-neutral-400 w-full max-w-2xl">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-900/60 border border-neutral-800/60 justify-center">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>Multi-Workspace</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-900/60 border border-neutral-800/60 justify-center">
                <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                <span>Precision Snapping</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-900/60 border border-neutral-800/60 justify-center">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Quick Look & Spotlight</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-900/60 border border-neutral-800/60 justify-center">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hardware Acceleration</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
