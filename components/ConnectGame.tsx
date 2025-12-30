import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Category } from '../types';

interface ConnectGameProps {
  category: Category;
  onWin: () => void;
  onBack: () => void;
}

// ----------------------------------------------------------------------
// LEVEL DATA STRUCTURE
// ----------------------------------------------------------------------

interface CrosswordWord {
  word: string;
  row: number;
  col: number;
  dir: 'H' | 'V'; // Horizontal or Vertical
}

interface Level {
  id: number;
  letters: string[];
  words: CrosswordWord[];
}

// Özenle hazırlanmış, kesişen kelimelerden oluşan bölümler
// NOT: Boşluk içeren kelimeler (ör: "su aygırı") bu oyunda KULLANILMAMALI!
// TÜM KELİMELER KONTROL EDİLDİ - Harfler wheel'da mevcut olmalı!
const LEVELS: Level[] = [
  {
    id: 1,
    letters: ["O", "K", "U", "L"],
    words: [
      { word: "OKUL", row: 1, col: 0, dir: "H" },
      { word: "KOL", row: 1, col: 1, dir: "V" },
    ]
  },
  {
    id: 2,
    letters: ["M", "A", "S"],
    words: [
      { word: "MASA", row: 1, col: 0, dir: "H" },
      { word: "SAM", row: 1, col: 2, dir: "V" },
    ]
  },
  {
    id: 3,
    letters: ["K", "A", "P", "I"],
    words: [
      { word: "KAPI", row: 1, col: 0, dir: "H" },
      { word: "PAK", row: 1, col: 2, dir: "V" },
    ]
  },
  {
    id: 4,
    letters: ["E", "L", "M", "A"],
    words: [
      { word: "ELMA", row: 1, col: 0, dir: "H" },
      { word: "MAL", row: 1, col: 2, dir: "V" },
      { word: "ALE", row: 1, col: 3, dir: "V" },
    ]
  },
  {
    id: 5,
    letters: ["G", "Ü", "N", "E", "Ş"],
    words: [
      { word: "GÜNEŞ", row: 2, col: 0, dir: "H" },
      { word: "ŞEN", row: 2, col: 4, dir: "V" },
      { word: "GÜN", row: 0, col: 0, dir: "V" },
    ]
  },
  {
    id: 6,
    letters: ["K", "E", "D", "İ"],
    words: [
      { word: "KEDİ", row: 1, col: 0, dir: "H" },
      { word: "DİK", row: 1, col: 2, dir: "V" },
    ]
  },
  {
    id: 7,
    letters: ["D", "E", "N", "İ", "Z"],
    words: [
      { word: "DENİZ", row: 2, col: 0, dir: "H" },
      { word: "DİN", row: 2, col: 0, dir: "V" },
      { word: "İZ", row: 3, col: 3, dir: "H" },
    ]
  },
  {
    id: 8,
    letters: ["K", "A", "L", "E", "M"],
    words: [
      { word: "KALEM", row: 1, col: 0, dir: "H" },
      { word: "KALE", row: 1, col: 0, dir: "V" },
      { word: "EL", row: 4, col: 0, dir: "H" },
    ]
  },
  {
    id: 9,
    letters: ["B", "A", "L", "I", "K"],
    words: [
      { word: "BALIK", row: 2, col: 0, dir: "H" },
      { word: "BAL", row: 2, col: 0, dir: "V" },
      { word: "KIL", row: 2, col: 4, dir: "V" },
    ]
  },
  {
    id: 10,
    letters: ["T", "O", "P", "R", "A", "K"],
    words: [
      { word: "TOPRAK", row: 2, col: 0, dir: "H" },
      { word: "TOP", row: 2, col: 0, dir: "V" },
      { word: "KAP", row: 2, col: 5, dir: "V" },
    ]
  },
  {
    id: 11,
    letters: ["A", "R", "I"],
    words: [
      { word: "ARI", row: 1, col: 0, dir: "H" },
      { word: "IR", row: 1, col: 2, dir: "V" },
    ]
  },
  {
    id: 12,
    letters: ["Y", "O", "L"],
    words: [
      { word: "YOL", row: 1, col: 0, dir: "H" },
      { word: "OY", row: 1, col: 1, dir: "V" },
    ]
  },
  {
    id: 13,
    letters: ["A", "T", "E", "Ş"],
    words: [
      { word: "ATEŞ", row: 1, col: 0, dir: "H" },
      { word: "AŞ", row: 1, col: 0, dir: "V" },
      { word: "ŞAT", row: 2, col: 0, dir: "H" },
    ]
  },
  {
    id: 14,
    letters: ["S", "U", "Y"],
    words: [
      { word: "SU", row: 1, col: 0, dir: "H" },
      { word: "US", row: 0, col: 1, dir: "V" },
    ]
  },
  {
    id: 15,
    letters: ["C", "A", "N"],
    words: [
      { word: "CAN", row: 1, col: 0, dir: "H" },
      { word: "AN", row: 1, col: 1, dir: "V" },
    ]
  }
];

const ConnectGame: React.FC<ConnectGameProps> = ({ category, onWin, onBack }) => {
  // Game State
  const [levelIndex, setLevelIndex] = useState(0);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [gridScale, setGridScale] = useState(1);

  // Wheel Interaction State
  const [currentPath, setCurrentPath] = useState<number[]>([]);
  const [tempWord, setTempWord] = useState('');

  const wheelRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // Load a level
  useEffect(() => {
    const idx = Math.floor(Math.random() * LEVELS.length);
    setLevelIndex(idx);
    setFoundWords(new Set());
    setCurrentPath([]);
    setTempWord('');
    const lvl = LEVELS[idx];
    console.log('🏰 KELIME KULESI - BOLUM YUKLENDI');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Kategori: ${category.label}`);
    console.log(`Seçilen Bölüm ID: ${lvl.id}`);
    console.log('Harflar (çark):', lvl.letters.join(' '));
    console.log('Hedef Kelimeler:', lvl.words.map(w => w.word));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }, [category]);

  const currentLevel = LEVELS[levelIndex];
  const targetWords = currentLevel.words.map(w => w.word);

  // ----------------------------------------------------------------------
  // GRID CALCULATION
  // ----------------------------------------------------------------------

  const gridMap = useMemo(() => {
    const map = new Map<string, { char: string, words: string[] }>();

    currentLevel.words.forEach(w => {
      for (let i = 0; i < w.word.length; i++) {
        const r = w.dir === 'H' ? w.row : w.row + i;
        const c = w.dir === 'H' ? w.col + i : w.col;
        const key = `${r},${c}`;

        const existing = map.get(key);
        if (existing) {
          existing.words.push(w.word);
        } else {
          map.set(key, { char: w.word[i], words: [w.word] });
        }
      }
    });
    return map;
  }, [currentLevel]);

  const { minR, maxR, minC, maxC } = useMemo(() => {
    let minR = Infinity, maxR = -Infinity, minC = Infinity, maxC = -Infinity;
    Array.from(gridMap.keys()).forEach((k: string) => {
      const [r, c] = k.split(',').map(Number);
      if (r < minR) minR = r;
      if (r > maxR) maxR = r;
      if (c < minC) minC = c;
      if (c > maxC) maxC = c;
    });
    return { minR, maxR, minC, maxC };
  }, [gridMap]);

  const gridRows = maxR - minR + 1;
  const gridCols = maxC - minC + 1;
  const cellSize = 44; // px

  // Responsive Grid Scaling
  useEffect(() => {
    const handleResize = () => {
      if (gridContainerRef.current) {
        const { clientWidth, clientHeight } = gridContainerRef.current;
        const neededWidth = gridCols * cellSize;
        const neededHeight = gridRows * cellSize;

        // Add some padding
        const horizontalScale = (clientWidth - 20) / neededWidth;
        const verticalScale = (clientHeight - 20) / neededHeight;

        // Scale down if too big, but limit scaling up to 1.1x
        const newScale = Math.min(1.1, horizontalScale, verticalScale);
        setGridScale(newScale);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [gridCols, gridRows, levelIndex]);

  // ----------------------------------------------------------------------
  // WHEEL LOGIC
  // ----------------------------------------------------------------------

  const letters = currentLevel.letters;

  const getLetterCoords = (index: number, total: number) => {
    const angle = (index * (360 / total) - 90) * (Math.PI / 180);
    const x = 50 + 35 * Math.cos(angle);
    const y = 50 + 35 * Math.sin(angle);
    return { x, y };
  };

  const getIndexFromPoint = (clientX: number, clientY: number) => {
    if (!wheelRef.current) return -1;
    const rect = wheelRef.current.getBoundingClientRect();
    const relX = ((clientX - rect.left) / rect.width) * 100;
    const relY = ((clientY - rect.top) / rect.height) * 100;

    for (let i = 0; i < letters.length; i++) {
      const { x, y } = getLetterCoords(i, letters.length);
      const dist = Math.sqrt(Math.pow(relX - x, 2) + Math.pow(relY - y, 2));
      if (dist < 18) return i; // Increased touch target for better feel
    }
    return -1;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const idx = getIndexFromPoint(e.clientX, e.clientY);
    if (idx !== -1) {
      setCurrentPath([idx]);
      setTempWord(letters[idx]);
      console.log(`▶️ Başlangıç harfi seçildi: "${letters[idx]}" (index: ${idx})`);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (currentPath.length === 0) return;
    e.preventDefault();
    const idx = getIndexFromPoint(e.clientX, e.clientY);
    if (idx !== -1 && !currentPath.includes(idx)) {
      const newPath = [...currentPath, idx];
      setCurrentPath(newPath);
      setTempWord(newPath.map(i => letters[i]).join(''));
      console.log('✏️ Oluşan kelime:', newPath.map(i => letters[i]).join(''));
    }
  };

  const handlePointerUp = () => {
    if (currentPath.length > 0) {
      const word = tempWord;
      console.log(`🧱 Bırakılan kelime: "${word}"`);
      console.log('Hedef kelimeler:', targetWords);
      if (targetWords.includes(word) && !foundWords.has(word)) {
        const newFound = new Set(foundWords);
        newFound.add(word);
        setFoundWords(newFound);
        console.log(`✅ Doğru kelime bulundu: "${word}" (${newFound.size}/${targetWords.length})`);

        if (newFound.size === targetWords.length) {
          console.log('🎉 Tüm kelimeler bulundu, bölüm kazanıldı!');
          setTimeout(onWin, 1000);
        }
      } else {
        console.log('❌ Geçersiz kelime veya zaten bulunmuştu.');
      }
    }
    setCurrentPath([]);
    setTempWord('');
  };

  // ----------------------------------------------------------------------
  // RENDER HELPERS
  // ----------------------------------------------------------------------

  const renderWheel = () => {
    const n = letters.length;
    return letters.map((l, i) => {
      const { x, y } = getLetterCoords(i, n);
      const isSelected = currentPath.includes(i);
      return (
        <div
          key={i}
          className={`absolute w-12 h-12 sm:w-14 sm:h-14 -ml-6 -mt-6 sm:-ml-7 sm:-mt-7 rounded-full flex items-center justify-center font-bold text-xl sm:text-2xl shadow-lg transition-all duration-200 select-none pointer-events-none z-10
                    ${isSelected ? 'bg-pink-600 text-white scale-110' : 'bg-white text-slate-800'}`}
          style={{ left: `${x}%`, top: `${y}%` }}
        >
          {l}
        </div>
      );
    });
  };

  const renderLines = () => {
    if (currentPath.length < 2) return null;
    const points = currentPath.map(i => {
      const { x, y } = getLetterCoords(i, letters.length);
      return `${x},${y}`;
    }).join(' ');
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline points={points} fill="none" stroke="#db2777" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      </svg>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 relative overflow-hidden select-none touch-none">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-pink-600 text-white shadow-md z-20 shrink-0">
        <button onClick={onBack} className="p-1 hover:bg-pink-700 rounded transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div className="text-center">
          <h1 className="font-bold text-lg">Bölüm {currentLevel.id}</h1>
          <p className="text-xs text-pink-100 opacity-90">{foundWords.size} / {targetWords.length} Kelime</p>
        </div>
        <div className="w-8"></div>
      </header>

      {/* CROSSWORD GRID AREA (Flexible) */}
      <div
        ref={gridContainerRef}
        className="flex-1 overflow-hidden relative bg-slate-100 flex items-center justify-center p-2"
      >
        <div
          className="relative transition-transform duration-500 ease-out origin-center"
          style={{
            width: `${gridCols * cellSize}px`,
            height: `${gridRows * cellSize}px`,
            transform: `scale(${gridScale})`
          }}
        >
          {/* Render Grid Cells */}
          {Array.from(gridMap.entries()).map(([key, data]) => {
            const [r, c] = key.split(',').map(Number);
            const relR = r - minR;
            const relC = c - minC;
            const isRevealed = data.words.some(w => foundWords.has(w));

            return (
              <div
                key={key}
                className={`absolute w-10 h-10 rounded-md border flex items-center justify-center font-bold text-xl transition-all duration-500 shadow-sm
                            ${isRevealed
                    ? 'bg-pink-500 border-pink-600 text-white scale-100'
                    : 'bg-white border-slate-300 text-transparent'}`}
                style={{
                  top: `${relR * cellSize}px`,
                  left: `${relC * cellSize}px`
                }}
              >
                {data.char}
              </div>
            );
          })}
        </div>
      </div>

      {/* ACTIVE WORD PREVIEW */}
      <div className="h-12 shrink-0 flex items-center justify-center bg-white/50 backdrop-blur border-t border-slate-200">
        <span className="text-3xl font-black text-pink-600 tracking-widest uppercase drop-shadow-sm h-8 flex items-center">
          {tempWord || " "}
        </span>
      </div>

      {/* WHEEL AREA (Responsive) */}
      <div className="relative w-full bg-slate-100 pb-6 pt-2 shrink-0 flex justify-center items-center">
        {/* Wheel Container: Scales with height for landscape compatibility */}
        <div className="w-64 h-64 sm:w-80 sm:h-80 max-h-[40vh] max-w-[40vh] aspect-square relative">
          <div
            ref={wheelRef}
            className="absolute inset-2 rounded-full bg-white shadow-xl border-4 border-pink-50 touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {renderLines()}
            {renderWheel()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectGame;