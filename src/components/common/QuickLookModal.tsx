import React from 'react';
import { useDeX } from '../../context/DeXContext';
import { X, ExternalLink, FileText, Image as ImageIcon, Calendar, HardDrive } from 'lucide-react';

export const QuickLookModal: React.FC = () => {
  const { quickLookFile, setQuickLookFile, openApp, settings } = useDeX();

  if (!quickLookFile) return null;

  const handleOpenInApp = () => {
    if (quickLookFile.type === 'image') {
      openApp('gallery', { imageFileId: quickLookFile.id });
    } else {
      openApp('notes', { fileId: quickLookFile.id });
    }
    setQuickLookFile(null);
  };

  return (
    <div
      id="dex-quick-look-backdrop"
      onClick={() => setQuickLookFile(null)}
      className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 select-none animate-in fade-in duration-100"
    >
      <div
        id="dex-quick-look-card"
        onClick={e => e.stopPropagation()}
        className={`w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col backdrop-blur-2xl ${
          settings.darkMode
            ? 'bg-neutral-900/95 border-neutral-700/80 text-white'
            : 'bg-white/95 border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Top Header */}
        <div className="h-12 px-4 border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 truncate">
            {quickLookFile.type === 'image' ? (
              <ImageIcon className="w-4 h-4 text-rose-400" />
            ) : (
              <FileText className="w-4 h-4 text-blue-400" />
            )}
            <span className="font-bold text-xs truncate">{quickLookFile.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenInApp}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <span>Buka</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setQuickLookFile(null)}
              className="p-1.5 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="max-h-[60vh] overflow-auto p-4 flex items-center justify-center bg-neutral-950/40">
          {quickLookFile.type === 'image' && quickLookFile.imageUrl ? (
            <img
              src={quickLookFile.imageUrl}
              alt={quickLookFile.name}
              className="max-h-[50vh] max-w-full object-contain rounded-xl shadow-lg"
            />
          ) : (
            <div className="w-full bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 font-mono text-xs text-neutral-200 leading-relaxed whitespace-pre-wrap select-text">
              {quickLookFile.content || '(Berkas kosong)'}
            </div>
          )}
        </div>

        {/* Metadata Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900/60 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5" />
              {(quickLookFile.size / 1024).toFixed(1)} KB
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(quickLookFile.updatedAt).toLocaleDateString('id-ID')}
            </span>
          </div>
          <span className="text-[10px] text-neutral-500">Tekan Space / Esc untuk menutup</span>
        </div>
      </div>
    </div>
  );
};
