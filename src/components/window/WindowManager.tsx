import React from 'react';
import { useDeX } from '../../context/DeXContext';
import { WindowFrame } from './WindowFrame';
import { FileManagerApp } from '../apps/FileManagerApp';
import { SettingsApp } from '../apps/SettingsApp';
import { NotesApp } from '../apps/NotesApp';
import { TaskManagerApp } from '../apps/TaskManagerApp';
import { BrowserApp } from '../apps/BrowserApp';
import { GalleryApp } from '../apps/GalleryApp';
import { TerminalApp } from '../apps/TerminalApp';
import { CalculatorApp } from '../apps/CalculatorApp';

export const WindowManager: React.FC = () => {
  const { windows, activeWindowId } = useDeX();

  const renderAppContent = (win: any) => {
    switch (win.appId) {
      case 'files':
        return <FileManagerApp initialFolderId={win.params?.folderId} />;
      case 'settings':
        return <SettingsApp initialTab={win.params?.tab} />;
      case 'notes':
        return <NotesApp initialFileId={win.params?.fileId} />;
      case 'taskmanager':
        return <TaskManagerApp />;
      case 'browser':
        return <BrowserApp />;
      case 'gallery':
        return <GalleryApp initialImageFileId={win.params?.imageFileId} />;
      case 'terminal':
        return <TerminalApp />;
      case 'calculator':
        return <CalculatorApp />;
      default:
        return (
          <div className="p-6 text-center text-neutral-400">
            Aplikasi sedang dalam pengembangan.
          </div>
        );
    }
  };

  return (
    <div id="dex-window-manager" className="absolute inset-0 pointer-events-none z-10">
      {windows.map(win => (
        <div key={win.id} className="pointer-events-auto">
          <WindowFrame window={win} isActive={activeWindowId === win.id}>
            {renderAppContent(win)}
          </WindowFrame>
        </div>
      ))}
    </div>
  );
};
