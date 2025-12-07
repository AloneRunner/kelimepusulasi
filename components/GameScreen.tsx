
import React, { useState, useEffect, useRef } from 'react';
import { Category, GuessResult } from '../types';
import { playSound } from '../services/audioService';

interface GameScreenProps {
  category: Category;
  secretWord: string;
  onWin: (word: string, guessCount: number, bonusCoins: number) => void;
  onBack: () => void;
  coins: number;
  onSpendCoins: (amount: number) => boolean;
}

const GameScreen: React.FC<GameScreenProps> = ({ category, secretWord, onWin, onBack, coins, onSpendCoins }) => {
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Hint State
  const [hintText, setHintText] = useState<string | null>(null);
  const [revealedCharCount, setRevealedCharCount] = useState(0);
  const [isHintCoolingDown, setIsHintCoolingDown] = useState(false);

  // Timer State
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listEndRef = useRef<HTMLDivElement>(null);

  const totalWords = category.words.length;
  const maxIndex = totalWords - 1;
  const secretIndex = category.words.indexOf(secretWord);

  // Range calculation
  const minGuess = guesses.filter(g => g.distance > 0).reduce((prev, curr) => prev.distance < curr.distance ? prev : curr, { word: category.words[0], distance: secretIndex } as GuessResult);
  const maxGuess = guesses.filter(g => g.distance < 0).reduce((prev, curr) => prev.distance > curr.distance ? prev : curr, { word: category.words[maxIndex], distance: secretIndex - maxIndex } as GuessResult);

  const rangeStart = minGuess === undefined || guesses.length === 0 ? category.words[0] : (guesses.some(g => g.distance > 0) ? guesses.filter(g => g.distance > 0).sort((a,b) => a.distance - b.distance)[0].word : category.words[0]);
  const rangeEnd = maxGuess === undefined || guesses.length === 0 ? category.words[maxIndex] : (guesses.some(g => g.distance < 0) ? guesses.filter(g => g.distance < 0).sort((a,b) => b.distance - a.distance)[0].word : category.words[maxIndex]);


  // Initial focus & Timer Start
  useEffect(() => {
    inputRef.current?.focus();
    timerRef.current = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
    }, 1000);

    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Scroll to new guesses
  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [guesses]);

  // Filter autocomplete
  useEffect(() => {
    if (inputValue.length > 0) {
      const filtered = category.words.filter(w => 
        w.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 5)); // Limit to 5
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [inputValue, category.words]);

  const formatTime = (secs: number) => {
      const m = Math.floor(secs / 60).toString().padStart(2, '0');
      const s = (secs % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
  };

  const handleGuess = (word: string) => {
    const cleanWord = word.toLocaleLowerCase('tr-TR').trim();
    
    // Check if valid word in list
    let guessIndex = category.words.indexOf(cleanWord);

    if (guessIndex === -1) {
      playSound('wrong');
      alert("Lütfen listede olan bir kelime seçiniz.");
      return;
    }

    if (guesses.some(g => g.word === cleanWord)) {
      setInputValue('');
      setShowSuggestions(false);
      return; // Already guessed
    }

    playSound('pop');
    const distance = secretIndex - guessIndex;
    
    const newGuess: GuessResult = {
      word: cleanWord,
      distance: distance,
      timestamp: Date.now()
    };

    const newGuessesList = [...guesses, newGuess];
    setGuesses(newGuessesList);
    setInputValue('');
    setShowSuggestions(false);

    if (distance === 0) {
      // Calculate Score
      if (timerRef.current) clearInterval(timerRef.current);
      
      let bonus = 0;
      // Time Bonus
      if (secondsElapsed < 30) bonus += 30;       // Super Fast
      else if (secondsElapsed < 60) bonus += 15;  // Fast
      else if (secondsElapsed < 120) bonus += 5;  // Normal

      // Guess Bonus
      if (newGuessesList.length <= 5) bonus += 20; // Sniper
      else if (newGuessesList.length <= 10) bonus += 10;

      onWin(cleanWord, newGuessesList.length, bonus);
    }
    
    inputRef.current?.focus();
  };

  const requestHint = () => {
    // 1. Check if already fully revealed
    if (revealedCharCount >= secretWord.length) return;

    // 2. Check cooldown (Spam protection)
    if (isHintCoolingDown) return;

    // 3. Check coins
    if (onSpendCoins(50)) {
        playSound('win');
        
        const nextCount = revealedCharCount + 1;
        setRevealedCharCount(nextCount);
        
        const revealStr = secretWord.substring(0, nextCount).toLocaleUpperCase('tr-TR');
        // Mask the rest
        const mask = Array(secretWord.length - nextCount).fill('_').join(' ');
        
        setHintText(`${revealStr} ${mask}`);

        // Start cooldown
        setIsHintCoolingDown(true);
        setTimeout(() => setIsHintCoolingDown(false), 1000); 
    } else {
        alert("Yetersiz bakiye! (50 Coin gerekir)");
    }
  };

  // Helper to determine color based on distance
  const getDistanceColor = (dist: number) => {
    const absDist = Math.abs(dist);
    if (absDist === 0) return 'bg-green-500 text-white border-green-600';
    if (absDist <= 5) return 'bg-red-500 text-white border-red-600'; // Very Hot
    if (absDist <= 15) return 'bg-orange-400 text-white border-orange-500'; // Hot
    if (absDist <= 30) return 'bg-yellow-100 text-yellow-800 border-yellow-300'; // Warm
    return 'bg-blue-100 text-blue-800 border-blue-200'; // Cold
  };

  const getDirectionText = (dist: number) => {
    if (dist === 0) return 'BULDUN!';
    if (dist > 0) return `${Math.abs(dist)} Aşağı ↓`;
    return `${Math.abs(dist)} Yukarı ↑`;
  };

  return (
    <div className="flex flex-col h-full max-w-md mx-auto relative bg-white shadow-xl">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-indigo-600 text-white shadow-md z-20">
        <button onClick={onBack} className="p-1 hover:bg-indigo-700 rounded transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div className="text-center">
          <h1 className="font-bold text-lg">{category.label}</h1>
          <div className="flex items-center justify-center gap-3 text-xs text-indigo-200 opacity-90 font-mono">
             <span>{coins} 🪙</span>
             <span className="bg-indigo-700 px-1.5 rounded">{formatTime(secondsElapsed)}</span>
          </div>
        </div>
        <button 
          onClick={requestHint} 
          disabled={revealedCharCount >= secretWord.length || isHintCoolingDown}
          className={`p-2 rounded-full transition flex flex-col items-center justify-center w-10 h-10 shadow-md active:scale-95
             ${(revealedCharCount >= secretWord.length || isHintCoolingDown) ? 'bg-indigo-800 opacity-50 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-300 text-indigo-900'}`}
        >
           <span className="font-bold text-lg leading-none">?</span>
           <span className="text-[9px] font-bold leading-none mt-0.5">50</span>
        </button>
      </header>

      {/* Range Info & Hint Area */}
      <div className="bg-slate-50 border-b border-slate-200">
          {/* Active Range Visualization */}
          {guesses.length > 0 && (
             <div className="px-4 py-2 flex justify-between items-center text-xs font-mono text-slate-500 border-b border-slate-100">
                <div className="truncate max-w-[40%] text-left">
                    Min: <span className="font-bold text-indigo-600">{rangeStart}</span>
                </div>
                <div className="h-1 flex-1 mx-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-400 w-1/2 mx-auto rounded-full opacity-50"></div>
                </div>
                <div className="truncate max-w-[40%] text-right">
                    Max: <span className="font-bold text-indigo-600">{rangeEnd}</span>
                </div>
             </div>
          )}

          {hintText && (
            <div className="bg-yellow-50 p-3 text-lg font-mono tracking-widest text-yellow-800 border-b border-yellow-200 animate-fade-in px-4 flex items-center justify-center">
              {hintText}
            </div>
          )}
      </div>

      {/* Guesses List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-32 bg-slate-50">
        {guesses.length === 0 && (
            <div className="text-center text-gray-400 mt-10">
                <div className="text-6xl mb-4 opacity-20">
                    {category.icon}
                </div>
                <p className="font-medium text-slate-500">İlk tahminini yap!</p>
                <p className="text-xs mt-2 max-w-[200px] mx-auto opacity-70">Aşağı-Yukarı ipuçlarını takip ederek gizli kelimeyi bul.</p>
            </div>
        )}
        {guesses.map((g, idx) => (
          <div 
            key={idx} 
            className={`flex items-center justify-between p-3 rounded-xl border-l-4 shadow-sm transition-all duration-300 transform translate-y-0 ${getDistanceColor(g.distance)}`}
          >
            <span className="font-semibold text-lg">{g.word}</span>
            <div className="flex items-center space-x-2 font-mono font-bold">
               <span>{getDirectionText(g.distance)}</span>
            </div>
          </div>
        ))}
        <div ref={listEndRef} />
      </div>

      {/* Input Area (Sticky Bottom) */}
      <div className="sticky bottom-0 left-0 right-0 p-4 pb-[max(1rem,env(safe-area-inset-bottom,0.75rem))] bg-white border-t border-slate-200 shadow-lg z-30">
        <div className="relative">
            {/* Suggestions Popover */}
            {showSuggestions && (
                <div className="absolute bottom-full mb-2 w-full bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden max-h-48 z-40">
                {filteredSuggestions.map((s, i) => (
                    <button
                        key={i}
                        className="w-full text-left px-4 py-3 hover:bg-indigo-50 border-b border-slate-100 last:border-0 transition-colors"
                        onClick={() => handleGuess(s)}
                    >
                        {s}
                    </button>
                ))}
                </div>
            )}
            
            <form 
                onSubmit={(e) => {
                    e.preventDefault();
                    if (filteredSuggestions.length > 0 && filteredSuggestions[0].toLowerCase() === inputValue.toLowerCase()) {
                         handleGuess(filteredSuggestions[0]);
                    } else if (filteredSuggestions.length === 1) {
                         handleGuess(filteredSuggestions[0]);
                    } else if (category.words.includes(inputValue.toLocaleLowerCase('tr-TR'))) {
                         handleGuess(inputValue);
                    }
                }} 
                className="flex gap-2 items-stretch"
            >
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Kelime yaz..."
                className="flex-1 min-w-0 px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-indigo-500 focus:ring-0 outline-none transition text-base md:text-lg bg-slate-50"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
            />
            <button 
                type="submit"
                disabled={!inputValue}
                className="bg-indigo-600 disabled:bg-slate-300 text-white px-5 md:px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition active:scale-95 flex-shrink-0 min-w-[96px] text-sm md:text-base"
            >
                Tahmin
            </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
