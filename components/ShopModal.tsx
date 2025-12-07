
import React from 'react';

interface ShopModalProps {
  coins: number;
  inventory: string[];
  onPurchase: (itemId: string, cost: number) => void;
  onClose: () => void;
  onEquipTheme: (themeId: string) => void;
  activeTheme: string;
}

const ITEMS = [
  { id: 'theme_dark', type: 'theme', name: 'Gece Modu', desc: 'Koyu renkli arayüz.', cost: 200, icon: '🌙' },
  { id: 'theme_forest', type: 'theme', name: 'Orman Teması', desc: 'Yeşil ve ferah tonlar.', cost: 150, icon: '🌲' },
];

const ShopModal: React.FC<ShopModalProps> = ({ coins, inventory, onPurchase, onClose, onEquipTheme, activeTheme }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-slate-50 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-6 bg-white rounded-t-3xl shadow-sm z-10 flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-black text-slate-800">Market</h2>
                <p className="text-slate-500 text-xs">Altınlarını harca, özelleştir.</p>
            </div>
            <div className="bg-yellow-100 px-4 py-2 rounded-full border border-yellow-300 flex items-center">
                <span className="text-xl mr-1">🪙</span>
                <span className="font-bold text-yellow-800">{coins}</span>
            </div>
        </div>

        {/* Items List */}
        <div className="p-6 overflow-y-auto space-y-4">
            
            {/* Daily Bonus (Fake for V1) */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-4 text-white flex items-center justify-between shadow-lg shadow-purple-200">
                <div>
                    <h3 className="font-bold text-lg">Günlük Hediye</h3>
                    <p className="text-purple-100 text-xs">Her gün gel, kazan!</p>
                </div>
                <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-bold backdrop-blur-sm transition">
                    Alındı ✅
                </button>
            </div>

            <h3 className="font-bold text-slate-400 text-sm uppercase tracking-wider mt-4">Temalar</h3>
            
            {ITEMS.map(item => {
                const isOwned = inventory.includes(item.id);
                const isActive = activeTheme === item.id;
                const canAfford = coins >= item.cost;

                return (
                    <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl mr-4">
                                {item.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">{item.name}</h4>
                                <p className="text-xs text-slate-500">{item.desc}</p>
                            </div>
                        </div>

                        {item.type === 'theme' && isOwned ? (
                            <button 
                                onClick={() => onEquipTheme(isActive ? 'default' : item.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition ${isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                {isActive ? 'Seçili' : 'Kullan'}
                            </button>
                        ) : (
                            <button 
                                onClick={() => !isOwned && canAfford && onPurchase(item.id, item.cost)}
                                disabled={!canAfford && !isOwned}
                                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center transition
                                    ${item.type === 'consumable' 
                                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                                        : (canAfford ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-300 shadow-lg shadow-yellow-200' : 'bg-slate-100 text-slate-400 cursor-not-allowed')}`}
                            >
                                {item.cost} 🪙
                            </button>
                        )}
                    </div>
                );
            })}
        </div>

        <div className="p-4 border-t border-slate-200">
            <button onClick={onClose} className="w-full py-3 bg-slate-100 font-bold text-slate-600 rounded-xl hover:bg-slate-200 transition">
                Kapat
            </button>
        </div>
      </div>
    </div>
  );
};

export default ShopModal;
