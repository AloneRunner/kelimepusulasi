
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CATEGORIES } from '../data/wordLists';
import { playSound } from '../services/audioService';

interface LadderGameProps {
  onWin: () => void;
  onBack: () => void;
  coins: number;
  onSpendCoins: (amount: number) => boolean;
}

interface Step {
  word: string;
  status: 'initial' | 'user' | 'target';
}

const LadderGame: React.FC<LadderGameProps> = ({ onWin, onBack, coins, onSpendCoins }) => {
  const [startWord, setStartWord] = useState('');
  const [targetWord, setTargetWord] = useState('');
  const [userSteps, setUserSteps] = useState<string[]>([]);
  const [minSteps, setMinSteps] = useState(0); // Calculated Par
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Hint logic: Store the "Optimal Path" to give hints
  const [solutionPath, setSolutionPath] = useState<string[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Prepare Dictionary
  const dictionary = useMemo(() => {
    const allWords = new Set<string>();
    CATEGORIES.forEach(cat => {
        cat.words.forEach(w => allWords.add(w.toLocaleUpperCase('tr-TR')));
    });
    return Array.from(allWords);
  }, []);

  const isOneLetterDiff = (a: string, b: string) => {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) diff++;
    }
    return diff === 1;
  };

  useEffect(() => {
    generateLevel();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [userSteps]);

  const generateLevel = () => {
    setLoading(true);
    setUserSteps([]);
    setInputValue('');
    setMessage(null);

    const pool = dictionary.filter(w => w.length === 4 || w.length === 5);
    
    let attempts = 0;
    while (attempts < 50) {
        attempts++;
        const start = pool[Math.floor(Math.random() * pool.length)];
        
        const queue: { word: string; dist: number; path: string[] }[] = [{ word: start, dist: 0, path: [start] }];
        const visited = new Map<string, number>();
        visited.set(start, 0);
        
        const reachableTargets: { word: string; path: string[] }[] = [];

        let head = 0;
        while(head < queue.length) {
            const current = queue[head++];
            
            if (current.dist > 6) continue;

            if (current.dist >= 3) {
                reachableTargets.push({ word: current.word, path: current.path });
            }

            for (const neighbor of pool) {
                if (neighbor.length === start.length && !visited.has(neighbor)) {
                    if (isOneLetterDiff(current.word, neighbor)) {
                        visited.set(neighbor, current.dist + 1);
                        queue.push({ word: neighbor, dist: current.dist + 1, path: [...current.path, neighbor] });
                    }
                }
            }
        }

        if (reachableTargets.length > 0) {
            const targetObj = reachableTargets[Math.floor(Math.random() * reachableTargets.length)];
            
            console.log('🎯 MERDIVEN OYUNU - HATA AYIKLAMA');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`Başlangıç: ${start}`);
            console.log(`Hedef: ${targetObj.word}`);
            console.log(`Minimum Adım: ${targetObj.path.length - 1}`);
            console.log(`Çözüm Yolu:`, targetObj.path.join(' → '));
            console.log('Reachable Targets Sayısı:', reachableTargets.length);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            
            setStartWord(start);
            setTargetWord(targetObj.word);
            setSolutionPath(targetObj.path); // Save full path for hints
            setMinSteps(targetObj.path.length - 1);
            setLoading(false);
            return;
        }
    }
    
    generateLevel();
  };

  const handleInput = (char: string) => {
      playSound('click');
      if (char === 'BACKSPACE') {
          setInputValue(prev => prev.slice(0, -1));
      } else if (inputValue.length < startWord.length) {
          setInputValue(prev => prev + char);
      }
  };

  const handleSubmit = () => {
      const currentInput = inputValue.toLocaleUpperCase('tr-TR');
      const lastWord = userSteps.length > 0 ? userSteps[userSteps.length - 1] : startWord;

      console.log(`📝 Girdi: "${currentInput}" | Son Kelime: "${lastWord}"`);
      console.log(`Hedef: "${targetWord}"`);

      // Validations
      if (currentInput.length !== startWord.length) {
          playSound('wrong');
          console.log(`❌ Harf sayısı yanlış: ${currentInput.length}/${startWord.length}`);
          setMessage("Harf sayısı eksik.");
          setTimeout(() => setMessage(null), 1500);
          return;
      }

      if (!isOneLetterDiff(lastWord, currentInput)) {
          playSound('wrong');
          console.log(`❌ Sadece 1 harf değişmeli: "${lastWord}" → "${currentInput}"`);
          setMessage("Sadece 1 harf değişmeli!");
          setTimeout(() => setMessage(null), 1500);
          return;
      }

      if (!dictionary.includes(currentInput)) {
          playSound('wrong');
          console.log(`❌ Sözlükte yok: "${currentInput}" (Sözlük boyutu: ${dictionary.length})`);
          setMessage("Bu kelime sözlükte yok.");
          setTimeout(() => setMessage(null), 1500);
          return;
      }

      if (userSteps.includes(currentInput) || currentInput === startWord) {
          playSound('wrong');
          console.log(`❌ Kelime zaten kullanıldı: "${currentInput}"`);
          setMessage("Bu kelimeyi zaten kullandın.");
          setTimeout(() => setMessage(null), 1500);
          return;
      }

      // Valid Move
      playSound('correct');
      const newSteps = [...userSteps, currentInput];
      setUserSteps(newSteps);
      setInputValue('');
      console.log(`✅ Geçerli Hamle! Merdiven: ${[startWord, ...newSteps].join(' → ')}`);

      // Check Win
      if (currentInput === targetWord) {
          console.log(`🎉 KAZANDI! Toplam Adımlar: ${newSteps.length}, Minimum: ${minSteps}`);
          setTimeout(onWin, 500);
      }
  };
  
  const buyHint = () => {
      if (onSpendCoins(50)) {
          playSound('win');
          // Logic: Find the next step in the "Solution Path" from startWord
          // But wait, user might have diverged. 
          // Simple Hint: Just reveal 1 letter of the *Target Word* that corresponds to the current input position?
          // Better Hint: Auto-fill the next letter of the word user is trying to type based on Solution Path (if they are on track) OR just give first letter of next step.
          
          // Let's keep it simple: Reveal 1 letter of the NEXT word in the optimal solution path.
          // Note: This assumes user is following optimal path. If not, this might be confusing.
          // Fallback: If user diverged, just give the first letter of the Target Word? 
          
          // Simplest: Auto-fill one correct letter for the current input box based on the Target Word or Next Step.
          // Let's fill the first missing letter of the 'inputValue' based on 'targetWord' (helping them visualize goal)? No.
          
          // Let's implement: "Reveal next letter of the word you are typing" (cheating) OR "Show the next word's first letter".
          
          // Safe Hint: Auto-fill the *next correct word* from the solution path if we are at start.
          // If we are deep in user steps, calculating next best move is hard (requires BFS again).
          
          // Super Simple Hint: Fill `inputValue` with the first letter of the *Target Word* that differs from current last word? 
          // No, let's just fill a random letter into the input box that helps.
          
          const lastWord = userSteps.length > 0 ? userSteps[userSteps.length - 1] : startWord;
          // Find next char that needs to change to get closer to target
          for (let i=0; i<lastWord.length; i++) {
              if (lastWord[i] !== targetWord[i]) {
                  // This position needs to change. Let's suggest changing this index to target's char.
                  // But we need to form a valid word.
                  
                  // Let's just reveal the first letter of the inputValue that matches the TARGET word's structure?
                  // Actually, standard hint for Ladder is usually "Tell me the next word". That's too strong.
                  // Let's fill the input value with the *Target Word's* letter at the current input cursor position?
                  
                  // Implementation: Append the next letter of the TARGET WORD to the input.
                  // Example: Start: KEDİ, Target: KATI. User input empty. Hint presses 'K'.
                  const nextCharIndex = inputValue.length;
                  if (nextCharIndex < targetWord.length) {
                      setInputValue(prev => prev + targetWord[nextCharIndex]);
                  }
                  break;
              }
          }
      } else {
          alert("Yetersiz bakiye! (50 Coin)");
      }
  };

  const ALPHABET = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("");

  if (loading) {
      return <div className="flex h-full items-center justify-center text-slate-500">Merdiven kuruluyor...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-blue-600 text-white shadow-md z-20 shrink-0">
            <button onClick={onBack} className="p-1 hover:bg-blue-700 rounded transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <div className="text-center">
                <h1 className="font-bold text-lg">Kelime Merdiveni</h1>
                <div className="flex items-center justify-center gap-2 text-xs text-blue-100 opacity-90">
                    <span>{coins} 🪙</span>
                    <span>•</span>
                    <span>Hedef: {minSteps} Adım</span>
                </div>
            </div>
            <button 
                onClick={buyHint} 
                className="p-2 bg-yellow-400 hover:bg-yellow-300 text-blue-900 rounded-full shadow-md w-10 h-10 flex flex-col items-center justify-center transition active:scale-95"
            >
                <span className="font-bold text-lg leading-none">?</span>
                <span className="text-[9px] font-bold leading-none mt-0.5">50</span>
            </button>
        </header>

        {/* Game Area */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
            
            {/* The Ladder (Scrollable) */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 flex flex-col items-center gap-2">
                
                {/* START NODE */}
                <div className="relative">
                    <div className="bg-green-500 text-white font-black text-2xl px-6 py-3 rounded-xl shadow-lg border-b-4 border-green-700 z-10 relative">
                        {startWord}
                    </div>
                    {/* Connecting Line */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-1 h-4 bg-slate-300 -z-0"></div>
                </div>

                {/* USER STEPS */}
                {userSteps.map((word, idx) => (
                    <div key={idx} className="relative animate-fade-in-up">
                        <div className={`font-bold text-2xl px-6 py-3 rounded-xl shadow-md border-b-4 z-10 relative
                            ${word === targetWord 
                                ? 'bg-red-500 text-white border-red-700' 
                                : 'bg-white text-slate-800 border-slate-300'}`}>
                            {word}
                        </div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-1 h-4 bg-slate-300 -z-0"></div>
                    </div>
                ))}

                {/* INPUT PREVIEW */}
                {userSteps[userSteps.length - 1] !== targetWord && (
                    <div className="relative animate-pulse">
                         <div className={`w-32 h-14 border-2 border-dashed border-blue-300 rounded-xl flex items-center justify-center font-bold text-2xl text-blue-500 bg-blue-50`}>
                            {inputValue}
                            {inputValue.length < startWord.length && (
                                <span className="w-0.5 h-6 bg-blue-400 animate-blink ml-1"></span>
                            )}
                         </div>
                         <div className="absolute top-full left-1/2 -translate-x-1/2 w-1 h-8 bg-dashed border-l border-slate-300 -z-0"></div>
                    </div>
                )}

                {/* TARGET NODE */}
                <div className="mt-4 opacity-80">
                    <div className="bg-red-100 text-red-800 border-2 border-red-200 font-bold text-xl px-6 py-2 rounded-xl shadow-inner flex flex-col items-center">
                        <span className="text-xs uppercase tracking-widest mb-1 text-red-400">HEDEF</span>
                        {targetWord}
                    </div>
                </div>

                <div className="h-48"></div> {/* Spacer for keyboard */}
            </div>

            {/* Error Message Toast */}
            {message && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-xl text-sm font-bold animate-bounce z-30">
                    {message}
                </div>
            )}

            {/* Keyboard */}
            <div className="bg-white border-t border-slate-200 p-2 pb-6 z-20 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
                 <div className="flex justify-between items-center px-2 mb-2">
                     <div className="text-sm font-semibold text-slate-500">
                        {inputValue.length}/{startWord.length} Harf
                     </div>
                     <button 
                        onClick={handleSubmit}
                        disabled={inputValue.length !== startWord.length}
                        className="bg-blue-600 disabled:bg-slate-300 text-white px-6 py-2 rounded-lg font-bold shadow-md active:scale-95 transition"
                     >
                        EKLE
                     </button>
                 </div>
                 
                 <div className="grid grid-cols-10 gap-1 sm:gap-1.5 max-w-lg mx-auto">
                    {ALPHABET.map(char => (
                        <button
                            key={char}
                            onClick={() => handleInput(char)}
                            className="aspect-[4/5] bg-slate-100 hover:bg-slate-200 active:bg-blue-100 rounded text-slate-700 font-bold text-lg shadow-sm border-b-2 border-slate-300 active:border-blue-300 transition-all touch-manipulation"
                        >
                            {char}
                        </button>
                    ))}
                    <button
                        onClick={() => handleInput('BACKSPACE')}
                        className="col-span-1 aspect-[4/5] bg-red-100 hover:bg-red-200 text-red-600 rounded flex items-center justify-center shadow-sm border-b-2 border-red-200 touch-manipulation"
                    >
                        ⌫
                    </button>
                 </div>
            </div>
        </div>
    </div>
  );
};

export default LadderGame;
