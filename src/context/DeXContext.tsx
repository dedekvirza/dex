import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  DeXApp,
  DeXFile,
  DeXNotification,
  DeXSettings,
  DeXWindow,
  FileType,
  WindowBounds,
  WindowSnapState,
  WorkspaceConfig
} from '../types';
import {
  DEFAULT_APPS,
  DEFAULT_FILES,
  DEFAULT_NOTIFICATIONS,
  DEFAULT_SETTINGS,
  DEFAULT_WORKSPACES
} from '../data/defaultData';
import { sound } from '../services/soundService';

interface DeXContextType {
  windows: DeXWindow[];
  activeWindowId: string | null;
  openApp: (appId: string, params?: Record<string, any>) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowBounds: (id: string, bounds: Partial<WindowBounds>) => void;
  snapWindow: (id: string, snapState: WindowSnapState) => void;
  setWindowOpacity: (id: string, opacity: number) => void;
  toggleWindowAlwaysOnTop: (id: string) => void;
  setWindowWorkspace: (id: string, workspaceId: number) => void;
  minimizeAll: () => void;
  closeAll: () => void;
  // Overlays
  isOverviewOpen: boolean;
  setIsOverviewOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  isAppDrawerOpen: boolean;
  setIsAppDrawerOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  isQuickSettingsOpen: boolean;
  setIsQuickSettingsOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  isNotificationCenterOpen: boolean;
  setIsNotificationCenterOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  isCalendarOpen: boolean;
  setIsCalendarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  isSpotlightOpen: boolean;
  setIsSpotlightOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  // Welcome Screen
  isWelcomeScreenOpen: boolean;
  setIsWelcomeScreenOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  // Alt Tab Switcher
  isAltTabActive: boolean;
  altTabSelectedId: string | null;
  // Quick Look File Preview
  quickLookFile: DeXFile | null;
  setQuickLookFile: (file: DeXFile | null) => void;
  // Workspaces
  workspaces: WorkspaceConfig[];
  activeWorkspaceId: number;
  setActiveWorkspaceId: (id: number) => void;
  // Files
  files: DeXFile[];
  createFolder: (name: string, parentId: string | null) => DeXFile;
  createFile: (name: string, content: string, parentId: string | null, type?: FileType, ext?: string, imageUrl?: string) => DeXFile;
  deleteFile: (id: string, permanent?: boolean) => void;
  restoreFile: (id: string) => void;
  renameFile: (id: string, newName: string) => void;
  emptyTrash: () => void;
  // Settings
  settings: DeXSettings;
  updateSettings: (newSettings: Partial<DeXSettings>) => void;
  // Notifications
  notifications: DeXNotification[];
  addNotification: (notif: Omit<DeXNotification, 'id' | 'timestamp' | 'unread'>) => void;
  dismissNotification: (id: string) => void;
  clearAllNotifications: () => void;
  markNotificationRead: (id: string) => void;
  // Apps
  apps: DeXApp[];
  togglePinApp: (appId: string) => void;
  resetToDefaults: () => void;
}

const DeXContext = createContext<DeXContextType | null>(null);

const STORAGE_KEYS = {
  SETTINGS: 'dex_settings_v1',
  FILES: 'dex_files_v1',
  APPS: 'dex_apps_v1',
  NOTIFS: 'dex_notifications_v1',
};

export const DeXProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load Settings
  const [settings, setSettings] = useState<DeXSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Load Files
  const [files, setFiles] = useState<DeXFile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FILES);
      return saved ? JSON.parse(saved) : DEFAULT_FILES;
    } catch {
      return DEFAULT_FILES;
    }
  });

  // Load Apps
  const [apps, setApps] = useState<DeXApp[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPS);
      return saved ? JSON.parse(saved) : DEFAULT_APPS;
    } catch {
      return DEFAULT_APPS;
    }
  });

  // Load Notifications
  const [notifications, setNotifications] = useState<DeXNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFS);
      return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  });

  // Window State
  const [windows, setWindows] = useState<DeXWindow[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState<number>(10);

  // Overlay states
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);
  const [isAppDrawerOpen, setIsAppDrawerOpen] = useState(false);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isWelcomeScreenOpen, setIsWelcomeScreenOpen] = useState(true);

  // Alt+Tab state
  const [isAltTabActive, setIsAltTabActive] = useState(false);
  const [altTabSelectedId, setAltTabSelectedId] = useState<string | null>(null);

  // Quick Look File Preview
  const [quickLookFile, setQuickLookFile] = useState<DeXFile | null>(null);

  // Workspaces (Virtual Desktops)
  const [workspaces] = useState<WorkspaceConfig[]>(DEFAULT_WORKSPACES);
  const [activeWorkspaceId, setActiveWorkspaceIdState] = useState<number>(settings.activeWorkspaceId || 1);

  const setActiveWorkspaceId = (id: number) => {
    setActiveWorkspaceIdState(id);
    updateSettings({ activeWorkspaceId: id });
    sound.playClick();
  };

  // Sync sound muted status
  useEffect(() => {
    sound.setMuted(!settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Persist Settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save DeX settings', e);
    }
  }, [settings]);

  // Persist Files
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(files));
    } catch (e) {
      console.error('Failed to save DeX files', e);
    }
  }, [files]);

  // Persist Apps
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(apps));
    } catch (e) {
      console.error('Failed to save DeX apps', e);
    }
  }, [apps]);

  // Persist Notifications
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed to save DeX notifications', e);
    }
  }, [notifications]);

  // Focus Window
  const focusWindow = useCallback((id: string) => {
    setWindows(prev => {
      const win = prev.find(w => w.id === id);
      if (!win) return prev;

      const highestZ = Math.max(...prev.map(w => w.zIndex), 10);
      const newZ = win.alwaysOnTop ? highestZ + 50 : highestZ + 1;

      return prev.map(w => {
        if (w.id === id) {
          return { ...w, isMinimized: false, zIndex: newZ };
        }
        return w;
      });
    });
    setActiveWindowId(id);
    sound.playClick();
  }, []);

  // Open App
  const openApp = useCallback((appId: string, params?: Record<string, any>) => {
    const existingWindow = windows.find(w => w.appId === appId);
    if (existingWindow) {
      // If already open, bring to front, unminimize, and switch to its workspace if different
      if (existingWindow.workspaceId && existingWindow.workspaceId !== activeWorkspaceId) {
        setActiveWorkspaceIdState(existingWindow.workspaceId);
      }
      setWindows(prev =>
        prev.map(w => (w.id === existingWindow.id ? { ...w, isMinimized: false, params: params || w.params } : w))
      );
      focusWindow(existingWindow.id);
      setIsAppDrawerOpen(false);
      setIsSpotlightOpen(false);
      return;
    }

    const appDef = apps.find(a => a.id === appId);
    if (!appDef) return;

    // Calculate smart cascaded position
    const offsetCount = windows.length % 6;
    const initialX = Math.max(40, 80 + offsetCount * 36);
    const initialY = Math.max(40, 60 + offsetCount * 30);

    const newWindowId = `win-${appId}-${Date.now()}`;
    const newWindow: DeXWindow = {
      id: newWindowId,
      appId,
      title: appDef.name,
      icon: appDef.icon,
      x: initialX,
      y: initialY,
      width: Math.min(appDef.defaultWidth, window.innerWidth - 60),
      height: Math.min(appDef.defaultHeight, window.innerHeight - 100),
      minWidth: appDef.minWidth || 400,
      minHeight: appDef.minHeight || 300,
      isMinimized: false,
      isMaximized: false,
      snapState: 'none',
      zIndex: nextZIndex + 1,
      opacity: 1,
      alwaysOnTop: false,
      workspaceId: activeWorkspaceId,
      params
    };

    setNextZIndex(prev => prev + 2);
    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(newWindowId);
    setIsAppDrawerOpen(false);
    setIsSpotlightOpen(false);
    sound.playWindowOpen();
  }, [windows, apps, nextZIndex, activeWorkspaceId, focusWindow]);

  // Close Window
  const closeWindow = useCallback((id: string) => {
    sound.playWindowClose();
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) {
      const remaining = windows.filter(w => w.id !== id && !w.isMinimized);
      if (remaining.length > 0) {
        const topWindow = remaining.reduce((prev, curr) => (curr.zIndex > prev.zIndex ? curr : prev), remaining[0]);
        setActiveWindowId(topWindow.id);
      } else {
        setActiveWindowId(null);
      }
    }
  }, [activeWindowId, windows]);

  // Minimize Window
  const minimizeWindow = useCallback((id: string) => {
    sound.playClick();
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, isMinimized: true } : w))
    );
    if (activeWindowId === id) {
      const remaining = windows.filter(w => w.id !== id && !w.isMinimized);
      if (remaining.length > 0) {
        const topWindow = remaining.reduce((prev, curr) => (curr.zIndex > prev.zIndex ? curr : prev), remaining[0]);
        setActiveWindowId(topWindow.id);
      } else {
        setActiveWindowId(null);
      }
    }
  }, [activeWindowId, windows]);

  // Restore Window
  const restoreWindow = useCallback((id: string) => {
    sound.playClick();
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, isMinimized: false } : w))
    );
    focusWindow(id);
  }, [focusWindow]);

  // Maximize Window
  const maximizeWindow = useCallback((id: string) => {
    sound.playSnap();
    setWindows(prev =>
      prev.map(w => {
        if (w.id !== id) return w;
        if (w.isMaximized) {
          // Restore to previous bounds
          return {
            ...w,
            isMaximized: false,
            snapState: 'none',
            x: w.prevBounds?.x ?? w.x,
            y: w.prevBounds?.y ?? w.y,
            width: w.prevBounds?.width ?? w.width,
            height: w.prevBounds?.height ?? w.height
          };
        } else {
          // Save prev bounds & maximize
          return {
            ...w,
            prevBounds: { x: w.x, y: w.y, width: w.width, height: w.height },
            isMaximized: true,
            snapState: 'maximized'
          };
        }
      })
    );
    focusWindow(id);
  }, [focusWindow]);

  // Snap Window
  const snapWindow = useCallback((id: string, snapState: WindowSnapState) => {
    sound.playSnap();
    setWindows(prev =>
      prev.map(w => {
        if (w.id !== id) return w;
        if (snapState === 'none') {
          return {
            ...w,
            snapState: 'none',
            isMaximized: false,
            x: w.prevBounds?.x ?? w.x,
            y: w.prevBounds?.y ?? w.y,
            width: w.prevBounds?.width ?? w.width,
            height: w.prevBounds?.height ?? w.height
          };
        } else {
          const prev = w.snapState === 'none' ? { x: w.x, y: w.y, width: w.width, height: w.height } : w.prevBounds;
          return {
            ...w,
            prevBounds: prev,
            snapState,
            isMaximized: snapState === 'maximized'
          };
        }
      })
    );
    focusWindow(id);
  }, [focusWindow]);

  // Set Window Opacity (DeX title bar transparency slider)
  const setWindowOpacity = useCallback((id: string, opacity: number) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, opacity: Math.max(0.3, Math.min(1.0, opacity)) } : w))
    );
  }, []);

  // Toggle Window Always On Top (pin on top)
  const toggleWindowAlwaysOnTop = useCallback((id: string) => {
    sound.playClick();
    setWindows(prev =>
      prev.map(w => {
        if (w.id !== id) return w;
        const nextPinned = !w.alwaysOnTop;
        const highestZ = Math.max(...prev.map(win => win.zIndex), 10);
        return {
          ...w,
          alwaysOnTop: nextPinned,
          zIndex: nextPinned ? highestZ + 50 : highestZ + 1
        };
      })
    );
  }, []);

  // Set Window Workspace
  const setWindowWorkspace = useCallback((id: string, workspaceId: number) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, workspaceId } : w))
    );
  }, []);

  // Update Window Bounds
  const updateWindowBounds = useCallback((id: string, bounds: Partial<WindowBounds>) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, ...bounds, snapState: 'none', isMaximized: false } : w))
    );
  }, []);

  // Minimize All
  const minimizeAll = useCallback(() => {
    sound.playClick();
    setWindows(prev => prev.map(w => ({ ...w, isMinimized: true })));
    setActiveWindowId(null);
  }, []);

  // Close All
  const closeAll = useCallback(() => {
    sound.playWindowClose();
    setWindows([]);
    setActiveWindowId(null);
    setIsOverviewOpen(false);
  }, []);

  // File Operations
  const createFolder = useCallback((name: string, parentId: string | null): DeXFile => {
    const newFolder: DeXFile = {
      id: `folder-${Date.now()}`,
      name: name.trim() || 'Folder Baru',
      type: 'folder',
      size: 4096,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      parentId
    };
    setFiles(prev => [newFolder, ...prev]);
    sound.playClick();
    return newFolder;
  }, []);

  const createFile = useCallback(
    (
      name: string,
      content: string,
      parentId: string | null,
      type: FileType = 'text',
      ext: string = 'txt',
      imageUrl?: string
    ): DeXFile => {
      const newFile: DeXFile = {
        id: `file-${Date.now()}`,
        name: name.trim() || 'Dokumen_Baru.txt',
        type,
        extension: ext,
        content,
        imageUrl,
        size: content.length || (imageUrl ? 102400 : 100),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        parentId
      };
      setFiles(prev => [newFile, ...prev]);
      sound.playClick();
      return newFile;
    },
    []
  );

  const deleteFile = useCallback((id: string, permanent: boolean = false) => {
    sound.playTrash();
    setFiles(prev => {
      if (permanent) {
        return prev.filter(f => f.id !== id);
      } else {
        return prev.map(f => (f.id === id ? { ...f, isTrashed: true } : f));
      }
    });
  }, []);

  const restoreFile = useCallback((id: string) => {
    sound.playClick();
    setFiles(prev => prev.map(f => (f.id === id ? { ...f, isTrashed: false } : f)));
  }, []);

  const renameFile = useCallback((id: string, newName: string) => {
    if (!newName.trim()) return;
    sound.playClick();
    setFiles(prev =>
      prev.map(f => (f.id === id ? { ...f, name: newName.trim(), updatedAt: new Date().toISOString() } : f))
    );
  }, []);

  const emptyTrash = useCallback(() => {
    sound.playTrash();
    setFiles(prev => prev.filter(f => !f.isTrashed));
  }, []);

  // Settings
  const updateSettings = useCallback((newSettings: Partial<DeXSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Notifications
  const addNotification = useCallback((notif: Omit<DeXNotification, 'id' | 'timestamp' | 'unread'>) => {
    sound.playNotification();
    const newNotif: DeXNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      unread: true
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, unread: false } : n)));
  }, []);

  // App pinning
  const togglePinApp = useCallback((appId: string) => {
    sound.playClick();
    setApps(prev =>
      prev.map(a => (a.id === appId ? { ...a, isPinned: !a.isPinned } : a))
    );
  }, []);

  // Reset
  const resetToDefaults = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    setFiles(DEFAULT_FILES);
    setApps(DEFAULT_APPS);
    setNotifications(DEFAULT_NOTIFICATIONS);
    setWindows([]);
    setActiveWindowId(null);
    localStorage.clear();
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing in input, textarea, or contenteditable
      const target = e.target as HTMLElement | null;
      const isInputFocused =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      // Escape -> close overlays
      if (e.key === 'Escape') {
        if (isSpotlightOpen) {
          setIsSpotlightOpen(false);
          return;
        }
        if (quickLookFile) {
          setQuickLookFile(null);
          return;
        }
        if (isAppDrawerOpen) setIsAppDrawerOpen(false);
        if (isOverviewOpen) setIsOverviewOpen(false);
        if (isQuickSettingsOpen) setIsQuickSettingsOpen(false);
        if (isNotificationCenterOpen) setIsNotificationCenterOpen(false);
        if (isCalendarOpen) setIsCalendarOpen(false);
        return;
      }

      // Alt + Space OR Ctrl + K -> Toggle Spotlight Search Bar (Mac Spotlight / Raycast / DeX style)
      if ((e.altKey && (e.code === 'Space' || e.key === ' ')) || (e.ctrlKey && (e.key === 'k' || e.key === 'K'))) {
        e.preventDefault();
        setIsSpotlightOpen(prev => !prev);
        setIsAppDrawerOpen(false);
        return;
      }

      // Win key (Meta / Super) -> Toggle App Drawer
      if (e.key === 'Meta' && !isInputFocused) {
        e.preventDefault();
        setIsAppDrawerOpen(prev => !prev);
        return;
      }

      // Alt + Tab -> Window Switcher
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        const list = windows.filter(w => !w.isMinimized);
        if (list.length === 0) return;

        setIsAltTabActive(true);
        setAltTabSelectedId(curr => {
          if (!curr) return list[0]?.id || null;
          const idx = list.findIndex(w => w.id === curr);
          const nextIdx = (idx + 1) % list.length;
          return list[nextIdx]?.id || null;
        });
        return;
      }

      // Ctrl + 1, 2, 3 -> Switch Virtual Desktop Workspace
      if (e.ctrlKey && (e.key === '1' || e.key === '2' || e.key === '3') && !isInputFocused) {
        e.preventDefault();
        const num = parseInt(e.key);
        setActiveWorkspaceId(num);
        return;
      }

      // Win + D -> Minimize All / Toggle Desktop
      if ((e.metaKey || e.ctrlKey) && (e.key === 'd' || e.key === 'D') && !isInputFocused) {
        e.preventDefault();
        const anyVisible = windows.some(w => !w.isMinimized);
        if (anyVisible) {
          minimizeAll();
        } else {
          setWindows(prev => prev.map(w => ({ ...w, isMinimized: false })));
        }
        return;
      }

      // Window snapping shortcuts when a window is active
      if ((e.metaKey || e.altKey) && activeWindowId && !isInputFocused) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          snapWindow(activeWindowId, 'left');
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          snapWindow(activeWindowId, 'right');
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          maximizeWindow(activeWindowId);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          minimizeWindow(activeWindowId);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        if (isAltTabActive) {
          setIsAltTabActive(false);
          if (altTabSelectedId) {
            focusWindow(altTabSelectedId);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    windows,
    activeWindowId,
    isAltTabActive,
    altTabSelectedId,
    isSpotlightOpen,
    quickLookFile,
    isAppDrawerOpen,
    isOverviewOpen,
    isQuickSettingsOpen,
    isNotificationCenterOpen,
    isCalendarOpen,
    focusWindow,
    maximizeWindow,
    minimizeWindow,
    snapWindow,
    minimizeAll
  ]);

  return (
    <DeXContext.Provider
      value={{
        windows,
        activeWindowId,
        openApp,
        closeWindow,
        minimizeWindow,
        restoreWindow,
        maximizeWindow,
        focusWindow,
        updateWindowBounds,
        snapWindow,
        setWindowOpacity,
        toggleWindowAlwaysOnTop,
        setWindowWorkspace,
        minimizeAll,
        closeAll,
        isOverviewOpen,
        setIsOverviewOpen,
        isAppDrawerOpen,
        setIsAppDrawerOpen,
        isQuickSettingsOpen,
        setIsQuickSettingsOpen,
        isNotificationCenterOpen,
        setIsNotificationCenterOpen,
        isCalendarOpen,
        setIsCalendarOpen,
        isSpotlightOpen,
        setIsSpotlightOpen,
        isWelcomeScreenOpen,
        setIsWelcomeScreenOpen,
        isAltTabActive,
        altTabSelectedId,
        quickLookFile,
        setQuickLookFile,
        workspaces,
        activeWorkspaceId,
        setActiveWorkspaceId,
        files,
        createFolder,
        createFile,
        deleteFile,
        restoreFile,
        renameFile,
        emptyTrash,
        settings,
        updateSettings,
        notifications,
        addNotification,
        dismissNotification,
        clearAllNotifications,
        markNotificationRead,
        apps,
        togglePinApp,
        resetToDefaults
      }}
    >
      {children}
    </DeXContext.Provider>
  );
};

export const useDeX = () => {
  const context = useContext(DeXContext);
  if (!context) {
    throw new Error('useDeX must be used within a DeXProvider');
  }
  return context;
};
