import React, { useState } from 'react';
import { useDeX } from '../../context/DeXContext';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Clock } from 'lucide-react';

export const CalendarFlyout: React.FC = () => {
  const { isCalendarOpen, setIsCalendarOpen, settings } = useDeX();
  const [currentDate, setCurrentDate] = useState(new Date());

  if (!isCalendarOpen) return null;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const isToday = (d: number) => {
    const today = new Date();
    return (
      d === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const isTopTaskbar = settings.taskbarPosition === 'top';

  return (
    <div
      id="dex-calendar-flyout"
      onClick={e => e.stopPropagation()}
      style={{
        bottom: isTopTaskbar ? 'auto' : '56px',
        top: isTopTaskbar ? '56px' : 'auto',
        right: '16px'
      }}
      className={`fixed z-[900] w-76 p-4 rounded-3xl shadow-2xl border backdrop-blur-2xl text-xs select-none animate-in fade-in zoom-in-95 duration-150 ${
        settings.darkMode
          ? 'bg-neutral-900/95 border-neutral-700/80 text-neutral-100'
          : 'bg-white/95 border-neutral-200 text-neutral-900'
      }`}
    >
      {/* Header Month / Year */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div>
          <span className="font-bold text-sm text-white">
            {monthNames[month]} {year}
          </span>
          <span className="text-[10px] text-neutral-400 block">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevMonth}
            className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsCalendarOpen(false)}
            className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 text-center font-semibold text-neutral-500 py-2 text-[10px]">
        <span>Min</span>
        <span>Sen</span>
        <span>Sel</span>
        <span>Rab</span>
        <span>Kam</span>
        <span>Jum</span>
        <span>Sab</span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center font-medium">
        {/* Leading empty spaces */}
        {Array.from({ length: firstDayIndex }).map((_, idx) => (
          <div key={`empty-${idx}`} className="h-7" />
        ))}

        {/* Days */}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const day = idx + 1;
          const today = isToday(day);
          return (
            <button
              key={day}
              className={`h-7 w-7 mx-auto rounded-full flex items-center justify-center transition-all ${
                today
                  ? 'bg-blue-600 text-white font-bold shadow-md scale-105'
                  : 'hover:bg-neutral-800/80 text-neutral-300'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Today Agenda Summary */}
      <div className="mt-3 pt-3 border-t border-neutral-800 space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
          Agenda Hari Ini
        </span>
        <div className="p-2 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-300 text-[11px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Sesi Kerja DeX Workstation</span>
          </div>
          <span className="text-[10px] text-blue-400 font-mono">09:00 - 18:00</span>
        </div>
      </div>
    </div>
  );
};
