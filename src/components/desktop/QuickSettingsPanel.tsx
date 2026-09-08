import React from 'react';
import { useDeX } from '../../context/DeXContext';
import {
  Wifi,
  Bluetooth,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Eye,
  Zap,
  BellOff,
  Camera,
  SlidersHorizontal,
  X
} from 'lucide-react';

export const QuickSettingsPanel: React.FC = () => {
  const {
    isQuickSettingsOpen,
    setIsQuickSettingsOpen,
    settings,
    updateSettings,
    openApp,
    addNotification,
    createFile
  } = useDeX();

  if (!isQuickSettingsOpen) return null;

  // Screenshot capture simulation
  const handleScreenshot = () => {
    setIsQuickSettingsOpen(false);
    setTimeout(() => {
      const fileName = `Screenshot_${Date.now()}.png`;
      createFile(
        fileName,
        '',
        'folder-pictures',
        'image',
        'png',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop'
      );
      addNotification({
        title: 'Tangkapan Layar Berhasil',
        message: `${fileName} telah disimpan ke folder Pictures.`,
        appName: 'System',
        icon: 'Camera',
        type: 'success',
        actionLabel: 'Buka Galeri',
        onActionAppId: 'gallery'
      });
    }, 400);
  };

  const isTopTaskbar = settings.taskbarPosition === 'top';

  return (
    <div
      id="dex-quick-settings-flyout"
      onClick={e => e.stopPropagation()}
      style={{
        bottom: isTopTaskbar ? 'auto' : '56px',
        top: isTopTaskbar ? '56px' : 'auto',
        right: '16px'
      }}
      className={`fixed z-[900] w-80 p-4 rounded-3xl shadow-2xl border backdrop-blur-2xl text-xs select-none animate-in fade-in zoom-in-95 duration-150 ${
        settings.darkMode
          ? 'bg-neutral-900/95 border-neutral-700/80 text-neutral-100'
          : 'bg-white/95 border-neutral-200 text-neutral-900'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <span className="font-bold text-sm tracking-tight text-white dark:text-neutral-100">
          Pengaturan Cepat DeX
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setIsQuickSettingsOpen(false);
              openApp('settings');
            }}
            className="p-1.5 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            title="Buka Pengaturan Lengkap"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsQuickSettingsOpen(false)}
            className="p-1.5 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Toggles Grid */}
      <div className="grid grid-cols-4 gap-2.5 py-4">
        {/* Wi-Fi */}
        <button
          onClick={() => updateSettings({ wifiEnabled: !settings.wifiEnabled })}
          className="flex flex-col items-center gap-1 group"
        >
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              settings.wifiEnabled
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-neutral-800/80 text-neutral-400 hover:bg-neutral-700'
            }`}
          >
            <Wifi className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium text-neutral-300">Wi-Fi</span>
        </button>

        {/* Bluetooth */}
        <button
          onClick={() => updateSettings({ bluetoothEnabled: !settings.bluetoothEnabled })}
          className="flex flex-col items-center gap-1 group"
        >
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              settings.bluetoothEnabled
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-neutral-800/80 text-neutral-400 hover:bg-neutral-700'
            }`}
          >
            <Bluetooth className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium text-neutral-300">Bluetooth</span>
        </button>

        {/* Sound / Mute */}
        <button
          onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
          className="flex flex-col items-center gap-1 group"
        >
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              settings.soundEnabled
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-neutral-800/80 text-neutral-400 hover:bg-neutral-700'
            }`}
          >
            {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </div>
          <span className="text-[10px] font-medium text-neutral-300">Suara</span>
        </button>

        {/* Dark Mode */}
        <button
          onClick={() => updateSettings({ darkMode: !settings.darkMode })}
          className="flex flex-col items-center gap-1 group"
        >
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              settings.darkMode
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-neutral-800/80 text-neutral-400 hover:bg-neutral-700'
            }`}
          >
            {settings.darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </div>
          <span className="text-[10px] font-medium text-neutral-300">Tema Gelap</span>
        </button>

        {/* Night Light */}
        <button
          onClick={() => updateSettings({ nightLight: !settings.nightLight })}
          className="flex flex-col items-center gap-1 group"
        >
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              settings.nightLight
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-neutral-800/80 text-neutral-400 hover:bg-neutral-700'
            }`}
          >
            <Eye className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium text-neutral-300">Night Light</span>
        </button>

        {/* Performance Mode */}
        <button
          onClick={() => updateSettings({ performanceMode: !settings.performanceMode })}
          className="flex flex-col items-center gap-1 group"
        >
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              settings.performanceMode
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-neutral-800/80 text-neutral-400 hover:bg-neutral-700'
            }`}
          >
            <Zap className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium text-neutral-300">Performa</span>
        </button>

        {/* Do Not Disturb */}
        <button
          onClick={() => updateSettings({ dndEnabled: !settings.dndEnabled })}
          className="flex flex-col items-center gap-1 group"
        >
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              settings.dndEnabled
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-neutral-800/80 text-neutral-400 hover:bg-neutral-700'
            }`}
          >
            <BellOff className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium text-neutral-300">DND</span>
        </button>

        {/* Screenshot */}
        <button
          onClick={handleScreenshot}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="w-11 h-11 rounded-2xl bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700 flex items-center justify-center transition-all">
            <Camera className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium text-neutral-300">Screenshot</span>
        </button>
      </div>

      {/* Sliders */}
      <div className="space-y-3 pt-3 border-t border-neutral-800">
        {/* Brightness Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-neutral-400">
            <span>Kecerahan Layar</span>
            <span className="font-semibold text-white">{settings.brightness}%</span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            value={settings.brightness}
            onChange={e => updateSettings({ brightness: parseInt(e.target.value) })}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>

        {/* Volume Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-neutral-400">
            <span>Volume Suara</span>
            <span className="font-semibold text-white">{settings.volume}%</span>
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
    </div>
  );
};
