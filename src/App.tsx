import React, { useEffect } from 'react';
import { DeXProvider, useDeX } from './context/DeXContext';
import { DesktopCanvas } from './components/desktop/DesktopCanvas';
import { WindowManager } from './components/window/WindowManager';
import { DeXTaskbar } from './components/desktop/DeXTaskbar';
import { AppDrawer } from './components/desktop/AppDrawer';
import { QuickSettingsPanel } from './components/desktop/QuickSettingsPanel';
import { NotificationCenter } from './components/desktop/NotificationCenter';
import { CalendarFlyout } from './components/desktop/CalendarFlyout';
import { WindowOverview } from './components/window/WindowOverview';
import { AltTabSwitcher } from './components/window/AltTabSwitcher';
import { SpotlightSearch } from './components/desktop/SpotlightSearch';
import { QuickLookModal } from './components/common/QuickLookModal';
import { WelcomeScreen } from './components/desktop/WelcomeScreen';

const DeXDesktopRoot: React.FC = () => {
  const { settings, openApp } = useDeX();

  // Open default productivity apps on initial mount for great first-time impression
  useEffect(() => {
    // Open My Files on first load
    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      openApp('files');
    }
  }, []);

  return (
    <div
      id="dex-environment-root"
      className={`relative w-screen h-screen overflow-hidden select-none font-sans ${
        settings.darkMode ? 'dark bg-neutral-950 text-neutral-100' : 'bg-neutral-100 text-neutral-800'
      }`}
      style={{
        fontSize: `${settings.uiScale || 100}%`
      }}
    >
      {/* 1. Desktop Canvas (Wallpapers, Desktop Icons, Marquee Selection) */}
      <DesktopCanvas />

      {/* 2. Window Manager & Multitasking Workspace */}
      <WindowManager />

      {/* 3. Samsung DeX Taskbar & Navigation Tray */}
      <DeXTaskbar />

      {/* 4. Full Launcher / App Drawer Overlay */}
      <AppDrawer />

      {/* 5. Window Overview / Task View (Android Recents) */}
      <WindowOverview />

      {/* 6. Quick Settings Tray Panel */}
      <QuickSettingsPanel />

      {/* 7. Unified Notification Center */}
      <NotificationCenter />

      {/* 8. Interactive Calendar Flyout */}
      <CalendarFlyout />

      {/* 9. Visual Alt + Tab Window Switcher */}
      <AltTabSwitcher />

      {/* 10. Universal Spotlight Quick Search (Alt + Space / Ctrl + K) */}
      <SpotlightSearch />

      {/* 11. Quick Look File Preview Modal (Spacebar preview) */}
      <QuickLookModal />

      {/* 12. Welcome Screen / Boot Splash ("cahmales dex") */}
      <WelcomeScreen />
    </div>
  );
};

export default function App() {
  return (
    <DeXProvider>
      <DeXDesktopRoot />
    </DeXProvider>
  );
}
