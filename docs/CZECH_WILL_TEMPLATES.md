# Czech Will Template System (will-cz)

## Overview

This document describes the complete implementation of Czech will templates in the Hollywood legal document system. The implementation follows Czech Civil Code (Občanský zákoník ČR) requirements for will creation and execution, specifically sections § 1540-1542.

## Implementation Status

✅ **COMPLETED** - All Czech will templates are fully implemented and tested.

## Template Structure

### Supported Will Types

The system supports all three will types recognized under Czech law:

1. **Holographic Will** (`holographic`)
   - **Legal Basis**: § 1540 Občanský zákoník ČR
   - **Key Requirement**: Dating is **MANDATORY**
   - **Writing**: Must be entirely handwritten by testator
   - **Signature**: Required
   - **Witnesses**: Not required

2. **Witnessed Will** (`witnessed`)
   - **Legal Basis**: § 1541 Občanský zákoník ČR
   - **Witnesses**: Exactly 2 required
   - **Witness Restrictions**: Cannot be beneficiaries **OR their spouses**
   - **Writing**: Can be typed or handwritten
   - **Signature**: Required by testator and witnesses

3. **Notarial Will** (`notarial`)
   - **Legal Basis**: § 1542 Občanský zákoník ČR
   - **Execution**: Must be prepared and executed by Czech notary public
   - **Security**: Highest level of legal protection
   - **Cost**: Notary fees apply

## File Structure

```
web/public/content/templates/cz/
├── holographic/
│   └── config.json
├── witnessed/
│   └── config.json
└── notarial/
    └── config.json
```

## Jurisdiction Configuration

The Czech Republic jurisdiction is configured in `web/src/types/will-templates.ts`:

```typescript
CZ: {
  jurisdiction: 'CZ',
  countryName: {
    en: 'Czech Republic',
    cs: 'Česká republika',
    sk: 'Česká republika',
    de: 'Tschechische Republik',
    uk: 'Чеська Республіка'
  },
  primaryLanguage: 'cs',
  supportedLanguages: ['cs', 'sk', 'en', 'de', 'uk'],
  supportedWillTypes: ['holographic', 'witnessed', 'notarial'],
  defaultWillType: 'holographic',
  legalRequirements: {
    minimumAge: 15,
    witnessRequirements: {
      required: true,
      minimumCount: 2,
      witnessRestrictions: [
        'Cannot be beneficiaries',
        'Cannot be spouses of beneficiaries',
        'Must be of legal age',
        'Must have legal capacity'
      ]
    }
  }
}
```

## Czech vs Slovak Differences

| Aspect | Czech Republic 🇨🇿 | Slovakia 🇸🇰 |
|--------|------------------|-------------|
| **Holographic Dating** | **MANDATORY** | Recommended (not mandatory) |
| **Witnessed Restrictions** | Beneficiaries or **their spouses** | Beneficiaries or relatives |
| **Legal Basis** | § 1540-1542 Czech Civil Code | § 476-478 Slovak Civil Code |
| **Currency** | CZK | EUR |
| **Language** | Czech (cs) | Slovak (sk) |
| **Minimum Age** | 15 years | 18 years |

## Implementation Components

### 1. Template Configuration Files

Each will type has a comprehensive JSON configuration file containing:
- Metadata (name, description, legal basis)
- Bilingual labels (Czech and English)
- Template variables and validation rules
- Legal clauses and sections
- Execution instructions

### 2. Template Library Integration

Templates are loaded via `templateLibrary.ts`:

```typescript
// Czech Republic templates
await this.loadTemplate('CZ', 'holographic', 'cs');
await this.loadTemplate('CZ', 'witnessed', 'cs');  
await this.loadTemplate('CZ', 'notarial', 'cs');
```

### 3. React Testing Component

`CZTemplateLoaderTest.tsx` provides interactive testing of:
- Template loading from the library
- Jurisdiction configuration validation
- Czech-specific legal requirements
- Comparison with Slovak templates

### 4. Node.js Seed Script

`scripts/seed-cz-will-templates.ts` performs automated testing:
- Loads all three Czech templates from filesystem
- Validates template structure and content
- Tests with sample Czech user data
- Provides detailed success/error reporting

## Testing and Validation

### Running Tests

1. **Node.js Script Test**:
   ```bash
   cd /Users/luborfedak/Documents/Github/hollywood
   npx tsx scripts/seed-cz-will-templates.ts
   ```

2. **React Component Test**:
   - Start dev server: `npm run dev`
   - Navigate to: `http://localhost:8082/test/czech-templates`
   - Click "Run Template Loading Test"

### Expected Results

All tests should show:
- ✅ 3 Czech templates loaded successfully
- ✅ Jurisdiction configuration loaded
- ✅ Legal requirements properly configured
- ✅ Czech-specific validations working

## Legal Compliance Features

### Holographic Will Specific
- **Mandatory Dating**: System enforces date requirement
- **Handwriting Verification**: Instructions for handwritten execution
- **Simplicity**: Streamlined for individual creation

### Witnessed Will Specific  
- **Witness Validation**: Ensures witnesses aren't beneficiaries or their spouses
- **Signature Process**: Clear instructions for multi-party signing
- **Legal Capacity**: Verification that witnesses have legal capacity

### Notarial Will Specific
- **Notary Requirements**: Integration with Czech notary system
- **Cost Estimation**: Expected fee ranges
- **Professional Execution**: Step-by-step notary process

## Localization

Templates support multiple languages with primary Czech language:
- **Czech (cs)**: Primary language for legal terms
- **English (en)**: International accessibility  
- **Slovak (sk)**: Regional compatibility
- **German (de)**: Historical legal tradition
- **Ukrainian (uk)**: Recent refugee population support

## Production Readiness

The Czech will template system is **production-ready** with:
- ✅ Complete legal compliance with Czech Civil Code
- ✅ Comprehensive testing (automated + manual)
- ✅ Proper error handling and validation
- ✅ Bilingual UI support
- ✅ Integration with existing template library
- ✅ Documentation and maintenance procedures

## Usage Example

```typescript
import { templateLibrary } from '@/lib/templateLibrary';

// Load Czech holographic will template
const template = await templateLibrary.getTemplate('CZ', 'holographic', 'cs');

// Validate user data against Czech requirements  
const validation = await templateLibrary.validateWillData(userData, template);

// Get Czech jurisdiction configuration
const czConfig = await templateLibrary.getJurisdictionConfig('CZ');
```

## Maintenance

### Adding New Will Types
1. Create new directory under `web/public/content/templates/cz/`
2. Add `config.json` with template configuration
3. Update `supportedWillTypes` in jurisdiction config
4. Add loading logic to `templateLibrary.ts`

### Legal Updates
1. Review Czech Civil Code changes
2. Update relevant `config.json` files
3. Modify legal clauses and requirements
4. Run full test suite to verify compliance

## Security Considerations

- Template configurations are read-only JSON files
- No user data is stored in templates
- Legal clauses are validated against current law
- Execution instructions include security warnings

---

**Legal Disclaimer**: This implementation provides templates based on Czech Civil Code § 1540-1542. Users should consult with qualified Czech legal professionals for complex estate planning needs.
