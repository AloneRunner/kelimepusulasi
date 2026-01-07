import React, { useState } from 'react';
import { playSound } from '../services/audioService';

interface DailyRewardModalProps {
  onClaim: () => void;
}

const DailyRewardModal: React.FC<DailyRewardModalProps> = ({ onClaim }) => {
  const [isClaiming, setIsClaiming] = useState(false);

  const handleClaim = () => {
    playSound('win');
    setIsClaiming(true);
    setTimeout(onClaim, 1500);
  };

  // Claiming Animation
  if (isClaiming) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-400/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-300" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        {/* Coin Rain Effect */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-3xl animate-bounce"
              style={{
                left: `${5 + (i * 5)}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s'
              }}
            >
              🪙
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center animate-scale-in">
          <div className="text-7xl mb-6 animate-bounce">✨</div>
          <h2 className="text-3xl font-black text-white mb-2 drop-shadow-lg">Hoş Geldin!</h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-5xl">🪙</span>
            <span className="text-5xl font-black text-yellow-400 drop-shadow-lg">+500</span>
          </div>
          <p className="text-white/60 mt-4 text-sm">Hesabına eklendi</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-indigo-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-md">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      {/* Modal Card */}
      <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-6 max-w-xs w-full text-center border border-white/10 shadow-2xl">
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 rounded-3xl blur-xl opacity-20" />

        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🌟</span>
            <h2 className="text-xl font-bold text-white">Günlük Bonus</h2>
          </div>

          {/* Reward Display */}
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-500/20 mb-6">
            <div className="flex items-center justify-center gap-3">
              <span className="text-5xl">🪙</span>
              <div className="text-left">
                <p className="text-yellow-400 text-3xl font-black">500</p>
                <p className="text-white/60 text-xs">Altın</p>
              </div>
            </div>
          </div>

          {/* Info Text */}
          <p className="text-white/50 text-xs mb-6">
            Her gün giriş yap, bonusunu al!
          </p>

          {/* Claim Button */}
          <button
            onClick={handleClaim}
            className="w-full py-3.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-xl 
                       hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 
                       shadow-lg shadow-orange-500/25 active:scale-95 text-lg"
          >
            Topla
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyRewardModal;