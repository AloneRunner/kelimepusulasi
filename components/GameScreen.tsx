
import React, { useState, useEffect, useRef } from 'react';
import { Category, GuessResult } from '../types';
import { playSound } from '../services/audioService';
import { TurkishKeyboard } from './TurkishKeyboard';
import { WORD_FACTS } from '../data/wordFacts';

interface GameScreenProps {
  category: Category;
  secretWord: string;
  onWin: (word: string, guessCount: number, bonusCoins: number) => void;
  onBack: () => void;
  coins: number;
  onSpendCoins: (amount: number) => boolean;
  knownWordsCount: number;
  useGameKeyboard?: boolean;
}

const GameScreen: React.FC<GameScreenProps> = ({ category, secretWord, onWin, onBack, coins, onSpendCoins, knownWordsCount, useGameKeyboard = true }) => {
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Hint State
  const [hintText, setHintText] = useState<string | null>(null);
  const [revealedCharCount, setRevealedCharCount] = useState(0);
  const [isHintCoolingDown, setIsHintCoolingDown] = useState(false);

  // Fun Fact State
  const [activeFact, setActiveFact] = useState<string | null>(null);
  const [factLoading, setFactLoading] = useState(false);

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

  const rangeStart = minGuess === undefined || guesses.length === 0 ? category.words[0] : (guesses.some(g => g.distance > 0) ? guesses.filter(g => g.distance > 0).sort((a, b) => a.distance - b.distance)[0].word : category.words[0]);
  const rangeEnd = maxGuess === undefined || guesses.length === 0 ? category.words[maxIndex] : (guesses.some(g => g.distance < 0) ? guesses.filter(g => g.distance < 0).sort((a, b) => b.distance - a.distance)[0].word : category.words[maxIndex]);


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

  // Filter autocomplete (trim & locale-aware so trailing spaces on mobile don't block typing)
  useEffect(() => {
    const normalized = inputValue.toLocaleLowerCase('tr-TR').trim();

    if (normalized.length > 0) {
      const filtered = category.words.filter(w =>
        w.toLocaleLowerCase('tr-TR').includes(normalized)
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

  const requestLetterHint = () => {
    // 1. Check if already fully revealed
    if (revealedCharCount >= secretWord.length) return;

    // 2. Check cooldown (Spam protection)
    if (isHintCoolingDown) return;

    // 3. Check coins (UPDATED to 40)
    if (onSpendCoins(40)) {
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
      alert("Yetersiz bakiye! (40 Coin gerekir)");
    }
  };

  const requestFactHint = () => {
    if (factLoading) return;

    // Check coins (Price: 100)
    if (!onSpendCoins(100)) {
      alert("Yetersiz bakiye! (100 Coin gerekir)");
      return;
    }

    playSound('pop');
    setFactLoading(true);

    try {
      const facts = WORD_FACTS[secretWord.toLocaleLowerCase('tr-TR')];
      if (facts && facts.length > 0) {
        const randomFact = facts[Math.floor(Math.random() * facts.length)];
        setActiveFact(randomFact);
      } else {
        setActiveFact("Bu kelime hakkında ipucu bulunmamaktadır.");
      }
    } catch (error) {
      console.error("Hint error:", error);
      alert("İpucu alınamadı.");
    } finally {
      setFactLoading(false);
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
    <div className="flex flex-col h-screen w-screen max-w-md mx-auto fixed inset-0 bg-white shadow-xl overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-indigo-600 text-white shadow-md z-20 flex-shrink-0">
        <button onClick={onBack} className="p-1 hover:bg-indigo-700 rounded transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div className="text-center">
          <h1 className="font-bold text-lg">{category.label}</h1>
          <div className="flex items-center justify-center gap-3 text-xs text-indigo-200 opacity-90 font-mono">
            <span>{coins} 🪙</span>
            <span>•</span>
            <span>{knownWordsCount} Kelime 📖</span>
            <span>•</span>
            <span className="bg-indigo-700 px-1.5 rounded">{formatTime(secondsElapsed)}</span>
          </div>
        </div>
        {/* HINT BUTTONS */}
        <div className="flex gap-2">
          {/* Letter Hint (40) */}
          <button
            onClick={requestLetterHint}
            disabled={revealedCharCount >= secretWord.length || isHintCoolingDown || coins < 40}
            className={`p-2 rounded-full transition flex flex-col items-center justify-center w-10 h-10 shadow-md active:scale-95
                ${(revealedCharCount >= secretWord.length || isHintCoolingDown || coins < 40) ? 'bg-indigo-800 opacity-50 cursor-not-allowed' : 'bg-violet-500 hover:bg-violet-400 text-white'}`}
            title="Harf Al (40)"
          >
            <span className="font-bold text-lg leading-none">A</span>
            <span className="text-[9px] font-bold leading-none mt-0.5">40</span>
          </button>

          {/* Fact Hint (100) */}
          <button
            onClick={requestFactHint}
            disabled={factLoading || coins < 100}
            className={`p-2 rounded-full transition flex flex-col items-center justify-center w-10 h-10 shadow-md active:scale-95
                ${(factLoading || coins < 100) ? 'bg-indigo-800 opacity-50 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-300 text-indigo-900'}`}
            title="İlginç Bilgi (100)"
          >
            <span className="font-bold text-lg leading-none">?</span>
            <span className="text-[9px] font-bold leading-none mt-0.5">100</span>
          </button>
        </div>
      </header>

      {/* Range Info & Hint Area */}
      <div className="bg-slate-50 border-b border-slate-200 flex-shrink-0">
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
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-4 bg-slate-50">
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

      {/* Input Area (Fixed Bottom) - REPLACED WITH TURKISH KEYBOARD */}
      <div className="flex-shrink-0 bg-white border-t border-slate-200 shadow-lg z-30">
        {/* Suggestions Popover */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="px-4 pt-3 max-h-40 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden">
              {filteredSuggestions.slice(0, 5).map((s, i) => (
                <button
                  key={i}
                  className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 border-b border-slate-100 last:border-0 transition-colors text-sm font-medium"
                  onClick={() => handleGuess(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {useGameKeyboard ? (
          <TurkishKeyboard
            value={inputValue}
            onChange={setInputValue}
            onSubmit={() => {
              const normalized = inputValue.toLocaleLowerCase('tr-TR').trim();
              if (!normalized) return;

              if (filteredSuggestions.length > 0 && filteredSuggestions[0].toLocaleLowerCase('tr-TR') === normalized) {
                handleGuess(filteredSuggestions[0]);
              } else if (filteredSuggestions.length === 1) {
                handleGuess(filteredSuggestions[0]);
              } else if (category.words.includes(normalized)) {
                handleGuess(normalized);
              }
            }}
            placeholder="Kelime yaz..."
            maxLength={50}
          />
        ) : (
          <form onSubmit={(e) => {
            e.preventDefault();
            const normalized = inputValue.toLocaleLowerCase('tr-TR').trim();
            if (!normalized) return;

            if (filteredSuggestions.length > 0 && filteredSuggestions[0].toLocaleLowerCase('tr-TR') === normalized) {
              handleGuess(filteredSuggestions[0]);
            } else if (filteredSuggestions.length === 1) {
              handleGuess(filteredSuggestions[0]);
            } else if (category.words.includes(normalized)) {
              handleGuess(normalized);
            }
          }} className="p-3">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Kelime yaz..."
                className="flex-1 bg-white border-2 border-slate-300 rounded-xl px-4 py-3 text-slate-800 font-medium text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                autoCapitalize="none"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Gönder
              </button>
            </div>
          </form>
        )}
      </div>

      {/* FACT HINT MODAL */}
      {activeFact && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center relative overflow-hidden animate-bounce-in">

            <h3 className="text-indigo-600 font-black text-xl mb-1 uppercase tracking-wider">İpucu</h3>
            <p className="text-slate-400 text-xs font-bold uppercase mb-4">Gizli Kelime Hakkında</p>

            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mb-6">
              <p className="text-slate-700 italic text-lg leading-relaxed">
                "{activeFact}"
              </p>
            </div>

            <button
              onClick={() => setActiveFact(null)}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition transform hover:scale-[1.02]"
            >
              Tamam, Anladım!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameScreen;
