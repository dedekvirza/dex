import { DeXApp, DeXFile, DeXNotification, DeXSettings, WorkspaceConfig } from '../types';

export const DEFAULT_WALLPAPERS = [
  {
    id: 'dex-flow',
    name: 'Samsung DeX Horizon',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop',
    accent: '#2563eb'
  },
  {
    id: 'cyber-neon',
    name: 'Cyberpunk Metropolis',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2564&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=300&auto=format&fit=crop',
    accent: '#06b6d4'
  },
  {
    id: 'cosmic-aurora',
    name: 'Aurora Borealis',
    url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=2564&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=300&auto=format&fit=crop',
    accent: '#10b981'
  },
  {
    id: 'mountain-twilight',
    name: 'Alpine Twilight',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2564&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=300&auto=format&fit=crop',
    accent: '#f59e0b'
  },
  {
    id: 'minimal-dark',
    name: 'Obsidian Minimal',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2564&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=300&auto=format&fit=crop',
    accent: '#6366f1'
  },
  {
    id: 'modern-abstract',
    name: 'Fluid Gradient Mesh',
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2564&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=300&auto=format&fit=crop',
    accent: '#ec4899'
  }
];

export const DEFAULT_WORKSPACES: WorkspaceConfig[] = [
  {
    id: 1,
    name: 'Utama / Kantor',
    icon: 'Briefcase',
    description: 'Ruang kerja primer untuk produktivitas, berkas & dokumen aktif'
  },
  {
    id: 2,
    name: 'Riset & Web',
    icon: 'Globe',
    description: 'Lingkungan fokus peramban, referensi data & eksplorasi'
  },
  {
    id: 3,
    name: 'Sistem & Terminal',
    icon: 'Terminal',
    description: 'Area monitoring kinerja, terminal shell & automasi'
  }
];

export const DEFAULT_SETTINGS: DeXSettings = {
  wallpaper: 'dex-flow',
  wallpaperBlur: 0,
  darkMode: true,
  accentColor: '#2563eb', // Samsung DeX Royal Blue
  taskbarPosition: 'bottom',
  taskbarAutoHide: false,
  desktopIconSize: 'medium',
  nightLight: false,
  nightLightWarmth: 35,
  soundEnabled: true,
  windowSnapAssist: true,
  volume: 80,
  brightness: 100,
  wifiEnabled: true,
  bluetoothEnabled: true,
  performanceMode: false,
  dndEnabled: false,
  uiScale: 100,
  activeWorkspaceId: 1,
  displayResolution: '1080p',
  dexLabsEnabled: true,
};

export const DEFAULT_APPS: DeXApp[] = [
  {
    id: 'files',
    name: 'My Files',
    icon: 'FolderKanban',
    category: 'productivity',
    description: 'Kelola file, folder, dokumen, dan penyimpanan sistem',
    defaultWidth: 900,
    defaultHeight: 580,
    minWidth: 540,
    minHeight: 380,
    isPinned: true
  },
  {
    id: 'settings',
    name: 'DeX Settings',
    icon: 'SlidersHorizontal',
    category: 'system',
    description: 'Pengaturan tampilan, wallpaper, multitasking, dan preferensi sistem',
    defaultWidth: 840,
    defaultHeight: 560,
    minWidth: 580,
    minHeight: 400,
    isPinned: true
  },
  {
    id: 'notes',
    name: 'Samsung Notes',
    icon: 'FileText',
    category: 'productivity',
    description: 'Catatan kerja profesional, editor markdown, dan draf dokumen',
    defaultWidth: 800,
    defaultHeight: 540,
    minWidth: 460,
    minHeight: 360,
    isPinned: true
  },
  {
    id: 'taskmanager',
    name: 'Task Manager',
    icon: 'Activity',
    category: 'system',
    description: 'Monitor performa CPU, memori RAM, dan kelola proses berjalan',
    defaultWidth: 740,
    defaultHeight: 500,
    minWidth: 480,
    minHeight: 340,
    isPinned: true
  },
  {
    id: 'browser',
    name: 'Samsung Internet',
    icon: 'Globe',
    category: 'productivity',
    description: 'Browser web cepat dan aman untuk riset serta produktivitas kerja',
    defaultWidth: 920,
    defaultHeight: 600,
    minWidth: 520,
    minHeight: 380,
    isPinned: true
  },
  {
    id: 'gallery',
    name: 'Gallery',
    icon: 'Image',
    category: 'media',
    description: 'Lihat foto beresolusi tinggi dan terapkan wallpaper desktop langsung',
    defaultWidth: 820,
    defaultHeight: 540,
    minWidth: 480,
    minHeight: 360,
    isPinned: false
  },
  {
    id: 'terminal',
    name: 'DeX Terminal',
    icon: 'Terminal',
    category: 'utilities',
    description: 'Antarmuka shell baris perintah untuk automasi dan inspeksi sistem',
    defaultWidth: 700,
    defaultHeight: 460,
    minWidth: 420,
    minHeight: 280,
    isPinned: false
  },
  {
    id: 'calculator',
    name: 'Calculator',
    icon: 'Calculator',
    category: 'utilities',
    description: 'Kalkulator profesional dengan riwayat perhitungan komprehensif',
    defaultWidth: 360,
    defaultHeight: 520,
    minWidth: 320,
    minHeight: 440,
    isPinned: false
  }
];

export const DEFAULT_FILES: DeXFile[] = [
  // Root Folders
  {
    id: 'folder-documents',
    name: 'Documents',
    type: 'folder',
    size: 4096,
    createdAt: '2026-09-01T09:00:00Z',
    updatedAt: '2026-09-08T08:00:00Z',
    parentId: null,
    isFavorite: true
  },
  {
    id: 'folder-projects',
    name: 'Projects',
    type: 'folder',
    size: 8192,
    createdAt: '2026-09-02T10:30:00Z',
    updatedAt: '2026-09-07T14:20:00Z',
    parentId: null,
    isFavorite: true
  },
  {
    id: 'folder-pictures',
    name: 'Pictures',
    type: 'folder',
    size: 16384,
    createdAt: '2026-09-01T09:00:00Z',
    updatedAt: '2026-09-08T07:15:00Z',
    parentId: null,
    isFavorite: true
  },
  {
    id: 'folder-downloads',
    name: 'Downloads',
    type: 'folder',
    size: 4096,
    createdAt: '2026-09-03T11:00:00Z',
    updatedAt: '2026-09-08T08:10:00Z',
    parentId: null
  },
  {
    id: 'folder-worknotes',
    name: 'Work Notes',
    type: 'folder',
    size: 2048,
    createdAt: '2026-09-04T08:00:00Z',
    updatedAt: '2026-09-08T08:25:00Z',
    parentId: null
  },

  // Documents folder contents
  {
    id: 'file-dex-guide',
    name: 'Panduan_Android_DeX_Pro.md',
    type: 'text',
    extension: 'md',
    size: 2450,
    createdAt: '2026-09-05T12:00:00Z',
    updatedAt: '2026-09-08T08:00:00Z',
    parentId: 'folder-documents',
    isFavorite: true,
    content: `# Android DeX Professional Workstation
Selamat datang di antarmuka Android DeX bertenaga penuh untuk produktivitas kelas enterprise!

### Fitur Multitasking Unggulan:
- **Dukungan Mouse & Keyboard**:
  - Geser header jendela untuk memindahkan posisi.
  - Tarik sisi tepi atau sudut jendela untuk mengubah ukuran (resize).
  - Tarik jendela ke tepi atas untuk Maximize.
  - Tarik jendela ke tepi kiri/kanan untuk Split-Screen Snap (50/50).
  - Pintasan keyboard:
    - \`Alt + Tab\`: Berganti jendela aktif secara visual.
    - \`Alt + Space\`: Buka Spotlight Search bar interaktif.
    - \`Win / Super\`: Buka / tutup App Drawer (Menu Aplikasi).
    - \`Win + Panah Kiri / Kanan\`: Snap jendela aktif ke kiri / kanan.
    - \`Win + Panah Atas\`: Maksimalkan jendela.
    - \`Win + D\`: Minimalkan semua jendela (Show Desktop).
    - \`Esc\`: Tutup menu konteks atau panel cepat.

### Manajemen File & Sistem:
- Akses **My Files** untuk mengunggah dokumen dari perangkat asli, mengunduh file, membuat folder, dan mengedit file teks.
- Gunakan **DeX Settings** untuk menyesuaikan wallpaper, tema Gelap/Terang, warna aksen One UI, Night Light, dan resolusi tampilan.`
  },
  {
    id: 'file-roadmap',
    name: 'Roadmap_Produktivitas_Q4.txt',
    type: 'text',
    extension: 'txt',
    size: 890,
    createdAt: '2026-09-06T15:20:00Z',
    updatedAt: '2026-09-07T16:00:00Z',
    parentId: 'folder-documents',
    content: `TARGET KERJA Q4 2026
1. Penyusunan arsitektur sistem modular DeX Workspace.
2. Pengujian integrasi file manager dengan penyimpanan lokal berkecepatan tinggi.
3. Optimalisasi konsumsi memori dan latensi respon jendela multitasking.
4. Integrasi pusat notifikasi terpadu untuk monitoring alur kerja tim.`
  },

  // Projects folder contents
  {
    id: 'file-config',
    name: 'dex_system_config.json',
    type: 'code',
    extension: 'json',
    size: 780,
    createdAt: '2026-09-07T14:00:00Z',
    updatedAt: '2026-09-08T06:30:00Z',
    parentId: 'folder-projects',
    content: JSON.stringify({
      version: "6.1.0-dex-pro",
      buildNumber: "UP1A.260908.001",
      displayMode: "desktop_extended",
      windowServer: "Wayland-DeX-Compositor",
      features: {
        hardwareAcceleration: true,
        smoothSnapping: true,
        altTabSwitcher: true,
        integratedNotificationCenter: true,
        spotlightSearch: true,
        virtualDesktops: true
      },
      performanceProfile: "balanced"
    }, null, 2)
  },

  // Pictures folder contents (High-res curated photography)
  {
    id: 'img-cyberpunk',
    name: 'Cyberpunk_Metropolis_Night.jpg',
    type: 'image',
    extension: 'jpg',
    size: 2450000,
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
    parentId: 'folder-pictures',
    imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2564&auto=format&fit=crop'
  },
  {
    id: 'img-aurora',
    name: 'Aurora_Green_Sky.jpg',
    type: 'image',
    extension: 'jpg',
    size: 1980000,
    createdAt: '2026-09-02T11:00:00Z',
    updatedAt: '2026-09-02T11:00:00Z',
    parentId: 'folder-pictures',
    imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=2564&auto=format&fit=crop'
  },
  {
    id: 'img-horizon',
    name: 'DeX_Flow_Official.jpg',
    type: 'image',
    extension: 'jpg',
    size: 3200000,
    createdAt: '2026-09-03T12:00:00Z',
    updatedAt: '2026-09-03T12:00:00Z',
    parentId: 'folder-pictures',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop'
  },

  // Work Notes
  {
    id: 'file-meeting',
    name: 'Meeting_Minutes_DeX.md',
    type: 'text',
    extension: 'md',
    size: 1420,
    createdAt: '2026-09-08T08:00:00Z',
    updatedAt: '2026-09-08T08:25:00Z',
    parentId: 'folder-worknotes',
    content: `# Catatan Rapat Koordinasi Tim
Tanggal: 8 September 2026
Peserta: Tim UI/UX, Arsitek Sistem, Pengembang Aplikasi

### Poin Diskusi:
1. **Dukungan Window Snapping**: Respon visual split-screen ditingkatkan dengan indikator transparan.
2. **File Manager**: Penambahan filter pencarian real-time dan pengunggahan file eksternal instan.
3. **Pengaturan Sistem**: Penyesuaian suhu Night Light dan tema gelap hemat energi.

### Tindak Lanjut:
- Validasi shortcut Alt+Tab switcher dan preview taskbar.
- Pastikan semua window dapat digeser dan diubah ukurannya dengan presisi.`
  },

  // Downloads
  {
    id: 'file-financial',
    name: 'Laporan_Analisis_Kinerja.txt',
    type: 'text',
    extension: 'txt',
    size: 920,
    createdAt: '2026-09-08T08:10:00Z',
    updatedAt: '2026-09-08T08:10:00Z',
    parentId: 'folder-downloads',
    content: `RINGKASAN EFISIENSI SISTEM DEX
Efisiensi Alur Kerja Multi-Window: +48%
Waktu Akses Dokumen: < 120ms
Penggunaan Memori Rata-rata: 3.2 GB / 12 GB
Status Integritas Penyimpanan: Optimal`
  }
];

export const DEFAULT_NOTIFICATIONS: DeXNotification[] = [
  {
    id: 'notif-1',
    title: 'Samsung DeX Pro Aktif',
    message: 'Lingkungan desktop profesional siap digunakan dengan akselerasi multi-window.',
    appName: 'System',
    icon: 'ShieldCheck',
    timestamp: 'Baru saja',
    unread: true,
    type: 'success'
  },
  {
    id: 'notif-2',
    title: 'Penyimpanan My Files Siap',
    message: 'Direktori berkas terorganisir dengan kapasitas memori lokal tersedia.',
    appName: 'My Files',
    icon: 'FolderKanban',
    timestamp: '5m lalu',
    unread: true,
    type: 'info',
    actionLabel: 'Buka Files',
    onActionAppId: 'files'
  },
  {
    id: 'notif-3',
    title: 'Optimalisasi Baterai & Suhu',
    message: 'Mode performa profesional disesuaikan untuk efisiensi daya kerja maksimal.',
    appName: 'Device Care',
    icon: 'BatteryCharging',
    timestamp: '15m lalu',
    unread: false,
    type: 'info'
  }
];
