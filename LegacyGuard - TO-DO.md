# LegacyGuard - TO-DO List

## 📋 Kľúčové funkcie — aktuálny stav

### Prehľad implementácie

- [X] Sofia AI Assistant — implementované (chat, riadené akcie, server-side funkcie)
- [X] OCR & analýza dokumentov — implementované (Google Vision + pipeline)
- [X] Guardian system — implementované (správa opatrovníkov); emergency protokoly čakajú
- [ ] Emergency activation — nie je implementované
- [ ] Will generator — nie je implementované
- [ ] Video messages / Time capsules — nie je implementované
- [X] Notification system — implementované (základ: email + cron)
- [ ] Multi-language support — nie je implementované
- [ ] Pokročilé animácie — len základy (pokročilé UX čaká)
- [X] Kategorizácia dokumentov — implementované
- [X] Sledovanie progresu — implementované (Path of Serenity)
- [ ] Právne konzultácie — nie je implementované

## 🚀 FÁZA 1: Core Infrastructure [X]

### Priority: Kritické základy

- [X] Sofia AI Assistant (OpenAI/Claude integration)
- [X] OCR integration (Google Cloud Vision API)
- [X] Enhanced document categorization
- [X] Notification system foundation
- [X] Progress tracking system

## 📄 FÁZA 2: Document Intelligence

### Priority: Inteligentná správa dokumentov

- [X] Automatic document analysis
- [X] Expiry monitoring
- [X] Smart suggestions system
- [X] Document search and filtering
- [X] Backup/restore functionality

## 🛡️ FÁZA 3: Guardian Network

### Priority: Ochrana rodiny

- [X] Guardian management system
- [ ] Emergency detection logic
- [ ] Access control and permissions
- [ ] Survivor's manual generator
- [ ] Emergency contact system

## ⚖️ FÁZA 4: Will Generator & Legal

### Priority: Právne dokumenty

- [ ] 7-step will creation process
- [ ] Legal templates integration
- [ ] Video message recording
- [ ] Document validation
- [ ] Legal consultation booking

## 🎬 FÁZA 5: Advanced UX & Animations

### Priority: Hollywood experience

- [ ] Advanced Framer Motion animations
- [ ] 3D components (React Three Fiber)
- [ ] Firefly animations
- [ ] Progress celebrations
- [ ] Smooth transitions everywhere

## 🚀 FÁZA 6: Production Ready

### Priority: Nasadenie

- [ ] Multi-language support
- [ ] Performance optimization
- [ ] Security audit
- [ ] Testing & QA
- [ ] Deployment automation

---

## 💡 Immediate Next Steps (What to start with)

### 1. Sofia AI Assistant Setup

```bash
npm install openai @anthropic-ai/sdk
# Create src/lib/sofia-ai.ts
# Implement basic chat interface
```

### 2. OCR Integration

```bash
npm install @google-cloud/vision
# Setup Google Cloud credentials
# Create document analysis pipeline
```

### 3. Enhanced Animations

```bash
# Already have framer-motion installed
# Need to add react-three-fiber for 3D
npm install @react-three/fiber @react-three/drei three
```

### 4. State Management

```bash
npm install zustand
# Create global state stores
# Implement progress tracking
```

---

## 🔧 Technical Implementation Priorities

1. Start with Sofia AI - toto je srdce aplikácie
2. OCR pre document analysis - Google Cloud Vision API
3. Zustand pre state management - progress tracking
4. Enhanced animations - firefly effects, celebrations
5. Guardian system - emergency protocols
