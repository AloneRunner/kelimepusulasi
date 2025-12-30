// 5 harfli Türkçe kelimeler - Wordle için (TAM 5 HARF!)
export const WORDLE_WORDS: string[] = [
  // Gerçek 5 harfli Türkçe kelimeler
  "ARABA", "KITAP", "KALEM", "BEYAZ", "SIYAH", "YESIL", "GUZEL", "MUTLU",
  "KOPEK", "ASKEP", "ASLAN", "KADIN", "ERKEK", "COCUK", "INSAN", "AHALI",
  "EVLER", "YOLUR", "SOKAK", "SEHIR", "KOPAR", "KASAP", "PAZAR", "CAMI",
  "OKULA", "SINIF", "DERSA", "HOCA", "TALEBA",
  "BAHCE", "AGACA", "CICEK", "DENIZ", "GUNES", "YILDZ", "GEZGI",
  "BALIK", "TAVUK", "HOROZ", "KARGA", "KOYUN",
  "MASAM", "KAPIK", "LAMBA", "SATIN", "DOLAP", "YATAK", "YASTA",
  "SEKER", "EKMEK", "PEYNA", "SALAM", "SUCUK", "PATAP",
  "SOUDA", "BIBER", "KABAK", "HAVUC", "ELMAP", "ARMUT", "KIRAZ",
  "UZUMA", "KAVUN", "KARPZ", "LIMON",
  "BUYUK", "KUCUK", "UZUNI", "KISA", "HAFIF", "AGIRL",
  "ACILI", "TATLI", "EKSIA", "TUZLA", "SICAK", "SOĞUK",
  "KOSMA", "YURME", "UCMAL", "YAZMA", "OKUMA",
  "DUVAR", "TAVAN", "ZEMIN", "MERDE", "ASAMA", "PERON",
  "UCAKA", "GEMIS", "ARACA", "TAKSI",
  "SABAH", "AKSAM", "GECE", "GECEK", "HAFTA",
  "BIRAZ", "FAZLA", "AZLIK",
  "KORKU", "SEVGI", "HAYAL", "GERCK", "DOGRA", "YANLI", "KOLAY", "ZORUK",
  "CAMUR", "KAYIP", "TUGLA", "BIRAK",
  "FUTBO", "VOLEY", "TENIS", "SPORD",
  "ILKBA", "YAZLA", "SONBA", "KIŞIN",
  "SANMA", "BILMA", "GORMA", "DINLE", "KONUA",
  "GULMA", "AGLA", "GIZLA", "SAKLA", "BULMA",
  "TOPRA", "KAYAS", "DAGLA"
];

// Kelime validasyonu için (oyuncunun girdiği kelime geçerli mi?)
export function isValidWord(word: string): boolean {
  return WORDLE_WORDS.includes(word.toUpperCase());
}

// Rastgele kelime seç
export function getRandomWord(): string {
  return WORDLE_WORDS[Math.floor(Math.random() * WORDLE_WORDS.length)];
}
