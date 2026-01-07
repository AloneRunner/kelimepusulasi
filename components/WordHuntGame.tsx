import React, { useState, useEffect, useRef } from 'react';
import { Category } from '../types';

interface WordHuntGameProps {
  category: Category;
  onWin: () => void;
  onBack: () => void;
  coins: number;
  onSpendCoins: (amount: number) => boolean;
  knownWordsCount: number;
}

const GRID_SIZE = 9; // 9x9 Grid
const ALPHABET = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ";

interface Cell {
  letter: string;
  row: number;
  col: number;
  highlighted: boolean; // Permanently found
  selected: boolean;    // Currently being dragged
}

interface WordLocation {
  word: string;
  indices: number[]; // Flattened indices
}

const WordHuntGame: React.FC<WordHuntGameProps> = ({ category, onWin, onBack, coins, onSpendCoins, knownWordsCount }) => {
  const [grid, setGrid] = useState<Cell[]>([]);
  const [targetWords, setTargetWords] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectingIndices, setSelectingIndices] = useState<number[]>([]);

  const gridRef = useRef<HTMLDivElement>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  // Initialize Game
  useEffect(() => {
    startNewGame();
  }, [category]);

  const startNewGame = () => {
    // 1. Pick random words based on Level
    // Fixed word count for all levels
    const wordCount = 6;

    const validWords = category.words.filter(w => w.length <= GRID_SIZE && w.length > 2);
    const shuffled = [...validWords].sort(() => 0.5 - Math.random());
    const selectedWords = shuffled.slice(0, wordCount).map(w => w.toLocaleUpperCase('tr-TR'));

    console.log('🔍 KELIME AVI OYUNU - HATA AYIKLAMA');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Kategori: ${category.label}`);
    console.log(`Geçerli Kelime Sayısı: ${validWords.length}`);
    console.log(`Seçilen Kelimeler:`, selectedWords);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    setTargetWords(selectedWords);
    setFoundWords([]);

    // 2. Generate Grid
    const newGrid = Array(GRID_SIZE * GRID_SIZE).fill(null).map((_, i) => ({
      letter: '',
      row: Math.floor(i / GRID_SIZE),
      col: i % GRID_SIZE,
      highlighted: false,
      selected: false
    }));

    // 3. Place Words
    const placedLocations: WordLocation[] = [];

    for (const word of selectedWords) {
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 100) {
        attempts++;
        const direction = Math.floor(Math.random() * 3); // 0: Hor, 1: Ver, 2: Diag
        const row = Math.floor(Math.random() * GRID_SIZE);
        const col = Math.floor(Math.random() * GRID_SIZE);

        let canPlace = true;
        const tempIndices: number[] = [];

        for (let i = 0; i < word.length; i++) {
          let r = row;
          let c = col;

          if (direction === 0) c += i; // Horizontal
          else if (direction === 1) r += i; // Vertical
          else { r += i; c += i; } // Diagonal

          if (r >= GRID_SIZE || c >= GRID_SIZE || (newGrid[r * GRID_SIZE + c].letter !== '' && newGrid[r * GRID_SIZE + c].letter !== word[i])) {
            canPlace = false;
            break;
          }
          tempIndices.push(r * GRID_SIZE + c);
        }

        if (canPlace) {
          tempIndices.forEach((idx, i) => {
            newGrid[idx].letter = word[i];
          });
          placed = true;
          placedLocations.push({ word, indices: tempIndices });
        }
      }
    }

    // 4. Fill Empty Spaces
    for (let i = 0; i < newGrid.length; i++) {
      if (newGrid[i].letter === '') {
        newGrid[i].letter = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      }
    }

    setGrid(newGrid);
  };

  // Selection Logic
  const getCellIndexFromPoint = (x: number, y: number) => {
    if (!gridRef.current) return -1;
    const rect = gridRef.current.getBoundingClientRect();
    // Check if outside grid
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) return -1;

    const cellSize = rect.width / GRID_SIZE;
    const col = Math.floor((x - rect.left) / cellSize);
    const row = Math.floor((y - rect.top) / cellSize);

    return row * GRID_SIZE + col;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault(); // Prevent scrolling
    setIsSelecting(true);
    const idx = getCellIndexFromPoint(e.clientX, e.clientY);
    if (idx !== -1) {
      setSelectingIndices([idx]);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isSelecting) return;
    e.preventDefault();

    const currentIdx = getCellIndexFromPoint(e.clientX, e.clientY);
    if (currentIdx === -1) return;

    const startIdx = selectingIndices[0];
    if (startIdx === undefined) return;

    // Logic to ensure straight lines (horizontal, vertical, diagonal)
    const startRow = Math.floor(startIdx / GRID_SIZE);
    const startCol = startIdx % GRID_SIZE;
    const currRow = Math.floor(currentIdx / GRID_SIZE);
    const currCol = currentIdx % GRID_SIZE;

    const rowDiff = currRow - startRow;
    const colDiff = currCol - startCol;

    // Check if valid line
    let isValid = false;
    if (rowDiff === 0) isValid = true; // Horizontal
    else if (colDiff === 0) isValid = true; // Vertical
    else if (Math.abs(rowDiff) === Math.abs(colDiff)) isValid = true; // Diagonal

    if (isValid) {
      // Generate all indices between start and current
      const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
      const newSelection: number[] = [];
      const rStep = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff);
      const cStep = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff);

      for (let i = 0; i <= steps; i++) {
        const r = startRow + (i * rStep);
        const c = startCol + (i * cStep);
        newSelection.push(r * GRID_SIZE + c);
      }
      setSelectingIndices(newSelection);
    }
  };

  const handleHintSpot = () => {
    // 40 Coins: Highlight first letter of a random unfound word
    const unfoundWords = targetWords.filter(w => !foundWords.includes(w));
    if (unfoundWords.length === 0) return;

    if (!onSpendCoins(40)) return;

    // Pick random word
    const word = unfoundWords[Math.floor(Math.random() * unfoundWords.length)];
    // Find its location in placedLocations (we need to store this in state or recount)
    // Recalculating efficiently:
    // Actually we don't store placedLocations in state, let's fix that or re-find.
    // Easier way: scan grid to find the word start.

    // Better strategy: Store placedLocations in state to make this easy.
    // But for now, let's just cheat and scan the grid for the first letter that starts a valid word direction.
    // ... Or let's refactor startNewGame to store locations.
    // To minimize refactor, I'll search grid for the word.

    // ... Wait, let's just implement a visual hint that shakes the screen or something? 
    // No, let's do highlighting.

    // To do this simply without major refactor:
    // Just find the word on the grid.
    findAndHighlightWordStart(word);
  };

  const findAndHighlightWordStart = (word: string) => {
    // Brute force find word (fast enough for 9x9)
    // Check all cells matching first letter
    for (let i = 0; i < grid.length; i++) {
      if (grid[i].letter === word[0]) {
        // Check 8 directions
        const r = Math.floor(i / GRID_SIZE);
        const c = i % GRID_SIZE;
        // ... Check logic omitted for brevity, let's assuming we find it.
        // Actually, since we generated it, we know it's there.
        // Let's assume the first match that works is the one (collision unlikely to be perfect duplicate valid word)
        if (checkWordAt(r, c, word)) {
          // Found it! Highlight index i
          // Temporarily highlight or permanent? Let's blink it.
          highlightCellTemporary(i);
          return;
        }
      }
    }
  };

  const checkWordAt = (r: number, c: number, word: string) => {
    const dirs = [
      [0, 1], [1, 0], [1, 1],   // Hor, Ver, Diag
      [0, -1], [-1, 0], [-1, -1], // Reverse? (Game logic supported reverse?)
      [1, -1], [-1, 1]
    ];
    // Current game logic only placed Horizontal(0), Vertical(1), Diagonal(2).
    // So checking those 3 is enough for current generator, 
    // BUT handlePointerUp logic supports REVERSE check: `w === reversedWord`.
    // So the user can drag backwards. The generator only places forwards.

    // We only need to find where it is placed.
    for (const [dr, dc] of [[0, 1], [1, 0], [1, 1]]) {
      let match = true;
      for (let k = 0; k < word.length; k++) {
        const nr = r + k * dr;
        const nc = c + k * dc;
        if (nr >= GRID_SIZE || nc >= GRID_SIZE || grid[nr * GRID_SIZE + nc].letter !== word[k]) {
          match = false;
          break;
        }
      }
      if (match) return true;
    }
    return false;
  };

  const highlightCellTemporary = (idx: number) => {
    const el = gridRef.current?.children[idx] as HTMLElement;
    if (el) {
      el.classList.add('animate-ping');
      setTimeout(() => el.classList.remove('animate-ping'), 2000);
    }
  };

  const handleHintReveal = () => {
    // 100 Coins: Instantly find a word
    const unfoundWords = targetWords.filter(w => !foundWords.includes(w));
    if (unfoundWords.length === 0) return;

    if (!onSpendCoins(100)) return;

    const word = unfoundWords[Math.floor(Math.random() * unfoundWords.length)];

    // Find it on grid to highlight
    // We reuse logic but we need the INDICES to mark as found.
    const indices = findWordIndices(word);
    if (indices) {
      setFoundWords(prev => [...prev, word]);
      setGrid(prev => prev.map((cell, idx) =>
        indices.includes(idx) ? { ...cell, highlighted: true } : cell
      ));
      if (foundWords.length + 1 === targetWords.length) {
        setTimeout(onWin, 500);
      }
    }
  };

  const findWordIndices = (word: string): number[] | null => {
    for (let i = 0; i < grid.length; i++) {
      if (grid[i].letter === word[0]) {
        const r = Math.floor(i / GRID_SIZE);
        const c = i % GRID_SIZE;
        // Check 3 placement directions
        for (const [dr, dc] of [[0, 1], [1, 0], [1, 1]]) {
          const indices: number[] = [];
          let match = true;
          for (let k = 0; k < word.length; k++) {
            const nr = r + k * dr;
            const nc = c + k * dc;
            if (nr >= GRID_SIZE || nc >= GRID_SIZE || grid[nr * GRID_SIZE + nc].letter !== word[k]) {
              match = false;
              break;
            }
            indices.push(nr * GRID_SIZE + nc);
          }
          if (match) return indices;
        }
      }
    }
    return null;
  };

  const handlePointerUp = () => {
    setIsSelecting(false);

    // Check if word found
    if (selectingIndices.length > 0) {
      const selectedWord = selectingIndices.map(idx => grid[idx].letter).join('');
      const reversedWord = selectedWord.split('').reverse().join('');

      const found = targetWords.find(w => !foundWords.includes(w) && (w === selectedWord || w === reversedWord));

      console.log(`📝 Seçilen: "${selectedWord}" | Ters: "${reversedWord}"`);
      console.log(`Bulundu mu?: ${found ? '✅ EVET - ' + found : '❌ HAYIR'}`);
      console.log(`Bulunan Kelimeler (${foundWords.length}/${targetWords.length}):`, [...foundWords, ...(found ? [found] : [])]);

      if (found) {
        setFoundWords(prev => [...prev, found]);
        // Mark grid permanently
        setGrid(prev => prev.map((cell, idx) =>
          selectingIndices.includes(idx) ? { ...cell, highlighted: true } : cell
        ));

        // Check win condition
        if (foundWords.length + 1 === targetWords.length) {
          console.log('🎉 KAZANDI! Tüm kelimeler bulundu!');
          setTimeout(onWin, 500);
        }
      }
    }
    setSelectingIndices([]);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden select-none touch-none">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-teal-600 text-white shadow-md z-20">
        <button onClick={onBack} className="p-1 hover:bg-teal-700 rounded transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div className="text-center">
          <h1 className="font-bold text-lg">{category.label}</h1>
          <p className="text-xs text-teal-100 opacity-80">
            {foundWords.length} / {targetWords.length} Bulundu • {knownWordsCount} Kelime 📖
          </p>
        </div>
        <div className="w-20 flex justify-end gap-2">
          {/* Spot Hint (40) */}
          <button
            onClick={handleHintSpot}
            disabled={coins < 40}
            className={`p-2 rounded-full shadow-lg ${coins < 40 ? 'bg-slate-300 text-slate-500' : 'bg-yellow-400 text-teal-900 active:scale-95'}`}
          >
            <div className="flex flex-col items-center leading-none">
              <span className="text-lg">🔍</span>
              <span className="text-[9px] font-bold">40</span>
            </div>
          </button>

          {/* Reveal Hint (100) */}
          <button
            onClick={handleHintReveal}
            disabled={coins < 100}
            className={`p-2 rounded-full shadow-lg ${coins < 100 ? 'bg-slate-300 text-slate-500' : 'bg-purple-500 text-white active:scale-95'}`}
          >
            <div className="flex flex-col items-center leading-none">
              <span className="text-lg">✨</span>
              <span className="text-[9px] font-bold">100</span>
            </div>
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Words to Find */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {targetWords.map((word, idx) => (
            <span
              key={idx}
              className={`px-3 py-1 rounded-full text-sm font-bold transition-all duration-500 ${foundWords.includes(word) ? 'bg-teal-200 text-teal-800 line-through opacity-50' : 'bg-white text-slate-700 shadow-sm border border-slate-200'}`}
            >
              {word}
            </span>
          ))}
        </div>

        {/* THE GRID */}
        <div
          ref={gridRef}
          className="touch-none bg-white p-2 rounded-xl shadow-xl border-4 border-teal-100"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gap: '2px',
            width: 'min(90vw, 400px)',
            height: 'min(90vw, 55vh, 400px)'
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp} // Safety cancel
        >
          {grid.map((cell, idx) => {
            const isSelected = selectingIndices.includes(idx);
            const isFound = cell.highlighted;

            let bgClass = "bg-slate-50 text-slate-700";
            if (isFound) bgClass = "bg-teal-500 text-white animate-pulse-slow";
            if (isSelected) bgClass = "bg-teal-400 text-white scale-95";

            return (
              <div
                key={idx}
                className={`flex items-center justify-center font-bold text-lg sm:text-2xl rounded-md transition-colors select-none ${bgClass}`}
              >
                {cell.letter}
              </div>
            )
          })}
        </div>

        <p className="text-slate-400 text-xs mt-6 text-center animate-pulse">
          Kelimeyi seçmek için parmağını sürükle
        </p>

      </div>
    </div>
  );
};

export default WordHuntGame;