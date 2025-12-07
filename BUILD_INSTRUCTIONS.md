# Build Instructions - Kelime Pusulası

## 🌐 Web Build (Tarayıcı)

```bash
npm run dev
```
Tarayıcıda `http://localhost:3000` adresinden açın.

---

## 📱 Android Build

### Gereksinimler:
- **Android Studio** (Arctic Fox veya üzeri)
- **JDK 11+**
- **Android SDK** (API Level 26+)

### Adımlar:

#### 1. Build Al ve Sync Yap
```bash
npm run build
npx cap sync android
```

#### 2. Android Studio'da Aç
```bash
npx cap open android
```

#### 3. Android Studio'da Build
- **Run** > **Run 'app'** (Shift+F10)
- Veya **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**

#### 4. Debug APK Yeri
```
android/app/build/outputs/apk/debug/app-debug.apk
```

#### 5. Release APK (Play Store için)
Android Studio'da:
- **Build** > **Generate Signed Bundle / APK**
- **Keystore** oluşturun (ilk kez ise)
- Release modda imzalı APK/AAB oluşturun

---

## 🔄 Hızlı Komutlar

```bash
# Web geliştirme
npm run dev

# Android geliştirme (build + sync + open)
npm run android

# Sadece sync
npm run sync

# Build + Sync
npm run build && npx cap sync android
```

---

## 🔧 Sorun Giderme

### Icon görünmüyorsa:
```bash
npx capacitor-assets generate
```

### Clean Build:
Android Studio'da: **Build** > **Clean Project** > **Rebuild Project**

### Gradle Sync Hatası:
```bash
cd android
./gradlew clean
cd ..
npx cap sync android
```

---

## 📦 Google Play Store Upload

1. **Build** > **Generate Signed Bundle / APK**
2. **Android App Bundle (AAB)** seçin
3. Keystore bilgilerinizi girin
4. **Release** modu seçin
5. `android/app/release/app-release.aab` dosyası oluşur
6. Google Play Console'a yükleyin

---

## ✅ Önemli Notlar

- **API Key**: `.env.local` dosyasında `GEMINI_API_KEY` tanımlı olmalı
- **Version**: Her güncellemede `versionCode` ve `versionName` arttırın (`android/app/build.gradle`)
- **Icons**: `public/` klasöründe `icon-192.png` ve `icon-512.png` olmalı
