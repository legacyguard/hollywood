# Príprava LegacyGuard na produkciu

## 1. Analýza a plánovanie

1.  **Preštudovať existujúce dokumenty a plány** – repozitár už obsahuje dôkladnú dokumentáciu vrátane bezpečnostných pokynov SECURITY.md, bezpečnostného checklistu SECURITY_CHECKLIST.md, kontrolného zoznamu kvality QUALITY_CHECKLIST.md a plánu na vyčistenie kódu LEGACYGUARD_CLEANUP_PLAN.md. Prejdite si tieto súbory a upravte vlastný plán podľa nich.

2.  **Zmapovať projekt** – preskúmať adresáre (api, components, hooks, lib, supabase, tests atď.) a identifikovať hlavné domény (práca s dokumentmi, prihlasovanie, úložisko, AI integrácie). Vypracujte si prehľad navzájom závisiacich častí.

3.  **Stanoviť priority** – podľa súboru *LEGACYGUARD_CLEANUP_PLAN* sú najkritickejšie úlohy: zjednotenie typov v TypeScripte, jednotné ošetrenie chýb, bezpečnostné validácie a refaktoring komponentov LEGACYGUARD_CLEANUP_PLAN.md. V prvej fáze sa venujte týmto bodom.

## 2. Stabilizácia základu

### 2.1 Štandardizácia kódu

-   **Zaviesť prísne typovanie** – auditujte všetky existujúce typy, vytvorte spoločné definície v /src/types a povolte prísny režim TypeScriptu. Plán vyčistenia vyžaduje „strict mode“ a minimálne 90 % pokrytie typov LEGACYGUARD_CLEANUP_PLAN.md.

-   **Čistá štruktúra** – usporiadajte src podľa navrhovaného modelu (atoms → molecules → organisms → templates → pages)LEGACYGUARD_CLEANUP_PLAN.md. Pre služby vytvorte základnú triedu a používať vzor „service/repository“ LEGACYGUARD_CLEANUP_PLAN.md.

-   **Konzistentné formátovanie a linting** – zapnite ESLint a Prettier v CI, aby kód pred commitom prešiel linterom a formátovaním QUALITY_CHECKLIST.md.

-   **Vyčistenie nepotrebného kódu** – odstrániť nevyužité komponenty, komentáre a dočasné skripty. Dodržujte env.template – všetky tajné kľúče musia byť len v .env.local SECURITY.md.

### 2.2 Chybové a logické mechanizmy

-   **Vytvoriť zjednotený systém spracovania chýb** – implementujte vlastné triedy chýb a globálny „error boundary“ v Reacte LEGACYGUARD_CLEANUP_PLAN.md. Zachytávať a logovať chyby s dostatočnými informáciami (ID používateľa, čas, popis).

-   **Zaviesť auditný log** – v Supabase pripravte tabuľku audit_logs so stĺpcami podľa bezpečnostného checklistu SECURITY_CHECKLIST.md. Logy musia evidovať prístup k citlivým dokumentom, neúspešné prihlásenia a iné incidenty.

-   **Implementovať rate limiting** – využite pripravený modul /lib/rate-limiter.ts a nastavte limity pre API, uploady a AI operácie SECURITY_CHECKLIST.md. Všetky serverové funkcie zabaľte funkciou withRateLimit() SECURITY_CHECKLIST.md.

### 2.3 Bezpečnostné kroky

-   **Vstupná sanitizácia** – využite modul sanitizácie z /lib/security/sanitization.ts a čistite emaily, texty, URL adresy či uploadované súbory SECURITY_CHECKLIST.md. Základná ochrana proti XSS a SQL injection je nevyhnutná SECURITY_CHECKLIST.md.

-   **Bezpečné úložisko** – nahradenie localStorage za šifrovaný úložiskový modul (secureStorage) SECURITY_CHECKLIST.md. Dôležité kľúče a tokeny musí uchovávať serverová služba (ideálne na serverovej strane s rotáciou kľúčov).

-   **HTTPS, CORS a bezpečnostné hlavičky** – uistite sa, že produkčná doména používa HTTPS, CSP, HSTS, XFrameOptions a že CORS je obmedzený len na povolené domény SECURITY_CHECKLIST.md.

-   **Autentifikácia a autorizácia** – projekt používa službu Clerk, Supabase RLS politiky a služobné kľúče iba na serveri SECURITY_CHECKLIST.md. Overte, že každá funkcia volaná z klienta kontroluje JWT a že RLS politiky sú prísne nastavené.

## 3. Refaktorovanie komponentov a služieb

1.  **Refaktorovanie React komponentov** – podľa návrhu [atomic designu] rozdeľte komponenty do úrovní atóm/molecule/organism a minimalizujte preliatie stavov (prop drilling). Využívajte hooks a zamedzte duplikovanému kódu LEGACYGUARD_CLEANUP_PLAN.md.

2.  **Zaviesť servisný vrstvu** – centralizujte volanie API a prístup k Supabase v adresári services. Implementujte základnú triedu pre HTTP volania, tzv. repository pattern a dependency injection pre jednotkové testovanie LEGACYGUARD_CLEANUP_PLAN.md#.

3.  **Optimalizovať stav** – zrefaktorujte Zustand obchody, implementujte selektory pre efektívny prístup do stavu a uložte obchody do šifrovaného úložiska, ak obsahujú citlivé informácie LEGACYGUARD_CLEANUP_PLAN.md.

4.  **Implementovať uložené procedúry a migrácie** – zaviesť systém migrácií pre Supabase (napr. Supabase CLI a SQL migračné skripty) a pridávať indexy pre časté dotazy LEGACYGUARD_CLEANUP_PLAN.md.

## 4. Výkon, caching a škálovanie

1.  **Optimalizovať databázové operácie** – pridajte indexy pre vyhľadávané stĺpce, použite analýzu EXPLAIN a spojenie dotazov, aby odpovede boli pod 100 ms LEGACYGUARD_CLEANUP_PLAN.md.

2.  **Cache a offline režim** – nastavte Redis (alebo Supabase Edge caching) na opakované dotazy a prehliadačové cache pre statické súbory. Implementujte servisného pracovníka (Service Worker) pre offline použitie LEGACYGUARD_CLEANUP_PLAN.md.

3.  **Monitoring výkonu** – integrujte bundlový analyzátor a nastavte limity pre veľkosť balíka. Využite Lighthouse audit pre kontrolu Core Web Vitals a sledujte metriky ako **Time To Interactive** a **Largest Contentful Paint** LEGACYGUARD_CLEANUP_PLAN.md.

4.  **Škálovanie** – pri backend funkciách (Supabase Edge Functions, serverless API) nastavte concurrency limit a horizontal scaling. Uistite sa, že API endpointy sú idempotentné a že obsluha preťaženia je riešená (napr. fronty, exponential backoff).

## 5. Bezpečnostné spevnenie a compliance

1.  **Rozšírená vstupná validácia** – použite schémy Zod na validáciu všetkých vstupov, a to nielen na fronte, ale aj na serveri LEGACYGUARD_CLEANUP_PLAN.md.

2.  **CSRF a XSS ochrana** – v prípade serverových endpointov (napr. Edge Functions) zaviesť CSRF tokeny a overovať pôvod požiadaviek. Znovu skontrolovať sanitizáciu HTML a Markdown vstupov.

3.  **Šifrovanie a tokeny** – implementovať šifrovanie citlivých údajov v databáze (napr. pomocou libsodium) a rotáciu kľúčov. Kľúče nesmú byť v localStorage SECURITY_CHECKLIST.md.

4.  **Dvojfaktorová autentifikácia (2FA)** – povoliť v Clerk 2FA a pridať UI pre jeho nastavenie SECURITY_CHECKLIST.md.

5.  **Bezpečnostný audit** – vykonať penetračné testovanie, spustiť nástroje na detekciu zraniteľností (npm audit, GitHub Advanced Security, OWASP ZAP) a pripraviť plán na obnovu v prípade incidentu SECURITY_CHECKLIST.md.

6.  **Compliance a GDPR** – vypracovať a dokumentovať postupy pre právo na výmaz, spracúvanie osobných údajov, cookie banner, politiku súborov a dohody o spracovaní údajov SECURITY_CHECKLIST.md.

## 6. Testovanie a kontrola kvality

1.  **Vytvoriť stratégiu testovania** – plán cleanupu vyžaduje jednotkové testy (\>90 % coverage), integračné testy pre API a e2e testy pre hlavné používateľské toky LEGACYGUARD_CLEANUP_PLAN.md. Použite Jest/Testing Library pre jednotkové testy a Playwright pre e2e.

2.  **Automatizovaná pipeline** – v CI (GitHub Actions) nastavte kroky: inštalácia balíkov, spustenie npm run lint, npm test, npm run build, spustenie Playwright testov a generovanie reportov. Všetky commit/pull requesty musia prejsť kontrolným zoznamom kvality QUALITY_CHECKLIST.md.

3.  **Performance a accessibility testy** – spustiť npm run test:performance a npm run test:a11y QUALITY_CHECKLIST.md. Exportovať výsledky (Lighthouse, axe) a opravovať regresie.

4.  **Manuálny test a UX** – zorganizovať testovanie reálnych používateľských scenárov (napr. vytvorenie poslednej vôle, zdieľanie dokumentu). Zvážiť testovanie s rozhraním osobnosti „Sofia“, aby odpovede neboli neprirodzené QUALITY_CHECKLIST.md.

5.  **Kontrola bezpečnostných red flags** – zabezpečiť, že neexistujú expozície API kľúčov v klientskom kóde, logovanie osobných údajov, chýbajúca sanitizácia vstupov alebo XSS zraniteľnosti QUALITY_CHECKLIST.md.

## 7. Modularita a rozšíriteľnosť

1.  **Navrhnúť doménový modulárny systém** – každá doména (napr. "posledná vôľa", "digitálny trezor", "rodinný plán" atď.) by mala byť samostatný modul s vlastným API, UI komponentmi a prekladmi.

2.  **Abstraktné rozhrania pre konektory** – definujte interface pre konektory (napr. Supabase, Clerk, AI/LLM, platobné brány). Moduly budú implementovať tieto rozhrania, takže výmena alebo pridanie ďalšej služby nebude vyžadovať zmeny v celom kóde.

3.  **Zaviesť dynamické načítavanie modulov** – pre budúce domény a jazyky používajte lazy loading a code splitting (Vite podporuje import()), aby sa znížila veľkosť balíka a zlepšila rýchlosť načítania.

4.  **Konfigurácia podľa krajiny/jurisdikcie** – vytvorte YAML/JSON súbory so štruktúrou pre každú krajinu (napr. názov, požadované polia poslednej vôle, zoznam podporovaných jazykov). Frontend bude dynamicky generovať formuláre podľa vybraného štátu.

## 8. Internationalizácia a preklady

1.  **Zaviesť knihovňu i18n** – vyberte overenú knižnicu (napr. react-i18next). Všetky texty presuňte do lokalizačných súborov a nechajte kód len s kľúčmi.

2.  **Spravovať preklady pre každú krajinu** – pre každú európsku krajinu a jazyk pripravte JSON/yaml súbor (napr. locales/sk/lastWill.json, locales/de/lastWill.json). Použite parametre pre dynamické vstupy (meno, dátum, dedičia).

3.  **Proces prekladu** – využite externé prekladateľské služby alebo automatizované integrácie (napr. Google Cloud Translation, pre ktoré existujú API). Pred nasadením musí preklad skontrolovať človek.

4.  **Formálne náležitosti** – pre každú jurisdikciu konzultujte s právnikom štruktúru dokumentu (požadované klauzuly, podpisy, dátum), aby generované dokumenty spĺňali legislatívu.

5.  **Testovanie jazykov** – zorganizovať testy pre každú kombináciu krajina/jazyk: kontrolovať, že UI sa správne prepína, dátumy a mena sú vo vhodnom formáte a že texty sú správne preložené.

## 9. Integrácia s konektormi a službami

1.  **Konektory** – udržiavajte modul pre Supabase (databáza a storage), modul pre Clerk (autentifikácia), modul pre AI/LLM (napr. openAI) a modul pre platobné brány (ak potrebujete). Každý modul definujte ako balík so zodpovednosťou za konkrétnu službu. Prístupové tokeny načítavajte z import.meta.env a nikdy ich neukladajte do git-u SECURITY.md.

2.  **Webhooks a notifikácie** – definujte jednotný systém pre prichádzajúce webhooks (napr. od platobných brán) a notifikácie (email, SMS). V repozitári existujú návody pre notifikačný systém (súbor NOTIFICATION_SYSTEM.md), ktoré je potrebné implementovať.

3.  **AI integrácia** – ak používate AI na generovanie obsahu, izolujte AI logiku do samostatnej služby s jasne definovanými vstupmi a výstupmi. Pridajte rate limiting a kontrolu výstupov, aby sa zabránilo úniku citlivých informácií alebo generovaniu nevhodného obsahu.

## 10. CI/CD, deployment a monitoring

1.  **Nastaviť CI/CD pipeline** – použite GitHub Actions: build, lint, test, release. Pre deployment využite staging a produkčný environment (napr. Vercel, Netlify alebo AWS), nastavte blue-green deployment a možnosť rollbacku LEGACYGUARD_CLEANUP_PLAN.md.

2.  **Automatické kontroly na pull requestoch** – po každom PR spúšťajte testy, statickú analýzu a bezpečnostný sken (napr. npm audit alebo snyk). Ak testy zlyhajú, PR nesmie byť zlúčený.

3.  **Monitoring a alerty** – integrujte Sentry, LogRocket, DataDog alebo iné nástroje na monitoring chýb, bezpečnostných incidentov a výkonu SECURITY_CHECKLIST.md, LEGACYGUARD_CLEANUP_PLAN.md. Nastavte alerty na neobvyklé správanie: veľa neúspešných prihlásení, prekročenie rate limitov, zvýšené chybovosti API SECURITY_CHECKLIST.md.

4.  **Zálohovanie a obnova** – pravidelne zálohovať databázu (dokumenty a metadata) a testovať obnovu. Definovať retenčné pravidlá a postup obnovy v prípade výpadku SECURITY_CHECKLIST.md.

## 11. Dokumentácia a tímová spolupráca

1.  **Aktualizovať a udržiavať dokumentáciu** – každá služba, API endpoint a komponent musí mať dokumentáciu. Použite OpenAPI/Swagger na generovanie API dokumentov LEGACYGUARD_CLEANUP_PLAN.md a Storybook pre UI komponenty.

2.  **Pravidelný update TRANSFORMATION_PROGRESS.md** – po každej session zapíšte, čo bolo dokončené, problémy a plán na ďalšiu fázu QUALITY_CHECKLIST.md.

3.  **Review proces** – nastavte code review pravidlá: minimálne dvaja recenzenti pre kľúčové časti, checklist z QUALITY_CHECKLIST.md a Security Checklist.

4.  **Mentoring a znalostný transfer** – dokumentujte architektonické rozhodnutia a pravidelne zdieľajte knowhow s tímom, aby sa znížila závislosť na jednej osobe.
