import React, { useState, useRef, useEffect } from 'react';
import { useDeX } from '../../context/DeXContext';
import { AppIcon } from '../common/AppIcon';
import { Search, Pin, PinOff, X } from 'lucide-react';

export const AppDrawer: React.FC = () => {
  const { isAppDrawerOpen, setIsAppDrawerOpen, apps, openApp, togglePinApp, settings } = useDeX();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAppDrawerOpen) {
      inputRef.current?.focus();
    }
  }, [isAppDrawerOpen]);

  if (!isAppDrawerOpen) return null;

  const filteredApps = apps.filter(app => {
    const matchSearch =
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'all' || app.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div
      id="dex-app-drawer-backdrop"
      onClick={() => setIsAppDrawerOpen(false)}
      className="fixed inset-0 z-[850] bg-black/60 backdrop-blur-xl flex flex-col items-center justify-center p-6 select-none animate-in fade-in duration-150"
    >
      <div
        id="dex-app-drawer-modal"
        onClick={e => e.stopPropagation()}
        className={`w-full max-w-3xl rounded-3xl border shadow-2xl p-6 flex flex-col max-h-[85vh] ${
          settings.darkMode
            ? 'bg-neutral-900/95 border-neutral-700/80 text-white'
            : 'bg-white/95 border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Top Search & Filter Bar */}
        <div className="flex items-center gap-3 pb-4 border-b border-neutral-800 shrink-0">
          <div
            className={`flex-1 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border text-sm ${
              settings.darkMode
                ? 'bg-neutral-800/80 border-neutral-700 text-white'
                : 'bg-neutral-100 border-neutral-200 text-neutral-900'
            }`}
          >
            <Search className="w-4 h-4 text-neutral-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Cari aplikasi atau alat DeX..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-none outline-hidden w-full text-xs placeholder:text-neutral-500"
            />
          </div>

          <button
            onClick={() => setIsAppDrawerOpen(false)}
            className="p-2.5 rounded-2xl hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Tabs */}
        <div className="flex items-center gap-2 py-3 overflow-x-auto shrink-0 text-xs">
          {[
            { id: 'all', label: 'Semua Aplikasi' },
            { id: 'productivity', label: 'Produktivitas' },
            { id: 'system', label: 'Sistem & Perangkat' },
            { id: 'utilities', label: 'Utilitas' },
            { id: 'media', label: 'Media & Foto' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : settings.darkMode
                  ? 'hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                  : 'hover:bg-neutral-200 text-neutral-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Apps Grid */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredApps.map(app => (
              <div
                key={app.id}
                onClick={() => openApp(app.id)}
                className={`flex flex-col items-center p-4 rounded-2xl cursor-pointer transition-all duration-150 group border relative ${
                  settings.darkMode
                    ? 'bg-neutral-800/30 border-neutral-800 hover:bg-neutral-800/80 hover:border-neutral-700 hover:scale-102'
                    : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300 hover:scale-102'
                }`}
              >
                {/* Pin/Unpin button on hover */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    togglePinApp(app.id);
                  }}
                  title={app.isPinned ? 'Lepas dari taskbar' : 'Sematkan ke taskbar'}
                  className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-neutral-700/60 text-neutral-400 hover:text-white transition-opacity"
                >
                  {app.isPinned ? <PinOff className="w-3.5 h-3.5 text-blue-400" /> : <Pin className="w-3.5 h-3.5" />}
                </button>

                {/* App Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-2.5 shadow-lg group-hover:scale-110 transition-transform ${
                    app.id === 'files'
                      ? 'bg-gradient-to-tr from-amber-600 to-amber-400'
                      : app.id === 'notes'
                      ? 'bg-gradient-to-tr from-orange-600 to-amber-500'
                      : app.id === 'gallery'
                      ? 'bg-gradient-to-tr from-rose-600 to-pink-500'
                      : app.id === 'browser'
                      ? 'bg-gradient-to-tr from-sky-600 to-blue-500'
                      : app.id === 'taskmanager'
                      ? 'bg-gradient-to-tr from-emerald-600 to-teal-400'
                      : app.id === 'terminal'
                      ? 'bg-gradient-to-tr from-neutral-800 to-neutral-700 text-emerald-400'
                      : app.id === 'settings'
                      ? 'bg-gradient-to-tr from-blue-700 to-indigo-600'
                      : 'bg-gradient-to-tr from-violet-600 to-purple-500'
                  }`}
                >
                  <AppIcon name={app.icon} className="w-7 h-7 drop-shadow-sm" />
                </div>

                <span className="font-bold text-xs text-center text-white dark:text-neutral-100 line-clamp-1">
                  {app.name}
                </span>
                <span className="text-[10px] text-neutral-400 text-center line-clamp-2 mt-1 px-1">
                  {app.description}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Hint */}
        <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
          <span>Tekan tombol <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 font-mono text-white">Win</kbd> atau <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 font-mono text-white">Esc</kbd> untuk menutup</span>
          <span>{filteredApps.length} aplikasi siap pakai</span>
        </div>
      </div>
    </div>
  );
};
