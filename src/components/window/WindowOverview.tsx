import React from 'react';
import { useDeX } from '../../context/DeXContext';
import { AppIcon } from '../common/AppIcon';
import { X, Trash2, LayoutGrid, Plus } from 'lucide-react';

export const WindowOverview: React.FC = () => {
  const {
    isOverviewOpen,
    setIsOverviewOpen,
    windows,
    focusWindow,
    closeWindow,
    closeAll,
    setIsAppDrawerOpen,
    settings
  } = useDeX();

  if (!isOverviewOpen) return null;

  return (
    <div
      id="dex-window-overview"
      onClick={() => setIsOverviewOpen(false)}
      className="fixed inset-0 z-[800] bg-black/70 backdrop-blur-xl flex flex-col p-8 select-none animate-in fade-in duration-150"
    >
      {/* Top Controls */}
      <div className="flex items-center justify-between max-w-6xl w-full mx-auto mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Ikhtisar Jendela (Task View)</h2>
            <span className="text-xs text-neutral-400">
              {windows.length} jendela aplikasi sedang aktif
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => {
              setIsOverviewOpen(false);
              setIsAppDrawerOpen(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium border border-neutral-700 transition-colors text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buka Aplikasi Lain</span>
          </button>

          {windows.length > 0 && (
            <button
              onClick={closeAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium shadow-md transition-colors text-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Tutup Semua</span>
            </button>
          )}

          <button
            onClick={() => setIsOverviewOpen(false)}
            className="p-2 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid of Open Windows */}
      <div
        className="flex-1 max-w-6xl w-full mx-auto overflow-y-auto flex items-center justify-center"
        onClick={e => e.stopPropagation()}
      >
        {windows.length === 0 ? (
          <div className="text-center text-neutral-400 space-y-3">
            <LayoutGrid className="w-12 h-12 stroke-[1.2] mx-auto opacity-40" />
            <p className="text-sm font-semibold">Tidak ada jendela yang terbuka</p>
            <p className="text-xs text-neutral-500">
              Buka aplikasi dari bilah tugas atau desktop untuk memulai alur kerja multitasking.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full py-4">
            {windows.map(win => (
              <div
                key={win.id}
                onClick={() => {
                  focusWindow(win.id);
                  setIsOverviewOpen(false);
                }}
                className={`group relative flex flex-col rounded-2xl border cursor-pointer transition-all duration-200 overflow-hidden shadow-2xl hover:scale-103 ${
                  settings.darkMode
                    ? 'bg-neutral-900/90 border-neutral-700 hover:border-blue-500'
                    : 'bg-white/95 border-neutral-300 hover:border-blue-500'
                }`}
                style={{ height: '220px' }}
              >
                {/* Header */}
                <div className="h-10 px-3 flex items-center justify-between border-b border-neutral-800/60 bg-neutral-800/40">
                  <div className="flex items-center gap-2 truncate">
                    <AppIcon name={win.icon} className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="text-xs font-bold text-white truncate">{win.title}</span>
                  </div>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      closeWindow(win.id);
                    }}
                    className="p-1 rounded-lg hover:bg-red-500 text-neutral-400 hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Simulated Window Content Thumbnail */}
                <div className="flex-1 p-4 flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-transparent to-neutral-950/40">
                  <div className="w-14 h-14 rounded-2xl bg-neutral-800 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <AppIcon name={win.icon} className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] font-medium text-neutral-400 group-hover:text-neutral-200 text-center">
                    Klik untuk membuka
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
