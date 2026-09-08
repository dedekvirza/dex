import React, { useState, useEffect } from 'react';
import { useDeX } from '../../context/DeXContext';
import { AppIcon } from '../common/AppIcon';
import { Activity, Cpu, HardDrive, Zap, XCircle, RefreshCw } from 'lucide-react';

export const TaskManagerApp: React.FC = () => {
  const { windows, closeWindow, apps, settings, updateSettings, addNotification } = useDeX();

  const [cpuHistory, setCpuHistory] = useState<number[]>([18, 22, 28, 25, 30, 24, 20, 29, 32, 26]);
  const [currentCpu, setCurrentCpu] = useState(26);
  const [ramUsed, setRamUsed] = useState(3.4);

  // Simulate realistic CPU/RAM activity fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      const base = 15 + windows.length * 4;
      const variation = Math.floor(Math.random() * 12) - 6;
      const nextCpu = Math.min(95, Math.max(8, base + variation));
      setCurrentCpu(nextCpu);
      setCpuHistory(prev => [...prev.slice(1), nextCpu]);

      const baseRam = 3.0 + windows.length * 0.45;
      setRamUsed(parseFloat((baseRam + (Math.random() * 0.2 - 0.1)).toFixed(2)));
    }, 1500);

    return () => clearInterval(interval);
  }, [windows.length]);

  return (
    <div className="flex flex-col h-full w-full select-none text-xs p-4 gap-4 overflow-y-auto">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-3 gap-3 shrink-0">
        {/* CPU Card */}
        <div
          className={`p-3.5 rounded-xl border flex flex-col justify-between ${
            settings.darkMode ? 'bg-neutral-800/40 border-neutral-700/60' : 'bg-neutral-100 border-neutral-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-neutral-400">Penggunaan CPU</span>
            <Cpu className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-white tracking-tight">{currentCpu}%</span>
            <span className="text-[11px] text-neutral-400 block">Snapdragon DeX Octa-Core</span>
          </div>
          {/* Mini Bar Graph */}
          <div className="flex items-end gap-1 h-8 mt-2 pt-1 border-t border-neutral-700/40">
            {cpuHistory.map((val, idx) => (
              <div
                key={idx}
                className="flex-1 bg-blue-500/60 rounded-xs transition-all duration-300"
                style={{ height: `${Math.max(10, val)}%` }}
              />
            ))}
          </div>
        </div>

        {/* RAM Card */}
        <div
          className={`p-3.5 rounded-xl border flex flex-col justify-between ${
            settings.darkMode ? 'bg-neutral-800/40 border-neutral-700/60' : 'bg-neutral-100 border-neutral-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-neutral-400">Memori RAM</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-white tracking-tight">{ramUsed} GB</span>
            <span className="text-[11px] text-neutral-400 block">Dari 12.0 GB LPDDR5X</span>
          </div>
          <div className="w-full h-2 rounded-full bg-neutral-700 overflow-hidden mt-3">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${(ramUsed / 12) * 100}%` }}
            />
          </div>
        </div>

        {/* Performance Mode Card */}
        <div
          className={`p-3.5 rounded-xl border flex flex-col justify-between ${
            settings.darkMode ? 'bg-neutral-800/40 border-neutral-700/60' : 'bg-neutral-100 border-neutral-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-neutral-400">Mode Sistem</span>
            <Zap className={`w-4 h-4 ${settings.performanceMode ? 'text-amber-400' : 'text-neutral-400'}`} />
          </div>
          <div className="mt-2">
            <span className="text-base font-bold text-white block">
              {settings.performanceMode ? 'Performa Tinggi' : 'Seimbang (Standar)'}
            </span>
            <span className="text-[11px] text-neutral-400 block">
              {settings.performanceMode ? 'Prioritas render maksimal' : 'Efisiensi termal stabil'}
            </span>
          </div>
          <button
            onClick={() => updateSettings({ performanceMode: !settings.performanceMode })}
            className="mt-2 text-left text-[11px] font-semibold text-blue-400 hover:underline"
          >
            Alihkan Mode
          </button>
        </div>
      </div>

      {/* Running Processes Table */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-neutral-200">
            Aplikasi & Proses Berjalan ({windows.length + 3})
          </span>
          <span className="text-[11px] text-neutral-400">
            Klik 'Hentikan' untuk menutup paksa proses
          </span>
        </div>

        <div className="flex-1 border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900/40">
          <table className="w-full text-left border-collapse">
            <thead className="bg-neutral-800/80 text-[10px] uppercase font-bold text-neutral-400 border-b border-neutral-700">
              <tr>
                <th className="py-2.5 px-3">Nama Proses</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">CPU</th>
                <th className="py-2.5 px-3">Memori</th>
                <th className="py-2.5 px-3 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 text-neutral-200">
              {/* Active Windows as processes */}
              {windows.map((win, idx) => (
                <tr key={win.id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="py-2 px-3 flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-blue-600/30 flex items-center justify-center text-blue-400">
                      <AppIcon name={win.icon} className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium">{win.title}</span>
                  </td>
                  <td className="py-2 px-3">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {win.isMinimized ? 'Latar Belakang' : 'Aktif (Foreground)'}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-mono text-[11px]">
                    {(3.2 + (idx * 1.8)).toFixed(1)}%
                  </td>
                  <td className="py-2 px-3 font-mono text-[11px]">
                    {(140 + idx * 45)} MB
                  </td>
                  <td className="py-2 px-3 text-right">
                    <button
                      onClick={() => {
                        closeWindow(win.id);
                        addNotification({
                          title: 'Proses Ditutup',
                          message: `${win.title} dihentikan dari Task Manager.`,
                          appName: 'Task Manager',
                          icon: 'Activity',
                          type: 'warning'
                        });
                      }}
                      className="px-2 py-1 rounded bg-red-600/20 hover:bg-red-600/40 text-red-400 text-[11px] font-medium transition-colors"
                    >
                      Hentikan
                    </button>
                  </td>
                </tr>
              ))}

              {/* Background System Daemons */}
              <tr className="hover:bg-neutral-800/40 transition-colors">
                <td className="py-2 px-3 flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-neutral-700/50 flex items-center justify-center text-neutral-400">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium">DeX Window Compositor</span>
                </td>
                <td className="py-2 px-3 text-neutral-400 text-[11px]">Layanan Sistem</td>
                <td className="py-2 px-3 font-mono text-[11px]">4.1%</td>
                <td className="py-2 px-3 font-mono text-[11px]">280 MB</td>
                <td className="py-2 px-3 text-right text-neutral-500 text-[11px]">Dilindungi</td>
              </tr>
              <tr className="hover:bg-neutral-800/40 transition-colors">
                <td className="py-2 px-3 flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-neutral-700/50 flex items-center justify-center text-neutral-400">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium">One UI Notification Broker</span>
                </td>
                <td className="py-2 px-3 text-neutral-400 text-[11px]">Layanan Sistem</td>
                <td className="py-2 px-3 font-mono text-[11px]">0.8%</td>
                <td className="py-2 px-3 font-mono text-[11px]">64 MB</td>
                <td className="py-2 px-3 text-right text-neutral-500 text-[11px]">Dilindungi</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
