import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Category } from '../types';
import { WORD_FACTS } from '../data/wordFacts';
import { playSound } from '../services/audioService';
import { motion, AnimatePresence } from 'framer-motion';

interface ConnectGameProps {
  category: Category;
  onWin: () => void;
  onBack: () => void;
  coins: number;
  onSpendCoins: (amount: number) => boolean;
  knownWordsCount: number;
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
  bonusWords?: string[]; // Extra valid words that don't fit in the grid
}

// Özenle hazırlanmış, kesişen kelimelerden oluşan bölümler
const LEVELS: Level[] = [
  {
    id: 1,
    letters: ["O", "K", "U", "L"],
    words: [
      { word: "OKUL", row: 1, col: 0, dir: "H" },
      { word: "KOL", row: 1, col: 1, dir: "V" }, // Uses O from OKUL (col 0? No, wait grid map logic)
      // Logic check: OKUL is at 1,0. O(1,0), K(1,1), U(1,2), L(1,3)
      // KOL at 1,1 Vertical? K(1,1), O(2,1), L(3,1). 
      // Does 'K' match? Yes.
    ]
  },
  {
    id: 2,
    letters: ["M", "A", "S", "A"], // Fixed: Added second 'A' for MASA
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
    ],
    bonusWords: ["OK", "KUL", "OLUK"]
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
    letters: ["S", "U", "Y"], // SUY ? SU (1,0 H), US (0,1 V -> U,S covers 0,1 &1,1).
    // SU -> S(1,0), U(1,1)
    // US -> U(0,1), S(1,1). Overlap at S? US ends at S. SU ends at U.
    // Overlap is (1,1). SU's U is (1,1). US's S is (1,1). match.
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

const ConnectGame: React.FC<ConnectGameProps> = ({ category, onWin, onBack, coins, onSpendCoins, knownWordsCount }) => {
  // Game State
  const [levelIndex, setLevelIndex] = useState(Math.floor(Math.random() * LEVELS.length));
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [foundBonusWords, setFoundBonusWords] = useState<Set<string>>(new Set());
  const [gridScale, setGridScale] = useState(1);
  const [activeHint, setActiveHint] = useState<{ word: string, fact: string } | null>(null);
  const [revealedCells, setRevealedCells] = useState<Set<string>>(new Set());
  const [hintLoading, setHintLoading] = useState(false);

  // Interaction State
  const [currentPath, setCurrentPath] = useState<number[]>([]); // Array of indices from 'letters'
  const [tempWord, setTempWord] = useState('');

  // Visuals
  const [particles, setParticles] = useState<{ id: number, x: number, y: number }[]>([]);

  const wheelRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const idx = Math.floor(Math.random() * LEVELS.length);
    setLevelIndex(idx);
    setFoundWords(new Set());
    setFoundBonusWords(new Set());
    setRevealedCells(new Set());
    setCurrentPath([]);
    setTempWord('');
    setActiveHint(null);
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
    if (gridMap.size === 0) return { minR: 0, maxR: 0, minC: 0, maxC: 0 };
    Array.from(gridMap.keys()).forEach((k) => {
      const parts = (k as string).split(',');
      const r = Number(parts[0]);
      const c = Number(parts[1]);
      if (r < minR) minR = r;
      if (r > maxR) maxR = r;
      if (c < minC) minC = c;
      if (c > maxC) maxC = c;
    });
    return { minR, maxR, minC, maxC };
  }, [gridMap]);

  const gridRows = maxR - minR + 1;
  const gridCols = maxC - minC + 1;
  const cellSize = 50; // Larger cell size

  // Responsive Grid Scaling
  useEffect(() => {
    const handleResize = () => {
      if (gridContainerRef.current) {
        const { clientWidth, clientHeight } = gridContainerRef.current;
        const neededWidth = gridCols * cellSize + 20;
        const neededHeight = gridRows * cellSize + 20;

        // Scale to fit, but max 1.0
        const scale = Math.min(1, Math.min(clientWidth / neededWidth, clientHeight / neededHeight));
        setGridScale(scale);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [gridCols, gridRows, levelIndex]);

  // ----------------------------------------------------------------------
  // HINTS
  // ----------------------------------------------------------------------

  const handleFactHint = () => {
    if (hintLoading) return;
    const unfoundWords = targetWords.filter(w => !foundWords.has(w));
    if (unfoundWords.length === 0) return;
    if (!onSpendCoins(100)) return;

    playSound('pop');
    setHintLoading(true);
    const randomWord = unfoundWords[Math.floor(Math.random() * unfoundWords.length)];
    try {
      const facts = WORD_FACTS[randomWord.toLocaleLowerCase('tr-TR')];
      let fact = "Bu kelime hakkında bilgi bulunmamaktadır.";
      if (facts && facts.length > 0) {
        fact = facts[Math.floor(Math.random() * facts.length)];
      }
      setActiveHint({ word: randomWord, fact });
    } catch { } finally { setHintLoading(false); }
  };

  const handleLetterHint = () => {
    if (hintLoading) return;
    const candidates: string[] = [];
    gridMap.forEach((data, key) => {
      if (!revealedCells.has(key) && !data.words.some(w => foundWords.has(w))) {
        candidates.push(key);
      }
    });

    if (candidates.length === 0) return;
    if (!onSpendCoins(40)) return;

    playSound('pop');
    const randomKey = candidates[Math.floor(Math.random() * candidates.length)];
    setRevealedCells(prev => new Set(prev).add(randomKey));
  };

  // ----------------------------------------------------------------------
  // WHEEL INTERACTION
  // ----------------------------------------------------------------------

  const letters = currentLevel.letters;

  const getLetterCoords = (index: number, total: number) => {
    const angle = (index * (360 / total) - 90) * (Math.PI / 180);
    const radius = 38; // Radius percentage
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
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
      if (dist < 15) return i;
    }
    return -1;
  };

  // Particle Effect
  const emitParticle = (x: number, y: number) => {
    const id = Date.now();
    setParticles(prev => [...prev, { id, x, y }]);
    setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 800);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const idx = getIndexFromPoint(e.clientX, e.clientY);
    if (idx !== -1) {
      playSound('click');
      setCurrentPath([idx]);
      setTempWord(letters[idx]);
      emitParticle(e.clientX, e.clientY);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (currentPath.length === 0) return;
    e.preventDefault();
    const idx = getIndexFromPoint(e.clientX, e.clientY);
    if (idx !== -1 && !currentPath.includes(idx)) {
      playSound('pop');
      setCurrentPath(prev => [...prev, idx]);
      setTempWord(prev => prev + letters[idx]);
      emitParticle(e.clientX, e.clientY);
    }
  };

  const handlePointerUp = () => {
    if (currentPath.length > 0) {
      const word = tempWord;
      const currentBonusWords = currentLevel.bonusWords || [];

      // Check for Main Target Words
      if (targetWords.includes(word) && !foundWords.has(word)) {
        setFoundWords(prev => new Set(prev).add(word));
        playSound('correct');

        // Win Check
        if (foundWords.size + 1 === targetWords.length) {
          playSound('win');
          setTimeout(onWin, 1500);
        }
      }
      // Check for Bonus Words
      else if (currentBonusWords.includes(word)) {
        if (!foundBonusWords.has(word)) {
          setFoundBonusWords(prev => new Set(prev).add(word));
          playSound('pop');
          // Bonus Feedback (Toast could be added here, for now using console/visuals)
          // We can reuse the tempWord preview to show "BONUS!" momentarily or similar
        } else {
          playSound('wrong'); // Already found
        }
      }
      else if (!foundWords.has(word)) {
        playSound('wrong');
        // Shake effect could go here
      }
    }
    setCurrentPath([]);
    setTempWord('');
  };

  const renderConnectionLine = () => {
    if (currentPath.length < 2) return null;
    const points = currentPath.map(i => {
      const { x, y } = getLetterCoords(i, letters.length);
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke="#ec4899"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="1"
        />
      </svg>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 relative overflow-hidden select-none touch-none font-sans">

      {/* Backgrounds */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 text-white" />

      {/* Dynamic Bubbles/Orbs (Simple CSS animation) */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-pink-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-40 -right-20 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl" />

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between p-4 bg-white/5 backdrop-blur-md border-b border-white/10 shadow-lg">
        <button onClick={onBack} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition active:scale-95">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>

        <div className="flex flex-col items-center">
          <h1 className="text-lg font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 drop-shadow-sm">
            {knownWordsCount} Kelime 📖
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${(foundWords.size / targetWords.length) * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-400">{foundWords.size}/{targetWords.length}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleLetterHint}
            disabled={coins < 40}
            className={`relative w-10 h-10 rounded-xl flex flex-col items-center justify-center transition active:scale-95 border border-white/10
                    ${coins < 40 ? 'bg-slate-800/50 opacity-50 grayscale' : 'bg-gradient-to-b from-violet-600 to-violet-800 shadow-lg shadow-violet-500/30'}`}
          >
            <div className="text-sm font-black text-white">A</div>
            <div className="text-[9px] font-bold text-violet-200">40</div>
          </button>
          <button
            onClick={handleFactHint}
            disabled={coins < 100}
            className={`relative w-10 h-10 rounded-xl flex flex-col items-center justify-center transition active:scale-95 border border-white/10
                    ${coins < 100 ? 'bg-slate-800/50 opacity-50 grayscale' : 'bg-gradient-to-b from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30'}`}
          >
            <div className="text-sm font-black text-white">?</div>
            <div className="text-[9px] font-bold text-amber-100">100</div>
          </button>
        </div>
      </header>

      {/* Game Area */}
      <div className="flex-1 relative z-10 flex flex-col">

        {/* Grid Section */}
        <div ref={gridContainerRef} className="flex-1 flex items-center justify-center p-6 overflow-hidden">
          <motion.div
            animate={{ scale: gridScale }}
            transition={{ type: 'spring', damping: 20 }}
            style={{ width: (gridCols * cellSize), height: (gridRows * cellSize) }}
            className="relative"
          >
            {Array.from(gridMap.entries()).map(([key, data]) => {
              const [r, c] = key.split(',').map(Number);
              const isFound = data.words.some(w => foundWords.has(w));
              const isRevealed = revealedCells.has(key);

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    backgroundColor: isFound ? '#db2777' : (isRevealed ? '#fbcfe8' : 'rgba(255,255,255,0.1)'),
                    borderColor: isFound ? '#be185d' : 'rgba(255,255,255,0.15)',
                  }}
                  transition={{ duration: 0.4, delay: (r + c) * 0.05 }}
                  className={`absolute rounded-md border-2 flex items-center justify-center text-xl font-bold
                                  ${isFound ? 'text-white shadow-[0_0_15px_rgba(219,39,119,0.5)] z-10' :
                      (isRevealed ? 'text-pink-600' : 'text-transparent')}
                              `}
                  style={{
                    width: cellSize - 6,
                    height: cellSize - 6,
                    top: (r - minR) * cellSize + 3,
                    left: (c - minC) * cellSize + 3
                  }}
                >
                  <AnimatePresence>
                    {(isFound || isRevealed) && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="drop-shadow-sm"
                      >
                        {data.char}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Word Preview & Status */}
        <div className="h-14 flex items-center justify-center shrink-0 mb-2 px-4">
          <AnimatePresence mode='wait'>
            <motion.div
              key={tempWord || 'status'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`px-6 py-2 rounded-2xl border shadow-xl backdrop-blur-md
                            ${foundBonusWords.has(tempWord)
                  ? 'bg-amber-500/20 border-amber-500/50' // Bonus Word Style
                  : 'bg-white/10 border-white/20'}
                        `}
            >
              <h2 className={`text-2xl font-black tracking-[0.3em] drop-shadow-md min-h-[32px]
                             ${foundBonusWords.has(tempWord) ? 'text-amber-400' : 'text-white'}
                         `}>
                {tempWord || <span className="opacity-0">.</span>}
                {foundBonusWords.has(tempWord) && <span className="block text-[10px] tracking-normal opacity-80 uppercase text-center -mt-1 text-amber-200">Bonus Kelime</span>}
              </h2>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Wheel Section */}
        <div className="relative h-[320px] shrink-0 flex items-center justify-center pb-8">
          <div
            ref={wheelRef}
            className="w-72 h-72 relative rounded-full bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-2xl touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {renderConnectionLine()}

            {letters.map((l, i) => {
              const { x, y } = getLetterCoords(i, letters.length);
              const isSelected = currentPath.includes(i);

              return (
                <motion.div
                  key={i}
                  animate={{
                    scale: isSelected ? 1.25 : 1,
                    backgroundColor: isSelected ? '#ec4899' : '#ffffff',
                  }}
                  className={`absolute w-14 h-14 -ml-7 -mt-7 rounded-full flex items-center justify-center shadow-lg
                                    cursor-pointer select-none z-10 font-bold text-2xl transition-colors duration-200
                                    ${isSelected ? 'text-white' : 'text-slate-800'}
                                `}
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  {l}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, scale: 1, x: p.x, y: p.y }}
          animate={{ opacity: 0, scale: 0, x: p.x + (Math.random() * 60 - 30), y: p.y + (Math.random() * 60 - 30) }}
          transition={{ duration: 0.5 }}
          className="fixed w-3 h-3 bg-pink-400 rounded-full z-50 pointer-events-none shadow-[0_0_10px_#ec4899]"
        />
      ))}

      {/* Hint Modal */}
      <AnimatePresence>
        {activeHint && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-white/10 p-6 rounded-3xl shadow-2xl max-w-sm w-full text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
                <span className="text-3xl">💡</span>
              </div>
              <h3 className="text-amber-400 font-bold text-xl mb-2 tracking-wide uppercase">İpucu</h3>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 mb-6">
                <p className="text-slate-300 text-lg leading-relaxed italic">
                  "{activeHint.fact}"
                </p>
              </div>
              <button
                onClick={() => setActiveHint(null)}
                className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl hover:opacity-90 transition shadow-lg shadow-pink-500/25"
              >
                Tamamdır, Buldum!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ConnectGame;