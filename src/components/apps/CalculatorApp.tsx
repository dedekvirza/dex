import React, { useState } from 'react';
import { Delete, History, Trash2 } from 'lucide-react';

export const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleDigit = (digit: string) => {
    setDisplay(prev => (prev === '0' ? digit : prev + digit));
  };

  const handleOperator = (op: string) => {
    setEquation(`${display} ${op} `);
    setDisplay('0');
  };

  const handleEqual = () => {
    if (!equation) return;
    try {
      const full = `${equation}${display}`.replace(/×/g, '*').replace(/÷/g, '/');
      // eslint-disable-next-line no-eval
      const result = Function(`'use strict'; return (${full})`)();
      const resultStr = String(Number(result.toFixed(6)));
      setHistory(prev => [`${equation}${display} = ${resultStr}`, ...prev.slice(0, 9)]);
      setDisplay(resultStr);
      setEquation('');
    } catch {
      setDisplay('Error');
      setEquation('');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  const handleBackspace = () => {
    setDisplay(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  };

  return (
    <div className="flex flex-col h-full w-full select-none text-xs bg-neutral-900 text-neutral-100 p-3 gap-2">
      {/* Top Bar with History Toggle */}
      <div className="flex items-center justify-between text-neutral-400">
        <span className="font-semibold text-[11px]">Kalkulator DeX</span>
        <button
          onClick={() => setShowHistory(prev => !prev)}
          className={`p-1.5 rounded-lg hover:bg-neutral-800 transition-colors ${
            showHistory ? 'text-blue-400 bg-neutral-800' : ''
          }`}
          title="Riwayat Perhitungan"
        >
          <History className="w-4 h-4" />
        </button>
      </div>

      {showHistory ? (
        <div className="flex-1 overflow-y-auto p-2 bg-neutral-950 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between pb-1 border-b border-neutral-800">
            <span className="text-[11px] font-bold text-neutral-400">Riwayat</span>
            <button
              onClick={() => setHistory([])}
              className="text-[10px] text-red-400 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Hapus
            </button>
          </div>
          {history.length === 0 ? (
            <span className="text-[11px] text-neutral-500 block text-center py-4">
              Belum ada riwayat
            </span>
          ) : (
            history.map((item, idx) => (
              <div key={idx} className="p-1.5 rounded bg-neutral-900 font-mono text-[11px] text-neutral-300">
                {item}
              </div>
            ))
          )}
        </div>
      ) : (
        <>
          {/* Display Stage */}
          <div className="p-3 rounded-xl bg-neutral-950 flex flex-col items-end justify-end h-24 border border-neutral-800">
            <span className="text-[11px] text-neutral-500 h-4 font-mono">{equation}</span>
            <span className="text-3xl font-bold tracking-tight text-white font-mono truncate max-w-full">
              {display}
            </span>
          </div>

          {/* Button Grid */}
          <div className="grid grid-cols-4 gap-1.5 flex-1">
            <button
              onClick={handleClear}
              className="rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-amber-400 font-bold text-sm transition-colors"
            >
              C
            </button>
            <button
              onClick={handleBackspace}
              className="rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center transition-colors"
            >
              <Delete className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleOperator('%')}
              className="rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-blue-400 font-bold text-sm transition-colors"
            >
              %
            </button>
            <button
              onClick={() => handleOperator('÷')}
              className="rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-400 font-bold text-base transition-colors"
            >
              ÷
            </button>

            {['7', '8', '9'].map(d => (
              <button
                key={d}
                onClick={() => handleDigit(d)}
                className="rounded-xl bg-neutral-800/50 hover:bg-neutral-700 text-white font-semibold text-sm transition-colors"
              >
                {d}
              </button>
            ))}
            <button
              onClick={() => handleOperator('×')}
              className="rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-400 font-bold text-base transition-colors"
            >
              ×
            </button>

            {['4', '5', '6'].map(d => (
              <button
                key={d}
                onClick={() => handleDigit(d)}
                className="rounded-xl bg-neutral-800/50 hover:bg-neutral-700 text-white font-semibold text-sm transition-colors"
              >
                {d}
              </button>
            ))}
            <button
              onClick={() => handleOperator('-')}
              className="rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-400 font-bold text-base transition-colors"
            >
              -
            </button>

            {['1', '2', '3'].map(d => (
              <button
                key={d}
                onClick={() => handleDigit(d)}
                className="rounded-xl bg-neutral-800/50 hover:bg-neutral-700 text-white font-semibold text-sm transition-colors"
              >
                {d}
              </button>
            ))}
            <button
              onClick={() => handleOperator('+')}
              className="rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-400 font-bold text-base transition-colors"
            >
              +
            </button>

            <button
              onClick={() => handleDigit('0')}
              className="col-span-2 rounded-xl bg-neutral-800/50 hover:bg-neutral-700 text-white font-semibold text-sm transition-colors"
            >
              0
            </button>
            <button
              onClick={() => handleDigit('.')}
              className="rounded-xl bg-neutral-800/50 hover:bg-neutral-700 text-white font-bold text-sm transition-colors"
            >
              .
            </button>
            <button
              onClick={handleEqual}
              className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-md transition-colors"
            >
              =
            </button>
          </div>
        </>
      )}
    </div>
  );
};
