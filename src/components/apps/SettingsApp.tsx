import React, { useState } from 'react';
import { useDeX } from '../../context/DeXContext';
import { DEFAULT_WALLPAPERS } from '../../data/defaultData';
import {
  Monitor,
  Palette,
  Layout,
  Volume2,
  HardDrive,
  Info,
  Check,
  Moon,
  Sun,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Cpu,
  Keyboard,
  MousePointer,
  Layers,
  FlaskConical,
  Zap
} from 'lucide-react';

interface SettingsAppProps {
  initialTab?: string;
}

const ACCENT_COLORS = [
  { id: '#2563eb', name: 'DeX Royal Blue' },
  { id: '#06b6d4', name: 'Cyber Cyan' },
  { id: '#10b981', name: 'Emerald Mint' },
  { id: '#f59e0b', name: 'Sunset Amber' },
  { id: '#8b5cf6', name: 'Royal Violet' },
  { id: '#f43f5e', name: 'Crimson Rose' },
  { id: '#64748b', name: 'Obsidian Slate' }
];

export const SettingsApp: React.FC<SettingsAppProps> = ({ initialTab = 'display' }) => {
  const {
    settings,
    updateSettings,
    addNotification,
    resetToDefaults,
    workspaces,
    activeWorkspaceId,
    setActiveWorkspaceId,
    setIsWelcomeScreenOpen
  } = useDeX();

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [cleaningRam, setCleaningRam] = useState(false);
  const [ramCleanedMessage, setRamCleanedMessage] = useState<string | null>(null);

  const handleCleanRam = () => {
    setCleaningRam(true);
    setTimeout(() => {
      setCleaningRam(false);
      setRamCleanedMessage('1.8 GB RAM berhasil dioptimalkan & cache dibersihkan!');
      addNotification({
        title: 'Device Care Dioptimalkan',
        message: 'Alokasi RAM dan proses latar belakang sistem telah dipercepat.',
        appName: 'Device Care',
        icon: 'Sparkles',
        type: 'success'
      });
      setTimeout(() => setRamCleanedMessage(null), 4000);
    }, 1200);
  };

  return (
    <div className="flex h-full w-full select-none text-xs">
      {/* Sidebar Navigation */}
      <div
        className={`w-56 shrink-0 border-r flex flex-col p-3 gap-1.5 ${
          settings.darkMode
            ? 'bg-neutral-900/70 border-neutral-800 text-neutral-300'
            : 'bg-neutral-50 border-neutral-200 text-neutral-700'
        }`}
      >
        <div className="px-2 py-1 mb-2">
          <span className="font-bold text-sm tracking-tight text-white dark:text-neutral-100">
            DeX Settings
          </span>
        </div>

        <button
          onClick={() => setActiveTab('display')}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-medium transition-colors ${
            activeTab === 'display'
              ? 'bg-blue-600 text-white shadow-xs'
              : settings.darkMode
              ? 'hover:bg-neutral-800 text-neutral-300'
              : 'hover:bg-neutral-200 text-neutral-800'
          }`}
        >
          <Monitor className="w-4 h-4" />
          <span>Tampilan & Resolusi</span>
        </button>

        <button
          onClick={() => setActiveTab('themes')}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-medium transition-colors ${
            activeTab === 'themes'
              ? 'bg-blue-600 text-white shadow-xs'
              : settings.darkMode
              ? 'hover:bg-neutral-800 text-neutral-300'
              : 'hover:bg-neutral-200 text-neutral-800'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Kustomisasi & Tema</span>
        </button>

        <button
          onClick={() => setActiveTab('multitasking')}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-medium transition-colors ${
            activeTab === 'multitasking'
              ? 'bg-blue-600 text-white shadow-xs'
              : settings.darkMode
              ? 'hover:bg-neutral-800 text-neutral-300'
              : 'hover:bg-neutral-200 text-neutral-800'
          }`}
        >
          <Layout className="w-4 h-4" />
          <span>Multitasking & Workspaces</span>
        </button>

        <button
          onClick={() => setActiveTab('sound')}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-medium transition-colors ${
            activeTab === 'sound'
              ? 'bg-blue-600 text-white shadow-xs'
              : settings.darkMode
              ? 'hover:bg-neutral-800 text-neutral-300'
              : 'hover:bg-neutral-200 text-neutral-800'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>Suara & Notifikasi</span>
        </button>

        <button
          onClick={() => setActiveTab('care')}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-medium transition-colors ${
            activeTab === 'care'
              ? 'bg-blue-600 text-white shadow-xs'
              : settings.darkMode
              ? 'hover:bg-neutral-800 text-neutral-300'
              : 'hover:bg-neutral-200 text-neutral-800'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          <span>Device Care & Storage</span>
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-medium transition-colors ${
            activeTab === 'about'
              ? 'bg-blue-600 text-white shadow-xs'
              : settings.darkMode
              ? 'hover:bg-neutral-800 text-neutral-300'
              : 'hover:bg-neutral-200 text-neutral-800'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>Tentang DeX Pro</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* DISPLAY & RESOLUTION */}
        {activeTab === 'display' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="text-base font-bold text-white dark:text-neutral-100">
                Tampilan, Resolusi & Wallpaper
              </h3>
              <p className="text-neutral-400 mt-1">
                Atur resolusi monitor eksternal, skala UI, latar belakang visual, dan kenyamanan mata.
              </p>
            </div>

            {/* Display Resolution & Scaling */}
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-800/40 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-neutral-200 block">Resolusi Layar Monitor DeX</span>
                  <span className="text-[11px] text-neutral-400">Pilih mode tampilan grafis sesuai layar monitor Anda</span>
                </div>
                <select
                  value={settings.displayResolution || '1920x1080'}
                  onChange={e => {
                    updateSettings({ displayResolution: e.target.value as any });
                    addNotification({
                      title: 'Resolusi Layar Diperbarui',
                      message: `Mode resolusi diset ke ${e.target.value}.`,
                      appName: 'Display Settings',
                      icon: 'Monitor',
                      type: 'info'
                    });
                  }}
                  className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-1 text-xs"
                >
                  <option value="1920x1080">FHD (1920 x 1080) 60Hz - Standar</option>
                  <option value="2560x1440">QHD 2K (2560 x 1440) - DeX Pro</option>
                  <option value="3440x1440">WQHD+ (3440 x 1440) - 21:9 UltraWide</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-neutral-700/50">
                <div>
                  <span className="font-medium text-neutral-200 block">Skala Elemen UI (DPI Scaling)</span>
                  <span className="text-[11px] text-neutral-400">Atur keterbacaan teks dan kepadatan layout</span>
                </div>
                <div className="flex gap-1 bg-neutral-800 p-1 rounded-lg border border-neutral-700">
                  {([100, 110, 125] as const).map(scale => (
                    <button
                      key={scale}
                      onClick={() => updateSettings({ uiScale: scale })}
                      className={`px-2.5 py-0.5 rounded text-[11px] font-mono ${
                        (settings.uiScale || 100) === scale
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {scale}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Wallpaper Grid */}
            <div className="space-y-3">
              <span className="font-semibold text-neutral-300">Pilihan Wallpaper Resmi DeX</span>
              <div className="grid grid-cols-3 gap-3">
                {DEFAULT_WALLPAPERS.map(wp => {
                  const isSelected = settings.wallpaper === wp.id && !settings.customWallpaperUrl;
                  return (
                    <div
                      key={wp.id}
                      onClick={() => {
                        updateSettings({ wallpaper: wp.id, customWallpaperUrl: undefined });
                        addNotification({
                          title: 'Wallpaper Diperbarui',
                          message: `Wallpaper berganti ke ${wp.name}.`,
                          appName: 'DeX Settings',
                          icon: 'Image',
                          type: 'info'
                        });
                      }}
                      className={`relative h-24 rounded-xl overflow-hidden cursor-pointer group border-2 transition-all ${
                        isSelected
                          ? 'border-blue-500 ring-2 ring-blue-500/40 scale-102 shadow-lg'
                          : 'border-neutral-700/60 hover:border-neutral-500'
                      }`}
                    >
                      <img
                        src={wp.thumbnail}
                        alt={wp.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                        <span className="text-[11px] font-medium text-white truncate">
                          {wp.name}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Wallpaper Blur Slider */}
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-neutral-200">Efek Buram Wallpaper (Blur)</span>
                <span className="text-blue-400 font-bold">{settings.wallpaperBlur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="16"
                value={settings.wallpaperBlur}
                onChange={e => updateSettings({ wallpaperBlur: parseInt(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-neutral-400">
                Memburamkan latar belakang membantu fokus pada jendela aplikasi yang sedang aktif.
              </p>
            </div>

            {/* Night Light (Pelindung Mata) */}
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-neutral-200 block">Pelindung Mata (Night Light)</span>
                  <span className="text-[11px] text-neutral-400">
                    Menyaring cahaya biru untuk mengurangi ketegangan mata di malam hari.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.nightLight}
                  onChange={e => updateSettings({ nightLight: e.target.checked })}
                  className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              {settings.nightLight && (
                <div className="pt-2 border-t border-neutral-700/50 space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-neutral-300">Intensitas Kehangatan Warna</span>
                    <span className="text-amber-400 font-bold">{settings.nightLightWarmth}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    value={settings.nightLightWarmth}
                    onChange={e => updateSettings({ nightLightWarmth: parseInt(e.target.value) })}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* CUSTOMIZATION & THEMES */}
        {activeTab === 'themes' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="text-base font-bold text-white dark:text-neutral-100">
                Kustomisasi Antarmuka Pengguna
              </h3>
              <p className="text-neutral-400 mt-1">
                Sesuaikan skema warna aksen One UI, tema tampilan, dan tata letak bilah tugas.
              </p>
            </div>

            {/* Dark Mode vs Light Mode */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => updateSettings({ darkMode: true })}
                className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${
                  settings.darkMode
                    ? 'border-blue-500 bg-neutral-900 ring-2 ring-blue-500/30 shadow-lg'
                    : 'border-neutral-700 bg-neutral-800/50 hover:bg-neutral-800'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-blue-400">
                  <Moon className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <span className="font-bold text-white block">Mode Gelap (DeX Dark)</span>
                  <span className="text-[11px] text-neutral-400">Standar profesional DeX</span>
                </div>
              </button>

              <button
                onClick={() => updateSettings({ darkMode: false })}
                className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${
                  !settings.darkMode
                    ? 'border-blue-500 bg-white ring-2 ring-blue-500/30 text-neutral-900 shadow-lg'
                    : 'border-neutral-700 bg-neutral-800/50 hover:bg-neutral-800'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-neutral-200 border border-neutral-300 flex items-center justify-center text-amber-500">
                  <Sun className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <span className="font-bold text-neutral-200 block">Mode Terang (Light)</span>
                  <span className="text-[11px] text-neutral-400">Kontras cerah untuk siang hari</span>
                </div>
              </button>
            </div>

            {/* Accent Color Picker */}
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-800/40 space-y-3">
              <span className="font-medium text-neutral-200 block">Warna Aksen One UI DeX</span>
              <div className="flex flex-wrap gap-3">
                {ACCENT_COLORS.map(color => {
                  const isSelected = settings.accentColor === color.id;
                  return (
                    <button
                      key={color.id}
                      onClick={() => updateSettings({ accentColor: color.id })}
                      className="group flex flex-col items-center gap-1.5"
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-md ${
                          isSelected ? 'ring-3 ring-white/60 scale-105' : ''
                        }`}
                        style={{ backgroundColor: color.id }}
                      >
                        {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                      </div>
                      <span className="text-[10px] text-neutral-400">{color.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Taskbar Position & Desktop Icons */}
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-800/40 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-neutral-200 block">Posisi Bilah Tugas (Taskbar)</span>
                  <span className="text-[11px] text-neutral-400">Pilih penempatan bilah navigasi utama</span>
                </div>
                <select
                  value={settings.taskbarPosition}
                  onChange={e => updateSettings({ taskbarPosition: e.target.value as 'bottom' | 'top' })}
                  className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-2.5 py-1 text-xs"
                >
                  <option value="bottom">Bawah Layar (Standar)</option>
                  <option value="top">Atas Layar</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-neutral-700/50">
                <div>
                  <span className="font-medium text-neutral-200 block">Ukuran Ikon Desktop</span>
                  <span className="text-[11px] text-neutral-400">Skala grid ikon di layar utama</span>
                </div>
                <div className="flex gap-1 bg-neutral-800 p-1 rounded-lg border border-neutral-700">
                  {(['small', 'medium', 'large'] as const).map(size => (
                    <button
                      key={size}
                      onClick={() => updateSettings({ desktopIconSize: size })}
                      className={`px-2 py-0.5 rounded capitalize text-[11px] ${
                        settings.desktopIconSize === size ? 'bg-blue-600 text-white font-semibold' : 'text-neutral-400'
                      }`}
                    >
                      {size === 'small' ? 'Kecil' : size === 'medium' ? 'Sedang' : 'Besar'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MULTITASKING, WORKSPACES & INPUT */}
        {activeTab === 'multitasking' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="text-base font-bold text-white dark:text-neutral-100">
                Multitasking, Ruang Kerja & Input
              </h3>
              <p className="text-neutral-400 mt-1">
                Kelola ruang kerja virtual (desktops), snapping presisi, dan produktivitas keyboard mouse.
              </p>
            </div>

            {/* Virtual Workspaces Management */}
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span className="font-medium text-neutral-200">Ruang Kerja Virtual (Virtual Desktops)</span>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">Pintasan: Ctrl + 1/2/3</span>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {workspaces.map(ws => {
                  const isCurrent = activeWorkspaceId === ws.id;
                  return (
                    <button
                      key={ws.id}
                      onClick={() => setActiveWorkspaceId(ws.id)}
                      className={`p-3 rounded-xl border flex flex-col items-start gap-1 text-left transition-all ${
                        isCurrent
                          ? 'border-blue-500 bg-blue-600/20 ring-1 ring-blue-500/40 text-white'
                          : 'border-neutral-700 bg-neutral-800/40 hover:bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      <span className="text-base">{ws.icon}</span>
                      <span className="font-bold text-xs">{ws.name}</span>
                      <span className="text-[10px] text-neutral-400">Desktop #{ws.id}</span>
                      {isCurrent && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-600 text-white font-medium mt-1">
                          Aktif Sekarang
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Window Snap Assist */}
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-neutral-200 block">Window Snap Assist Otomatis</span>
                  <span className="text-[11px] text-neutral-400">
                    Menarik jendela ke tepi layar langsung membagi layar (split 50/50) atau memaksimalkan.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.windowSnapAssist}
                  onChange={e => updateSettings({ windowSnapAssist: e.target.checked })}
                  className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Samsung DeX Labs Experimental Features */}
            <div className="p-4 rounded-xl border border-indigo-900/40 bg-indigo-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-indigo-400" />
                  <span className="font-semibold text-indigo-200">Samsung DeX Labs</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-600/30 text-indigo-300 font-medium">
                  Eksperimental
                </span>
              </div>
              <p className="text-[11px] text-indigo-200/80">
                Fitur lanjutan untuk memperluas kemampuan multi-jendela dan tata kelola workstation tingkat lanjut.
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-indigo-800/40">
                <div>
                  <span className="font-medium text-neutral-200 block">Paksa Multi-Window untuk Semua Aplikasi</span>
                  <span className="text-[10px] text-neutral-400">Izinkan resize dan multi-instance bebas tanpa batas</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.dexLabsEnabled || false}
                  onChange={e => updateSettings({ dexLabsEnabled: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Keyboard Shortcuts Table */}
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-800/40 space-y-3">
              <div className="flex items-center gap-2 text-blue-400 font-semibold">
                <Keyboard className="w-4 h-4" />
                <span>Pintasan Keyboard Produktivitas DeX</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-neutral-700/40">
                  <span className="text-neutral-300">Pencarian Universal Cepat (Spotlight)</span>
                  <kbd className="px-2 py-1 rounded bg-neutral-700 border border-neutral-600 font-mono text-[11px] text-white">
                    Alt + Spasi / Ctrl + K
                  </kbd>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-neutral-700/40">
                  <span className="text-neutral-300">Beralih Ruang Kerja Virtual (Desktops)</span>
                  <kbd className="px-2 py-1 rounded bg-neutral-700 border border-neutral-600 font-mono text-[11px] text-white">
                    Ctrl + 1 / 2 / 3
                  </kbd>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-neutral-700/40">
                  <span className="text-neutral-300">Ganti Jendela Aktif Secara Visual</span>
                  <kbd className="px-2 py-1 rounded bg-neutral-700 border border-neutral-600 font-mono text-[11px] text-white">
                    Alt + Tab
                  </kbd>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-neutral-700/40">
                  <span className="text-neutral-300">Buka / Tutup App Drawer (Menu Aplikasi)</span>
                  <kbd className="px-2 py-1 rounded bg-neutral-700 border border-neutral-600 font-mono text-[11px] text-white">
                    Tombol Win / Super
                  </kbd>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-neutral-700/40">
                  <span className="text-neutral-300">Minimalkan Semua Jendela (Show Desktop)</span>
                  <kbd className="px-2 py-1 rounded bg-neutral-700 border border-neutral-600 font-mono text-[11px] text-white">
                    Win + D / Ctrl + D
                  </kbd>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-neutral-700/40">
                  <span className="text-neutral-300">Snap Jendela ke Kiri / Kanan Layar</span>
                  <kbd className="px-2 py-1 rounded bg-neutral-700 border border-neutral-600 font-mono text-[11px] text-white">
                    Win + Panah Kiri / Kanan
                  </kbd>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-neutral-300">Maksimalkan Jendela Aktif</span>
                  <kbd className="px-2 py-1 rounded bg-neutral-700 border border-neutral-600 font-mono text-[11px] text-white">
                    Win + Panah Atas
                  </kbd>
                </div>
              </div>
            </div>

            {/* Mouse Gestures */}
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-800/40 space-y-2">
              <div className="flex items-center gap-2 text-neutral-200 font-semibold">
                <MousePointer className="w-4 h-4 text-emerald-400" />
                <span>Interaksi Mouse Presisi</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-neutral-400 text-[11px]">
                <li>Klik dua kali pada header jendela untuk beralih antara ukuran normal dan layar penuh.</li>
                <li>Gunakan ikon Mata (Eye) pada header jendela untuk mengatur transparansi jendela secara langsung.</li>
                <li>Gunakan ikon Pin pada header jendela untuk menyematkan jendela selalu di atas (Always On Top).</li>
                <li>Arahkan mouse ke tombol maksimalkan untuk menampilkan menu pilihan layout Snap 50/50, 60/40, & Kuadran.</li>
                <li>Klik kanan di mana saja pada desktop atau file manager untuk membuka menu konteks DeX.</li>
              </ul>
            </div>
          </div>
        )}

        {/* SOUND & NOTIFICATIONS */}
        {activeTab === 'sound' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="text-base font-bold text-white dark:text-neutral-100">
                Suara & Notifikasi Terpadu
              </h3>
              <p className="text-neutral-400 mt-1">
                Kelola efek umpan balik audio dan preferensi pemberitahuan kerja.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-neutral-200 block">Efek Audio DeX UI</span>
                  <span className="text-[11px] text-neutral-400">
                    Suara klik, snap jendela, lonceng notifikasi, dan interaksi sistem.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={e => updateSettings({ soundEnabled: e.target.checked })}
                  className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t border-neutral-700/50 space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-neutral-300">Volume Suara Utama</span>
                  <span className="text-blue-400 font-bold">{settings.volume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.volume}
                  onChange={e => updateSettings({ volume: parseInt(e.target.value) })}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-neutral-200 block">Jangan Ganggu (Do Not Disturb)</span>
                  <span className="text-[11px] text-neutral-400">
                    Senyapkan pop-up notifikasi saat presentasi atau fokus mendalam.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.dndEnabled}
                  onChange={e => updateSettings({ dndEnabled: e.target.checked })}
                  className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* DEVICE CARE & STORAGE */}
        {activeTab === 'care' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="text-base font-bold text-white dark:text-neutral-100">
                Perawatan Perangkat & Penyimpanan
              </h3>
              <p className="text-neutral-400 mt-1">
                Optimalkan memori RAM dan periksa performa sistem secara instan.
              </p>
            </div>

            {/* RAM Cleaner Box */}
            <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-800/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white block">Status Memori: 3.4 GB / 12 GB</span>
                  <span className="text-[11px] text-neutral-400">
                    Sistem beroperasi optimal dengan latensi minimal.
                  </span>
                  {ramCleanedMessage && (
                    <span className="text-[11px] text-emerald-400 font-semibold block mt-1 animate-pulse">
                      {ramCleanedMessage}
                    </span>
                  )}
                </div>
              </div>

              <button
                disabled={cleaningRam}
                onClick={handleCleanRam}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold transition-all disabled:opacity-50 shadow-md"
              >
                <RefreshCw className={`w-4 h-4 ${cleaningRam ? 'animate-spin' : ''}`} />
                <span>{cleaningRam ? 'Mengoptimalkan...' : 'Bersihkan RAM'}</span>
              </button>
            </div>

            {/* Performance Mode */}
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-neutral-200 block">Mode Performa Tinggi DeX</span>
                  <span className="text-[11px] text-neutral-400">
                    Tingkatkan prioritas GPU dan compositing multi-jendela.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.performanceMode}
                  onChange={e => {
                    updateSettings({ performanceMode: e.target.checked });
                    addNotification({
                      title: e.target.checked ? 'Mode Performa Tinggi Aktif' : 'Mode Hemat Energi Aktif',
                      message: e.target.checked ? 'Akselerasi grafis maksimum diaktifkan.' : 'Daya dihemat untuk efisiensi baterai.',
                      appName: 'Device Care',
                      icon: 'Zap',
                      type: 'info'
                    });
                  }}
                  className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Factory Reset */}
            <div className="p-4 rounded-xl border border-red-900/40 bg-red-950/20 space-y-2">
              <span className="font-medium text-red-300 block">Reset Konfigurasi Pabrik</span>
              <p className="text-[11px] text-red-400/80">
                Kembalikan semua pengaturan, posisi jendela, dan data awal ke konfigurasi standar DeX Pro.
              </p>
              <button
                onClick={() => {
                  if (confirm('Apakah Anda yakin ingin mereset seluruh pengaturan DeX ke default pabrik?')) {
                    resetToDefaults();
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-semibold transition-colors mt-1"
              >
                Reset Ke Standar Pabrik
              </button>
            </div>
          </div>
        )}

        {/* ABOUT DEX PRO */}
        {activeTab === 'about' && (
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center gap-4 p-5 rounded-xl border border-neutral-800 bg-neutral-800/50">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-500 flex items-center justify-center text-white shadow-lg">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Samsung DeX Pro Edition</h4>
                <p className="text-xs text-neutral-400 mt-0.5">Versi One UI 6.1 (Build UP1A.260908.001)</p>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-semibold mt-2">
                  <Sparkles className="w-3 h-3" />
                  <span>Desktop Workstation Siap Pakai</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-800/40 space-y-2.5 text-xs text-neutral-300">
              <div className="flex justify-between py-1 border-b border-neutral-700/50">
                <span className="text-neutral-400">Kernel Compositor</span>
                <span className="font-mono text-white">Linux 6.6.21-dex-wayland-x86_64</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-700/50">
                <span className="text-neutral-400">Dukungan Multitasking</span>
                <span className="text-emerald-400 font-semibold">Aktif (Mouse + Keyboard + Touch)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-700/50">
                <span className="text-neutral-400">Penyimpanan Terpadu</span>
                <span className="text-white">HTML5 Virtual File System (Persisten)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-700/50">
                <span className="text-neutral-400">Pusat Notifikasi</span>
                <span className="text-white">Terintegrasi dengan Quick Settings Tray</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-400">Tingkat Keamanan Patch</span>
                <span className="text-white">8 September 2026</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-800/40 flex items-center justify-between">
              <div>
                <span className="font-semibold text-neutral-200 block">Welcome Screen "cahmales dex"</span>
                <span className="text-[11px] text-neutral-400">
                  Tampilkan ulang layar sambutan animasi pembuka sistem desktop
                </span>
              </div>
              <button
                onClick={() => setIsWelcomeScreenOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Lihat Welcome Screen</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
