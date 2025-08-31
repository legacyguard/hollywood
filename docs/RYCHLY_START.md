# 🚀 LegacyGuard Mobile - Rýchly prehľad

## 📱 Okamžité testovanie (5 minút)

### 1. Spusti aplikáciu
```bash
cd /Users/luborfedak/Documents/Github/hollywood/mobile
npx expo start
```

### 2. Stiahni Expo Go na telefón
- **iPhone**: [App Store](https://apps.apple.com/app/expo-go/id982107779)
- **Android**: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

### 3. Naskenuj QR kód
QR kód sa zobrazí v termináli - naskenuj ho telefónom

---

## 🛠️ Použitie skriptov

### Testovanie
```bash
./scripts/test-mobile.sh
```
Ponúkne ti menu s možnosťami testovania

### Deployment
```bash
./scripts/deploy-mobile.sh
```
Automatizovaný proces publikovania

---

## 📋 Roadmapa k publikovaniu

### Týždeň 1: Príprava
- [ ] Otestuj aplikáciu lokálne
- [ ] Vytvor Apple Developer účet ($99/rok)
- [ ] Vytvor Google Play účet ($25)

### Týždeň 2: Konfigurácia
- [ ] Spusti: `./scripts/deploy-mobile.sh`
- [ ] Vyber možnosť 7 (konfigurácia)
- [ ] Vyber možnosť 9 (environment variables)
- [ ] Vyplň Clerk a Supabase kľúče

### Týždeň 3: Build a test
- [ ] Build iOS (možnosť 1 v skripte)
- [ ] Build Android (možnosť 3 v skripte)
- [ ] Submit do TestFlight (možnosť 2)
- [ ] Submit do Google Play (možnosť 4)

### Týždeň 4: Publikovanie
- [ ] Vytvor screenshoty
- [ ] Napíš popisy aplikácie
- [ ] Submit na review
- [ ] 🎉 Aplikácia je LIVE!

---

## 💡 Dôležité príkazy

### Spustenie aplikácie
```bash
cd mobile
npx expo start
```

### Build pre iOS
```bash
eas build --platform ios --profile production
```

### Build pre Android
```bash
eas build --platform android --profile production
```

### Submit do TestFlight
```bash
eas submit -p ios --latest
```

### Submit do Google Play
```bash
eas submit -p android --latest
```

### OTA aktualizácia
```bash
eas update --branch production --message "Popis zmien"
```

---

## 📁 Štruktúra projektu

```
hollywood/
├── mobile/                 # Mobilná aplikácia
│   ├── src/               # Zdrojový kód
│   │   ├── screens/       # Obrazovky
│   │   ├── components/    # Komponenty
│   │   ├── navigation/    # Navigácia
│   │   └── services/      # Služby
│   ├── assets/            # Obrázky a ikony
│   ├── app.json           # Konfigurácia Expo
│   └── eas.json           # Build konfigurácia
├── packages/              # Zdieľané balíčky
│   ├── ui/               # Tamagui komponenty
│   └── shared/           # Zdieľaná logika
├── scripts/              # Pomocné skripty
│   ├── test-mobile.sh    # Testovanie
│   └── deploy-mobile.sh  # Deployment
└── docs/                 # Dokumentácia
    └── MOBILNA_APLIKACIA_NAVOD.md
```

---

## ❓ Časté otázky

### Musím mať Mac pre iOS aplikáciu?
**NIE!** EAS Build builduje v cloude. Potrebuješ len Apple Developer účet.

### Koľko to stojí?
- Apple Developer: $99/rok
- Google Play: $25 jednorazovo
- Expo: ZADARMO (pre naše potreby)
- **Spolu prvý rok**: $124

### Ako dlho trvá schválenie?
- **Apple**: 24-48 hodín
- **Google**: 2-3 hodiny

### Môžem testovať bez účtov?
**ÁNO!** Cez Expo Go môžeš testovať zadarmo. Účty potrebuješ len na publikovanie.

### Čo ak niečo nefunguje?
1. Skontroluj dokumentáciu: `docs/MOBILNA_APLIKACIA_NAVOD.md`
2. Vyčisti cache: `npx expo start --clear`
3. Resetuj node_modules: `rm -rf node_modules && npm install`

---

## 🎯 Tvoje najbližšie kroky

### Dnes (5 minút)
1. Spusti `npx expo start` v mobile adresári
2. Stiahni Expo Go na telefón
3. Naskenuj QR kód a otestuj

### Tento týždeň
1. Vytvor developer účty
2. Spusti `./scripts/deploy-mobile.sh`
3. Konfiguruj projekt (možnosť 7)

### Budúci týždeň
1. Vytvor produkčné buildy
2. Otestuj cez TestFlight/Google Play
3. Priprav metadata pre obchody

---

## 📞 Kontakt a podpora

**Pri problémoch:**
- 📧 Email: support@legacyguard.sk
- 💬 Discord: discord.gg/legacyguard
- 📚 Dokumentácia: `docs/MOBILNA_APLIKACIA_NAVOD.md`

**Užitočné odkazy:**
- [Expo dokumentácia](https://docs.expo.dev)
- [Apple Developer](https://developer.apple.com)
- [Google Play Console](https://play.google.com/console)

---

## ✅ Záverečný checklist

**Pred publikovaním overiť:**
- [ ] Aplikácia funguje na iPhone aj Android
- [ ] Dark mode funguje správne
- [ ] Prihlásenie/registrácia funguje
- [ ] Všetky obrazovky sú dostupné
- [ ] Žiadne známe chyby
- [ ] Environment variables nastavené
- [ ] Ikony a splash screen pripravené
- [ ] Screenshoty vytvorené
- [ ] Popisy napísané (SK + EN)
- [ ] Privacy Policy a Terms vytvorené

---

**Máš všetko pripravené!** 🎉

Stačí sledovať kroky v tomto dokumente a o mesiac budeš mať aplikáciu v App Store aj Google Play!

---

*Verzia: 1.0.0 | Aktualizované: 31.8.2025*
