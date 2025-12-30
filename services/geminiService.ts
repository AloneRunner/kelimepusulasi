import { GameMode, GameData, Clue, Player, VoteResult } from "../types";

// --- HELPER ---
export const normalize = (text: string) => text.toLocaleLowerCase('tr-TR').trim();

// --- TYPES (YENİ CLUSTER YAPISI) ---

// Tek bir kelime varyasyonu
interface WordVariant {
  word: string;
  specific: string[]; // Bu kelimeyi ele veren ipuçları
}

// Birbirine benzeyen kelimeler grubu
interface WordCluster {
  id: string;
  common: string[]; // Hainin sığınacağı geniş, güvenli liman
  variants: WordVariant[];
}

interface CategoryData {
  id: string;
  name: string;
  clusters: WordCluster[];
}

// --- LOCAL DATABASE (CLUSTER TEMELLI) ---

const GAME_DATABASE: CategoryData[] = [
  // ═══════════════════════════════════════════════════════════════
  // 1. KATEGORİ: YİYECEK & İÇECEK
  // ═══════════════════════════════════════════════════════════════
  {
    id: "mutfak",
    name: "Yiyecek & İçecek",
    clusters: [
      {
        id: "sicak_icecekler",
        common: [
          "Sıcak", "Bardak", "İçmek", "Sıvı", "Keyif", "Kafe", "Dumanı", "Şeker",
          "Kaşık", "Yudum", "Kahvaltı", "Akşam", "İkram", "Kupa", "Termos",
          "Boğaz", "Sohbet", "Misafir", "Hararet", "Kış", "Rahatlamak", "Fincan",
          "Aromalı", "Taze", "Sütlü", "Şekersiz", "Acı", "Tiryaki", "Sabah"
        ],
        variants: [
          {
            word: "Çay",
            specific: ["Demlik", "Rize", "Tavşan", "Simit", "Bitki", "Tirebolu", "Çaykur", "Poşet", "İnce belli", "Bergamot", "Kaçak", "Limonlu", "Nane", "Açık", "Koyu", "Demleme"]
          },
          {
            word: "Kahve",
            specific: ["Telve", "Fal", "Türk", "Espresso", "Starbucks", "Çekirdek", "Kavrulmuş", "Dibek", "Latte", "Barista", "Köpük", "Filtre", "Nescafe", "Ayıltır", "Kafein", "Kırk yıl"]
          },
          {
            word: "Sıcak Çikolata",
            specific: ["Kakao", "Şanti", "Marshmallow", "Belçika", "Tatlı", "Kahverengi", "Çocuk", "Kremsi", "Yoğun", "İsviçre", "Krem", "Bitter", "Sütlü"]
          },
          {
            word: "Salep",
            specific: ["Tarçın", "Orkide", "Maraş", "Beyaz", "Kıvamlı", "Şifa", "Toz", "Osmanlı", "Geleneksel", "Kar", "Dondurma yapımı"]
          }
        ]
      },
      {
        id: "fast_food",
        common: [
          "Hızlı", "Yemek", "Paket", "Kalori", "Doyurucu", "Kola", "Elle", "Sıcak",
          "Yağlı", "Sos", "Öğle", "Sipariş", "Kurye", "Lezzetli", "Zararlı",
          "Tuzlu", "Getir", "Menü", "Abur cubur", "Sokak", "Ucuz", "Lokanta",
          "Acıktım", "Patates", "Ketçap", "Mayonez", "Turşu", "Marul"
        ],
        variants: [
          {
            word: "Pizza",
            specific: ["Dilim", "İtalyan", "Yuvarlak", "Kutu", "Peynir", "Sucuk", "Mantar", "Kenar", "Margarita", "Acılı", "Dominos", "Hamur", "Fırın"]
          },
          {
            word: "Hamburger",
            specific: ["Köfte", "Amerikan", "McDonald's", "Whopper", "Çift katlı", "Soğan halkası", "Ekmeği yumuşak", "Burger King", "Mangal", "Izgara"]
          },
          {
            word: "Lahmacun",
            specific: ["Limon", "Maydanoz", "Dürüm", "Kıyma", "Çıtır", "İnce", "Taş fırın", "Antep", "Urfa", "Ayran yanı", "Acılı biber"]
          },
          {
            word: "Döner",
            specific: ["Şiş", "Usta", "Büfe", "Hatay", "Dikey", "Tavuk", "Et", "Lavaş", "Tombik", "Ekmek arası", "Kesmek", "İskender"]
          }
        ]
      },
      {
        id: "kahvaltiliklar",
        common: [
          "Kahvaltı", "Sabah", "Tabak", "Sofra", "Taze", "Ekmek yanı", "Serpme",
          "Tatil", "Pazar", "Hastane", "Besleyici", "Protein", "Güne başlamak",
          "Köy", "Doğal", "Market", "Buzdolabı", "Kalsiyum", "Soğuk", "Dilim"
        ],
        variants: [
          {
            word: "Peynir",
            specific: ["Beyaz", "Kaşar", "Tuzlu", "Ezine", "Lor", "Süzme", "Çökelek", "Tulum", "Küflü", "Dilim", "Kalsiyum", "Süt"]
          },
          {
            word: "Zeytin",
            specific: ["Siyah", "Yeşil", "Gemlik", "Çekirdek", "Yağlı", "Tane", "Ege", "Sele", "Çizik", "Küçük"]
          },
          {
            word: "Yumurta",
            specific: ["Sarı", "Beyaz", "Tavuk", "Menemen", "Haşlanmış", "Rafadan", "Omlet", "Sahanda", "Çırpılmış", "Kayısı", "Organik"]
          },
          {
            word: "Bal",
            specific: ["Arı", "Petek", "Doğal", "Çam", "Karakovan", "Süzme", "Yapışkan", "Altın rengi", "Şifa", "Kaşıkla", "Tereyağı"]
          }
        ]
      },
      {
        id: "meyveler",
        common: [
          "Meyve", "Tatlı", "Vitamin", "Sağlıklı", "Kabuk", "Soyulur", "Yıkanır",
          "Manav", "Pazar", "Taze", "Kilo", "Çekirdek", "Renk", "Mevsimine göre",
          "Dilim", "Sulu", "Şekersiz", "Doğal", "Ağaç", "Bahçe"
        ],
        variants: [
          {
            word: "Elma",
            specific: ["Kırmızı", "Yeşil", "Amasya", "Starking", "Çıtır", "Newton", "Vitamin", "Günde bir", "Sap", "Öğretmen hediyesi"]
          },
          {
            word: "Portakal",
            specific: ["Turuncu", "C vitamini", "Sıkılır", "Washington", "Finike", "Kış meyvesi", "Dilimli", "Sulu", "Meyve suyu", "Kabuk kokusu"]
          },
          {
            word: "Muz",
            specific: ["Sarı", "Döner", "Potasyum", "Maymun", "Afrika", "Tropik", "Yumuşak", "Soyulur", "Kolay", "Enerji"]
          },
          {
            word: "Üzüm",
            specific: ["Salkım", "Şarap", "Kuru", "Yeşil", "Siyah", "Çekirdekli", "Çekirdeksiz", "Bağ", "Hasat", "Pekmez"]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // 2. KATEGORİ: SPOR & AKTİVİTE
  // ═══════════════════════════════════════════════════════════════
  {
    id: "spor",
    name: "Spor & Aktivite",
    clusters: [
      {
        id: "top_oyunlari",
        common: [
          "Top", "Takım", "Saha", "Maç", "Ter", "Forma", "Hakem", "Düdük",
          "Skor", "Antrenman", "Kazanmak", "Lig", "Taraftar", "Koşmak",
          "Mücadele", "Hoca", "Kupa", "Turnuva", "Süre", "Faul", "Taktik",
          "Spor salonu", "Milli takım", "Transfer", "Kaptan", "Yedek"
        ],
        variants: [
          {
            word: "Futbol",
            specific: ["Ayak", "Kale", "Ofsayt", "Penaltı", "Krampon", "Korner", "Gol", "90 dakika", "11 kişi", "Messi", "Ronaldo", "Şampiyonlar Ligi"]
          },
          {
            word: "Basketbol",
            specific: ["Pota", "Parke", "Smaç", "Üçlük", "Turuncu", "5 kişi", "NBA", "Jordan", "LeBron", "Steps", "Periyot", "24 saniye"]
          },
          {
            word: "Voleybol",
            specific: ["File", "Manşet", "6 kişi", "Parmak pas", "Blok", "Salon", "Servis", "Filenin Sultanları", "Dönüşümlü", "Libero"]
          },
          {
            word: "Hentbol",
            specific: ["Elle atış", "7 kişi", "Yapışkan", "Sert şut", "Sıçrayış", "Faul çok", "Kale", "Avrupa", "Hızlı"]
          }
        ]
      },
      {
        id: "bireysel_sporlar",
        common: [
          "Madalya", "Olimpiyat", "Bireysel", "Rekor", "Disiplin", "Kas",
          "Güç", "Hız", "Denge", "Yarış", "Antrenör", "Ter", "Çaba",
          "Azim", "Başarı", "Derece", "Final", "Şampiyon", "Rakip"
        ],
        variants: [
          {
            word: "Tenis",
            specific: ["Raket", "Kort", "Sarı top", "Wimbledon", "Ace", "Set", "Nadal", "Federer", "Toprak", "Çim"]
          },
          {
            word: "Yüzme",
            specific: ["Havuz", "Kulaç", "Bone", "Mayo", "Islak", "Nefes", "Kelebek", "Sırtüstü", "Olimpik", "Şerit"]
          },
          {
            word: "Boks",
            specific: ["Ring", "Eldiven", "Yumruk", "Nakavt", "Raunt", "Köşe", "Kemer", "Mike Tyson", "Rocky", "Dişlik"]
          },
          {
            word: "Atletizm",
            specific: ["Koşu", "Pistemek", "Maraton", "100 metre", "Cirit", "Gülle", "Atlama", "Çıta", "Usain Bolt"]
          }
        ]
      },
      {
        id: "kis_sporlari",
        common: [
          "Kış", "Soğuk", "Kar", "Buz", "Kaygan", "Mont", "Eldiven", "Kask",
          "Dağ", "Tatil", "Sezon", "Hız", "Tehlike", "Spor", "Olimpiyat"
        ],
        variants: [
          {
            word: "Kayak",
            specific: ["Baton", "Eğim", "Pist", "Telesiyej", "Uludağ", "Alpler", "Slalom", "Çığ", "Kar gözlüğü", "Palandöken"]
          },
          {
            word: "Buz Pateni",
            specific: ["Artistik", "Dans", "Sivri", "Dönüş", "Kostüm", "Salon", "Figure", "Müzik eşliğinde", "Zarif"]
          },
          {
            word: "Snowboard",
            specific: ["Tek tahta", "Genç", "Freestyle", "X Games", "Rampa", "Backflip", "Halfpipe", "Ekstrem"]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // 3. KATEGORİ: TEKNOLOJİ
  // ═══════════════════════════════════════════════════════════════
  {
    id: "teknoloji",
    name: "Teknoloji",
    clusters: [
      {
        id: "ekranli_cihazlar",
        common: [
          "Ekran", "Şarj", "İnternet", "Dokunmatik", "Wifi", "Pahalı", "Marka",
          "Kamera", "Oyun", "Elektrik", "Batarya", "Güncelleme", "Kılıf",
          "Video", "Mesaj", "Bağımlılık", "Uygulama", "İndir", "Yazılım",
          "Donanım", "Piksel", "Çözünürlük", "GB", "RAM", "İşlemci"
        ],
        variants: [
          {
            word: "Telefon",
            specific: ["Cep", "Alo", "WhatsApp", "Selfie", "Küçük", "Taşınabilir", "Parmak izi", "iPhone", "Samsung", "Sim kart", "Arama"]
          },
          {
            word: "Tablet",
            specific: ["iPad", "Çizim", "Orta boy", "Kalem", "Çocuk", "Yatakta", "Okuma", "Netflix", "Oyun", "Hafif"]
          },
          {
            word: "Laptop",
            specific: ["Klavye", "Menteşe", "Mouse", "Ofis", "Ağır", "Isınır", "Fan", "USB", "Windows", "MacBook", "Çalışma"]
          },
          {
            word: "Televizyon",
            specific: ["Kumanda", "Duvar", "Büyük", "Salon", "Kanal", "Uydu", "Dizi", "Sabit", "55 inç", "OLED", "Ses sistemi"]
          }
        ]
      },
      {
        id: "depolama",
        common: [
          "Dosya", "Veri", "Kayıt", "Bellek", "Hafıza", "Resim", "Video",
          "Format", "Silmek", "Yedek", "Depolama", "GB", "TB", "Kapasite",
          "Bilgisayar", "Aktarma", "Koruma", "Güvenlik"
        ],
        variants: [
          {
            word: "USB Bellek",
            specific: ["Flash", "Küçük", "Cep", "Anahtarlık", "Taşınabilir", "Kaybolur", "Ucuz", "Tak çıkar", "Promosyon"]
          },
          {
            word: "Harddisk",
            specific: ["Büyük", "Ağır", "Kablolu", "Terabayt", "Mekanik", "Ses yapan", "Dönme", "SSD", "Yavaş"]
          },
          {
            word: "Bulut",
            specific: ["Google Drive", "iCloud", "Dropbox", "Online", "Senkron", "İnternet", "Abonelik", "Erişim", "Aylık ücret"]
          },
          {
            word: "SD Kart",
            specific: ["Mikro", "Telefon", "Kamera", "Adaptör", "Slot", "Fotoğraf", "GoPro", "Drone", "Değiştirilir"]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // 4. KATEGORİ: HAYVANLAR
  // ═══════════════════════════════════════════════════════════════
  {
    id: "hayvan",
    name: "Hayvanlar Alemi",
    clusters: [
      {
        id: "yirticilar",
        common: [
          "Pençe", "Diş", "Etçil", "Hızlı", "Vahşi", "Avcı", "Kuyruk",
          "Dört ayak", "Tehlikeli", "Belgesel", "Orman", "Savana", "Memeli",
          "Güçlü", "Yırtıcı", "Av", "Korkutucu", "Hayvanat bahçesi"
        ],
        variants: [
          {
            word: "Aslan",
            specific: ["Yele", "Kral", "Simba", "Afrika", "Sarı", "Kükreme", "Sürü lideri", "Dişi avcı", "Tembel erkek", "Zodyak"]
          },
          {
            word: "Kaplan",
            specific: ["Çizgili", "Turuncu", "Asya", "Bengal", "Yalnız yaşar", "Yüzer", "En büyük kedigil", "Hindistan"]
          },
          {
            word: "Kurt",
            specific: ["Uluma", "Dolunay", "Sürü", "Gri", "Köpek atası", "Kış", "Sadakat", "Rütbe", "Alfa"]
          },
          {
            word: "Ayı",
            specific: ["Bal", "Kış uykusu", "Post", "İki ayak", "Mağara", "Boz", "Kutup", "Panda", "Hantal"]
          }
        ]
      },
      {
        id: "evcil_hayvanlar",
        common: [
          "Evcil", "Sevimli", "Mama", "Veteriner", "Tüy", "Pati", "Kuyruk",
          "Bakım", "Yaşam", "Arkadaş", "Sadık", "Oyun", "Ev", "Aile",
          "Sahiplendirme", "Tasma", "Yavru", "Sevgi", "Bağ"
        ],
        variants: [
          {
            word: "Kedi",
            specific: ["Miyav", "Kum kabı", "Tırnak", "Fare", "Tekir", "Bıyık", "Mırıltı", "Tembel", "Tırmalama", "Garfield"]
          },
          {
            word: "Köpek",
            specific: ["Hav", "Kemik", "Sadık", "Tasma", "Bekçi", "Polis", "Kuyruk sallar", "Yürüyüş", "Havlama", "Golden"]
          },
          {
            word: "Kuş",
            specific: ["Kanat", "Uçmak", "Kafes", "Tüy döker", "Cıvıltı", "Gaga", "Muhabbet", "Papağan", "Kanarya", "Öter"]
          },
          {
            word: "Balık",
            specific: ["Akvaryum", "Sessiz", "Yem", "Pul", "Yüzgeç", "Japon", "Solungaç", "Su değişimi", "Filtre"]
          }
        ]
      },
      {
        id: "bocekler",
        common: [
          "Küçük", "Böcek", "Bacak", "Kanat", "Uçar", "Yaz", "Bahçe",
          "Korku", "Ilaç", "Zararlı", "Faydalı", "Doğa", "Ekosistem"
        ],
        variants: [
          {
            word: "Arı",
            specific: ["Bal", "Sokar", "Kovan", "İğne", "Sarı siyah", "Polen", "Çiçek", "Kraliçe", "İşçi", "Tehlikeli"]
          },
          {
            word: "Kelebek",
            specific: ["Renkli", "Zarif", "Tırtıl", "Koza", "Dönüşüm", "Çiçekten çiçeğe", "Güzel", "Nadir", "Tropik"]
          },
          {
            word: "Karınca",
            specific: ["Yuva", "Çalışkan", "Sürü", "Küçük", "Kırmızı", "Siyah", "Taşıma", "Kraliçe", "Koloni"]
          },
          {
            word: "Örümcek",
            specific: ["Ağ", "Sekiz bacak", "Zehir", "Korkunç", "Böcek yer", "Tuzak", "Tarantula", "Duvar", "Köşe"]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // 5. KATEGORİ: ULAŞIM
  // ═══════════════════════════════════════════════════════════════
  {
    id: "ulasim",
    name: "Ulaşım Araçları",
    clusters: [
      {
        id: "kara_tasitlari",
        common: [
          "Tekerlek", "Motor", "Direksiyon", "Yol", "Trafik", "Benzin",
          "Hız", "Ehliyet", "Fren", "Marka", "Model", "Seyahat", "Metal",
          "Sürücü", "Yolcu", "Kaza", "Sigorta", "Muayene", "Plaka"
        ],
        variants: [
          {
            word: "Araba",
            specific: ["4 teker", "Bagaj", "Aile", "Koltuk", "Klima", "Park", "Sedan", "SUV", "Otomatik", "Vites"]
          },
          {
            word: "Motosiklet",
            specific: ["2 teker", "Kask", "Denge", "Rüzgar", "Gidon", "Heyecan", "Tehlikeli", "Aradan geçer", "Gürültülü"]
          },
          {
            word: "Otobüs",
            specific: ["Toplu", "Durak", "Akbil", "Şoför", "Ayakta", "Uzun", "Büyük", "Hat", "Belediye", "Muavin"]
          },
          {
            word: "Tır",
            specific: ["Dorse", "Yük", "Nakliye", "Ağır", "Uzun yol", "Korna", "Devasa", "TIR parkı", "Şoför dinlenme"]
          }
        ]
      },
      {
        id: "hava_deniz",
        common: [
          "Yolculuk", "Bilet", "Kaptan", "Mürettebat", "Liman", "Sefer",
          "Ulaşım", "Yolcu", "Tatil", "Manzara", "Hız", "Uzun mesafe"
        ],
        variants: [
          {
            word: "Uçak",
            specific: ["Kanat", "Pilot", "Hostes", "Türbülans", "Pist", "Check-in", "Bavul", "Bulutlar", "Havalimanı", "İniş"]
          },
          {
            word: "Gemi",
            specific: ["Deniz", "Dalga", "Cruise", "Güverte", "Demir", "Liman", "Yavaş", "Arabalı feribot", "Ada"]
          },
          {
            word: "Tren",
            specific: ["Ray", "Vagon", "İstasyon", "TCDD", "Yüksek hızlı", "Manzara", "Bilet kontrol", "Makinist", "Kompartıman"]
          },
          {
            word: "Helikopter",
            specific: ["Pervane", "Dikey", "Pist yok", "Ambulans", "Askeri", "Pahalı", "Gürültülü", "Kurtarma", "Havada asılı"]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // 6. KATEGORİ: EĞLENCE & HOBİ
  // ═══════════════════════════════════════════════════════════════
  {
    id: "eglence",
    name: "Eğlence & Hobi",
    clusters: [
      {
        id: "masa_oyunlari",
        common: [
          "Oyun", "Eğlence", "Arkadaş", "Aile", "Gece", "Strateji", "Şans",
          "Kazanmak", "Kaybetmek", "Kural", "Sıra", "Taş", "Zaman geçirmek",
          "Kahvehane", "Çay", "Muhabbet"
        ],
        variants: [
          {
            word: "Satranç",
            specific: ["At", "Şah", "Mat", "Kale", "Fil", "Vezir", "Piyon", "64 kare", "Kasparov", "Düşünmek", "Turnuva"]
          },
          {
            word: "Tavla",
            specific: ["Zar", "Pul", "Mars", "Kapı", "Düşeş", "Kovan", "Ahşap", "Şeş", "Çift", "Attı altı"]
          },
          {
            word: "Okey",
            specific: ["İstaka", "Per", "101", "Gösterge", "Sahte", "4 kişi", "Renkli taş", "Çift", "El", "Açmak"]
          },
          {
            word: "Dama",
            specific: ["Basit", "Atlamak", "Köşe", "Yemek", "Çocuk oyunu", "Kırmızı beyaz", "8x8", "Çapraz"]
          }
        ]
      },
      {
        id: "muzik_aletleri",
        common: [
          "Müzik", "Çalmak", "Ses", "Nota", "Melodi", "Konser", "Sahne",
          "Sanatçı", "Kurs", "Öğrenmek", "Pratik", "Kulak", "Yetenek",
          "Orkestra", "Beste", "Şarkı", "Ritim"
        ],
        variants: [
          {
            word: "Gitar",
            specific: ["6 tel", "Pena", "Akor", "Rock", "Akustik", "Elektro", "Solo", "Sap", "Eşlik", "Kamp ateşi"]
          },
          {
            word: "Piyano",
            specific: ["Tuş", "Siyah beyaz", "Kuyruklu", "Klasik", "Mozart", "88 tuş", "Pedal", "Naif", "Konservatuar"]
          },
          {
            word: "Bağlama",
            specific: ["Saz", "Türkü", "Anadolu", "Neşet Ertaş", "Tezene", "3 tel", "Uzun sap", "Düğün"]
          },
          {
            word: "Davul",
            specific: ["Ritim", "Baget", "Deriler", "Gürültü", "Perkusyon", "Tempo", "Rock grubu", "Düğün davulu", "Zurna"]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // 7. KATEGORİ: DOĞA & HAVA
  // ═══════════════════════════════════════════════════════════════
  {
    id: "doga",
    name: "Doğa & Hava",
    clusters: [
      {
        id: "hava_durumlari",
        common: [
          "Hava", "Gökyüzü", "Meteoroloji", "Tahmin", "Mevsim", "Derece",
          "Sıcaklık", "Nem", "Bulut", "Dışarı", "Giyim", "Gece", "Gündüz"
        ],
        variants: [
          {
            word: "Yağmur",
            specific: ["Damla", "Islak", "Şemsiye", "Çamur", "Gök gürültüsü", "Bulut", "Gökkuşağı", "Sağanak", "Çisenti"]
          },
          {
            word: "Kar",
            specific: ["Beyaz", "Kardan adam", "Kayak", "Kış tatili", "Ayak izi", "Kartopu", "Lapa", "Tipi", "Erimek"]
          },
          {
            word: "Güneş",
            specific: ["Sıcak", "Sarı", "Yaz", "Plaj", "Bronz", "Güneş kremi", "Gözlük", "Şapka", "Batış", "Doğuş"]
          },
          {
            word: "Rüzgar",
            specific: ["Esinti", "Uçurtma", "Lodos", "Poyraz", "Yaprak", "Saç", "Fırtına", "Serinlik", "Yelken"]
          }
        ]
      },
      {
        id: "dogal_alanlar",
        common: [
          "Doğa", "Yeşil", "Manzara", "Tatil", "Piknik", "Yürüyüş", "Fotoğraf",
          "Sessizlik", "Dinlenmek", "Kamp", "Temiz hava", "Kuş sesi"
        ],
        variants: [
          {
            word: "Orman",
            specific: ["Ağaç", "Yaprak", "Mantar", "Yabani", "Gölge", "Patika", "Kuş", "Av", "Geyik", "Amazon"]
          },
          {
            word: "Deniz",
            specific: ["Tuzlu", "Dalga", "Kumsal", "Yüzme", "Mavi", "Gemi", "Balık", "Güneşlenmek", "Martı", "Akdeniz"]
          },
          {
            word: "Dağ",
            specific: ["Zirve", "Tırmanış", "Yüksek", "Kar", "Mağara", "Kaya", "Dik", "Everest", "Uludağ", "Ağrı"]
          },
          {
            word: "Göl",
            specific: ["Durgun su", "Yansıma", "Kamp", "Ördek", "Balıkçı", "Sandalye", "Van Gölü", "Tatlı su", "Kıyı"]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // 8. KATEGORİ: MESLEKLER
  // ═══════════════════════════════════════════════════════════════
  {
    id: "meslekler",
    name: "Meslekler",
    clusters: [
      {
        id: "saglik",
        common: [
          "Hastane", "Sağlık", "Hasta", "Tedavi", "Beyaz önlük", "Meslek",
          "Görev", "Nöbet", "Yorucu", "Fedakarlık", "İnsan", "Yardım"
        ],
        variants: [
          {
            word: "Doktor",
            specific: ["Ameliyat", "Reçete", "Muayene", "Teşhis", "Stetoskop", "Uzman", "Cerrah", "Randevu", "Hekim"]
          },
          {
            word: "Hemşire",
            specific: ["İğne", "Serum", "Bakım", "Yardımcı", "Pansuman", "Tansiyon", "Forma", "Gece nöbeti", "Ebe"]
          },
          {
            word: "Diş Hekimi",
            specific: ["Diş", "Dolgu", "Çekim", "Kanal", "Fırça", "Macun", "Ağrı", "Çürük", "Ortodonti", "İmplant"]
          },
          {
            word: "Eczacı",
            specific: ["İlaç", "Reçete", "Eczane", "Kutu", "Antibiyotik", "Vitamin", "Satış", "Önlük", "Yeşil haç"]
          }
        ]
      },
      {
        id: "egitim",
        common: [
          "Okul", "Eğitim", "Öğrenci", "Ders", "Sınav", "Not", "Kitap",
          "Zil", "Tatil", "Ödev", "Bilgi", "Öğrenmek", "Sınıf"
        ],
        variants: [
          {
            word: "Öğretmen",
            specific: ["Tahta", "Tebeşir", "Anlatmak", "Karne", "Veli", "Yoklama", "Ata", "Müfredat", "Branş"]
          },
          {
            word: "Profesör",
            specific: ["Üniversite", "Araştırma", "Makale", "Tez", "Doçent", "Akademik", "Ders veren", "Uzman", "Bilim"]
          },
          {
            word: "Rehber Öğretmen",
            specific: ["Danışman", "Sorun", "Konuşmak", "Test", "Yönlendirme", "Kariyer", "Psikoloji", "Destek", "Veli görüşmesi"]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // 9. KATEGORİ: SÜPER KAHRAMANLAR & MİTOLOJİ  
  // ═══════════════════════════════════════════════════════════════
  {
    id: "kahraman",
    name: "Süper Kahramanlar",
    clusters: [
      {
        id: "marvel_dc",
        common: [
          "Kahraman", "Süper güç", "Film", "Çizgi roman", "Kostüm", "Kötü adam",
          "Dünyayı kurtarmak", "Sinema", "Hayran", "Aksiyon", "Uçmak"
        ],
        variants: [
          {
            word: "Örümcek Adam",
            specific: ["Ağ atma", "Peter Parker", "Duvar tırmanma", "Kırmızı mavi", "Queens", "Marvel", "Örümcek hissi", "May Hala"]
          },
          {
            word: "Batman",
            specific: ["Yarasa", "Gotham", "Zengin", "Kara şövalye", "Robin", "Joker", "DC", "Batmobil", "Gece", "Alfred"]
          },
          {
            word: "Superman",
            specific: ["Kripton", "Uçar", "Lazer gözler", "Pelerin", "Clark Kent", "Gazeteci", "Lois Lane", "Kryptonite", "S harfi"]
          },
          {
            word: "Demir Adam",
            specific: ["Zırh", "Tony Stark", "Ark reaktörü", "Zengin", "Marvel", "Pepper", "Jarvis", "Avengers", "Teknoloji"]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // 10. KATEGORİ: GİYİM & AKSESUAR
  // ═══════════════════════════════════════════════════════════════
  {
    id: "giyim",
    name: "Giyim & Aksesuar",
    clusters: [
      {
        id: "ustten_giyim",
        common: [
          "Giysi", "Kıyafet", "Kumaş", "Beden", "Renk", "Dolap", "Yıkamak",
          "Ütü", "Moda", "Stil", "Sezon", "Alışveriş", "Marka"
        ],
        variants: [
          {
            word: "Tişört",
            specific: ["Rahat", "Kısa kol", "Baskılı", "Pamuklu", "Yaz", "Günlük", "Ucuz", "Spor"]
          },
          {
            word: "Gömlek",
            specific: ["Düğme", "Yaka", "Ütü", "Resmi", "İş", "Kravat", "Manşet", "Uzun kol", "Takım elbise"]
          },
          {
            word: "Kazak",
            specific: ["Yün", "Kış", "Sıcak", "Boğazlı", "Örgü", "Kalın", "Büyükanne", "Kaşıntı", "Triko"]
          },
          {
            word: "Mont",
            specific: ["Kış", "Şişme", "Kapüşon", "Fermuar", "Ceket", "Kaz tüyü", "Kalın", "Su geçirmez"]
          }
        ]
      },
      {
        id: "ayakkabilar",
        common: [
          "Ayak", "Numara", "Giymek", "Yürümek", "Taban", "Bağcık", "Alışveriş",
          "Marka", "Rahat", "Çift", "Sol sağ"
        ],
        variants: [
          {
            word: "Spor Ayakkabı",
            specific: ["Sneaker", "Nike", "Adidas", "Koşu", "Basketbol", "Beyaz", "Koleksiyon", "Jordan"]
          },
          {
            word: "Topuklu",
            specific: ["Kadın", "Ince topuk", "Stiletto", "Gece", "Şık", "Zor yürümek", "Düğün", "Kırmızı taban"]
          },
          {
            word: "Terlik",
            specific: ["Ev", "Rahat", "Plaj", "Parmak arası", "Yaz", "Ucuz", "Hızlı giyme", "Banyo"]
          },
          {
            word: "Bot",
            specific: ["Kış", "Kalın taban", "Postal", "Deri", "Kar", "Fermuarlı", "Uzun konç", "Askeri"]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // 11. KATEGORİ: TATLILAR
  // ═══════════════════════════════════════════════════════════════
  {
    id: "tatlilar",
    name: "Tatlılar",
    clusters: [
      {
        id: "geleneksel_tatlilar",
        common: [
          "Şeker", "Tatlı", "Kalori", "Ziyafet", "Bayram", "İkram", "Lezzetli",
          "Kilo", "Yemek sonrası", "Mutluluk", "Tepsi", "Porsiyon", "Geleneksel",
          "Mutfak", "Usta", "Pastane", "Çatal", "Kaşık", "Enerji", "Şerbet"
        ],
        variants: [
          {
            word: "Baklava",
            specific: ["Fıstık", "Ceviz", "Kat kat", "Yufka", "Gaziantep", "Çıtır", "Kare", "Havuç dilimi", "40 kat", "Yeşil"]
          },
          {
            word: "Sütlaç",
            specific: ["Süt", "Pirinç", "Fırın", "Üstü yanık", "Güveç", "Hafif", "Tarçın", "Nişasta", "Anne tatlısı", "Kaşıkla"]
          },
          {
            word: "Künefe",
            specific: ["Peynir", "Kadayıf", "Sıcak yenir", "Hatay", "Antakya", "Uzayan peynir", "Tevsi", "Kaymaklı", "Tel tel"]
          },
          {
            word: "Aşure",
            specific: ["Nar", "Buğday", "Nohut", "Fasulye", "Muharrem", "Komşu", "Karışık", "Bereket", "Kase", "Fındık fıstık"]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // 12. KATEGORİ: EV TEKNOLOJİSİ
  // ═══════════════════════════════════════════════════════════════
  {
    id: "ev_teknolojisi",
    name: "Ev Teknolojisi",
    clusters: [
      {
        id: "temizlik_bakim",
        common: [
          "Ev", "Elektrik", "Priz", "Kablo", "Tuş", "Eşya", "Gürültü", "Marka",
          "Beyaz eşya", "Tamir", "Garanti", "Motor", "Yardımcı", "Pratik", "Hayat kolaylaştırır"
        ],
        variants: [
          {
            word: "Elektrikli Süpürge",
            specific: ["Toz", "Çekmek", "Hortum", "Torba", "Halı", "Temizlik", "Robot", "Süpürmek", "Emiş gücü", "Dyson"]
          },
          {
            word: "Ütü",
            specific: ["Buhar", "Kırışık", "Masası", "Su haznesi", "Gömlek", "Düzleştirmek", "Taban", "Yanık kokusu", "Kıyafet"]
          },
          {
            word: "Çamaşır Makinesi",
            specific: ["Deterjan", "Yumuşatıcı", "Kazan", "Dönmek", "Sıkma", "Kirli", "Sepet", "Program", "Banyo", "1400 devir"]
          },
          {
            word: "Saç Kurutma Makinesi",
            specific: ["Fön", "Sıcak hava", "Islak saç", "Kuaför", "Üflemek", "Başlık", "Kurutmak", "Banyo", "Kadın"]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // 13. KATEGORİ: OKUL & KIRTASİYE
  // ═══════════════════════════════════════════════════════════════
  {
    id: "okul",
    name: "Okul & Kırtasiye",
    clusters: [
      {
        id: "yazi_gerecleri",
        common: [
          "Yazmak", "Okul", "Çanta", "Masa", "Kırtasiye", "Öğrenci", "Ders",
          "Not almak", "El", "Kağıt", "Sınav", "Eğitim", "Ofis", "Ucuz", "Kaybolur"
        ],
        variants: [
          {
            word: "Kurşun Kalem",
            specific: ["Silgi", "Uç", "Açacak", "Siyah", "Yazıp silmek", "Ahşap", "Talaş", "Resim çizmek", "HB", "2B"]
          },
          {
            word: "Tükenmez Kalem",
            specific: ["Mürekkep", "Silinmez", "Mavi", "İmza", "Yaylı", "Akma yapar", "Resmi evrak", "Pilot", "Kapaklı"]
          },
          {
            word: "Silgi",
            specific: ["Kauçuk", "Temizlemek", "Hata", "Sürtmek", "Toz çıkarır", "Beyaz", "Yumuşak", "Kokulu", "Yanlış"]
          },
          {
            word: "Defter",
            specific: ["Sayfa", "Kareli", "Çizgili", "Spiral", "Koparmak", "Yaprak", "Kapak", "Harita metod", "Dikişli"]
          }
        ]
      },
      {
        id: "sinif_esyalari",
        common: [
          "Sınıf", "Ahşap", "Öğretmen", "Demirbaş", "Okul", "Ders",
          "Teneffüs", "Nöbetçi", "Eski", "Tozlu", "Ortak kullanım"
        ],
        variants: [
          {
            word: "Yazı Tahtası",
            specific: ["Beyaz", "Kara", "Tebeşir", "Marker", "Silgi", "Duvar", "Büyük", "Soru çözmek", "Akıllı tahta"]
          },
          {
            word: "Sıra",
            specific: ["Oturmak", "Çift kişilik", "Altı gözlü", "Tahta", "Çizilmiş", "Sandalye", "Arkadaş", "Kopya yazmak"]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // 14. KATEGORİ: EV EŞYALARI
  // ═══════════════════════════════════════════════════════════════
  {
    id: "ev_esyasi",
    name: "Ev Eşyaları",
    clusters: [
      {
        id: "mobilyalar",
        common: [
          "Ev", "Salon", "Rahat", "Ahşap", "Kumaş", "Oturmak", "Dinlenmek",
          "Dekorasyon", "Ağır", "Pahalı", "IKEA", "Misafir", "Konfor", "Taşınma"
        ],
        variants: [
          {
            word: "Koltuk",
            specific: ["Kanepe", "Yastık", "Uzanmak", "Takım", "L köşe", "TV karşısı", "Yaylı", "Deri", "Kumaş", "3+1"]
          },
          {
            word: "Yatak",
            specific: ["Uyku", "Yorgan", "Gece", "Rüya", "Çift kişilik", "Baza", "Başlık", "Nevresim", "Sabah", "Ortopedik"]
          },
          {
            word: "Masa",
            specific: ["Yemek", "Sandalye", "Dört ayak", "Örtü", "Çalışma", "Bilgisayar", "Yuvarlak", "Dikdörtgen"]
          },
          {
            word: "Gardırop",
            specific: ["Elbise", "Askı", "Kapak", "Ayna", "Raf", "Kıyafet", "Yatak odası", "Büyük", "Saklamak"]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // 15. KATEGORİ: UZAY & GÖKYÜZÜ
  // ═══════════════════════════════════════════════════════════════
  {
    id: "uzay",
    name: "Uzay & Gökyüzü",
    clusters: [
      {
        id: "gok_cisimleri",
        common: [
          "Gökyüzü", "Parlak", "Uzak", "Evren", "Karanlık", "Gece", "Yukarı",
          "Sessiz", "Boşluk", "Büyük", "Astronomi", "Teleskop", "Bilinmezlik", "NASA"
        ],
        variants: [
          {
            word: "Ay",
            specific: ["Dolunay", "Hilal", "Krater", "Uydu", "Beyaz", "Gelgit", "Kurt adam", "Apollo", "Neil Armstrong"]
          },
          {
            word: "Güneş",
            specific: ["Sıcak", "Yakıcı", "Yıldız", "Sarı", "Merkez", "Gündüz", "Işık kaynağı", "Doğuş", "Batış"]
          },
          {
            word: "Yıldız",
            specific: ["Kayan", "Dilek tutmak", "Milyarlarca", "Küçük nokta", "Kutup", "Takım", "Samanyolu", "Parlamak"]
          },
          {
            word: "Mars",
            specific: ["Kızıl gezegen", "Elon Musk", "Komşu", "Dünya dışı", "Su aramak", "Robot", "Tozlu", "Dördüncü"]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // 16. KATEGORİ: DUYGULAR (ZOR MOD)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "duygular",
    name: "Duygular & Soyut",
    clusters: [
      {
        id: "temel_duygular",
        common: [
          "His", "İnsan", "Kalp", "Beyin", "Psikoloji", "Durum", "Yüz ifadesi",
          "Bulaşıcı", "İçsel", "Ruh hali", "Değişken", "Tepki", "Doğal", "Herkes yaşar"
        ],
        variants: [
          {
            word: "Mutluluk",
            specific: ["Gülümseme", "Kahkaha", "Huzur", "Pozitif", "Sevinç", "Endorfin", "Başarı", "Kutlama", "Neşe"]
          },
          {
            word: "Korku",
            specific: ["Karanlık", "Titremek", "Çığlık", "Kaçmak", "Fobi", "Gerilim", "Adrenalin", "Kalp atışı", "Ürpermek"]
          },
          {
            word: "Öfke",
            specific: ["Kızgın", "Bağırmak", "Kırmızı", "Sinir", "Kavga", "Yumruk", "Stres", "Patlamak", "Sakinleşmek"]
          },
          {
            word: "Şaşkınlık",
            specific: ["Sürpriz", "Ağzı açık", "Beklenmedik", "Hediye", "Şok", "Gözler büyür", "Aniden", "Hayret"]
          }
        ]
      }
    ]
  }
];

// --- LOGIC ---

// Helper: Diziyi karıştır
const shuffleArray = <T>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export const generateGameSession = async (mode: GameMode, customTopic?: string): Promise<GameData> => {
  // Simulate network delay for realism
  await new Promise(resolve => setTimeout(resolve, 800));

  // 1. Rastgele Kategori Seç
  const category = GAME_DATABASE[Math.floor(Math.random() * GAME_DATABASE.length)];

  // 2. Rastgele Küme (Cluster) Seç
  const cluster = category.clusters[Math.floor(Math.random() * category.clusters.length)];

  // 3. Kümeden Rastgele 2 Kelime Seç
  // Bu yöntemle her oyun açıldığında farklı kombinasyonlar gelir
  const selectedVariants = shuffleArray([...cluster.variants]).slice(0, 2);

  const secretVariant = selectedVariants[0];
  const imposterVariant = selectedVariants[1];

  return {
    category: category.name,
    secretWord: secretVariant.word,
    imposterWord: imposterVariant.word,
    secretClues: secretVariant.specific,
    imposterClues: imposterVariant.specific,
    commonClues: cluster.common || []
  };
};

export const generateAiClue = async (
  bot: Player,
  gameData: GameData,
  previousClues: Clue[],
  mode: GameMode
): Promise<string> => {
  return new Promise(resolve => {
    const mySpecificClues = bot.role === 'imposter' ? gameData.imposterClues : gameData.secretClues;
    const commonClues = gameData.commonClues;

    const usedClues = previousClues.map(c => normalize(c.text));

    let useCommonClue = false;

    // --- SİNSİ HAİN MANTIĞI ---
    if (bot.role === 'imposter') {
      if (previousClues.length > 0) {
        // Hainler artık %85 ihtimalle geniş ORTAK havuzdan seçer
        useCommonClue = Math.random() < 0.85;
      } else {
        useCommonClue = Math.random() < 0.4;
      }
    } else {
      // Masumlar genelde kendi specific listelerinden seçer
      useCommonClue = Math.random() < 0.15;
    }

    let targetList = (useCommonClue && commonClues.length > 0) ? commonClues : mySpecificClues;

    let availableClues = targetList.filter(c => !usedClues.includes(normalize(c)));

    if (availableClues.length === 0) {
      targetList = (targetList === commonClues) ? mySpecificClues : commonClues;
      availableClues = targetList.filter(c => !usedClues.includes(normalize(c)));
    }

    const finalList = availableClues.length > 0 ? availableClues : mySpecificClues;
    const selectedClue = finalList[Math.floor(Math.random() * finalList.length)];

    resolve(selectedClue);
  });
};

export const simulateAiVotes = async (
  bots: Player[],
  allPlayers: Player[],
  clues: Clue[],
  gameData: GameData
): Promise<VoteResult[]> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const results: VoteResult[] = [];

  bots.forEach(bot => {
    const myExpectedClues = bot.role === 'civilian' ? gameData.secretClues : gameData.imposterClues;
    const enemyClues = bot.role === 'civilian' ? gameData.imposterClues : gameData.secretClues;
    const commonClues = gameData.commonClues;

    let suspectId = '';
    let maxSuspicion = -1;
    let bestReason = "Şüpheli davrandı.";

    allPlayers.forEach(target => {
      if (target.id === bot.id) return;

      const targetClues = clues.filter(c => c.playerId === target.id);
      let suspicionScore = 0;
      let reasons: string[] = [];

      targetClues.forEach(clue => {
        const textLower = normalize(clue.text);

        const checkMatch = (list: string[]) => list.some(c => {
          const cNorm = normalize(c);
          return textLower.includes(cNorm) || cNorm.includes(textLower);
        });

        const isEnemySpecific = checkMatch(enemyClues);
        const isFriendSpecific = checkMatch(myExpectedClues);
        const isCommon = checkMatch(commonClues);

        if (isEnemySpecific) {
          suspicionScore += 100;
          reasons.push("Bizim kelimemizle alakası yok!");
        }
        else if (isFriendSpecific) {
          suspicionScore -= 40;
        }
        else if (isCommon) {
          suspicionScore += 10;
          reasons.push("Çok genel konuşuyor.");
        }
        else {
          suspicionScore += 15 + (Math.random() * 10);
          reasons.push("Ne dediğini anlamadım.");
        }
      });

      suspicionScore += (Math.random() * 30) - 15;

      if (suspicionScore > maxSuspicion) {
        maxSuspicion = suspicionScore;
        suspectId = target.id;

        if (reasons.some(r => r.includes("alakası"))) bestReason = "Söylediği kelime bizim konumuzla çelişiyor.";
        else if (reasons.some(r => r.includes("genel"))) bestReason = "Hep yuvarlak cevaplar verdi.";
        else if (reasons.some(r => r.includes("anlamadım"))) bestReason = "Verdiği ipucu çok saçmaydı.";
        else bestReason = "İçimden bir ses o diyor.";
      }
    });

    if (!suspectId || maxSuspicion < 10) {
      const others = allPlayers.filter(p => p.id !== bot.id);
      suspectId = others[Math.floor(Math.random() * others.length)].id;
      bestReason = "Sessiz kaldı, ondan şüpheleniyorum.";
    }

    results.push({
      voterId: bot.id,
      suspectId: suspectId,
      reason: bestReason
    });
  });

  return results;
};

// Fun Fact Generator
export const getFunFactFromGemini = async (word: string): Promise<string> => {
  const funFacts = [
    `"${word}" kelimesi hakkında ilginç bir bilgi: Türkçe'de çok yaygın kullanılan kelimelerden biridir!`,
    `Tahmin et bakalım! "${word}" kelimesi günlük konuşmada en çok kullanılan ilk 1000 kelime arasında.`,
    `"${word}" kelimesiyle ilgili eğlenceli gerçek: Birçok deyim ve atasözünde geçer!`,
    `Biliyor muydun? "${word}" kelimesi farklı lehçelerde değişik şekillerde telaffuz edilir.`,
    `"${word}" kelimesi, Türkçe'nin zengin kelime hazinesinin güzel bir örneğidir!`
  ];

  await new Promise(resolve => setTimeout(resolve, 500));

  return funFacts[Math.floor(Math.random() * funFacts.length)];
};
