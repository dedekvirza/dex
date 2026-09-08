import React, { useState, useRef, useEffect } from 'react';
import { useDeX } from '../../context/DeXContext';
import { DEFAULT_WALLPAPERS } from '../../data/defaultData';
import { AppIcon } from '../common/AppIcon';
import { ContextMenu } from './ContextMenu';
import { ContextMenuItem } from '../../types';

interface DesktopIcon {
  id: string;
  appId?: string;
  name: string;
  icon: string;
  x: number;
  y: number;
  type: 'app' | 'folder' | 'file';
  targetId?: string;
}

export const DesktopCanvas: React.FC = () => {
  const {
    settings,
    apps,
    openApp,
    files,
    createFolder,
    createFile,
    updateSettings,
    addNotification
  } = useDeX();

  // Desktop icons state
  const [desktopIcons, setDesktopIcons] = useState<DesktopIcon[]>([
    { id: 'desk-files', appId: 'files', name: 'My Files', icon: 'FolderKanban', x: 28, y: 28, type: 'app' },
    { id: 'desk-notes', appId: 'notes', name: 'Samsung Notes', icon: 'FileText', x: 28, y: 136, type: 'app' },
    { id: 'desk-gallery', appId: 'gallery', name: 'Gallery', icon: 'Image', x: 28, y: 244, type: 'app' },
    { id: 'desk-browser', appId: 'browser', name: 'Browser', icon: 'Globe', x: 28, y: 352, type: 'app' },
    { id: 'desk-taskmgr', appId: 'taskmanager', name: 'Task Manager', icon: 'Activity', x: 136, y: 28, type: 'app' },
    { id: 'desk-terminal', appId: 'terminal', name: 'Terminal', icon: 'Terminal', x: 136, y: 136, type: 'app' },
    { id: 'desk-settings', appId: 'settings', name: 'DeX Settings', icon: 'SlidersHorizontal', x: 136, y: 244, type: 'app' },
    { id: 'desk-calc', appId: 'calculator', name: 'Calculator', icon: 'Calculator', x: 136, y: 352, type: 'app' },
  ]);

  const [selectedIconIds, setSelectedIconIds] = useState<string[]>([]);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; items: ContextMenuItem[] } | null>(null);

  // Marquee selection box state
  const [selectionBox, setSelectionBox] = useState<{ startX: number; startY: number; currentX: number; currentY: number } | null>(null);
  const isDraggingSelection = useRef(false);

  // Dragging individual icon state
  const [draggingIconId, setDraggingIconId] = useState<string | null>(null);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Current wallpaper resolution
  const currentWallpaper = DEFAULT_WALLPAPERS.find(w => w.id === settings.wallpaper) || DEFAULT_WALLPAPERS[0];
  const wallpaperUrl = settings.customWallpaperUrl || currentWallpaper.url;

  // Icon sizing classes
  const iconSizeClass =
    settings.desktopIconSize === 'small'
      ? 'w-10 h-10 text-xs'
      : settings.desktopIconSize === 'large'
      ? 'w-16 h-16 text-sm'
      : 'w-13 h-13 text-xs';

  // Open icon target
  const handleLaunch = (icon: DesktopIcon) => {
    if (icon.appId) {
      openApp(icon.appId, icon.targetId ? { fileId: icon.targetId } : undefined);
    } else if (icon.type === 'folder') {
      openApp('files', { folderId: icon.targetId });
    }
  };

  // Icon Dragging
  const handleIconMouseDown = (e: React.MouseEvent, icon: DesktopIcon) => {
    if (e.button !== 0) return; // Only left click
    e.stopPropagation();

    if (e.ctrlKey || e.metaKey) {
      setSelectedIconIds(prev =>
        prev.includes(icon.id) ? prev.filter(id => id !== icon.id) : [...prev, icon.id]
      );
    } else if (!selectedIconIds.includes(icon.id)) {
      setSelectedIconIds([icon.id]);
    }

    setDraggingIconId(icon.id);
    dragOffset.current = {
      x: e.clientX - icon.x,
      y: e.clientY - icon.y
    };
  };

  // Canvas Mouse down for marquee selection
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setContextMenu(null);
    setSelectedIconIds([]);
    isDraggingSelection.current = true;
    setSelectionBox({
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Icon drag
      if (draggingIconId) {
        const newX = Math.max(12, Math.min(window.innerWidth - 100, e.clientX - dragOffset.current.x));
        const newY = Math.max(12, Math.min(window.innerHeight - 140, e.clientY - dragOffset.current.y));
        setDesktopIcons(prev => prev.map(icon => icon.id === draggingIconId ? { ...icon, x: newX, y: newY } : icon));
        return;
      }

      // Marquee drag
      if (isDraggingSelection.current && selectionBox) {
        setSelectionBox(prev => prev ? { ...prev, currentX: e.clientX, currentY: e.clientY } : null);

        const left = Math.min(selectionBox.startX, e.clientX);
        const right = Math.max(selectionBox.startX, e.clientX);
        const top = Math.min(selectionBox.startY, e.clientY);
        const bottom = Math.max(selectionBox.startY, e.clientY);

        const selected = desktopIcons
          .filter(icon => {
            const iconCenter = { x: icon.x + 40, y: icon.y + 40 };
            return iconCenter.x >= left && iconCenter.x <= right && iconCenter.y >= top && iconCenter.y <= bottom;
          })
          .map(icon => icon.id);

        setSelectedIconIds(selected);
      }
    };

    const handleMouseUp = () => {
      if (draggingIconId) {
        // Snap to grid
        setDesktopIcons(prev =>
          prev.map(icon => {
            if (icon.id === draggingIconId) {
              const gridX = Math.round((icon.x - 28) / 108) * 108 + 28;
              const gridY = Math.round((icon.y - 28) / 108) * 108 + 28;
              return {
                ...icon,
                x: Math.max(28, gridX),
                y: Math.max(28, Math.min(window.innerHeight - 150, gridY))
              };
            }
            return icon;
          })
        );
        setDraggingIconId(null);
      }
      if (isDraggingSelection.current) {
        isDraggingSelection.current = false;
        setSelectionBox(null);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingIconId, selectionBox, desktopIcons]);

  // Right-click context menu on desktop
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const clickX = e.clientX;
    const clickY = e.clientY;

    const items: ContextMenuItem[] = [
      {
        id: 'new-folder',
        label: 'Folder Baru',
        shortcut: 'Ctrl+Shift+N',
        onClick: () => {
          const folder = createFolder('Folder Baru', null);
          setDesktopIcons(prev => [
            ...prev,
            {
              id: `desk-${folder.id}`,
              name: folder.name,
              icon: 'Folder',
              x: Math.min(window.innerWidth - 140, clickX),
              y: Math.min(window.innerHeight - 140, clickY),
              type: 'folder',
              targetId: folder.id
            }
          ]);
          addNotification({
            title: 'Folder Baru Dibuat',
            message: 'Folder baru telah ditambahkan ke desktop.',
            appName: 'My Files',
            icon: 'FolderKanban',
            type: 'info'
          });
        }
      },
      {
        id: 'new-note',
        label: 'Catatan Dokumen Baru',
        onClick: () => {
          const file = createFile('Catatan Baru.txt', 'Dokumen catatan baru.', null, 'text', 'txt');
          openApp('notes', { fileId: file.id });
        }
      },
      { id: 'div-1', label: '', divider: true, onClick: () => {} },
      {
        id: 'open-terminal',
        label: 'Buka DeX Terminal Di Sini',
        onClick: () => openApp('terminal')
      },
      {
        id: 'sort-icons',
        label: 'Susun Ikon Otomatis',
        onClick: () => {
          setDesktopIcons(prev => {
            const cols = Math.floor((window.innerHeight - 100) / 108);
            return prev.map((icon, idx) => {
              const col = Math.floor(idx / cols);
              const row = idx % cols;
              return {
                ...icon,
                x: 28 + col * 108,
                y: 28 + row * 108
              };
            });
          });
        }
      },
      { id: 'div-2', label: '', divider: true, onClick: () => {} },
      {
        id: 'wallpaper-settings',
        label: 'Ganti Wallpaper & Tampilan...',
        onClick: () => openApp('settings', { tab: 'display' })
      },
      {
        id: 'dex-settings',
        label: 'Pengaturan DeX Lengkap...',
        onClick: () => openApp('settings')
      }
    ];

    setContextMenu({ x: clickX, y: clickY, items });
  };

  return (
    <div
      id="dex-desktop-canvas"
      onMouseDown={handleCanvasMouseDown}
      onContextMenu={handleContextMenu}
      className="relative w-full h-full overflow-hidden select-none"
      style={{
        backgroundImage: `url(${wallpaperUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: settings.wallpaperBlur > 0 ? `blur(${settings.wallpaperBlur}px)` : undefined
      }}
    >
      {/* Night Light warm overlay if enabled */}
      {settings.nightLight && (
        <div
          className="pointer-events-none absolute inset-0 z-[1] transition-opacity duration-300"
          style={{
            backgroundColor: 'rgba(245, 158, 11, 0.18)',
            opacity: settings.nightLightWarmth / 100
          }}
        />
      )}

      {/* Subtle vignette shade */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35 z-[2]" />

      {/* Desktop Icons */}
      <div className="absolute inset-0 z-[5] pointer-events-none">
        {desktopIcons.map(icon => {
          const isSelected = selectedIconIds.includes(icon.id);
          return (
            <div
              key={icon.id}
              id={`desktop-icon-${icon.id}`}
              onMouseDown={e => handleIconMouseDown(e, icon)}
              onDoubleClick={() => handleLaunch(icon)}
              className={`pointer-events-auto absolute flex flex-col items-center justify-center p-2 rounded-xl cursor-pointer transition-colors duration-150 group ${
                isSelected
                  ? 'bg-blue-500/30 ring-1.5 ring-blue-400 backdrop-blur-sm shadow-md'
                  : 'hover:bg-white/15 active:bg-white/20'
              }`}
              style={{
                left: `${icon.x}px`,
                top: `${icon.y}px`,
                width: '84px',
                height: '84px',
                touchAction: 'none'
              }}
            >
              <div
                className={`flex items-center justify-center rounded-2xl shadow-lg transition-transform duration-150 group-hover:scale-105 ${iconSizeClass} ${
                  icon.appId === 'files'
                    ? 'bg-gradient-to-tr from-amber-600 to-amber-400 text-white'
                    : icon.appId === 'notes'
                    ? 'bg-gradient-to-tr from-orange-600 to-amber-500 text-white'
                    : icon.appId === 'gallery'
                    ? 'bg-gradient-to-tr from-rose-600 to-pink-500 text-white'
                    : icon.appId === 'browser'
                    ? 'bg-gradient-to-tr from-sky-600 to-blue-500 text-white'
                    : icon.appId === 'taskmanager'
                    ? 'bg-gradient-to-tr from-emerald-600 to-teal-400 text-white'
                    : icon.appId === 'terminal'
                    ? 'bg-gradient-to-tr from-neutral-800 to-neutral-700 text-emerald-400'
                    : icon.appId === 'settings'
                    ? 'bg-gradient-to-tr from-blue-700 to-indigo-600 text-white'
                    : 'bg-gradient-to-tr from-violet-600 to-purple-500 text-white'
                }`}
              >
                <AppIcon name={icon.icon} className="w-6 h-6 drop-shadow-sm" />
              </div>

              <span className="mt-1.5 text-[11px] font-medium text-white text-center leading-tight line-clamp-2 px-1 rounded drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] max-w-full">
                {icon.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Marquee Selection Rectangle */}
      {selectionBox && (
        <div
          className="absolute z-[6] pointer-events-none border border-blue-400 bg-blue-500/20 rounded-xs"
          style={{
            left: `${Math.min(selectionBox.startX, selectionBox.currentX)}px`,
            top: `${Math.min(selectionBox.startY, selectionBox.currentY)}px`,
            width: `${Math.abs(selectionBox.currentX - selectionBox.startX)}px`,
            height: `${Math.abs(selectionBox.currentY - selectionBox.startY)}px`
          }}
        />
      )}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={() => setContextMenu(null)}
          darkMode={settings.darkMode}
        />
      )}
    </div>
  );
};
