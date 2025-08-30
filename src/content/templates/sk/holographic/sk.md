# ZÁVET
## (Holografická závet podľa slovenského práva)

---

**Ja, {{testatorName}}**, narodený dňa {{birthDate}} v {{birthPlace}}, s rodným číslom {{personalId}}, bytom {{address}}, občan {{citizenship}}, som pri plnom vedomí a z vlastnej slobodnej vôle, bez akéhokoľvek nátlaku či nepatrične ovplyvnenia tretej osoby, urobil tento závet, ktorým odvolávam všetky moje skôr urobené závety a kodiciily.

---

### ČLÁNOK I - VYHLÁSENIE A ODVOLANIE

Vyhlasujem, že mám {{age}} rokov a som duševne spôsobilý. Robím tento závet dobrovoľne a nekonám pod nátlakom, podvodom alebo nepatrične vplyvom akejkoľvek osoby.

Týmto odvolávam všetky skôr urobené závety a kodiciily.

**Táto holografická závet** je napísaná celá mojou rukou a podpísaná mnou, ako povoľuje § 476 občianskeho zákonníka.

---

### ČLÁNOK II - RODINNÝ STAV

{{#if spouse}}
Som {{maritalStatus}} s {{spouseName}}.
{{/if}}

{{#if children}}
Mám tieto deti:
{{#each children}}
- {{name}}, narodené {{birthDate}}{{#if isMinor}} (neplnoleté){{/if}}
{{/each}}
{{else}}
Nemám žiadne deti.
{{/if}}

---

### ČLÁNOK III - MAJETOK A VLASTNÍCTVO

Vlastním nasledovný majetok:

{{#if realEstate}}
**Nehnuteľný majetok:**
{{#each realEstate}}
- {{type}} nachádzajúci sa na adrese {{address}}, číslo LV {{cadastralNumber}}, môj podiel vlastníctva: {{ownership}}, odhadovaná hodnota: {{estimatedValue}} €
{{/each}}
{{/if}}

{{#if bankAccounts}}
**Bankové účty:**
{{#each bankAccounts}}
- {{accountType}} účet u {{bank}}, číslo účtu končiace {{accountNumber}}, približný zostatok: {{approximateBalance}} €
{{/each}}
{{/if}}

{{#if vehicles}}
**Vozidlá:**
{{#each vehicles}}
- {{year}} {{make}} {{model}}, ŠPZ {{licensePlate}}, odhadovaná hodnota: {{estimatedValue}} €
{{/each}}
{{/if}}

{{#if personalProperty}}
**Hnuteľný majetok:**
{{#each personalProperty}}
- {{description}}, v súčasnosti umiestnené na {{location}}, odhadovaná hodnota: {{estimatedValue}} €
{{/each}}
{{/if}}

---

### ČLÁNOK IV - ODKAZY A ROZDELENIE

{{#if forcedHeirsNotice}}
**UPOZORNENIE TÝKAJÚCE SA NEVYHNUTNÝCH DEDIČOV:**
Podľa slovenského práva majú následovné osoby nárok na dedičský podiel:
{{#if spouse}}
- Môj manžel/manželka {{spouseName}} má nárok na najmenej 1/4 môjho pozostalého majetku
{{/if}}
{{#if minorChildren}}
- Moje neplnoleté deti majú nárok na najmenej 1/2 ich zákonného dedičského podielu
{{/if}}
{{#if adultChildren}}
- Moje dospelé deti majú nárok na najmenej 1/2 ich zákonného dedičského podielu
{{/if}}

Nižšie uvedené rozdelenie rešpektuje tieto povinné ustanovenia.
{{/if}}

Odkazujem môj majetok takto:

{{#each beneficiaries}}
**{{name}}** ({{relationship}}), bytom {{address}}, RČ/dátum narodenia: {{personalId}}:
{{#if percentage}}
- {{percentage}}% celého môjho majetku
{{/if}}
{{#if specificAssets}}
- Následovný konkrétny majetok: {{specificAssets}}
{{/if}}
{{#if amount}}
- Peňažnú čiastku {{amount}} €
{{/if}}
{{#if conditions}}
- Za podmienok: {{conditions}}
{{/if}}

{{/each}}

{{#if charitableBequests}}
**CHARITATÍVNE ODKAZY:**
{{#each charitableBequests}}
- Organizácii {{organization}}: {{amount}} € na účel {{purpose}}
{{/each}}
{{/if}}

**UNIVERZÁLNA SUKCESIA:**
Všetok zvyšok môjho majetku, hnuteľného i nehnuteľného, akéhokoľvek druhu a kdekolia sa nachádzajúceho, odkazujem {{residuaryBeneficiary}} v rovnakých podieloch, alebo ich potomkom podľa práva zastúpenia.

---

### ČLÁNOK V - VYKONÁVATEĽ ZÁVETU

{{#if hasExecutor}}
Menuje a ustanovujem **{{executorName}}**, bytom {{executorAddress}}, vykonávateľom tohto závetu.

{{#if backupExecutor}}
Ak {{executorName}} nemôže alebo nechce funkciu vykonávať, menuje **{{backupExecutor}}** ako náhradného vykonávateľa.
{{/if}}

Môj vykonávateľ nebude povinný zložiť kauciu za riadne vykonávanie svojich povinností.

Môj vykonávateľ bude mať všetky právomoci udelené slovenským právom, vrátane ale neobmedzene na:
- Predaj, prevod a nakladanie s akýmkoľvek majetkom
- Platenie všetkých dlhov, daní a nákladov správy
- Rozdeľovanie majetku dedičom
- Zastupovanie pozostalosti v právnych konaniach

{{else}}
Nemenuje žiadneho vykonávateľa závetu. Správa pozostalosti bude prebiehať podľa slovenského práva.
{{/if}}

---

{{#if hasMinorChildren}}
### ČLÁNOK VI - OPATROVNÍCTVO

{{#if primaryGuardian}}
Menuje **{{primaryGuardian.name}}**, bytom {{primaryGuardian.address}}, opatrovníkom osoby i majetku mojich neplnoletých detí.

{{#if backupGuardian}}
Ak {{primaryGuardian.name}} nemôže alebo nechce funkciu vykonávať, menujem **{{backupGuardian.name}}**, bytom {{backupGuardian.address}}, ako náhradného opatrovníka.
{{/if}}

{{#if guardianshipInstructions}}
**Pokyny pre opatrovníkov:**
{{guardianshipInstructions}}
{{/if}}
{{/if}}

---
{{/if}}

### ČLÁNOK VII - OSOBITNÉ PRIANIA A POKYNY

{{#if funeralWishes}}
**Pohrebné pokyny:**
{{funeralWishes}}
{{/if}}

{{#if organDonation}}
**Darovanie orgánov:**
{{#if organDonation.yes}}
Prajem si darovať svoje orgány na transplantáciu a lekársky výskum.
{{/if}}
{{#if organDonation.no}}
Neprajem si darovať svoje orgány.
{{/if}}
{{#if organDonation.family_decides}}
Rozhodnutie o darovaní orgánov prenechávam svojej rodine.
{{/if}}
{{/if}}

{{#if digitalAssets}}
**Digitálny majetok a účty:**
{{digitalAssets}}
{{/if}}

{{#if personalMessages}}
**Osobné odkazy:**
{{#each personalMessages}}
Pre {{recipient}}: {{message}}

{{/each}}
{{/if}}

---

### ČLÁNOK VIII - ZÁVEREČNÉ USTANOVENIA

Tento závet sa riadi zákonmi Slovenskej republiky.

Ak by akékoľvek ustanovenie tohto závetu bolo považované za neplatné alebo nevymáhateľné, ostatné ustanovenia zostávajú v plnej platnosti.

Starostlivo som si tento závet prečítal a správne odráža moje priania a zámery.

---

### PODPIS

**PODPIS HOLOGRAFICKEJ ZÁVETI:**
Celý tento závet je napísaný mojou rukou a podpísaný mnou dňa {{currentDate}}.

**DÔLEŽITÉ POKYNY PRE VÁS:**
Aby bol tento závet právne platný podľa slovenského práva, musíte:
1. Celý tento text prepísať vlastnou rukou na papier
2. Podpísať svojim plným podpisom
3. Datovať v deň podpisu
4. Uložiť na bezpečnom mieste a informovať vykonávateľa alebo dôveryhodného člena rodiny o jeho umiestnení

Podpis: ________________________
{{testatorName}}

Dátum: ____________________________

---

*Tento závet bol vygenerovaný pomocou inteligentného systému tvorby závetov LegacyGuard. Hoci táto šablóna je v súlade so slovenskými právnymi požiadavkami, odporúčame nechať ju skontrolovať kvalifikovaným slovenským právnikom, aby zabezpečil, že vyhovuje vašim špecifickým potrebám a okolnostiam.*

**Právne upozornenie:** Tento dokument je generovaný na základe súčasného slovenského práva. Zákony sa môžu zmeniť a individuálne okolnosti môžu vyžadovať špecifické právne poradenstvo. Pre personalizované právne poradenstvo sa obráťte na kvalifikovaného slovenského právnika.