import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  useGameKeyboard: boolean;
  onToggleKeyboard: (value: boolean) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  useGameKeyboard,
  onToggleKeyboard 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <Keyboard className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Ayarlar</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Keyboard Setting */}
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                  <Keyboard className="w-5 h-5 text-indigo-600" />
                  Klavye Tipi
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Oyunlarda kullanılacak klavye türünü seçin
                </p>
              </div>
            </div>

            {/* Toggle Options */}
            <div className="space-y-2">
              <button
                onClick={() => onToggleKeyboard(true)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  useGameKeyboard
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800 mb-1">🎮 Oyun Klavyesi</div>
                    <div className="text-xs text-slate-600">
                      Önerilen • Tüm telefonlarda çalışır
                    </div>
                  </div>
                  {useGameKeyboard && (
                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>

              <button
                onClick={() => onToggleKeyboard(false)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  !useGameKeyboard
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800 mb-1">📱 Telefon Klavyesi</div>
                    <div className="text-xs text-slate-600">
                      Bazı telefonlarda sorun yaşanabilir
                    </div>
                  </div>
                  {!useGameKeyboard && (
                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex gap-2">
                <div className="text-blue-600 text-lg">💡</div>
                <div className="text-xs text-blue-800 leading-relaxed">
                  <strong>Oyun Klavyesi:</strong> Tecno, Xiaomi gibi bazı Android telefonlarda telefon klavyesi 
                  sorun yaşayabilir. Bu durumda oyun klavyesini kullanmanızı öneririz.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors active:scale-95"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
