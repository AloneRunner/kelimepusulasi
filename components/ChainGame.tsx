import React, { useState, useEffect, useRef } from 'react';
import { Category } from '../types';
import { CATEGORIES } from '../data/wordLists';
import { TurkishKeyboard } from './TurkishKeyboard';

interface ChainGameProps {
  category: Category;
  onWin: () => void;
  onLose: () => void;
  onBack: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
}

const ChainGame: React.FC<ChainGameProps> = ({ category, onWin, onLose, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [lastLetter, setLastLetter] = useState<string>('');
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [turn, setTurn] = useState<'user' | 'bot'>('user');
  const [timeLeft, setTimeLeft] = useState(30);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Combine all dictionaries for Bot Intelligence (Bot knows everything)
  const allWords = React.useMemo(() => {
    return CATEGORIES.flatMap(c => c.words);
  }, []);

  // Initialize
  useEffect(() => {
    // Bot starts with a random word from the category
    const startWord = category.words[Math.floor(Math.random() * category.words.length)];
    const initialMessage: Message = {
      id: 'init',
      text: startWord,
      sender: 'bot',
      timestamp: Date.now()
    };
    setMessages([initialMessage]);
    setUsedWords(new Set([startWord.toLocaleLowerCase('tr-TR')]));
    setLastLetter(startWord.slice(-1).toLocaleLowerCase('tr-TR'));
  }, [category]);

  // Timer
  useEffect(() => {
    if (turn === 'user') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            onLose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    } else {
        setTimeLeft(30); // Reset for next turn
    }
  }, [turn, onLose]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const word = inputText.toLocaleLowerCase('tr-TR').trim();
    
    // Validations
    if (!word) return;
    if (word.charAt(0) !== lastLetter) {
        alert(`Kelime "${lastLetter.toLocaleUpperCase('tr-TR')}" harfi ile başlamalı!`);
        return;
    }
    if (usedWords.has(word)) {
        alert("Bu kelime zaten kullanıldı!");
        return;
    }
    // Simple Dictionary Check (must be in the specific category or general list?)
    // Let's be lenient: Must be in the category list OR any generic list if we want easier mode.
    // Strict Mode: Must be in Selected Category.
    // Lenient Mode: Check if word exists in the current category list.
    if (!category.words.includes(word)) {
        // Optional: Allow if it exists in ANY list to be nice? 
        // For now, let's enforce Category context to make it "Educational"
        alert(`Bu kelime "${category.label}" listesinde yok veya geçerli değil.`);
        return;
    }

    // Valid Move
    addMessage(word, 'user');
    setUsedWords(prev => new Set(prev).add(word));
    setLastLetter(word.slice(-1));
    setInputText('');
    setTurn('bot');

    // Bot Turn Logic
    setTimeout(() => {
        playBotTurn(word.slice(-1));
    }, 1500);
  };

  const playBotTurn = (triggerLetter: string) => {
    // Bot needs to find a word in the current category starting with triggerLetter
    const candidates = category.words.filter(w => 
        w.startsWith(triggerLetter) && !usedWords.has(w)
    );

    if (candidates.length > 0) {
        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        addMessage(pick, 'bot');
        setUsedWords(prev => new Set(prev).add(pick));
        setLastLetter(pick.slice(-1));
        setTurn('user');
    } else {
        // Bot cannot answer! User wins!
        onWin();
    }
  };

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text,
        sender,
        timestamp: Date.now()
    }]);
  };

  return (
    <div className="flex flex-col h-full bg-slate-100">
       <header className="flex-shrink-0 flex items-center justify-between p-4 bg-purple-600 text-white shadow-md z-20">
        <button onClick={onBack} className="p-1 hover:bg-purple-700 rounded transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div className="text-center">
          <h1 className="font-bold text-lg">Zincir: {category.label}</h1>
          <p className="text-xs text-purple-200">Son harf → İlk harf</p>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 ${timeLeft < 10 ? 'bg-red-500 border-red-300 animate-pulse' : 'bg-purple-800 border-purple-400'}`}>
            {timeLeft}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: 'calc(100vh - 380px)' }}>
        {messages.map((msg) => {
            const isMe = msg.sender === 'user';
            return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${isMe ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'}`}>
                        <div className="font-bold text-lg capitalize">
                            {msg.text}
                        </div>
                        {/* Highlight last letter for opponent */}
                        <div className={`text-xs mt-1 text-right opacity-70`}>
                             Son Harf: <span className="font-black bg-white/20 px-1 rounded">{msg.text.slice(-1).toUpperCase()}</span>
                        </div>
                    </div>
                </div>
            )
        })}
        {turn === 'bot' && (
            <div className="flex justify-start">
                 <div className="bg-slate-200 text-slate-500 rounded-2xl rounded-tl-none px-4 py-2 text-sm italic animate-pulse">
                    Yazıyor...
                 </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t border-slate-200">
         <div className="p-3 bg-slate-100 border-b border-slate-200">
             <div className="text-center text-sm font-bold text-purple-600">
                 <span className="bg-purple-100 px-3 py-1 rounded-full">
                   Kelime <span className="text-2xl mx-1">{lastLetter.toLocaleUpperCase('tr-TR')}</span> ile başlamalı
                 </span>
             </div>
         </div>
         <TurkishKeyboard
           value={inputText}
           onChange={setInputText}
           onSubmit={handleSend}
           placeholder="Kelime türet..."
           disabled={turn === 'bot'}
           maxLength={30}
           theme="light"
         />
         <p className="text-center text-xs text-slate-400 py-2 px-4 bg-slate-50">
            Sadece "{category.label}" kategorisindeki kelimeler kabul edilir.
         </p>
      </div>
    </div>
  );
};

export default ChainGame;