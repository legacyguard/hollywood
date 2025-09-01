# 🌍 i18n Documentation - LegacyGuard

## 📋 Table of Contents
- [Overview](#overview)
- [Directory Structure](#directory-structure)
- [Naming Conventions](#naming-conventions)
- [Usage Guide](#usage-guide)
- [Adding Translations](#adding-translations)
- [Best Practices](#best-practices)
- [Tools & Scripts](#tools--scripts)
- [Legal Documents](#legal-documents)

## Overview

Our internationalization system is built with:
- **i18next** - Core i18n framework
- **react-i18next** - React integration
- **Modular structure** - Optimized for large-scale applications
- **Type safety** - Full TypeScript support
- **Lazy loading** - Performance optimized

### Supported Languages
- 🇬🇧 English (en) - Default
- 🇸🇰 Slovak (sk)
- 🇨🇿 Czech (cs)
- 🇩🇪 German (de)
- 🇵🇱 Polish (pl)

## Directory Structure

```
locales/
├── _shared/                 # Shared between web and mobile
│   ├── {lang}/
│   │   ├── common/          # Common UI elements
│   │   ├── auth/            # Authentication
│   │   ├── features/        # Feature modules
│   │   ├── errors/          # Error messages
│   │   └── notifications/   # Notification texts
│   └── _metadata.json       # Language metadata
├── legal/                   # Legal documents
│   └── {lang}/
│       ├── terms/           # Terms & policies
│       └── templates/       # Legal templates
├── web/                     # Web-specific
│   └── {lang}/
│       ├── landing/         # Landing pages
│       ├── onboarding/      # Onboarding flow
│       └── seo/             # SEO metadata
├── mobile/                  # Mobile-specific
│   └── {lang}/
│       ├── native/          # Native features
│       └── compact/         # Compact versions
└── config/                  # Configuration files
```

## Naming Conventions

### 🔑 Translation Keys

Follow this pattern: `category.subcategory.item.property`

#### ✅ Good Examples
```json
{
  "button.save": "Save",
  "form.validation.required": "This field is required",
  "vault.categories.financial": "Financial Documents",
  "error.network.timeout": "Connection timed out"
}
```

#### ❌ Bad Examples
```json
{
  "save": "Save",                    // Too generic
  "SaveButton": "Save",              // PascalCase
  "save_button": "Save",             // snake_case
  "btn-save": "Save"                 // kebab-case
}
```

### 📁 File Names

- Use **lowercase** with dots for namespaces
- Max 700 lines per file
- Logical grouping by feature

```
✅ common.ui.json
✅ features.vault.categories.json
✅ legal.templates.wills.SK.holographic.json

❌ CommonUI.json
❌ common_ui.json
❌ common-ui.json
```

### 🌐 Language Codes

Use ISO 639-1 codes:
- `en` - English
- `sk` - Slovak
- `cs` - Czech
- `de` - German
- `pl` - Polish

## Usage Guide

### Basic Usage

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation('common.ui');
  
  return (
    <button>{t('button.save')}</button>
  );
}
```

### With Namespace Loading

```tsx
import { useTranslation } from 'react-i18next';
import { useLoadNamespace } from '@/providers/I18nProvider';

function VaultPage() {
  const { isLoading } = useLoadNamespace('vault');
  const { t } = useTranslation('features.vault');
  
  if (isLoading) return <div>Loading translations...</div>;
  
  return (
    <div>{t('categories.financial')}</div>
  );
}
```

### Interpolation

```tsx
const { t } = useTranslation();

// In translation file:
// "welcome": "Welcome, {{name}}!"
// "items": "You have {{count}} item",
// "items_other": "You have {{count}} items"

t('welcome', { name: 'John' }); // Welcome, John!
t('items', { count: 1 });        // You have 1 item
t('items', { count: 5 });        // You have 5 items
```

### Formatting

```tsx
import { TranslationHelper } from '@/lib/i18n/i18n.types';

// Date formatting
TranslationHelper.formatDate(new Date(), 'sk', { format: 'long' });

// Number formatting
TranslationHelper.formatNumber(1234.56, 'en', { style: 'currency' });

// Relative time
TranslationHelper.formatDate(yesterday, 'en', { relative: true }); // "yesterday"
```

## Adding Translations

### Step 1: Add to English (default)

```json
// locales/_shared/en/features/vault.json
{
  "newFeature": {
    "title": "New Feature",
    "description": "This is a new feature"
  }
}
```

### Step 2: Add to other languages

```json
// locales/_shared/sk/features/vault.json
{
  "newFeature": {
    "title": "Nová funkcia",
    "description": "Toto je nová funkcia"
  }
}
```

### Step 3: Update TypeScript types

```typescript
// src/lib/i18n/i18n.types.ts
interface TranslationKeys {
  'features.vault': {
    newFeature: {
      title: string;
      description: string;
    }
  }
}
```

## Best Practices

### ✅ DO's

1. **Keep keys semantic and hierarchical**
   ```json
   "user.profile.settings.notifications.email": "Email notifications"
   ```

2. **Use pluralization correctly**
   ```json
   {
     "items_zero": "No items",
     "items_one": "{{count}} item",
     "items_other": "{{count}} items"
   }
   ```

3. **Include context in keys**
   ```json
   {
     "button.submit.form": "Submit",
     "button.submit.comment": "Post comment"
   }
   ```

4. **Use interpolation for dynamic content**
   ```json
   "greeting": "Hello, {{userName}}!"
   ```

5. **Group related translations**
   ```json
   {
     "form": {
       "labels": { ... },
       "placeholders": { ... },
       "validation": { ... }
     }
   }
   ```

### ❌ DON'T's

1. **Don't hardcode text in components**
   ```tsx
   // Bad
   <button>Save</button>
   
   // Good
   <button>{t('button.save')}</button>
   ```

2. **Don't use generic keys**
   ```json
   // Bad
   "message": "Success"
   
   // Good
   "payment.success.message": "Payment successful"
   ```

3. **Don't mix languages in one file**
   ```json
   // Bad
   {
     "title": "Title",
     "popis": "Description"  // Slovak in English file
   }
   ```

4. **Don't exceed 700 lines per file**
   - Use the optimizer script to check
   - Split large files by subcategory

## Tools & Scripts

### 🔍 Extract Hardcoded Texts
```bash
npm run i18n:extract
```
Scans codebase for hardcoded strings that need translation.

### 📊 Check File Sizes
```bash
npm run i18n:check
```
Analyzes translation files and reports any that exceed 700 lines.

### ✂️ Auto-split Large Files
```bash
npm run i18n:split
```
Automatically splits oversized translation files.

### 🔄 Validate Translations
```bash
npm run i18n:validate
```
Checks for missing translations across languages.

## Legal Documents

### Structure
```
legal/templates/wills/{country}/{type}/
├── structure.json    # Document structure
├── sections.json     # Section templates
├── clauses.json      # Legal clauses
└── glossary.json     # Legal terms
```

### Loading Legal Templates
```tsx
import { NamespaceLoader } from '@/lib/i18n/i18n.config';

// Load will template for Slovakia
await NamespaceLoader.loadLegalTemplate('SK', 'holographic');
```

### Country Codes
Use ISO 3166-1 alpha-2 codes:
- `SK` - Slovakia
- `CZ` - Czech Republic
- `AT` - Austria
- `DE` - Germany
- `PL` - Poland

## Migration Guide

### From Hardcoded Text

1. Run extraction script:
   ```bash
   npm run i18n:extract
   ```

2. Review generated report in `locales/_extraction/`

3. Add translations using suggested keys

4. Replace hardcoded text with `t()` calls

### Example Migration

**Before:**
```tsx
function LoginForm() {
  return (
    <form>
      <input placeholder="Enter your email" />
      <button>Sign In</button>
      {error && <span>Invalid credentials</span>}
    </form>
  );
}
```

**After:**
```tsx
function LoginForm() {
  const { t } = useTranslation('auth.login');
  
  return (
    <form>
      <input placeholder={t('placeholder.email')} />
      <button>{t('button.signIn')}</button>
      {error && <span>{t('error.invalidCredentials')}</span>}
    </form>
  );
}
```

## Performance Tips

### 1. Lazy Load Namespaces
```tsx
// Load only when needed
useEffect(() => {
  if (showAdvancedFeatures) {
    NamespaceLoader.loadFeature('advanced');
  }
}, [showAdvancedFeatures]);
```

### 2. Use Suspense Boundaries
```tsx
<Suspense fallback={<LoadingTranslations />}>
  <I18nProvider>
    <App />
  </I18nProvider>
</Suspense>
```

### 3. Preload Critical Namespaces
```tsx
// In app initialization
await i18n.loadNamespaces(['common.ui', 'auth.login']);
```

## Troubleshooting

### Missing Translations
- Check namespace is loaded
- Verify key exists in translation file
- Check for typos in key name

### Performance Issues
- Enable namespace lazy loading
- Split large translation files
- Use production build

### Type Errors
- Update `i18n.types.ts` with new keys
- Run TypeScript check: `npm run typecheck`

## Contributing

1. Always add English translations first
2. Use the naming conventions
3. Keep files under 700 lines
4. Test with multiple languages
5. Update TypeScript types

## Support

For questions or issues:
- Check this documentation
- Run diagnostic scripts
- Contact the development team

---

*Last updated: 2024*
*Version: 1.0.0*
