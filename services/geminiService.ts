// Basit ipucu sistemi - AI bağımlılığı yok
// Kelime kategorisine göre genel ipuçları döndürür

const getHintsByCategory = (categoryLabel: string): string[] => {
  const hints: { [key: string]: string[] } = {
    'Hayvanlar': [
      'Doğada yaşayan canlı bir varlık',
      'Hayvanat bahçesinde görebileceğin',
      'Evcil veya vahşi olabilir',
      'İki veya dört ayaklı olabilir',
      'Doğanın bir parçası'
    ],
    'Yiyecek': [
      'Sofrada bulunabilir',
      'Yenebilir veya içilebilir',
      'Lezzetli bir şey',
      'Mutfakta kullanılır',
      'Beslenme için gerekli'
    ],
    'Eşyalar': [
      'Günlük hayatta kullanılan',
      'Evlerde bulunur',
      'Kullanışlı bir nesne',
      'Elle tutulabilir',
      'İnsanlar tarafından yapılmış'
    ],
    'Meslekler': [
      'İnsanların yaptığı iş',
      'Para kazanmak için yapılan',
      'Topluma hizmet eden',
      'Bir uzmanlık alanı',
      'Çalışma hayatında var'
    ],
    'Ülkeler': [
      'Dünya haritasında yer alır',
      'Sınırları olan bir yer',
      'Başkenti ve bayrağı var',
      'Milyonlarca insan yaşar',
      'Bir coğrafi bölge'
    ],
    'Şehirler': [
      'Türkiye\'de bir il',
      'Büyük veya küçük bir yerleşim',
      'Vali tarafından yönetilir',
      'Plaka kodu var',
      'İnsanların yaşadığı yer'
    ],
    'Sporlar': [
      'Fiziksel aktivite',
      'Sağlıklı yaşam için önemli',
      'Takım veya bireysel olabilir',
      'Olimpiyatlarda olabilir',
      'Yarışma ve müsabaka içerir'
    ],
    'Teknoloji': [
      'Modern hayatın parçası',
      'Elektronik olabilir',
      'İnternetle ilgili olabilir',
      'İnsanların işini kolaylaştırır',
      'Dijital dünyada var'
    ],
    'Doğa': [
      'Doğada bulunur',
      'Çevre ile ilgili',
      'Canlı veya cansız olabilir',
      'Dışarıda görebilirsin',
      'Doğal bir unsur'
    ],
    'Duygular': [
      'İnsanların hissettigi',
      'İçsel bir durum',
      'Kalp ile ilgili',
      'Pozitif veya negatif olabilir',
      'Ruh halini etkiler'
    ],
    'Müzik': [
      'Müzikle ilgili',
      'Kulakla duyulur',
      'Sanatın bir dalı',
      'Ritim ve melodi içerir',
      'Konser veya dinletide var'
    ],
    'Vücudumuz': [
      'İnsan vücudunda var',
      'Anatomik bir yapı',
      'Organlardan biri olabilir',
      'Beden ile ilgili',
      'Sağlık için önemli'
    ],
    'Fen Bilimleri': [
      'Bilimsel bir kavram',
      'Fen dersi konusu',
      'Doğa olayı olabilir',
      'Laboratuvarda incelenebilir',
      'Fizik, kimya veya biyoloji ile ilgili'
    ],
    'Matematik': [
      'Sayılarla ilgili',
      'Hesaplama gerektirir',
      'Geometri veya cebir konusu',
      'Matematik dersinde öğrenilir',
      'Problem çözmede kullanılır'
    ]
  };

  // Kategori eşleştirmesi
  for (const key in hints) {
    if (categoryLabel.toLowerCase().includes(key.toLowerCase())) {
      return hints[key];
    }
  }

  // Genel ipuçları
  return [
    'Dikkatli düşün...',
    'Alfabetik sıralamayı hatırla',
    'Bu kategoride sık kullanılan bir kelime',
    'Herkesin bildiği bir şey',
    'Tahminine yaklaşıyorsun!'
  ];
};

export const getHintFromGemini = async (secretWord: string, categoryLabel: string): Promise<string> => {
  // Artık AI kullanmıyoruz, lokal ipucu döndürüyoruz
  const hints = getHintsByCategory(categoryLabel);
  const randomHint = hints[Math.floor(Math.random() * hints.length)];
  
  // Biraz gecikme ekleyelim ki gerçekçi görünsün
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return randomHint;
};

export const getFunFactFromGemini = async (secretWord: string): Promise<string> => {
  // AI olmadan basit tebrik mesajları
  const congratsMessages = [
    `Tebrikler! "${secretWord}" kelimesini buldunuz! 🎉`,
    `Harika! Doğru kelime: ${secretWord} ✨`,
    `Bravo! ${secretWord} kelimesini bildiniz! 🎊`,
    `Mükemmel! ${secretWord} doğru cevap! 🌟`,
    `Aferin! ${secretWord} kelimesini çözdünüz! 🏆`
  ];
  
  const randomMessage = congratsMessages[Math.floor(Math.random() * congratsMessages.length)];
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return randomMessage;
};