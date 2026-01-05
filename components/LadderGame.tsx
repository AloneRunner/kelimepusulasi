
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CATEGORIES } from '../data/wordLists';
import { playSound } from '../services/audioService';
import { getFunFactFromGemini } from '../services/geminiService';
import { TurkishKeyboard } from './TurkishKeyboard';

interface LadderGameProps {
    onWin: () => void;
    onBack: () => void;
    coins: number;
    onSpendCoins: (amount: number) => boolean;
    level: number;
    useGameKeyboard?: boolean;
}

interface Step {
    word: string;
    status: 'initial' | 'user' | 'target';
}

const LadderGame: React.FC<LadderGameProps> = ({ onWin, onBack, coins, onSpendCoins, level, useGameKeyboard = true }) => {
    const [startWord, setStartWord] = useState('');
    const [targetWord, setTargetWord] = useState('');
    const [userSteps, setUserSteps] = useState<string[]>([]);
    const [minSteps, setMinSteps] = useState(0); // Calculated Par
    const [inputValue, setInputValue] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Hint logic: Store the "Optimal Path" to give hints
    const [solutionPath, setSolutionPath] = useState<string[]>([]);
    const [activeHint, setActiveHint] = useState<string | null>(null);
    const [hintLoading, setHintLoading] = useState(false);

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
        setActiveHint(null);

        // Difficulty Scaling based on Level
        let minLen = 3;
        let maxLen = 4;
        let maxDist = 4; // Start easy

        if (level > 3) { minLen = 4; maxLen = 5; maxDist = 5; }
        if (level > 7) { minLen = 5; maxLen = 5; maxDist = 6; }
        if (level > 12) { minLen = 5; maxLen = 6; maxDist = 8; }

        const pool = dictionary.filter(w => w.length >= minLen && w.length <= maxLen);

        let attempts = 0;
        while (attempts < 50) {
            attempts++;
            const start = pool[Math.floor(Math.random() * pool.length)];

            const queue: { word: string; dist: number; path: string[] }[] = [{ word: start, dist: 0, path: [start] }];
            const visited = new Map<string, number>();
            visited.set(start, 0);

            const reachableTargets: { word: string; path: string[] }[] = [];

            let head = 0;
            while (head < queue.length) {
                const current = queue[head++];

                if (current.dist > maxDist) continue;

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

    const handleUndo = () => {
        if (userSteps.length === 0) return;

        if (!onSpendCoins(10)) {
            // alert("Yetersiz bakiye! (10 Coin)");
            return;
        }

        playSound('click');
        const newSteps = [...userSteps];
        newSteps.pop();
        setUserSteps(newSteps);
        setInputValue('');
    };

    const handleJoker = () => {
        if (loading || coins < 100) return;

        // Determine current position
        const lastWord = userSteps.length > 0 ? userSteps[userSteps.length - 1] : startWord;

        // Check if we are on the solution path
        const pathIndex = solutionPath.indexOf(lastWord);

        if (pathIndex === -1) {
            setMessage("Yoldan saptın! Joker için önce geri dön.");
            setTimeout(() => setMessage(null), 2000);
            return;
        }

        if (pathIndex >= solutionPath.length - 1) {
            return; // Already at goal?
        }

        if (!onSpendCoins(100)) return;

        playSound('win'); // Special sound for Joker
        const nextWord = solutionPath[pathIndex + 1];

        // Execute Move
        const newSteps = [...userSteps, nextWord];
        setUserSteps(newSteps);
        setInputValue('');

        // Check Win immediately
        if (nextWord === targetWord) {
            console.log(`🎉 JOKER İLE KAZANDI!`);
            setTimeout(onWin, 500);
        }
    };

    const handleRiddleHint = async () => {
        if (hintLoading) return;

        if (!onSpendCoins(50)) {
            alert("Yetersiz bakiye! (50 Coin)");
            return;
        }

        setHintLoading(true);
        playSound('pop');

        try {
            const lastWord = userSteps.length > 0 ? userSteps[userSteps.length - 1] : startWord;

            // Find where user is in the solution path
            const pathIndex = solutionPath.indexOf(lastWord);

            let nextWord = "";

            if (pathIndex !== -1 && pathIndex < solutionPath.length - 1) {
                // User is on track, hint the NEXT step
                nextWord = solutionPath[pathIndex + 1];
            } else {
                // User is off track or stuck, hint the TARGET word to guide them
                nextWord = targetWord;
            }

            const fact = await getFunFactFromGemini(nextWord);
            const prefix = (nextWord === targetWord) ? "Hedef Kelime İpucu:" : "Sıradaki Adım İpucu:";
            setActiveHint(`${prefix}\n\n${fact}`);

        } catch (error) {
            console.error("Hint error:", error);
            setActiveHint("İpucu alınamadı.");
        } finally {
            setHintLoading(false);
        }
    };


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
                        <span>Level {level}</span>
                        <span>•</span>
                        <span>Hedef: {minSteps} Adım</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    {/* Undo Button (10) */}
                    <button
                        onClick={handleUndo}
                        disabled={coins < 10 || userSteps.length === 0}
                        className={`flex flex-col items-center justify-center bg-red-500 text-white w-10 h-10 rounded-full shadow-md transition active:scale-95
                        ${(coins < 10 || userSteps.length === 0) ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-red-400'}`}
                        title="Geri Al (10)"
                    >
                        <span className="font-bold text-lg leading-none">↩️</span>
                        <span className="text-[9px] font-bold leading-none mt-0.5">10</span>
                    </button>

                    {/* Joker Button (100) */}
                    <button
                        onClick={handleJoker}
                        disabled={coins < 100}
                        className={`flex flex-col items-center justify-center bg-purple-600 text-white w-10 h-10 rounded-full shadow-md transition active:scale-95
                        ${(coins < 100) ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-purple-500'}`}
                        title="Joker (100)"
                    >
                        <span className="font-bold text-lg leading-none">⚡</span>
                        <span className="text-[9px] font-bold leading-none mt-0.5">100</span>
                    </button>

                    {/* Riddle Hint (50) */}
                    <button
                        onClick={handleRiddleHint}
                        disabled={coins < 50 || hintLoading}
                        className={`p-2 bg-yellow-400 text-blue-900 rounded-full shadow-md w-10 h-10 flex flex-col items-center justify-center transition active:scale-95
                        ${(loading || coins < 50) ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-yellow-300'}`}
                        title="İpucu (50)"
                    >
                        <span className="font-bold text-lg leading-none">?</span>
                        <span className="text-[9px] font-bold leading-none mt-0.5">50</span>
                    </button>
                </div>
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
                <div className="z-30 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] bg-white">
                    {useGameKeyboard ? (
                        <TurkishKeyboard
                            value={inputValue}
                            onChange={setInputValue}
                            onSubmit={handleSubmit}
                            maxLength={startWord.length}
                            placeholder={`${startWord.length} Harfli Kelime`}
                        />
                    ) : (
                        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="p-3">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value.toLocaleUpperCase('tr-TR'))}
                                    placeholder={`${startWord.length} Harfli Kelime`}
                                    maxLength={startWord.length}
                                    className="flex-1 bg-white border-2 border-slate-300 rounded-xl px-4 py-3 text-slate-800 font-bold text-xl text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    spellCheck="false"
                                    autoCapitalize="characters"
                                />
                                <button
                                    type="submit"
                                    disabled={inputValue.length !== startWord.length}
                                    className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    Gönder
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* HINT MODAL */}
            {activeHint && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center relative overflow-hidden animate-bounce-in">
                        <h3 className="text-blue-600 font-black text-xl mb-1 uppercase tracking-wider">İpucu</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase mb-4">Sıradaki Adım İçin</p>

                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                            <p className="text-slate-700 italic text-lg leading-relaxed whitespace-pre-line">
                                {activeHint}
                            </p>
                        </div>

                        <button
                            onClick={() => setActiveHint(null)}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition transform hover:scale-[1.02]"
                        >
                            Tamam, Anladım!
                        </button>
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default LadderGame;
