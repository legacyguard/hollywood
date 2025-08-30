**LegacyGuard: Strategický Plán Implementácie Ekosystému "Dokonalá Symbióza"**

**Cieľ:** Vytvoriť jednotný, prémiový ekosystém pozostávajúci z komplexnej webovej platformy a špecializovanej mobilnej aplikácie "Strážca vo Vrecku". Obe platformy budú zdieľať identický dizajn, dáta a filozofiu, pričom každá bude excelovať v úlohách, na ktoré je určená.

**Fáza 1: Založenie Spoločných Základov (The Core Foundation)**

**Cieľ:** Vytvoriť technologický základ, ktorý umožní maximálne zdieľanie kódu, dizajnu a logiky medzi webovou a mobilnou aplikáciou. Týmto predídeme duplicite práce a zabezpečíme vizuálnu a funkčnú konzistentnosť.

-   **Krok 1.1: Prechod na Architektúru Monorepo**

    -   **Čo:** Zlúčime existujúce repozitáre (hollywood a mobile) do jedného monorepa pomocou nástroja **Turborepo**.

    -   **Prečo:** Umožní nám to centrálne spravovať závislosti a jednoducho zdieľať kód medzi projektmi.

    -   **Výsledná štruktúra:**

Plain Text

/legacyguard-platform

/apps

/web // Pôvodná webová aplikácia

/mobile // Pôvodná mobilná aplikácia

/packages

/ui // Prázdny balíček pre zdieľané komponenty

/config // Prázdny balíček pre zdieľanú konfiguráciu (ESLint, TSConfig)

-   **Krok 1.2: Implementácia Zdieľaného Dizajnového Systému**

    -   **Čo:** Vytvoríme a nakonfigurujeme zdieľanú knižnicu UI komponentov pomocou frameworku **Tamagui**.

    -   **Prečo:** Tamagui nám umožní napísať komponent (napr. \<Button /\>, \<Card /\>) **raz** a on ho automaticky vykreslí ako natívny prvok pre web (div) aj pre mobil (View). Tým dosiahneme takmer 100% vizuálnu zhodu.

    -   **Implementácia:**

        1.  Nakonfigurujeme Tamagui v balíčku /packages/ui.

        2.  Zadefinujeme v ňom všetky naše dizajnové "tokeny" (farby, fonty, medzery).

        3.  Postupne doň prenesieme základné, znovupoužiteľné komponenty z webovej aplikácie.

-   **Krok 1.3: Centralizácia Internacionalizácie (i18n)**

    -   **Čo:** Vytvoríme centrálny balíček pre správu prekladov.

    -   **Prečo:** Zabezpečí, že obe aplikácie budú používať rovnaké prekladové súbory, čo zjednoduší pridávanie nových jazykov.

    -   **Implementácia:**

        1.  Vytvoríme balíček /packages/locales.

        2.  Uložíme doň naše translation.json súbory pre všetky jazyky.

        3.  Nakonfigurujeme webovú aj mobilnú aplikáciu tak, aby načítavali preklady z tohto centrálneho miesta.

**Fáza 2: Vývoj Mobilnej Aplikácie "Strážca vo Vrecku"**

**Cieľ:** Vytvoriť plnohodnotnú mobilnú aplikáciu, ktorá je nielen vizuálne zjednotená s webom, ale ponúka aj rovnakú úroveň "mágie" pri spracovaní dokumentov, a to všetko bez nákladov na externé AI API..

-   **Krok 2.1: Implementácia Kľúčových Obrazoviek s Použitím Zdieľaného UI**

    -   **Čo:** Vytvoríme mobilné verzie obrazoviek Dashboard, Vault a ďalších s použitím komponentov z nášho nového /packages/ui balíčka.

    -   **Prečo:** Zabezpečíme tým vizuálnu konzistentnosť s webovou aplikáciou.

-   **Krok 2.2: Implementácia "Inteligentného Skenera Dokumentov"**

    -   **Čo:** Prémiová funkcia na skenovanie dokumentov, ktorá teraz zahŕňa aj lokálnu, on-device AI analýzu na automatickú kategorizáciu a extrakciu metadát.

    -   **Prečo:** Prináša "wow" efekt z webovej aplikácie priamo do mobilu bez nákladov na OpenAI a bez posielania citlivých dát na externé servery, čo zvyšuje bezpečnosť a dôveru.

    -   **Technológia:** 
    
        1. Využitie Natívnych Knižníc: Namiesto volania OpenAI použijeme knižnice, ktoré bežia priamo na telefóne.
        2. Extrakcia Textu (OCR): react-native-vision-camera s frame processormi dokáže extrahovať text priamo z obrazu kamery.
        3. Klasifikácia a Extrakcia Metadát (Lokálna AI):
           3.1 Vytvoríme si vlastný, jednoduchý klasifikačný model: Vytvoríme sadu pravidiel a kľúčových slov. Napríklad, ak OCR text obsahuje slová "poistná zmluva", "Allianz", "poistné obdobie", systém automaticky navrhne kategóriu "Poistenie". Ak obsahuje "rodný list", "matrika", navrhne "Osobné".
           3.2 Extrakcia Dát pomocou Regulárnych Výrazov: Pre extrakciu dátumov, čísel zmlúv alebo súm použijeme sadu preddefinovaných regulárnych výrazov pre každý typ dokumentu.
           3.3 Výsledok: Tento systém bude pre 80% bežných dokumentov (faktúry, zmluvy, doklady) dostatočne presný a jeho prevádzka je úplne zadarmo.

-   **Krok 2.3: Implementácia "Časovej Schránky" (Nahrávanie)**

    -   **Čo:** Vytvoríme rozhranie na jednoduché a spontánne nahrávanie video a audio odkazov priamo z mobilu.

    -   **Prečo:** Mobil je ideálny na zachytenie autentických, osobných momentov.

    -   **Technológia:** MediaRecorder API.

-   **Krok 2.4: Implementácia "Offline Trezoru"**

    -   **Čo:** Umožníme používateľom uložiť si najdôležitejšie dokumenty do bezpečného, šifrovaného úložiska priamo v telefóne.

    -   **Prečo:** Zabezpečí prístup ku kritickým informáciám aj bez internetového pripojenia (napr. v zahraničí, v nemocnici).

    -   **Technológia:** Šifrovaná Realm DB.

**Fáza 3: Prepojenie Ekosystému a Monetizačná Stratégia**

**Cieľ:** Zabezpečiť, aby obe aplikácie spolu dokonale komunikovali a aby ich prepojenie vytváralo obchodnú hodnotu.

-   **Krok 3.1: Implementácia Real-time Synchronizácie**

    -   **Čo:** Využijeme **Supabase Realtime Subscriptions** na okamžitú synchronizáciu dát medzi webom a mobilom.

    -   **Prečo:** Zabezpečí to plynulý zážitok. Akcia vykonaná na jednom zariadení sa okamžite prejaví na druhom.

    -   **Príklad:** Používateľ na mobile naskenuje dokument a na webovom dashboarde v reálnom čase vyrastie nový lístok na "Záhrade Odkazu".

-   **Krok 3.2: Nastavenie Freemium Modelu s Jasnými Limitmi**

    -   **Čo:** Nakonfigurujeme mobilnú aplikáciu ako "freemium" produkt s presne definovanými limitmi, aby sme predišli zneužívaniu bezplatného úložiska a motivovali k prechodu na platený plán.

    -   **Prečo:** Využijeme skvelé bezplatné funkcie mobilnej aplikácie (najmä skener) na prilákanie širokej používateľskej základne, ktorú následne budeme konvertovať na platiacich zákazníkov na webe. Chráni prevádzkové náklady a vytvára jasnú hodnotovú ponuku pre prémiový produkt.

    -   **Implementácia:**

        1.  V mobilnej aplikácii budú prémiové funkcie (Tvorca Závetu, detailné nastavenie Štítu) vizuálne prítomné, ale "uzamknuté".

        2.  Po kliknutí na uzamknutú funkciu sa zobrazí obrazovka, ktorá vysvetlí benefity plnej verzie a nasmeruje používateľa na webovú platformu pre upgrade.

    -   **Implementácia Limitov:**

        1.  Backendová Kontrola: Vytvoríme novú tabuľku v Supabase, napr. user_usage, kde budeme sledovať využitie pre každého používateľa (document_count, storage_used_mb).
        
        2.  Úprava API: Pred každým nahratím dokumentu (či už z webu alebo mobilu) sa serverless funkcia najprv pozrie do tejto tabuľky.
        
        3.  Logika Limitov:
            1.  IF user.plan === 'free' AND user_usage.document_count >= 10 THEN
            2.  RETURN error "Dosiahli ste limit 10 dokumentov pre bezplatný účet."
            3.  ELSE
            4.  PROCEED with upload

        4.  Komunikácia v Aplikácii:
    
            1. V mobilnej aj webovej aplikácii bude jasne viditeľný ukazovateľ, ktorý informuje používateľa o jeho aktuálnom využití.
            
            2.  Príklad: "Využívate 7/10 dokumentov vo vašom bezplatnom pláne."
            
            3. Keď sa používateľ priblíži k limitu (napr. 9/10), zobrazí sa mu elegantná, nenásilná notifikácia: "Skvelá práca! Váš trezor sa pekne plní. Ak chcete získať neobmedzené úložisko a odomknúť prémiové funkcie ako Tvorca Závetu, prejdite na platený plán na našej webovej stránke."
