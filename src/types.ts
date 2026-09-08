export type WindowSnapState =
  | 'none'
  | 'left'
  | 'right'
  | 'top'
  | 'maximized'
  | 'quad-tl'
  | 'quad-tr'
  | 'quad-bl'
  | 'quad-br'
  | 'split-left-60'
  | 'split-right-40';

export interface WindowBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DeXWindow {
  id: string;
  appId: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  isMinimized: boolean;
  isMaximized: boolean;
  prevBounds?: WindowBounds;
  snapState: WindowSnapState;
  zIndex: number;
  opacity?: number; // 0.3 - 1.0, Samsung DeX signature window transparency
  alwaysOnTop?: boolean;
  workspaceId?: number; // 1, 2, 3 (Virtual Desktops)
  params?: Record<string, any>;
}

export type FileType = 'folder' | 'text' | 'image' | 'code' | 'pdf' | 'spreadsheet' | 'archive';

export interface DeXFile {
  id: string;
  name: string;
  type: FileType;
  extension?: string;
  content?: string;
  size: number; // in bytes
  createdAt: string;
  updatedAt: string;
  parentId: string | null; // null = root
  isTrashed?: boolean;
  isFavorite?: boolean;
  imageUrl?: string;
}

export interface DeXNotification {
  id: string;
  title: string;
  message: string;
  appName: string;
  icon: string;
  timestamp: string;
  unread: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
  actionLabel?: string;
  onActionAppId?: string;
}

export interface DeXSettings {
  wallpaper: string;
  customWallpaperUrl?: string;
  wallpaperBlur: number;
  darkMode: boolean;
  accentColor: string;
  taskbarPosition: 'bottom' | 'top';
  taskbarAutoHide: boolean;
  desktopIconSize: 'small' | 'medium' | 'large';
  nightLight: boolean;
  nightLightWarmth: number;
  soundEnabled: boolean;
  windowSnapAssist: boolean;
  volume: number;
  brightness: number;
  wifiEnabled: boolean;
  bluetoothEnabled: boolean;
  performanceMode: boolean;
  dndEnabled: boolean;
  uiScale: number; // 90, 100, 110, 125%
  activeWorkspaceId: number; // 1: Kantor/Work, 2: Riset, 3: Media
  displayResolution: '1080p' | '1440p' | '4k' | 'ultrawide';
  dexLabsEnabled: boolean;
}

export interface DeXApp {
  id: string;
  name: string;
  icon: string;
  category: 'productivity' | 'system' | 'utilities' | 'media';
  description: string;
  defaultWidth: number;
  defaultHeight: number;
  minWidth?: number;
  minHeight?: number;
  isPinned: boolean;
}

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: string;
  danger?: boolean;
  divider?: boolean;
  disabled?: boolean;
  shortcut?: string;
  onClick: () => void;
}

export interface WorkspaceConfig {
  id: number;
  name: string;
  icon: string;
  description: string;
}
