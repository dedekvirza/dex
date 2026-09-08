import React, { useState, useEffect, useRef } from 'react';
import { useDeX } from '../../context/DeXContext';
import { AppIcon } from '../common/AppIcon';
import { Search, Calculator, FileText, ArrowRight, CornerDownLeft, Sparkles, SlidersHorizontal, Moon, Sun } from 'lucide-react';

export const SpotlightSearch: React.FC = () => {
  const {
    isSpotlightOpen,
    setIsSpotlightOpen,
    apps,
    openApp,
    files,
    settings,
    updateSettings,
    clearAllNotifications,
    createFile,
    setIsWelcomeScreenOpen
  } = useDeX();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSpotlightOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSpotlightOpen]);

  if (!isSpotlightOpen) return null;

  // 1. Math calculation detection
  let mathResult: string | null = null;
  const isMathExpr = /^[\d\s+\-*/().%^]+$/.test(query.trim()) && /[+\-*/%]/.test(query.trim());
  if (isMathExpr) {
    try {
      const clean = query.replace(/%/g, '/100');
      // eslint-disable-next-line no-eval
      const res = Function(`'use strict'; return (${clean})`)();
      if (typeof res === 'number' && !isNaN(res)) {
        mathResult = String(res);
      }
    } catch {
      mathResult = null;
    }
  }

  // 2. Apps search
  const matchedApps = query.trim()
    ? apps.filter(
        a =>
          a.name.toLowerCase().includes(query.toLowerCase()) ||
          a.description.toLowerCase().includes(query.toLowerCase())
      )
    : apps.slice(0, 4);

  // 3. Files search
  const matchedFiles = query.trim()
    ? files
        .filter(f => !f.isTrashed && f.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 4)
    : [];

  // 4. Quick System Commands
  const systemCommands = [
    {
      id: 'cmd-theme',
      title: settings.darkMode ? 'Ganti ke Tema Terang (Light Mode)' : 'Ganti ke Tema Gelap (Dark Mode)',
      desc: 'Pengaturan Tampilan Sistem',
      icon: settings.darkMode ? 'Sun' : 'Moon',
      action: () => updateSettings({ darkMode: !settings.darkMode })
    },
    {
      id: 'cmd-settings',
      title: 'Buka Pengaturan DeX Lengkap',
      desc: 'Konfigurasi display, koneksi, & suara',
      icon: 'SlidersHorizontal',
      action: () => openApp('settings')
    },
    {
      id: 'cmd-notifs',
      title: 'Bersihkan Semua Notifikasi',
      desc: 'Hapus riwayat notifikasi aktif',
      icon: 'Bell',
      action: () => clearAllNotifications()
    },
    {
      id: 'cmd-welcome',
      title: 'Tampilkan Welcome Screen (cahmales dex)',
      desc: 'Buka animasi boot & layar sambutan DeX',
      icon: 'Sparkles',
      action: () => {
        setIsSpotlightOpen(false);
        setIsWelcomeScreenOpen(true);
      }
    }
  ].filter(c => !query.trim() || c.title.toLowerCase().includes(query.toLowerCase()));

  // Flattened results for keyboard navigation
  const allResults: { type: string; id: string; run: () => void }[] = [];

  if (mathResult) {
    allResults.push({
      type: 'math',
      id: 'math-res',
      run: () => {
        openApp('calculator');
      }
    });
  }

  matchedApps.forEach(a => {
    allResults.push({
      type: 'app',
      id: a.id,
      run: () => openApp(a.id)
    });
  });

  matchedFiles.forEach(f => {
    allResults.push({
      type: 'file',
      id: f.id,
      run: () => {
        if (f.type === 'image') {
          openApp('gallery', { imageFileId: f.id });
        } else {
          openApp('notes', { fileId: f.id });
        }
      }
    });
  });

  systemCommands.forEach(c => {
    allResults.push({
      type: 'cmd',
      id: c.id,
      run: c.action
    });
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (allResults.length ? (prev + 1) % allResults.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (allResults.length ? (prev - 1 + allResults.length) % allResults.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allResults[selectedIndex]) {
        allResults[selectedIndex].run();
        setIsSpotlightOpen(false);
      }
    }
  };

  return (
    <div
      id="dex-spotlight-backdrop"
      onClick={() => setIsSpotlightOpen(false)}
      className="fixed inset-0 z-[1200] bg-black/60 backdrop-blur-md flex flex-col items-center pt-[14vh] select-none animate-in fade-in duration-100 p-4"
    >
      <div
        id="dex-spotlight-modal"
        onClick={e => e.stopPropagation()}
        className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col backdrop-blur-2xl ${
          settings.darkMode
            ? 'bg-neutral-900/95 border-neutral-700/80 text-white'
            : 'bg-white/95 border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-800">
          <Search className="w-5 h-5 text-blue-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Cari aplikasi, berkas, hitung matematika, atau perintah DeX..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-none outline-hidden text-sm placeholder:text-neutral-500 font-medium"
          />
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-400 font-mono shrink-0">
            ESC untuk keluar
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {/* Math Result if active */}
          {mathResult && (
            <div
              onClick={() => {
                openApp('calculator');
                setIsSpotlightOpen(false);
              }}
              className="p-3 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-blue-300 font-mono block">{query} =</span>
                  <span className="text-xl font-bold font-mono text-white">{mathResult}</span>
                </div>
              </div>
              <span className="text-xs text-blue-400 flex items-center gap-1 font-medium">
                Buka Kalkulator <CornerDownLeft className="w-3.5 h-3.5" />
              </span>
            </div>
          )}

          {/* Apps Section */}
          {matchedApps.length > 0 && (
            <div className="pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 px-3 py-1 block">
                Aplikasi DeX
              </span>
              {matchedApps.map(app => {
                const idx = allResults.findIndex(r => r.type === 'app' && r.id === app.id);
                const isSelected = selectedIndex === idx;
                return (
                  <div
                    key={app.id}
                    onClick={() => {
                      openApp(app.id);
                      setIsSpotlightOpen(false);
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : settings.darkMode
                        ? 'hover:bg-neutral-800/60 text-neutral-200'
                        : 'hover:bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-neutral-800 flex items-center justify-center text-white shadow-xs">
                        <AppIcon name={app.icon} className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold block">{app.name}</span>
                        <span
                          className={`text-[11px] ${
                            isSelected ? 'text-blue-100' : 'text-neutral-400'
                          } line-clamp-1`}
                        >
                          {app.description}
                        </span>
                      </div>
                    </div>
                    {isSelected && <CornerDownLeft className="w-4 h-4 text-blue-200" />}
                  </div>
                );
              })}
            </div>
          )}

          {/* Files Section */}
          {matchedFiles.length > 0 && (
            <div className="pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 px-3 py-1 block">
                Berkas & Dokumen
              </span>
              {matchedFiles.map(file => {
                const idx = allResults.findIndex(r => r.type === 'file' && r.id === file.id);
                const isSelected = selectedIndex === idx;
                return (
                  <div
                    key={file.id}
                    onClick={() => {
                      if (file.type === 'image') {
                        openApp('gallery', { imageFileId: file.id });
                      } else {
                        openApp('notes', { fileId: file.id });
                      }
                      setIsSpotlightOpen(false);
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : settings.darkMode
                        ? 'hover:bg-neutral-800/60 text-neutral-200'
                        : 'hover:bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-neutral-800 flex items-center justify-center text-amber-400 shadow-xs">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold block">{file.name}</span>
                        <span
                          className={`text-[11px] ${
                            isSelected ? 'text-blue-100' : 'text-neutral-400'
                          }`}
                        >
                          {(file.size / 1024).toFixed(1)} KB • Disimpan di My Files
                        </span>
                      </div>
                    </div>
                    {isSelected && <CornerDownLeft className="w-4 h-4 text-blue-200" />}
                  </div>
                );
              })}
            </div>
          )}

          {/* System Commands */}
          {systemCommands.length > 0 && (
            <div className="pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 px-3 py-1 block">
                Aksi Cepat Sistem
              </span>
              {systemCommands.map(cmd => {
                const idx = allResults.findIndex(r => r.type === 'cmd' && r.id === cmd.id);
                const isSelected = selectedIndex === idx;
                return (
                  <div
                    key={cmd.id}
                    onClick={() => {
                      cmd.action();
                      setIsSpotlightOpen(false);
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : settings.darkMode
                        ? 'hover:bg-neutral-800/60 text-neutral-200'
                        : 'hover:bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-neutral-800 flex items-center justify-center text-emerald-400 shadow-xs">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold block">{cmd.title}</span>
                        <span
                          className={`text-[11px] ${
                            isSelected ? 'text-blue-100' : 'text-neutral-400'
                          }`}
                        >
                          {cmd.desc}
                        </span>
                      </div>
                    </div>
                    {isSelected && <CornerDownLeft className="w-4 h-4 text-blue-200" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="px-5 py-2.5 bg-neutral-950/60 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
          <div className="flex items-center gap-4">
            <span><kbd className="px-1.5 py-0.5 rounded bg-neutral-800 font-mono text-white">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 font-mono text-white">↓</kbd> Navigasi</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-neutral-800 font-mono text-white">Enter</kbd> Buka</span>
          </div>
          <span className="text-neutral-500 font-medium">Samsung DeX Quick Launcher</span>
        </div>
      </div>
    </div>
  );
};
