
import React, { useState, useEffect } from 'react';
import { Category } from '../types';
import { playSound } from '../services/audioService';
import { getFunFactFromGemini } from '../services/geminiService';

interface HangmanGameProps {
  category: Category;
  secretWord: string;
  onWin: (word: string) => void;
  onLose: (word: string) => void;
  onBack: () => void;
  coins: number;
  onSpendCoins: (amount: number) => boolean;
  level: number;
}

const ALPHABET = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("");

const MAX_ERRORS = 6;

const HangmanGame: React.FC<HangmanGameProps> = ({ category, secretWord, onWin, onLose, onBack, coins, onSpendCoins, level }) => {
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [errorCount, setErrorCount] = useState(0);
  const [isShaking, setIsShaking] = useState(false);

  // Hint State
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [hintLoading, setHintLoading] = useState(false);

  // Helper to normalize check (handle i/İ, I/ı issues loosely or strictly)
  const normalizedSecret = secretWord.toLocaleUpperCase('tr-TR');

  const handleGuess = (letter: string) => {
    if (guessedLetters.has(letter) || errorCount >= MAX_ERRORS) return;

    const newGuessed = new Set(guessedLetters);
    newGuessed.add(letter);
    setGuessedLetters(newGuessed);

    if (!normalizedSecret.includes(letter)) {
      const newErrorCount = errorCount + 1;
      setErrorCount(newErrorCount);
      playSound('wrong');

      // Trigger shake effect
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    } else {
      playSound('pop');
    }
  };

  // 1. LETTER HINT (Harf Al) - 50 Coins
  const handleLetterHint = () => {
    // Find unrevealed letters in secret word
    const secretLetters = new Set<string>(normalizedSecret.split('').filter((char: string) => char !== ' '));
    const unrevealed = Array.from(secretLetters).filter((char: string) => !guessedLetters.has(char));

    if (unrevealed.length === 0) return; // All revealed already

    if (onSpendCoins(40)) {
      playSound('win');
      // Reveal a random unrevealed letter
      const randomChar = unrevealed[Math.floor(Math.random() * unrevealed.length)];
      handleGuess(randomChar);
    } else {
      // alert("Yetersiz bakiye! (40 Coin)");
    }
  };

  // 2. FACT HINT (Kelime İpucu) - 20 Coins
  const handleFactHint = async () => {
    if (hintLoading) return;

    if (!onSpendCoins(100)) {
      return;
    }

    playSound('pop');
    setHintLoading(true);

    try {
      const fact = await getFunFactFromGemini(secretWord);
      setActiveHint(fact);
    } catch (error) {
      console.error("Hint error:", error);
    } finally {
      setHintLoading(false);
    }
  };

  const closeHint = () => {
    setActiveHint(null);
  };

  useEffect(() => {
    // Check Win
    const isWin = normalizedSecret.split('').every(char =>
      char === ' ' || guessedLetters.has(char)
    );
    if (isWin) {
      setTimeout(() => onWin(secretWord), 500);
    }

    // Check Lose
    if (errorCount >= MAX_ERRORS) {
      setTimeout(() => onLose(secretWord), 1000); // Wait a bit to see the "dead" face
    }
  }, [guessedLetters, errorCount, normalizedSecret, onWin, onLose, secretWord]);

  // SVG Drawing Parts
  const renderMan = () => {
    // Colors based on health
    const bodyColor = errorCount >= 5 ? "stroke-red-600" : "stroke-slate-800";
    const faceColor = errorCount >= 5 ? "stroke-red-600" : "stroke-slate-800";

    return (
      <svg viewBox="0 0 100 120" className={`w-56 h-56 mx-auto fill-none ${isShaking ? 'animate-wiggle' : ''}`}>
        <style>{`
           @keyframes wiggle {
             0%, 100% { transform: rotate(0deg); }
             25% { transform: rotate(-5deg); }
             75% { transform: rotate(5deg); }
           }
           .animate-wiggle {
             animation: wiggle 0.3s ease-in-out;
             transform-origin: 50% 10%; 
           }
         `}</style>

        {/* Gallows (Static) */}
        <g className="stroke-slate-400 stroke-[3px]">
          <line x1="10" y1="115" x2="90" y2="115" /> {/* Base */}
          <line x1="30" y1="115" x2="30" y2="10" />  {/* Pole */}
          <line x1="30" y1="10" x2="70" y2="10" />   {/* Top */}
          <line x1="70" y1="10" x2="70" y2="25" />   {/* Rope */}
        </g>

        {/* Character Group */}
        <g className={`${bodyColor} stroke-[3px] stroke-linecap-round stroke-linejoin-round transition-colors duration-300`}>

          {/* HEAD & FACE (Index 1) */}
          {errorCount >= 1 && (
            <g>
              {/* Head Outline */}
              <circle cx="70" cy="40" r="12" className="fill-white" />

              {/* Facial Expressions based on Error Count */}
              <g className={`${faceColor} stroke-[1.5px] fill-none`}>
                {errorCount < 6 ? (
                  <>
                    {/* Eyes (Alive) */}
                    {errorCount < 4 ? (
                      // Normal Eyes
                      <>
                        <circle cx="66" cy="38" r="1" className="fill-slate-800 stroke-none" />
                        <circle cx="74" cy="38" r="1" className="fill-slate-800 stroke-none" />
                      </>
                    ) : (
                      // Scared Eyes (Big)
                      <>
                        <circle cx="66" cy="38" r="2" />
                        <circle cx="74" cy="38" r="2" />
                      </>
                    )}

                    {/* Mouth */}
                    {errorCount < 3 ? (
                      // Neutral Mouth
                      <path d="M66 45 h8" />
                    ) : errorCount < 5 ? (
                      // Worried Mouth (O shape)
                      <circle cx="70" cy="46" r="2" />
                    ) : (
                      // Scared/Wavy Mouth
                      <path d="M65 46 q2.5 2 5 0 t5 0" />
                    )}

                    {/* Sweat Drop (Only at 5 errors) */}
                    {errorCount === 5 && (
                      <path d="M78 30 q-2 4 0 6 q2 -2 0 -6" className="fill-blue-400 stroke-blue-500 stroke-1" />
                    )}
                  </>
                ) : (
                  // DEAD Face (X Eyes)
                  <>
                    <path d="M64 36 l4 4 m0 -4 l-4 4" /> {/* Left X */}
                    <path d="M72 36 l4 4 m0 -4 l-4 4" /> {/* Right X */}
                    <path d="M66 46 q4 -3 8 0" />        {/* Sad Mouth */}
                  </>
                )}
              </g>
            </g>
          )}

          {/* BODY (Index 2) */}
          {errorCount >= 2 && <line x1="70" y1="52" x2="70" y2="85" />}

          {/* LEFT ARM (Index 3) */}
          {errorCount >= 3 && <line x1="70" y1="60" x2="55" y2="75" />}

          {/* RIGHT ARM (Index 4) */}
          {errorCount >= 4 && <line x1="70" y1="60" x2="85" y2="75" />}

          {/* LEFT LEG (Index 5) */}
          {errorCount >= 5 && <line x1="70" y1="85" x2="55" y2="105" />}

          {/* RIGHT LEG (Index 6) */}
          {errorCount >= 6 && <line x1="70" y1="85" x2="85" y2="105" />}
        </g>
      </svg>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-orange-500 text-white shadow-md z-20">
        <button onClick={onBack} className="p-1 hover:bg-orange-600 rounded transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div className="text-center">
          <h1 className="font-bold text-lg">{category.label}</h1>
          <div className="flex items-center justify-center gap-2 text-xs text-orange-100 opacity-80">
            <span>{coins} 🪙</span>
            <span>•</span>
            <span>Level {level}</span>
            <span>•</span>
            <span>Hata: {errorCount}/{MAX_ERRORS}</span>
          </div>
        </div>

        {/* HINT BUTTONS */}
        <div className="flex gap-2">
          {/* Letter Hint (40) */}
          <button
            onClick={handleLetterHint}
            disabled={coins < 40}
            className={`flex flex-col items-center justify-center bg-violet-600 text-white w-10 h-10 rounded-full shadow-md transition active:scale-95
                ${(coins < 40) ? 'opacity-50 grayscale' : 'hover:bg-violet-500'}`}
            title="Harf Al (40)"
          >
            <span className="font-bold text-lg leading-none">A</span>
            <span className="text-[9px] font-bold leading-none mt-0.5">40</span>
          </button>

          {/* Fact Hint (100) */}
          <button
            onClick={handleFactHint}
            disabled={hintLoading || coins < 100}
            className={`flex flex-col items-center justify-center bg-yellow-400 text-orange-900 w-10 h-10 rounded-full shadow-md transition active:scale-95
                ${(hintLoading || coins < 100) ? 'opacity-50 grayscale' : 'hover:bg-yellow-300'}`}
            title="İpucu Al (100)"
          >
            <span className="font-bold text-lg leading-none">?</span>
            <span className="text-[9px] font-bold leading-none mt-0.5">100</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center p-4 overflow-y-auto">

        {/* Drawing Area */}
        <div className="mb-4 mt-2">
          {renderMan()}
        </div>

        {/* Word Display */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 min-h-[3rem]">
          {normalizedSecret.split('').map((char, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className={`w-8 h-10 flex items-end justify-center text-2xl font-bold border-b-4 transition-all duration-300 
                  ${char === ' ' ? 'border-transparent mb-2' : (guessedLetters.has(char) ? 'text-slate-800 border-slate-800' : 'text-transparent border-slate-300')}`}>
                {char === ' ' ? '/' : (guessedLetters.has(char) ? char : '_')}
              </div>
            </div>
          ))}
        </div>

        {/* Keyboard */}
        <div className="w-full max-w-lg grid grid-cols-7 gap-1 sm:gap-2 pb-6">
          {ALPHABET.map((letter) => {
            const isUsed = guessedLetters.has(letter);
            const isWrong = isUsed && !normalizedSecret.includes(letter);
            const isCorrect = isUsed && normalizedSecret.includes(letter);

            let btnClass = "bg-white text-slate-700 shadow-sm border-b-2 border-slate-200 hover:bg-slate-50";
            if (isWrong) btnClass = "bg-red-100 text-red-400 border-transparent opacity-50 scale-95";
            if (isCorrect) btnClass = "bg-green-100 text-green-700 border-green-300 scale-95";

            return (
              <button
                key={letter}
                onClick={() => handleGuess(letter)}
                disabled={isUsed}
                className={`font-bold text-lg h-12 rounded-lg transition-all duration-200 active:scale-90 ${btnClass}`}
              >
                {letter}
              </button>
            )
          })}
        </div>
      </div>

      {/* HINT MODAL OVERLAY */}
      {activeHint && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center relative overflow-hidden animate-bounce-in">

            <h3 className="text-orange-500 font-black text-xl mb-1 uppercase tracking-wider">İpucu</h3>
            <p className="text-slate-400 text-xs font-bold uppercase mb-4">Gizli Kelime Hakkında</p>

            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-6">
              <p className="text-slate-700 italic text-lg leading-relaxed">
                "{activeHint}"
              </p>
            </div>

            <button
              onClick={closeHint}
              className="w-full py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition transform hover:scale-[1.02]"
            >
              Tamam, Buldum!
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default HangmanGame;
