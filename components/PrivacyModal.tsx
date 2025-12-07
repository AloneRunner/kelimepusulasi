import React from 'react';

interface PrivacyModalProps {
  onAccept: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ onAccept }) => {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-xl font-black text-slate-900">Gizlilik Politikası</h2>
          <p className="text-xs text-slate-500">Lutfen uygulamayi kullanmadan once okuyup onaylayin.</p>
        </div>

        <div className="px-6 py-4 space-y-3 max-h-[60vh] overflow-y-auto text-sm text-slate-800">
          <p><strong>Veri Toplama:</strong> Kisisel bilgi toplamayiz. Oyun ilerlemeniz ve tercihleriniz cihazinizda local storage ile saklanir.</p>
          <p><strong>Internet Kullanimi:</strong> Oyun varliklari icin baglanti kullanilabilir. Ilerde reklam/IAP icin Google servislerine baglanti gerekebilir; PII gondermeyiz.</p>
          <p><strong>Ucguncu Taraf:</strong> Su an reklam/analitik yok. Ilerde reklam veya uygulama ici satin alma eklenirse guncelleme yapilacak.</p>
          <p><strong>Cocuklar:</strong> 13 yas altina uygun, kisi verisi islenmez.</p>
          <p><strong>Veri Silme:</strong> Uygulamayi kaldirarak veya cihaz ayarlarindan veriyi temizleyerek tum oyun verisini silebilirsiniz.</p>
          <p><strong>Iletisim:</strong> Soru/iletisim icin: kaanozarik@gmail.com</p>
          <p className="text-xs text-slate-500">Tam metin: PRIVACY_POLICY.md icinde; gerekirse web uzerinden paylasin.</p>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onAccept}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold shadow hover:bg-indigo-700 active:scale-95 transition"
          >
            Okudum, Kabul Ediyorum
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
