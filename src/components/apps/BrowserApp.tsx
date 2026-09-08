import React, { useState } from 'react';
import { useDeX } from '../../context/DeXContext';
import {
  Globe,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Search,
  Bookmark,
  ExternalLink,
  Shield,
  Star
} from 'lucide-react';

interface BookmarkItem {
  title: string;
  url: string;
  category: string;
  description: string;
}

const BOOKMARKS: BookmarkItem[] = [
  {
    title: 'Dokumentasi Android DeX',
    url: 'https://developer.samsung.com/samsung-dex',
    category: 'Sistem',
    description: 'Panduan resmi optimalisasi UI multi-window dan input keyboard mouse.'
  },
  {
    title: 'Google AI Studio',
    url: 'https://ai.studio',
    category: 'AI & Tools',
    description: 'Platform pembuatan aplikasi kecerdasan buatan terpadu Google.'
  },
  {
    title: 'GitHub Workspaces',
    url: 'https://github.com',
    category: 'Produktivitas',
    description: 'Kolaborasi kode, repositori Git, dan manajemen proyek pengembangan.'
  },
  {
    title: 'Wikipedia Ensiklopedia',
    url: 'https://id.wikipedia.org',
    category: 'Riset',
    description: 'Riset ensiklopedia terbuka untuk referensi kerja dan pengetahuan.'
  }
];

export const BrowserApp: React.FC = () => {
  const { settings } = useDeX();
  const [url, setUrl] = useState('https://dex.workstation/home');
  const [activeTab, setActiveTab] = useState('Tab Utama');
  const [searchVal, setSearchVal] = useState('');
  const [visitedBookmark, setVisitedBookmark] = useState<BookmarkItem | null>(null);

  const handleNavigate = (targetUrl: string) => {
    setUrl(targetUrl);
    const found = BOOKMARKS.find(b => b.url === targetUrl);
    setVisitedBookmark(found || null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    const clean = searchVal.startsWith('http') ? searchVal : `https://${searchVal}`;
    setUrl(clean);
    setVisitedBookmark(null);
  };

  return (
    <div className="flex flex-col h-full w-full select-none text-xs bg-neutral-900 text-neutral-200">
      {/* Browser Tab Bar */}
      <div className="h-9 px-3 bg-neutral-950 flex items-center gap-1 shrink-0 border-b border-neutral-800">
        <div className="flex items-center gap-2 px-3 py-1 bg-neutral-800 rounded-t-lg border-t border-x border-neutral-700 max-w-[200px] text-white">
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          <span className="truncate text-[11px] font-medium">{visitedBookmark?.title || activeTab}</span>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="h-11 px-3 bg-neutral-900 flex items-center gap-2 border-b border-neutral-800 shrink-0">
        <button
          onClick={() => {
            setUrl('https://dex.workstation/home');
            setVisitedBookmark(null);
          }}
          className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white"
          title="Beranda"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white opacity-50"
          disabled
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => {}}
          className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white"
          title="Muat Ulang"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        {/* Address & Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-800/80 border border-neutral-700/80 text-xs"
        >
          <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <input
            type="text"
            value={searchVal || url}
            onChange={e => setSearchVal(e.target.value)}
            onFocus={() => setSearchVal(url)}
            placeholder="Cari web atau masukkan URL..."
            className="flex-1 bg-transparent border-none outline-hidden text-neutral-100 placeholder:text-neutral-500 font-mono text-xs"
          />
        </form>
      </div>

      {/* Browser Viewport Stage */}
      <div className="flex-1 overflow-y-auto p-6 bg-neutral-950 flex flex-col items-center">
        {visitedBookmark ? (
          <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">{visitedBookmark.title}</h2>
                <a
                  href={visitedBookmark.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline flex items-center gap-1 text-xs mt-0.5"
                >
                  <span>{visitedBookmark.url}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <p className="text-neutral-300 text-xs leading-relaxed border-t border-neutral-800 pt-3">
              {visitedBookmark.description}
            </p>

            <div className="p-3 bg-neutral-800/50 rounded-xl border border-neutral-700/60 flex items-center justify-between text-xs">
              <span className="text-neutral-400">
                Sesi aman terverifikasi oleh Samsung DeX Smart Engine.
              </span>
              <a
                href={visitedBookmark.url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-xs"
              >
                Buka di Tab Baru
              </a>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl space-y-6">
            {/* Search Header */}
            <div className="text-center space-y-2 py-4">
              <div className="inline-flex p-3 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 shadow-lg">
                <Globe className="w-8 h-8" />
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">Samsung Internet DeX</h1>
              <p className="text-xs text-neutral-400">
                Peramban cepat yang dioptimalkan untuk produktivitas multi-jendela.
              </p>
            </div>

            {/* Bookmarks Grid */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-neutral-300 font-semibold">
                <Bookmark className="w-4 h-4 text-amber-400" />
                <span>Bookmark Rekomendasi Kerja</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {BOOKMARKS.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleNavigate(item.url)}
                    className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800/80 hover:border-neutral-700 cursor-pointer transition-all flex flex-col justify-between gap-2 group"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <span className="text-[10px] font-mono text-neutral-500 truncate">
                      {item.url}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
