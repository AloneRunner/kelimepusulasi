import React from 'react';

interface PrivacyModalProps {
  onAccept: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ onAccept }) => {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-indigo-600 to-purple-600 shrink-0">
          <h2 className="text-lg font-bold text-white">Gizlilik Politikası</h2>
          <p className="text-xs text-white/70">Lütfen uygulamayı kullanmadan önce okuyup onaylayın.</p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 text-sm text-slate-700 space-y-4">

          <p className="text-xs text-slate-400">Son Güncelleme: 7 Aralık 2025</p>

          <section>
            <h3 className="font-bold text-slate-900 mb-1">Giriş</h3>
            <p>Kelime Pusulası olarak, kullanıcılarımızın gizliliğine önem veriyoruz. Bu gizlilik politikası, uygulamayı kullanırken hangi bilgilerin toplandığını, nasıl kullanıldığını ve korunduğunu açıklar.</p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-1">Toplanan Bilgiler</h3>
            <p className="font-medium text-indigo-700 mb-2">Kişisel Bilgiler</p>
            <p>Kelime Pusulası <strong>hiçbir kişisel bilgi toplamaz</strong>:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-600">
              <li>Adınızı veya e-posta adresinizi TOPLAMAZ</li>
              <li>Telefon numaranızı TOPLAMAZ</li>
              <li>Konum bilgilerinizi TOPLAMAZ</li>
              <li>Kişilerinizi TOPLAMAZ</li>
              <li>Fotoğraflarınıza veya medya dosyalarınıza ERİŞMEZ</li>
            </ul>
          </section>

          <section>
            <p className="font-medium text-indigo-700 mb-2">Yerel Depolama (LocalStorage)</p>
            <p>Uygulama, oyun ilerlemenizi saklamak için cihazınızda yerel depolama kullanır:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-600">
              <li>Oyun puanları</li>
              <li>Coin miktarı</li>
              <li>Tema tercihleri</li>
              <li>Günlük ödül durumu</li>
              <li>Satın alınan öğeler</li>
            </ul>
            <p className="mt-2 bg-green-50 p-2 rounded-lg border border-green-200 text-green-800 text-xs">
              <strong>Bu veriler:</strong> Sadece cihazınızda saklanır, sunucularımıza gönderilmez, internet bağlantısı gerektirmez ve uygulama silindiğinde otomatik olarak silinir.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-1">İnternet Kullanımı</h3>
            <p>Uygulama interneti yalnızca oyun varlıklarını indirmek veya güncellemek için kullanabilir. Kişisel veri gönderilmez.</p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-1">Üçüncü Taraf Servisler</h3>
            <p><strong>Reklam & Analytics:</strong> Şu an reklam yok ve analitik yapılmıyor. İleride reklam eklendiğinde bildirim yapılacaktır.</p>
            <p className="mt-1"><strong>Uygulama İçi Satın Almalar:</strong> Şu an yoktur. Eklenirse Google Play Billing kullanılacaktır.</p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-1">Çocukların Gizliliği</h3>
            <p>Uygulamamız <strong>tüm yaş grupları</strong> için uygundur. 13 yaşın altındaki çocuklar için özel izin gerektirmez çünkü hiçbir kişisel bilgi toplanmaz.</p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-1">Veri Güvenliği</h3>
            <p>Toplanan tek veri (oyun ilerlemesi) cihazınızda yerel olarak saklandığından veri sızıntısı, sunucu güvenlik açığı veya hesap çalınma riski yoktur.</p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-1">Verilerinizin Silinmesi</h3>
            <p>Tüm verilerinizi silmek için uygulamayı telefonunuzdan kaldırın veya Ayarlar → Uygulamalar → Kelime Pusulası → Depolama → Veriyi Temizle yolunu izleyin.</p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-1">İletişim</h3>
            <p>Sorularınız için: <a href="mailto:kaanozarik@gmail.com" className="text-indigo-600 underline">kaanozarik@gmail.com</a></p>
          </section>

          <section className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-500 text-center">
              <strong>Özet:</strong> Kelime Pusulası gizliliğinize saygı duyar ve hiçbir kişisel veri toplamaz. Tüm oyun verileri sadece cihazınızda saklanır.
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
          <button
            onClick={onAccept}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-200 hover:from-indigo-700 hover:to-purple-700 active:scale-95 transition"
          >
            Okudum, Kabul Ediyorum
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
