import React, { useState } from 'react';
import { Delete, CornerDownLeft, ArrowLeftRight } from 'lucide-react';

interface TurkishKeyboardProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  theme?: 'light' | 'dark';
}

// QWERTY Düzeni (Standart Türkçe F klavye değil, Q klavye)
const QWERTY_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Ğ', 'Ü'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ş', 'İ'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Ö', 'Ç']
];

// Alfabetik Düzeni (A-Z sırası, Türkçe harfler dahil)
const ALPHABETIC_LAYOUT = [
  ['A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'Ğ', 'H'],
  ['I', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P'],
  ['Q', 'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'W', 'X', 'Y', 'Z']
];

export const TurkishKeyboard: React.FC<TurkishKeyboardProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Bir şeyler yaz...",
  maxLength = 25,
  disabled = false,
  theme = 'light'
}) => {
  // Klavye düzeni state'i: 'qwerty' veya 'abc'
  const [layoutMode, setLayoutMode] = useState<'qwerty' | 'abc'>('qwerty');

  // Aktif layout'u seç
  const currentLayout = layoutMode === 'qwerty' ? QWERTY_LAYOUT : ALPHABETIC_LAYOUT;

  const handleKeyPress = (key: string) => {
    if (disabled) return;

    if (value.length < maxLength) {
      onChange(value + key);
    }
  };

  const handleBackspace = () => {
    if (disabled || value.length === 0) return;
    onChange(value.slice(0, -1));
  };

  const handleSpace = () => {
    if (disabled) return;
    if (value.length < maxLength && value.length > 0 && !value.endsWith(' ')) {
      onChange(value + ' ');
    }
  };

  const handleSubmit = () => {
    if (disabled || !value.trim()) return;
    onSubmit();
  };

  // Theme-based styling
  const isDark = theme === 'dark';

  const containerClass = isDark
    ? "w-full select-none bg-slate-800 border-t border-slate-700"
    : "w-full select-none";

  const displayBgClass = isDark ? "px-3 pt-3 pb-2 bg-slate-800" : "px-3 pt-3 pb-2 bg-slate-50";

  const displayInputClass = isDark
    ? "bg-slate-900 border-2 border-slate-600 rounded-xl px-4 py-3 min-h-[52px] flex items-center shadow-sm"
    : "bg-white border-2 border-slate-300 rounded-xl px-4 py-3 min-h-[52px] flex items-center shadow-sm";

  const textClass = isDark ? "text-white font-medium text-lg" : "text-slate-800 font-medium text-lg";
  const placeholderClass = isDark ? "text-slate-500 italic text-base" : "text-slate-400 italic text-base";
  const counterClass = isDark ? "text-xs text-slate-500 font-mono" : "text-xs text-slate-400 font-mono";

  const keyboardBgClass = isDark
    ? "p-2 pt-1 space-y-1 bg-slate-800 pb-[max(0.5rem,env(safe-area-inset-bottom,0.5rem))]"
    : "p-2 pt-1 space-y-1 bg-slate-100 pb-[max(0.5rem,env(safe-area-inset-bottom,0.5rem))]";

  const keyClass = isDark
    ? "flex-1 min-w-0 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg transition-all text-base sm:text-lg shadow-sm active:scale-95"
    : "flex-1 min-w-0 bg-white hover:bg-slate-50 active:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 font-bold py-2.5 rounded-lg transition-all text-base sm:text-lg shadow-sm active:scale-95 border border-slate-200";

  const spaceClass = isDark
    ? "flex-1 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg transition-all text-sm shadow-sm active:scale-95"
    : "flex-1 bg-white hover:bg-slate-50 active:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 font-bold py-2.5 rounded-lg transition-all text-sm shadow-sm active:scale-95 border border-slate-200";

  return (
    <div className={containerClass}>
      {/* Display Area */}
      <div className={displayBgClass}>
        <div className={displayInputClass}>
          {value ? (
            <span className={textClass}>{value}</span>
          ) : (
            <span className={placeholderClass}>{placeholder}</span>
          )}
          <div className="ml-auto flex items-center gap-1.5">
            <span className={counterClass}>{value.length}/{maxLength}</span>
          </div>
        </div>
      </div>

      {/* Keyboard */}
      <div className={keyboardBgClass}>
        {/* Layout Toggle Button */}
        <div className="flex justify-end mb-1 px-1">
          <button
            type="button"
            onClick={() => setLayoutMode(prev => prev === 'qwerty' ? 'abc' : 'qwerty')}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold transition-all ${isDark ? 'bg-slate-600 hover:bg-slate-500 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-600'}`}
          >
            <ArrowLeftRight className="w-3 h-3" />
            {layoutMode === 'qwerty' ? 'ABC' : 'QWERTY'}
          </button>
        </div>

        {/* Row 1 */}
        <div className="flex gap-1 justify-center">
          {currentLayout[0].map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => handleKeyPress(key)}
              disabled={disabled}
              className={keyClass}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Row 2 */}
        <div className="flex gap-1 justify-center px-2">
          {currentLayout[1].map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => handleKeyPress(key)}
              disabled={disabled}
              className={keyClass}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Row 3 */}
        <div className="flex gap-1 justify-center">
          {currentLayout[2].map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => handleKeyPress(key)}
              disabled={disabled}
              className={keyClass}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Bottom Row - Space, Enter, Backspace */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={handleSpace}
            disabled={disabled}
            className={spaceClass}
          >
            BOŞLUK
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={disabled || !value.trim()}
            className="w-14 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg transition-all flex items-center justify-center shadow-md active:scale-95"
          >
            <CornerDownLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleBackspace}
            disabled={disabled || value.length === 0}
            className="w-14 bg-red-500 hover:bg-red-600 active:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg transition-all flex items-center justify-center shadow-md active:scale-95"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
