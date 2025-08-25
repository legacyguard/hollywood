// Path of Serenity - Milestone System
// Tracks user's journey toward family security and peace of mind

export interface SerenityMilestone {
  id: string;
  name: string;
  description: string;
  completedDescription: string;
  category: 'foundation' | 'protection' | 'growth' | 'legacy' | 'mastery';
  unlockCondition: {
    type: 'documents_uploaded' | 'guardians_added' | 'categories_filled' | 'expiry_tracking' | 'legacy_created';
    value: number | string[];
    details?: Record<string, unknown>;
  };
  visualPosition: {
    x: number; // 0-100 percentage on the serenity map
    y: number; // 0-100 percentage on the serenity map
  };
  rewards?: {
    title: string;
    description: string;
    sofiaMessage?: string;
  };
  isUnlocked: boolean;
  unlockedAt?: string;
  icon: string;
}

export interface FiveMinuteChallenge {
  id: string;
  title: string;
  description: string;
  estimatedTime: number; // in minutes
  actionType: 'upload_document' | 'add_guardian' | 'organize_category' | 'set_reminders' | 'create_legacy';
  navigationTarget: string;
  prerequisites?: string[]; // milestone IDs that must be completed first
  sofiaGuidance: string;
  completionMessage: string;
}

// The Sacred Milestones of the Path of Serenity
export const SERENITY_MILESTONES: SerenityMilestone[] = [
  {
    id: 'foundation_stone',
    name: '🗿 Základný Kameň Istoty',
    description: 'Prvý krok na ceste k pokoju - nahrajte svoj prvý dôležitý dokument',
    completedDescription: 'Výborne! Položili ste základný kameň. Vaši blízki teraz vedia, kde hľadať prvú dôležitú informáciu.',
    category: 'foundation',
    unlockCondition: {
      type: 'documents_uploaded',
      value: 1
    },
    visualPosition: { x: 15, y: 85 }, // Start of the path
    rewards: {
      title: 'Prvý krok k istote',
      description: 'Zabezpečili ste prvú dôležitú informáciu pre svoju rodinu',
      sofiaMessage: 'Gratulujeme k prvému kroku! Práve ste začali budovať digitálny trezor istoty pre svoju rodinu. Každý ďalší dokument pridá novú vrstvu ochrany a pokoja.'
    },
    isUnlocked: false,
    icon: 'foundation'
  },

  {
    id: 'circle_of_trust',
    name: '🤝 Kruh Dôvery',
    description: 'Určite prvú dôveryhodnú osobu, ktorá bude vedieť o vašom digitálnom trezore',
    completedDescription: 'Vytvorili ste Kruh Dôvery. Vaša rodina bude mať v ťažkých chvíľach na koho sa obrátiť.',
    category: 'protection',
    unlockCondition: {
      type: 'guardians_added',
      value: 1
    },
    visualPosition: { x: 35, y: 70 },
    rewards: {
      title: 'Sieť bezpečnosti',
      description: 'Vaša rodina má teraz niekoho, na koho sa môže spoľahnúť',
      sofiaMessage: 'Krásne! Vytvorenie Kruhu Dôvery je jeden z najdôležitejších krokov. V ťažkých chvíľach bude mať vaša rodina jasno, na koho sa obrátiť o pomoc.'
    },
    isUnlocked: false,
    icon: 'users'
  },

  {
    id: 'digital_vault',
    name: '🏛️ Digitálny Trezor',
    description: 'Zabezpečte päť rôznych typov dokumentov pre kompletnú ochranu',
    completedDescription: 'Váš Digitálny Trezor je teraz aktívny. Kľúčové dokumenty sú bezpečne uložené a chránené.',
    category: 'foundation',
    unlockCondition: {
      type: 'documents_uploaded',
      value: 5
    },
    visualPosition: { x: 55, y: 60 },
    rewards: {
      title: 'Pevné základy',
      description: 'Máte už solidnú zbierku chránených dokumentov',
      sofiaMessage: 'Váš Digitálny Trezor je teraz skutočne funkčný! Päť dokumentov vytvára solídny základ bezpečnosti. Vaša rodina má k dispozícii dôležité informácie, keď ich potrebuje.'
    },
    isUnlocked: false,
    icon: 'vault'
  },

  {
    id: 'time_guardian',
    name: '⏰ Strážca Termínov',
    description: 'Nahrajte prvý dokument s dátumom exspirácie - nikdy nezabudnite na dôležitý termín',
    completedDescription: 'Aktivovali ste Strážcu Termínov. Odteraz za vás postrážim všetky dôležité dátumy.',
    category: 'protection',
    unlockCondition: {
      type: 'expiry_tracking',
      value: 1
    },
    visualPosition: { x: 45, y: 40 },
    rewards: {
      title: 'Nikdy nezabudnite',
      description: 'Automatické sledovanie expirácií dokumentov',
      sofiaMessage: 'Strážca Termínov je aktívny! Teraz budem sledovať dátumy exspirácie a včas vás upozorním. Vaša rodina sa nemusí obávať zastaraných dokumentov.'
    },
    isUnlocked: false,
    icon: 'clock'
  },

  {
    id: 'treasure_map',
    name: '🗺️ Mapa k Pokladu',
    description: 'Vytvorte dokumenty v aspoň troch rôznych kategóriách pre kompletnú organizáciu',
    completedDescription: 'Vytvorili ste prehľadnú mapu k vášmu majetku. Vaši blízki sa v nej ľahko zorientujú.',
    category: 'growth',
    unlockCondition: {
      type: 'categories_filled',
      value: ['financial', 'legal', 'personal'], // at least 3 categories
      details: { minimumCategories: 3 }
    },
    visualPosition: { x: 75, y: 50 },
    rewards: {
      title: 'Organizovaný majetok',
      description: 'Systematické usporiadanie všetkých dôležitých dokumentov',
      sofiaMessage: 'Fantastické! Vaša Mapa k Pokladu je kompletná. Dokumenty sú systematicky usporiadané a vaša rodina sa v nich bude vedieť ľahko zorientovať.'
    },
    isUnlocked: false,
    icon: 'map'
  },

  {
    id: 'legacy_foundation',
    name: '💫 Legacy for the Future',
    description: 'This special milestone awaits the creation of your first personal legacy',
    completedDescription: 'You have unlocked a key Milestone of Peace: Legacy for the Future. Your voice will be heard even when you are no longer here.',
    category: 'legacy',
    unlockCondition: {
      type: 'legacy_created',
      value: 1
    },
    visualPosition: { x: 85, y: 25 },
    rewards: {
      title: 'Eternal Legacy',
      description: 'Your values and wisdom for future generations',
      sofiaMessage: 'You have just begun creating something immensely valuable - your legacy for future generations. This is perhaps the most beautiful gift you can give to your family.'
    },
    isUnlocked: false,
    icon: 'heart'
  },

  // Future milestones (locked, creating infinite growth potential)
  {
    id: 'master_guardian',
    name: '👑 Majster Pokoja',
    description: 'Tento míľnik sa odomkne, keď budete mať všetky základné oblasti pokryté',
    completedDescription: 'Dosiahli ste majstrovstvo v zabezpečovaní pokoja pre svoju rodinu.',
    category: 'mastery',
    unlockCondition: {
      type: 'documents_uploaded',
      value: 20 // High threshold for mastery
    },
    visualPosition: { x: 95, y: 15 },
    isUnlocked: false,
    icon: 'crown'
  }
];

// 5-Minute Challenges - Gentle guidance for next steps
export const FIVE_MINUTE_CHALLENGES: FiveMinuteChallenge[] = [
  {
    id: 'first_document_challenge',
    title: 'Položte Základný Kameň Istoty',
    description: 'Nahrajte jeden dôležitý dokument, napríklad váš občiansky preukaz. Je to prvý a najdôležitejší krok.',
    estimatedTime: 5,
    actionType: 'upload_document',
    navigationTarget: '/vault',
    sofiaGuidance: 'Začnite s dokumentom, ktorý máte po ruke - občiansky preukaz, pas, alebo vodičský preukaz. Jednoducho ho odfotografujte telefonom a nahrajte.',
    completionMessage: 'Gratulujeme! Práve ste položili prvý kameň svojej cesty k pokoju.',
  },

  {
    id: 'first_guardian_challenge',
    title: 'Vytvorte Kruh Dôvery',
    description: 'Určite aspoň jednu osobu, ktorej dôverujete. Nemusí mať prístup k ničomu, bude len vedieť, že existuje miesto, kde hľadať pomoc.',
    estimatedTime: 3,
    actionType: 'add_guardian',
    navigationTarget: '/guardians',
    prerequisites: ['foundation_stone'],
    sofiaGuidance: 'Vyberte si niekoho blízkeho - partnera, dospelé dieťa, súrodenca alebo dobrého priateľa. Stačí zadať ich meno a email.',
    completionMessage: 'Výborne! Vaša rodina má teraz na koho sa obrátiť.',
  },

  {
    id: 'organize_categories_challenge',
    title: 'Usporiadajte svoj Digitálny Svet',
    description: 'Nahrajte dokumenty do rôznych kategórií - Financie, Zdravotníctvo, Bývanie. Vytvoríte si prehľadnú mapu.',
    estimatedTime: 7,
    actionType: 'organize_category',
    navigationTarget: '/vault',
    prerequisites: ['digital_vault'],
    sofiaGuidance: 'Pomôžem vám vybrať tie najdôležitejšie dokumenty z každej kategórie. Začneme s tými, ktoré máte už doma.',
    completionMessage: 'Fantastické! Vaša digitálna mapa je teraz prehľadná a organizovaná.',
  },

  {
    id: 'expiry_protection_challenge',
    title: 'Aktivujte Strážcu Termínov',
    description: 'Nahrajte dokument s dátumom platnosti - pas, vodičák alebo poistku. Sofia začne sledovať dôležité termíny.',
    estimatedTime: 4,
    actionType: 'set_reminders',
    navigationTarget: '/vault',
    prerequisites: ['foundation_stone'],
    sofiaGuidance: 'Vyberte dokument, ktorého platnosť chcete sledovať. Zadajte dátum exspirácie a ja sa postarám o včasné pripomienky.',
    completionMessage: 'Strážca Termínov je aktívny! Nikdy nezabudnete na dôležitý dátum.',
  }
];

/**
 * Interface for milestone calculation result
 */
export interface MilestoneCalculationResult {
  milestones: SerenityMilestone[];
  newlyUnlocked: SerenityMilestone[];
}

/**
 * Calculate which milestones should be unlocked based on user's current state
 */
export function calculateUnlockedMilestones(
  userStats: {
    documentsCount: number;
    guardiansCount: number;
    categoriesWithDocuments: string[];
    hasExpiryTracking: boolean;
    legacyItemsCount: number;
  },
  previousMilestones?: SerenityMilestone[]
): MilestoneCalculationResult {
  const currentMilestones = SERENITY_MILESTONES.map(milestone => {
    let isUnlocked = false;

    switch (milestone.unlockCondition.type) {
      case 'documents_uploaded':
        isUnlocked = userStats.documentsCount >= (milestone.unlockCondition.value as number);
        break;

      case 'guardians_added':
        isUnlocked = userStats.guardiansCount >= (milestone.unlockCondition.value as number);
        break;

      case 'categories_filled': {
        const requiredCategories = milestone.unlockCondition.value as string[];
        isUnlocked = requiredCategories.every(cat =>
          userStats.categoriesWithDocuments.includes(cat)
        );
        break;
      }

      case 'expiry_tracking':
        isUnlocked = userStats.hasExpiryTracking;
        break;

      case 'legacy_created':
        isUnlocked = userStats.legacyItemsCount >= (milestone.unlockCondition.value as number);
        break;
    }

    return {
      ...milestone,
      isUnlocked,
      unlockedAt: isUnlocked ? new Date().toISOString() : undefined
    };
  });

  // Find newly unlocked milestones
  const newlyUnlocked: SerenityMilestone[] = [];
  if (previousMilestones) {
    currentMilestones.forEach(current => {
      const previous = previousMilestones.find(p => p.id === current.id);
      if (current.isUnlocked && (!previous || !previous.isUnlocked)) {
        newlyUnlocked.push(current);
      }
    });
  }

  return {
    milestones: currentMilestones,
    newlyUnlocked
  };
}

/**
 * Get the next recommended 5-minute challenge based on user's progress
 */
export function getNextChallenge(
  unlockedMilestones: SerenityMilestone[],
  userStats: {
    documentsCount: number;
    guardiansCount: number;
    categoriesWithDocuments: string[];
  }
): FiveMinuteChallenge | null {
  // If no documents yet, start with first document
  if (userStats.documentsCount === 0) {
    return FIVE_MINUTE_CHALLENGES.find(c => c.id === 'first_document_challenge') || null;
  }

  // If no guardians yet, suggest adding guardian
  if (userStats.guardiansCount === 0) {
    return FIVE_MINUTE_CHALLENGES.find(c => c.id === 'first_guardian_challenge') || null;
  }

  // If less than 3 categories, suggest organizing
  if (userStats.categoriesWithDocuments.length < 3) {
    return FIVE_MINUTE_CHALLENGES.find(c => c.id === 'organize_categories_challenge') || null;
  }

  // If no expiry tracking, suggest it
  const hasExpiryMilestone = unlockedMilestones.find(m => m.id === 'time_guardian')?.isUnlocked;
  if (!hasExpiryMilestone) {
    return FIVE_MINUTE_CHALLENGES.find(c => c.id === 'expiry_protection_challenge') || null;
  }

  return null; // No active challenge
}

/**
 * Generate inspirational message based on user's progress
 */
export function generateSerenityMessage(unlockedMilestones: SerenityMilestone[]): string {
  const unlockedCount = unlockedMilestones.filter(m => m.isUnlocked).length;

  if (unlockedCount === 0) {
    return "Vítajte na Ceste Pokoja. Každý krok, ktorý urobíte, prinesie vašej rodine väčšiu istotu a pokoj.";
  } else if (unlockedCount === 1) {
    return "Výborne! Urobili ste prvý krok. Vaša rodina už má o niečo väčšiu istotu vďaka vám.";
  } else if (unlockedCount <= 3) {
    return `Krásne! Odomkli ste už ${unlockedCount} míľniky pokoja. Vaša rodina sa môže cítiť stále istejšie.`;
  } else if (unlockedCount <= 5) {
    return `Fantastické! S ${unlockedCount} míľnikmi ste vytvorili skutočne solídny základ istoty pre svoju rodinu.`;
  } else {
    return `Úžasné! ${unlockedCount} míľnikov pokoja - ste skutočným majstrom zabezpečovania pokoja a istoty.`;
  }
}
