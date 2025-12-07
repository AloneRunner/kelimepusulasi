import React, { useState, useCallback, useEffect } from 'react';
import { GameStatus, AppView, Category, CategoryGroup, GameType } from './types';
import { CATEGORIES } from './data/wordLists';
import GameScreen from './components/GameScreen';
import HangmanGame from './components/HangmanGame';
import WordHuntGame from './components/WordHuntGame';
import ChainGame from './components/ChainGame';
import ConnectGame from './components/ConnectGame';
import LadderGame from './components/LadderGame';
import ResultModal from './components/ResultModal';
import MainHub from './components/MainHub';
import HowToPlayModal from './components/HowToPlayModal';
import ShopModal from './components/ShopModal';
import DailyRewardModal from './components/DailyRewardModal';
import PrivacyModal from './components/PrivacyModal';
import { playSound } from './services/audioService';

const App: React.FC = () => {
  // Navigation State
  const [view, setView] = useState<AppView>(AppView.HUB);
  const [status, setStatus] = useState<GameStatus>(GameStatus.MENU);
  
  // Selection State
  const [selectedGameType, setSelectedGameType] = useState<GameType | null>(null);
  const [categoryMode, setCategoryMode] = useState<CategoryGroup>('general');
  
  // Game Play State
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [secretWord, setSecretWord] = useState<string>('');
  const [finalGuessCount, setFinalGuessCount] = useState(0); 
  const [isGameWon, setIsGameWon] = useState(false);
  
  // UI States
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(() => {
    return localStorage.getItem('kelime_privacy_accepted') !== 'yes';
  });

  // Economy & Persistence State
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem('kelime_coins');
    return saved ? parseInt(saved, 10) : 100;
  });

  const [inventory, setInventory] = useState<string[]>(() => {
    const saved = localStorage.getItem('kelime_inventory');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem('kelime_theme') || 'default';
  });

  // Daily Reward Check on Mount
  useEffect(() => {
    const lastClaimDate = localStorage.getItem('kelime_last_claim');
    const today = new Date().toDateString();

    if (lastClaimDate !== today) {
        // New day!
        setTimeout(() => setShowDailyReward(true), 1000); // Small delay for effect
    }
  }, []);

  // Privacy consent one-time check
  useEffect(() => {
    if (localStorage.getItem('kelime_privacy_accepted') === 'yes') {
      setShowPrivacy(false);
    }
  }, []);

  const handleAcceptPrivacy = () => {
    localStorage.setItem('kelime_privacy_accepted', 'yes');
    setShowPrivacy(false);
  };

  const handleClaimDailyReward = () => {
      const today = new Date().toDateString();
      localStorage.setItem('kelime_last_claim', today);
      setCoins(prev => prev + 50);
      setShowDailyReward(false);
  };

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('kelime_coins', coins.toString());
  }, [coins]);

  useEffect(() => {
    localStorage.setItem('kelime_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('kelime_theme', activeTheme);
  }, [activeTheme]);

  const WIN_REWARD = 20;

  // -- Navigation Handlers --

  const handleSelectGame = (type: GameType) => {
    setSelectedGameType(type);
    setView(AppView.CATEGORY_SELECTION);
    setStatus(GameStatus.MENU);
  };

  const handleSelectLadderGame = () => {
      setSelectedGameType('ladder');
      setView(AppView.GAME_LADDER);
      setStatus(GameStatus.PLAYING);
      setCurrentCategory(null);
  };

  const navigateToHub = () => {
    setView(AppView.HUB);
    setStatus(GameStatus.MENU);
    setSelectedGameType(null);
  };

  const navigateBackToCategories = () => {
    playSound('click');
    if (view === AppView.GAME_LADDER) {
        navigateToHub();
    } else {
        setView(AppView.CATEGORY_SELECTION);
        setStatus(GameStatus.MENU);
        setSecretWord('');
        setCurrentCategory(null);
    }
  };

  const toggleHowToPlay = () => {
      playSound('pop');
      setShowHowToPlay(prev => !prev);
  };

  const handleShopPurchase = (itemId: string, cost: number) => {
      if (coins >= cost) {
          playSound('win'); 
          setCoins(prev => prev - cost);
          if (!itemId.startsWith('hint_')) { 
             setInventory(prev => [...prev, itemId]);
          }
      } else {
          playSound('wrong');
      }
  };

  // Direct Spend from Game (Returns true if successful)
  const handleSpendCoins = (amount: number): boolean => {
      if (coins >= amount) {
          setCoins(prev => prev - amount);
          return true;
      } else {
          playSound('wrong');
          // Optional: Show a "Not enough coins" toast here or let component handle it
          return false;
      }
  };

  // -- Game Logic --

  const startGame = useCallback((category: Category) => {
    playSound('click');
    const randomIndex = Math.floor(Math.random() * category.words.length);
    setSecretWord(category.words[randomIndex]);
    setCurrentCategory(category);
    setStatus(GameStatus.PLAYING);
    setFinalGuessCount(0);
    setIsGameWon(false);

    // Route to correct game view
    switch (selectedGameType) {
        case 'compass': setView(AppView.GAME_COMPASS); break;
        case 'hangman': setView(AppView.GAME_HANGMAN); break;
        case 'word_hunt': setView(AppView.GAME_WORD_HUNT); break;
        case 'chain': setView(AppView.GAME_CHAIN); break;
        case 'connect': setView(AppView.GAME_CONNECT); break;
    }
  }, [selectedGameType]);

  const handleWin = (bonus = 0) => {
      playSound('win');
      setIsGameWon(true);
      setStatus(GameStatus.WON);
      setCoins(prev => prev + WIN_REWARD + bonus);
  };

  const handleLose = () => {
      playSound('wrong');
      setIsGameWon(false);
      setStatus(GameStatus.LOST);
  };

  const handleCompassWin = useCallback((winningWord: string, count: number, bonusCoins: number) => {
    setFinalGuessCount(count);
    handleWin(bonusCoins);
  }, []);

  const handleHangmanWin = useCallback((winningWord: string) => handleWin(10), []);
  const handleHangmanLose = useCallback((winningWord: string) => handleLose(), []);
  
  const handleWordHuntWin = useCallback(() => handleWin(15), []);
  
  const handleChainWin = useCallback(() => handleWin(25), []);
  const handleChainLose = useCallback(() => handleLose(), []);
  
  const handleConnectWin = useCallback(() => handleWin(20), []);
  
  const handleLadderWin = useCallback(() => handleWin(15), []);

  const handleReset = useCallback(() => {
    playSound('click');
    if (view === AppView.GAME_LADDER) {
        setStatus(GameStatus.MENU);
        setTimeout(() => setStatus(GameStatus.PLAYING), 50);
        return;
    }

    if (currentCategory) {
      startGame(currentCategory);
    }
  }, [currentCategory, startGame, view]);

  // -- Renders --

  const renderCategoryMenu = () => {
    const filteredCategories = CATEGORIES.filter(c => c.group === categoryMode);
    
    // Theme colors based on game type
    let bgClass = 'bg-gradient-to-br from-indigo-500 to-purple-600';
    let accentText = 'text-indigo-900';
    let gameTitle = 'Pusula';

    if (selectedGameType === 'hangman') {
        bgClass = 'bg-gradient-to-br from-orange-500 to-red-600';
        accentText = 'text-orange-900';
        gameTitle = 'Adam Asmaca';
    } else if (selectedGameType === 'word_hunt') {
        bgClass = 'bg-gradient-to-br from-teal-500 to-emerald-600';
        accentText = 'text-teal-900';
        gameTitle = 'Kelime Avı';
    } else if (selectedGameType === 'chain') {
        bgClass = 'bg-gradient-to-br from-purple-600 to-pink-600';
        accentText = 'text-purple-900';
        gameTitle = 'Zincir';
    } else if (selectedGameType === 'connect') {
        bgClass = 'bg-gradient-to-br from-pink-500 to-rose-600';
        accentText = 'text-pink-900';
        gameTitle = 'Kelime Kulesi';
    }

    return (
      <div className={`h-full w-full overflow-y-auto ${bgClass}`}>
        <div className="flex flex-col items-center min-h-full p-4 pb-20">
          {/* Navbar */}
          <div className="w-full max-w-md flex justify-between items-center mb-6 pt-2">
             <button onClick={navigateToHub} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition active:scale-95">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
             </button>
             <div className="bg-white/90 px-4 py-1 rounded-full font-bold flex items-center text-sm shadow-lg">
               <span className={accentText}>{gameTitle}</span>
             </div>
             <div className="bg-yellow-400 text-indigo-900 px-4 py-1 rounded-full font-bold flex items-center text-sm shadow-lg">
               {coins} 🪙
             </div>
          </div>
  
          <div className="mb-6 text-center text-white">
            <h1 className="text-4xl font-black mb-1 tracking-tight">Kategori Seç</h1>
            <p className="text-white/80 text-sm">Hangi konuda yarışmak istersin?</p>
          </div>

          {/* Tab Switcher */}
          <div className="bg-black/20 p-1 rounded-2xl flex w-full max-w-md mb-6">
            <button 
              onClick={() => { playSound('click'); setCategoryMode('general'); }}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${categoryMode === 'general' ? `bg-white ${accentText} shadow-lg` : 'text-white/80 hover:bg-white/10'}`}
            >
              Genel
            </button>
            <button 
              onClick={() => { playSound('click'); setCategoryMode('education'); }}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${categoryMode === 'education' ? `bg-white ${accentText} shadow-lg` : 'text-white/80 hover:bg-white/10'}`}
            >
              Öğrenci 🎓
            </button>
          </div>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md animate-fade-in">
            {filteredCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => startGame(cat)}
                className="group relative flex items-center p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 hover:scale-[1.02] active:scale-95 text-left"
              >
                <span className="text-3xl mr-3 group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
                <div className="text-white">
                  <span className="block text-lg font-bold">{cat.label}</span>
                  <span className="text-xs text-white/70">{cat.words.length} Kelime</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- Theme Wrapper ---
  // Simple implementation for background themes
  const getThemeClass = () => {
      switch(activeTheme) {
          case 'theme_dark': return 'bg-slate-900 text-slate-100'; 
          case 'theme_forest': return 'bg-emerald-100 text-emerald-900';
          default: return 'bg-white text-slate-900';
      }
  }

  return (
    <div className={`h-full w-full ${getThemeClass()} transition-colors duration-500`}>
      {/* Privacy Modal (one-time) */}
      {showPrivacy && (
        <PrivacyModal onAccept={handleAcceptPrivacy} />
      )}

      {/* Global Modals */}
      {showDailyReward && (
          <DailyRewardModal onClaim={handleClaimDailyReward} />
      )}
      
      {showHowToPlay && selectedGameType && (
          <HowToPlayModal gameType={selectedGameType} onClose={() => setShowHowToPlay(false)} />
      )}
      
      {showShop && (
          <ShopModal 
            coins={coins} 
            inventory={inventory} 
            onClose={() => setShowShop(false)} 
            onPurchase={handleShopPurchase}
            activeTheme={activeTheme}
            onEquipTheme={setActiveTheme}
          />
      )}

      {/* Main Hub */}
      {view === AppView.HUB && (
        <MainHub 
            onSelectCompass={() => handleSelectGame('compass')} 
            onSelectHangman={() => handleSelectGame('hangman')}
            onSelectWordHunt={() => handleSelectGame('word_hunt')}
            onSelectChain={() => handleSelectGame('chain')}
            onSelectConnect={() => handleSelectGame('connect')}
            onSelectLadder={handleSelectLadderGame}
            onOpenShop={() => setShowShop(true)}
            coins={coins}
            activeTheme={activeTheme}
        />
      )}

      {/* Category Selection for ANY game */}
      {view === AppView.CATEGORY_SELECTION && renderCategoryMenu()}

      {/* COMPASS GAME */}
      {view === AppView.GAME_COMPASS && status === GameStatus.PLAYING && currentCategory && (
        <div className="h-full relative">
            <button onClick={toggleHowToPlay} className="absolute top-20 right-4 z-50 bg-white/80 p-2 rounded-full shadow text-xs font-bold text-indigo-900">
                ❓
            </button>
            <GameScreen 
                category={currentCategory}
                secretWord={secretWord}
                onWin={handleCompassWin}
                onBack={navigateBackToCategories}
                coins={coins}
                onSpendCoins={handleSpendCoins}
            />
        </div>
      )}

      {/* HANGMAN GAME */}
      {view === AppView.GAME_HANGMAN && status === GameStatus.PLAYING && currentCategory && (
         <div className="h-full relative">
            <button onClick={toggleHowToPlay} className="absolute top-20 right-4 z-50 bg-white/80 p-2 rounded-full shadow text-xs font-bold text-orange-900">
                ❓
            </button>
            <HangmanGame
                category={currentCategory}
                secretWord={secretWord}
                onWin={handleHangmanWin}
                onLose={handleHangmanLose}
                onBack={navigateBackToCategories}
                coins={coins}
                onSpendCoins={handleSpendCoins}
            />
        </div>
      )}

      {/* WORD HUNT GAME */}
      {view === AppView.GAME_WORD_HUNT && status === GameStatus.PLAYING && currentCategory && (
         <div className="h-full relative">
            <button onClick={toggleHowToPlay} className="absolute top-20 right-4 z-50 bg-white/80 p-2 rounded-full shadow text-xs font-bold text-teal-900">
                ❓
            </button>
            <WordHuntGame
                category={currentCategory}
                onWin={handleWordHuntWin}
                onBack={navigateBackToCategories}
            />
        </div>
      )}

      {/* CHAIN GAME */}
      {view === AppView.GAME_CHAIN && status === GameStatus.PLAYING && currentCategory && (
         <div className="h-full relative">
            <button onClick={toggleHowToPlay} className="absolute top-20 right-4 z-50 bg-white/80 p-2 rounded-full shadow text-xs font-bold text-purple-900">
                ❓
            </button>
            <ChainGame
                category={currentCategory}
                onWin={handleChainWin}
                onLose={handleChainLose}
                onBack={navigateBackToCategories}
            />
        </div>
      )}

      {/* CONNECT GAME */}
      {view === AppView.GAME_CONNECT && status === GameStatus.PLAYING && currentCategory && (
         <div className="h-full relative">
            <button onClick={toggleHowToPlay} className="absolute top-20 right-4 z-50 bg-white/80 p-2 rounded-full shadow text-xs font-bold text-pink-900">
                ❓
            </button>
            <ConnectGame
                category={currentCategory}
                onWin={handleConnectWin}
                onBack={navigateBackToCategories}
            />
        </div>
      )}

      {/* LADDER GAME */}
      {view === AppView.GAME_LADDER && status === GameStatus.PLAYING && (
         <div className="h-full relative">
            <button onClick={toggleHowToPlay} className="absolute top-20 right-4 z-50 bg-white/80 p-2 rounded-full shadow text-xs font-bold text-blue-900">
                ❓
            </button>
            <LadderGame 
                onWin={handleLadderWin}
                onBack={navigateBackToCategories}
                coins={coins}
                onSpendCoins={handleSpendCoins}
            />
        </div>
      )}

      {/* GENERIC RESULT MODAL */}
      {(status === GameStatus.WON || status === GameStatus.LOST) && (
        <>
           {view === AppView.GAME_COMPASS && <div className="absolute inset-0 bg-indigo-900 blur-sm opacity-50 z-0"></div>}
           <ResultModal 
             word={
               view === AppView.GAME_WORD_HUNT || view === AppView.GAME_CONNECT || view === AppView.GAME_LADDER
                 ? "Bölüm Tamamlandı!" 
                 : view === AppView.GAME_CHAIN 
                    ? (status === GameStatus.WON ? "Kazandın!" : "Süre Doldu!")
                    : secretWord
             }
             guessCount={view === AppView.GAME_COMPASS ? finalGuessCount : undefined}
             earnedCoins={
                 view === AppView.GAME_CHAIN ? 25 :
                 view === AppView.GAME_WORD_HUNT ? 15 :
                 view === AppView.GAME_HANGMAN ? 10 :
                 20
             }
             isWin={status === GameStatus.WON}
             onReset={handleReset}
             onChangeCategory={navigateBackToCategories}
           />
        </>
      )}
    </div>
  );
};

export default App;