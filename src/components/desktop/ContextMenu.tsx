import React, { useEffect, useRef } from 'react';
import { ContextMenuItem } from '../../types';

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
  darkMode?: boolean;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose, darkMode = true }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Adjust position to stay inside screen bounds
  const adjustedX = Math.min(x, window.innerWidth - 220);
  const adjustedY = Math.min(y, window.innerHeight - (items.length * 36 + 20));

  return (
    <div
      ref={menuRef}
      id="dex-context-menu"
      className={`fixed z-[9999] min-w-[200px] py-1.5 rounded-xl shadow-2xl backdrop-blur-xl border transition-all text-xs font-medium animate-in fade-in zoom-in-95 duration-100 ${
        darkMode
          ? 'bg-neutral-900/90 border-neutral-700/60 text-neutral-200'
          : 'bg-white/95 border-neutral-200 text-neutral-800 shadow-neutral-400/20'
      }`}
      style={{ left: `${Math.max(10, adjustedX)}px`, top: `${Math.max(10, adjustedY)}px` }}
    >
      {items.map((item, idx) => {
        if (item.divider) {
          return (
            <div
              key={`div-${idx}`}
              className={`my-1 border-t ${darkMode ? 'border-neutral-800' : 'border-neutral-100'}`}
            />
          );
        }

        return (
          <button
            key={item.id || idx}
            disabled={item.disabled}
            onClick={() => {
              if (!item.disabled) {
                item.onClick();
                onClose();
              }
            }}
            className={`w-full px-3.5 py-2 flex items-center justify-between text-left transition-colors ${
              item.disabled
                ? 'opacity-40 cursor-not-allowed'
                : darkMode
                ? 'hover:bg-neutral-800/80 active:bg-neutral-700/70'
                : 'hover:bg-neutral-100 active:bg-neutral-200'
            } ${item.danger ? 'text-red-400 hover:text-red-300' : ''}`}
          >
            <span className="flex items-center gap-2.5">
              {item.label}
            </span>
            {item.shortcut && (
              <span className={`text-[10px] ml-4 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                {item.shortcut}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
