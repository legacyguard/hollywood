# 📱 LegacyGuard Mobilná Aplikácia - Kompletný Návod

## 📋 Obsah

1. [Úvod](#úvod)
2. [Rýchly štart](#rýchly-štart)
3. [Testovanie aplikácie](#testovanie-aplikácie)
4. [Príprava na publikovanie](#príprava-na-publikovanie)
5. [Vytvorenie vývojárskych účtov](#vytvorenie-vývojárskych-účtov)
6. [Buildovanie aplikácie](#buildovanie-aplikácie)
7. [Testovanie na reálnych zariadeniach](#testovanie-na-reálnych-zariadeniach)
8. [Publikovanie v obchodoch](#publikovanie-v-obchodoch)
9. [Údržba a aktualizácie](#údržba-a-aktualizácie)
10. [Riešenie problémov](#riešenie-problémov)

---

## 🎯 Úvod

LegacyGuard mobilná aplikácia je vytvorená pomocou **React Native** a **Expo** frameworku. Tento návod ti pomôže:

- ✅ Otestovať aplikáciu lokálne
- ✅ Pripraviť ju na publikovanie
- ✅ Publikovať v App Store a Google Play
- ✅ Udržiavať a aktualizovať aplikáciu

### Čo budeš potrebovať

- **Mac alebo Windows počítač** (Mac nie je nutný pre iOS!)
- **Node.js** verzia 18+ (už máš nainštalované)
- **Smartphone** (iPhone alebo Android) na testovanie
- **$124** na vývojárske účty (detaily nižšie)
- **2-3 hodiny času** na prvotné nastavenie

---

## 🚀 Rýchly štart

### Krok 1: Spustenie aplikácie

```bash
# 1. Prejdi do hlavného adresára projektu
cd /Users/luborfedak/Documents/Github/hollywood

# 2. Spusti testovací skript
./scripts/test-mobile.sh
```

### Krok 2: Vyber si spôsob testovania

Po spustení skriptu si vyber jednu z možností:

1. **iOS Simulator** - pre Mac užívateľov
2. **Android Emulator** - vyžaduje Android Studio
3. **Expo Go** - najjednoduchšie, na tvojom telefóne
4. **Web browser** - rýchle testovanie

### Krok 3: Stiahni Expo Go

Pre testovanie na telefóne si stiahni **Expo Go**:

- 📱 **iPhone**: [App Store odkaz](https://apps.apple.com/app/expo-go/id982107779)
- 🤖 **Android**: [Google Play odkaz](https://play.google.com/store/apps/details?id=host.exp.exponent)

---

## 🧪 Testovanie aplikácie

### Spustenie na telefóne cez Expo Go

1. **Spusti aplikáciu**:
```bash
cd mobile
npx expo start
```

2. **Naskenuj QR kód**:
   - **iPhone**: Otvor fotoaparát → naskenuj QR kód
   - **Android**: Otvor Expo Go → Scan QR Code

3. **Aplikácia sa načíta** automaticky!

### Čo testovať

#### ✅ Základná funkcionalita
- [ ] **Prihlásenie/Registrácia** - funguje správne?
- [ ] **Navigácia** - všetky obrazovky sú dostupné?
- [ ] **Dark mode** - prepínanie témy v Profile
- [ ] **Offline režim** - funguje bez internetu?

#### ✅ UI konzistencia
- [ ] **Farby** - zodpovedajú dizajnu?
- [ ] **Fonty** - správne sa zobrazujú?
- [ ] **Tlačidlá** - reagujú na dotyk?
- [ ] **Animácie** - sú plynulé?

#### ✅ Špecifické funkcie
- [ ] **Skenovanie dokumentov** - kamera funguje?
- [ ] **Vault** - dokumenty sa zobrazujú?
- [ ] **Profil** - nastavenia sa ukladajú?

### Testovanie na rôznych zariadeniach

#### iPhone testovanie
```bash
# Zoznam dostupných simulátorov
xcrun simctl list devices

# Spustenie na konkrétnom simulátore
npx expo run:ios --device "iPhone 15 Pro"
```

#### Android testovanie
```bash
# Zoznam dostupných emulátorov
adb devices

# Spustenie na emulátore
npx expo run:android
```

---

## 📦 Príprava na publikovanie

### 1. Konfigurácia aplikácie

Uprav súbor `mobile/app.json`:

```json
{
  "expo": {
    "name": "LegacyGuard",
    "slug": "legacyguard",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1e40af"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "sk.legacyguard.app",
      "buildNumber": "1",
      "infoPlist": {
        "NSCameraUsageDescription": "LegacyGuard potrebuje prístup ku kamere na skenovanie dokumentov.",
        "NSPhotoLibraryUsageDescription": "LegacyGuard potrebuje prístup k fotogalérii.",
        "NSFaceIDUsageDescription": "LegacyGuard používa Face ID pre bezpečné prihlásenie."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#1e40af"
      },
      "package": "sk.legacyguard.app",
      "versionCode": 1,
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "USE_FINGERPRINT",
        "USE_BIOMETRIC"
      ]
    }
  }
}
```

### 2. Príprava grafiky

#### Ikony aplikácie

Potrebuješ tieto súbory:

| Súbor | Rozmer | Použitie |
|-------|--------|----------|
| `icon.png` | 1024×1024 | Hlavná ikona |
| `adaptive-icon.png` | 1024×1024 | Android adaptívna ikona |
| `splash.png` | 1284×2778 | Úvodná obrazovka |

#### Vytvorenie ikon automaticky

```bash
# Nainštaluj nástroj
npm install -g sharp-cli

# Vygeneruj všetky veľkosti
npx expo-optimize
```

### 3. Environment premenné

Vytvor súbor `mobile/.env.production`:

```bash
# Produkčné nastavenia
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_tvoj_kluc
EXPO_PUBLIC_SUPABASE_URL=https://tvoj-projekt.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tvoj_anon_kluc
EXPO_PUBLIC_API_URL=https://api.legacyguard.sk
```

---

## 💰 Vytvorenie vývojárskych účtov

### Apple Developer Account

**Cena**: $99/rok

#### Registrácia:

1. Choď na [developer.apple.com](https://developer.apple.com)
2. Klikni na **Enroll**
3. Vyber typ účtu:
   - **Individual** - pre jednotlivca (rýchlejšie)
   - **Organization** - pre firmu (potrebuješ IČO/DUNS)
4. Vyplň údaje a zaplať
5. Počkaj na schválenie (24-48 hodín)

#### Po schválení:

1. Prihlás sa na [App Store Connect](https://appstoreconnect.apple.com)
2. Vytvor novú aplikáciu:
   - **App Name**: LegacyGuard
   - **Language**: Slovak
   - **Bundle ID**: sk.legacyguard.app
   - **SKU**: LEGACYGUARD001

### Google Play Developer Account

**Cena**: $25 (jednorazovo)

#### Registrácia:

1. Choď na [Play Console](https://play.google.com/console)
2. Klikni **Create account**
3. Vyplň:
   - Typ účtu (osobný/firemný)
   - Meno vývojára
   - Kontaktné údaje
4. Zaplať $25
5. Účet je **okamžite aktívny**

#### Vytvorenie aplikácie:

1. V Play Console klikni **Create app**
2. Vyplň:
   - **App name**: LegacyGuard
   - **Default language**: Slovenčina
   - **App type**: Application
   - **Category**: Finance
   - **Free/Paid**: Free

---

## 🏗️ Buildovanie aplikácie

### Automatický build proces

Použi pripravený skript:

```bash
# Spusti deployment skript
cd /Users/luborfedak/Documents/Github/hollywood
./scripts/deploy-mobile.sh
```

### Manuálny build proces

#### 1. Inštalácia EAS CLI

```bash
# Nainštaluj EAS CLI globálne
npm install -g eas-cli

# Prihlás sa
eas login
```

#### 2. Konfigurácia projektu

```bash
cd mobile

# Prvotná konfigurácia
eas build:configure

# Skontroluj konfiguráciu
cat eas.json
```

#### 3. Build pre iOS

```bash
# Development build (pre testovanie)
eas build --platform ios --profile development

# Production build (pre App Store)
eas build --platform ios --profile production
```

**Čo sa stane automaticky:**
- ✅ Vytvorenie certifikátov
- ✅ Vytvorenie Provisioning Profile
- ✅ Podpísanie aplikácie
- ✅ Vytvorenie .ipa súboru

#### 4. Build pre Android

```bash
# Development build
eas build --platform android --profile development

# Production build
eas build --platform android --profile production
```

**Čo sa stane automaticky:**
- ✅ Vytvorenie Keystore
- ✅ Podpísanie APK/AAB
- ✅ Optimalizácia veľkosti
- ✅ Vytvorenie .aab súboru

### Čakanie na build

- ⏱️ **Čas buildu**: 15-30 minút
- 📧 **Notifikácia**: Dostaneš email keď je hotový
- 📊 **Sledovanie**: [expo.dev/accounts/tvoj-ucet/builds](https://expo.dev)

---

## 📲 Testovanie na reálnych zariadeniach

### iOS - TestFlight

#### 1. Nahraj build do TestFlight

```bash
# Automaticky nahraj najnovší build
eas submit -p ios --latest

# Alebo vyber konkrétny build
eas submit -p ios
```

#### 2. Konfigurácia v App Store Connect

1. Prihlás sa na [App Store Connect](https://appstoreconnect.apple.com)
2. Vyber svoju aplikáciu
3. Choď na **TestFlight** tab
4. V sekcii **Internal Testing**:
   - Klikni **+** pri Test Groups
   - Vytvor skupinu "Beta Testers"
   - Pridaj emailové adresy testerov

#### 3. Pre testerov

1. Dostanú email s pozvánkou
2. Stiahnu si **TestFlight** z App Store
3. Prijmú pozvánku
4. Nainštalujú aplikáciu

### Android - Internal Testing

#### 1. Nahraj build do Google Play

```bash
# Nahraj najnovší build
eas submit -p android --latest
```

#### 2. Konfigurácia v Play Console

1. Prihlás sa na [Play Console](https://play.google.com/console)
2. Vyber aplikáciu
3. **Testing** → **Internal testing**
4. Klikni **Create new release**
5. Pridaj .aab súbor
6. V **Testers** pridaj emailové adresy

#### 3. Pre testerov

1. Dostanú link na testovanie
2. Kliknú **Become a tester**
3. Stiahnu aplikáciu z Google Play

---

## 🚀 Publikovanie v obchodoch

### Príprava metadát

#### Screenshoty

Potrebuješ screenshoty pre:

**iOS rozmery:**
- iPhone 6.7" - 1290×2796 px
- iPhone 5.5" - 1242×2208 px  
- iPad 12.9" - 2048×2732 px

**Android rozmery:**
- Telefón - 1080×1920 px
- Tablet - 1200×1920 px

#### Texty aplikácie

**Názov** (30 znakov):
```
LegacyGuard
```

**Podnadpis** (30 znakov):
```
Digitálny trezor rodiny
```

**Krátky popis** (80 znakov):
```
Ochráňte digitálny odkaz vašej rodiny - dokumenty, fotky a spomienky v bezpečí
```

**Dlhý popis** (4000 znakov):
```
LegacyGuard je váš osobný digitálny trezor, ktorý chráni 
najdôležitejšie dokumenty, fotografie a spomienky vašej rodiny.

🔒 BEZPEČNÉ ÚLOŽISKO
• Šifrované ukladanie dokumentov
• Biometrická ochrana (Face ID/Touch ID)
• Offline prístup k dôležitým súborom
• Automatické zálohovanie v cloude

📸 INTELIGENTNÉ SKENOVANIE
• Okamžité skenovanie dokumentov kamerou
• Automatické rozpoznávanie typu dokumentu
• OCR pre vyhľadávanie v texte
• Úprava a vylepšenie kvality skenu

👨‍👩‍👧‍👦 ZDIEĽANIE S RODINOU
• Bezpečné zdieľanie s dôveryhodnými osobami
• Nastavenie právomocí pre každého člena
• Časové kapsule pre budúce generácie
• Núdzový prístup pre určené osoby

🎯 ORGANIZÁCIA
• Automatické triedenie dokumentov
• Vlastné kategórie a štítky
• Pripomienky na expiráciu
• Rýchle vyhľadávanie

💎 PRÉMIOVÉ FUNKCIE
• Neobmedzené úložisko
• Pokročilé AI funkcie
• Prioritná podpora
• Export do PDF

LegacyGuard - pretože niektoré veci sú nenahraditeľné.
```

#### Kategórie a údaje

- **Kategória**: Produktivita / Finance
- **Vekové hodnotenie**: 4+
- **Obsahuje reklamy**: Nie
- **Obsahuje nákupy**: Áno (prémiová verzia)

### Publikovanie v App Store

#### 1. Príprava v App Store Connect

1. Vyplň všetky povinné polia
2. Nahraj screenshoty
3. Pridaj popis v slovenčine a angličtine
4. Nastav cenu (Free)
5. Vyber build z TestFlight

#### 2. Odoslanie na kontrolu

1. Klikni **Submit for Review**
2. Odpovedz na otázky:
   - Obsahuje šifrovanie? **Áno** (HTTPS)
   - Používa IDFA? **Nie**
   - Demo účet? Poskytni testovacie údaje

#### 3. Čakanie na schválenie

- ⏱️ **Čas kontroly**: 24-48 hodín
- 📧 **Notifikácie**: Email pri zmene stavu
- 🔄 **Možné výsledky**:
  - ✅ Approved - publikované
  - ⚠️ Rejected - treba opraviť problémy
  - 💬 Pending Developer Release - čaká na tvoje povolenie

### Publikovanie v Google Play

#### 1. Vyplnenie Store Listing

1. **Main store listing**:
   - Názov aplikácie
   - Krátky a dlhý popis
   - Screenshoty
   - Grafika (ikona, header)

2. **Kategorization**:
   - Typ aplikácie
   - Kategória
   - Štítky

3. **Contact details**:
   - Email
   - Webová stránka
   - Telefón (voliteľné)

#### 2. Content rating

1. Vyplň dotazník o obsahu
2. Odpovedz na otázky o:
   - Násilie
   - Sexuálny obsah
   - Hazardné hry
   - Vek užívateľov

#### 3. Pricing & distribution

1. Nastav cenu (Free)
2. Vyber krajiny distribúcie
3. Súhlas s pravidlami
4. Nastav zariadenia (telefóny, tablety)

#### 4. Odoslanie na kontrolu

1. **Production** → **Create new release**
2. Nahraj .aab súbor
3. Pridaj release notes
4. **Review** → **Start rollout**

#### 5. Schválenie

- ⏱️ **Čas kontroly**: 2-3 hodiny
- 🚀 **Publikovanie**: Automatické po schválení
- 📊 **Postupné vydanie**: Môžeš nastaviť % užívateľov

---

## 🔄 Údržba a aktualizácie

### Vytvorenie aktualizácie

#### 1. Zmeň verziu

V `mobile/app.json`:
```json
{
  "version": "1.1.0",  // Zmeň verziu
  "ios": {
    "buildNumber": "2"  // Zvýš build number
  },
  "android": {
    "versionCode": 2    // Zvýš version code
  }
}
```

#### 2. Build novej verzie

```bash
# Build pre oba systémy
eas build --platform all --profile production
```

#### 3. Submit aktualizácie

```bash
# iOS
eas submit -p ios --latest

# Android
eas submit -p android --latest
```

### Over-the-Air (OTA) aktualizácie

Pre menšie zmeny môžeš použiť OTA:

```bash
# Publikuj OTA aktualizáciu
eas update --branch production --message "Oprava chýb"
```

**Výhody OTA:**
- ✅ Okamžitá aktualizácia
- ✅ Bez kontroly v obchode
- ✅ Užívatelia nemusia nič sťahovať

**Obmedzenia OTA:**
- ❌ Len JavaScript zmeny
- ❌ Nie natívne moduly
- ❌ Max 50MB

### Monitoring aplikácie

#### Sledovanie výkonu

```bash
# Nainštaluj Sentry
npm install sentry-expo

# Konfigurácia v App.tsx
import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  enableInExpoDevelopment: false,
  debug: false,
});
```

#### Analytics

```bash
# Nainštaluj Firebase
npm install @react-native-firebase/app
npm install @react-native-firebase/analytics

# Použitie
import analytics from '@react-native-firebase/analytics';

analytics().logEvent('button_click', {
  button_name: 'scan_document'
});
```

---

## 🆘 Riešenie problémov

### Časté problémy a riešenia

#### Build zlyhá

**Problem**: `iOS build failed - missing provisioning profile`

**Riešenie**:
```bash
# Reset credentials
eas credentials

# Vyber: iOS → Build Credentials → Delete
# Potom znova build
eas build --platform ios --clear-credentials
```

#### Aplikácia padá pri štarte

**Problem**: Crash po otvorení

**Riešenie**:
1. Skontroluj logy:
```bash
# iOS
npx react-native log-ios

# Android
npx react-native log-android
```

2. Vyčisti cache:
```bash
npx expo start --clear
```

#### Odmietnutie v App Store

**Najčastejšie dôvody**:

1. **Chýbajúca Privacy Policy**
   - Riešenie: Pridaj link na privacy policy

2. **Nedostatočný popis funkcií**
   - Riešenie: Detailnejšie popíš funkcie

3. **Crash pri testovaní**
   - Riešenie: Otestuj na všetkých zariadeniach

4. **Používanie privátnych API**
   - Riešenie: Použi len oficiálne API

#### Google Play varuje o veľkosti

**Problem**: APK je príliš veľký

**Riešenie**:
```bash
# Použi App Bundle namiesto APK
eas build --platform android --profile production

# Optimalizuj obrázky
npx expo-optimize

# Odstráň nepoužívané knižnice
npm prune
```

### Získanie pomoci

#### Oficiálne zdroje

- 📚 [Expo dokumentácia](https://docs.expo.dev)
- 💬 [Expo Discord](https://chat.expo.dev)
- 🐛 [GitHub Issues](https://github.com/expo/expo/issues)

#### Komunita

- [Stack Overflow](https://stackoverflow.com/questions/tagged/expo)
- [Reddit r/reactnative](https://reddit.com/r/reactnative)
- [Expo fórum](https://forums.expo.dev)

#### Platená podpora

- [Expo Priority Support](https://expo.dev/pricing)
- Freelance React Native vývojári
- Konzultácie s expertami

---

## ✅ Finálny checklist

### Pred prvým publikovaním

- [ ] **Testovanie**
  - [ ] Všetky funkcie otestované
  - [ ] Žiadne známe chyby
  - [ ] Funguje offline režim
  - [ ] Dark mode funguje

- [ ] **Právne**
  - [ ] Privacy Policy vytvorená
  - [ ] Terms of Service vytvorené
  - [ ] GDPR compliance
  - [ ] Cookie policy

- [ ] **Grafika**
  - [ ] Ikona aplikácie (1024×1024)
  - [ ] Splash screen
  - [ ] Screenshoty pre obchody
  - [ ] Promo grafika

- [ ] **Texty**
  - [ ] Názov aplikácie
  - [ ] Popis (SK + EN)
  - [ ] Keywords/štítky
  - [ ] Release notes

- [ ] **Technické**
  - [ ] Bundle ID finálny
  - [ ] Verzia nastavená
  - [ ] Environment variables
  - [ ] Push notifikácie

- [ ] **Účty**
  - [ ] Apple Developer ($99)
  - [ ] Google Play ($25)
  - [ ] Expo účet (free)
  - [ ] Platobná karta

### Po publikovaní

- [ ] **Marketing**
  - [ ] Oznámenie na sociálnych sieťach
  - [ ] Email existujúcim užívateľom
  - [ ] Tlačová správa
  - [ ] Product Hunt

- [ ] **Monitoring**
  - [ ] Sleduj hodnotenia
  - [ ] Odpovedaj na recenzie
  - [ ] Sleduj crashe
  - [ ] Analyzuj používanie

- [ ] **Údržba**
  - [ ] Pravidelné aktualizácie
  - [ ] Oprava chýb
  - [ ] Nové funkcie
  - [ ] Bezpečnostné záplaty

---

## 🎉 Gratulujem!

Ak si sa dostal až sem, máš všetko potrebné na publikovanie aplikácie!

**Pamätaj:**
- 🚀 Prvé publikovanie je najťažšie
- 📈 Každá aktualizácia je jednoduchšia
- 💪 Neboj sa požiadať o pomoc
- 🎯 Sústred sa na užívateľov

**Užitočné kontakty:**
- Email: lubor@legacyguard.sk
- Discord: LegacyGuard#1234
- Telefón: +421 XXX XXX XXX

---

*Posledná aktualizácia: 31. august 2025*
*Verzia dokumentácie: 1.0.0*
