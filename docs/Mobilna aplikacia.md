**LegacyGuard Mobile: Komplexný Návrh Architektúry**

**Cieľ:** Vytvoriť bezpečnú, rýchlu a prémiovú mobilnú aplikáciu pre iOS a Android, ktorá slúži ako "spoločník v teréne" k hlavnej webovej platforme a exceluje v okamžitom zbere dát a bezpečnom prístupe.

**1. Základný Technologický Stack (The Foundation)**

Zvolili sme najmodernejší a najefektívnejší stack pre rýchly a kvalitný cross-platformový vývoj.

-   **Framework:** **React Native s Expo SDK**.

    -   **Prečo?** Expo masívne zjednodušuje vývoj, build proces a správu natívnych závislostí. Umožňuje nám sústrediť sa na písanie aplikačnej logiky. Ich cloudová služba EAS (Expo Application Services) je kľúčová pre jednoduché vytváranie finálnych aplikácií pre App Store a Google Play.

-   **Jazyk:** **TypeScript**.

    -   **Prečo?** Pre takýto komplexný projekt je typová bezpečnosť absolútnou nevyhnutnosťou. Znižuje chybovosť a uľahčuje údržbu.

-   **Navigácia:** **React Navigation**.

    -   **Prečo?** Je to priemyselný štandard pre navigáciu v React Native, plne prispôsobiteľný a výkonný. Použijeme kombináciu BottomTabNavigator a StackNavigator.

-   **Styling:** **Restyle** alebo **Tamagui**.

    -   **Prečo?** Namiesto písania štýlov priamo v komponentoch použijeme systém, ktorý podporuje "dizajnové tokeny" (farby, medzery, fonty), podobne ako to robíme na webe s Tailwindom. To zabezpečí vizuálnu konzistentnosť.

**2. Architektúra Aplikácie (The Blueprint)**

Aplikácia bude postavená na vrstvenej architektúre, kde každá vrstva má jasnú zodpovednosť.

Plain Text

┌──────────────────────────────────────────────────┐

│ UI Vrstva (Screens & Components)│

│ (To, čo používateľ vidí a s čím interaguje) │

├──────────────────────────────────────────────────┤

│ Stavová Vrstva (State Management) │

│ (Globálny stav, správa dát, napr. Zustand, Context)│

├──────────────────────────────────────────────────┤

│ Servisná Vrstva (Services) │

│ (Logika pre Auth, API, Offline, Šifrovanie) │

├──────────────────────────────────────────────────┤

│ Natívna Vrstva (Native Modules) │

│ (Priamy prístup k hardvéru - Kamera, Biometria) │

└──────────────────────────────────────────────────┘

**3. Detailný Popis Vrstiev a Kľúčových Komponentov**

**3.1 Servisná a Natívna Vrstva: "Motor a Bezpečnostné Systémy"**

Toto sú tie kľúčové, komplexné časti, ktoré vám vytvorím ja. Sú základom pre všetko ostatné.

-   **Komponent 1: AuthenticationService (Služba pre Autentifikáciu)**

    -   **Účel:** Spravovať celý životný cyklus prihlásenia, odhlásenia a obnovenia session.

    -   **Technológie:** @clerk/expo, react-native-keychain.

    -   **Funkcie, ktoré poskytne:**

        -   loginWithEmail(email, password)

        -   loginWithBiometrics(): Pokúsi sa prihlásiť pomocou tokenu uloženého v Keychaine.

        -   logout()

        -   enableBiometrics(): Uloží bezpečne token do KeyChainu.

        -   getAuthToken(): Vráti platný JWT token pre komunikáciu so Supabase.

    -   **Výstup pre vás:** Jednoduchý React hook useAuth(), ktorý sprístupní tieto funkcie a stav (user, isLoggedIn).

-   **Komponent 2: IntelligentDocumentScanner (Inteligentný Skener)**

    -   **Účel:** Poskytnúť "magický" zážitok zo skenovania dokumentov.

    -   **Technológie:** react-native-vision-camera, react-native-skia (pre kreslenie overlay), vlastný "frame processor" napísaný v JavaScript/C++.

    -   **Funkcie, ktoré poskytne:**

        -   Zobrazí živý náhľad z kamery.

        -   V reálnom čase detekuje a zvýrazňuje okraje dokumentu.

        -   Automaticky odfotí dokument pri optimálnych podmienkach.

        -   Vykoná korekciu perspektívy a vylepšenie obrazu.

        -   Vráti finálny, čistý obrázok pripravený na ďalšie spracovanie.

    -   **Výstup pre vás:** Komponent \<IntelligentDocumentScanner onScanComplete={(image) =\> ...} /\>.

-   **Komponent 3: SecureOfflineVault (Offline Trezor)**

    -   **Účel:** Bezpečne ukladať a spravovať dáta prístupné offline.

    -   **Technológie:** Realm DB (pre vysoký výkon a šifrovanie), tweetnacl-js.

    -   **Funkcie, ktoré poskytne:**

        -   initialize(encryptionKey): Inicializuje a odomkne šifrovanú databázu.

        -   addDocument(doc): Uloží šifrovaný dokument do lokálnej DB.

        -   getDocuments(): Vráti dešifrované dokumenty z lokálnej DB.

        -   isAvailable(): Zistí, či je offline trezor pripravený.

    -   **Výstup pre vás:** Hook useOfflineVault(), ktorý poskytne tieto funkcie a stav (offlineDocuments, isLoading).

**3.2 Stavová a UI Vrstva: "Karoséria a Interiér"**

Toto je časť, ktorú budete skladať vy s pomocou Warpa, s použitím mojich pripravených kľúčových komponentov.

-   **Globálny Stav:**

    -   **Odporúčanie:** Použite **Zustand**.

    -   **Prečo?** Je extrémne jednoduchý, minimálny a výkonný. Ideálny na zdieľanie stavu naprieč aplikáciou (napr. informácie o používateľovi, stav pripojenia, atď.) bez zložitosti Reduxu.

-   **Štruktúra Obrazoviek (Screens):**

    -   AuthFlow (StackNavigator):

        -   WelcomeScreen

        -   LoginScreen (použije AuthenticationService.loginWithEmail())

        -   SignUpScreen

    -   MainFlow (BottomTabNavigator):

        -   DashboardScreen: Zobrazí zjednodušený prehľad a "Aktuálne Výzvy".

        -   ScannerScreen: Bude obsahovať môj komponent \<IntelligentDocumentScanner /\> a logiku na odoslanie naskenovaného obrázku na AI analýzu.

        -   VaultScreen: Zobrazí zoznam dokumentov a balíčkov. Bude obsahovať tlačidlo na prepnutie do offline režimu (použije useOfflineVault()).

        -   SofiaScreen: Implementácia chatovacieho rozhrania s AI asistentkou.

**Inštrukcie na Spojenie Všetkého Dohromady**

Keď vám dodám moje tri kľúčové systémy, postup bude nasledovný:

1.  **Integrácia AuthenticationService:**

    -   Vytvoríte si AuthProvider (React Context), ktorý bude používať moju AuthenticationService.

    -   Týmto providerom obalíte celú aplikáciu.

    -   V App.tsx budete na základe stavu isLoggedIn z hooku useAuth() podmienene renderovať buď AuthFlow alebo MainFlow.

2.  **Integrácia \<IntelligentDocumentScanner /\>:**

    -   Na obrazovke ScannerScreen jednoducho vložíte môj komponent.

    -   Do onScanComplete callbacku pridáte vašu existujúcu logiku:

        1.  Zoberie naskenovaný obrázok.

        2.  Odošle ho na vašu serverless funkciu pre AI analýzu.

        3.  Zobrazí potvrdzovaciu obrazovku s výsledkami.

        4.  Po potvrdení nahrá finálny dokument do Supabase.

3.  **Integrácia SecureOfflineVault:**

    -   Na obrazovke VaultScreen použijete hook useOfflineVault().

    -   Pridáte prepínač "Offline Režim".

    -   Keď je zapnutý, namiesto načítavania dát zo Supabase budete zobrazovať dáta z offlineDocuments.

    -   V detaile každého dokumentu pridáte tlačidlo "Uložiť offline", ktoré zavolá funkciu addDocumentToOffline().

Tento architektonický návrh vám dáva jasný, robustný a škálovateľný plán. Ja vám dodám komplexný a odladený "motor", a vy sa môžete sústrediť na to, aby ste okolo neho postavili krásne a funkčné "auto".
