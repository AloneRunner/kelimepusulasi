
import React, { useEffect, useState } from 'react';
import { getFunFactFromGemini } from '../services/geminiService';
import { playSound } from '../services/audioService';

interface ResultModalProps {
  word: string;
  guessCount?: number;
  earnedCoins: number;
  isWin: boolean;
  onReset: () => void;
  onChangeCategory: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ word, guessCount, earnedCoins, isWin, onReset, onChangeCategory }) => {
  const [fact, setFact] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Sadece kazanıldığında veya kaybedildiğinde kelimeyi açıklayalım
    const fetchFact = async () => {
      const data = await getFunFactFromGemini(word);
      setFact(data);
      setLoading(false);
    };
    fetchFact();
  }, [word]);

  const handleShare = async () => {
      playSound('click');
      
      const shareText = `Kelime Pusulası 🧭
${isWin ? '🏆 Kazandım!' : '😔 Kaybettim'}
Kelime: ${word.toUpperCase()}
${guessCount ? `Tahmin: ${guessCount}` : ''}
Puan: +${earnedCoins} 🪙

Sen de oyna: https://kelime-pusulasi.app`;

      if (navigator.share) {
          try {
              await navigator.share({
                  title: 'Kelime Pusulası Sonucum',
                  text: shareText,
              });
          } catch (err) {
              console.log('Share canceled');
          }
      } else {
          try {
              await navigator.clipboard.writeText(shareText);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
          } catch (err) {
              console.error('Clipboard failed');
          }
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center relative overflow-hidden">
        {/* Header Decoration */}
        <div className={`absolute top-0 left-0 w-full h-2 ${isWin ? 'bg-gradient-to-r from-green-400 to-blue-500' : 'bg-gradient-to-r from-red-500 to-orange-500'}`}></div>

        <h2 className={`text-3xl font-bold mb-2 ${isWin ? 'text-green-600' : 'text-red-600'}`}>
          {isWin ? 'Tebrikler! 🎉' : 'Oyun Bitti 😔'}
        </h2>
        
        {isWin ? (
          <div className="flex justify-center items-center gap-2 mb-6">
             <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-bold text-sm flex items-center">
               +{earnedCoins} 🪙
             </span>
             {guessCount && (
                <span className="text-slate-500 text-sm">{guessCount} Tahminde</span>
             )}
          </div>
        ) : (
          <div className="mb-6 text-slate-500 text-sm">
            Maalesef bilemedin. Bir dahaki sefere!
          </div>
        )}

        <div className="bg-indigo-50 rounded-xl p-4 mb-6">
          <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider mb-1">Doğru Kelime</p>
          <p className="text-3xl font-black text-indigo-700 capitalize">{word}</p>
        </div>

        <div className="mb-6 min-h-[60px]">
          {loading ? (
            <div className="flex items-center justify-center space-x-2 text-slate-400 text-sm">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                <span>Bilgi alınıyor...</span>
            </div>
          ) : (
            <p className="text-slate-600 text-sm italic border-l-2 border-indigo-200 pl-3 text-left">
              "{fact}"
            </p>
          )}
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleShare}
                className="col-span-1 py-3 bg-blue-100 text-blue-700 rounded-xl font-bold hover:bg-blue-200 transition flex items-center justify-center gap-2"
              >
                {copied ? 'Kopyalandı!' : (
                    <>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>
                        Paylaş
                    </>
                )}
              </button>
              <button 
                onClick={onReset}
                className={`col-span-1 py-3 text-white rounded-xl font-bold transition transform hover:scale-[1.02] ${isWin ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-red-500 hover:bg-red-600'}`}
              >
                Tekrar
              </button>
          </div>
          
          <button 
            onClick={onChangeCategory}
            className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition"
          >
            Menüye Dön
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
