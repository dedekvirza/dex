import React, { useState, useEffect, useRef } from 'react';
import { useDeX } from '../../context/DeXContext';
import { AppIcon } from '../common/AppIcon';
import {
  Wifi,
  WifiOff,
  BatteryCharging,
  Bell,
  SlidersHorizontal,
  Volume2,
  VolumeX,
  Search,
  Layers,
  X,
  Maximize2
} from 'lucide-react';

export const DeXTaskbar: React.FC = () => {
  const {
    apps,
    windows,
    activeWindowId,
    openApp,
    focusWindow,
    minimizeWindow,
    closeWindow,
    isAppDrawerOpen,
    setIsAppDrawerOpen,
    isOverviewOpen,
    setIsOverviewOpen,
    isQuickSettingsOpen,
    setIsQuickSettingsOpen,
    isNotificationCenterOpen,
    setIsNotificationCenterOpen,
    isCalendarOpen,
    setIsCalendarOpen,
    setIsSpotlightOpen,
    notifications,
    minimizeAll,
    workspaces,
    activeWorkspaceId,
    setActiveWorkspaceId,
    settings
  } = useDeX();

  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [hoveredAppId, setHoveredAppId] = useState<string | null>(null);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Real-time clock updater
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      setDateStr(now.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  // Apps to display on taskbar: Pinned apps + any unpinned app that has an open window
  const taskbarApps = apps.filter(app => {
    const hasWindow = windows.some(w => w.appId === app.id);
    return app.isPinned || hasWindow;
  });

  const handleAppClick = (appId: string) => {
    const win = windows.find(w => w.appId === appId);
    if (!win) {
      openApp(appId);
    } else if (win.id === activeWindowId && !win.isMinimized) {
      minimizeWindow(win.id);
    } else {
      focusWindow(win.id);
    }
  };

  const handleMouseEnterApp = (appId: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    const hasWindow = windows.some(w => w.appId === appId);
    if (hasWindow) {
      setHoveredAppId(appId);
    }
  };

  const handleMouseLeaveApp = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredAppId(null);
    }, 250);
  };

  const isTop = settings.taskbarPosition === 'top';
  const currentWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0];

  return (
    <div
      id="dex-taskbar"
      className={`fixed left-0 right-0 h-12 z-[1000] px-2.5 flex items-center justify-between select-none backdrop-blur-2xl transition-all ${
        isTop ? 'top-0 border-b border-t-0' : 'bottom-0 border-t'
      } ${
        settings.darkMode
          ? 'bg-neutral-950/85 border-neutral-800/70 text-neutral-200'
          : 'bg-white/90 border-neutral-200 text-neutral-800 shadow-md'
      }`}
    >
      {/* LEFT SECTION: DeX Navigation Controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Samsung DeX Launcher Button (Stylized DeX Hexagon Logo) */}
        <button
          id="btn-dex-app-drawer"
          title="Menu Aplikasi Samsung DeX (Tombol Win)"
          onClick={() => {
            setIsAppDrawerOpen(prev => !prev);
            setIsOverviewOpen(false);
            setIsQuickSettingsOpen(false);
            setIsNotificationCenterOpen(false);
            setIsCalendarOpen(false);
          }}
          className={`h-9 px-2.5 rounded-xl flex items-center gap-1.5 transition-all ${
            isAppDrawerOpen
              ? 'bg-blue-600 text-white shadow-md'
              : settings.darkMode
              ? 'hover:bg-neutral-800/80 active:bg-neutral-700 text-neutral-200'
              : 'hover:bg-neutral-200 active:bg-neutral-300 text-neutral-800'
          }`}
        >
          {/* Custom DeX Geometric Emblem */}
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-[10px] shadow-xs">
            <span>D</span>
          </div>
          <span className="font-bold text-xs tracking-tight">DeX</span>
        </button>

        {/* Task View / Window Overview Button (Samsung DeX 3 vertical bars) */}
        <button
          id="btn-dex-overview"
          title="Ikhtisar Jendela Aktif (Task View)"
          onClick={() => {
            setIsOverviewOpen(prev => !prev);
            setIsAppDrawerOpen(false);
            setIsQuickSettingsOpen(false);
            setIsNotificationCenterOpen(false);
            setIsCalendarOpen(false);
          }}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
            isOverviewOpen
              ? 'bg-blue-600 text-white shadow-md'
              : settings.darkMode
              ? 'hover:bg-neutral-800/80 active:bg-neutral-700 text-neutral-300'
              : 'hover:bg-neutral-200 active:bg-neutral-300 text-neutral-700'
          }`}
        >
          <div className="flex gap-1 items-center justify-center">
            <span className="w-1 h-3.5 rounded-full bg-current" />
            <span className="w-1 h-3.5 rounded-full bg-current" />
            <span className="w-1 h-3.5 rounded-full bg-current" />
          </div>
        </button>

        {/* Spotlight Quick Search Pill */}
        <button
          onClick={() => setIsSpotlightOpen(true)}
          className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-colors ${
            settings.darkMode
              ? 'bg-neutral-800/50 hover:bg-neutral-800/90 border-neutral-700/60 text-neutral-300 hover:text-white'
              : 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300/80 text-neutral-700'
          }`}
          title="Pencarian Cepat Spotlight (Alt + Space)"
        >
          <Search className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[11px] font-medium">Cari</span>
          <kbd className="text-[9px] px-1 py-0.2 rounded bg-neutral-700/60 text-neutral-300 font-mono">
            Alt+Space
          </kbd>
        </button>

        {/* Virtual Desktop / Workspace Selector */}
        <div className="relative">
          <button
            onClick={() => setShowWorkspaceMenu(prev => !prev)}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs transition-colors ${
              settings.darkMode
                ? 'bg-neutral-800/40 hover:bg-neutral-800 border-neutral-700/50 text-neutral-300'
                : 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-700'
            }`}
            title="Ganti Ruang Kerja (Ctrl + 1/2/3)"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-semibold">{currentWorkspace.name.split('/')[0]}</span>
          </button>

          {showWorkspaceMenu && (
            <div
              onClick={() => setShowWorkspaceMenu(false)}
              className={`absolute left-0 ${
                isTop ? 'top-full mt-1.5' : 'bottom-full mb-1.5'
              } p-2 rounded-2xl shadow-2xl border backdrop-blur-2xl z-50 flex flex-col gap-1 w-56 ${
                settings.darkMode
                  ? 'bg-neutral-900/95 border-neutral-700 text-neutral-200'
                  : 'bg-white/95 border-neutral-200 text-neutral-800'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-2 py-1">
                Pilih Ruang Kerja (Virtual Desktop)
              </span>
              {workspaces.map(ws => {
                const isSelected = activeWorkspaceId === ws.id;
                const winCount = windows.filter(w => (w.workspaceId || 1) === ws.id).length;
                return (
                  <button
                    key={ws.id}
                    onClick={() => setActiveWorkspaceId(ws.id)}
                    className={`flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : settings.darkMode
                        ? 'hover:bg-neutral-800 text-neutral-300'
                        : 'hover:bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    <div>
                      <span className="text-xs block">{ws.name}</span>
                      <span
                        className={`text-[10px] ${
                          isSelected ? 'text-blue-100' : 'text-neutral-400'
                        }`}
                      >
                        {winCount} jendela aktif
                      </span>
                    </div>
                    <span className="text-[10px] font-mono opacity-60">Ctrl+{ws.id}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="h-5 w-px bg-neutral-700/40 mx-1" />

        {/* PINNED & OPEN APPS WITH HOVER PREVIEW */}
        <div className="flex items-center gap-1">
          {taskbarApps.map(app => {
            const win = windows.find(w => w.appId === app.id);
            const isOpen = Boolean(win);
            const isActive = win?.id === activeWindowId && !win?.isMinimized;
            const isHovered = hoveredAppId === app.id && isOpen && win;

            return (
              <div
                key={app.id}
                className="relative"
                onMouseEnter={() => handleMouseEnterApp(app.id)}
                onMouseLeave={handleMouseLeaveApp}
              >
                <button
                  id={`taskbar-app-${app.id}`}
                  title={app.name}
                  onClick={() => handleAppClick(app.id)}
                  className={`relative w-9 h-9 rounded-xl flex flex-col items-center justify-center transition-all group ${
                    isActive
                      ? 'bg-white/20 shadow-sm'
                      : isOpen
                      ? 'bg-white/10 hover:bg-white/15'
                      : settings.darkMode
                      ? 'hover:bg-neutral-800/80 active:bg-neutral-700'
                      : 'hover:bg-neutral-200 active:bg-neutral-300'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-white transition-transform group-hover:scale-105 ${
                      app.id === 'files'
                        ? 'bg-amber-500'
                        : app.id === 'notes'
                        ? 'bg-orange-500'
                        : app.id === 'settings'
                        ? 'bg-blue-600'
                        : app.id === 'browser'
                        ? 'bg-sky-500'
                        : app.id === 'taskmanager'
                        ? 'bg-emerald-500'
                        : app.id === 'gallery'
                        ? 'bg-rose-500'
                        : 'bg-neutral-700'
                    }`}
                  >
                    <AppIcon name={app.icon} className="w-4 h-4" />
                  </div>

                  {/* Open Indicator Dot below icon */}
                  {isOpen && (
                    <span
                      className={`absolute bottom-0.5 rounded-full transition-all ${
                        isActive
                          ? 'w-3.5 h-1 bg-blue-400 shadow-sm'
                          : 'w-1.5 h-1 bg-neutral-400'
                      }`}
                    />
                  )}
                </button>

                {/* Live Taskbar Window Hover Preview Card */}
                {isHovered && (
                  <div
                    onClick={e => e.stopPropagation()}
                    className={`absolute left-1/2 -translate-x-1/2 ${
                      isTop ? 'top-full mt-2' : 'bottom-full mb-2'
                    } w-48 p-2.5 rounded-2xl shadow-2xl border backdrop-blur-2xl z-[1500] flex flex-col gap-2 pointer-events-auto animate-in fade-in zoom-in-95 duration-100 ${
                      settings.darkMode
                        ? 'bg-neutral-900/95 border-neutral-700 text-white'
                        : 'bg-white/95 border-neutral-200 text-neutral-900'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-1 border-b border-neutral-800/60">
                      <div className="flex items-center gap-1.5 truncate pr-1">
                        <AppIcon name={app.icon} className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="text-[11px] font-bold truncate">{win.title}</span>
                      </div>
                      <button
                        onClick={() => closeWindow(win.id)}
                        className="p-1 rounded-md hover:bg-red-500 text-neutral-400 hover:text-white transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    <div
                      onClick={() => {
                        focusWindow(win.id);
                        setHoveredAppId(null);
                      }}
                      className="h-16 rounded-xl bg-neutral-800/50 border border-neutral-700/50 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-neutral-800 transition-colors"
                    >
                      <Maximize2 className="w-4 h-4 text-neutral-400" />
                      <span className="text-[10px] text-neutral-400 font-medium">Klik untuk Fokus</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT SECTION: System Tray & Status Indicators */}
      <div className="flex items-center gap-1.5 shrink-0 text-xs">
        {/* Quick Language Indicator */}
        <div
          className={`px-2 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase ${
            settings.darkMode ? 'bg-neutral-800/60 text-neutral-400' : 'bg-neutral-200/60 text-neutral-600'
          }`}
        >
          ID
        </div>

        {/* Volume Button */}
        <button
          onClick={() => {
            setIsQuickSettingsOpen(prev => !prev);
            setIsNotificationCenterOpen(false);
            setIsCalendarOpen(false);
          }}
          className={`p-1.5 rounded-xl transition-colors ${
            settings.darkMode ? 'hover:bg-neutral-800 text-neutral-300' : 'hover:bg-neutral-200 text-neutral-700'
          }`}
          title={`Volume: ${settings.volume}%`}
        >
          {settings.volume === 0 || !settings.soundEnabled ? (
            <VolumeX className="w-4 h-4 text-neutral-400" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>

        {/* Wi-Fi & Battery Status Tray Group */}
        <button
          onClick={() => {
            setIsQuickSettingsOpen(prev => !prev);
            setIsNotificationCenterOpen(false);
            setIsCalendarOpen(false);
          }}
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-colors ${
            isQuickSettingsOpen
              ? 'bg-blue-600 text-white shadow-sm'
              : settings.darkMode
              ? 'hover:bg-neutral-800 text-neutral-300'
              : 'hover:bg-neutral-200 text-neutral-700'
          }`}
          title="Status Koneksi & Perangkat"
        >
          {settings.wifiEnabled ? (
            <Wifi className="w-3.5 h-3.5" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-neutral-500" />
          )}
          <div className="flex items-center gap-1 text-[11px] font-medium font-mono">
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            <span>88%</span>
          </div>
        </button>

        {/* Unified Notification Bell Button */}
        <button
          id="btn-dex-notifications"
          onClick={() => {
            setIsNotificationCenterOpen(prev => !prev);
            setIsQuickSettingsOpen(false);
            setIsCalendarOpen(false);
          }}
          className={`relative p-2 rounded-xl transition-colors ${
            isNotificationCenterOpen
              ? 'bg-blue-600 text-white shadow-sm'
              : settings.darkMode
              ? 'hover:bg-neutral-800 text-neutral-300'
              : 'hover:bg-neutral-200 text-neutral-700'
          }`}
          title="Pusat Notifikasi Terpadu"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-neutral-950">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Quick Settings Sliders Button */}
        <button
          id="btn-dex-quick-settings"
          onClick={() => {
            setIsQuickSettingsOpen(prev => !prev);
            setIsNotificationCenterOpen(false);
            setIsCalendarOpen(false);
          }}
          className={`p-2 rounded-xl transition-colors ${
            isQuickSettingsOpen
              ? 'bg-blue-600 text-white shadow-sm'
              : settings.darkMode
              ? 'hover:bg-neutral-800 text-neutral-300'
              : 'hover:bg-neutral-200 text-neutral-700'
          }`}
          title="Pengaturan Cepat DeX"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        {/* Clock & Date Widget */}
        <button
          id="btn-dex-calendar"
          onClick={() => {
            setIsCalendarOpen(prev => !prev);
            setIsQuickSettingsOpen(false);
            setIsNotificationCenterOpen(false);
          }}
          className={`flex flex-col items-end px-2.5 py-1 rounded-xl transition-colors ${
            isCalendarOpen
              ? 'bg-blue-600 text-white shadow-sm'
              : settings.darkMode
              ? 'hover:bg-neutral-800 text-neutral-200'
              : 'hover:bg-neutral-200 text-neutral-800'
          }`}
          title="Kalender & Waktu Sistem"
        >
          <span className="text-[11px] font-bold font-mono leading-tight">{timeStr || '08:45'}</span>
          <span className="text-[9px] text-neutral-400 leading-tight">{dateStr || '08/09/2026'}</span>
        </button>

        {/* Peek Desktop Button (Samsung DeX Right Strip) */}
        <button
          id="btn-dex-show-desktop"
          title="Tampilkan Desktop (Win+D)"
          onClick={minimizeAll}
          className="w-2.5 h-8 ml-0.5 rounded-xs hover:bg-neutral-600 active:bg-neutral-500 transition-colors opacity-40 hover:opacity-100"
        />
      </div>
    </div>
  );
};
