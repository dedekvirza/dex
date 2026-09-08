import React, { useState, useRef, useEffect } from 'react';
import { useDeX } from '../../context/DeXContext';

export const TerminalApp: React.FC = () => {
  const { files, createFolder, deleteFile, windows, closeWindow, openApp } = useDeX();

  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([
    'Selamat datang di Samsung DeX Interactive Shell (v6.1.0-dex)',
    'Ketik "help" untuk melihat daftar perintah yang tersedia.',
    ''
  ]);
  const [historyCommands, setHistoryCommands] = useState<string[]>([]);
  const [cmdIndex, setCmdIndex] = useState<number>(-1);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmdStr: string) => {
    const raw = cmdStr.trim();
    if (!raw) {
      setHistory(prev => [...prev, 'dex-user@dex-pro:~$ ']);
      return;
    }

    setHistoryCommands(prev => [...prev, raw]);
    setCmdIndex(-1);

    const parts = raw.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    const outputLines: string[] = [`dex-user@dex-pro:~$ ${raw}`];

    switch (cmd) {
      case 'help':
        outputLines.push(
          'Perintah yang tersedia:',
          '  neofetch      Tampilkan info sistem & logo DeX Pro',
          '  ls            Daftar berkas & folder dalam direktori aktif',
          '  cat <file>    Tampilkan isi berkas teks',
          '  mkdir <nama>  Buat folder baru di My Files',
          '  rm <nama>     Hapus berkas dari My Files',
          '  ps            Daftar jendela aplikasi yang sedang berjalan',
          '  open <app>    Buka aplikasi (files, settings, notes, browser, etc)',
          '  date          Tampilkan tanggal & waktu saat ini',
          '  uptime        Waktu aktif sistem',
          '  whoami        Tampilkan pengguna aktif',
          '  clear         Bersihkan layar terminal'
        );
        break;

      case 'neofetch':
        outputLines.push(
          '   ██████╗ ███████╗██╗  ██╗   OS: Samsung DeX Pro Workstation (One UI 6.1)',
          '   ██╔══██╗██╔════╝╚██╗██╔╝   Host: Galaxy DeX Pro Desktop Edition',
          '   ██║  ██║█████╗   ╚███╔╝    Kernel: 6.6.21-dex-wayland-x86_64',
          '   ██║  ██║██╔══╝   ██╔██╗    Uptime: 2 hours, 14 mins',
          '   ██████╔╝███████╗██╔╝ ██╗   Shell: bash 5.2-dex',
          '   ╚═════╝ ╚══════╝╚═╝  ╚═╝   Resolution: 1920x1080 @ 120Hz',
          '                              WM: OneUI Wayland Multi-Window Compositor',
          '                              CPU: Qualcomm Snapdragon 8 Gen 3 for Galaxy (8)',
          '                              Memory: 3.4GB / 12GB (LPDDR5X)'
        );
        break;

      case 'ls': {
        const rootFiles = files.filter(f => f.parentId === null && !f.isTrashed);
        if (rootFiles.length === 0) {
          outputLines.push('(folder kosong)');
        } else {
          outputLines.push(
            ...rootFiles.map(
              f => `  ${f.type === 'folder' ? '📁 [DIR]' : '📄 [FILE]'} ${f.name} (${f.size} B)`
            )
          );
        }
        break;
      }

      case 'cat': {
        if (!args[0]) {
          outputLines.push('Penggunaan: cat <nama_berkas>');
          break;
        }
        const target = files.find(f => f.name.toLowerCase() === args[0].toLowerCase());
        if (!target) {
          outputLines.push(`cat: ${args[0]}: Berkas tidak ditemukan.`);
        } else if (target.type === 'folder') {
          outputLines.push(`cat: ${args[0]}: Merupakan sebuah direktori.`);
        } else {
          outputLines.push(target.content || '(berkas teks kosong)');
        }
        break;
      }

      case 'mkdir': {
        if (!args[0]) {
          outputLines.push('Penggunaan: mkdir <nama_folder>');
          break;
        }
        createFolder(args.join(' '), null);
        outputLines.push(`Folder "${args.join(' ')}" berhasil dibuat.`);
        break;
      }

      case 'rm': {
        if (!args[0]) {
          outputLines.push('Penggunaan: rm <nama_berkas>');
          break;
        }
        const target = files.find(f => f.name.toLowerCase() === args[0].toLowerCase());
        if (!target) {
          outputLines.push(`rm: ${args[0]}: Berkas tidak ditemukan.`);
        } else {
          deleteFile(target.id);
          outputLines.push(`Berkas "${target.name}" dipindahkan ke tempat sampah.`);
        }
        break;
      }

      case 'ps':
        outputLines.push('PID    TTY      TIME CMD');
        outputLines.push('  1    ?    00:00:02 dex-init');
        outputLines.push('  28   ?    00:00:08 wayland-compositor');
        windows.forEach((w, idx) => {
          outputLines.push(` ${100 + idx}    tty1 00:00:01 ${w.title} (${w.id})`);
        });
        break;

      case 'open': {
        if (!args[0]) {
          outputLines.push('Penggunaan: open <app_id> (contoh: open files, open settings)');
          break;
        }
        openApp(args[0].toLowerCase());
        outputLines.push(`Membuka aplikasi ${args[0]}...`);
        break;
      }

      case 'date':
        outputLines.push(new Date().toString());
        break;

      case 'uptime':
        outputLines.push(' 08:42:00 up 2:14, 1 user, load average: 0.28, 0.35, 0.40');
        break;

      case 'whoami':
        outputLines.push('dex-user');
        break;

      case 'clear':
        setHistory([]);
        return;

      default:
        outputLines.push(`bash: ${cmd}: perintah tidak ditemukan. Ketik "help" untuk bantuan.`);
        break;
    }

    setHistory(prev => [...prev, ...outputLines]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      if (historyCommands.length > 0) {
        const nextIdx = cmdIndex === -1 ? historyCommands.length - 1 : Math.max(0, cmdIndex - 1);
        setCmdIndex(nextIdx);
        setInput(historyCommands[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      if (historyCommands.length > 0 && cmdIndex !== -1) {
        const nextIdx = cmdIndex + 1;
        if (nextIdx < historyCommands.length) {
          setCmdIndex(nextIdx);
          setInput(historyCommands[nextIdx]);
        } else {
          setCmdIndex(-1);
          setInput('');
        }
      }
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="h-full w-full bg-neutral-950 p-3 font-mono text-xs text-neutral-200 overflow-y-auto cursor-text select-text"
    >
      {history.map((line, idx) => (
        <div key={idx} className="whitespace-pre-wrap leading-relaxed">
          {line.startsWith('dex-user@dex-pro:~$') ? (
            <span>
              <span className="text-emerald-400 font-bold">dex-user@dex-pro</span>
              <span className="text-neutral-500">:</span>
              <span className="text-blue-400">~</span>
              <span className="text-neutral-500">$</span>
              <span className="text-white ml-2">{line.replace('dex-user@dex-pro:~$', '').trim()}</span>
            </span>
          ) : (
            <span className="text-neutral-300">{line}</span>
          )}
        </div>
      ))}

      <div className="flex items-center gap-2 mt-1">
        <span className="text-emerald-400 font-bold">dex-user@dex-pro</span>
        <span className="text-neutral-500">:</span>
        <span className="text-blue-400">~</span>
        <span className="text-neutral-500">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className="flex-1 bg-transparent border-none outline-hidden text-white font-mono text-xs"
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
};
