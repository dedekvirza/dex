import React, { useState, useMemo, useRef } from 'react';
import { useDeX } from '../../context/DeXContext';
import { DeXFile, FileType } from '../../types';
import { AppIcon } from '../common/AppIcon';
import {
  Folder,
  FileText,
  FileCode,
  Image as ImageIcon,
  HardDrive,
  Trash2,
  Search,
  Plus,
  Upload,
  Download,
  Grid,
  List,
  ChevronRight,
  Star,
  RotateCcw,
  Info,
  FolderPlus,
  FilePlus,
  ArrowUp,
  Eye
} from 'lucide-react';

interface FileManagerAppProps {
  initialFolderId?: string | null;
}

export const FileManagerApp: React.FC<FileManagerAppProps> = ({ initialFolderId = null }) => {
  const {
    files,
    createFolder,
    createFile,
    deleteFile,
    restoreFile,
    renameFile,
    emptyTrash,
    openApp,
    settings,
    addNotification,
    setQuickLookFile
  } = useDeX();

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(initialFolderId);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [viewingCategory, setViewingCategory] = useState<'all' | 'favorites' | 'trash'>('all');
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter files
  const displayedFiles = useMemo(() => {
    let result = files;

    if (viewingCategory === 'trash') {
      result = result.filter(f => f.isTrashed);
    } else {
      result = result.filter(f => !f.isTrashed);
      if (viewingCategory === 'favorites') {
        result = result.filter(f => f.isFavorite);
      } else if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        result = result.filter(f => f.name.toLowerCase().includes(q));
      } else {
        result = result.filter(f => f.parentId === currentFolderId);
      }
    }

    // Sort folders first, then files alphabetically
    return result.sort((a, b) => {
      if (a.type === 'folder' && b.type !== 'folder') return -1;
      if (a.type !== 'folder' && b.type === 'folder') return 1;
      return a.name.localeCompare(b.name);
    });
  }, [files, currentFolderId, viewingCategory, searchQuery]);

  // Compute storage used
  const totalStorageBytes = useMemo(() => {
    return files.reduce((acc, f) => acc + (f.size || 512), 0);
  }, [files]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Breadcrumb path resolution
  const breadcrumbPath = useMemo(() => {
    const path: { id: string | null; name: string }[] = [{ id: null, name: 'Penyimpanan Internal' }];
    if (!currentFolderId || viewingCategory !== 'all') return path;

    let curr = files.find(f => f.id === currentFolderId);
    const parentChain: { id: string; name: string }[] = [];
    while (curr) {
      parentChain.unshift({ id: curr.id, name: curr.name });
      curr = files.find(f => f.id === curr?.parentId);
    }
    return [...path, ...parentChain];
  }, [currentFolderId, files, viewingCategory]);

  const selectedFile = useMemo(() => {
    return files.find(f => f.id === selectedFileId);
  }, [files, selectedFileId]);

  // Handle Double Click to open
  const handleItemDoubleClick = (item: DeXFile) => {
    if (item.type === 'folder') {
      setCurrentFolderId(item.id);
      setSelectedFileId(null);
      setViewingCategory('all');
    } else if (item.type === 'image') {
      openApp('gallery', { imageFileId: item.id });
    } else {
      // Open in Notes
      openApp('notes', { fileId: item.id });
    }
  };

  // Upload real file from user disk
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      const isImg = file.type.startsWith('image/');
      const ext = file.name.split('.').pop() || 'dat';

      if (isImg) {
        const reader = new FileReader();
        reader.onload = event => {
          const base64 = event.target?.result as string;
          createFile(file.name, '', currentFolderId, 'image', ext, base64);
          addNotification({
            title: 'Foto Terunggah',
            message: `${file.name} berhasil disimpan ke My Files.`,
            appName: 'My Files',
            icon: 'Image',
            type: 'success'
          });
        };
        reader.readAsDataURL(file);
      } else {
        const reader = new FileReader();
        reader.onload = event => {
          const content = (event.target?.result as string) || '';
          createFile(file.name, content, currentFolderId, 'text', ext);
          addNotification({
            title: 'Berkas Terunggah',
            message: `${file.name} berhasil diimpor.`,
            appName: 'My Files',
            icon: 'FolderKanban',
            type: 'success'
          });
        };
        reader.readAsText(file);
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Download file to user real machine
  const handleDownloadFile = (file: DeXFile) => {
    if (file.type === 'folder') return;
    if (file.imageUrl) {
      const a = document.createElement('a');
      a.href = file.imageUrl;
      a.download = file.name;
      a.click();
    } else {
      const blob = new Blob([file.content || ''], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    }
    addNotification({
      title: 'Berkas Diunduh',
      message: `${file.name} telah disimpan ke perangkat.`,
      appName: 'My Files',
      icon: 'Download',
      type: 'info'
    });
  };

  return (
    <div className="flex h-full w-full select-none overflow-hidden text-xs">
      {/* Hidden File Input for real file upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        multiple
      />

      {/* Left Sidebar (One UI My Files Navigation) */}
      <div
        className={`w-52 shrink-0 border-r flex flex-col p-3 gap-3 ${
          settings.darkMode
            ? 'bg-neutral-900/60 border-neutral-800/60 text-neutral-300'
            : 'bg-neutral-50/80 border-neutral-200 text-neutral-700'
        }`}
      >
        <div className="flex items-center gap-2 px-1">
          <div className="w-6 h-6 rounded-lg bg-amber-500 flex items-center justify-center text-white shadow-xs">
            <AppIcon name="FolderKanban" className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-sm tracking-tight text-white dark:text-neutral-100">
            My Files
          </span>
        </div>

        {/* Navigation Categories */}
        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => {
              setViewingCategory('all');
              setCurrentFolderId(null);
              setSearchQuery('');
            }}
            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-colors font-medium ${
              viewingCategory === 'all' && currentFolderId === null
                ? 'bg-blue-600 text-white shadow-xs'
                : settings.darkMode
                ? 'hover:bg-neutral-800 text-neutral-300'
                : 'hover:bg-neutral-200 text-neutral-800'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>Penyimpanan Utama</span>
          </button>

          <button
            onClick={() => {
              setViewingCategory('favorites');
              setSearchQuery('');
            }}
            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-colors font-medium ${
              viewingCategory === 'favorites'
                ? 'bg-blue-600 text-white shadow-xs'
                : settings.darkMode
                ? 'hover:bg-neutral-800 text-neutral-300'
                : 'hover:bg-neutral-200 text-neutral-800'
            }`}
          >
            <Star className="w-4 h-4 text-amber-400" />
            <span>Favorit</span>
          </button>

          <button
            onClick={() => {
              setViewingCategory('trash');
              setSearchQuery('');
            }}
            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-colors font-medium ${
              viewingCategory === 'trash'
                ? 'bg-red-600 text-white shadow-xs'
                : settings.darkMode
                ? 'hover:bg-neutral-800 text-neutral-300'
                : 'hover:bg-neutral-200 text-neutral-800'
            }`}
          >
            <Trash2 className="w-4 h-4 text-red-400" />
            <span>Tempat Sampah</span>
          </button>
        </div>

        {/* Quick Access Folders */}
        <div className="mt-2">
          <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            Folder Cepat
          </span>
          <div className="mt-1 flex flex-col gap-0.5">
            {files
              .filter(f => f.type === 'folder' && f.parentId === null && !f.isTrashed)
              .map(folder => {
                const isSelected = currentFolderId === folder.id && viewingCategory === 'all';
                return (
                  <button
                    key={folder.id}
                    onClick={() => {
                      setViewingCategory('all');
                      setCurrentFolderId(folder.id);
                      setSearchQuery('');
                    }}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left truncate transition-colors ${
                      isSelected
                        ? 'bg-blue-600/20 text-blue-400 font-semibold'
                        : settings.darkMode
                        ? 'hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                        : 'hover:bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{folder.name}</span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Storage Meter Widget */}
        <div
          className={`mt-auto p-2.5 rounded-xl border ${
            settings.darkMode ? 'bg-neutral-800/40 border-neutral-700/50' : 'bg-neutral-100 border-neutral-200'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="font-semibold text-neutral-400">Penyimpanan DeX</span>
            <span className="font-bold text-neutral-200">{formatSize(totalStorageBytes)}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-neutral-700 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(5, (totalStorageBytes / (64 * 1024 * 1024)) * 100))}%` }}
            />
          </div>
          <span className="block mt-1 text-[10px] text-neutral-500">
            Dari 64 MB Alokasi Virtual
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-transparent">
        {/* Top Action Toolbar */}
        <div
          className={`h-12 px-4 border-b flex items-center justify-between gap-3 shrink-0 ${
            settings.darkMode ? 'border-neutral-800/80 bg-neutral-900/40' : 'border-neutral-200 bg-white/50'
          }`}
        >
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 overflow-hidden text-xs">
            {currentFolderId && (
              <button
                onClick={() => {
                  const currentFolder = files.find(f => f.id === currentFolderId);
                  setCurrentFolderId(currentFolder?.parentId || null);
                }}
                className="p-1 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white"
                title="Folder Atas"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            )}

            {breadcrumbPath.map((item, idx) => (
              <React.Fragment key={item.id || 'root'}>
                {idx > 0 && <ChevronRight className="w-3 h-3 text-neutral-500 shrink-0" />}
                <button
                  onClick={() => {
                    setCurrentFolderId(item.id);
                    setViewingCategory('all');
                  }}
                  className={`truncate max-w-[140px] px-1.5 py-0.5 rounded transition-colors ${
                    idx === breadcrumbPath.length - 1
                      ? 'font-bold text-white'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {item.name}
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Action Buttons & Search */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Search Input */}
            <div
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs w-44 ${
                settings.darkMode
                  ? 'bg-neutral-800/60 border-neutral-700/60 text-neutral-200'
                  : 'bg-neutral-100 border-neutral-200 text-neutral-800'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Cari file..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-hidden w-full text-xs placeholder:text-neutral-500"
              />
            </div>

            {viewingCategory === 'trash' ? (
              <button
                onClick={emptyTrash}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-medium shadow-xs transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Kosongkan Sampah</span>
              </button>
            ) : (
              <>
                {/* New Folder */}
                <button
                  onClick={() => {
                    const name = prompt('Nama folder baru:', 'Folder Baru');
                    if (name) createFolder(name, currentFolderId);
                  }}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg border font-medium transition-colors ${
                    settings.darkMode
                      ? 'border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                      : 'border-neutral-200 bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                  }`}
                  title="Folder Baru"
                >
                  <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Folder Baru</span>
                </button>

                {/* New Text File */}
                <button
                  onClick={() => {
                    const name = prompt('Nama file dokumen baru (.txt / .md):', 'Catatan_Baru.txt');
                    if (name) {
                      const ext = name.split('.').pop() || 'txt';
                      const f = createFile(name, '', currentFolderId, 'text', ext);
                      openApp('notes', { fileId: f.id });
                    }
                  }}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg border font-medium transition-colors ${
                    settings.darkMode
                      ? 'border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                      : 'border-neutral-200 bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                  }`}
                  title="Dokumen Baru"
                >
                  <FilePlus className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden sm:inline">File Teks</span>
                </button>

                {/* Upload File */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium shadow-xs transition-colors"
                  title="Unggah dari komputer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Unggah</span>
                </button>
              </>
            )}

            {/* View Mode Switcher */}
            <div
              className={`flex items-center p-0.5 rounded-lg border ${
                settings.darkMode ? 'border-neutral-700 bg-neutral-800' : 'border-neutral-200 bg-neutral-100'
              }`}
            >
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-neutral-400'}`}
                title="Tampilan Grid"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-neutral-400'}`}
                title="Tampilan Tabel"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Files Grid or List Display */}
        <div
          tabIndex={0}
          onKeyDown={e => {
            if (e.code === 'Space' && selectedFile && selectedFile.type !== 'folder') {
              e.preventDefault();
              setQuickLookFile(selectedFile);
            }
          }}
          className="flex-1 overflow-auto p-4 outline-hidden"
        >
          {displayedFiles.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-500 gap-2">
              <Folder className="w-12 h-12 stroke-[1.2] opacity-40" />
              <p className="text-sm font-medium">Folder ini masih kosong</p>
              <p className="text-xs text-neutral-500">
                Gunakan tombol Folder Baru atau Unggah untuk menambahkan berkas.
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {displayedFiles.map(item => {
                const isSelected = selectedFileId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedFileId(item.id)}
                    onDoubleClick={() => handleItemDoubleClick(item)}
                    className={`flex flex-col items-center p-3 rounded-xl cursor-pointer transition-all border group relative ${
                      isSelected
                        ? 'bg-blue-500/20 border-blue-500 shadow-xs'
                        : settings.darkMode
                        ? 'bg-neutral-800/30 border-neutral-700/40 hover:bg-neutral-800/60 hover:border-neutral-600'
                        : 'bg-white border-neutral-200 hover:bg-neutral-100/70 hover:border-neutral-300'
                    }`}
                  >
                    {/* Item Thumbnail / Icon */}
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-2 overflow-hidden bg-neutral-800/40">
                      {item.type === 'folder' ? (
                        <Folder className="w-10 h-10 text-amber-400 fill-amber-400/20" />
                      ) : item.type === 'image' && item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : item.extension === 'json' ? (
                        <FileCode className="w-9 h-9 text-emerald-400" />
                      ) : (
                        <FileText className="w-9 h-9 text-blue-400" />
                      )}
                    </div>

                    {/* Name */}
                    <span className="font-medium text-center text-xs truncate max-w-full px-1">
                      {item.name}
                    </span>

                    {/* Size / Item count */}
                    <span className="text-[10px] text-neutral-500 mt-0.5">
                      {item.type === 'folder'
                        ? `${files.filter(f => f.parentId === item.id && !f.isTrashed).length} item`
                        : formatSize(item.size)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-full border rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    settings.darkMode ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  <tr>
                    <th className="py-2.5 px-3">Nama</th>
                    <th className="py-2.5 px-3">Tipe</th>
                    <th className="py-2.5 px-3">Ukuran</th>
                    <th className="py-2.5 px-3">Terakhir Diubah</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/50">
                  {displayedFiles.map(item => {
                    const isSelected = selectedFileId === item.id;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedFileId(item.id)}
                        onDoubleClick={() => handleItemDoubleClick(item)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-blue-600/20'
                            : settings.darkMode
                            ? 'hover:bg-neutral-800/50'
                            : 'hover:bg-neutral-100'
                        }`}
                      >
                        <td className="py-2 px-3 flex items-center gap-2 font-medium">
                          {item.type === 'folder' ? (
                            <Folder className="w-4 h-4 text-amber-400 shrink-0" />
                          ) : item.type === 'image' ? (
                            <ImageIcon className="w-4 h-4 text-rose-400 shrink-0" />
                          ) : (
                            <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                          )}
                          <span className="truncate">{item.name}</span>
                        </td>
                        <td className="py-2 px-3 text-neutral-400 capitalize">
                          {item.type === 'folder' ? 'Folder' : item.extension?.toUpperCase() || 'Berkas'}
                        </td>
                        <td className="py-2 px-3 text-neutral-400">
                          {item.type === 'folder' ? '-' : formatSize(item.size)}
                        </td>
                        <td className="py-2 px-3 text-neutral-500">
                          {new Date(item.updatedAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="py-2 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {item.type !== 'folder' && (
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  handleDownloadFile(item);
                                }}
                                className="p-1 rounded hover:bg-neutral-700 text-neutral-300"
                                title="Unduh ke perangkat"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                deleteFile(item.id, viewingCategory === 'trash');
                              }}
                              className="p-1 rounded hover:bg-red-500/30 text-red-400"
                              title={viewingCategory === 'trash' ? 'Hapus Permanen' : 'Pindahkan ke Sampah'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Bottom Details Status Bar */}
        <div
          className={`h-8 px-4 border-t flex items-center justify-between text-[11px] shrink-0 ${
            settings.darkMode ? 'border-neutral-800/80 bg-neutral-900/60 text-neutral-400' : 'border-neutral-200 bg-neutral-50 text-neutral-600'
          }`}
        >
          <span>{displayedFiles.length} item</span>
          {selectedFile ? (
            <div className="flex items-center gap-3">
              <span className="font-semibold text-neutral-200">{selectedFile.name}</span>
              <span>{formatSize(selectedFile.size)}</span>
              {selectedFile.type !== 'folder' && (
                <>
                  <button
                    onClick={() => setQuickLookFile(selectedFile)}
                    className="text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Eye className="w-3 h-3" /> Pratinjau (Space)
                  </button>
                  <button
                    onClick={() => handleDownloadFile(selectedFile)}
                    className="text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" /> Unduh
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  const newName = prompt('Ubah nama file/folder:', selectedFile.name);
                  if (newName) renameFile(selectedFile.id, newName);
                }}
                className="text-amber-400 hover:underline"
              >
                Ganti Nama
              </button>
              <button
                onClick={() => deleteFile(selectedFile.id, viewingCategory === 'trash')}
                className="text-red-400 hover:underline"
              >
                Hapus
              </button>
            </div>
          ) : (
            <span>Pilih item untuk melihat opsi berkas</span>
          )}
        </div>
      </div>
    </div>
  );
};
