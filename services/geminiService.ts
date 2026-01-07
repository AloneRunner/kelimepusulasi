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
        // Common: Hainin sığınacağı, tüm içeceklere uyan "güvenli" limanlar (Eski + Yeni birleşik)
        common: [
          // Eski temel ipuçları
          "Sıcak", "Bardak", "İçmek", "Sıvı", "Keyif", "Kafe", "Dumanı", "Şeker",
          "Kaşık", "Yudum", "Kahvaltı", "Akşam", "İkram", "Kupa", "Termos",
          "Boğaz", "Sohbet", "Misafir", "Hararet", "Kış", "Rahatlamak", "Fincan",
          "Aromalı", "Taze", "Sütlü", "Şekersiz", "Acı", "Tiryaki", "Sabah",
          "Demlik", "Doldur", "Koku", "Canlandırıcı", "Mola", "Dinlen", "Ismarlamak",
          // Yeni yaratıcı eklemeler
          "İçini ısıtır", "Dumanı üstünde", "Dudak payı", "Kış günü",
          "Sohbet bahanesi", "Kaynar", "Boğazı yumuşatır", "Sabah rutini"
        ],
        variants: [
          {
            word: "Çay",
            specific: [
              // Eski temel
              "Demlik", "Rize", "Simit", "Bitki", "Tirebolu", "Çaykur", "Poşet",
              "İnce belli", "Bergamot", "Kaçak", "Limonlu", "Nane", "Açık", "Koyu", "Demleme",
              // Yeni yaratıcı (Türk kültürü, pop-kültür)
              "Tavşan kanı",    // Klasik deyim
              "Ajda",           // (İnce belli bardak - Ajda Pekkan)
              "Kıtlama",        // (Erzurum kültürü)
              "Erdal Bakkal",   // (İsmail Abi / Leyla ile Mecnun)
              "Çernobil",       // (80'ler radyasyon olayı)
              "Simit sarayı",   // (Eşlikçi)
              "İki şeker",      // (Klasik sipariş)
              "Hararet alır",   // (Yazın içilme sebebi)
              "Paşa"            // (Ilık çay)
            ]
          },
          {
            word: "Kahve",
            specific: [
              // Eski temel
              "Telve", "Fal", "Türk", "Espresso", "Çekirdek", "Kavrulmuş", "Dibek",
              "Latte", "Barista", "Köpük", "Filtre", "Nescafe", "Kafein",
              // Yeni yaratıcı
              "40 yıl hatır",   // (Atasözü)
              "Kız isteme",     // (Tuzlu kahve ritüeli)
              "Yemen",          // (Türkü: Kahve Yemenden gelir)
              "Üç vakte kadar", // (Fal kültürü)
              "Ayıltır",        // (Fonksiyon)
              "Starbucks",      // (Popüler kültür/Beyaz yaka)
              "Orta",           // (Şeker oranı)
              "Menengiç",       // (Yöresel çeşit)
              "Uykusuzluk"      // (Yan etki)
            ]
          },
          {
            word: "Sıcak Çikolata",
            specific: [
              // Eski temel
              "Kakao", "Şanti", "Belçika", "Tatlı", "Kahverengi", "Kremsi", "Yoğun", "Krem", "Bitter",
              // Yeni yaratıcı
              "Mutluluk",       // (Serotonin etkisi)
              "Battaniye",      // (Kış modu klişesi)
              "Marshmallow",    // (Amerikan tarzı sunum)
              "Kayak merkezi",  // (Uludağ'da içilir)
              "Kalori bombası", // (Diyet düşmanı)
              "İsviçre",        // (Çikolata ülkesi)
              "Sütlü",          // (Yapılışı)
              "Çocuk"           // (Hedef kitle)
            ]
          },
          {
            word: "Salep",
            specific: [
              // Eski temel
              "Tarçın", "Maraş", "Beyaz", "Kıvamlı", "Şifa", "Toz", "Osmanlı", "Geleneksel", "Kar", "Dondurma yapımı",
              // Yeni yaratıcı
              "Orkide",         // (Hammaddesi - Zor bilgi)
              "Vapur",          // (İstanbul klasiği)
              "Seyyar"          // (Sokak satıcısı)
            ]
          }
        ]
      },
      {
        id: "fast_food",
        // Common: Eski + Yeni birleşik
        common: [
          // Eski temel
          "Hızlı", "Yemek", "Paket", "Kalori", "Doyurucu", "Kola", "Elle", "Sıcak",
          "Yağlı", "Sos", "Öğle", "Sipariş", "Kurye", "Lezzetli", "Zararlı",
          "Tuzlu", "Getir", "Menü", "Abur cubur", "Sokak", "Ucuz", "Lokanta",
          "Acıktım", "Patates", "Ketçap", "Mayonez", "Turşu", "Marul",
          "Gece açık", "Aklıma geldi", "Zincir", "Menü kombin", "Kampanya", "2 al 1 öde",
          // Yeni yaratıcı
          "Kalori bombası", "Ayaküstü", "Bol soslu", "Öğrenci dostu",
          "Paket servis", "Karbonhidrat", "Zincir restoran", "Gece yarısı"
        ],
        variants: [
          {
            word: "Pizza",
            specific: [
              // Eski temel
              "Dilim", "İtalyan", "Yuvarlak", "Kutu", "Peynir", "Sucuk", "Mantar",
              "Kenar", "Acılı", "Dominos", "Hamur", "Fırın",
              // Yeni yaratıcı
              "Ninja Kaplumbağalar", // (Pop Kültür - Çizgi Film)
              "Napoli",              // (Ansiklopedik - Köken Şehir)
              "Kule",                // (Çağrışım - Pisa Kulesi/İtalya)
              "Margarita",           // (Tarih - Kraliçe Margarita'dan gelir)
              "30 dakika kuralı",    // (Sektör Efsanesi)
              "İnce hamur",          // (Fiziksel Özellik)
              "Fırın küreği",        // (Alet)
              "Mozzarella"           // (Malzeme Bilgisi)
            ]
          },
          {
            word: "Hamburger",
            specific: [
              // Eski temel
              "Köfte", "Amerikan", "McDonald's", "Whopper", "Çift katlı",
              "Soğan halkası", "Ekmeği yumuşak", "Burger King", "Mangal", "Izgara",
              // Yeni yaratıcı
              "Hamburg",             // (Ansiklopedik - Şehir Kökeni)
              "Palyaço",             // (Pop Kültür - Ronald McDonald)
              "Susamlı ekmek",       // (Fiziksel Özellik)
              "Amerika",             // (Kültürel Çağrışım)
              "Turşu",               // (Ayırt edici detay)
              "Big Mac",             // (Marka/Ekonomi indeksi)
              "Obezite",             // (Tıbbi Sonuç)
              "İki ekmek arası"      // (Tanım)
            ]
          },
          {
            word: "Lahmacun",
            specific: [
              // Eski temel
              "Limon", "Maydanoz", "Dürüm", "Kıyma", "Çıtır", "İnce",
              "Taş fırın", "Antep", "Urfa", "Ayran yanı", "Acılı biber",
              // Yeni yaratıcı
              "İmparator",           // (Pop Kültür - İbrahim Tatlıses)
              "Türk Pizzası",        // (Turistik Tanım)
              "Şanlıurfa",           // (Coğrafya - Acılı köken)
              "Soğanlı mı soğansız mı", // (Toplumsal Tartışma)
              "Kıymalı harç",        // (İçerik)
              "Kürek"                // (Alet)
            ]
          },
          {
            word: "Döner",
            specific: [
              // Eski temel
              "Şiş", "Usta", "Büfe", "Hatay", "Tavuk", "Et", "Lavaş",
              "Tombik", "Ekmek arası", "Kesmek", "İskender",
              // Yeni yaratıcı
              "Dikey",               // (Teknik Bilgi - Pişirme açısı)
              "Almanya",             // (Sosyolojik - Gurbetçilerin milli yemeği)
              "Bursa",               // (Tarih - İskender Efendi)
              "Satır",               // (Alet - Et döner için)
              "Hatay usulü",         // (Yöresel Varyasyon - Soslu)
              "Ayran",               // (Kimyasal Uyum/Eşlikçi)
              "Yaprak"               // (Kesim Tekniği)
            ]
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
          "Korku", "Ilaç", "Zararlı", "Faydalı", "Doğa", "Ekosistem",
          "Anten", "Göz", "Larvadan", "Metamorfoz", "Kış uykusu", "Yuva", "Koloni",
          "Uğuldamak", "Sürüngen değil", "Omurgasız", "Toplanmak", "Tedirgin eden"
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
  },

  // ═══════════════════════════════════════════════════════════════
  // 17. KATEGORİ: SOSYAL MEDYA & İNTERNET
  // ═══════════════════════════════════════════════════════════════
  {
    id: "sosyal_medya",
    name: "Sosyal Medya",
    clusters: [
      {
        id: "platformlar",
        common: [
          "İnternet", "Uygulama", "Paylaşım", "Takipçi", "Beğeni", "Telefon",
          "Bildirim", "Gençler", "Bağımlılık", "Ekran", "Hesap", "Profil", "Online"
        ],
        variants: [
          {
            word: "Instagram",
            specific: ["Fotoğraf", "Story", "Reels", "Filtre", "DM", "Keşfet", "Influencer", "Hashtag", "Hikaye"]
          },
          {
            word: "TikTok",
            specific: ["Video", "Dans", "Trend", "Müzik", "15 saniye", "FYP", "Çin", "Viral", "Challenge"]
          },
          {
            word: "YouTube",
            specific: ["Video", "Abone ol", "Kanal", "İzlemek", "Youtuber", "Reklam", "Canlı yayın", "Shorts", "Google"]
          },
          {
            word: "Twitter",
            specific: ["Tweet", "Gündem", "Kuş", "Mavi tik", "Elon Musk", "X", "RT", "Mention", "Thread"]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // 18. KATEGORİ: BİLGİSAYAR & OYUN
  // ═══════════════════════════════════════════════════════════════
  {
    id: "bilgisayar_oyun",
    name: "Bilgisayar & Oyun",
    clusters: [
      {
        id: "cihazlar",
        common: [
          "Elektrik", "Şarj", "Ekran", "Tuş", "Kablo", "Teknoloji", "Pahalı",
          "Marka", "Model", "Yeni nesil", "Taşınabilir", "Oyun"
        ],
        variants: [
          {
            word: "PlayStation",
            specific: ["Sony", "Konsol", "PS5", "Controller", "Joystick", "Oyun", "TV", "Mavi ışık", "Exclusive"]
          },
          {
            word: "Laptop",
            specific: ["Dizüstü", "Taşınabilir", "Pil", "Çalışma", "MacBook", "Windows", "Klavye", "Ekran parlaklığı"]
          },
          {
            word: "Klavye",
            specific: ["Tuş", "Mekanik", "RGB", "Yazmak", "Enter", "Backspace", "Türkçe Q", "Gaming"]
          },
          {
            word: "Kulaklık",
            specific: ["Müzik", "Kulak üstü", "bluetooth", "Gürültü engelleme", "AirPods", "Kablo", "Ses", "Oyun"]
          }
        ]
      },
      {
        id: "oyunlar",
        common: [
          "Oynamak", "Eğlence", "Rekabet", "Skor", "Seviye", "Karakter", "Online",
          "Arkadaş", "Takım", "Turnuva", "Strateji", "Aksiyon"
        ],
        variants: [
          {
            word: "Minecraft",
            specific: ["Blok", "Madencilik", "İnşa", "Creeper", "Steve", "Pixel", "Hayatta kalma", "Elmas", "Küp"]
          },
          {
            word: "Fortnite",
            specific: ["Battle Royale", "Dans", "V-bucks", "Skin", "Epic Games", "Silah", "Fırtına", "100 kişi"]
          },
          {
            word: "GTA",
            specific: ["Araba çalmak", "Açık dünya", "Los Santos", "Rockstar", "Suç", "Polis", "18+", "Online"]
          },
          {
            word: "FIFA",
            specific: ["Futbol", "EA Sports", "Ultimate Team", "Maç", "Gol", "Takım kurma", "Paket açma", "Yıllık"]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // 19. KATEGORİ: DOĞA & HAVA
  // ═══════════════════════════════════════════════════════════════
  {
    id: "doga_hava",
    name: "Doğa & Hava",
    clusters: [
      {
        id: "hava_durumlari",
        common: [
          "Gökyüzü", "Dışarı", "Meteoroloji", "Tahmin", "Sıcaklık", "Derece",
          "Mevsim", "Giyinmek", "Haber", "Doğa", "İklim"
        ],
        variants: [
          {
            word: "Yağmur",
            specific: ["Şemsiye", "Damla", "Bulut", "Islak", "Su birikintisi", "Çamur", "Gök gürültüsü", "Evde kalmak"]
          },
          {
            word: "Kar",
            specific: ["Beyaz", "Soğuk", "Kardan adam", "Kayak", "Kaymak", "Kış tatili", "Lapa lapa", "Tipi"]
          },
          {
            word: "Fırtına",
            specific: ["Rüzgar", "Tehlike", "Şiddetli", "Ağaç devrilme", "Elektrik kesintisi", "Kasırga", "Hortum"]
          },
          {
            word: "Güneş",
            specific: ["Sıcak", "Yaz", "Güneş kremi", "Bronzlaşma", "Gözlük", "Terleme", "Bunaltıcı", "Plaj"]
          }
        ]
      },
      {
        id: "dogal_afetler",
        common: [
          "Tehlike", "Felaket", "AFAD", "Kurtarma", "Hasar", "Enkaz", "Yardım",
          "Deprem çantası", "Göç", "Haber", "Ölüm", "Kayıp"
        ],
        variants: [
          {
            word: "Deprem",
            specific: ["Sarsıntı", "Büyüklük", "Fay hattı", "Çökme", "7.8", "Kahramanmaraş", "Tsunami", "Bina"]
          },
          {
            word: "Sel",
            specific: ["Su baskını", "Taşkın", "Ev boşaltma", "Çamur", "Dere", "Karadeniz", "Altyapı", "Otomobil"]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // 20. KATEGORİ: SPOR DALLARI (GENİŞLETİLMİŞ)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "spor_dallari",
    name: "Spor Dalları",
    clusters: [
      {
        id: "raket_sporlari",
        common: [
          "Raket", "Top", "Kort", "Sayı", "Maç", "Servis", "Ağ", "Tek veya çift",
          "Wimbledon", "Profesyonel", "Turnuva"
        ],
        variants: [
          {
            word: "Tenis",
            specific: ["Sarı top", "Deuce", "Grand Slam", "Nadal", "Federer", "Çim kort", "Love", "40-30"]
          },
          {
            word: "Badminton",
            specific: ["Tüylü top", "Hafif", "Hızlı", "Kapalı salon", "Olimpik", "Smash", "Uzun raket"]
          },
          {
            word: "Masa Tenisi",
            specific: ["Ping pong", "Küçük top", "Çinliler", "Yıldırım hızı", "Spin", "Backhand", "Turuncu top"]
          }
        ]
      },
      {
        id: "dovus_sporlari",
        common: [
          "Ring", "Dövüş", "Rakip", "Kemer", "Hakem", "Yenmek", "Antrenman",
          "Güç", "Teknik", "Nakavt", "UFC"
        ],
        variants: [
          {
            word: "Boks",
            specific: ["Yumruk", "Eldiven", "Round", "Kanca", "Mike Tyson", "Köşe", "Ağır siklet", "Sayı ile"]
          },
          {
            word: "Güreş",
            specific: ["Minder", "Tutuş", "Türk sporu", "Kıran kırana", "Sırtını yere", "Yağlı güreş", "Kıspet"]
          },
          {
            word: "Tekvando",
            specific: ["Tekme", "Kore", "Kuşak", "Poom", "Kafa koruyucu", "Sayı sistemi", "Ayak vuruşu"]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // 21. KATEGORİ: ÜLKELER & ŞEHİRLER
  // ═══════════════════════════════════════════════════════════════
  {
    id: "ulkeler",
    name: "Ülkeler & Şehirler",
    clusters: [
      {
        id: "avrupa",
        common: [
          "Avrupa", "Turist", "Vize", "Uçak", "Tatil", "Kültür", "Tarih",
          "Euro", "Müze", "Eski", "Mimari", "Yurtdışı"
        ],
        variants: [
          {
            word: "Paris",
            specific: ["Eyfel Kulesi", "Fransa", "Aşk şehri", "Luvre", "Croissant", "Sena Nehri", "Moda"]
          },
          {
            word: "İtalya",
            specific: ["Roma", "Pizza", "Makarna", "Kolezyum", "Vatikan", "Venedik", "Gondol", "Çizme şekli"]
          },
          {
            word: "İspanya",
            specific: ["Madrid", "Barselona", "Boğa güreşi", "Flamenko", "Paella", "Siesta", "Güneş"]
          }
        ]
      },
      {
        id: "asya",
        common: [
          "Asya", "Uzak doğu", "Kalabalık", "Farklı kültür", "Yemek", "Teknoloji",
          "Ucuz üretim", "Tarih", "Antik"
        ],
        variants: [
          {
            word: "Japonya",
            specific: ["Tokyo", "Suşi", "Samuray", "Anime", "Sakura", "Teknoloji", "Deprem", "Ada ülkesi"]
          },
          {
            word: "Çin",
            specific: ["Pekin", "Çin Seddi", "Pirinç", "Chopstick", "Nüfus", "Panda", "Döviz", "Fabrika"]
          },
          {
            word: "Hindistan",
            specific: ["Tac Mahal", "Kalabalık", "Bollywood", "Baharat", "Yoga", "Ganj Nehri", "İnek", "Curry"]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // 22. KATEGORİ: TÜRK YEMEKLERİ (GENİŞLETİLMİŞ)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "turk_yemekleri",
    name: "Türk Yemekleri",
    clusters: [
      {
        id: "et_yemekleri",
        common: [
          "Et", "Pişirmek", "Lezzet", "Baharat", "Geleneksel", "Ev yapımı",
          "Tencere", "Ocak", "Pazar", "Misafir", "Sofra", "Aile"
        ],
        variants: [
          {
            word: "Kebap",
            specific: ["Adana", "Urfa", "Şiş", "Mangal", "Kıyma", "Acılı", "Pide", "Lahmacun", "Lavaş"]
          },
          {
            word: "Köfte",
            specific: ["Yuvarlak", "Izgara", "Ekmek arası", "İnegöl", "Akçaabat", "Soğan", "Maydanoz", "Sade"]
          },
          {
            word: "Döner",
            specific: ["Dürüm", "Duran çevirme", "Et veya tavuk", "Ekmek", "Sos", "Ayran", "Gece atıştırma"]
          },
          {
            word: "İskender",
            specific: ["Bursa", "Yoğurt", "Tereyağı", "Domates sosu", "Pide", "Porsiyon", "İskenderoğlu"]
          }
        ]
      },
      {
        id: "kahvaltilik",
        common: [
          "Sabah", "Kahvaltı", "Sofra", "Ekmek", "Peynir", "Zeytin", "Çay",
          "Hafta sonu", "Serpme", "Köy", "Organik"
        ],
        variants: [
          {
            word: "Menemen",
            specific: ["Yumurta", "Domates", "Biber", "Tavada", "Sıcak sıcak", "Kaşıkla", "Pişirmek", "Sucuklu"]
          },
          {
            word: "Simit",
            specific: ["Halka", "Susam", "Çay yanına", "Gel simitçi", "Gevrek", "Taze", "Fırın", "Peynirli"]
          },
          {
            word: "Börek",
            specific: ["Yufka", "Peynir", "Kıyma", "Fırın", "Tepsi", "Su böreği", "Sigara böreği", "Islatmak"]
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

// Helper: Levenshtein mesafesi (yazım hatası toleransı için)
const levenshteinDistance = (a: string, b: string): number => {
  const matrix: number[][] = [];

  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
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

    // --- GELİŞTİRİLMİŞ HAİN MANTIĞI ---
    if (bot.role === 'imposter') {
      // HAİN STRATEJİSİ:
      // Hainin hayatta kalmasının tek yolu "Ortak" kelimeleri kullanmaktır.
      // Kendi spesifik kelimesini kullanırsa anında yakalanır.
      // Bu yüzden %95 ihtimalle ortak kelime seçmeli (çok agresif!)
      useCommonClue = Math.random() < 0.95;
    } else {
      // MASUM STRATEJİSİ:
      // Masumlar %35 ihtimalle ortak (biraz daha fazla), %65 ihtimalle spesifik kelime kullanır.
      useCommonClue = Math.random() < 0.35;
    }

    let targetList = (useCommonClue && commonClues.length > 0) ? commonClues : mySpecificClues;

    let availableClues = targetList.filter(c => !usedClues.includes(normalize(c)));

    if (availableClues.length === 0) {
      targetList = (targetList === commonClues) ? mySpecificClues : commonClues;
      availableClues = targetList.filter(c => !usedClues.includes(normalize(c)));
    }

    // GİZLİ KELİME FİLTRESİ: Botlar yanlışlıkla gizli kelimeyi söylemesin!
    const secretWordNorm = normalize(gameData.secretWord);
    const imposterWordNorm = normalize(gameData.imposterWord);

    // Gizli kelimeyi veya hain kelimesini içeren ipuçlarını filtrele
    const safeClues = availableClues.filter(c => {
      const clueNorm = normalize(c);
      // İpucu gizli kelimeyi içeriyorsa veya gizli kelime ipucunu içeriyorsa filtrele
      if (clueNorm.includes(secretWordNorm) || secretWordNorm.includes(clueNorm)) return false;
      if (clueNorm.includes(imposterWordNorm) || imposterWordNorm.includes(clueNorm)) return false;
      return true;
    });

    // HAININ İPUÇLARI: Spesifik cevapları daha vagas hale getir (daha az belli olması için)
    let finalList = safeClues.length > 0 ? safeClues : availableClues;
    
    // Eğer Hainin spesifik listesinden seçiyorsa ve çok açık görünüyorsa, başka stratejiye geç
    if (bot.role === 'imposter' && targetList === mySpecificClues && finalList.length > 0) {
      // Hain spesifik ipucu vermek yerine, gümrük geçmeyen cevaplar ver
      // Yani: genel, muğlak, kendinden açıkça kurtaran cevaplar
      const obfuscatedClues = [
        "Genel bir kategori", "Hepimizin bildiği", "Sıradan bir şey",
        "Komik değil", "Serius bir konu", "Popüler kültür", "Antik",
        "Modern", "Klasik", "Sanat eseri", "İconik", "Ünlü", "Meşhur",
        "Efsanevi", "Tarihi", "Kurgusal", "Gerçek", "Varsayımsal"
      ];
      const selectedClue = obfuscatedClues[Math.floor(Math.random() * obfuscatedClues.length)];
      resolve(selectedClue);
    } else {
      const selectedClue = finalList[Math.floor(Math.random() * finalList.length)];
      resolve(selectedClue);
    }
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
    // ------------------------------------------
    // SENARYO A: BOT BİR MASUMSA (Dedektif Modu)
    // ------------------------------------------
    if (bot.role === 'civilian') {
      const myExpectedClues = gameData.secretClues;
      const enemyClues = gameData.imposterClues;
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

          // Fuzzy matching: Tam eşleşme veya 2 karaktere kadar yazım hatası toleransı
          const checkMatch = (list: string[]) => list.some(c => {
            const cNorm = normalize(c);
            // Tam eşleşme veya içerme kontrolü
            if (textLower.includes(cNorm) || cNorm.includes(textLower)) return true;
            // Levenshtein mesafesi kontrolü (2 karaktere kadar hata toleransı)
            if (levenshteinDistance(textLower, cNorm) <= 2) return true;
            return false;
          });

          const isEnemySpecific = checkMatch(enemyClues);
          const isFriendSpecific = checkMatch(myExpectedClues);
          const isCommon = checkMatch(commonClues);

          if (isEnemySpecific) {
            suspicionScore += 150;
            reasons.push("Verdiği ipucu bizim konuyla tamamen alakasız!");
          }
          else if (isFriendSpecific) {
            suspicionScore -= 50;
          }
          else if (isCommon) {
            suspicionScore += 10;
            reasons.push("Çok yuvarlak konuşuyor, risk almıyor.");
          }
          else {
            // BİLİNMEYEN/SAÇMA KELİME - ÇOK ŞÜPHELİ!
            // Eğer birisi hiçbir listeyle eşleşmeyen bir şey söylüyorsa,
            // ya haini ya da konuyu bilmiyor.
            suspicionScore += 80;
            reasons.push("Söylediği kelime tamamen alakasız!");
          }
        });

        suspicionScore += (Math.random() * 20) - 10;

        if (suspicionScore > maxSuspicion) {
          maxSuspicion = suspicionScore;
          suspectId = target.id;
          if (reasons.length > 0) bestReason = reasons[Math.floor(Math.random() * reasons.length)];
          else bestReason = "İçgüdülerime güveniyorum.";
        }
      });

      if (!suspectId || maxSuspicion < 20) {
        const others = allPlayers.filter(p => p.id !== bot.id);
        suspectId = others[Math.floor(Math.random() * others.length)].id;
        bestReason = "Çok sessiz kaldı.";
      }

      results.push({
        voterId: bot.id,
        suspectId: suspectId,
        reason: bestReason
      });
    }
    // ------------------------------------------
    // SENARYO B: BOT BİR HAİNSE (Sabotaj Modu)
    // ------------------------------------------
    else {
      const others = allPlayers.filter(p => p.id !== bot.id);
      const commonClues = gameData.commonClues;

      const potentialVictims = others.map(p => {
        const pClues = clues.filter(c => c.playerId === p.id);
        let vagueCount = 0;
        pClues.forEach(clue => {
          const text = normalize(clue.text);
          if (commonClues.some(c => normalize(c) === text || text.includes(normalize(c)))) {
            vagueCount++;
          }
        });
        return { player: p, score: vagueCount };
      });

      potentialVictims.sort((a, b) => b.score - a.score);

      let targetToFrame: Player;
      let reason: string;

      if (potentialVictims.length > 0 && potentialVictims[0].score > 0) {
        targetToFrame = potentialVictims[0].player;
        reason = "Çok genel konuşuyor, sanki kelimeyi bilmiyor gibi.";
      } else {
        targetToFrame = others[Math.floor(Math.random() * others.length)];
        reason = "İçgüdülerim onu gösteriyor.";
      }

      results.push({
        voterId: bot.id,
        suspectId: targetToFrame.id,
        reason: reason
      });
    }
  });

  return results;
};

// Fun Fact Generator

import { WORD_FACTS, CATEGORY_TEMPLATES } from "../data/wordFacts";
import { CATEGORIES } from "../data/wordLists";

// Fun Fact Generator
export const getFunFactFromGemini = async (word: string): Promise<string> => {
  const normalizedWord = normalize(word);

  // 1. Önce özel veritabanımızda var mı bakalım
  if (WORD_FACTS[normalizedWord]) {
    const facts = WORD_FACTS[normalizedWord];
    await new Promise(resolve => setTimeout(resolve, 600)); // "Yükleniyor" hissi için kısa bekleme
    return facts[Math.floor(Math.random() * facts.length)];
  }

  // 2. Yoksa, kelimenin kategorisini bulup ona uygun genel bir bilgi verelim
  let categoryId = 'default';

  // Kelimeyi kategorilerde ara
  for (const cat of CATEGORIES) {
    // wordLists.ts'deki kelimeler zaten küçük harf ama normalize edilmiş olmayabilir, kontrol edelim
    // Ancak prepareList() kullandığımız için lowercase tr-TR yapılmış durumdalar.
    if (cat.words.includes(normalizedWord)) {
      categoryId = cat.id;
      break;
    }
  }

  // Kategoriye uygun şablonları al, yoksa default'a düş
  const templates = CATEGORY_TEMPLATES[categoryId] || CATEGORY_TEMPLATES['default'];
  const template = templates[Math.floor(Math.random() * templates.length)];

  // Şablondaki {word} yer tutucusunu kelimenin kendisiyle değiştir (Baş harfi büyük olsun)
  const displayWord = word.charAt(0).toLocaleUpperCase('tr-TR') + word.slice(1).toLocaleLowerCase('tr-TR');
  const fact = template.replace('{word}', displayWord);

  await new Promise(resolve => setTimeout(resolve, 500));
  return fact;
};

