import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Send,
  AlertTriangle,
  Crown,
  Ghost,
  CheckCircle2,
  RefreshCw,
  BrainCircuit,
  Bot,
  Eye,
  EyeOff,
  Search,
  ArrowLeft
} from 'lucide-react';
import { Button } from './Button';
import { TurkishKeyboard } from './TurkishKeyboard';
import { generateGameSession, generateAiClue, simulateAiVotes } from '../services/geminiService';
import { GamePhase, GameMode, Player, GameData, Clue, VoteResult } from '../types';

// Helper to shuffle array
function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

const BOT_NAMES = ["Ahmet", "Ayşe", "Mehmet", "Fatma", "Can", "Zeynep", "Barış", "Elif", "Deniz", "Ege"];

interface KostebekAviGameProps {
  onBack: () => void;
}

const KostebekAviGame: React.FC<KostebekAviGameProps> = ({ onBack }) => {
  // --- State ---
  const [phase, setPhase] = useState<GamePhase>(GamePhase.SETUP);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [botCount, setBotCount] = useState(3);

  const [gameData, setGameData] = useState<GameData | null>(null);

  // Multi-Game State
  const [currentGameNumber, setCurrentGameNumber] = useState(1);
  const [totalGames] = useState(5); // 5 oyun sonra kazanan belli olur
  const [cumulativeScores, setCumulativeScores] = useState<Record<string, number>>({});

  // Gameplay State
  const [currentRound, setCurrentRound] = useState(1);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [clues, setClues] = useState<Clue[]>([]);
  const [currentClueInput, setCurrentClueInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [showRoleReveal, setShowRoleReveal] = useState(false);
  const [showLastClueTransition, setShowLastClueTransition] = useState(false);

  // Voting State
  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(null);
  const [aiVotes, setAiVotes] = useState<VoteResult[]>([]);
  const [voteResult, setVoteResult] = useState<{ winner: 'civilians' | 'imposter', reason: string } | null>(null);

  const totalRounds = 2;
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of clues
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [clues]);

  // --- AI Turn Logic ---
  useEffect(() => {
    if (phase === GamePhase.GAMEPLAY) {
      const currentPlayer = players[currentTurnIndex];

      if (!currentPlayer.isHuman && !isAiThinking) {
        // Trigger AI Turn
        const playAiTurn = async () => {
          setIsAiThinking(true);

          // Simulate "thinking" delay based on realism (1s - 2.5s)
          const delay = Math.random() * 1500 + 1000;
          await new Promise(r => setTimeout(r, delay));

          if (gameData) {
            const clueText = await generateAiClue(currentPlayer, gameData, clues, GameMode.VARIANT);
            addClue(currentPlayer, clueText);
          }

          setIsAiThinking(false);
        };
        playAiTurn();
      }
    }
  }, [phase, currentTurnIndex, players, gameData, clues, isAiThinking]);

  // --- Handlers: Setup ---

  const startGame = async () => {
    if (!playerName.trim()) return;

    setPhase(GamePhase.LOADING);

    // 1. Fetch Game Data (Local)
    const data = await generateGameSession(GameMode.VARIANT);
    setGameData(data);

    // 2. Determine Roles & Words
    // In Variant mode, we assign roles first, then give the corresponding word.
    const totalPlayers = botCount + 1;
    const imposterIndex = Math.floor(Math.random() * totalPlayers);

    // 3. Create Players
    const human: Player = {
      id: 'human-player',
      name: playerName.trim(),
      role: imposterIndex === 0 ? 'imposter' : 'civilian',
      word: imposterIndex === 0 ? data.imposterWord : data.secretWord,
      isEliminated: false,
      votesReceived: 0,
      isHuman: true,
      avatarId: 0,
      score: 0
    };

    const selectedBotNames = shuffle(BOT_NAMES).slice(0, botCount);
    const bots: Player[] = selectedBotNames.map((name, idx) => {
      const isBotImposter = (idx + 1) === imposterIndex;
      return {
        id: `bot-${name}`,
        name: name,
        role: isBotImposter ? 'imposter' : 'civilian',
        word: isBotImposter ? data.imposterWord : data.secretWord,
        isEliminated: false,
        votesReceived: 0,
        isHuman: false,
        avatarId: idx + 1,
        score: 0
      };
    });

    setPlayers([human, ...bots]);

    // Start Game
    setPhase(GamePhase.ROLE_REVEAL);
    setShowRoleReveal(true);
  };

  // --- Handlers: Gameplay ---

  const handleStartRound = () => {
    setPhase(GamePhase.GAMEPLAY);
    setCurrentRound(1);
    setCurrentTurnIndex(0);
    setClues([]);
  };

  const addClue = (player: Player, text: string) => {
    const newClue: Clue = {
      playerId: player.id,
      playerName: player.name,
      text: text,
      round: currentRound
    };
    setClues(prev => [...prev, newClue]);
    advanceTurn();
  };

  const advanceTurn = async () => {
    if (currentTurnIndex < players.length - 1) {
      setCurrentTurnIndex(prev => prev + 1);
    } else {
      // End of round
      if (currentRound < totalRounds) {
        setCurrentRound(prev => prev + 1);
        setCurrentTurnIndex(0);
      } else {
        // Son ipucunu göster, sonra oylamaya geç
        setShowLastClueTransition(true);

        // Bot oylarını al (arka planda)
        await processAiVotes();

        // 2 saniye bekle ki kullanıcı son ipucunu görsün
        setTimeout(() => {
          setShowLastClueTransition(false);
          setPhase(GamePhase.VOTING);
        }, 2000);
      }
    }
  };

  const submitHumanClue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClueInput.trim()) return;

    const currentPlayer = players[currentTurnIndex];
    if (currentPlayer.isHuman) {
      addClue(currentPlayer, currentClueInput.trim());
      setCurrentClueInput('');
    }
  };

  // --- Handlers: Voting ---

  const processAiVotes = async () => {
    if (!gameData) return;

    const bots = players.filter(p => !p.isHuman);
    const results = await simulateAiVotes(bots, players, clues, gameData);
    setAiVotes(results);
  };

  const handleFinalizeVote = () => {
    if (!selectedSuspectId) return;

    // 1. Tally Votes
    const voteCounts: Record<string, number> = {};
    players.forEach(p => voteCounts[p.id] = 0);

    // Human Vote
    voteCounts[selectedSuspectId]++;

    // AI Votes
    aiVotes.forEach(v => {
      if (voteCounts[v.suspectId] !== undefined) {
        voteCounts[v.suspectId]++;
      }
    });

    // Find Eliminated Player
    let maxVotes = 0;
    let eliminatedId = "";
    Object.entries(voteCounts).forEach(([pid, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        eliminatedId = pid;
      }
    });

    // Check tie logic (simple: if tie, first one gets eliminated for now)
    const eliminatedPlayer = players.find(p => p.id === eliminatedId);
    const imposter = players.find(p => p.role === 'imposter');
    const humanPlayer = players.find(p => p.isHuman);

    // Award scores based on outcome
    const updatedPlayers = players.map(p => {
      let earnedPoints = 0;

      if (!eliminatedPlayer) {
        // Tie - Imposter wins
        if (p.role === 'imposter') earnedPoints = 150;
      } else if (eliminatedPlayer.role === 'imposter') {
        // Civilians win
        if (p.role === 'civilian') earnedPoints = 100;
        // Bonus for human if they voted correctly
        if (p.isHuman && selectedSuspectId === eliminatedPlayer.id) earnedPoints += 50;
      } else {
        // Imposter wins (wrong person eliminated)
        if (p.role === 'imposter') earnedPoints = 150;
      }

      return { ...p, score: p.score + earnedPoints };
    });

    setPlayers(updatedPlayers);

    if (!eliminatedPlayer) {
      setVoteResult({
        winner: 'imposter',
        reason: "Oylar çok dağıldı. Hain kalabalıkta kayboldu."
      });
    } else if (eliminatedPlayer.role === 'imposter') {
      setVoteResult({
        winner: 'civilians',
        reason: `Tebrikler! ${eliminatedPlayer.name} haindi ve yakalandı.`
      });
    } else {
      setVoteResult({
        winner: 'imposter',
        reason: `Eyvah! Masum olan ${eliminatedPlayer.name} elendi. Hain sırıtarak izliyor.`
      });
    }

    setPhase(GamePhase.RESULTS);
  };

  const continueToNextGame = async () => {
    // Update cumulative scores
    const newCumulativeScores = { ...cumulativeScores };
    players.forEach(p => {
      if (!newCumulativeScores[p.id]) newCumulativeScores[p.id] = 0;
      newCumulativeScores[p.id] += p.score;
    });
    setCumulativeScores(newCumulativeScores);

    if (currentGameNumber < totalGames) {
      // Continue to next game
      setCurrentGameNumber(prev => prev + 1);
      setVoteResult(null);
      setClues([]);
      setSelectedSuspectId(null);
      setAiVotes([]);

      // Generate new game data
      setPhase(GamePhase.LOADING);
      const data = await generateGameSession(GameMode.VARIANT);
      setGameData(data);

      // Reassign roles (shuffle players and pick new imposter)
      const shuffledPlayers = shuffle([...players]);
      const imposterIndex = Math.floor(Math.random() * shuffledPlayers.length);

      const newPlayers = shuffledPlayers.map((p, idx) => ({
        ...p,
        role: idx === imposterIndex ? 'imposter' as const : 'civilian' as const,
        word: idx === imposterIndex ? data.imposterWord : data.secretWord,
        score: 0, // Reset individual game score
        isEliminated: false,
        votesReceived: 0
      }));

      setPlayers(newPlayers);
      setPhase(GamePhase.ROLE_REVEAL);
      setShowRoleReveal(true);
    } else {
      // Tournament over - show final results
      // (We'll keep the results screen but show cumulative scores)
    }
  };

  const resetTournament = () => {
    setCurrentGameNumber(1);
    setCumulativeScores({});
    setVoteResult(null);
    setClues([]);
    setGameData(null);
    setSelectedSuspectId(null);
    setAiVotes([]);
    setPhase(GamePhase.SETUP);
  };

  // --- Render Sections ---

  const renderSetup = () => (
    <div className="max-w-md mx-auto space-y-8 animate-in fade-in zoom-in duration-300 relative pt-10">
      <button
        onClick={onBack}
        className="absolute top-0 left-0 text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Geri Dön</span>
      </button>

      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
          Köstebek Avı
        </h1>
        <p className="text-slate-400 font-medium">
          Offline Tek Kişilik Mod
        </p>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 space-y-6 backdrop-blur-sm shadow-xl">

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Oyuncu İsmin</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Adın nedir?"
            className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            autoCapitalize="words"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Oyuncu Sayısı: {botCount + 1}</label>
          <input
            type="range"
            min="3"
            max="6"
            value={botCount}
            onChange={(e) => setBotCount(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>4 Kişi</span>
            <span>7 Kişi</span>
          </div>
        </div>

        <div className="bg-indigo-900/20 p-4 rounded-xl border border-indigo-500/20">
          <p className="text-sm text-indigo-300 flex gap-2">
            <BrainCircuit className="w-5 h-5 flex-shrink-0" />
            <span>
              Yapay zeka oyuncular birbirine benzeyen iki kelime (örn: Elma/Armut) üzerinden konuşacak. Haini bulmaya çalış!
            </span>
          </p>
        </div>
      </div>

      <Button
        fullWidth
        onClick={startGame}
        disabled={!playerName.trim()}
        className="text-lg py-4 shadow-indigo-500/20"
      >
        <Play className="w-5 h-5 inline-block mr-2" />
        Oyunu Başlat
      </Button>
    </div>
  );

  const renderRoleReveal = () => {
    const humanPlayer = players.find(p => p.isHuman);
    if (!humanPlayer) return null;

    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-md mx-auto space-y-8 animate-in slide-in-from-bottom duration-500">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white mb-2">Görev Kartın</h1>
          <p className="text-slate-400">Gizli tut. Kimseye gösterme.</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl relative overflow-hidden w-full max-w-sm">
          <div className="flex flex-col items-center gap-8 animate-in zoom-in duration-200">

            <div className="w-full bg-slate-900 rounded-xl p-8 text-center relative group cursor-pointer" onClick={() => setShowRoleReveal(!showRoleReveal)}>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4">GİZLİ KELİME</p>
              {showRoleReveal ? (
                <p className="text-4xl font-extrabold text-white tracking-wide">{humanPlayer.word}</p>
              ) : (
                <p className="text-4xl font-extrabold text-slate-700 blur-sm select-none">??????</p>
              )}
              <div className="mt-4 flex justify-center text-slate-500">
                {showRoleReveal ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-amber-200 font-bold text-sm">DİKKAT!</p>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Rolünü henüz bilmiyorsun. Bir başkasıyla kelimen aynı olmayabilir.
                    İpuçlarını dikkatlice dinle, çoğunlukta mısın yoksa azınlıkta mı anla!
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={handleStartRound} className="w-full py-4 text-lg">
              Anlaşıldı
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderGameplay = () => {
    const currentPlayer = players[currentTurnIndex];
    return (
      <div className="h-full flex flex-col bg-slate-900">
        {/* Fixed Header */}
        <div className="flex-shrink-0 bg-slate-900/50 p-3 border-b border-slate-800">
          <div className="flex justify-between items-center">
            <button
              onClick={onBack}
              className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Geri</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-indigo-900/30 px-3 py-1 rounded-lg border border-indigo-500/30">
                <span className="text-xs text-indigo-300 font-bold">Oyun {currentGameNumber}/{totalGames}</span>
              </div>
              <div className="bg-slate-800 p-2 rounded-lg">
                <span className="block text-[10px] text-slate-500 uppercase font-bold text-center">TUR</span>
                <span className="block text-xl font-bold text-white text-center leading-none">{currentRound}/{totalRounds}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Kategori</span>
                <span className="text-indigo-400 font-bold">{gameData?.category}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Senin Kelimen</span>
              <span className="text-white font-bold tracking-wide">{players.find(p => p.isHuman)?.word}</span>
            </div>
          </div>
        </div>

        {/* Clues Stream - Fixed Height */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-4 px-4 py-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900"
          style={{
            WebkitOverflowScrolling: 'touch',
            maxHeight: 'calc(100vh - 360px)'
          }}
        >
          {clues.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-slate-600 italic">
              <Search className="w-12 h-12 mb-2 opacity-20" />
              <p>Oyun başlıyor...</p>
            </div>
          )}

          {clues.map((clue, idx) => {
            const isMe = clue.playerId === 'human-player';
            return (
              <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className="flex items-center gap-2 mb-1 px-1">
                  {!isMe && (
                    <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-slate-300 font-bold">
                      {clue.playerName.charAt(0)}
                    </div>
                  )}
                  <span className="text-xs text-slate-400 font-bold">{clue.playerName}</span>
                </div>
                <div className={`px-5 py-3 rounded-2xl max-w-[85%] text-base shadow-sm relative ${isMe
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-700 text-slate-200 rounded-tl-none border border-slate-600'
                  }`}>
                  {clue.text}
                </div>
              </div>
            );
          })}

          {/* AI Typing Indicator */}
          {isAiThinking && currentPlayer && !currentPlayer.isHuman && (
            <div className="flex flex-col items-start animate-pulse">
              <div className="flex items-center gap-2 mb-1 px-1">
                <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-slate-300 font-bold">
                  {currentPlayer.name.charAt(0)}
                </div>
                <span className="text-xs text-slate-400 font-bold">{currentPlayer.name}</span>
              </div>
              <div className="bg-slate-800/50 text-slate-400 px-4 py-3 rounded-2xl rounded-tl-none border border-slate-700/50">
                <div className="flex gap-1.5 h-6 items-center">
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area - REPLACED WITH TURKISH KEYBOARD */}
        <TurkishKeyboard
          value={currentClueInput}
          onChange={setCurrentClueInput}
          onSubmit={() => {
            if (currentPlayer.isHuman && currentClueInput.trim()) {
              submitHumanClue(new Event('submit') as any);
            }
          }}
          placeholder={currentPlayer.isHuman ? "Kelimenle ilgili bir ipucu yaz..." : `${currentPlayer.name} düşünüyor...`}
          disabled={!currentPlayer.isHuman || showLastClueTransition}
          maxLength={25}
          theme="dark"
        />

        {/* Son ipucu sonrası oylama geçiş bannerı (altta, küçük) */}
        {showLastClueTransition && (
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-900 to-indigo-900/90 p-4 z-50 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-white font-bold">Oylamaya geçiliyor...</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderVoting = () => (
    <div
      className="max-w-md mx-auto space-y-4 text-center animate-in fade-in duration-500 px-4 py-4"
      style={{
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-y',
        overflowY: 'auto',
        minHeight: '100vh',
        paddingBottom: '120px'
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Geri</span>
        </button>
        <div className="w-10"></div>
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-white">Oylama Zamanı</h2>
        <p className="text-slate-400 text-sm">
          İpuçları kimin kelimesiyle uyuşmuyor?
        </p>
      </div>

      <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 text-left mb-4 max-h-36 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}>
        <h4 className="font-bold text-xs text-slate-500 uppercase mb-2 sticky top-0 bg-slate-900/90 py-1 backdrop-blur">Son İpuçları</h4>
        <ul className="space-y-2 text-sm">
          {clues.map((c, i) => (
            <li key={i} className="flex justify-between items-center border-b border-slate-800/50 pb-2 last:border-0">
              <span className="font-bold text-slate-400 text-xs">{c.playerName}</span>
              <span className="text-slate-200 bg-slate-800 px-2 py-1 rounded text-xs">"{c.text}"</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {players.filter(p => p.id !== 'human-player').map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedSuspectId(p.id)}
            className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all relative overflow-hidden group ${selectedSuspectId === p.id
              ? 'border-red-500 bg-red-500/10 ring-2 ring-red-500/50'
              : 'border-slate-700 bg-slate-800 hover:border-slate-500'
              }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-lg font-bold text-slate-300">
                {p.name.charAt(0)}
              </div>
              <div className="text-left">
                <span className="font-bold text-base block text-slate-200 group-hover:text-white">{p.name}</span>
                <span className="text-xs text-slate-500">Şüpheliyi seç</span>
              </div>
            </div>
            {selectedSuspectId === p.id && (
              <div className="bg-red-500 p-1 rounded-full animate-in zoom-in">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="pt-4 pb-8">
        <Button
          variant="danger"
          fullWidth
          onClick={handleFinalizeVote}
          disabled={!selectedSuspectId}
          className="text-lg py-4 shadow-red-900/20"
        >
          Oylamayı Tamamla
        </Button>
      </div>
    </div>
  );

  const renderResults = () => {
    if (!voteResult || !gameData) return null;

    const imposter = players.find(p => p.role === 'imposter');
    const human = players.find(p => p.isHuman);
    const humanWon = (human?.role === 'civilian' && voteResult.winner === 'civilians') || (human?.role === 'imposter' && voteResult.winner === 'imposter');

    return (
      <div className="max-w-md mx-auto text-center space-y-6 animate-in zoom-in duration-500 pb-10 mt-8 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch', maxHeight: 'calc(100vh - 2rem)' }}>
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={onBack}
            className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Ana Menü</span>
          </button>
          <div className="w-10"></div>
        </div>

        <div className="relative">
          {humanWon ? (
            <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-2xl shadow-green-500/30 mb-6 animate-bounce">
              <Crown className="w-14 h-14 text-white" />
            </div>
          ) : (
            <div className="w-28 h-28 bg-gradient-to-br from-red-500 to-rose-700 rounded-full mx-auto flex items-center justify-center shadow-2xl shadow-red-500/30 mb-6 animate-pulse">
              <Ghost className="w-14 h-14 text-white" />
            </div>
          )}

          <h2 className="text-4xl font-black text-white mb-2">
            {humanWon ? 'KAZANDIN!' : 'KAYBETTİN!'}
          </h2>
          <p className="text-slate-400 text-lg">{voteResult.reason}</p>
        </div>

        <div className="bg-slate-800 p-1 rounded-2xl border border-slate-600 overflow-hidden">
          <div className="bg-slate-900/80 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <span className="text-slate-400 font-medium">Masum Kelimesi</span>
              <span className="text-green-400 font-bold text-xl">{gameData.secretWord}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <span className="text-slate-400 font-medium">Hain Kelimesi</span>
              <span className="text-amber-400 font-bold text-xl">{gameData.imposterWord}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-400 font-medium">Hain Kimdi?</span>
              <span className="text-red-400 font-bold text-xl flex items-center gap-2">
                {imposter?.name}
                {imposter?.id === 'human-player' && <span className="bg-red-500/20 text-red-300 text-[10px] px-2 py-0.5 rounded-full uppercase">Sen</span>}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-1 rounded-2xl border border-indigo-500/30 overflow-hidden">
          <div className="bg-slate-900/80 p-5">
            <h3 className="text-center text-lg font-bold text-indigo-300 mb-4 flex items-center justify-center gap-2">
              <Crown className="w-5 h-5" />
              {currentGameNumber < totalGames ? 'Bu Eldeki Puanlar' : 'Toplam Puan Durumu'}
            </h3>
            <div className="space-y-2">
              {[...players].sort((a, b) => {
                const aTotal = (cumulativeScores[a.id] || 0);
                const bTotal = (cumulativeScores[b.id] || 0);
                return bTotal - aTotal;
              }).map((player, idx) => {
                const totalScore = cumulativeScores[player.id] || 0;
                return (
                  <div
                    key={player.id}
                    className={`flex justify-between items-center p-3 rounded-lg ${player.isHuman
                      ? 'bg-indigo-500/20 border border-indigo-500/40'
                      : 'bg-slate-800/50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-black ${idx === 0 ? 'text-yellow-400' :
                        idx === 1 ? 'text-slate-300' :
                          idx === 2 ? 'text-orange-400' : 'text-slate-500'
                        }`}>
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{player.name}</span>
                          {player.isHuman && (
                            <span className="bg-indigo-500/30 text-indigo-200 text-[9px] px-1.5 py-0.5 rounded-full uppercase font-bold">
                              Sen
                            </span>
                          )}
                        </div>
                        <span className={`text-xs ${player.role === 'imposter' ? 'text-red-400' : 'text-green-400'
                          }`}>
                          {player.role === 'imposter' ? '🎭 Hain' : '✨ Masum'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-yellow-400">
                        {totalScore}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        +{player.score} bu el
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700/50 text-center">
              <p className="text-xs text-slate-400 leading-relaxed">
                💡 <span className="font-bold text-indigo-300">Masum kazanır:</span> +100 puan
                <br />
                🎭 <span className="font-bold text-red-300">Hain kazanır:</span> +150 puan
                <br />
                ⭐ <span className="font-bold text-yellow-300">Doğru oy bonusu:</span> +50 puan
              </p>
            </div>
          </div>
        </div>

        <div className="text-left bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <h4 className="text-xs uppercase font-bold text-slate-500 mb-3 flex items-center gap-2">
            <Bot className="w-4 h-4" /> Bot Oyları
          </h4>
          <div className="space-y-2">
            {aiVotes.map((vote, i) => {
              const voter = players.find(p => p.id === vote.voterId);
              const target = players.find(p => p.id === vote.suspectId);
              if (!voter || !target) return null;
              return (
                <div key={i} className="text-sm flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-300 w-16 truncate">{voter.name}</span>
                    <span className="text-slate-600">→</span>
                    <span className="text-red-300 font-bold">{target.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 italic max-w-[120px] truncate text-right">
                    {vote.reason}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {currentGameNumber < totalGames ? (
          <Button onClick={continueToNextGame} fullWidth className="py-4 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500">
            <Play className="w-5 h-5 mr-2 inline" />
            Sonraki Oyun ({currentGameNumber + 1}/{totalGames})
          </Button>
        ) : (
          <>
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 mb-4">
              <h3 className="text-yellow-400 font-bold text-center mb-3">🏆 Turnuva Tamamlandı!</h3>
              <div className="space-y-2">
                {Object.entries(cumulativeScores)
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .map(([playerId, score], idx) => {
                    const player = players.find(p => p.id === playerId);
                    return (
                      <div key={playerId} className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          {idx === 0 && <Crown className="w-4 h-4 text-yellow-400" />}
                          <span className={idx === 0 ? "text-yellow-400 font-bold" : "text-slate-300"}>
                            {player?.name}
                          </span>
                        </span>
                        <span className="text-indigo-400 font-bold">{score} puan</span>
                      </div>
                    );
                  })}
              </div>
            </div>
            <Button onClick={resetTournament} fullWidth className="py-4 text-lg bg-slate-700 hover:bg-slate-600 border border-slate-500">
              <RefreshCw className="w-5 h-5 mr-2 inline" />
              Yeni Turnuva
            </Button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 p-4 md:p-6 flex flex-col font-sans selection:bg-indigo-500/30">
      <div className="flex-1 w-full max-w-4xl mx-auto">
        {phase === GamePhase.SETUP && renderSetup()}
        {phase === GamePhase.LOADING && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center animate-pulse">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400">Oyun kuruluyor...</p>
          </div>
        )}
        {phase === GamePhase.ROLE_REVEAL && renderRoleReveal()}
        {phase === GamePhase.GAMEPLAY && renderGameplay()}
        {phase === GamePhase.VOTING && renderVoting()}
        {phase === GamePhase.RESULTS && renderResults()}
      </div>
    </div>
  );
};

export default KostebekAviGame;
