# i18n Implementation Guide for LegacyGuard

## Overview

The LegacyGuard i18n system is designed to support 34+ languages across 40 jurisdictions with complex legal terminology and jurisdiction-specific content.

## Architecture

### Core Components

1. **Configuration** (`src/lib/i18n/config.ts`)
   - Main i18n configuration with react-i18next
   - Jurisdiction detection based on domain
   - Namespace organization
   - Custom formatters for dates, currency, legal dates

2. **Jurisdictions** (`src/lib/i18n/jurisdictions.ts`)
   - Complete configuration for 40 countries
   - Legal systems, tax information, document types
   - Tier-based pricing (Tier 1: €19, Tier 2: €14)
   - Notary requirements and emergency protocols

3. **Languages** (`src/lib/i18n/languages.ts`)
   - Configuration for 34+ languages
   - Script support (Latin, Cyrillic, Greek)
   - Date/time formatting rules
   - Number and currency formatting
   - Plural rules for complex languages

4. **Legal Terminology** (`src/lib/i18n/legal-terminology.ts`)
   - Jurisdiction-specific legal terms
   - Categories: Documents, Tax, Inheritance, Notary, Family, Property
   - Legal definitions and references
   - Related terms mapping

5. **TypeScript Types** (`src/lib/i18n/types.ts`)
   - Strong typing for all translations
   - Namespace-specific key structures
   - Hook return types

6. **React Hooks** (`src/lib/i18n/hooks.ts`)
   - `useTranslation`: Enhanced translation with jurisdiction support
   - `useJurisdiction`: Access jurisdiction configuration
   - `useLegalTerm`: Legal terminology access
   - `useLanguage`: Language-specific formatting
   - `useLanguageSwitcher`: Language switching UI
   - `useJurisdictionSwitcher`: Jurisdiction switching

## Directory Structure

```
public/
└── locales/
    ├── en/                     # English translations
    │   ├── common.json
    │   ├── auth.json
    │   ├── dashboard.json
    │   ├── legal.json
    │   └── ...
    ├── cs/                     # Czech translations
    │   └── ...
    ├── sk/                     # Slovak translations
    │   └── ...
    └── CZ/                     # Czech Republic jurisdiction overrides
        ├── cs/                 # Czech language
        │   ├── legalTerms.json
        │   ├── legalDocuments.json
        │   └── ...
        └── en/                 # English in Czech Republic
            └── ...
```

## Usage Examples

### Basic Translation

```tsx
import { useTranslation } from '@/lib/i18n';

function MyComponent() {
  const { t } = useTranslation('dashboard');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('welcome', { name: 'John' })}</p>
    </div>
  );
}
```

### Legal Terms

```tsx
import { useLegalTerm } from '@/lib/i18n';

function WillDocument() {
  const { getTerm, getDefinition } = useLegalTerm();
  
  return (
    <div>
      <h2>{getTerm('will')}</h2>
      <p>{getDefinition('will')}</p>
      {/* In Czech: "závěť" */}
      {/* In Slovak: "závet" */}
      {/* In German: "Testament" */}
    </div>
  );
}
```

### Jurisdiction-Specific Content

```tsx
import { useJurisdiction } from '@/lib/i18n';

function TaxInfo() {
  const { jurisdiction } = useJurisdiction();
  
  return (
    <div>
      <h3>Tax Information</h3>
      {jurisdiction.inheritanceTax.hasInheritanceTax ? (
        <p>Inheritance tax rate: {jurisdiction.inheritanceTax.rates}</p>
      ) : (
        <p>No inheritance tax in {jurisdiction.name}</p>
      )}
    </div>
  );
}
```

### Language-Specific Formatting

```tsx
import { useLanguage } from '@/lib/i18n';

function DateDisplay({ date }: { date: Date }) {
  const { formatDate, formatCurrency } = useLanguage();
  
  return (
    <div>
      <p>Date: {formatDate(date)}</p>
      {/* Czech: 25.08.2024 */}
      {/* English: 08/25/2024 */}
      <p>Price: {formatCurrency(19, '€')}</p>
      {/* Czech: 19,00 € */}
      {/* English: €19.00 */}
    </div>
  );
}
```

### Language Switcher

```tsx
import { useLanguageSwitcher } from '@/lib/i18n';

function LanguageSwitcher() {
  const { currentLanguage, availableLanguages, switchLanguage } = useLanguageSwitcher();
  
  return (
    <select 
      value={currentLanguage} 
      onChange={(e) => switchLanguage(e.target.value as LanguageCode)}
    >
      {availableLanguages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.nativeName}
        </option>
      ))}
    </select>
  );
}
```

## Translation File Format

### General Translation (e.g., `locales/en/common.json`)

```json
{
  "app": {
    "name": "LegacyGuard",
    "tagline": "Your Family's Digital Guardian"
  },
  "actions": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete"
  }
}
```

### Jurisdiction-Specific Legal Terms (e.g., `locales/CZ/cs/legalTerms.json`)

```json
{
  "will": "závěť",
  "will_definition": "Právní dokument vyjadřující poslední vůli zůstavitele",
  "will_reference": "Občanský zákoník § 1494",
  "power_of_attorney": "plná moc",
  "inheritance_tax": "daň z nabytí nemovitých věcí"
}
```

## Deployment Considerations

### Domain-Based Jurisdiction Detection

The system automatically detects jurisdiction based on the domain:
- `legacyguard.cz` → Czech Republic
- `legacyguard.sk` → Slovakia
- `legacyguard.de` → Germany
- etc.

### Language Loading Strategy

1. **Initial Load**: Load default language and common namespace
2. **Lazy Load**: Load additional namespaces as needed
3. **Legal Terms**: Load jurisdiction-specific legal terms on demand
4. **Caching**: Browser caches translations for performance

### SEO Considerations

- Use language-specific meta tags
- Implement hreflang tags for multiple languages
- Create language-specific sitemaps
- Use canonical URLs for jurisdiction variants

## Adding New Languages

1. Create language configuration in `src/lib/i18n/languages.ts`
2. Add language code to `LanguageCode` type
3. Create translation files in `public/locales/{lang}/`
4. Update jurisdiction configurations to include the language
5. Add legal term translations for relevant jurisdictions

## Adding New Jurisdictions

1. Add jurisdiction to `JURISDICTION_CONFIG` in `jurisdictions.ts`
2. Create jurisdiction folder in `public/locales/{JURISDICTION}/`
3. Add legal term translations for each supported language
4. Update domain mapping in `config.ts`
5. Configure pricing tier and legal requirements

## Testing

### Unit Tests

```typescript
import { getLegalTerm } from '@/lib/i18n';

describe('Legal Terms', () => {
  it('should return correct term for jurisdiction', () => {
    expect(getLegalTerm('will', 'CZ')).toBe('závěť');
    expect(getLegalTerm('will', 'SK')).toBe('závet');
    expect(getLegalTerm('will', 'DE')).toBe('Testament');
  });
});
```

### E2E Tests

```typescript
describe('Language Switching', () => {
  it('should switch language and update content', () => {
    cy.visit('/');
    cy.get('[data-testid="language-switcher"]').select('cs');
    cy.contains('Vítejte');
    cy.get('[data-testid="language-switcher"]').select('en');
    cy.contains('Welcome');
  });
});
```

## Performance Optimization

1. **Bundle Splitting**: Separate bundles per language
2. **Lazy Loading**: Load translations on demand
3. **Caching**: Aggressive caching of translation files
4. **CDN**: Serve translations from CDN
5. **Compression**: Gzip/Brotli compression for JSON files

## Monitoring

- Track missing translations in production
- Monitor language switching performance
- Analyze language usage by jurisdiction
- Track legal term search queries

## Future Enhancements

1. **AI-Powered Translation**: Automatic translation suggestions
2. **Crowdsourced Translations**: Community translation platform
3. **Voice Interface**: Multi-language voice support
4. **Regional Dialects**: Support for regional variations
5. **Legal Updates**: Automated legal term updates
6. **Translation Memory**: Reuse translations across jurisdictions
