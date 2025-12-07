import React, { useState, useEffect } from 'react';
import { playSound } from '../services/audioService';

interface DailyRewardModalProps {
  onClaim: () => void;
}

interface Confetti {
  id: number;
  left: string;
  bg: string;
  duration: string;
  delay: string;
}

const DailyRewardModal: React.FC<DailyRewardModalProps> = ({ onClaim }) => {
  const [isClaiming, setIsClaiming] = useState(false);
  const [particles, setParticles] = useState<Confetti[]>([]);

  const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

  const handleOpen = () => {
    playSound('win');
    setIsClaiming(true);
    
    // Generate Confetti
    const newParticles: Confetti[] = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        bg: COLORS[Math.floor(Math.random() * COLORS.length)],
        duration: `${2 + Math.random() * 3}s`,
        delay: `${Math.random() * 0.5}s`
    }));
    setParticles(newParticles);

    // Close after animation
    setTimeout(onClaim, 3000); 
  };

  if (isClaiming) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in overflow-hidden">
             
             {/* Confetti Layer */}
             {particles.map(p => (
                 <div 
                    key={p.id}
                    className="confetti-piece rounded-sm"
                    style={{
                        left: p.left,
                        backgroundColor: p.bg,
                        animationDuration: p.duration,
                        animationDelay: p.delay
                    }}
                 />
             ))}

             <div className="text-center animate-bounce z-10">
                <div className="text-8xl mb-4 drop-shadow-2xl">💰</div>
                <div className="text-white text-3xl font-black drop-shadow-md">Ödül Alındı!</div>
                <div className="text-yellow-400 text-5xl font-black mt-4 drop-shadow-xl">+50 Altın</div>
             </div>
        </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center relative overflow-hidden transform transition-all scale-100 hover:scale-[1.02]">
        {/* Background Rays Effect */}
        <div className="absolute inset-0 bg-yellow-50 -z-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-200 rounded-full blur-3xl opacity-50 animate-pulse"></div>

        <h2 className="text-3xl font-black text-slate-800 mb-2">Günlük Hediye!</h2>
        <p className="text-slate-500 mb-8">Her gün gel, hazineni büyüt.</p>

        <div className="relative cursor-pointer group py-4" onClick={handleOpen}>
             <div className="text-8xl transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110 group-active:scale-95 drop-shadow-xl">
                🎁
             </div>
             <div className="absolute -top-2 right-12 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce shadow-lg border-2 border-white">
                Tıkla!
             </div>
        </div>

        <div className="mt-8">
          <button 
            onClick={handleOpen}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3.5 rounded-xl font-bold hover:from-yellow-500 hover:to-orange-600 transition shadow-lg shadow-orange-200 active:scale-95 text-lg"
          >
            Ödülü Al (+50 🪙)
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyRewardModal;