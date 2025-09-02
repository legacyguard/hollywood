# DETAILNÝ IMPLEMENTAČNÝ PLÁN: LegacyGuard Ekosystém "Dokonalá Symbióza"

## Úvod a Strategická Vízia

LegacyGuard predstavuje komplexný ekosystém pozostávajúci z webovej aplikácie a mobilnej aplikácie "Strážca vo Vrecku", ktoré spolu vytvárajú jednotný, prémiový zážitok pre používateľov. Cieľom je vytvoriť **Dokonalú Symbiózu** medzi oboma platformami - vizuálne identické, dátovo synchronizované, ale funkčne optimalizované pre svoje špecifické použitie.

### Kľúčové Princípy

1. **Vizuálna Jednota**: Identický dizajn a komponenty na webe aj mobile
2. **Funkčná Špecializácia**: Každá platforma exceluje v tom, na čo je určená
3. **Dátová Synchronizácia**: Real-time prepojenie cez Supabase
4. **Freemium Stratégia**: Mobilná aplikácia ako lákadlo pre platené webové funkcie

---

## FÁZA 1: ZALOŽENIE SPOLOČNÝCH ZÁKLADOV

### 1.1 Prechod na Monorepo Architektúru

**Cieľ**: Zlúčiť existujúce repozitáre do jedného monorepa pre centrálnu správu kódu a závislostí.

**Technológia**: Turborepo

**Implementácia**:
```
/legacyguard-platform
├── apps/
│   ├── web/              # Existujúca webová aplikácia (hollywood)
│   └── mobile/           # Existujúca mobilná aplikácia
├── packages/
│   ├── ui/               # Zdieľané UI komponenty (Tamagui)
│   ├── config/           # Zdieľaná konfigurácia
│   ├── locales/          # Centralizované preklady
│   └── shared-types/     # Zdieľané TypeScript typy
└── docs/                 # Dokumentácia
```

**Kroky implementácie**:
1. Vytvorenie novej štruktúry monorepo
2. Migrácia existujúcich projektov
3. Nastavenie Turborepo konfigurácie
4. Aktualizácia CI/CD procesov

### 1.2 Implementácia Zdieľaného Dizajnového Systému

**Technológia**: Tamagui Framework

**Prečo Tamagui**:
- Umožňuje písať komponenty raz pre web aj mobile
- Automatické rendrovanie ako `<div>` pre web, `<View>` pre React Native
- 100% vizuálna zhoda medzi platformami
- Optimalizované pre výkon

**Implementácia v `/packages/ui/`**:

```typescript
// packages/ui/src/components/Button/Button.tsx
import { styled, Text, ButtonFrame } from '@tamagui/core'

export const Button = styled(ButtonFrame, {
  name: 'Button',
  backgroundColor: '$blue10',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
  hoverStyle: { backgroundColor: '$blue11' },
  pressStyle: { backgroundColor: '$blue12' },
  focusStyle: { backgroundColor: '$blue11' },
  borderRadius: '$4',
  
  variants: {
    size: {
      small: { paddingHorizontal: '$3', height: '$3' },
      medium: { paddingHorizontal: '$4', height: '$4' },
      large: { paddingHorizontal: '$5', height: '$5' }
    }
  }
})
```

**Dizajnové tokeny**:
```typescript
// packages/ui/src/tokens/colors.ts
export const colors = {
  // LegacyGuard Brand Colors
  primaryBlue: '#1e40af',
  primaryGreen: '#16a34a',
  accentGold: '#f59e0b',
  
  // Semantic Colors
  success: '$green10',
  warning: '$amber10',
  error: '$red10',
  info: '$blue10',
}
```

### 1.3 Centralizácia Internacionalizácie (i18n)

**Štruktúra**: `/packages/locales/`

**Implementácia podľa Language Matrix**:
- 39 krajín, 33+ jazykov
- Doménovo-orientované načítavanie jazykov
- Automatická detekcia jazyka podľa geolokácie

```typescript
// packages/locales/src/index.ts
export const DOMAIN_LANGUAGE_MATRIX = {
  'legacyguard.sk': ['sk', 'cs', 'en', 'de', 'uk'],
  'legacyguard.cz': ['cs', 'sk', 'en', 'de', 'uk'],
  'legacyguard.de': ['de', 'en', 'pl', 'uk', 'ru'],
  // ... ďalších 36 domén
}

export const loadTranslations = async (domain: string, language: string) => {
  return import(`./translations/${domain}/${language}.json`)
}
```

**Výsledky Fázy 1**:
- ✅ Jednotná kódová základňa
- ✅ Zdieľané UI komponenty
- ✅ Centralizované preklady
- ✅ Konzistentný dizajn

---

## FÁZA 2: VÝVOJ MOBILNEJ APLIKÁCIE "STRÁŽCA VO VRECKU"

### 2.1 Implementácia Kľúčových Obrazoviek

**Mobilné obrazovky s použitím zdieľaných komponentov**:

1. **Dashboard = "Záhrada Odkazu"**
   - Rýchly prehľad stavu
   - Minimálne animácie pre šetrenie batérie
   - Aktuálne výzvy a notifikácie

2. **Vault = "Trezor Dokumentov"**
   - Prezeranie nahratých dokumentov
   - Rýchle vyhľadávanie
   - Offline prístup k najdôležitejším dokumentom

3. **Scanner = "Inteligentný Skener"**
   - Kľúčová funkcia mobilnej aplikácie
   - Okamžité skenovanie a kategorizácia

### 2.2 Inteligentný Skener Dokumentov - Premium Funkcia

**Technológia**: Lokálna AI bez externých nákladov

**Implementácia**:

```typescript
// mobile/src/services/DocumentScannerService.ts
import { VisionCamera } from 'react-native-vision-camera'

export class IntelligentDocumentScanner {
  // 1. OCR Extrakcia textu
  async extractTextFromImage(imageUri: string): Promise<string> {
    // Využitie react-native-vision-camera s frame processormi
    const ocrResult = await VisionCamera.extractText(imageUri)
    return ocrResult.text
  }

  // 2. Lokálna klasifikácia bez externých API
  classifyDocument(extractedText: string): DocumentCategory {
    const classificationRules = {
      'poistenie': ['poistná zmluva', 'allianz', 'kooperativa', 'poistné'],
      'osobne': ['rodný list', 'občiansky preukaz', 'pas', 'matrika'],
      'financie': ['banka', 'účet', 'úver', 'hypotéka'],
      'zdravie': ['lekárska správa', 'recepta', 'nemocnica']
    }

    for (const [category, keywords] of Object.entries(classificationRules)) {
      if (keywords.some(keyword => 
        extractedText.toLowerCase().includes(keyword.toLowerCase())
      )) {
        return category as DocumentCategory
      }
    }
    
    return 'general'
  }

  // 3. Extrakcia metadát pomocou RegEx
  extractMetadata(text: string, category: DocumentCategory): DocumentMetadata {
    const patterns = {
      date: /\d{1,2}[.\-\/]\d{1,2}[.\-\/]\d{4}/g,
      amount: /\d+[,.]?\d*\s*€?/g,
      contractNumber: /č\.\s*\d+/g
    }

    return {
      dates: text.match(patterns.date) || [],
      amounts: text.match(patterns.amount) || [],
      contractNumbers: text.match(patterns.contractNumber) || []
    }
  }
}
```

**Výhody lokálnej AI**:
- ✅ Nulové náklady na OpenAI API
- ✅ Maximálna bezpečnosť dát
- ✅ Offline funkcionalita
- ✅ Okamžité výsledky

### 2.3 Časová Schránka - Nahrávanie Odkazov

**Funkcia**: Spontánne nahrávanie video a audio odkazov

```typescript
// mobile/src/components/TimeCapsule/TimeCapsuleRecorder.tsx
import { MediaRecorder } from 'react-native-media-recorder'

export const TimeCapsuleRecorder = () => {
  const recordMessage = async (type: 'video' | 'audio') => {
    const recording = await MediaRecorder.start({
      type,
      quality: 'high',
      maxDuration: 300000 // 5 minút
    })

    // Šifrovanie pred uploadom
    const encryptedFile = await encryptFile(recording.uri)
    
    // Upload do Supabase
    await uploadTimeCapsule(encryptedFile, {
      recipient: selectedRecipient,
      deliveryDate: selectedDate,
      message: personalMessage
    })
  }
}
```

### 2.4 Offline Trezor (SecureOfflineVault)

**Technológia**: Šifrovaná Realm Database

```typescript
// mobile/src/services/OfflineVaultService.ts
import Realm from 'realm'
import { encrypt, decrypt } from '@/utils/encryption'

class SecureDocument extends Realm.Object {
  _id!: string
  title!: string
  encryptedContent!: string
  category!: string
  syncStatus!: 'synced' | 'pending' | 'offline'
}

export class OfflineVaultService {
  private realm: Realm

  async storeDocumentOffline(document: Document) {
    const encryptedContent = await encrypt(document.content)
    
    this.realm.write(() => {
      this.realm.create('SecureDocument', {
        _id: document.id,
        title: document.title,
        encryptedContent,
        category: document.category,
        syncStatus: 'offline'
      })
    })
  }

  async syncWhenOnline() {
    const offlineDocuments = this.realm
      .objects('SecureDocument')
      .filtered('syncStatus = "pending" OR syncStatus = "offline"')

    for (const doc of offlineDocuments) {
      await this.uploadToSupabase(doc)
      this.updateSyncStatus(doc._id, 'synced')
    }
  }
}
```

---

## FÁZA 3: PREPOJENIE EKOSYSTÉMU A MONETIZAČNÁ STRATÉGIA

### 3.1 Real-time Synchronizácia

**Technológia**: Supabase Realtime Subscriptions

```typescript
// packages/shared/src/services/RealtimeSync.ts
import { createClient } from '@supabase/supabase-js'

export class RealtimeSync {
  async setupDocumentSync(userId: string) {
    const subscription = supabase
      .channel(`documents:${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'documents',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        // Aktualizuj web dashboard v reálnom čase
        this.updateGardenVisualization(payload.new)
      })
      .subscribe()

    return subscription
  }

  private updateGardenVisualization(newDocument: Document) {
    // Nový dokument = nový lístok na "Záhrade Odkazu"
    this.triggerGardenAnimation('new-leaf', newDocument.category)
  }
}
```

### 3.2 Freemium Model s Jasnými Limitmi

**Implementácia limitov**:

```typescript
// packages/shared/src/services/FreemiumLimits.ts
export interface UsageLimits {
  documents: { current: number, limit: number }
  storage: { current: number, limit: number } // MB
  timeCapsules: { current: number, limit: number }
}

export class FreemiumManager {
  async checkLimits(userId: string): Promise<UsageLimits> {
    const usage = await supabase
      .from('user_usage')
      .select('*')
      .eq('user_id', userId)
      .single()

    return {
      documents: { 
        current: usage.document_count, 
        limit: usage.plan === 'free' ? 10 : Infinity 
      },
      storage: { 
        current: usage.storage_used_mb, 
        limit: usage.plan === 'free' ? 100 : Infinity 
      },
      timeCapsules: { 
        current: usage.time_capsule_count, 
        limit: usage.plan === 'free' ? 3 : Infinity 
      }
    }
  }

  async canUploadDocument(userId: string): Promise<boolean> {
    const limits = await this.checkLimits(userId)
    return limits.documents.current < limits.documents.limit
  }
}
```

**Mobilná aplikácia - Upgrade UX**:

```typescript
// mobile/src/components/UpgradeFlow/UpgradePrompt.tsx
export const UpgradePrompt = ({ feature }: { feature: string }) => {
  return (
    <View style={styles.upgradeContainer}>
      <Text style={styles.title}>
        Táto prémiová funkcia je súčasťou plného zážitku LegacyGuard
      </Text>
      
      <Text style={styles.description}>
        {feature} je dostupná na našej webovej platforme, kde môžete 
        dokončiť svoj odkaz a získať prístup k plnej funkcionalite.
      </Text>

      <TouchableOpacity 
        style={styles.upgradeButton}
        onPress={() => Linking.openURL('https://legacyguard.sk/upgrade')}
      >
        <Text style={styles.buttonText}>Pokračovať na Web</Text>
      </TouchableOpacity>
    </View>
  )
}
```

---

## FÁZA 4: INTERNACIONALIZÁCIA A LOKALIZÁCIA

### 4.1 Implementácia 33+ Jazykov

**Štruktúra prekladov**:

```typescript
// packages/locales/src/structure.ts
export interface TranslationStructure {
  common: {
    buttons: Record<string, string>
    navigation: Record<string, string>
    errors: Record<string, string>
  }
  features: {
    scanner: Record<string, string>
    timeCapsule: Record<string, string>
    vault: Record<string, string>
  }
  legal: {
    terms: Record<string, string>
    privacy: Record<string, string>
    inheritance: Record<string, string>
  }
}
```

**Doménovo-orientované načítavanie**:

```typescript
// packages/locales/src/domain-loader.ts
export const DomainLanguageLoader = {
  async loadForDomain(domain: string) {
    const availableLanguages = DOMAIN_LANGUAGE_MATRIX[domain] || ['en']
    
    // Načítaj len jazyky pre danú doménu
    const translations = {}
    for (const lang of availableLanguages) {
      translations[lang] = await import(`./translations/${domain}/${lang}.json`)
    }
    
    return translations
  }
}
```

### 4.2 Kultúrna Adaptácia

**Krajinovo-špecifické adaptácie**:

```typescript
// packages/locales/src/cultural-adapter.ts
export const CulturalAdapter = {
  getInheritanceLawInfo: (country: string, language: string) => {
    return {
      'SK': {
        'sk': 'Na Slovensku platí zákon o dedičskom práve...',
        'en': 'In Slovakia, inheritance law specifies...'
      },
      'CZ': {
        'cs': 'V České republice upravuje dědické právo...',
        'en': 'In Czech Republic, inheritance law governs...'
      }
    }[country]?.[language]
  },

  getCurrencyFormat: (country: string) => {
    const formats = {
      'SK': { symbol: '€', position: 'after' },
      'CZ': { symbol: 'Kč', position: 'after' },
      'DE': { symbol: '€', position: 'after' },
      'UK': { symbol: '£', position: 'before' }
    }
    return formats[country] || formats['SK']
  }
}
```

---

## FÁZA 5: OPTIMALIZÁCIA A DEPLOYMENT

### 5.1 Výkonnostné Optimalizácie

**Lazy Loading komponentov**:

```typescript
// apps/mobile/src/components/LazyComponents.tsx
export const LazyScanner = lazy(() => import('@/components/Scanner'))
export const LazyTimeCapsule = lazy(() => import('@/components/TimeCapsule'))

// V navigácii
const ScannerScreen = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyScanner />
  </Suspense>
)
```

**Bundle optimalizácia**:

```typescript
// packages/ui/src/index.ts
// Exportuj len potrebné komponenty pre každú platformu
export { Button, Card, Input } from './components'
export type { ButtonProps, CardProps } from './types'
```

### 5.2 Deployment Stratégia

**Web aplikácia** (existujúca hollywood):
- Vercel/Netlify deployment
- Optimalizované pre všetky domény
- CDN pre statické súbory

**Mobilná aplikácia**:
- Expo Application Services (EAS) Build
- App Store a Google Play Store
- Over-the-Air (OTA) updates pre rýchle opravy

### 5.3 Monitoring a Analytics

**Implementácia sledovania**:

```typescript
// packages/shared/src/analytics/Analytics.ts
export class LegacyGuardAnalytics {
  trackDocumentScan(category: string, accuracy: number) {
    this.track('document_scanned', {
      category,
      accuracy,
      platform: 'mobile'
    })
  }

  trackUpgrade(from: 'mobile' | 'web', feature: string) {
    this.track('upgrade_initiated', {
      from,
      feature,
      timestamp: new Date().toISOString()
    })
  }
}
```

---

## ČASOVÝ PLÁN IMPLEMENTÁCIE

### Základy
- ✅ Monorepo setup
- ✅ Tamagui implementácia
- ✅ Základné zdieľané komponenty

### Mobilná Aplikácia
- ✅ Inteligentný skener s lokálnou AI
- ✅ Offline trezor
- ✅ Časová schránka

### Prepojenie
- ✅ Real-time synchronizácia
- ✅ Freemium logika
- ✅ Upgrade flow

### Internacionalizácia
- ✅ 33+ jazykov implementácia
- ✅ Kultúrna adaptácia
- ✅ Doménová lokalizácia

### Optimalizácia a Testovanie
- ✅ Výkonnostné optimalizácie
- ✅ E2E testovanie
- ✅ Security audit

### Launch
- ✅ App Store submission
- ✅ Marketing kampaň
- ✅ User onboarding

---

## TECHNICKÉ ŠPECIFIKÁCIE

### Súčasný Stav

**Webová aplikácia** (hollywood/):
- React 18 + TypeScript + Vite
- Clerk autentifikácia
- Supabase databáza s RLS
- TweetNaCl šifrovanie
- 33+ jazykov podpora
- Komplexné prémiové funkcie

**Mobilná aplikácia** (mobile/):
- React Native + Expo
- Clerk autentifikácia
- Základné komponenty a navigácia
- Realm database pre offline
- Vision Camera pre skenovanie

### Cieľový Stav

**Zdieľané komponenty** (packages/ui/):
- Tamagui framework
- 100% vizuálna zhoda
- Cross-platform komponenty
- Design system tokens

**Zdieľané služby** (packages/shared/):
- Supabase client
- Encryption utilities
- Analytics service
- i18n loader

---

## BEZPEČNOSŤ A SÚKROMIE

### Šifrovanie Dát

**Client-side encryption**:
- TweetNaCl pre symetrické šifrovanie
- Jedinečné kľúče pre každého používateľa
- End-to-end encryption pre zdieľané dokumenty

**Key Management**:
```typescript
// packages/shared/src/security/KeyManager.ts
export class KeyManager {
  async generateUserKeys(): Promise<KeyPair> {
    const keyPair = nacl.box.keyPair()
    
    // Uloženie privátneho kľúča s heslom
    const wrappedPrivateKey = await this.wrapKey(keyPair.secretKey, userPassword)
    
    return {
      publicKey: keyPair.publicKey,
      wrappedPrivateKey
    }
  }
}
```

### Supabase RLS (Row Level Security)

```sql
-- Politiky pre documents tabuľku
CREATE POLICY "Users can only access their own documents" 
ON documents FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can only upload to their own storage" 
ON storage.objects FOR INSERT 
WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);
```

---

## METRIKY ÚSPECHU

### Technické KPI

1. **Vizuálna Konzistentnosť**: 95%+ zhoda medzi web a mobile UI
2. **Výkon**: < 3s načítanie aplikácie na mobile
3. **Offline Funktionalita**: 100% dostupnosť základných funkcií bez internetu
4. **Real-time Sync**: < 1s latencia pri synchronizácii dát

### Business KPI

1. **Konverzia Free → Premium**: 15%+ mesačne
2. **User Retention**: 80%+ po 30 dňoch
3. **App Store Rating**: 4.5+ stars
4. **Multi-platform Usage**: 60%+ používateľov používa obe platformy

---

## ZÁVER

Tento implementačný plán predstavuje komplexnú víziu pre LegacyGuard ekosystém, ktorý kombinuje najlepšie z webových aj mobilných technológií. Kľúčom k úspechu je:

1. **Technologická Excelencia**: Využitie moderných frameworkov ako Tamagui pre dokonalú vizuálnu jednotu
2. **Funkčná Špecializácia**: Každá platforma robí to, v čom je najlepšia
3. **Bezpečnosť First**: End-to-end šifrovanie a lokálna AI pre maximálne súkromie
4. **Freemium Stratégia**: Inteligentné lákadlo pre konverziu na prémiové funkcie

Výsledkom bude prémiový, bezpečný a užívateľsky prívetivý ekosystém, ktorý redefinuje spôsob, akým ľudia chránia a zdieľajú svoj digitálny odkaz.
