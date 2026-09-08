import React from 'react';
import { useDeX } from '../../context/DeXContext';
import { AppIcon } from '../common/AppIcon';

export const AltTabSwitcher: React.FC = () => {
  const { isAltTabActive, altTabSelectedId, windows, settings } = useDeX();

  if (!isAltTabActive || windows.length === 0) return null;

  return (
    <div
      id="dex-alt-tab-switcher"
      className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none bg-black/40 backdrop-blur-md animate-in fade-in duration-100"
    >
      <div
        className={`p-4 rounded-2xl shadow-2xl border flex items-center gap-3 ${
          settings.darkMode
            ? 'bg-neutral-900/90 border-neutral-700/80 text-white'
            : 'bg-white/90 border-neutral-200 text-neutral-900'
        }`}
      >
        {windows.map(win => {
          const isSelected = altTabSelectedId === win.id;
          return (
            <div
              key={win.id}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl min-w-[100px] max-w-[120px] transition-all duration-150 ${
                isSelected
                  ? 'bg-blue-600 text-white ring-2 ring-blue-400 scale-105 shadow-xl'
                  : settings.darkMode
                  ? 'bg-neutral-800/60 hover:bg-neutral-800 text-neutral-300'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-white shadow-md">
                <AppIcon name={win.icon} className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-center truncate max-w-full">
                {win.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
