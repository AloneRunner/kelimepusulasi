# Icon Generation Guide

## 🎨 İkon Dosyaları Oluşturma

Şu anda `public/icon.svg` dosyanız var. Bunu PNG formatına çevirmeniz gerekiyor.

## Yöntem 1: Online Araçlar (Önerilen - En Kolay)

### A) CloudConvert
1. https://cloudconvert.com/svg-to-png adresine git
2. `public/icon.svg` dosyasını yükle
3. **Genişlik: 512px** olarak ayarla
4. Convert et ve indir
5. `icon-512.png` olarak `public/` klasörüne kaydet

### B) SVGOMG + PNG Converter
1. https://svgomg.net/ - SVG'yi optimize et
2. https://svgtopng.com/ - PNG'ye çevir
3. 512x512 ve 192x192 boyutlarını oluştur

---

## Yöntem 2: Photoshop / GIMP

1. `icon.svg` dosyasını aç
2. **512x512px** boyutunda kaydet → `icon-512.png`
3. **192x192px** olarak resize et → `icon-192.png`
4. Her ikisini de `public/` klasörüne kopyala

---

## Yöntem 3: Inkscape (Ücretsiz)

1. [Inkscape İndir](https://inkscape.org/release/)
2. `icon.svg` dosyasını aç
3. **File** > **Export PNG Image**
4. Genişlik: **512px** yap
5. Export et → `icon-512.png`
6. Tekrar aç, genişlik: **192px** → `icon-192.png`

---

## Yöntem 4: ImageMagick (Terminal)

```bash
# Kurulum (Windows)
choco install imagemagick

# Dönüştürme
magick convert -density 300 -background none public/icon.svg -resize 512x512 public/icon-512.png
magick convert -density 300 -background none public/icon.svg -resize 192x192 public/icon-192.png
```

---

## 🎯 Gerekli Dosyalar

Oluşturduktan sonra `public/` klasöründe olmalı:
```
public/
  ├── icon.svg
  ├── icon-192.png  ✅
  ├── icon-512.png  ✅
  └── manifest.json
```

---

## 📱 Android Launcher Icons (Capacitor Assets ile)

PNG dosyaları hazır olduktan sonra:

```bash
# Capacitor Assets ile otomatik oluşturma
npx capacitor-assets generate --android

# veya manuel olarak:
# icon-512.png dosyasını kullanarak Android Studio'da
# Image Asset Studio ile launcher icons oluştur
```

---

## 🔧 Android Studio ile Manuel Oluşturma

1. Android Studio'yu aç
2. **android/** klasörünü aç
3. `app` klasörüne sağ tıkla
4. **New** > **Image Asset**
5. **Launcher Icons (Adaptive and Legacy)** seç
6. **Path:** `public/icon-512.png` dosyasını seç
7. **Next** > **Finish**

Bu otomatik olarak tüm boyutlarda launcher icon oluşturur.

---

## ✅ Kontrol

Build aldıktan sonra:
```bash
npm run build
npx cap sync android
npx cap open android
```

Android emulator/cihazda uygulama ikonunu kontrol et.

---

## 🚨 Sorun Giderme

### "Icon görünmüyor"
```bash
# Clean build
cd android
./gradlew clean
cd ..
npx cap sync android
```

### "Eski icon kalıyor"
- Uygulamayı cihazdan sil
- Yeniden yükle

---

## 💡 İpucu

Google Play Store için **512x512 PNG** (yuvarlak olmayan, düz background) bir icon da hazırlayın. Store Listing'de kullanılacak.
