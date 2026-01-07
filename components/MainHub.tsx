import React from 'react';
import { Settings } from 'lucide-react';
import { playSound } from '../services/audioService';

interface MainHubProps {
  onSelectCompass: () => void;
  onSelectHangman: () => void;
  onSelectWordHunt: () => void;
  onSelectChain: () => void;
  onSelectConnect: () => void;
  onSelectLadder: () => void;
  onSelectKostebek: () => void;
  onSelectWordle: () => void;
  onOpenShop: () => void;
  onOpenSettings?: () => void;
  coins: number;
  activeTheme?: string;
}

const MainHub: React.FC<MainHubProps> = ({
  onSelectCompass,
  onSelectHangman,
  onSelectWordHunt,
  onSelectChain,
  onSelectConnect,
  onSelectLadder,
  onSelectKostebek,
  onSelectWordle,
  onOpenShop,
  onOpenSettings,
  coins,
  activeTheme = 'default'
}) => {

  const handleGameSelect = (callback?: () => void) => {
    playSound('click');
    if (callback) callback();
  };

  // Dinamik Stil Belirleyici
  const getStyles = () => {
    switch (activeTheme) {
      case 'theme_dark':
        return {
          container: 'bg-slate-900',
          headerText: 'text-indigo-100',
          subText: 'text-slate-400',
          cardBg: 'bg-slate-800',
          cardBorder: 'border-slate-700',
          textColor: 'text-slate-200'
        };
      case 'theme_forest':
        return {
          container: 'bg-emerald-50', // Yeşillik
          headerText: 'text-emerald-900',
          subText: 'text-emerald-700',
          cardBg: 'bg-white',
          cardBorder: 'border-emerald-200',
          textColor: 'text-slate-800'
        };
      default: // Default White
        return {
          container: 'bg-slate-50',
          headerText: 'text-indigo-900',
          subText: 'text-slate-500',
          cardBg: 'bg-white',
          cardBorder: 'border-indigo-100',
          textColor: 'text-slate-800'
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`flex flex-col h-full ${styles.container} transition-colors duration-500`}>
      {/* Header - Kompakt */}
      <header className={`px-4 py-2 flex justify-between items-center ${activeTheme === 'theme_dark' ? 'bg-slate-800' : 'bg-white'} shadow-sm z-10 sticky top-0 transition-colors duration-500`}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎮</span>
          <div>
            <h1 className={`text-lg font-bold ${styles.headerText} leading-tight`}>Kelime Pusulası</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onOpenSettings && (
            <button
              onClick={() => { playSound('pop'); onOpenSettings(); }}
              className="flex items-center justify-center w-9 h-9 bg-slate-100 rounded-full border border-slate-200 hover:bg-slate-200 transition active:scale-95"
              title="Ayarlar"
            >
              <Settings className="w-4 h-4 text-slate-600" />
            </button>
          )}
          <button
            onClick={() => { playSound('pop'); onOpenShop(); }}
            className="flex items-center bg-yellow-100 px-2.5 py-1 rounded-full border border-yellow-200 hover:bg-yellow-200 transition active:scale-95"
          >
            <span className="text-lg mr-1">🪙</span>
            <span className="font-bold text-yellow-800 text-sm">{coins}</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <div className="grid grid-cols-1 gap-6 max-w-md mx-auto">

          {/* Compass Game Card (TOP PRIORITY) */}
          <div
            onClick={() => handleGameSelect(onSelectCompass)}
            className={`group relative ${styles.cardBg} rounded-3xl p-6 shadow-xl border-2 ${styles.cardBorder} cursor-pointer hover:border-indigo-500 transition-all duration-300 hover:shadow-2xl overflow-hidden active:scale-98`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-32 h-32 text-indigo-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" /></svg>
            </div>
            <div className="relative z-10">
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold mb-3 inline-block">Popüler</span>
              <h2 className={`text-3xl font-black ${styles.textColor} mb-2`}>Kelime Pusulası</h2>
              <p className={`${styles.subText} mb-6 line-clamp-2`}>Gizli kelimeyi bulmak için sıcak-soğuk mantığıyla tahmin et.</p>
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-indigo-200 group-hover:bg-indigo-700 transition">
                Oyna
              </button>
            </div>
          </div>

          {/* Ladder Game Card */}
          <div
            onClick={() => handleGameSelect(onSelectLadder)}
            className={`group relative ${styles.cardBg} rounded-3xl p-6 shadow-xl border-2 ${styles.cardBorder} cursor-pointer hover:border-blue-500 transition-all duration-300 hover:shadow-2xl overflow-hidden active:scale-98`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-32 h-32 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </div>
            <div className="relative z-10">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-3 inline-block">Yeni</span>
              <h2 className={`text-3xl font-black ${styles.textColor} mb-2`}>Kelime Merdiveni</h2>
              <p className={`${styles.subText} mb-6`}>Bir harf değiştir, hedefe ulaş. En kısa yolu bulabilir misin?</p>
              <button className="bg-blue-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-blue-200 group-hover:bg-blue-600 transition">
                Oyna
              </button>
            </div>
          </div>

          {/* Kostebek Game Card */}
          <div
            onClick={() => handleGameSelect(onSelectKostebek)}
            className={`group relative ${styles.cardBg} rounded-3xl p-6 shadow-xl border-2 ${styles.cardBorder} cursor-pointer hover:border-red-500 transition-all duration-300 hover:shadow-2xl overflow-hidden active:scale-98`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-32 h-32 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            </div>
            <div className="relative z-10">
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold mb-3 inline-block">Sosyal</span>
              <h2 className={`text-3xl font-black ${styles.textColor} mb-2`}>Köstebek Avı</h2>
              <p className={`${styles.subText} mb-6`}>Haini bul veya hain ol! Yapay zekaya karşı blöf yap.</p>
              <button className="bg-red-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-red-200 group-hover:bg-red-600 transition">
                Oyna
              </button>
            </div>
          </div>

          {/* Word Tower Game Card - GİZLENDİ (geliştirilmeye devam edilecek)
          <div 
            onClick={() => handleGameSelect(onSelectWordle)}
            className={`group relative ${styles.cardBg} rounded-3xl p-6 shadow-xl border-2 ${styles.cardBorder} cursor-pointer hover:border-purple-500 transition-all duration-300 hover:shadow-2xl overflow-hidden active:scale-98`}
          >
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg className="w-32 h-32 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
             </div>
             <div className="relative z-10">
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold mb-3 inline-block">Bulmaca</span>
                <h2 className={`text-3xl font-black ${styles.textColor} mb-2`}>Kelime Kulesi</h2>
                <p className={`${styles.subText} mb-6`}>Harfleri birleştir, çapraz bulmacayı tamamla!</p>
                <button className="bg-purple-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-purple-200 group-hover:bg-purple-600 transition">
                    Oyna
                </button>
             </div>
          </div>
          */}
          {/* Chain Game Card */}
          <div
            onClick={() => handleGameSelect(onSelectChain)}
            className={`group relative ${styles.cardBg} rounded-3xl p-6 shadow-xl border-2 ${styles.cardBorder} cursor-pointer hover:border-purple-500 transition-all duration-300 hover:shadow-2xl overflow-hidden active:scale-98`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-32 h-32 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            </div>
            <div className="relative z-10">
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold mb-3 inline-block">Hızlı</span>
              <h2 className={`text-3xl font-black ${styles.textColor} mb-2`}>Zincir</h2>
              <p className={`${styles.subText} mb-6`}>Son harf, ilk harf olsun! Yapay zekaya karşı yarış.</p>
              <button className="bg-purple-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-purple-200 group-hover:bg-purple-600 transition">
                Oyna
              </button>
            </div>
          </div>

          {/* Word Hunt Game Card */}
          <div
            onClick={() => handleGameSelect(onSelectWordHunt)}
            className={`group relative ${styles.cardBg} rounded-3xl p-6 shadow-xl border-2 ${styles.cardBorder} cursor-pointer hover:border-teal-500 transition-all duration-300 hover:shadow-2xl overflow-hidden active:scale-98`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-32 h-32 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </div>
            <div className="relative z-10">
              <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-bold mb-3 inline-block">Zeka</span>
              <h2 className={`text-3xl font-black ${styles.textColor} mb-2`}>Kelime Avı</h2>
              <p className={`${styles.subText} mb-6`}>Gizlenmiş kelimeleri ızgarada bul.</p>
              <button className="bg-teal-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-teal-200 group-hover:bg-teal-600 transition">
                Oyna
              </button>
            </div>
          </div>

          {/* Hangman Game Card */}
          <div
            onClick={() => handleGameSelect(onSelectHangman)}
            className={`group relative ${styles.cardBg} rounded-3xl p-6 shadow-xl border-2 ${styles.cardBorder} cursor-pointer hover:border-orange-500 transition-all duration-300 hover:shadow-2xl overflow-hidden active:scale-98`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-32 h-32 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
            </div>
            <div className="relative z-10">
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold mb-3 inline-block">Klasik</span>
              <h2 className={`text-3xl font-black ${styles.textColor} mb-2`}>Adam Asmaca</h2>
              <p className={`${styles.subText} mb-6`}>Harfleri seç, adamı ipten kurtar.</p>
              <button className="bg-orange-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-orange-200 group-hover:bg-orange-600 transition">
                Oyna
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MainHub;