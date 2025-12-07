
import React from 'react';
import { GameType } from '../types';

interface HowToPlayModalProps {
  gameType: GameType;
  onClose: () => void;
}

const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ gameType, onClose }) => {
  const getContent = () => {
    switch (gameType) {
      case 'compass':
        return {
          title: 'Kelime Pusulası',
          steps: [
            { icon: '⌨️', text: 'Gizli bir kelime var. Sen bir kelime tahmin edersin.' },
            { icon: '🌡️', text: 'Sıcak-Soğuk mantığı alfabe sırasına göredir.' },
            { icon: '⬇️', text: 'Eğer "Aşağı" diyorsa, gizli kelime sözlükte daha sonradır (A -> Z).' },
            { icon: '🎯', text: 'Aradaki mesafeyi daraltarak gizli kelimeyi bul.' }
          ]
        };
      case 'ladder':
        return {
          title: 'Kelime Merdiveni',
          steps: [
            { icon: '🪜', text: 'Başlangıç kelimesinden hedef kelimeye ulaşmalısın.' },
            { icon: '🔤', text: 'Her adımda SADECE 1 HARF değiştirebilirsin.' },
            { icon: '✅', text: 'Yazdığın yeni kelime anlamlı ve sözlükte olmalı.' },
            { icon: '🏆', text: 'En az adımda hedefe ulaşarak 3 yıldız kazan.' }
          ]
        };
      case 'word_hunt':
        return {
          title: 'Kelime Avı',
          steps: [
            { icon: '👀', text: 'Yukarıdaki listedeki kelimeleri ızgarada bul.' },
            { icon: '👆', text: 'Parmağını sürükleyerek harfleri seç.' },
            { icon: '↔️', text: 'Kelimeler yatay, dikey veya çapraz olabilir.' },
            { icon: '🧩', text: 'Tüm kelimeleri bulduğunda bölüm biter.' }
          ]
        };
      case 'chain':
        return {
          title: 'Zincir',
          steps: [
            { icon: '🔗', text: 'Son harf, ilk harf olsun!' },
            { icon: '🤖', text: 'Yapay zeka bir kelime söyler (Örn: ElmA).' },
            { icon: '🫵', text: 'Sen "A" ile başlayan bir kelime yazmalısın (Örn: ArmuT).' },
            { icon: '⏳', text: 'Süre bitmeden cevabı yetiştir!' }
          ]
        };
      case 'connect':
        return {
          title: 'Kelime Kulesi',
          steps: [
            { icon: '⭕', text: 'Tekerlekteki harfleri parmağınla birleştir.' },
            { icon: '📝', text: 'Anlamlı kelimeler oluşturup yukarıdaki kutuları doldur.' },
            { icon: '💡', text: 'Bazen gizli (ekstra) kelimeler de olabilir.' }
          ]
        };
      case 'hangman':
        return {
          title: 'Adam Asmaca',
          steps: [
            { icon: '🔤', text: 'Gizli kelimeyi harf harf tahmin et.' },
            { icon: '❤️', text: 'Her yanlış harfte bir canın gider.' },
            { icon: '😵', text: 'Adam tamamen asılmadan kelimeyi bulmalısın.' }
          ]
        };
      default:
        return { title: 'Oyun', steps: [] };
    }
  };

  const content = getContent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full relative overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-100 to-white -z-10"></div>
        
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-indigo-900">{content.title}</h2>
            <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition">
                ✕
            </button>
        </div>

        <div className="space-y-4">
            {content.steps.map((step, idx) => (
                <div key={idx} className="flex items-start bg-white border border-slate-100 p-3 rounded-xl shadow-sm">
                    <span className="text-2xl mr-3">{step.icon}</span>
                    <p className="text-slate-600 text-sm font-medium leading-relaxed">{step.text}</p>
                </div>
            ))}
        </div>

        <button 
            onClick={onClose}
            className="w-full mt-8 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 active:scale-95"
        >
            Anladım, Başla!
        </button>
      </div>
    </div>
  );
};

export default HowToPlayModal;
