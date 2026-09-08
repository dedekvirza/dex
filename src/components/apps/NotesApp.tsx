import React, { useState, useEffect } from 'react';
import { useDeX } from '../../context/DeXContext';
import { DeXFile } from '../../types';
import {
  FileText,
  Save,
  Plus,
  Trash2,
  Share2,
  Download,
  Bold,
  Italic,
  List,
  Heading,
  CheckCircle,
  Clock
} from 'lucide-react';

interface NotesAppProps {
  initialFileId?: string;
}

export const NotesApp: React.FC<NotesAppProps> = ({ initialFileId }) => {
  const { files, createFile, renameFile, deleteFile, settings, addNotification } = useDeX();

  // All text/markdown files
  const textFiles = files.filter(f => (f.type === 'text' || f.type === 'code') && !f.isTrashed);

  const [activeFileId, setActiveFileId] = useState<string | null>(
    initialFileId || textFiles[0]?.id || null
  );

  const activeFile = files.find(f => f.id === activeFileId);
  const [content, setContent] = useState<string>(activeFile?.content || '');
  const [title, setTitle] = useState<string>(activeFile?.name || 'Catatan Baru');
  const [isSaved, setIsSaved] = useState(true);

  // Sync state when activeFile changes
  useEffect(() => {
    if (activeFile) {
      setContent(activeFile.content || '');
      setTitle(activeFile.name);
      setIsSaved(true);
    }
  }, [activeFileId]);

  // Handle Save
  const handleSave = () => {
    if (activeFile) {
      activeFile.content = content;
      activeFile.updatedAt = new Date().toISOString();
      if (title !== activeFile.name) {
        renameFile(activeFile.id, title);
      }
      setIsSaved(true);
      addNotification({
        title: 'Catatan Disimpan',
        message: `${title} telah diperbarui di My Files.`,
        appName: 'Samsung Notes',
        icon: 'Save',
        type: 'success'
      });
    } else {
      // Create new file
      const newFile = createFile(title || 'Catatan_Baru.txt', content, null, 'text', 'txt');
      setActiveFileId(newFile.id);
      setIsSaved(true);
    }
  };

  const handleNewNote = () => {
    const defaultTitle = `Catatan_${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '.')}.txt`;
    const newFile = createFile(defaultTitle, '', null, 'text', 'txt');
    setActiveFileId(newFile.id);
    setTitle(newFile.name);
    setContent('');
    setIsSaved(true);
  };

  // Formatting helpers
  const insertFormatting = (prefix: string, suffix: string = '') => {
    setContent(prev => `${prev}${prefix}Teks${suffix}`);
    setIsSaved(false);
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <div className="flex h-full w-full select-none text-xs">
      {/* Left Notes List */}
      <div
        className={`w-60 shrink-0 border-r flex flex-col ${
          settings.darkMode ? 'bg-neutral-900/70 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
        }`}
      >
        <div className="p-3 border-b border-neutral-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-orange-500 flex items-center justify-center text-white shadow-xs">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-sm text-white dark:text-neutral-100">
              Samsung Notes
            </span>
          </div>
          <button
            onClick={handleNewNote}
            className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-colors"
            title="Catatan Baru"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Note List Items */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {textFiles.map(file => {
            const isSelected = activeFileId === file.id;
            return (
              <div
                key={file.id}
                onClick={() => setActiveFileId(file.id)}
                className={`p-2.5 rounded-xl cursor-pointer transition-colors text-left flex flex-col gap-1 ${
                  isSelected
                    ? 'bg-blue-600/20 border border-blue-500/50'
                    : settings.darkMode
                    ? 'hover:bg-neutral-800 text-neutral-300'
                    : 'hover:bg-neutral-200 text-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-white truncate max-w-[150px]">
                    {file.name}
                  </span>
                  <span className="text-[10px] text-neutral-500">
                    {new Date(file.updatedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 line-clamp-1">
                  {file.content || '(Catatan kosong)'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Editor Main Canvas */}
      <div className="flex-1 flex flex-col min-w-0 bg-transparent">
        {/* Editor Toolbar */}
        <div
          className={`h-11 px-4 border-b flex items-center justify-between shrink-0 ${
            settings.darkMode ? 'border-neutral-800 bg-neutral-900/40' : 'border-neutral-200 bg-white/50'
          }`}
        >
          {/* Note Title Input */}
          <input
            type="text"
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              setIsSaved(false);
            }}
            className="bg-transparent border-none outline-hidden font-bold text-sm text-white w-64 truncate"
            placeholder="Judul Catatan..."
          />

          {/* Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => insertFormatting('# ')}
              className="p-1.5 rounded hover:bg-neutral-800 text-neutral-300"
              title="Heading"
            >
              <Heading className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertFormatting('**', '**')}
              className="p-1.5 rounded hover:bg-neutral-800 text-neutral-300"
              title="Tebal"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertFormatting('*', '*')}
              className="p-1.5 rounded hover:bg-neutral-800 text-neutral-300"
              title="Miring"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertFormatting('- ')}
              className="p-1.5 rounded hover:bg-neutral-800 text-neutral-300"
              title="Daftar Poin"
            >
              <List className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-neutral-700 mx-1" />

            {/* Save Button */}
            <button
              onClick={handleSave}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold shadow-xs transition-colors ${
                isSaved
                  ? 'bg-neutral-800 text-neutral-400'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {isSaved ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
              <span>{isSaved ? 'Tersimpan' : 'Simpan'}</span>
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div className="flex-1 p-4 overflow-auto">
          <textarea
            value={content}
            onChange={e => {
              setContent(e.target.value);
              setIsSaved(false);
            }}
            placeholder="Tulis catatan, instruksi, atau draft dokumen di sini..."
            className="w-full h-full bg-transparent resize-none border-none outline-hidden font-mono text-xs leading-relaxed text-neutral-200 placeholder:text-neutral-600 select-text"
          />
        </div>

        {/* Editor Footer Status Bar */}
        <div
          className={`h-7 px-4 border-t flex items-center justify-between text-[11px] shrink-0 text-neutral-400 ${
            settings.darkMode ? 'border-neutral-800 bg-neutral-900/60' : 'border-neutral-200 bg-neutral-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <span>{wordCount} kata</span>
            <span>{charCount} karakter</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Format Markdown Didukung</span>
          </div>
        </div>
      </div>
    </div>
  );
};
