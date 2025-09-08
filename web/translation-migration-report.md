# Translation Migration Report

**Generated:** 2025-09-08T08:20:54.702Z

## Summary

- **Total Files Analyzed:** 559
- **Files with Hardcoded Strings:** 211
- **Total Hardcoded Strings Found:** 1914

## Hardcoded Strings by File

### src/types/will-templates.ts

- **Line 536:** `notes`
  - **Suggested Key:** `common.notes`
  - **Context:** `notes: 'No inheritance tax between spouses, children, and parents',`

- **Line 596:** `notes`
  - **Suggested Key:** `common.notes`
  - **Context:** `notes: 'No inheritance tax in Slovakia',`

### src/types/supabase.ts

- **Line 199:** `buckettype`
  - **Suggested Key:** `common.buckettype`
  - **Context:** `buckettype: "ANALYTICS" | "STANDARD"`

### src/types/supabase-exact.ts

- **Line 199:** `buckettype`
  - **Suggested Key:** `common.buckettype`
  - **Context:** `buckettype: "ANALYTICS" | "STANDARD"`

### src/types/milestones.ts

- **Line 223:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Guardian Awakening',`

- **Line 230:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Legacy Foundation',`

- **Line 237:** `statusMessage`
  - **Suggested Key:** `common.statusmessage`
  - **Context:** `statusMessage: 'Your first stone is placed in the family mosaic',`

- **Line 245:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Memory Keeper',`

- **Line 252:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Enhanced Security',`

- **Line 255:** `statusMessage`
  - **Suggested Key:** `common.statusmessage`
  - **Context:** `statusMessage: "Your family's foundation grows stronger",`

- **Line 263:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Legacy Architect',`

- **Line 270:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Comprehensive Planning',`

- **Line 277:** `statusMessage`
  - **Suggested Key:** `common.statusmessage`
  - **Context:** `statusMessage: 'Your legacy architecture takes beautiful shape',`

- **Line 285:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Heritage Guardian',`

- **Line 298:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Master Protection',`

- **Line 316:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'First Document Upload',`

### src/types/guardian.ts

- **Line 56:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `{ value: 'spouse', label: 'Spouse' },`

- **Line 57:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `{ value: 'partner', label: 'Partner' },`

- **Line 59:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `{ value: 'parent', label: 'Parent' },`

- **Line 60:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `{ value: 'sibling', label: 'Sibling' },`

- **Line 61:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `{ value: 'friend', label: 'Friend' },`

- **Line 62:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `{ value: 'lawyer', label: 'Lawyer' },`

- **Line 63:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `{ value: 'financial_advisor', label: 'Financial Advisor' },`

### src/types/family.ts

- **Line 297:** `spouse`
  - **Suggested Key:** `common.spouse`
  - **Context:** `spouse: 'Spouse',`

- **Line 298:** `partner`
  - **Suggested Key:** `common.partner`
  - **Context:** `partner: 'Partner',`

- **Line 300:** `parent`
  - **Suggested Key:** `common.parent`
  - **Context:** `parent: 'Parent',`

- **Line 301:** `sibling`
  - **Suggested Key:** `common.sibling`
  - **Context:** `sibling: 'Sibling',`

- **Line 302:** `grandparent`
  - **Suggested Key:** `common.grandparent`
  - **Context:** `grandparent: 'Grandparent',`

- **Line 303:** `grandchild`
  - **Suggested Key:** `common.grandchild`
  - **Context:** `grandchild: 'Grandchild',`

- **Line 305:** `cousin`
  - **Suggested Key:** `common.cousin`
  - **Context:** `cousin: 'Cousin',`

- **Line 306:** `friend`
  - **Suggested Key:** `common.friend`
  - **Context:** `friend: 'Trusted Friend',`

- **Line 307:** `professional`
  - **Suggested Key:** `common.professional`
  - **Context:** `professional: 'Professional',`

### src/types/database.ts

- **Line 209:** `type`
  - **Suggested Key:** `common.type`
  - **Context:** `type: 'DELETE' | 'INSERT' | 'UPDATE';`

- **Line 214:** `eventType`
  - **Suggested Key:** `common.eventtype`
  - **Context:** `eventType: 'DELETE' | 'INSERT' | 'UPDATE';`

### src/test/rls-policies.test.ts

- **Line 112:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'John Doe',`

- **Line 154:** `p_reason`
  - **Suggested Key:** `common.preason`
  - **Context:** `p_reason: 'Security rotation',`

- **Line 163:** `p_reason`
  - **Suggested Key:** `common.preason`
  - **Context:** `p_reason: 'Security rotation',`

- **Line 174:** `bundle_name`
  - **Suggested Key:** `common.bundlename`
  - **Context:** `bundle_name: 'Financial Documents',`

- **Line 176:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'All financial related documents',`

- **Line 254:** `p_bundle_name`
  - **Suggested Key:** `common.pbundlename`
  - **Context:** `p_bundle_name: 'Test Bundle',`

- **Line 263:** `p_bundle_name`
  - **Suggested Key:** `common.pbundlename`
  - **Context:** `p_bundle_name: 'Test Bundle',`

### src/test/encryption.test.ts

- **Line 149:** `Sensitive information`
  - **Suggested Key:** `forms.sensitiveInformation`
  - **Context:** `const testText = 'Sensitive information';`

- **Line 245:** `error`
  - **Suggested Key:** `errors.error`
  - **Context:** `error: 'Internal server error',`

### src/test/auth-permissions.test.ts

- **Line 24:** `fullName`
  - **Suggested Key:** `common.fullname`
  - **Context:** `fullName: 'John Doe',`

- **Line 229:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `const mockError = { message: 'Database error', code: 'PGRST116' };`

### src/stories/Page.tsx

- **Line 18:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `onLogin={() => setUser({ name: 'Jane Doe' })}`

- **Line 20:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `onCreateAccount={() => setUser({ name: 'Jane Doe' })}`

### src/stories/Header.stories.ts

- **Line 30:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Jane Doe',`

### src/stories/Button.stories.ts

- **Line 33:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Button',`

- **Line 39:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Button',`

- **Line 46:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Button',`

- **Line 53:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Button',`

### src/services/willGuardianIntegration.ts

- **Line 307:** `title`
  - **Suggested Key:** `forms.title`
  - **Context:** `title: 'Last Will and Testament Information',`

- **Line 336:** `Primary`
  - **Suggested Key:** `common.primary`
  - **Context:** ``**${executor.type === 'primary' ? 'Primary' : 'Alternate'} Executor:**``

### src/services/willGenerationService.ts

- **Line 125:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** ``Will generation failed: ${error instanceof Error ? error.message : 'Unknown error'}``

### src/services/willExportService.ts

- **Line 1296:** `specificBequests`
  - **Suggested Key:** `common.specificbequests`
  - **Context:** `specificBequests: 'V. ODKAZY',`

- **Line 1301:** `signature`
  - **Suggested Key:** `common.signature`
  - **Context:** `signature: 'X. PODPIS',`

- **Line 1302:** `witnesses`
  - **Suggested Key:** `common.witnesses`
  - **Context:** `witnesses: 'SVEDKOVIA',`

- **Line 1402:** `specificBequests`
  - **Suggested Key:** `common.specificbequests`
  - **Context:** `specificBequests: 'V. ODKAZY',`

- **Line 1407:** `signature`
  - **Suggested Key:** `common.signature`
  - **Context:** `signature: 'X. PODPIS',`

- **Line 1467:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'INFORMACE O JURISDIKCI SLOVENSKO',`

- **Line 1498:** `documentTitle`
  - **Suggested Key:** `common.documenttitle`
  - **Context:** `documentTitle: 'LAST WILL AND TESTAMENT',`

- **Line 1499:** `headerText`
  - **Suggested Key:** `common.headertext`
  - **Context:** `headerText: 'Last Will and Testament under Slovak Law',`

- **Line 1501:** `personalInfo`
  - **Suggested Key:** `common.personalinfo`
  - **Context:** `personalInfo: 'I. TESTATOR',`

- **Line 1502:** `revocation`
  - **Suggested Key:** `common.revocation`
  - **Context:** `revocation: 'II. REVOCATION OF PREVIOUS WILLS',`

- **Line 1503:** `beneficiaries`
  - **Suggested Key:** `common.beneficiaries`
  - **Context:** `beneficiaries: 'III. APPOINTMENT OF HEIRS',`

- **Line 1504:** `forcedHeirs`
  - **Suggested Key:** `common.forcedheirs`
  - **Context:** `forcedHeirs: 'IV. FORCED HEIRS',`

- **Line 1506:** `executor`
  - **Suggested Key:** `common.executor`
  - **Context:** `executor: 'VI. EXECUTOR',`

- **Line 1507:** `guardianship`
  - **Suggested Key:** `common.guardianship`
  - **Context:** `guardianship: 'VII. GUARDIANSHIP',`

- **Line 1508:** `finalWishes`
  - **Suggested Key:** `common.finalwishes`
  - **Context:** `finalWishes: 'VIII. FINAL WISHES',`

- **Line 1510:** `signature`
  - **Suggested Key:** `common.signature`
  - **Context:** `signature: 'X. SIGNATURE',`

- **Line 1511:** `witnesses`
  - **Suggested Key:** `common.witnesses`
  - **Context:** `witnesses: 'WITNESSES',`

- **Line 1514:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'WILL EXECUTION INSTRUCTIONS',`

- **Line 1516:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Holographic Will',`

- **Line 1536:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Witnessed Will',`

- **Line 1554:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Notarial Will',`

- **Line 1573:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'SLOVAKIA JURISDICTION INFORMATION',`

- **Line 1578:** `holographicRequirements`
  - **Suggested Key:** `common.holographicrequirements`
  - **Context:** `holographicRequirements: 'Handwritten signature, dating recommended',`

- **Line 1582:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'LEGAL GUIDANCE',`

- **Line 1604:** `documentTitle`
  - **Suggested Key:** `common.documenttitle`
  - **Context:** `documentTitle: 'LETZTER WILLE UND TESTAMENT',`

- **Line 1605:** `headerText`
  - **Suggested Key:** `common.headertext`
  - **Context:** `headerText: 'Letzter Wille und Testament nach slowakischem Recht',`

- **Line 1607:** `personalInfo`
  - **Suggested Key:** `common.personalinfo`
  - **Context:** `personalInfo: 'I. ERBLASSER',`

- **Line 1609:** `beneficiaries`
  - **Suggested Key:** `common.beneficiaries`
  - **Context:** `beneficiaries: 'III. ERBEINSETZUNG',`

- **Line 1610:** `forcedHeirs`
  - **Suggested Key:** `common.forcedheirs`
  - **Context:** `forcedHeirs: 'IV. PFLICHTTEILSBERECHTIGTE',`

- **Line 1613:** `guardianship`
  - **Suggested Key:** `common.guardianship`
  - **Context:** `guardianship: 'VII. VORMUNDSCHAFT',`

- **Line 1616:** `signature`
  - **Suggested Key:** `common.signature`
  - **Context:** `signature: 'X. UNTERSCHRIFT',`

- **Line 1617:** `witnesses`
  - **Suggested Key:** `common.witnesses`
  - **Context:** `witnesses: 'ZEUGEN',`

- **Line 1642:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Testament vor Zeugen',`

- **Line 1660:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Notarielles Testament',`

- **Line 1679:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'SLOWAKEI JURISDIKTION INFORMATION',`

- **Line 1689:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'RECHTLICHE HINWEISE',`

- **Line 1718:** `specificBequests`
  - **Suggested Key:** `common.specificbequests`
  - **Context:** `specificBequests: 'V. ODKAZY',`

- **Line 1723:** `signature`
  - **Suggested Key:** `common.signature`
  - **Context:** `signature: 'X. PODPIS',`

- **Line 1724:** `witnesses`
  - **Suggested Key:** `common.witnesses`
  - **Context:** `witnesses: 'SVEDKOVIA',`

- **Line 1824:** `specificBequests`
  - **Suggested Key:** `common.specificbequests`
  - **Context:** `specificBequests: 'V. ODKAZY',`

- **Line 1829:** `signature`
  - **Suggested Key:** `common.signature`
  - **Context:** `signature: 'X. PODPIS',`

- **Line 1920:** `documentTitle`
  - **Suggested Key:** `common.documenttitle`
  - **Context:** `documentTitle: 'LAST WILL AND TESTAMENT',`

- **Line 1921:** `headerText`
  - **Suggested Key:** `common.headertext`
  - **Context:** `headerText: 'Last Will and Testament under Czech Law',`

- **Line 1923:** `personalInfo`
  - **Suggested Key:** `common.personalinfo`
  - **Context:** `personalInfo: 'I. TESTATOR',`

- **Line 1924:** `revocation`
  - **Suggested Key:** `common.revocation`
  - **Context:** `revocation: 'II. REVOCATION OF PREVIOUS WILLS',`

- **Line 1925:** `beneficiaries`
  - **Suggested Key:** `common.beneficiaries`
  - **Context:** `beneficiaries: 'III. APPOINTMENT OF HEIRS',`

- **Line 1926:** `forcedHeirs`
  - **Suggested Key:** `common.forcedheirs`
  - **Context:** `forcedHeirs: 'IV. FORCED HEIRS',`

- **Line 1928:** `executor`
  - **Suggested Key:** `common.executor`
  - **Context:** `executor: 'VI. EXECUTOR',`

- **Line 1929:** `guardianship`
  - **Suggested Key:** `common.guardianship`
  - **Context:** `guardianship: 'VII. GUARDIANSHIP',`

- **Line 1930:** `finalWishes`
  - **Suggested Key:** `common.finalwishes`
  - **Context:** `finalWishes: 'VIII. FINAL WISHES',`

- **Line 1932:** `signature`
  - **Suggested Key:** `common.signature`
  - **Context:** `signature: 'X. SIGNATURE',`

- **Line 1933:** `witnesses`
  - **Suggested Key:** `common.witnesses`
  - **Context:** `witnesses: 'WITNESSES',`

- **Line 1936:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'WILL EXECUTION INSTRUCTIONS',`

- **Line 1938:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Holographic Will',`

- **Line 1958:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Witnessed Will',`

- **Line 1976:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Notarial Will',`

- **Line 1995:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'CZECH REPUBLIC JURISDICTION INFORMATION',`

- **Line 2000:** `holographicRequirements`
  - **Suggested Key:** `common.holographicrequirements`
  - **Context:** `holographicRequirements: 'Handwritten signature, MANDATORY date',`

- **Line 2004:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'LEGAL GUIDANCE',`

- **Line 2026:** `documentTitle`
  - **Suggested Key:** `common.documenttitle`
  - **Context:** `documentTitle: 'LETZTER WILLE UND TESTAMENT',`

- **Line 2027:** `headerText`
  - **Suggested Key:** `common.headertext`
  - **Context:** `headerText: 'Letzter Wille und Testament nach tschechischem Recht',`

- **Line 2029:** `personalInfo`
  - **Suggested Key:** `common.personalinfo`
  - **Context:** `personalInfo: 'I. ERBLASSER',`

- **Line 2031:** `beneficiaries`
  - **Suggested Key:** `common.beneficiaries`
  - **Context:** `beneficiaries: 'III. ERBEINSETZUNG',`

- **Line 2032:** `forcedHeirs`
  - **Suggested Key:** `common.forcedheirs`
  - **Context:** `forcedHeirs: 'IV. PFLICHTTEILSBERECHTIGTE',`

- **Line 2035:** `guardianship`
  - **Suggested Key:** `common.guardianship`
  - **Context:** `guardianship: 'VII. VORMUNDSCHAFT',`

- **Line 2038:** `signature`
  - **Suggested Key:** `common.signature`
  - **Context:** `signature: 'X. UNTERSCHRIFT',`

- **Line 2039:** `witnesses`
  - **Suggested Key:** `common.witnesses`
  - **Context:** `witnesses: 'ZEUGEN',`

- **Line 2064:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Testament vor Zeugen',`

- **Line 2082:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Notarielles Testament',`

- **Line 2106:** `holographicRequirements`
  - **Suggested Key:** `common.holographicrequirements`
  - **Context:** `holographicRequirements: 'Handschriftliche Unterschrift, PFLICHTDATUM',`

- **Line 2110:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'RECHTLICHE HINWEISE',`

### src/services/willApiService.ts

- **Line 336:** `placeOfBirth`
  - **Suggested Key:** `common.placeofbirth`
  - **Context:** `placeOfBirth: 'Unknown',`

- **Line 337:** `citizenship`
  - **Suggested Key:** `common.citizenship`
  - **Context:** `citizenship: 'Unknown',`

### src/services/securityMetricsService.ts

- **Line 210:** `threatType`
  - **Suggested Key:** `common.threattype`
  - **Context:** `threatType: 'SQL Injection',`

- **Line 214:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Attempted SQL injection in document query',`

- **Line 223:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Failed login attempt',`

- **Line 233:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Login from new location',`

- **Line 314:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `{ name: 'SQL Injection', value: 45, color: '#FF6B6B' },`

- **Line 316:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `{ name: 'Brute Force', value: 28, color: '#45B7D1' },`

- **Line 317:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `{ name: 'Path Traversal', value: 15, color: '#96CEB4' },`

- **Line 325:** `country`
  - **Suggested Key:** `common.country`
  - **Context:** `{ country: 'Russia', requests: 800, threats: 180 },`

- **Line 326:** `country`
  - **Suggested Key:** `common.country`
  - **Context:** `{ country: 'Germany', requests: 650, threats: 12 },`

### src/services/realProfessionalService.ts

- **Line 536:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'New Review Request Available',`

- **Line 558:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Document Review Assigned',`

- **Line 559:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'A professional has been assigned to review your document',`

- **Line 567:** `subject`
  - **Suggested Key:** `common.subject`
  - **Context:** `subject: 'Document Review Assigned',`

- **Line 587:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Document Review Completed',`

- **Line 602:** `subject`
  - **Suggested Key:** `common.subject`
  - **Context:** `subject: 'Document Review Completed',`

- **Line 623:** `subject`
  - **Suggested Key:** `common.subject`
  - **Context:** `subject: 'Consultation Confirmation',`

- **Line 636:** `subject`
  - **Suggested Key:** `common.subject`
  - **Context:** `subject: 'New Consultation Booked',`

### src/services/realMilestonesService.ts

- **Line 279:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Guardian Awakening',`

- **Line 321:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'First Document Upload',`

- **Line 335:** `nextAction`
  - **Suggested Key:** `common.buttons.nextaction`
  - **Context:** `nextAction: 'Upload your first document',`

- **Line 631:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Milestone Achieved!',`

- **Line 696:** `Family members table not available, using fallback`
  - **Suggested Key:** `common.familyMembersTableNotAvailableUsingFallback`
  - **Context:** `console.warn('Family members table not available, using fallback');`

- **Line 747:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Heritage Guardian',`

- **Line 748:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Master of legacy protection',`

- **Line 751:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Master Protection',`

- **Line 754:** `statusMessage`
  - **Suggested Key:** `common.statusmessage`
  - **Context:** `statusMessage: 'Complete mastery',`

- **Line 756:** `celebrationMessage`
  - **Suggested Key:** `common.celebrationmessage`
  - **Context:** `celebrationMessage: 'You are now a Heritage Guardian!',`

- **Line 762:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Legacy Architect',`

- **Line 763:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Comprehensive protection designer',`

- **Line 766:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Advanced Planning',`

- **Line 769:** `statusMessage`
  - **Suggested Key:** `common.statusmessage`
  - **Context:** `statusMessage: 'Strong foundation',`

- **Line 771:** `celebrationMessage`
  - **Suggested Key:** `common.celebrationmessage`
  - **Context:** `celebrationMessage: 'You are now a Legacy Architect!',`

- **Line 777:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Memory Keeper',`

- **Line 778:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Active family protector',`

- **Line 781:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Enhanced Security',`

- **Line 784:** `statusMessage`
  - **Suggested Key:** `common.statusmessage`
  - **Context:** `statusMessage: 'Growing stronger',`

- **Line 786:** `celebrationMessage`
  - **Suggested Key:** `common.celebrationmessage`
  - **Context:** `celebrationMessage: 'You are now a Memory Keeper!',`

- **Line 793:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Guardian Awakening',`

- **Line 794:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Beginning your journey',`

- **Line 797:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Foundation',`

- **Line 800:** `statusMessage`
  - **Suggested Key:** `common.statusmessage`
  - **Context:** `statusMessage: 'First steps taken',`

- **Line 802:** `celebrationMessage`
  - **Suggested Key:** `common.celebrationmessage`
  - **Context:** `celebrationMessage: 'Welcome, Guardian!',`

### src/services/realInsightsService.ts

- **Line 515:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Time Saved',`

- **Line 534:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Protection Level Increased',`

- **Line 554:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Document Completion Opportunity',`

- **Line 560:** `actionText`
  - **Suggested Key:** `common.actiontext`
  - **Context:** `actionText: 'Review and complete',`

- **Line 580:** `action`
  - **Suggested Key:** `forms.action`
  - **Context:** `action: 'Complete missing information',`

- **Line 590:** `reason`
  - **Suggested Key:** `common.reason`
  - **Context:** `reason: 'Document quality could be enhanced',`

- **Line 609:** `Family members table not available, using fallback`
  - **Suggested Key:** `common.familyMembersTableNotAvailableUsingFallback`
  - **Context:** `console.warn('Family members table not available, using fallback');`

- **Line 700:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Family Impact Analysis',`

- **Line 784:** `area`
  - **Suggested Key:** `common.area`
  - **Context:** `area: 'Document Foundation',`

- **Line 785:** `risk`
  - **Suggested Key:** `common.risk`
  - **Context:** `risk: 'No secured documents available for family access',`

- **Line 786:** `recommendation`
  - **Suggested Key:** `common.recommendation`
  - **Context:** `recommendation: 'Upload your first important document',`

- **Line 793:** `area`
  - **Suggested Key:** `common.area`
  - **Context:** `area: 'Will Documentation',`

- **Line 795:** `recommendation`
  - **Suggested Key:** `common.recommendation`
  - **Context:** `recommendation: 'Create or upload your will',`

- **Line 802:** `area`
  - **Suggested Key:** `common.area`
  - **Context:** `area: 'Family Access',`

- **Line 803:** `risk`
  - **Suggested Key:** `common.risk`
  - **Context:** `risk: 'No family members configured for emergency access',`

- **Line 804:** `recommendation`
  - **Suggested Key:** `common.recommendation`
  - **Context:** `recommendation: 'Add trusted family members',`

### src/services/professionalService.ts

- **Line 653:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error: error instanceof Error ? error.message : 'Unknown error',`

- **Line 712:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error: error instanceof Error ? error.message : 'Unknown error',`

- **Line 768:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error: error instanceof Error ? error.message : 'Unknown error',`

- **Line 796:** `pending`
  - **Suggested Key:** `common.pending`
  - **Context:** `pending: 'Your document review has been assigned and is pending',`

- **Line 797:** `in_progress`
  - **Suggested Key:** `common.inprogress`
  - **Context:** `in_progress: 'Your document review is currently in progress',`

- **Line 798:** `completed`
  - **Suggested Key:** `success.completed`
  - **Context:** `completed: 'Your document review has been completed',`

- **Line 799:** `cancelled`
  - **Suggested Key:** `common.buttons.cancelled`
  - **Context:** `cancelled: 'Your document review has been cancelled',`

- **Line 800:** `needs_revision`
  - **Suggested Key:** `common.needsrevision`
  - **Context:** `needs_revision: 'Your document needs revision based on professional feedback',`

- **Line 841:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error: error instanceof Error ? error.message : 'Unknown error',`

- **Line 869:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error instanceof Error ? error.message : 'Unknown error'`

- **Line 933:** `pending`
  - **Suggested Key:** `common.pending`
  - **Context:** `pending: 'Pending Review',`

- **Line 934:** `under_review`
  - **Suggested Key:** `common.underreview`
  - **Context:** `under_review: 'Under Review',`

- **Line 936:** `rejected`
  - **Suggested Key:** `common.rejected`
  - **Context:** `rejected: 'Application Rejected',`

### src/services/ocrService.ts

- **Line 163:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error instanceof Error ? error.message : 'Unknown error',`

### src/services/ocr.service.ts

- **Line 90:** `OCR service not available, returning fallback response`
  - **Suggested Key:** `common.ocrServiceNotAvailableReturningFallbackResponse`
  - **Context:** `console.warn('OCR service not available, returning fallback response');`

- **Line 120:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error: error instanceof Error ? error.message : 'OCR processing failed',`

- **Line 186:** `error`
  - **Suggested Key:** `errors.error`
  - **Context:** `error: 'No text detected in document',`

- **Line 260:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Please enter document details manually',`

- **Line 289:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Please try again or enter details manually',`

- **Line 294:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error: error instanceof Error ? error.message : 'OCR processing failed',`

### src/services/milestonesService.ts

- **Line 403:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Family Shield Activated',`

- **Line 416:** `nextAction`
  - **Suggested Key:** `common.buttons.nextaction`
  - **Context:** `nextAction: 'Upload essential documents',`

- **Line 455:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Family Circle Complete',`

- **Line 456:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Add and secure all family members',`

- **Line 468:** `nextAction`
  - **Suggested Key:** `common.buttons.nextaction`
  - **Context:** `nextAction: 'Add family members',`

- **Line 477:** `emotionalFraming`
  - **Suggested Key:** `common.emotionalframing`
  - **Context:** `emotionalFraming: 'Love expressed through thoughtful preparation',`

### src/services/insightsService.ts

- **Line 419:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Document Incomplete',`

- **Line 424:** `actionText`
  - **Suggested Key:** `common.actiontext`
  - **Context:** `actionText: 'Complete Document',`

- **Line 449:** `action`
  - **Suggested Key:** `forms.action`
  - **Context:** `action: 'Complete missing information',`

- **Line 675:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Annual Will Review Due',`

- **Line 681:** `actionText`
  - **Suggested Key:** `common.actiontext`
  - **Context:** `actionText: 'Schedule Review',`

- **Line 709:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Family Protection Update',`

- **Line 733:** `emotionalBenefit`
  - **Suggested Key:** `common.emotionalbenefit`
  - **Context:** `emotionalBenefit: 'Enhanced family security and peace of mind',`

### src/services/familyService.ts

- **Line 141:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: `Welcome to our family legacy system!`,`

- **Line 929:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: `Recommended action to improve family protection`,`

### src/services/duplicateDetectionService.ts

- **Line 82:** `subject`
  - **Suggested Key:** `common.subject`
  - **Context:** `subject: 'Your Will Template',`

- **Line 95:** `subject`
  - **Suggested Key:** `common.subject`
  - **Context:** `subject: 'Policy Documents',`

- **Line 219:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Same file type',`

- **Line 270:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Identical filename',`

- **Line 282:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Same filename, different extension',`

- **Line 289:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Different filename',`

- **Line 302:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Identical file size',`

- **Line 315:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Very similar file size',`

- **Line 324:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Similar file size',`

- **Line 331:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Different file size',`

- **Line 412:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Very similar filename structure',`

- **Line 418:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Similar filename structure',`

- **Line 425:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Different filename structure',`

### src/services/documentCategorizationService.ts

- **Line 88:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Trust Documents',`

- **Line 89:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Legal arrangements for managing assets',`

- **Line 121:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Insurance Documents',`

- **Line 122:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Insurance policies and coverage documents',`

- **Line 155:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Property Documents',`

- **Line 156:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Real estate deeds, mortgages, and property records',`

- **Line 188:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Investment Records',`

- **Line 230:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Bank Statements',`

- **Line 231:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Bank account statements and financial records',`

- **Line 264:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Tax Documents',`

- **Line 299:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Medical Records',`

- **Line 300:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Medical records, prescriptions, and health documents',`

- **Line 338:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Identification Documents',`

- **Line 551:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Other Documents',`

- **Line 552:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Uncategorized documents',`

### src/services/api.service.ts

- **Line 76:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error instanceof Error ? error.message : 'An unexpected error occurred'`

- **Line 209:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error instanceof Error ? error.message : 'An unexpected error occurred'`

### src/services/StripeService.ts

- **Line 207:** `Stripe not loaded`
  - **Suggested Key:** `errors.stripeNotLoaded`
  - **Context:** `console.error('Stripe not loaded');`

- **Line 229:** `User not authenticated`
  - **Suggested Key:** `errors.userNotAuthenticated`
  - **Context:** `console.error('User not authenticated');`

- **Line 365:** `message`
  - **Suggested Key:** `success.message`
  - **Context:** `message: `Congratulations! You've successfully upgraded to the ${plan} plan. All premium features are now unlocked!`,`

### src/scripts/generateSampleWills.ts

- **Line 18:** `birthPlace`
  - **Suggested Key:** `common.birthplace`
  - **Context:** `birthPlace: 'Bratislava',`

- **Line 86:** `model`
  - **Suggested Key:** `common.model`
  - **Context:** `model: 'Octavia',`

- **Line 107:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'JUDr. Milan Svoboda',`

- **Line 136:** `city`
  - **Suggested Key:** `common.city`
  - **Context:** `city: 'Bratislava'`

- **Line 141:** `testatorName`
  - **Suggested Key:** `common.testatorname`
  - **Context:** `testatorName: 'Karel Svoboda',`

- **Line 206:** `model`
  - **Suggested Key:** `common.model`
  - **Context:** `model: 'Superb',`

- **Line 245:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Josef Svoboda',`

- **Line 383:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `results.push(`❌ ${combination.label}: Error - ${error instanceof Error ? error.message : 'Unknown error'}`);`

### src/pages/WillManagement.tsx

- **Line 198:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error instanceof Error ? error.message : 'Failed to generate PDF',`

### src/pages/Vault.tsx

- **Line 89:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Birth Certificate.pdf',`

- **Line 90:** `category`
  - **Suggested Key:** `common.category`
  - **Context:** `category: 'Personal',`

- **Line 101:** `category`
  - **Suggested Key:** `common.category`
  - **Context:** `category: 'Financial',`

- **Line 112:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Property Deed.pdf',`

- **Line 113:** `category`
  - **Suggested Key:** `common.category`
  - **Context:** `category: 'Property',`

- **Line 135:** `category`
  - **Suggested Key:** `common.category`
  - **Context:** `category: 'Health',`

### src/pages/TimeCapsuleView.tsx

- **Line 78:** `user_name`
  - **Suggested Key:** `common.username`
  - **Context:** `user_name: 'Anonymous', // We don't expose user names for privacy`

### src/pages/TimeCapsule.tsx

- **Line 71:** `DELIVERED`
  - **Suggested Key:** `common.delivered`
  - **Context:** `status: (capsule.is_delivered ? 'DELIVERED' : 'PENDING') as 'CANCELLED' | 'DELIVERED' | 'FAILED' | 'PENDING',`

### src/pages/TestNotifications.tsx

- **Line 140:** `Enter email to test`
  - **Suggested Key:** `forms.enterEmailToTest`
  - **Context:** `placeholder='Enter email to test'`

- **Line 151:** `Test Document.pdf`
  - **Suggested Key:** `common.testDocumentpdf`
  - **Context:** `placeholder='Test Document.pdf'`

### src/pages/SecurityDeepDivePage.tsx

- **Line 9:** `Security Deep Dive`
  - **Suggested Key:** `common.securityDeepDive`
  - **Context:** `title='Security Deep Dive'`

### src/pages/ProtocolSettings.tsx

- **Line 265:** `Active`
  - **Suggested Key:** `forms.active`
  - **Context:** `{formData.is_shield_enabled ? 'Active' : 'Inactive'}`

- **Line 458:** `Active`
  - **Suggested Key:** `common.active`
  - **Context:** `{settings.is_shield_enabled ? 'Active' : 'Inactive'}`

### src/pages/MyFamily.tsx

- **Line 62:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Jane Doe',`

- **Line 76:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'John Doe Jr.',`

- **Line 88:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Robert Doe',`

- **Line 99:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Mary Johnson',`

### src/pages/LandingPage.tsx

- **Line 946:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Empathy by Design',`

- **Line 1002:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Effortless Automation',`

- **Line 1037:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'A Living Legacy',`

### src/pages/Guardians.tsx

- **Line 134:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Jane Doe',`

- **Line 137:** `relationship`
  - **Suggested Key:** `common.relationship`
  - **Context:** `relationship: 'Spouse',`

- **Line 151:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'John Smith',`

- **Line 154:** `relationship`
  - **Suggested Key:** `common.relationship`
  - **Context:** `relationship: 'Brother',`

- **Line 155:** `notes`
  - **Suggested Key:** `common.notes`
  - **Context:** `notes: 'Designated guardian for children',`

- **Line 167:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Mary Johnson',`

- **Line 169:** `relationship`
  - **Suggested Key:** `common.relationship`
  - **Context:** `relationship: 'Attorney',`

- **Line 364:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Total Guardians',`

- **Line 372:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Executors',`

- **Line 376:** `changeLabel`
  - **Suggested Key:** `common.changelabel`
  - **Context:** `changeLabel: 'Appointed',`

- **Line 379:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Child Guardians',`

- **Line 383:** `changeLabel`
  - **Suggested Key:** `common.changelabel`
  - **Context:** `changeLabel: 'Designated',`

- **Line 386:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Emergency Contacts',`

- **Line 446:** `Guardian`
  - **Suggested Key:** `common.guardian`
  - **Context:** `{editingGuardian ? 'Edit Guardian' : 'Add New Guardian'}`

### src/pages/ComponentShowcase.tsx

- **Line 89:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Jane Doe',`

- **Line 100:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'John Smith',`

- **Line 110:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Mary Johnson',`

- **Line 226:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Sample User',`

### src/pages/BlogArticle.tsx

- **Line 25:** `author`
  - **Suggested Key:** `common.author`
  - **Context:** `author: 'LegacyGuard Legal Team',`

### src/pages/Blog.tsx

- **Line 21:** `category`
  - **Suggested Key:** `common.category`
  - **Context:** `category: 'Estate Planning',`

- **Line 24:** `author`
  - **Suggested Key:** `common.author`
  - **Context:** `author: 'LegacyGuard Legal Team',`

- **Line 34:** `category`
  - **Suggested Key:** `common.category`
  - **Context:** `category: 'Family Security',`

- **Line 36:** `publishDate`
  - **Suggested Key:** `common.publishdate`
  - **Context:** `publishDate: 'Coming Soon',`

- **Line 37:** `author`
  - **Suggested Key:** `common.author`
  - **Context:** `author: 'LegacyGuard Security Team',`

- **Line 43:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Digital Legacy Planning in the Modern Age',`

- **Line 47:** `category`
  - **Suggested Key:** `common.category`
  - **Context:** `category: 'Digital Assets',`

- **Line 49:** `publishDate`
  - **Suggested Key:** `common.publishdate`
  - **Context:** `publishDate: 'Coming Soon',`

- **Line 50:** `author`
  - **Suggested Key:** `common.author`
  - **Context:** `author: 'LegacyGuard Digital Team',`

### src/lib/willValidation.ts

- **Line 129:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Full name is required',`

- **Line 139:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Date of birth is required',`

- **Line 159:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Please verify the date of birth is correct',`

- **Line 180:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Citizenship is required',`

- **Line 217:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Spouse name is required if spouse is specified',`

- **Line 269:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'At least one beneficiary must be specified',`

- **Line 401:** `legalReference`
  - **Suggested Key:** `common.legalreference`
  - **Context:** `legalReference: 'Forced heirship provisions',`

- **Line 413:** `legalReference`
  - **Suggested Key:** `common.legalreference`
  - **Context:** `legalReference: 'Protection of minor heirs',`

- **Line 512:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'At least one primary executor must be appointed',`

- **Line 578:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Guardians must be appointed for minor children',`

- **Line 580:** `legalReference`
  - **Suggested Key:** `common.legalreference`
  - **Context:** `legalReference: 'Guardian appointment for minors',`

- **Line 636:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Ensure you are of sound mind when signing the will',`

- **Line 638:** `legalReference`
  - **Suggested Key:** `common.legalreference`
  - **Context:** `legalReference: 'Mental capacity requirement',`

- **Line 648:** `legalReference`
  - **Suggested Key:** `common.legalreference`
  - **Context:** `legalReference: 'Witness requirements',`

### src/lib/will-template-library.ts

- **Line 129:** `jurisdiction`
  - **Suggested Key:** `common.jurisdiction`
  - **Context:** `jurisdiction: 'Slovakia',`

- **Line 170:** `jurisdiction`
  - **Suggested Key:** `common.jurisdiction`
  - **Context:** `jurisdiction: 'Slovakia',`

- **Line 206:** `jurisdiction`
  - **Suggested Key:** `common.jurisdiction`
  - **Context:** `jurisdiction: 'Slovakia',`

- **Line 272:** `jurisdiction`
  - **Suggested Key:** `common.jurisdiction`
  - **Context:** `jurisdiction: 'Slovakia',`

- **Line 318:** `jurisdiction`
  - **Suggested Key:** `common.jurisdiction`
  - **Context:** `jurisdiction: 'Slovakia',`

- **Line 381:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Thank you for embracing our blended family',`

- **Line 386:** `jurisdiction`
  - **Suggested Key:** `common.jurisdiction`
  - **Context:** `jurisdiction: 'Slovakia',`

- **Line 431:** `jurisdiction`
  - **Suggested Key:** `common.jurisdiction`
  - **Context:** `jurisdiction: 'Slovakia',`

- **Line 491:** `jurisdiction`
  - **Suggested Key:** `common.jurisdiction`
  - **Context:** `jurisdiction: 'Slovakia',`

- **Line 537:** `jurisdiction`
  - **Suggested Key:** `common.jurisdiction`
  - **Context:** `jurisdiction: 'Slovakia',`

- **Line 604:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Education fund to help achieve your dreams',`

- **Line 609:** `jurisdiction`
  - **Suggested Key:** `common.jurisdiction`
  - **Context:** `jurisdiction: 'Slovakia',`

- **Line 895:** `description`
  - **Suggested Key:** `success.description`
  - **Context:** `description: 'Add business succession planning',`

- **Line 912:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Add comprehensive guardianship provisions',`

- **Line 913:** `rationale`
  - **Suggested Key:** `common.rationale`
  - **Context:** `rationale: 'You have minor children who need guardian appointment',`

- **Line 943:** `young_professional`
  - **Suggested Key:** `common.youngprofessional`
  - **Context:** `young_professional: 'For young adults starting their careers',`

- **Line 944:** `new_parent`
  - **Suggested Key:** `common.newparent`
  - **Context:** `new_parent: 'For new parents focusing on child protection',`

- **Line 945:** `established_family`
  - **Suggested Key:** `common.establishedfamily`
  - **Context:** `established_family: 'For families with stable assets and relationships',`

- **Line 946:** `blended_family`
  - **Suggested Key:** `common.blendedfamily`
  - **Context:** `blended_family: 'For families with children from multiple relationships',`

- **Line 947:** `business_owner`
  - **Suggested Key:** `common.businessowner`
  - **Context:** `business_owner: 'For entrepreneurs and business owners',`

- **Line 948:** `retiree`
  - **Suggested Key:** `common.retiree`
  - **Context:** `retiree: 'For retirees focused on legacy and charitable giving',`

- **Line 949:** `single_parent`
  - **Suggested Key:** `common.singleparent`
  - **Context:** `single_parent: 'For single parents with unique challenges',`

- **Line 950:** `childless_couple`
  - **Suggested Key:** `common.childlesscouple`
  - **Context:** `childless_couple: 'For couples without children',`

- **Line 951:** `charitable_focused`
  - **Suggested Key:** `common.charitablefocused`
  - **Context:** `charitable_focused: 'For those prioritizing charitable giving',`

- **Line 952:** `international`
  - **Suggested Key:** `common.international`
  - **Context:** `international: 'For those with international assets or concerns',`

### src/lib/will-legal-validator.ts

- **Line 137:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Beneficiary shares are correctly distributed',`

- **Line 180:** `autoSuggestion`
  - **Suggested Key:** `common.autosuggestion`
  - **Context:** `autoSuggestion: `Increase children's total share to at least ${requiredMinimum}%`,`

- **Line 186:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: "Children's forced heir rights are respected",`

- **Line 202:** `autoSuggestion`
  - **Suggested Key:** `common.autosuggestion`
  - **Context:** `autoSuggestion: `Increase spouse's share to at least ${requiredMinimum}%`,`

- **Line 278:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: `Asset "${asset}" is assigned to multiple recipients: ${recipients.join(', ')}`,`

- **Line 305:** `autoSuggestion`
  - **Suggested Key:** `common.autosuggestion`
  - **Context:** `autoSuggestion: 'Add a trusted person as executor',`

- **Line 324:** `autoSuggestion`
  - **Suggested Key:** `common.autosuggestion`
  - **Context:** `autoSuggestion: 'Add an independent backup executor',`

- **Line 330:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Executor appointment looks good',`

- **Line 367:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'No witnesses required for this will type',`

- **Line 398:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Witness requirements satisfied',`

- **Line 431:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Full name is required',`

- **Line 441:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Date of birth is required',`

- **Line 451:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Address is required',`

- **Line 524:** `autoSuggestion`
  - **Suggested Key:** `common.autosuggestion`
  - **Context:** `autoSuggestion: 'Add a trusted person as executor',`

- **Line 530:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Executor appointed',`

- **Line 563:** `autoSuggestion`
  - **Suggested Key:** `common.autosuggestion`
  - **Context:** `autoSuggestion: 'Verify the date of birth is correct',`

- **Line 586:** `autoSuggestion`
  - **Suggested Key:** `common.autosuggestion`
  - **Context:** `autoSuggestion: 'Add a trusted person as guardian',`

- **Line 593:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Guardianship provisions are complete',`

- **Line 605:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'No special provisions specified',`

### src/lib/validation-messages.ts

- **Line 81:** `uppercase`
  - **Suggested Key:** `forms.uppercase`
  - **Context:** `'forms.auth.password.uppercase': 'Password must contain at least one uppercase letter',`

- **Line 82:** `lowercase`
  - **Suggested Key:** `forms.lowercase`
  - **Context:** `'forms.auth.password.lowercase': 'Password must contain at least one lowercase letter',`

- **Line 83:** `number`
  - **Suggested Key:** `forms.number`
  - **Context:** `'forms.auth.password.number': 'Password must contain at least one number',`

- **Line 84:** `specialChar`
  - **Suggested Key:** `forms.specialchar`
  - **Context:** `'forms.auth.password.specialChar': 'Password must contain at least one special character',`

- **Line 85:** `required`
  - **Suggested Key:** `forms.required`
  - **Context:** `'forms.auth.password.required': 'Password is required',`

- **Line 86:** `confirm`
  - **Suggested Key:** `forms.confirm`
  - **Context:** `'forms.auth.password.confirm': 'Please confirm your password',`

- **Line 87:** `noMatch`
  - **Suggested Key:** `forms.nomatch`
  - **Context:** `'forms.auth.password.noMatch': 'Passwords do not match',`

- **Line 88:** `current`
  - **Suggested Key:** `forms.current`
  - **Context:** `'forms.auth.password.current': 'Current password is required',`

- **Line 89:** `confirmNew`
  - **Suggested Key:** `forms.confirmnew`
  - **Context:** `'forms.auth.password.confirmNew': 'Please confirm your new password',`

- **Line 90:** `mustBeDifferent`
  - **Suggested Key:** `forms.mustbedifferent`
  - **Context:** `'forms.auth.password.mustBeDifferent': 'New password must be different from current password',`

- **Line 91:** `required`
  - **Suggested Key:** `forms.required`
  - **Context:** `'forms.auth.email.required': 'Email is required',`

- **Line 94:** `firstRequired`
  - **Suggested Key:** `forms.firstrequired`
  - **Context:** `'forms.auth.name.firstRequired': 'First name is required',`

- **Line 95:** `lastRequired`
  - **Suggested Key:** `forms.lastrequired`
  - **Context:** `'forms.auth.name.lastRequired': 'Last name is required',`

- **Line 99:** `mustAccept`
  - **Suggested Key:** `forms.mustaccept`
  - **Context:** `'forms.auth.terms.mustAccept': 'You must accept the terms and conditions',`

- **Line 100:** `resetRequired`
  - **Suggested Key:** `forms.resetrequired`
  - **Context:** `'forms.auth.token.resetRequired': 'Reset token is required',`

### src/lib/trust-score.ts

- **Line 37:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Document Completeness',`

- **Line 66:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Professional Review',`

- **Line 83:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Family Protection',`

- **Line 96:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Will Completeness',`

- **Line 99:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Essential will components coverage',`

### src/lib/text-manager.ts

- **Line 244:** `Text key `
  - **Suggested Key:** `common.textKey`
  - **Context:** `console.warn(`Text key "${key}" not found in text manager`);`

### src/lib/templateLibrary.ts

- **Line 85:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Document Header',`

- **Line 93:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Document Footer',`

- **Line 288:** `code`
  - **Suggested Key:** `common.code`
  - **Context:** `code: 'REQUIRED',`

- **Line 328:** `legalReference`
  - **Suggested Key:** `common.legalreference`
  - **Context:** `legalReference: 'Minimum age requirement',`

- **Line 368:** `legalReference`
  - **Suggested Key:** `common.legalreference`
  - **Context:** `legalReference: 'Minimum age for will creation',`

- **Line 410:** `legalReference`
  - **Suggested Key:** `common.legalreference`
  - **Context:** `legalReference: 'Forced heirship provisions',`

### src/lib/supabaseClient.ts

- **Line 13:** `Missing Supabase environment variables`
  - **Suggested Key:** `errors.missingSupabaseEnvironmentVariables`
  - **Context:** `console.error('Missing Supabase environment variables');`

- **Line 163:** `No refresh token available`
  - **Suggested Key:** `common.noRefreshTokenAvailable`
  - **Context:** `console.warn('No refresh token available');`

- **Line 215:** `error`
  - **Suggested Key:** `errors.error`
  - **Context:** `return typeof error.error === 'string' ? error.error : 'An error occurred';`

### src/lib/sofiaAI.ts

- **Line 468:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Appoint an Executor',`

- **Line 488:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Appoint Guardians for Minor Children',`

- **Line 489:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'You have minor children but no appointed guardians.',`

- **Line 490:** `suggestedAction`
  - **Suggested Key:** `common.suggestedaction`
  - **Context:** `suggestedAction: 'Name guardians to care for your minor children.',`

- **Line 520:** `suggestedAction`
  - **Suggested Key:** `common.suggestedaction`
  - **Context:** `suggestedAction: 'Review beneficiary percentages for fairness.',`

- **Line 579:** `optimization`
  - **Suggested Key:** `common.optimization`
  - **Context:** `'content-optimization': 'Optimized will content would be returned here',`

- **Line 581:** `executor`
  - **Suggested Key:** `common.executor`
  - **Context:** `'{"executor": "Person who manages your estate", "beneficiary": "Person who receives inheritance"}',`

- **Line 581:** `beneficiary`
  - **Suggested Key:** `common.beneficiary`
  - **Context:** `'{"executor": "Person who manages your estate", "beneficiary": "Person who receives inheritance"}',`

### src/lib/sofia-types.ts

- **Line 221:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'AI helps create a personal message for your loved ones',`

- **Line 231:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'AI creates a summary of your finances for emergencies',`

### src/lib/sofia-search-dictionary.ts

- **Line 21:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'Show all my document bundles',`

- **Line 27:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'What are document bundles?',`

- **Line 69:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'Show Octavia vehicle documents',`

- **Line 71:** `primaryEntity`
  - **Suggested Key:** `common.primaryentity`
  - **Context:** `payload: { bundleName: 'Vehicle: Octavia', primaryEntity: 'Octavia' },`

- **Line 81:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'Show all insurance policies',`

- **Line 87:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'Help me add new insurance',`

- **Line 97:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'Why are insurance policies important?',`

- **Line 137:** `text`
  - **Suggested Key:** `forms.text`
  - **Context:** `text: 'Show information about creating wills',`

- **Line 143:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'Why do I need a will?',`

- **Line 149:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'Find my legal documents',`

- **Line 185:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'Find my passport',`

- **Line 191:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'How to renew passport?',`

- **Line 197:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'Show all personal documents',`

- **Line 233:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'Show bank statements',`

- **Line 239:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'Add new bank document',`

- **Line 249:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'Show all financial documents',`

- **Line 288:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'Show my guardians',`

- **Line 294:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'What is a guardian?',`

- **Line 300:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'Add new guardian',`

- **Line 335:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'Show medical documents',`

- **Line 341:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'Add medical record',`

- **Line 351:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'Healthcare directives info',`

- **Line 390:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'Show expiring documents',`

- **Line 396:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'How to handle expiring documents?',`

- **Line 424:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'Upload new document',`

- **Line 430:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'How to scan documents?',`

- **Line 569:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: `Show documents related to "${searchQuery}" (${displayName})`,`

- **Line 599:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: `Create smart filter for "${searchQuery}" documents`,`

- **Line 647:** `displayName`
  - **Suggested Key:** `common.displayname`
  - **Context:** `legal: { displayName: 'Legal Documents', icon: 'scale' },`

- **Line 648:** `displayName`
  - **Suggested Key:** `common.displayname`
  - **Context:** `financial: { displayName: 'Financial Records', icon: 'financial' },`

- **Line 649:** `displayName`
  - **Suggested Key:** `common.displayname`
  - **Context:** `medical: { displayName: 'Medical Records', icon: 'heart' },`

- **Line 650:** `displayName`
  - **Suggested Key:** `common.displayname`
  - **Context:** `insurance: { displayName: 'Insurance Policies', icon: 'shield-check' },`

- **Line 651:** `displayName`
  - **Suggested Key:** `common.displayname`
  - **Context:** `personal: { displayName: 'Personal Documents', icon: 'user' },`

- **Line 652:** `displayName`
  - **Suggested Key:** `common.displayname`
  - **Context:** `property: { displayName: 'Property Documents', icon: 'home' },`

- **Line 653:** `displayName`
  - **Suggested Key:** `common.displayname`
  - **Context:** `business: { displayName: 'Business Documents', icon: 'briefcase' },`

- **Line 654:** `displayName`
  - **Suggested Key:** `common.displayname`
  - **Context:** `government: { displayName: 'Government Documents', icon: 'home' },`

- **Line 655:** `displayName`
  - **Suggested Key:** `common.displayname`
  - **Context:** `other: { displayName: 'Other Documents', icon: 'file' },`

- **Line 658:** `displayName`
  - **Suggested Key:** `common.displayname`
  - **Context:** `return categoryMap[category] || { displayName: 'Documents', icon: 'file' };`

### src/lib/sofia-router.ts

- **Line 70:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `message: 'I apologize, an error occurred. Please try again.',`

- **Line 96:** `message`
  - **Suggested Key:** `navigation.message`
  - **Context:** `payload: { message: 'Unknown navigation action.' },`

- **Line 165:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `payload: { message: 'Unknown UI action.' },`

- **Line 235:** `generate_legacy_letter`
  - **Suggested Key:** `common.generatelegacyletter`
  - **Context:** `generate_legacy_letter: `Help me write a personal message for my family. I want to leave words of love and encouragement for my loved ones.`,`

- **Line 236:** `generate_financial_summary`
  - **Suggested Key:** `common.generatefinancialsummary`
  - **Context:** `generate_financial_summary: `Create a summary of my finances and assets that will help my family in need. Include practical steps and important contacts.`,`

- **Line 243:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `payload: { message: 'Unknown premium feature.' },`

- **Line 392:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: `Hmm, I'm not sure how I can help you with that. Try one of these options:`,`

- **Line 408:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Upload your ID, passport, and insurance card',`

- **Line 431:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Secure your family by creating a basic will',`

### src/lib/sofia-proactive.ts

- **Line 209:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'Explain the terms',`

- **Line 239:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `{ text: 'Add a document', action: 'open_upload', icon: 'upload' },`

- **Line 241:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'Learn about categories',`

- **Line 245:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `{ text: 'Continue browsing', action: 'dismiss', icon: 'x' },`

- **Line 269:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `{ text: 'Show me around', action: 'start_tour', icon: 'map' },`

- **Line 271:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'Tell me about security',`

- **Line 275:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `{ text: 'Let me explore', action: 'dismiss', icon: 'x' },`

- **Line 299:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `{ text: 'Save my progress', action: 'save_progress', icon: 'save' },`

- **Line 300:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `{ text: 'Continue working', action: 'dismiss', icon: 'arrow-right' },`

- **Line 373:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'Continue where I left off',`

- **Line 380:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'What should I do next?',`

- **Line 384:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `{ text: 'Just browsing', action: 'dismiss', icon: 'x' }`

### src/lib/sofia-knowledge-base.ts

- **Line 25:** `question`
  - **Suggested Key:** `common.question`
  - **Context:** `question: 'How is my data protected?',`

- **Line 50:** `question`
  - **Suggested Key:** `common.question`
  - **Context:** `question: 'Technical security details',`

- **Line 76:** `question`
  - **Suggested Key:** `common.question`
  - **Context:** `question: 'What are guardians?',`

- **Line 101:** `question`
  - **Suggested Key:** `common.question`
  - **Context:** `question: 'How do I add a guardian?',`

- **Line 119:** `question`
  - **Suggested Key:** `common.question`
  - **Context:** `question: 'What documents should I upload?',`

- **Line 152:** `question`
  - **Suggested Key:** `common.question`
  - **Context:** `question: 'How do I upload documents?',`

- **Line 173:** `question`
  - **Suggested Key:** `common.question`
  - **Context:** `question: 'How is my progress calculated?',`

- **Line 199:** `question`
  - **Suggested Key:** `common.question`
  - **Context:** `question: 'How much does LegacyGuard cost?',`

- **Line 239:** `question`
  - **Suggested Key:** `common.question`
  - **Context:** `question: 'How do I get started?',`

- **Line 273:** `question`
  - **Suggested Key:** `common.question`
  - **Context:** `question: 'What happens in an emergency?',`

### src/lib/sofia-api.ts

- **Line 101:** `error`
  - **Suggested Key:** `errors.error`
  - **Context:** `error: 'Premium features require server configuration.',`

### src/lib/sofia-ai.ts

- **Line 182:** `Falling back to mock response`
  - **Suggested Key:** `common.fallingBackToMockResponse`
  - **Context:** `console.log('Falling back to mock response');`

### src/lib/quick-insights.ts

- **Line 88:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Time Saved for Your Family',`

- **Line 94:** `emotional_message`
  - **Suggested Key:** `common.emotionalmessage`
  - **Context:** `emotional_message: `Instead of hunting through boxes and files, your family will find everything they need in minutes.`,`

- **Line 107:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Family Protection Level',`

- **Line 247:** `members`
  - **Suggested Key:** `common.members`
  - **Context:** `message = `${familyMembers ? `${familyMembers} family members` : 'Your family'} are excellently protected.`;`

- **Line 255:** `members`
  - **Suggested Key:** `common.members`
  - **Context:** `message = `${familyMembers ? `${familyMembers} family members` : 'Your family'} have basic protection - let's build on this foundation.`;`

- **Line 259:** `members`
  - **Suggested Key:** `common.members`
  - **Context:** `message = `${familyMembers ? `${familyMembers} family members` : 'Your family'} need stronger protection - every document helps.`;`

- **Line 282:** `Person`
  - **Suggested Key:** `common.person`
  - **Context:** `title: `${protectedPeople > 0 ? protectedPeople : 'Your'} ${protectedPeople === 1 ? 'Person' : 'People'} Protected`,`

- **Line 295:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'Add family member access',`

- **Line 325:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Strong Insurance Foundation',`

- **Line 341:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Legal Documents Secured',`

- **Line 375:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Complete Your Will',`

- **Line 384:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'Start will creation wizard',`

- **Line 396:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Add Emergency Contact',`

- **Line 402:** `emotional_message`
  - **Suggested Key:** `common.emotionalmessage`
  - **Context:** `emotional_message: 'Ensure someone trusted can help in critical moments.',`

- **Line 404:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'Add emergency contact',`

- **Line 419:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Add Insurance Documents',`

- **Line 422:** `value`
  - **Suggested Key:** `common.value`
  - **Context:** `value: 'High priority',`

- **Line 428:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'Upload insurance documents',`

### src/lib/protection-calculator.ts

- **Line 256:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Insurance Policies',`

- **Line 260:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Financial Accounts',`

- **Line 264:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Legal Documents',`

- **Line 268:** `name`
  - **Suggested Key:** `forms.name`
  - **Context:** `name: 'Medical Information',`

- **Line 272:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Property Documents',`

- **Line 304:** `action`
  - **Suggested Key:** `common.action`
  - **Context:** `action: 'Complete your will',`

- **Line 314:** `action`
  - **Suggested Key:** `common.action`
  - **Context:** `action: 'Add insurance documents',`

- **Line 315:** `impact`
  - **Suggested Key:** `common.impact`
  - **Context:** `impact: 'Major financial protection for family',`

- **Line 324:** `action`
  - **Suggested Key:** `forms.action`
  - **Context:** `action: 'Upload medical information',`

- **Line 325:** `impact`
  - **Suggested Key:** `common.impact`
  - **Context:** `impact: 'Enable faster emergency decisions',`

- **Line 333:** `action`
  - **Suggested Key:** `common.action`
  - **Context:** `action: 'Add emergency contact',`

- **Line 334:** `impact`
  - **Suggested Key:** `common.impact`
  - **Context:** `impact: 'Immediate access in crises',`

### src/lib/professional-trust-integration.ts

- **Line 203:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Partner Attorney',`

- **Line 204:** `firmName`
  - **Suggested Key:** `common.firmname`
  - **Context:** `firmName: 'Brno Legal Partners',`

- **Line 209:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Public Notary',`

- **Line 210:** `firmName`
  - **Suggested Key:** `common.firmname`
  - **Context:** `firmName: 'Notary Office Brno Center',`

- **Line 217:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Professional Legal Review',`

- **Line 218:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Qualified Legal Professional',`

- **Line 219:** `firmName`
  - **Suggested Key:** `common.firmname`
  - **Context:** `firmName: 'Legal Review Network',`

### src/lib/professional-review-network.ts

- **Line 427:** `service`
  - **Suggested Key:** `common.service`
  - **Context:** `service: 'Will Review and Optimization',`

- **Line 441:** `service`
  - **Suggested Key:** `common.service`
  - **Context:** `service: 'Business Succession Planning',`

- **Line 442:** `description`
  - **Suggested Key:** `success.description`
  - **Context:** `description: 'Specialized planning for business assets and succession',`

- **Line 459:** `service`
  - **Suggested Key:** `common.service`
  - **Context:** `service: 'Tax Optimization Strategy',`

- **Line 460:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Minimize estate taxes and optimize inheritance structure',`

- **Line 476:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Partner',`

- **Line 477:** `firm`
  - **Suggested Key:** `common.firm`
  - **Context:** `firm: 'Brno Legal Partners',`

- **Line 489:** `country`
  - **Suggested Key:** `common.country`
  - **Context:** `country: 'Czech Republic',`

- **Line 502:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Public Notary',`

- **Line 503:** `firm`
  - **Suggested Key:** `common.firm`
  - **Context:** `firm: 'Notary Office Brno Center',`

- **Line 519:** `country`
  - **Suggested Key:** `common.country`
  - **Context:** `country: 'Czech Republic',`

- **Line 564:** `service`
  - **Suggested Key:** `common.service`
  - **Context:** `{ service: 'Will Witnessing', price: 80, duration: 30 },`

- **Line 565:** `service`
  - **Suggested Key:** `common.service`
  - **Context:** `{ service: 'Document Certification', price: 50, duration: 15 },`

- **Line 566:** `service`
  - **Suggested Key:** `common.service`
  - **Context:** `{ service: 'Full Notarization', price: 150, duration: 60 },`

- **Line 571:** `service`
  - **Suggested Key:** `common.service`
  - **Context:** `service: 'Inheritance Proceedings',`

- **Line 631:** `category`
  - **Suggested Key:** `common.category`
  - **Context:** `category: 'Legal Compliance',`

- **Line 633:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'No executor appointed',`

- **Line 647:** `category`
  - **Suggested Key:** `common.category`
  - **Context:** `category: 'Clarity',`

- **Line 664:** `category`
  - **Suggested Key:** `common.category`
  - **Context:** `category: 'Legal Compliance',`

### src/lib/path-of-serenity.ts

- **Line 70:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Foundation Stone',`

- **Line 82:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'First Step to Certainty',`

- **Line 97:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Circle of Trust',`

- **Line 109:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Safety Network',`

- **Line 110:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Your family now has someone they can rely on',`

- **Line 123:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Digital Sanctuary',`

- **Line 136:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'You now have a robust collection of protected documents',`

- **Line 146:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Eternal Vigilance',`

- **Line 158:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Never Forget',`

- **Line 159:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Automatic tracking of document expirations',`

- **Line 169:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Organized Legacy',`

- **Line 182:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Systematic Order',`

- **Line 183:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Methodical arrangement of all important documents',`

- **Line 193:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Personal Legacy',`

- **Line 205:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Timeless Gift',`

- **Line 206:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Your values and wisdom for future generations',`

- **Line 220:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Guardian Mastery',`

- **Line 240:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Lay Your Foundation Stone',`

- **Line 254:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Create Your Circle of Trust',`

- **Line 263:** `completionMessage`
  - **Suggested Key:** `common.completionmessage`
  - **Context:** `completionMessage: 'Excellent! Your family now has someone to turn to.',`

- **Line 268:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Organize Your Digital World',`

- **Line 283:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Activate Eternal Vigilance',`

### src/lib/multi-language-generator.ts

- **Line 185:** `will`
  - **Suggested Key:** `common.will`
  - **Context:** `will: 'Testament',`

- **Line 186:** `testator`
  - **Suggested Key:** `common.testator`
  - **Context:** `testator: 'Erblasser',`

- **Line 188:** `inheritance`
  - **Suggested Key:** `common.inheritance`
  - **Context:** `inheritance: 'Erbschaft',`

- **Line 189:** `estate`
  - **Suggested Key:** `common.estate`
  - **Context:** `estate: 'Nachlass',`

- **Line 190:** `executor`
  - **Suggested Key:** `common.executor`
  - **Context:** `executor: 'Testamentsvollstrecker',`

- **Line 192:** `guardian`
  - **Suggested Key:** `common.guardian`
  - **Context:** `guardian: 'Vormund',`

- **Line 195:** `property`
  - **Suggested Key:** `common.property`
  - **Context:** `property: 'Eigentum',`

- **Line 196:** `share`
  - **Suggested Key:** `common.share`
  - **Context:** `share: 'Anteil',`

- **Line 197:** `percentage`
  - **Suggested Key:** `common.percentage`
  - **Context:** `percentage: 'Prozent',`

- **Line 199:** `signature`
  - **Suggested Key:** `common.signature`
  - **Context:** `signature: 'Unterschrift',`

- **Line 204:** `forced_heirs`
  - **Suggested Key:** `common.forcedheirs`
  - **Context:** `forced_heirs: 'Pflichtteilsberechtigte',`

- **Line 205:** `reserved_portion`
  - **Suggested Key:** `common.reservedportion`
  - **Context:** `reserved_portion: 'Pflichtteil',`

- **Line 211:** `spouse`
  - **Suggested Key:** `common.spouse`
  - **Context:** `spouse: 'Ehegatte',`

- **Line 212:** `husband`
  - **Suggested Key:** `common.husband`
  - **Context:** `husband: 'Ehemann',`

- **Line 213:** `wife`
  - **Suggested Key:** `common.wife`
  - **Context:** `wife: 'Ehefrau',`

- **Line 216:** `daughter`
  - **Suggested Key:** `common.daughter`
  - **Context:** `daughter: 'Tochter',`

- **Line 217:** `parent`
  - **Suggested Key:** `common.parent`
  - **Context:** `parent: 'Elternteil',`

- **Line 219:** `mother`
  - **Suggested Key:** `common.mother`
  - **Context:** `mother: 'Mutter',`

- **Line 220:** `sibling`
  - **Suggested Key:** `common.sibling`
  - **Context:** `sibling: 'Geschwister',`

- **Line 221:** `brother`
  - **Suggested Key:** `common.brother`
  - **Context:** `brother: 'Bruder',`

- **Line 222:** `sister`
  - **Suggested Key:** `common.sister`
  - **Context:** `sister: 'Schwester',`

- **Line 224:** `grandchild`
  - **Suggested Key:** `common.grandchild`
  - **Context:** `grandchild: 'Enkelkind',`

- **Line 225:** `friend`
  - **Suggested Key:** `common.friend`
  - **Context:** `friend: 'Freund',`

- **Line 226:** `partner`
  - **Suggested Key:** `common.partner`
  - **Context:** `partner: 'Partner',`

### src/lib/milestone-system.ts

- **Line 161:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'First Stone Placed!',`

- **Line 190:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Family Circle Started',`

- **Line 216:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Protection Foundation Built',`

- **Line 243:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Will Wisdom Achieved',`

- **Line 272:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Premium Protection Achieved',`

- **Line 279:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Your family is now protected at the highest level possible',`

- **Line 304:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Your trust score shows your family is well protected',`

- **Line 321:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'One Month of Protection',`

- **Line 347:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Comprehensive Guardian',`

- **Line 464:** `milestone`
  - **Suggested Key:** `common.milestone`
  - **Context:** `milestone: 'First Document',`

- **Line 465:** `suggestion`
  - **Suggested Key:** `common.suggestion`
  - **Context:** `suggestion: 'Upload your first important document',`

- **Line 467:** `impact`
  - **Suggested Key:** `common.impact`
  - **Context:** `impact: "Start your family's protection journey",`

- **Line 477:** `milestone`
  - **Suggested Key:** `common.milestone`
  - **Context:** `milestone: 'Family Circle',`

- **Line 478:** `suggestion`
  - **Suggested Key:** `common.suggestion`
  - **Context:** `suggestion: 'Add your first emergency contact',`

- **Line 480:** `impact`
  - **Suggested Key:** `common.impact`
  - **Context:** `impact: 'Give someone access to help your family immediately',`

- **Line 489:** `milestone`
  - **Suggested Key:** `common.milestone`
  - **Context:** `milestone: 'Will Completion',`

- **Line 490:** `suggestion`
  - **Suggested Key:** `common.suggestion`
  - **Context:** `suggestion: 'Complete your will',`

- **Line 492:** `impact`
  - **Suggested Key:** `common.impact`
  - **Context:** `impact: 'Give your family absolute clarity about your wishes',`

- **Line 501:** `milestone`
  - **Suggested Key:** `common.milestone`
  - **Context:** `milestone: 'Protection Foundation',`

### src/lib/family-impact-generator.ts

- **Line 59:** `members`
  - **Suggested Key:** `common.members`
  - **Context:** `family_context: `${familySize > 0 ? `${familySize} family members` : 'Your loved ones'} are now one step safer`,`

- **Line 116:** `primary_message`
  - **Suggested Key:** `common.primarymessage`
  - **Context:** `primary_message: "Your family's financial fortress just got stronger",`

- **Line 141:** `primary_message`
  - **Suggested Key:** `common.primarymessage`
  - **Context:** `primary_message: 'Every step you take makes your family more secure',`

### src/lib/encryption-v2.ts

- **Line 112:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error: error instanceof Error ? error.message : 'Unknown error',`

- **Line 126:** `error`
  - **Suggested Key:** `errors.error`
  - **Context:** `return { success: false, error: 'No keys found' };`

- **Line 132:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error: error instanceof Error ? error.message : 'Unknown error',`

- **Line 140:** `Keys locked`
  - **Suggested Key:** `common.keysLocked`
  - **Context:** `console.log('Keys locked');`

- **Line 160:** `error`
  - **Suggested Key:** `errors.error`
  - **Context:** `return { success: false, error: 'No legacy keys found' };`

- **Line 164:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error: error instanceof Error ? error.message : 'Unknown error',`

- **Line 189:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error: error instanceof Error ? error.message : 'Unknown error',`

### src/hooks/useWillValidation.ts

- **Line 185:** `revocation`
  - **Suggested Key:** `common.revocation`
  - **Context:** `revocation: 'Previous wills must be explicitly revoked.',`

- **Line 195:** `revocation`
  - **Suggested Key:** `common.revocation`
  - **Context:** `revocation: 'Previous wills should be explicitly revoked.',`

- **Line 200:** `forcedHeirs`
  - **Suggested Key:** `common.forcedheirs`
  - **Context:** `forcedHeirs: 'Check local laws regarding protected family members.',`

- **Line 201:** `witnesses`
  - **Suggested Key:** `common.witnesses`
  - **Context:** `witnesses: 'Witness requirements vary by jurisdiction.',`

- **Line 202:** `revocation`
  - **Suggested Key:** `common.revocation`
  - **Context:** `revocation: 'Previous wills should typically be revoked.',`

### src/hooks/useSecureEncryption.ts

- **Line 56:** `error`
  - **Suggested Key:** `errors.error`
  - **Context:** `setState(prev => ({ ...prev, error: 'User not authenticated' }));`

- **Line 97:** `error`
  - **Suggested Key:** `errors.error`
  - **Context:** `error: 'Encryption system not initialized',`

- **Line 145:** `error`
  - **Suggested Key:** `errors.error`
  - **Context:** `error: 'Encryption system not initialized',`

- **Line 225:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error instanceof SecureKeyError ? error.message : 'Encryption failed';`

- **Line 251:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error instanceof SecureKeyError ? error.message : 'Decryption failed';`

- **Line 363:** `error`
  - **Suggested Key:** `errors.error`
  - **Context:** `error: 'Encryption system not initialized',`

### src/hooks/useGardenProgress.ts

- **Line 290:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `err instanceof Error ? err.message : 'Failed to calculate progress'`

### src/hooks/useEncryption.ts

- **Line 148:** `Encryption key not available`
  - **Suggested Key:** `errors.encryptionKeyNotAvailable`
  - **Context:** `console.error('Encryption key not available');`

- **Line 188:** `Encryption key not available`
  - **Suggested Key:** `errors.encryptionKeyNotAvailable`
  - **Context:** `console.error('Encryption key not available');`

- **Line 221:** `Encryption key not available`
  - **Suggested Key:** `errors.encryptionKeyNotAvailable`
  - **Context:** `console.error('Encryption key not available');`

### src/contexts/LocalizationContext.tsx

- **Line 41:** `jurisdiction`
  - **Suggested Key:** `common.jurisdiction`
  - **Context:** `jurisdiction: 'Slovakia',`

- **Line 48:** `jurisdiction`
  - **Suggested Key:** `common.jurisdiction`
  - **Context:** `jurisdiction: 'Czech Republic',`

- **Line 121:** `Geolocation detection failed, using default`
  - **Suggested Key:** `errors.geolocationDetectionFailedUsingDefault`
  - **Context:** `console.log('Geolocation detection failed, using default');`

- **Line 177:** `Slovakia`
  - **Suggested Key:** `common.slovakia`
  - **Context:** `jurisdiction: code === 'SK' ? 'Slovakia' : 'Czech Republic',`

- **Line 196:** `Slovakia`
  - **Suggested Key:** `common.slovakia`
  - **Context:** `jurisdiction: savedJurisdiction === 'SK' ? 'Slovakia' : 'Czech Republic',`

### src/components/PricingPlans.tsx

- **Line 211:** `Failed to load pricing plans`
  - **Suggested Key:** `errors.failedToLoadPricingPlans`
  - **Context:** `console.error('Failed to load pricing plans');`

- **Line 218:** `Please sign in to subscribe`
  - **Suggested Key:** `errors.pleaseSignInToSubscribe`
  - **Context:** `console.error('Please sign in to subscribe');`

- **Line 258:** `Failed to start checkout process`
  - **Suggested Key:** `errors.failedToStartCheckoutProcess`
  - **Context:** `console.error('Failed to start checkout process');`

### src/pages/test-ocr/TestOCRPage.tsx

- **Line 99:** `contract`
  - **Suggested Key:** `common.contract`
  - **Context:** `contract: 'Contract',`

- **Line 100:** `receipt`
  - **Suggested Key:** `common.receipt`
  - **Context:** `receipt: 'Receipt',`

- **Line 103:** `power_of_attorney`
  - **Suggested Key:** `common.powerofattorney`
  - **Context:** `power_of_attorney: 'Power of Attorney',`

- **Line 104:** `living_will`
  - **Suggested Key:** `common.livingwill`
  - **Context:** `living_will: 'Living Will',`

- **Line 105:** `divorce_decree`
  - **Suggested Key:** `common.divorcedecree`
  - **Context:** `divorce_decree: 'Divorce Decree',`

- **Line 106:** `adoption_papers`
  - **Suggested Key:** `common.adoptionpapers`
  - **Context:** `adoption_papers: 'Adoption Papers',`

- **Line 107:** `investment_account`
  - **Suggested Key:** `common.investmentaccount`
  - **Context:** `investment_account: 'Investment Account',`

- **Line 108:** `retirement_account`
  - **Suggested Key:** `common.retirementaccount`
  - **Context:** `retirement_account: 'Retirement Account',`

- **Line 109:** `tax_return`
  - **Suggested Key:** `common.taxreturn`
  - **Context:** `tax_return: 'Tax Return',`

- **Line 110:** `loan_document`
  - **Suggested Key:** `common.loandocument`
  - **Context:** `loan_document: 'Loan Document',`

- **Line 111:** `mortgage`
  - **Suggested Key:** `common.mortgage`
  - **Context:** `mortgage: 'Mortgage',`

- **Line 112:** `credit_card_statement`
  - **Suggested Key:** `common.creditcardstatement`
  - **Context:** `credit_card_statement: 'Credit Card Statement',`

- **Line 113:** `financial_statement`
  - **Suggested Key:** `common.financialstatement`
  - **Context:** `financial_statement: 'Financial Statement',`

- **Line 114:** `prescription`
  - **Suggested Key:** `common.prescription`
  - **Context:** `prescription: 'Prescription',`

- **Line 115:** `medical_directive`
  - **Suggested Key:** `common.medicaldirective`
  - **Context:** `medical_directive: 'Medical Directive',`

- **Line 116:** `health_insurance_card`
  - **Suggested Key:** `common.healthinsurancecard`
  - **Context:** `health_insurance_card: 'Health Insurance Card',`

- **Line 117:** `vaccination_record`
  - **Suggested Key:** `common.vaccinationrecord`
  - **Context:** `vaccination_record: 'Vaccination Record',`

- **Line 118:** `health_insurance`
  - **Suggested Key:** `common.healthinsurance`
  - **Context:** `health_insurance: 'Health Insurance',`

- **Line 119:** `auto_insurance`
  - **Suggested Key:** `common.autoinsurance`
  - **Context:** `auto_insurance: 'Auto Insurance',`

- **Line 120:** `home_insurance`
  - **Suggested Key:** `navigation.homeinsurance`
  - **Context:** `home_insurance: 'Home Insurance',`

- **Line 121:** `disability_insurance`
  - **Suggested Key:** `common.disabilityinsurance`
  - **Context:** `disability_insurance: 'Disability Insurance',`

- **Line 122:** `social_security_card`
  - **Suggested Key:** `common.socialsecuritycard`
  - **Context:** `social_security_card: 'Social Security Card',`

- **Line 123:** `military_records`
  - **Suggested Key:** `common.militaryrecords`
  - **Context:** `military_records: 'Military Records',`

- **Line 124:** `property_tax`
  - **Suggested Key:** `common.propertytax`
  - **Context:** `property_tax: 'Property Tax',`

- **Line 125:** `home_appraisal`
  - **Suggested Key:** `navigation.homeappraisal`
  - **Context:** `home_appraisal: 'Home Appraisal',`

- **Line 126:** `utility_bill`
  - **Suggested Key:** `common.utilitybill`
  - **Context:** `utility_bill: 'Utility Bill',`

- **Line 127:** `business_license`
  - **Suggested Key:** `common.businesslicense`
  - **Context:** `business_license: 'Business License',`

- **Line 128:** `business_contract`
  - **Suggested Key:** `common.businesscontract`
  - **Context:** `business_contract: 'Business Contract',`

- **Line 129:** `business_tax`
  - **Suggested Key:** `common.businesstax`
  - **Context:** `business_tax: 'Business Tax',`

- **Line 130:** `government_benefit`
  - **Suggested Key:** `common.governmentbenefit`
  - **Context:** `government_benefit: 'Government Benefit',`

- **Line 131:** `voter_registration`
  - **Suggested Key:** `common.voterregistration`
  - **Context:** `voter_registration: 'Voter Registration',`

- **Line 132:** `warranty`
  - **Suggested Key:** `common.warranty`
  - **Context:** `warranty: 'Warranty',`

- **Line 133:** `manual`
  - **Suggested Key:** `common.manual`
  - **Context:** `manual: 'Manual',`

- **Line 134:** `correspondence`
  - **Suggested Key:** `common.correspondence`
  - **Context:** `correspondence: 'Correspondence',`

- **Line 180:** `Document preview`
  - **Suggested Key:** `common.documentPreview`
  - **Context:** `alt='Document preview'`

### src/lib/types/event-type-mapping.ts

- **Line 52:** `customLabel`
  - **Suggested Key:** `common.customlabel`
  - **Context:** `customLabel: 'Birthday',`

- **Line 62:** `customLabel`
  - **Suggested Key:** `common.customlabel`
  - **Context:** `customLabel: 'Anniversary',`

- **Line 70:** `icon`
  - **Suggested Key:** `common.icon`
  - **Context:** `icon: 'AlertTriangle',`

- **Line 72:** `customLabel`
  - **Suggested Key:** `common.customlabel`
  - **Context:** `customLabel: 'Document Expiry',`

- **Line 82:** `customLabel`
  - **Suggested Key:** `common.customlabel`
  - **Context:** `customLabel: 'Appointment',`

- **Line 92:** `customLabel`
  - **Suggested Key:** `common.customlabel`
  - **Context:** `customLabel: 'Milestone',`

- **Line 100:** `icon`
  - **Suggested Key:** `common.icon`
  - **Context:** `icon: 'CalendarIcon',`

- **Line 102:** `customLabel`
  - **Suggested Key:** `common.customlabel`
  - **Context:** `customLabel: 'Custom Event',`

### src/lib/trust-score/trust-score-calculator.ts

- **Line 140:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Document security and organization',`

- **Line 208:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Emergency access and guardian assignments',`

- **Line 243:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Family collaboration and communication',`

- **Line 268:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Account security and authentication',`

- **Line 304:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Ongoing engagement and account maturity',`

- **Line 317:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `{ score: 25, description: 'Basic Protection Established', key: 'basic' },`

- **Line 323:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `{ score: 75, description: 'Advanced Protection Active', key: 'advanced' },`

- **Line 326:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Exceptional Family Security',`

- **Line 331:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Maximum Protection Achieved',`

- **Line 411:** `area`
  - **Suggested Key:** `common.area`
  - **Context:** `area: 'Essential Documents Missing',`

- **Line 413:** `description`
  - **Suggested Key:** `forms.description`
  - **Context:** `description: 'Your family lacks access to critical information',`

- **Line 427:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Documents may not meet legal requirements',`

- **Line 439:** `area`
  - **Suggested Key:** `common.area`
  - **Context:** `area: 'Emergency Access Gap',`

- **Line 441:** `description`
  - **Suggested Key:** `forms.description`
  - **Context:** `description: 'No one can access your information in emergency',`

- **Line 453:** `area`
  - **Suggested Key:** `common.area`
  - **Context:** `area: 'Account Security Risk',`

- **Line 467:** `area`
  - **Suggested Key:** `forms.area`
  - **Context:** `area: 'Outdated Information Risk',`

- **Line 469:** `description`
  - **Suggested Key:** `forms.description`
  - **Context:** `description: 'Information may become stale without regular updates',`

### src/lib/social/emergencyAccess.ts

- **Line 202:** `Emergency access service initialized`
  - **Suggested Key:** `common.emergencyAccessServiceInitialized`
  - **Context:** `console.log('Emergency access service initialized');`

### src/lib/social/collaborationService.ts

- **Line 174:** `Collaboration service initialized`
  - **Suggested Key:** `common.collaborationServiceInitialized`
  - **Context:** `console.log('Collaboration service initialized');`

- **Line 245:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Family group created',`

- **Line 290:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Family collaboration space',`

- **Line 720:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Member removed from family',`

- **Line 790:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Family settings updated',`

- **Line 938:** `event`
  - **Suggested Key:** `common.event`
  - **Context:** `event: 'INSERT',`

### src/lib/security/threat-detection.ts

- **Line 120:** `reason`
  - **Suggested Key:** `common.reason`
  - **Context:** `details: { reason: 'Blocked IP address', ip: request.ip },`

### src/lib/security/rate-limiter.ts

- **Line 244:** `error`
  - **Suggested Key:** `errors.error`
  - **Context:** `error: 'Too Many Requests',`

- **Line 245:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Rate limit exceeded. Please try again later.',`

### src/lib/security/encryption.ts

- **Line 238:** `Starting key rotation...`
  - **Suggested Key:** `common.startingKeyRotation`
  - **Context:** `console.log('Starting key rotation...');`

- **Line 241:** `Key rotation completed`
  - **Suggested Key:** `success.keyRotationCompleted`
  - **Context:** `console.log('Key rotation completed');`

### src/lib/security/advancedSharingControls.ts

- **Line 215:** `reason`
  - **Suggested Key:** `common.reason`
  - **Context:** `return { allowed: false, reason: 'Share link has expired' };`

- **Line 223:** `reason`
  - **Suggested Key:** `common.reason`
  - **Context:** `return { allowed: false, reason: 'Maximum view count exceeded' };`

- **Line 326:** `reason`
  - **Suggested Key:** `common.reason`
  - **Context:** `return { allowed: false, reason: 'Share link not found' };`

- **Line 402:** `reason`
  - **Suggested Key:** `common.reason`
  - **Context:** `return { allowed: false, reason: 'GPS accuracy insufficient' };`

- **Line 412:** `reason`
  - **Suggested Key:** `common.reason`
  - **Context:** `return { allowed: false, reason: 'Location not in allowed region' };`

- **Line 423:** `reason`
  - **Suggested Key:** `common.reason`
  - **Context:** `return { allowed: false, reason: 'Location in restricted region' };`

- **Line 575:** `reason`
  - **Suggested Key:** `common.reason`
  - **Context:** `return { allowed: false, reason: 'IP address not whitelisted' };`

### src/lib/schemas/document.schema.ts

- **Line 40:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `errorMap: () => ({ message: 'Please select a category' }),`

- **Line 49:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `.instanceof(File, { message: 'Please select a file' })`

- **Line 83:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `errorMap: () => ({ message: 'Please select a category' }),`

- **Line 135:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Date from must be before date to',`

### src/lib/realtime/professionalReviewUpdates.ts

- **Line 223:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Review Status Updated',`

- **Line 245:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Review Completed',`

- **Line 360:** `Notifications table not available, skipping storage`
  - **Suggested Key:** `common.notificationsTableNotAvailableSkippingStorage`
  - **Context:** `console.warn('Notifications table not available, skipping storage');`

### src/lib/pwa/pwaService.ts

- **Line 86:** `PWA Service initialized successfully`
  - **Suggested Key:** `success.pwaServiceInitializedSuccessfully`
  - **Context:** `console.log('PWA Service initialized successfully');`

- **Line 100:** `Service Worker not supported`
  - **Suggested Key:** `common.serviceWorkerNotSupported`
  - **Context:** `console.warn('Service Worker not supported');`

- **Line 112:** `Service Worker registered successfully`
  - **Suggested Key:** `success.serviceWorkerRegisteredSuccessfully`
  - **Context:** `console.log('Service Worker registered successfully');`

- **Line 148:** `PWA install prompt available`
  - **Suggested Key:** `common.pwaInstallPromptAvailable`
  - **Context:** `console.log('PWA install prompt available');`

- **Line 154:** `PWA installed successfully`
  - **Suggested Key:** `success.pwaInstalledSuccessfully`
  - **Context:** `console.log('PWA installed successfully');`

- **Line 164:** `Application back online`
  - **Suggested Key:** `common.applicationBackOnline`
  - **Context:** `console.log('Application back online');`

- **Line 169:** `Application offline`
  - **Suggested Key:** `common.applicationOffline`
  - **Context:** `console.log('Application offline');`

- **Line 192:** `Push notifications not supported`
  - **Suggested Key:** `common.pushNotificationsNotSupported`
  - **Context:** `console.warn('Push notifications not supported');`

- **Line 202:** `Existing push subscription found`
  - **Suggested Key:** `common.existingPushSubscriptionFound`
  - **Context:** `console.log('Existing push subscription found');`

- **Line 238:** `body`
  - **Suggested Key:** `common.body`
  - **Context:** `body: 'A new version of LegacyGuard is available. Refresh to update.',`

- **Line 259:** `hasNotifications`
  - **Suggested Key:** `common.hasnotifications`
  - **Context:** `hasNotifications: 'Notification' in window,`

- **Line 391:** `Push subscription sent to server`
  - **Suggested Key:** `common.pushSubscriptionSentToServer`
  - **Context:** `console.log('Push subscription sent to server');`

- **Line 415:** `Unsubscribed from push notifications`
  - **Suggested Key:** `common.unsubscribedFromPushNotifications`
  - **Context:** `console.log('Unsubscribed from push notifications');`

### src/lib/pwa/pushNotifications.ts

- **Line 107:** `Push notification service initialized`
  - **Suggested Key:** `common.pushNotificationServiceInitialized`
  - **Context:** `console.log('Push notification service initialized');`

- **Line 130:** `Notification permission denied`
  - **Suggested Key:** `common.notificationPermissionDenied`
  - **Context:** `console.log('Notification permission denied');`

- **Line 169:** `Successfully subscribed to push notifications`
  - **Suggested Key:** `success.successfullySubscribedToPushNotifications`
  - **Context:** `console.log('Successfully subscribed to push notifications');`

- **Line 191:** `Successfully unsubscribed from push notifications`
  - **Suggested Key:** `success.successfullyUnsubscribedFromPushNotifications`
  - **Context:** `console.log('Successfully unsubscribed from push notifications');`

- **Line 208:** `Notification permission not granted`
  - **Suggested Key:** `common.notificationPermissionNotGranted`
  - **Context:** `console.warn('Notification permission not granted');`

- **Line 214:** `Notifications disabled by user`
  - **Suggested Key:** `common.notificationsDisabledByUser`
  - **Context:** `console.log('Notifications disabled by user');`

- **Line 220:** `Notification blocked by quiet hours`
  - **Suggested Key:** `common.notificationBlockedByQuietHours`
  - **Context:** `console.log('Notification blocked by quiet hours');`

- **Line 293:** `Notification preferences updated`
  - **Suggested Key:** `common.notificationPreferencesUpdated`
  - **Context:** `console.log('Notification preferences updated');`

- **Line 407:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Document Uploaded',`

- **Line 408:** `body`
  - **Suggested Key:** `success.body`
  - **Context:** `body: 'Your document has been successfully uploaded and encrypted.',`

- **Line 411:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `{ action: 'view', title: 'View Document' },`

- **Line 412:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `{ action: 'dismiss', title: 'Dismiss' },`

- **Line 417:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Document Expiring Soon',`

- **Line 422:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `{ action: 'review', title: 'Review' },`

- **Line 423:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `{ action: 'extend', title: 'Extend' },`

- **Line 428:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Security Alert',`

- **Line 429:** `body`
  - **Suggested Key:** `common.body`
  - **Context:** `body: 'Unusual activity detected on your account.',`

- **Line 434:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `{ action: 'review', title: 'Review Activity' },`

- **Line 435:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `{ action: 'secure', title: 'Secure Account' },`

- **Line 440:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Family Access Request',`

- **Line 441:** `body`
  - **Suggested Key:** `common.body`
  - **Context:** `body: 'A family member has requested access to your emergency documents.',`

- **Line 445:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `{ action: 'approve', title: 'Approve' },`

- **Line 451:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'System Update Available',`

- **Line 452:** `body`
  - **Suggested Key:** `common.body`
  - **Context:** `body: 'A new version of LegacyGuard is available with security improvements.',`

- **Line 455:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `{ action: 'update', title: 'Update Now' },`

- **Line 461:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Backup Completed',`

- **Line 462:** `body`
  - **Suggested Key:** `success.body`
  - **Context:** `body: 'Your documents have been successfully backed up.',`

- **Line 467:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Document Shared',`

- **Line 468:** `body`
  - **Suggested Key:** `common.body`
  - **Context:** `body: 'A family member has shared a document with you.',`

- **Line 471:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `{ action: 'view', title: 'View Document' },`

- **Line 472:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `{ action: 'dismiss', title: 'Dismiss' },`

- **Line 477:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Scheduled Maintenance',`

- **Line 531:** `Found existing push subscription`
  - **Suggested Key:** `common.foundExistingPushSubscription`
  - **Context:** `console.log('Found existing push subscription');`

- **Line 609:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Test Notification',`

- **Line 610:** `body`
  - **Suggested Key:** `common.body`
  - **Context:** `body: 'This is a test notification from LegacyGuard',`

### src/lib/pwa/offlineStorage.ts

- **Line 75:** `IndexedDB initialized successfully`
  - **Suggested Key:** `success.indexeddbInitializedSuccessfully`
  - **Context:** `console.log('IndexedDB initialized successfully');`

- **Line 650:** `All offline data cleared`
  - **Suggested Key:** `common.allOfflineDataCleared`
  - **Context:** `console.log('All offline data cleared');`

### src/lib/professional/email-notification-service.ts

- **Line 339:** `Your Professional Review Request Has Been Submitted`
  - **Suggested Key:** `common.yourProfessionalReviewRequestHasBeenSubmitted`
  - **Context:** `const subject = `Your Professional Review Request Has Been Submitted`;`

- **Line 737:** `Reminder`
  - **Suggested Key:** `common.reminder`
  - **Context:** `${daysOverdue > 0 ? 'Overdue Review Reminder' : 'Review Reminder'} - ${documentName}`

### src/lib/monitoring/healthCheck.ts

- **Line 222:** `message`
  - **Suggested Key:** `success.message`
  - **Context:** `message: 'Database connection successful',`

- **Line 229:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `message: `Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,`

- **Line 257:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Local storage is functional',`

- **Line 264:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `message: `Local storage check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,`

- **Line 316:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Memory monitoring not supported in this browser',`

- **Line 324:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `message: `Memory check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,`

- **Line 381:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `message: `Network check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,`

### src/lib/monitoring/analytics.ts

- **Line 38:** `Analytics disabled in development`
  - **Suggested Key:** `common.analyticsDisabledInDevelopment`
  - **Context:** `console.log('Analytics disabled in development');`

- **Line 71:** `event_category`
  - **Suggested Key:** `common.eventcategory`
  - **Context:** `event_category: 'Web Vitals',`

### src/lib/i18n/legal-terminology.ts

- **Line 53:** `term`
  - **Suggested Key:** `common.term`
  - **Context:** `term: 'Testament',`

- **Line 59:** `definition`
  - **Suggested Key:** `common.definition`
  - **Context:** `definition: 'Acte par lequel une personne dispose de ses biens',`

- **Line 85:** `term`
  - **Suggested Key:** `common.term`
  - **Context:** `term: 'Vollmacht',`

- **Line 143:** `term`
  - **Suggested Key:** `common.term`
  - **Context:** `term: 'Erbschaftsteuer',`

- **Line 145:** `legalReference`
  - **Suggested Key:** `common.legalreference`
  - **Context:** `legalReference: 'ErbStG',`

- **Line 205:** `term`
  - **Suggested Key:** `common.term`
  - **Context:** `term: 'Erblasser',`

- **Line 210:** `definition`
  - **Suggested Key:** `common.definition`
  - **Context:** `definition: 'Personne qui fait un testament',`

- **Line 231:** `term`
  - **Suggested Key:** `common.term`
  - **Context:** `term: 'Testamentsvollstrecker',`

- **Line 267:** `definition`
  - **Suggested Key:** `common.definition`
  - **Context:** `definition: 'Officier public',`

- **Line 273:** `legalReference`
  - **Suggested Key:** `common.legalreference`
  - **Context:** `legalReference: 'Prawo o notariacie',`

- **Line 291:** `definition`
  - **Suggested Key:** `common.definition`
  - **Context:** `definition: 'Vom Notar errichtete Urkunde',`

- **Line 318:** `term`
  - **Suggested Key:** `common.term`
  - **Context:** `term: 'Vormund',`

- **Line 319:** `definition`
  - **Suggested Key:** `common.definition`
  - **Context:** `definition: 'Gesetzlicher Vertreter',`

- **Line 327:** `definition`
  - **Suggested Key:** `common.definition`
  - **Context:** `definition: 'Przedstawiciel ustawowy',`

- **Line 346:** `term`
  - **Suggested Key:** `common.term`
  - **Context:** `term: 'Immobilie',`

- **Line 355:** `definition`
  - **Suggested Key:** `common.definition`
  - **Context:** `definition: 'Grunty i budynki',`

### src/lib/i18n/languages.ts

- **Line 18:** `script`
  - **Suggested Key:** `common.script`
  - **Context:** `script: 'Arabic' | 'Cyrillic' | 'Greek' | 'Latin';`

- **Line 27:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Albanian',`

- **Line 41:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Bosnian',`

- **Line 42:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `nativeName: 'Bosanski',`

- **Line 45:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 55:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Bulgarian',`

- **Line 58:** `script`
  - **Suggested Key:** `common.script`
  - **Context:** `script: 'Cyrillic',`

- **Line 59:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 69:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Croatian',`

- **Line 70:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `nativeName: 'Hrvatski',`

- **Line 73:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 87:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 102:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Danish',`

- **Line 117:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `nativeName: 'Nederlands',`

- **Line 130:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'English',`

- **Line 131:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `nativeName: 'English',`

- **Line 144:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Estonian',`

- **Line 148:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 158:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Finnish',`

- **Line 162:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 172:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'French',`

- **Line 186:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'German',`

- **Line 187:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `nativeName: 'Deutsch',`

- **Line 190:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 214:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Hungarian',`

- **Line 215:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `nativeName: 'Magyar',`

- **Line 218:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'YYYY.MM.DD',`

- **Line 228:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Icelandic',`

- **Line 232:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 243:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `nativeName: 'Gaeilge',`

- **Line 256:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Italian',`

- **Line 257:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `nativeName: 'Italiano',`

- **Line 270:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Latvian',`

- **Line 274:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 284:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Lithuanian',`

- **Line 298:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Macedonian',`

- **Line 301:** `script`
  - **Suggested Key:** `common.script`
  - **Context:** `script: 'Cyrillic',`

- **Line 302:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 312:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Maltese',`

- **Line 326:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Montenegrin',`

- **Line 327:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `nativeName: 'Crnogorski',`

- **Line 330:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 340:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Norwegian',`

- **Line 344:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 354:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Polish',`

- **Line 355:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `nativeName: 'Polski',`

- **Line 358:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 376:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Portuguese',`

- **Line 390:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Romanian',`

- **Line 394:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 404:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Russian',`

- **Line 407:** `script`
  - **Suggested Key:** `common.script`
  - **Context:** `script: 'Cyrillic',`

- **Line 408:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 426:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Serbian',`

- **Line 429:** `script`
  - **Suggested Key:** `common.script`
  - **Context:** `script: 'Cyrillic', // Can also be Latin`

- **Line 430:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 440:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Slovak',`

- **Line 444:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 459:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Slovenian',`

- **Line 463:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 473:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Spanish',`

- **Line 487:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Swedish',`

- **Line 488:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `nativeName: 'Svenska',`

- **Line 501:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Turkish',`

- **Line 505:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 515:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Ukrainian',`

- **Line 518:** `script`
  - **Suggested Key:** `common.script`
  - **Context:** `script: 'Cyrillic',`

- **Line 519:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

### src/lib/i18n/jurisdictions.ts

- **Line 40:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Germany',`

- **Line 60:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Czech Republic',`

- **Line 67:** `legalSystem`
  - **Suggested Key:** `common.legalsystem`
  - **Context:** `legalSystem: 'Czech Civil Code',`

- **Line 79:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Slovakia',`

- **Line 86:** `legalSystem`
  - **Suggested Key:** `common.legalsystem`
  - **Context:** `legalSystem: 'Slovak Civil Code',`

- **Line 98:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'France',`

- **Line 105:** `legalSystem`
  - **Suggested Key:** `common.legalsystem`
  - **Context:** `legalSystem: 'French Civil Code',`

- **Line 128:** `legalSystem`
  - **Suggested Key:** `common.legalsystem`
  - **Context:** `legalSystem: 'Spanish Civil Code',`

- **Line 164:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Netherlands',`

- **Line 184:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Belgium',`

- **Line 191:** `legalSystem`
  - **Suggested Key:** `common.legalsystem`
  - **Context:** `legalSystem: 'Belgian Civil Code',`

- **Line 208:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Switzerland',`

- **Line 236:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Austria',`

- **Line 255:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'United Kingdom',`

- **Line 262:** `legalSystem`
  - **Suggested Key:** `common.legalsystem`
  - **Context:** `legalSystem: 'UK Inheritance Act',`

- **Line 278:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Poland',`

- **Line 285:** `legalSystem`
  - **Suggested Key:** `common.legalsystem`
  - **Context:** `legalSystem: 'Polish Civil Code',`

- **Line 298:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Denmark',`

- **Line 305:** `legalSystem`
  - **Suggested Key:** `common.legalsystem`
  - **Context:** `legalSystem: 'Danish Inheritance Act',`

- **Line 321:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Sweden',`

- **Line 328:** `legalSystem`
  - **Suggested Key:** `common.legalsystem`
  - **Context:** `legalSystem: 'Swedish Inheritance Code',`

- **Line 340:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Finland',`

- **Line 347:** `legalSystem`
  - **Suggested Key:** `common.legalsystem`
  - **Context:** `legalSystem: 'Finnish Code of Inheritance',`

- **Line 362:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Portugal',`

- **Line 369:** `legalSystem`
  - **Suggested Key:** `common.legalsystem`
  - **Context:** `legalSystem: 'Portuguese Civil Code',`

- **Line 382:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Greece',`

- **Line 389:** `legalSystem`
  - **Suggested Key:** `common.legalsystem`
  - **Context:** `legalSystem: 'Greek Civil Code',`

- **Line 402:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Hungary',`

- **Line 426:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Slovenia',`

- **Line 433:** `legalSystem`
  - **Suggested Key:** `common.legalsystem`
  - **Context:** `legalSystem: 'Slovenian Inheritance Act',`

- **Line 446:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Estonia',`

- **Line 453:** `legalSystem`
  - **Suggested Key:** `common.legalsystem`
  - **Context:** `legalSystem: 'Estonian Law of Succession Act',`

- **Line 465:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Latvia',`

- **Line 472:** `legalSystem`
  - **Suggested Key:** `common.legalsystem`
  - **Context:** `legalSystem: 'Latvian Civil Law',`

- **Line 484:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Lithuania',`

- **Line 491:** `legalSystem`
  - **Suggested Key:** `common.legalsystem`
  - **Context:** `legalSystem: 'Lithuanian Civil Code',`

- **Line 503:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Luxembourg',`

- **Line 510:** `legalSystem`
  - **Suggested Key:** `common.legalsystem`
  - **Context:** `legalSystem: 'Luxembourg inheritance law',`

- **Line 525:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Liechtenstein',`

- **Line 532:** `legalSystem`
  - **Suggested Key:** `common.legalsystem`
  - **Context:** `legalSystem: 'Liechtenstein inheritance law',`

- **Line 551:** `legalSystem`
  - **Suggested Key:** `common.legalsystem`
  - **Context:** `legalSystem: 'Maltese Civil Code',`

- **Line 566:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Cyprus',`

- **Line 573:** `legalSystem`
  - **Suggested Key:** `common.legalsystem`
  - **Context:** `legalSystem: 'Cypriot Wills and Succession Law',`

- **Line 585:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Ireland',`

- **Line 592:** `legalSystem`
  - **Suggested Key:** `common.legalsystem`
  - **Context:** `legalSystem: 'Irish Succession Act',`

- **Line 605:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Norway',`

- **Line 612:** `legalSystem`
  - **Suggested Key:** `common.legalsystem`
  - **Context:** `legalSystem: 'Norwegian Inheritance Act',`

- **Line 627:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Iceland',`

- **Line 634:** `legalSystem`
  - **Suggested Key:** `common.legalsystem`
  - **Context:** `legalSystem: 'Icelandic Inheritance Act',`

- **Line 647:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Romania',`

- **Line 654:** `legalSystem`
  - **Suggested Key:** `common.legalsystem`
  - **Context:** `legalSystem: 'Romanian Civil Code',`

- **Line 667:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Bulgaria',`

- **Line 674:** `legalSystem`
  - **Suggested Key:** `common.legalsystem`
  - **Context:** `legalSystem: 'Bulgarian Inheritance Act',`

- **Line 687:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Croatia',`

- **Line 694:** `legalSystem`
  - **Suggested Key:** `common.legalsystem`
  - **Context:** `legalSystem: 'Croatian Inheritance Act',`

- **Line 707:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Serbia',`

- **Line 714:** `legalSystem`
  - **Suggested Key:** `common.legalsystem`
  - **Context:** `legalSystem: 'Serbian Law of Inheritance',`

- **Line 727:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Albania',`

- **Line 734:** `legalSystem`
  - **Suggested Key:** `common.legalsystem`
  - **Context:** `legalSystem: 'Albanian Civil Code',`

- **Line 746:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'North Macedonia',`

- **Line 753:** `legalSystem`
  - **Suggested Key:** `common.legalsystem`
  - **Context:** `legalSystem: 'North Macedonian Law of Inheritance',`

- **Line 768:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Montenegro',`

- **Line 775:** `legalSystem`
  - **Suggested Key:** `common.legalsystem`
  - **Context:** `legalSystem: 'Montenegrin Law of Inheritance',`

- **Line 787:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Moldova',`

- **Line 794:** `legalSystem`
  - **Suggested Key:** `common.legalsystem`
  - **Context:** `legalSystem: 'Moldovan Civil Code',`

- **Line 806:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Ukraine',`

- **Line 813:** `legalSystem`
  - **Suggested Key:** `common.legalsystem`
  - **Context:** `legalSystem: 'Ukrainian Civil Code',`

- **Line 825:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Bosnia and Herzegovina',`

- **Line 832:** `legalSystem`
  - **Suggested Key:** `common.legalsystem`
  - **Context:** `legalSystem: 'Bosnia and Herzegovina inheritance law',`

### src/lib/i18n/enhanced-config.ts

- **Line 91:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Albanian',`

- **Line 95:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 101:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Bosnian',`

- **Line 102:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `nativeName: 'Bosanski',`

- **Line 105:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 111:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Bulgarian',`

- **Line 115:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 121:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Croatian',`

- **Line 122:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `nativeName: 'Hrvatski',`

- **Line 125:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 135:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 141:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Danish',`

- **Line 145:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 152:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `nativeName: 'Nederlands',`

- **Line 161:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'English',`

- **Line 162:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `nativeName: 'English',`

- **Line 171:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Estonian',`

- **Line 175:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 181:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Finnish',`

- **Line 185:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 191:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'French',`

- **Line 201:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'German',`

- **Line 202:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `nativeName: 'Deutsch',`

- **Line 205:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 221:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Hungarian',`

- **Line 222:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `nativeName: 'Magyar',`

- **Line 225:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'YYYY.MM.DD',`

- **Line 231:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Icelandic',`

- **Line 235:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 241:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Irish Gaelic',`

- **Line 242:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `nativeName: 'Gaeilge',`

- **Line 251:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Italian',`

- **Line 252:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `nativeName: 'Italiano',`

- **Line 261:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Latvian',`

- **Line 265:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 271:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Lithuanian',`

- **Line 275:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'YYYY.MM.DD',`

- **Line 281:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Macedonian',`

- **Line 285:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 291:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Maltese',`

- **Line 301:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Montenegrin',`

- **Line 302:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `nativeName: 'Crnogorski',`

- **Line 305:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 311:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Norwegian',`

- **Line 315:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 321:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Polish',`

- **Line 322:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `nativeName: 'Polski',`

- **Line 325:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 331:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Portuguese',`

- **Line 341:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Romanian',`

- **Line 345:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 351:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Russian',`

- **Line 355:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 361:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Serbian',`

- **Line 365:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 371:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Slovak',`

- **Line 375:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 381:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Slovenian',`

- **Line 385:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 391:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Spanish',`

- **Line 401:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Swedish',`

- **Line 402:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `nativeName: 'Svenska',`

- **Line 411:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Turkish',`

- **Line 415:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 421:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Ukrainian',`

- **Line 425:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

### src/lib/i18n/config.ts

- **Line 75:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Albanian',`

- **Line 79:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 84:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Bosnian',`

- **Line 85:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `nativeName: 'Bosanski',`

- **Line 88:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 93:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Bulgarian',`

- **Line 97:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 102:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Croatian',`

- **Line 103:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `nativeName: 'Hrvatski',`

- **Line 106:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 115:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 120:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Danish',`

- **Line 124:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 130:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `nativeName: 'Nederlands',`

- **Line 138:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'English',`

- **Line 139:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `nativeName: 'English',`

- **Line 147:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Estonian',`

- **Line 151:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 156:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Finnish',`

- **Line 160:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 165:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'French',`

- **Line 174:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'German',`

- **Line 175:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `nativeName: 'Deutsch',`

- **Line 178:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 192:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Hungarian',`

- **Line 193:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `nativeName: 'Magyar',`

- **Line 196:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'YYYY.MM.DD',`

- **Line 201:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Icelandic',`

- **Line 205:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 210:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Irish Gaelic',`

- **Line 211:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `nativeName: 'Gaeilge',`

- **Line 219:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Italian',`

- **Line 220:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `nativeName: 'Italiano',`

- **Line 228:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Latvian',`

- **Line 232:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 237:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Lithuanian',`

- **Line 241:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'YYYY.MM.DD',`

- **Line 246:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Macedonian',`

- **Line 250:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 255:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Maltese',`

- **Line 264:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Montenegrin',`

- **Line 265:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `nativeName: 'Crnogorski',`

- **Line 268:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 273:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Norwegian',`

- **Line 277:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 282:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Polish',`

- **Line 283:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `nativeName: 'Polski',`

- **Line 286:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 291:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Portuguese',`

- **Line 300:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Romanian',`

- **Line 304:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 309:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Russian',`

- **Line 313:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 318:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Serbian',`

- **Line 322:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 327:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Slovak',`

- **Line 331:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 336:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Slovenian',`

- **Line 340:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 345:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Spanish',`

- **Line 354:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Swedish',`

- **Line 355:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `nativeName: 'Svenska',`

- **Line 363:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Turkish',`

- **Line 367:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

- **Line 372:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Ukrainian',`

- **Line 376:** `dateFormat`
  - **Suggested Key:** `common.dateformat`
  - **Context:** `dateFormat: 'DD.MM.YYYY',`

### src/lib/family/professionalNetwork.ts

- **Line 863:** `event`
  - **Suggested Key:** `common.event`
  - **Context:** `event: 'Conflict Reported',`

- **Line 864:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Initial conflict report submitted',`

- **Line 907:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Opening',`

- **Line 908:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Establish ground rules and objectives',`

- **Line 918:** `name`
  - **Suggested Key:** `forms.name`
  - **Context:** `name: 'Information Gathering',`

- **Line 919:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Collect facts and positions',`

- **Line 929:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Negotiation',`

- **Line 930:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Explore solutions and reach agreements',`

- **Line 950:** `rationale`
  - **Suggested Key:** `common.rationale`
  - **Context:** `rationale: 'Encourage open communication',`

- **Line 951:** `enforcement`
  - **Suggested Key:** `common.enforcement`
  - **Context:** `enforcement: 'All parties bound by agreement',`

- **Line 955:** `rule`
  - **Suggested Key:** `common.rule`
  - **Context:** `rule: 'Respectful communication only',`

- **Line 956:** `rationale`
  - **Suggested Key:** `common.rationale`
  - **Context:** `rationale: 'Maintain productive atmosphere',`

- **Line 957:** `enforcement`
  - **Suggested Key:** `common.enforcement`
  - **Context:** `enforcement: 'Mediator intervention',`

- **Line 962:** `phase`
  - **Suggested Key:** `common.phase`
  - **Context:** `phase: 'Opening',`

- **Line 992:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Professional Mediator', // Would get from professional record`

- **Line 995:** `approach`
  - **Suggested Key:** `common.approach`
  - **Context:** `approach: 'Facilitative mediation focused on mutual understanding',`

### src/lib/family/estatePlanningWorkflows.ts

- **Line 741:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Basic Will Creation',`

- **Line 750:** `title`
  - **Suggested Key:** `forms.title`
  - **Context:** `title: 'Gather Personal Information',`

- **Line 751:** `description`
  - **Suggested Key:** `forms.description`
  - **Context:** `description: 'Collect basic personal and family information',`

- **Line 768:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Full legal name is required',`

- **Line 778:** `description`
  - **Suggested Key:** `forms.description`
  - **Context:** `description: 'Personal and family information',`

- **Line 788:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Identify Assets and Liabilities',`

- **Line 807:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'At least one asset must be listed',`

- **Line 817:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Complete list of assets and liabilities',`

- **Line 825:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Asset Inventory Checklist',`

- **Line 836:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Legal will document ready for execution',`

- **Line 845:** `requirement`
  - **Suggested Key:** `common.requirement`
  - **Context:** `requirement: 'Two witnesses required for will execution',`

- **Line 864:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Basic Will Template',`

- **Line 865:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Simple will template for straightforward estates',`

- **Line 895:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Full Legal Name',`

- **Line 902:** `key`
  - **Suggested Key:** `common.key`
  - **Context:** `key: 'ADDRESS',`

- **Line 903:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Address',`

- **Line 910:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Primary Beneficiary',`

- **Line 913:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'The main person who will inherit your estate',`

- **Line 917:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Executor',`

- **Line 920:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'The person who will manage your estate',`

- **Line 1018:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'My Estate Plan',`

### src/lib/enterprise/whiteLabelSolutions.ts

- **Line 1126:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Bank Basic Template',`

- **Line 1137:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Wealth Management Premium',`

- **Line 1151:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Law Firm Professional',`

### src/lib/enterprise/teamCollaboration.ts

- **Line 1027:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `// name: 'Estate Planning Team',`

- **Line 1034:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `// name: 'Family Coordination',`

- **Line 1041:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `// name: 'Legal Review Workspace',`

- **Line 1118:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Professional',`

### src/lib/enterprise/businessSuccessionPlanning.ts

- **Line 820:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Family Business Succession',`

- **Line 831:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Management Buyout Plan',`

- **Line 838:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Strategic Sale Preparation',`

- **Line 946:** `justification`
  - **Suggested Key:** `common.justification`
  - **Context:** `justification: 'Private company discount',`

- **Line 951:** `justification`
  - **Suggested Key:** `common.justification`
  - **Context:** `justification: 'Minority interest discount',`

- **Line 962:** `source`
  - **Suggested Key:** `common.source`
  - **Context:** `source: 'Industry Analysis',`

- **Line 968:** `source`
  - **Suggested Key:** `common.source`
  - **Context:** `source: 'Industry Analysis',`

- **Line 974:** `source`
  - **Suggested Key:** `common.source`
  - **Context:** `source: 'Industry Analysis',`

- **Line 1025:** `area`
  - **Suggested Key:** `common.area`
  - **Context:** `area: 'Documentation',`

- **Line 1026:** `current`
  - **Suggested Key:** `common.current`
  - **Context:** `current: 'Basic documents in place',`

- **Line 1027:** `target`
  - **Suggested Key:** `common.target`
  - **Context:** `target: 'Complete legal documentation',`

- **Line 1060:** `milestone`
  - **Suggested Key:** `common.milestone`
  - **Context:** `milestone: 'Plan Finalization',`

- **Line 1061:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Plan Finalization',`

- **Line 1062:** `description`
  - **Suggested Key:** `success.description`
  - **Context:** `description: 'Complete succession plan documentation',`

- **Line 1078:** `risk`
  - **Suggested Key:** `common.risk`
  - **Context:** `risk: 'Key person dependency risk',`

- **Line 1080:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Key person dependency risk',`

- **Line 1118:** `action`
  - **Suggested Key:** `common.action`
  - **Context:** `action: 'Complete valuation update',`

- **Line 1119:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Complete valuation update',`

### src/lib/enterprise/apiEcosystem.ts

- **Line 1007:** `reason`
  - **Suggested Key:** `common.reason`
  - **Context:** `return { status: 'filtered', reason: 'Event filtered out' };`

- **Line 1039:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `delivery.error = error instanceof Error ? error.message : 'Unknown error';`

- **Line 1155:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'List Documents',`

- **Line 1156:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Retrieve a list of documents',`

- **Line 1162:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Create Document',`

- **Line 1163:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Create a new document',`

- **Line 1169:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Get Document',`

- **Line 1170:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Retrieve a specific document',`

- **Line 1176:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Get User Profile',`

- **Line 1177:** `description`
  - **Suggested Key:** `forms.description`
  - **Context:** `description: 'Retrieve user profile information',`

- **Line 1183:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Get Analytics',`

- **Line 1184:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Retrieve analytics data',`

- **Line 1196:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'LegacyGuard Developer Portal',`

- **Line 1215:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'LegacyGuard Integration Marketplace',`

### src/lib/emergency/testing-system.ts

- **Line 154:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Inactivity Detection Trigger',`

- **Line 207:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Guardian Verification Process',`

- **Line 208:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Test guardian notification and verification flow',`

- **Line 247:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Emergency Access Control',`

- **Line 248:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Test resource access permissions during emergency',`

- **Line 267:** `type`
  - **Suggested Key:** `common.type`
  - **Context:** `{ name: 'medical-record.pdf', type: 'Health' },`

- **Line 268:** `type`
  - **Suggested Key:** `common.type`
  - **Context:** `{ name: 'bank-statement.pdf', type: 'Financial' },`

- **Line 282:** `document_type`
  - **Suggested Key:** `common.documenttype`
  - **Context:** `document_type: 'Health',`

- **Line 291:** `document_type`
  - **Suggested Key:** `common.documenttype`
  - **Context:** `document_type: 'Financial',`

- **Line 308:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Health Check Failure Detection',`

- **Line 309:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Test detection based on missed health checks',`

- **Line 363:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Survivor Interface Access',`

- **Line 364:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Test survivor access request and approval flow',`

- **Line 439:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error: error instanceof Error ? error.message : 'Unknown error',`

- **Line 472:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error: error instanceof Error ? error.message : 'Unknown error',`

- **Line 509:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error: error instanceof Error ? error.message : 'Unknown error',`

- **Line 540:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error: error instanceof Error ? error.message : 'Unknown error',`

- **Line 878:** `PASSED`
  - **Suggested Key:** `common.passed`
  - **Context:** `- **Status**: ${result.passed ? 'PASSED' : 'FAILED'}`

### src/lib/emergency/guardian-notifier.ts

- **Line 146:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error: error instanceof Error ? error.message : 'Unknown error',`

- **Line 286:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `errors: [error instanceof Error ? error.message : 'Unknown error'],`

- **Line 325:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error: error instanceof Error ? error.message : 'Failed to send email',`

- **Line 350:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error: error instanceof Error ? error.message : 'Failed to send SMS',`

- **Line 441:** `first_reminder`
  - **Suggested Key:** `common.firstreminder`
  - **Context:** `first_reminder: 'REMINDER',`

- **Line 442:** `urgent_reminder`
  - **Suggested Key:** `common.urgentreminder`
  - **Context:** `urgent_reminder: 'URGENT REMINDER',`

- **Line 443:** `final_warning`
  - **Suggested Key:** `warnings.finalwarning`
  - **Context:** `final_warning: 'FINAL WARNING',`

- **Line 451:** `inactivity_detected`
  - **Suggested Key:** `common.inactivitydetected`
  - **Context:** `inactivity_detected: 'Extended period of inactivity detected',`

- **Line 452:** `manual_guardian`
  - **Suggested Key:** `common.manualguardian`
  - **Context:** `manual_guardian: 'Manual activation requested by guardian',`

- **Line 454:** `health_check_failure`
  - **Suggested Key:** `errors.healthcheckfailure`
  - **Context:** `health_check_failure: 'Multiple missed health check responses',`

- **Line 526:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error: error instanceof Error ? error.message : 'Unknown error',`

- **Line 573:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error: error instanceof Error ? error.message : 'Unknown error',`

### src/lib/emergency/emergency-service.ts

- **Line 122:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error: error instanceof Error ? error.message : 'Initialization failed',`

- **Line 196:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error instanceof Error ? error.message : 'Failed to process response',`

- **Line 282:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error instanceof Error ? error.message : 'Failed to load dashboard',`

- **Line 499:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error instanceof Error ? error.message : 'Unknown cleanup error',`

- **Line 564:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error instanceof Error ? error.message : 'System status check failed',`

### src/lib/emergency/detection-engine.ts

- **Line 281:** `error`
  - **Suggested Key:** `errors.error`
  - **Context:** `error: 'Emergency shield is not enabled',`

- **Line 337:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error: error instanceof Error ? error.message : 'Unknown error',`

- **Line 355:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Emergency Activation Request',`

### src/lib/emergency/access-control.ts

- **Line 105:** `reason`
  - **Suggested Key:** `common.reason`
  - **Context:** `reason: 'Public memorial access',`

- **Line 162:** `reason`
  - **Suggested Key:** `common.reason`
  - **Context:** `reason: 'System access',`

- **Line 199:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error: error instanceof Error ? error.message : 'Unknown error',`

- **Line 239:** `reason`
  - **Suggested Key:** `common.reason`
  - **Context:** `metadata: { reason: 'Shield not active, guardian cannot trigger' },`

- **Line 244:** `reason`
  - **Suggested Key:** `common.reason`
  - **Context:** `reason: 'Emergency shield must be activated first',`

- **Line 336:** `reason`
  - **Suggested Key:** `common.reason`
  - **Context:** `reason: 'Document not found',`

- **Line 347:** `reason`
  - **Suggested Key:** `common.reason`
  - **Context:** `reason: 'No permission to access health documents',`

- **Line 358:** `reason`
  - **Suggested Key:** `common.reason`
  - **Context:** `reason: 'No permission to access financial documents',`

- **Line 369:** `reason`
  - **Suggested Key:** `common.reason`
  - **Context:** `reason: 'Only will executors can access legal documents',`

- **Line 381:** `reason`
  - **Suggested Key:** `common.reason`
  - **Context:** `reason: 'Emergency shield must be active',`

- **Line 611:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error instanceof Error ? error.message : 'Failed to process request',`

- **Line 638:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Survivor Access Request',`

- **Line 639:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: `A family member has requested access to memorial resources. Please review the request.`,`

### src/lib/api/professionalApi.ts

- **Line 65:** `message`
  - **Suggested Key:** `success.message`
  - **Context:** `message: 'Professional application submitted successfully',`

- **Line 69:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** ``Application submission failed: ${error instanceof Error ? error.message : 'Unknown error'}``

- **Line 83:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** ``Failed to retrieve application: ${error instanceof Error ? error.message : 'Unknown error'}``

- **Line 94:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** ``Failed to retrieve user application: ${error instanceof Error ? error.message : 'Unknown error'}``

- **Line 118:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** ``Status update failed: ${error instanceof Error ? error.message : 'Unknown error'}``

- **Line 180:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** ``Review request failed: ${error instanceof Error ? error.message : 'Unknown error'}``

- **Line 202:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** ``Review assignment failed: ${error instanceof Error ? error.message : 'Unknown error'}``

- **Line 226:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** ``Failed to fetch review requests: ${error instanceof Error ? error.message : 'Unknown error'}``

- **Line 299:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** ``Review status update failed: ${error instanceof Error ? error.message : 'Unknown error'}``

- **Line 312:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** ``Failed to fetch review: ${error instanceof Error ? error.message : 'Unknown error'}``

- **Line 323:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** ``Failed to fetch user reviews: ${error instanceof Error ? error.message : 'Unknown error'}``

- **Line 347:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** ``Failed to fetch reviewer reviews: ${error instanceof Error ? error.message : 'Unknown error'}``

- **Line 373:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** ``Professional search failed: ${error instanceof Error ? error.message : 'Unknown error'}``

- **Line 387:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** ``Failed to fetch professional: ${error instanceof Error ? error.message : 'Unknown error'}``

- **Line 402:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** ``Failed to fetch directory: ${error instanceof Error ? error.message : 'Unknown error'}``

- **Line 448:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** ``Consultation booking failed: ${error instanceof Error ? error.message : 'Unknown error'}``

- **Line 471:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** ``Failed to fetch consultations: ${error instanceof Error ? error.message : 'Unknown error'}``

- **Line 495:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** ``Failed to update consultation status: ${error instanceof Error ? error.message : 'Unknown error'}``

- **Line 575:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** ``Failed to fetch reviewer analytics: ${error instanceof Error ? error.message : 'Unknown error'}``

- **Line 615:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** ``Failed to fetch network stats: ${error instanceof Error ? error.message : 'Unknown error'}``

### src/lib/api/apiAdapter.ts

- **Line 138:** `method`
  - **Suggested Key:** `common.method`
  - **Context:** `method: 'DELETE',`

### src/lib/ai/smartSearch.ts

- **Line 191:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** ``Search failed: ${error instanceof Error ? error.message : 'Unknown error'}``

- **Line 350:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Documents Expiring Soon',`

- **Line 369:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Trending Document Categories',`

- **Line 370:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Popular document categories based on recent activity',`

- **Line 536:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Similar Documents',`

- **Line 537:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: `Documents similar to "${topResult.title}"`,`

- **Line 624:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: `Search for documents containing "${term}"`,`

- **Line 1049:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'From your search history',`

- **Line 1232:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: `Search for "${query}" in ${category} documents`,`

### src/lib/ai/naturalLanguageSearch.ts

- **Line 365:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Last Will and Testament',`

- **Line 377:** `context`
  - **Suggested Key:** `common.context`
  - **Context:** `context: 'Last Will and Testament',`

### src/lib/ai/documentInsights.ts

- **Line 283:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Add Password Protection',`

- **Line 305:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Update Document Expiry Dates',`

- **Line 417:** `description`
  - **Suggested Key:** `forms.description`
  - **Context:** `description: 'Document is missing category or type information',`

- **Line 418:** `resolution`
  - **Suggested Key:** `common.resolution`
  - **Context:** `resolution: 'Update document metadata through the document editor',`

- **Line 445:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Document contains PII but is not password protected',`

- **Line 446:** `resolution`
  - **Suggested Key:** `common.resolution`
  - **Context:** `resolution: 'Add password protection to this document',`

- **Line 552:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Optimize Large Files',`

- **Line 568:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Improve Document Organization',`

### src/lib/ai/documentCategorizer.ts

- **Line 135:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** ``Document categorization failed: ${error instanceof Error ? error.message : 'Unknown error'}``

- **Line 156:** `reasoning`
  - **Suggested Key:** `common.reasoning`
  - **Context:** `reasoning: 'Primary document category',`

- **Line 164:** `reasoning`
  - **Suggested Key:** `common.reasoning`
  - **Context:** `reasoning: 'Document subcategory',`

- **Line 351:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Legal Contract',`

- **Line 352:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Identifies legal contracts and agreements',`

- **Line 354:** `secondary`
  - **Suggested Key:** `common.secondary`
  - **Context:** `secondary: 'Contract',`

- **Line 389:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Financial Statement',`

- **Line 390:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Identifies financial statements and reports',`

- **Line 392:** `secondary`
  - **Suggested Key:** `common.secondary`
  - **Context:** `secondary: 'Statement',`

- **Line 427:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Tax Document',`

- **Line 430:** `secondary`
  - **Suggested Key:** `common.secondary`
  - **Context:** `secondary: 'Tax Document',`

- **Line 459:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Medical Record',`

- **Line 460:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Identifies medical records and healthcare documents',`

- **Line 462:** `secondary`
  - **Suggested Key:** `common.secondary`
  - **Context:** `secondary: 'Medical Record',`

- **Line 497:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Insurance Policy',`

- **Line 498:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Identifies insurance policies and claims',`

- **Line 500:** `secondary`
  - **Suggested Key:** `common.secondary`
  - **Context:** `secondary: 'Policy',`

- **Line 529:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Property Deed',`

- **Line 530:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Identifies property deeds and real estate documents',`

- **Line 893:** `reasoning`
  - **Suggested Key:** `common.reasoning`
  - **Context:** `reasoning: `Document importance level determined by AI analysis`,`

- **Line 901:** `reasoning`
  - **Suggested Key:** `common.reasoning`
  - **Context:** `reasoning: `Document sensitivity level based on content analysis`,`

- **Line 952:** `reasoning`
  - **Suggested Key:** `common.reasoning`
  - **Context:** `reasoning: 'Document is a single page',`

### src/lib/ai/documentAnalyzer.ts

- **Line 238:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** ``Document analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}``

- **Line 306:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Document Expiring Soon',`

- **Line 319:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Contract Terms Not Clearly Identified',`

- **Line 765:** `pdf`
  - **Suggested Key:** `common.pdf`
  - **Context:** `pdf: 'PDF Document',`

- **Line 766:** `doc`
  - **Suggested Key:** `common.doc`
  - **Context:** `doc: 'Word Document',`

- **Line 767:** `docx`
  - **Suggested Key:** `common.docx`
  - **Context:** `docx: 'Word Document',`

- **Line 768:** `txt`
  - **Suggested Key:** `common.txt`
  - **Context:** `txt: 'Text Document',`

- **Line 769:** `rtf`
  - **Suggested Key:** `common.rtf`
  - **Context:** `rtf: 'Rich Text Document',`

- **Line 791:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Set Renewal Reminders',`

- **Line 803:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Secure Storage',`

### src/lib/ai/complianceChecker.ts

- **Line 240:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'GDPR Privacy Compliance',`

- **Line 250:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Explicit consent for personal data processing',`

- **Line 283:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'HIPAA Healthcare Privacy',`

- **Line 328:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Estate Planning Legal Requirements',`

- **Line 329:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Legal requirements for estate planning documents',`

- **Line 332:** `regulation`
  - **Suggested Key:** `common.regulation`
  - **Context:** `regulation: 'State Estate Laws',`

- **Line 337:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Proper witnessing and execution of will documents',`

- **Line 811:** `step`
  - **Suggested Key:** `common.step`
  - **Context:** `step: 'Review compliance requirement',`

- **Line 817:** `step`
  - **Suggested Key:** `common.step`
  - **Context:** `step: 'Consult legal professional',`

- **Line 824:** `step`
  - **Suggested Key:** `common.step`
  - **Context:** `step: 'Implement compliance measures',`

- **Line 825:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Update document to meet compliance requirements',`

### src/lib/accessibility/a11y-utils.ts

- **Line 159:** `ESCAPE`
  - **Suggested Key:** `common.escape`
  - **Context:** `ESCAPE: 'Escape',`

- **Line 161:** `ARROW_UP`
  - **Suggested Key:** `common.arrowup`
  - **Context:** `ARROW_UP: 'ArrowUp',`

- **Line 162:** `ARROW_DOWN`
  - **Suggested Key:** `common.arrowdown`
  - **Context:** `ARROW_DOWN: 'ArrowDown',`

- **Line 163:** `ARROW_LEFT`
  - **Suggested Key:** `common.arrowleft`
  - **Context:** `ARROW_LEFT: 'ArrowLeft',`

- **Line 164:** `ARROW_RIGHT`
  - **Suggested Key:** `common.arrowright`
  - **Context:** `ARROW_RIGHT: 'ArrowRight',`

- **Line 167:** `PAGE_UP`
  - **Suggested Key:** `common.pageup`
  - **Context:** `PAGE_UP: 'PageUp',`

- **Line 168:** `PAGE_DOWN`
  - **Suggested Key:** `common.pagedown`
  - **Context:** `PAGE_DOWN: 'PageDown',`

### src/lib/ab-testing/ab-testing-system.ts

- **Line 60:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Current Onboarding',`

- **Line 67:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Starts with family impact messaging',`

- **Line 81:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'No Trust Score',`

- **Line 82:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Standard dashboard without trust score',`

- **Line 87:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Progress Ring',`

- **Line 88:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Trust score as circular progress indicator',`

- **Line 93:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Badge Display',`

- **Line 94:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Trust score as prominent badge',`

- **Line 108:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Standard Button',`

- **Line 109:** `description`
  - **Suggested Key:** `common.buttons.description`
  - **Context:** `description: 'Simple "Request Review" button',`

- **Line 114:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Trust Score Boost',`

- **Line 115:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Emphasizes trust score increase',`

- **Line 120:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Family Protection',`

- **Line 121:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Emphasizes family protection benefits',`

- **Line 126:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Urgency Frame',`

- **Line 127:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Emphasizes legal compliance urgency',`

### src/lib/__tests__/sofia-personality.test.ts

- **Line 131:** `Please upload your document`
  - **Suggested Key:** `common.pleaseUploadYourDocument`
  - **Context:** `const baseMessage = 'Please upload your document';`

- **Line 139:** `You need to upload your document`
  - **Suggested Key:** `common.youNeedToUploadYourDocument`
  - **Context:** `const baseMessage = 'You need to upload your document';`

- **Line 158:** `greeting`
  - **Suggested Key:** `common.greeting`
  - **Context:** `greeting: "Welcome back! It's wonderful to see you.",`

- **Line 160:** `celebration`
  - **Suggested Key:** `common.celebration`
  - **Context:** `celebration: 'This is such a meaningful achievement!',`

- **Line 164:** `greeting`
  - **Suggested Key:** `common.greeting`
  - **Context:** `greeting: 'Welcome back.',`

- **Line 166:** `celebration`
  - **Suggested Key:** `common.celebration`
  - **Context:** `celebration: 'Task completed.',`

### src/lib/__tests__/sofia-memory.test.ts

- **Line 11:** `userName`
  - **Suggested Key:** `common.username`
  - **Context:** `userName: 'Test User',`

- **Line 39:** `content`
  - **Suggested Key:** `common.content`
  - **Context:** `content: 'Hello Sofia',`

- **Line 45:** `content`
  - **Suggested Key:** `common.content`
  - **Context:** `content: 'Hello! How can I help you today?',`

- **Line 82:** `content`
  - **Suggested Key:** `common.content`
  - **Context:** `content: 'Help me with my will',`

- **Line 131:** `content`
  - **Suggested Key:** `common.content`
  - **Context:** `content: 'Help with will',`

- **Line 154:** `content`
  - **Suggested Key:** `common.content`
  - **Context:** `content: 'Help me',`

- **Line 216:** `content`
  - **Suggested Key:** `common.content`
  - **Context:** `content: 'Test message',`

### src/lib/__tests__/sk-witness-validation.test.ts

- **Line 29:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `{ name: 'John Doe', age: 30 },`

- **Line 30:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `{ name: 'Jane Smith', age: 35 },`

- **Line 43:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `{ name: 'John Doe', age: 30 },`

- **Line 44:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `{ name: 'Jane Smith', age: 35 },`

- **Line 45:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `{ name: 'Bob Johnson', age: 40 },`

- **Line 67:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `{ name: 'John Doe', age: 30 },`

- **Line 68:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `{ name: 'Jane Smith', age: 35 },`

- **Line 85:** `placeOfBirth`
  - **Suggested Key:** `common.placeofbirth`
  - **Context:** `placeOfBirth: 'Bratislava',`

- **Line 169:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Charity Organization',`

### src/lib/__tests__/encryption.test.ts

- **Line 97:** `This is sensitive data`
  - **Suggested Key:** `common.thisIsSensitiveData`
  - **Context:** `const testData = 'This is sensitive data';`

- **Line 218:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'John Doe',`

- **Line 236:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'John Doe',`

### src/hooks/__tests__/useAccessibility.test.ts

- **Line 48:** `key`
  - **Suggested Key:** `common.key`
  - **Context:** `const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });`

- **Line 56:** `key`
  - **Suggested Key:** `common.key`
  - **Context:** `const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });`

- **Line 107:** `key`
  - **Suggested Key:** `common.key`
  - **Context:** `const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });`

- **Line 115:** `key`
  - **Suggested Key:** `common.key`
  - **Context:** `const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });`

### src/components/will/WillWizard.tsx

- **Line 453:** `Your full legal name`
  - **Suggested Key:** `common.yourFullLegalName`
  - **Context:** `placeholder='Your full legal name'`

- **Line 485:** `City, Country`
  - **Suggested Key:** `common.cityCountry`
  - **Context:** `placeholder='City, Country'`

- **Line 535:** `Street address`
  - **Suggested Key:** `common.streetAddress`
  - **Context:** `placeholder='Street address'`

- **Line 550:** `City`
  - **Suggested Key:** `common.city`
  - **Context:** `placeholder='City'`

- **Line 565:** `Postal code`
  - **Suggested Key:** `common.postalCode`
  - **Context:** `placeholder='Postal code'`

- **Line 580:** `Country`
  - **Suggested Key:** `common.country`
  - **Context:** `placeholder='Country'`

- **Line 610:** `Spouse`
  - **Suggested Key:** `common.spouse`
  - **Context:** `placeholder="Spouse's full name"`

- **Line 647:** `Child`
  - **Suggested Key:** `common.child`
  - **Context:** `placeholder="Child's name"`

### src/components/ui/language-switcher.tsx

- **Line 21:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `{ code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },`

- **Line 21:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `{ code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },`

- **Line 22:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `{ code: 'sk', name: 'Slovak', flag: '🇸🇰', nativeName: 'Slovenčina' },`

- **Line 24:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `{ code: 'de', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },`

- **Line 24:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `{ code: 'de', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },`

- **Line 25:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `{ code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français' },`

- **Line 26:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `{ code: 'es', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },`

- **Line 27:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `{ code: 'it', name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano' },`

- **Line 27:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `{ code: 'it', name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano' },`

- **Line 28:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `{ code: 'pl', name: 'Polish', flag: '🇵🇱', nativeName: 'Polski' },`

- **Line 28:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `{ code: 'pl', name: 'Polish', flag: '🇵🇱', nativeName: 'Polski' },`

- **Line 29:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `{ code: 'hu', name: 'Hungarian', flag: '🇭🇺', nativeName: 'Magyar' },`

- **Line 29:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `{ code: 'hu', name: 'Hungarian', flag: '🇭🇺', nativeName: 'Magyar' },`

- **Line 30:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `{ code: 'hr', name: 'Croatian', flag: '🇭🇷', nativeName: 'Hrvatski' },`

- **Line 30:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `{ code: 'hr', name: 'Croatian', flag: '🇭🇷', nativeName: 'Hrvatski' },`

### src/components/ui/input.stories.tsx

- **Line 34:** `Email`
  - **Suggested Key:** `common.email`
  - **Context:** `<Input type="email" placeholder="Email" />`

- **Line 75:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'The type of input',`

- **Line 83:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Placeholder text',`

- **Line 90:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Whether the input is disabled',`

- **Line 98:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Whether the input is readonly',`

- **Line 106:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'The input value',`

- **Line 121:** `placeholder`
  - **Suggested Key:** `common.placeholder`
  - **Context:** `placeholder: 'Enter text...',`

- **Line 135:** `placeholder`
  - **Suggested Key:** `common.placeholder`
  - **Context:** `placeholder: 'Enter password',`

- **Line 207:** `placeholder`
  - **Suggested Key:** `common.placeholder`
  - **Context:** `placeholder: 'Disabled input',`

- **Line 304:** `placeholder`
  - **Suggested Key:** `common.placeholder`
  - **Context:** `placeholder: 'Small input',`

- **Line 311:** `placeholder`
  - **Suggested Key:** `common.placeholder`
  - **Context:** `placeholder: 'Large input',`

### src/components/ui/button.stories.tsx

- **Line 82:** `description`
  - **Suggested Key:** `common.buttons.description`
  - **Context:** `description: 'The visual style variant of the button',`

- **Line 91:** `description`
  - **Suggested Key:** `common.buttons.description`
  - **Context:** `description: 'The size of the button',`

- **Line 107:** `description`
  - **Suggested Key:** `common.buttons.description`
  - **Context:** `description: 'Whether the button is disabled',`

- **Line 115:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Button content',`

### src/components/ui/badge.stories.tsx

- **Line 66:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'The visual style variant of the badge',`

- **Line 74:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Badge content',`

- **Line 95:** `children`
  - **Suggested Key:** `common.children`
  - **Context:** `children: 'Secondary',`

- **Line 102:** `children`
  - **Suggested Key:** `common.children`
  - **Context:** `children: 'Destructive',`

- **Line 109:** `children`
  - **Suggested Key:** `common.children`
  - **Context:** `children: 'Outline',`

### src/components/social/FamilyManagement.tsx

- **Line 340:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Success',`

- **Line 616:** `Describe your family group...`
  - **Suggested Key:** `common.describeYourFamilyGroup`
  - **Context:** `placeholder='Describe your family group...'`

### src/components/social/DocumentSharing.tsx

- **Line 438:** `Add a message for the recipients...`
  - **Suggested Key:** `common.buttons.addAMessageForTheRecipients`
  - **Context:** `placeholder='Add a message for the recipients...'`

- **Line 800:** `Add a note...`
  - **Suggested Key:** `common.buttons.addANote`
  - **Context:** `placeholder='Add a note...'`

### src/components/sofia/SofiaChatV2.tsx

- **Line 437:** `content`
  - **Suggested Key:** `common.content`
  - **Context:** `content: 'Understood, cancelled. What else can I help you with?',`

- **Line 898:** `Or type your own question...`
  - **Suggested Key:** `common.orTypeYourOwnQuestion`
  - **Context:** `placeholder='Or type your own question...'`

### src/components/sofia/SofiaChat.tsx

- **Line 316:** `Ask Sofia anything...`
  - **Suggested Key:** `common.askSofiaAnything`
  - **Context:** `placeholder='Ask Sofia anything...'`

### src/components/security/SecurityDashboard.tsx

- **Line 183:** `device`
  - **Suggested Key:** `common.device`
  - **Context:** `device: 'Chrome on MacOS',`

- **Line 186:** `location`
  - **Suggested Key:** `common.location`
  - **Context:** `location: 'San Francisco, CA',`

### src/components/time-capsule/TimeCapsuleWizard.tsx

- **Line 237:** `status`
  - **Suggested Key:** `common.status`
  - **Context:** `status: 'PENDING' as const,`

### src/components/trust/TrustScoreDisplay.tsx

- **Line 333:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Excellent',`

- **Line 334:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Your family is exceptionally well protected',`

- **Line 340:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Very Good',`

- **Line 341:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Strong protection with room for minor improvements',`

- **Line 354:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Needs Attention',`

- **Line 355:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Important gaps in your family protection',`

- **Line 361:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Getting Started',`

- **Line 362:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: "Great start! Let's build stronger protection together",`

### src/components/trust/ProfessionalReviewerCard.tsx

- **Line 62:** `Available`
  - **Suggested Key:** `common.available`
  - **Context:** `return reviewer.status === 'active' ? 'Available' : 'Unavailable';`

### src/components/trust/ProfessionalReviewBadge.tsx

- **Line 47:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Professionally Reviewed',`

- **Line 53:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Under Review',`

- **Line 59:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Needs Revision',`

- **Line 65:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Review Pending',`

- **Line 71:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Review Issues',`

- **Line 77:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Unknown Status',`

### src/components/professional/ReviewRequestWorkflow.tsx

- **Line 66:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Basic Review',`

- **Line 67:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Essential legal compliance check and basic recommendations',`

- **Line 78:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Comprehensive Review',`

- **Line 93:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Certified Review',`

- **Line 497:** `Any specific concerns, questions, or areas you`
  - **Suggested Key:** `common.anySpecificConcernsQuestionsOrAreasYou`
  - **Context:** `placeholder="Any specific concerns, questions, or areas you'd like the attorney to focus on..."`

### src/components/professional/ReviewCompletionNotifier.tsx

- **Line 73:** `actionText`
  - **Suggested Key:** `common.actiontext`
  - **Context:** `actionText: 'View Full Report',`

- **Line 83:** `actionText`
  - **Suggested Key:** `common.actiontext`
  - **Context:** `actionText: 'See Recommendations',`

- **Line 93:** `actionText`
  - **Suggested Key:** `common.actiontext`
  - **Context:** `actionText: 'View Issues',`

- **Line 103:** `actionText`
  - **Suggested Key:** `common.actiontext`
  - **Context:** `actionText: 'See Critical Issues',`

- **Line 111:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Rating Required',`

- **Line 123:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Thank You!',`

- **Line 131:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Failed to submit rating. Please try again.',`

- **Line 414:** `Share your experience with this professional review...`
  - **Suggested Key:** `common.shareYourExperienceWithThisProfessionalReview`
  - **Context:** `placeholder='Share your experience with this professional review...'`

### src/components/professional/ReviewAssignmentQueue.tsx

- **Line 361:** `Search requests...`
  - **Suggested Key:** `common.searchRequests`
  - **Context:** `placeholder='Search requests...'`

### src/components/professional/ProfessionalRecommendationEngine.tsx

- **Line 133:** `fullName`
  - **Suggested Key:** `common.fullname`
  - **Context:** `fullName: 'Sarah Johnson',`

- **Line 134:** `full_name`
  - **Suggested Key:** `common.fullname`
  - **Context:** `full_name: 'Sarah Johnson',`

- **Line 135:** `professional_title`
  - **Suggested Key:** `common.professionaltitle`
  - **Context:** `professional_title: 'Estate Planning Attorney',`

- **Line 141:** `jurisdiction`
  - **Suggested Key:** `common.jurisdiction`
  - **Context:** `jurisdiction: 'California',`

- **Line 192:** `timeline`
  - **Suggested Key:** `common.timeline`
  - **Context:** `timeline: 'This week',`

- **Line 196:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Comprehensive document review with recommendations',`

- **Line 207:** `fullName`
  - **Suggested Key:** `common.fullname`
  - **Context:** `fullName: 'Michael Chen',`

- **Line 208:** `full_name`
  - **Suggested Key:** `common.fullname`
  - **Context:** `full_name: 'Michael Chen',`

- **Line 209:** `professional_title`
  - **Suggested Key:** `common.professionaltitle`
  - **Context:** `professional_title: 'Senior Partner',`

- **Line 210:** `law_firm_name`
  - **Suggested Key:** `common.lawfirmname`
  - **Context:** `law_firm_name: 'Pacific Legal Group',`

- **Line 215:** `jurisdiction`
  - **Suggested Key:** `common.jurisdiction`
  - **Context:** `jurisdiction: 'California',`

- **Line 259:** `timeline`
  - **Suggested Key:** `common.timeline`
  - **Context:** `timeline: 'Same day',`

- **Line 263:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Ongoing legal counsel retainer',`

- **Line 265:** `timeline`
  - **Suggested Key:** `common.timeline`
  - **Context:** `timeline: 'Monthly',`

### src/components/professional/ProfessionalPartnershipTemplate.tsx

- **Line 77:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Commission Rate',`

- **Line 79:** `description`
  - **Suggested Key:** `success.description`
  - **Context:** `description: 'Of each successful review fee',`

- **Line 83:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Response Time',`

- **Line 89:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Quality Standard',`

- **Line 91:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Minimum client satisfaction rating',`

- **Line 95:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Payment Terms',`

- **Line 97:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Payment processing time',`

### src/components/professional/ProfessionalNetworkLaunch.tsx

- **Line 391:** `Estate Planning, Family Law, Elder Law...`
  - **Suggested Key:** `common.estatePlanningFamilyLawElderLaw`
  - **Context:** `placeholder='Estate Planning, Family Law, Elder Law...'`

- **Line 483:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Sarah Johnson, Esq.',`

- **Line 484:** `firm`
  - **Suggested Key:** `common.firm`
  - **Context:** `firm: 'Johnson Estate Planning',`

- **Line 486:** `location`
  - **Suggested Key:** `common.location`
  - **Context:** `location: 'San Francisco, CA',`

- **Line 497:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Michael Chen, Esq.',`

- **Line 498:** `firm`
  - **Suggested Key:** `common.firm`
  - **Context:** `firm: 'Chen Family Law Group',`

- **Line 500:** `location`
  - **Suggested Key:** `common.location`
  - **Context:** `location: 'Los Angeles, CA',`

- **Line 511:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Jennifer Williams, Esq.',`

- **Line 514:** `location`
  - **Suggested Key:** `common.location`
  - **Context:** `location: 'New York, NY',`

### src/components/professional/ProfessionalNetworkDirectory.tsx

- **Line 101:** `full_name`
  - **Suggested Key:** `common.fullname`
  - **Context:** `full_name: 'Sarah Johnson',`

- **Line 102:** `fullName`
  - **Suggested Key:** `common.fullname`
  - **Context:** `fullName: 'Sarah Johnson',`

- **Line 103:** `professional_title`
  - **Suggested Key:** `common.professionaltitle`
  - **Context:** `professional_title: 'Senior Attorney',`

- **Line 109:** `jurisdiction`
  - **Suggested Key:** `common.jurisdiction`
  - **Context:** `jurisdiction: 'California',`

- **Line 130:** `clientName`
  - **Suggested Key:** `common.clientname`
  - **Context:** `clientName: 'Michael R.',`

- **Line 136:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Initial estate planning consultation',`

- **Line 141:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Comprehensive document review',`

- **Line 146:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Ongoing legal counsel',`

- **Line 161:** `full_name`
  - **Suggested Key:** `common.fullname`
  - **Context:** `full_name: 'Michael Chen',`

- **Line 162:** `fullName`
  - **Suggested Key:** `common.fullname`
  - **Context:** `fullName: 'Michael Chen',`

- **Line 163:** `professional_title`
  - **Suggested Key:** `common.professionaltitle`
  - **Context:** `professional_title: 'Senior Partner',`

- **Line 164:** `law_firm_name`
  - **Suggested Key:** `common.lawfirmname`
  - **Context:** `law_firm_name: 'LegalEagle Partners',`

- **Line 169:** `jurisdiction`
  - **Suggested Key:** `common.jurisdiction`
  - **Context:** `jurisdiction: 'New York',`

- **Line 190:** `clientName`
  - **Suggested Key:** `common.clientname`
  - **Context:** `clientName: 'Jennifer L.',`

- **Line 196:** `description`
  - **Suggested Key:** `success.description`
  - **Context:** `description: 'Business succession consultation',`

- **Line 201:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Business agreement review',`

- **Line 206:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Corporate counsel retainer',`

- **Line 221:** `full_name`
  - **Suggested Key:** `common.fullname`
  - **Context:** `full_name: 'Emily Rodriguez',`

- **Line 222:** `fullName`
  - **Suggested Key:** `common.fullname`
  - **Context:** `fullName: 'Emily Rodriguez',`

- **Line 223:** `professional_title`
  - **Suggested Key:** `common.professionaltitle`
  - **Context:** `professional_title: 'Elder Law Attorney',`

- **Line 224:** `law_firm_name`
  - **Suggested Key:** `common.lawfirmname`
  - **Context:** `law_firm_name: 'Rodriguez Elder Law',`

- **Line 250:** `clientName`
  - **Suggested Key:** `common.clientname`
  - **Context:** `clientName: 'Robert K.',`

- **Line 256:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Elder care planning session',`

- **Line 261:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Healthcare directive review',`

- **Line 266:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Family legal support',`

### src/components/professional/ConsultationBookingSystem.tsx

- **Line 86:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Phone Consultation',`

- **Line 87:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Professional advice over a secure phone call',`

- **Line 114:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Traditional office consultation',`

- **Line 238:** `Missing required booking fields`
  - **Suggested Key:** `errors.missingRequiredBookingFields`
  - **Context:** `console.error('Missing required booking fields');`

### src/components/professional/CommissionTrackingDashboard.tsx

- **Line 112:** `reviewerName`
  - **Suggested Key:** `common.reviewername`
  - **Context:** `reviewerName: 'Sarah Johnson',`

- **Line 113:** `clientName`
  - **Suggested Key:** `common.clientname`
  - **Context:** `clientName: 'Michael Chen',`

- **Line 114:** `serviceDescription`
  - **Suggested Key:** `common.servicedescription`
  - **Context:** `serviceDescription: 'Comprehensive estate plan review',`

- **Line 129:** `clientName`
  - **Suggested Key:** `common.clientname`
  - **Context:** `clientName: 'Lisa Rodriguez',`

- **Line 143:** `reviewerName`
  - **Suggested Key:** `common.reviewername`
  - **Context:** `reviewerName: 'Sarah Johnson',`

- **Line 144:** `clientName`
  - **Suggested Key:** `common.clientname`
  - **Context:** `clientName: 'Robert Kim',`

- **Line 145:** `serviceDescription`
  - **Suggested Key:** `common.servicedescription`
  - **Context:** `serviceDescription: 'Monthly legal retainer services',`

- **Line 169:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Sarah Johnson',`

- **Line 446:** `Search commissions...`
  - **Suggested Key:** `common.searchCommissions`
  - **Context:** `placeholder='Search commissions...'`

- **Line 680:** `Growth`
  - **Suggested Key:** `common.growth`
  - **Context:** `{growthRate >= 0 ? 'Growth' : 'Decline'} of{' '}`

### src/components/professional/AttorneyDashboard.tsx

- **Line 194:** `Verified`
  - **Suggested Key:** `common.verified`
  - **Context:** `{reviewer.verified ? 'Verified' : 'Pending Verification'}`

- **Line 323:** `Search reviews...`
  - **Suggested Key:** `common.searchReviews`
  - **Context:** `placeholder='Search reviews...'`

- **Line 336:** `Priority`
  - **Suggested Key:** `common.priority`
  - **Context:** `<SelectValue placeholder='Priority' />`

- **Line 349:** `Status`
  - **Suggested Key:** `common.status`
  - **Context:** `<SelectValue placeholder='Status' />`

### src/components/onboarding/OnboardingTooltips.tsx

- **Line 383:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Analytics Dashboard Tour',`

- **Line 391:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Welcome to Analytics!',`

- **Line 400:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Family Protection Score',`

- **Line 416:** `text`
  - **Suggested Key:** `common.text`
  - **Context:** `text: 'View Insights',`

- **Line 417:** `Showing insights panel`
  - **Suggested Key:** `common.showingInsightsPanel`
  - **Context:** `callback: () => console.log('Showing insights panel'),`

- **Line 424:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Family Collaboration Tour',`

- **Line 425:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Discover new ways to collaborate with family members',`

- **Line 432:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Invite Family Members',`

- **Line 441:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Shared Family Timeline',`

- **Line 450:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Document Collaboration',`

### src/components/monitoring/ProductionDashboard.tsx

- **Line 65:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Application Status',`

- **Line 67:** `value`
  - **Suggested Key:** `common.value`
  - **Context:** `value: 'Online',`

- **Line 68:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Web application is responding normally',`

- **Line 72:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Database Connection',`

- **Line 74:** `value`
  - **Suggested Key:** `common.value`
  - **Context:** `value: 'Connected',`

- **Line 75:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Supabase connection is stable',`

- **Line 79:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Authentication Service',`

- **Line 81:** `value`
  - **Suggested Key:** `common.value`
  - **Context:** `value: 'Active',`

- **Line 82:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Clerk authentication is operational',`

- **Line 86:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Error Rate',`

- **Line 89:** `description`
  - **Suggested Key:** `errors.description`
  - **Context:** `description: 'Application error rate in last hour',`

- **Line 93:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'CDN Status',`

- **Line 95:** `value`
  - **Suggested Key:** `common.value`
  - **Context:** `value: 'Operational',`

- **Line 96:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Vercel CDN is serving content globally',`

- **Line 104:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Page Load Time',`

- **Line 111:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'First Contentful Paint',`

- **Line 118:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Largest Contentful Paint',`

- **Line 125:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Cumulative Layout Shift',`

### src/components/monitoring/PerformanceMonitor.tsx

- **Line 48:** `component`
  - **Suggested Key:** `forms.component`
  - **Context:** `// trackAction('monitoring_started', { component: 'PerformanceMonitor' });`

### src/components/mobile/useResponsive.ts

- **Line 68:** `DeviceMotionEvent`
  - **Suggested Key:** `common.devicemotionevent`
  - **Context:** `const hasMotionSupport = 'DeviceMotionEvent' in window;`

- **Line 78:** `Notification`
  - **Suggested Key:** `common.notification`
  - **Context:** `const hasNotifications = 'Notification' in window;`

### src/components/mobile/ResponsiveLayout.tsx

- **Line 183:** `DeviceMotionEvent`
  - **Suggested Key:** `common.devicemotionevent`
  - **Context:** `const hasMotionSupport = 'DeviceMotionEvent' in window;`

- **Line 193:** `Notification`
  - **Suggested Key:** `common.notification`
  - **Context:** `const hasNotifications = 'Notification' in window;`

### src/components/mobile/MobileFamilyCollaboration.tsx

- **Line 72:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Sarah Johnson',`

- **Line 85:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Mike Johnson',`

- **Line 97:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Emma Johnson',`

- **Line 113:** `user`
  - **Suggested Key:** `common.user`
  - **Context:** `user: 'Sarah Johnson',`

- **Line 120:** `user`
  - **Suggested Key:** `common.user`
  - **Context:** `user: 'Mike Johnson',`

- **Line 127:** `user`
  - **Suggested Key:** `common.user`
  - **Context:** `user: 'Emma Johnson',`

### src/components/milestones/LegacyProgressVisualization.tsx

- **Line 129:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Seeds planted',`

- **Line 134:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'First growth',`

- **Line 139:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Growing strong',`

- **Line 144:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Beautiful blooms',`

- **Line 149:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Full flourish',`

### src/components/marketing/FeatureAnnouncement.tsx

- **Line 78:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Advanced Family Collaboration',`

- **Line 93:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Professional Review Network',`

### src/components/legacy/WillWizard.tsx

- **Line 171:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `//   { value: 'US-California', label: 'California, USA' },`

- **Line 172:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `//   { value: 'US-Texas', label: 'Texas, USA' },`

- **Line 174:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `//   { value: 'US-NewYork', label: 'New York, USA' },`

- **Line 175:** `value`
  - **Suggested Key:** `common.value`
  - **Context:** `//   { value: 'Slovakia', label: 'Slovakia' },`

- **Line 175:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `//   { value: 'Slovakia', label: 'Slovakia' },`

- **Line 176:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `//   { value: 'Czech-Republic', label: 'Czech Republic' },`

- **Line 177:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `//   { value: 'UK', label: 'United Kingdom' },`

- **Line 178:** `value`
  - **Suggested Key:** `common.value`
  - **Context:** `//   { value: 'Canada', label: 'Canada' },`

- **Line 178:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `//   { value: 'Canada', label: 'Canada' },`

- **Line 179:** `value`
  - **Suggested Key:** `common.value`
  - **Context:** `//   { value: 'Australia', label: 'Australia' },`

- **Line 179:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `//   { value: 'Australia', label: 'Australia' },`

### src/components/legacy/WillUpgradeIntegration.tsx

- **Line 111:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Family Tree Visualization',`

- **Line 121:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Curated will templates with version comparison',`

- **Line 131:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Memory prompts and time capsule creation for loved ones',`

- **Line 140:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Professional Review Network',`

- **Line 141:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Connect with attorneys, estate planners, and notaries',`

- **Line 386:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Slovak',`

- **Line 388:** `jurisdiction`
  - **Suggested Key:** `common.jurisdiction`
  - **Context:** `jurisdiction: 'Slovakia',`

- **Line 394:** `jurisdiction`
  - **Suggested Key:** `common.jurisdiction`
  - **Context:** `jurisdiction: 'Czech Republic',`

- **Line 398:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'English',`

- **Line 400:** `jurisdiction`
  - **Suggested Key:** `common.jurisdiction`
  - **Context:** `jurisdiction: 'International',`

- **Line 404:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'German',`

- **Line 406:** `jurisdiction`
  - **Suggested Key:** `common.jurisdiction`
  - **Context:** `jurisdiction: 'Germany',`

### src/components/legacy/WillTemplateLibrary.tsx

- **Line 165:** `Search templates...`
  - **Suggested Key:** `common.searchTemplates`
  - **Context:** `placeholder='Search templates...'`

- **Line 178:** `All categories`
  - **Suggested Key:** `common.allCategories`
  - **Context:** `<SelectValue placeholder='All categories' />`

### src/components/legacy/ValidationIndicator.tsx

- **Line 194:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Partially Compliant',`

- **Line 200:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Fully Compliant',`

### src/components/legacy/SofiaCorrectnessCheck.tsx

- **Line 58:** `actionText`
  - **Suggested Key:** `common.actiontext`
  - **Context:** `actionText: 'Fix Now',`

- **Line 68:** `actionText`
  - **Suggested Key:** `common.actiontext`
  - **Context:** `actionText: 'Review',`

- **Line 75:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'No inheritance percentages specified',`

- **Line 76:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'You need to specify how your assets will be distributed.',`

- **Line 77:** `actionText`
  - **Suggested Key:** `common.actiontext`
  - **Context:** `actionText: 'Add Now',`

- **Line 106:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'You have appointed an executor',`

- **Line 113:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'No executor appointed',`

- **Line 116:** `actionText`
  - **Suggested Key:** `common.actiontext`
  - **Context:** `actionText: 'Add Executor',`

- **Line 130:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'All beneficiaries need complete names for legal clarity.',`

- **Line 131:** `actionText`
  - **Suggested Key:** `common.actiontext`
  - **Context:** `actionText: 'Complete Now',`

- **Line 138:** `title`
  - **Suggested Key:** `forms.title`
  - **Context:** `title: 'All beneficiaries have complete information',`

- **Line 149:** `title`
  - **Suggested Key:** `forms.title`
  - **Context:** `title: 'Your personal information is complete',`

- **Line 164:** `actionText`
  - **Suggested Key:** `common.actiontext`
  - **Context:** `actionText: 'Complete Now',`

- **Line 174:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Holographic will requirements',`

- **Line 182:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Witnessed will requirements',`

- **Line 199:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'You have documented your assets',`

- **Line 207:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'No specific assets documented',`

- **Line 210:** `actionText`
  - **Suggested Key:** `common.actiontext`
  - **Context:** `actionText: 'Add Assets',`

### src/components/legacy/ProfessionalReviewButton.tsx

- **Line 51:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Legal Compliance',`

- **Line 52:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Ensure your documents meet all legal requirements',`

- **Line 56:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Expert Analysis',`

- **Line 57:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Get insights from licensed estate planning attorneys',`

- **Line 61:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Peace of Mind',`

### src/components/legacy/IntelligentWillDraftGenerator.tsx

- **Line 184:** `reasoning`
  - **Suggested Key:** `common.reasoning`
  - **Context:** `reasoning: `Your children are protected heirs under law and should receive equal shares.`,`

- **Line 198:** `reasoning`
  - **Suggested Key:** `common.reasoning`
  - **Context:** `reasoning: `In absence of spouse and children, parents are natural beneficiaries.`,`

- **Line 356:** `citizenship`
  - **Suggested Key:** `common.citizenship`
  - **Context:** `citizenship: 'Slovak',`

- **Line 640:** `Primary`
  - **Suggested Key:** `common.primary`
  - **Context:** `{index === 0 ? 'Primary' : 'Backup'}`

### src/components/legacy/FamilyTreeVisualization.tsx

- **Line 248:** `Full name`
  - **Suggested Key:** `common.fullName`
  - **Context:** `placeholder='Full name'`

- **Line 260:** `Select relationship`
  - **Suggested Key:** `forms.selectRelationship`
  - **Context:** `<SelectValue placeholder='Select relationship' />`

### src/components/legacy/EnhancedWillWizardWithValidation.tsx

- **Line 114:** `jurisdiction`
  - **Suggested Key:** `common.jurisdiction`
  - **Context:** `jurisdiction: 'Slovakia',`

### src/components/legacy/EmotionalGuidanceSystem.tsx

- **Line 637:** `Take your time to reflect and share your thoughts...`
  - **Suggested Key:** `common.takeYourTimeToReflectAndShareYourThoughts`
  - **Context:** `placeholder='Take your time to reflect and share your thoughts...'`

- **Line 728:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `{ value: 'birthday', label: 'Birthday' },`

- **Line 729:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `{ value: 'wedding', label: 'Wedding Day' },`

- **Line 730:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `{ value: 'graduation', label: 'Graduation' },`

- **Line 731:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `{ value: 'first_child', label: 'First Child Born' },`

- **Line 732:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `{ value: 'milestone_birthday', label: 'Milestone Birthday' },`

- **Line 733:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `{ value: 'achievement', label: 'Achievement' },`

- **Line 734:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `{ value: 'difficult_time', label: 'Difficult Times' },`

- **Line 735:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `{ value: 'anniversary', label: 'Anniversary' },`

- **Line 736:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `{ value: 'life_wisdom', label: 'Life Wisdom' },`

- **Line 737:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `{ value: 'family_history', label: 'Family History' },`

- **Line 756:** `Select recipient`
  - **Suggested Key:** `forms.selectRecipient`
  - **Context:** `<SelectValue placeholder='Select recipient' />`

- **Line 791:** `Write your heartfelt message here...`
  - **Suggested Key:** `common.writeYourHeartfeltMessageHere`
  - **Context:** `placeholder='Write your heartfelt message here...'`

### src/components/legacy/CountrySelector.tsx

- **Line 26:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `{ code: 'en' as LanguageCode, name: 'English', flag: '🇬🇧', nativeName: 'English' },`

- **Line 26:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `{ code: 'en' as LanguageCode, name: 'English', flag: '🇬🇧', nativeName: 'English' },`

- **Line 27:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `{ code: 'de' as LanguageCode, name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },`

- **Line 27:** `nativeName`
  - **Suggested Key:** `common.nativename`
  - **Context:** `{ code: 'de' as LanguageCode, name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },`

- **Line 33:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Slovakia',`

- **Line 35:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Slovak legal framework',`

- **Line 41:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Czech Republic',`

- **Line 43:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Czech legal framework',`

- **Line 52:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Slovakia',`

- **Line 55:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Slovak Republic legal framework',`

- **Line 59:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Czech Republic',`

- **Line 62:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Czech Republic legal framework',`

- **Line 69:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'General international framework',`

### src/components/garden/index.ts

- **Line 147:** `milestone`
  - **Suggested Key:** `common.milestone`
  - **Context:** `milestone: 'Beautiful! Another loving step for your family',`

- **Line 148:** `encouragement`
  - **Suggested Key:** `common.encouragement`
  - **Context:** `encouragement: 'Your caring heart is creating something wonderful',`

- **Line 149:** `completion`
  - **Suggested Key:** `common.completion`
  - **Context:** `completion: "Your legacy garden blooms with the love you've planted",`

- **Line 152:** `welcome`
  - **Suggested Key:** `common.welcome`
  - **Context:** `welcome: 'Protection system initialized. Begin data input.',`

- **Line 153:** `milestone`
  - **Suggested Key:** `common.milestone`
  - **Context:** `milestone: 'Milestone achieved. System efficiency improved.',`

- **Line 154:** `encouragement`
  - **Suggested Key:** `common.encouragement`
  - **Context:** `encouragement: 'Consistent progress. Family protection strengthening.',`

- **Line 155:** `completion`
  - **Suggested Key:** `common.completion`
  - **Context:** `completion: 'Full protection matrix operational. Mission complete.',`

- **Line 158:** `welcome`
  - **Suggested Key:** `common.welcome`
  - **Context:** `welcome: 'Your legacy journey begins here',`

- **Line 159:** `milestone`
  - **Suggested Key:** `common.milestone`
  - **Context:** `milestone: 'Excellent progress! Another milestone reached',`

- **Line 161:** `completion`
  - **Suggested Key:** `common.completion`
  - **Context:** `completion: 'Your comprehensive legacy system is complete',`

- **Line 232:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Interactive Living Garden',`

### src/components/garden/LegacyGardenVisualization.tsx

- **Line 234:** `milestone`
  - **Suggested Key:** `common.milestone`
  - **Context:** `milestone: 'Will completed',`

- **Line 265:** `milestone`
  - **Suggested Key:** `common.milestone`
  - **Context:** `milestone: 'Protection foundation built',`

### src/components/garden/GardenOrchestrator.tsx

- **Line 98:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Garden Overview',`

- **Line 101:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Complete garden with weather and elements',`

- **Line 106:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Legacy Tree',`

- **Line 109:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Focused tree growth visualization',`

- **Line 114:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Growth Seed',`

- **Line 117:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Minimalist progress indicator',`

- **Line 122:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Detailed Garden',`

- **Line 125:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Premium detailed visualization',`

- **Line 382:** `Toggle controls`
  - **Suggested Key:** `common.toggleControls`
  - **Context:** `title='Toggle controls'`

### src/components/features/MagicalDocumentUpload.tsx

- **Line 110:** `Sofia`
  - **Suggested Key:** `common.sofia`
  - **Context:** `aria-label="Sofia's welcome animation"`

- **Line 220:** `content`
  - **Suggested Key:** `common.content`
  - **Context:** `content: 'Text content',`

- **Line 231:** `content`
  - **Suggested Key:** `forms.content`
  - **Context:** `content: 'Date information',`

- **Line 242:** `content`
  - **Suggested Key:** `common.content`
  - **Context:** `content: 'Numerical data',`

- **Line 253:** `content`
  - **Suggested Key:** `common.content`
  - **Context:** `content: 'Document details',`

- **Line 545:** `Drag and drop file upload area`
  - **Suggested Key:** `common.dragAndDropFileUploadArea`
  - **Context:** `aria-label='Drag and drop file upload area'`

### src/components/features/IntelligentDocumentUploader.tsx

- **Line 192:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error instanceof Error ? error.message : 'Failed to analyze document'`

### src/components/features/IntelligentDocumentTester.tsx

- **Line 29:** `reasoning`
  - **Suggested Key:** `common.reasoning`
  - **Context:** `reasoning: 'Based on document type and billing period',`

- **Line 35:** `reasoning`
  - **Suggested Key:** `common.reasoning`
  - **Context:** `reasoning: 'Found due date pattern in document text',`

- **Line 39:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Account Number',`

- **Line 45:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Total Amount',`

- **Line 51:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Service Address',`

- **Line 72:** `bundleName`
  - **Suggested Key:** `common.bundlename`
  - **Context:** `bundleName: 'Utility Bills',`

- **Line 88:** `reasoning`
  - **Suggested Key:** `common.reasoning`
  - **Context:** `reasoning: 'Detected property utility bill with specific address',`

- **Line 109:** `reasoning`
  - **Suggested Key:** `common.reasoning`
  - **Context:** `reasoning: 'This appears to be a new monthly utility bill',`

- **Line 110:** `suggestedArchiveReason`
  - **Suggested Key:** `common.suggestedarchivereason`
  - **Context:** `suggestedArchiveReason: 'Previous month billing cycle',`

- **Line 158:** `Test completed! Check console for confirmed data.`
  - **Suggested Key:** `success.testCompletedCheckConsoleForConfirmedData`
  - **Context:** `alert('Test completed! Check console for confirmed data.');`

### src/components/features/EnhancedDocumentUploader.tsx

- **Line 238:** `Enter document title`
  - **Suggested Key:** `forms.enterDocumentTitle`
  - **Context:** `placeholder='Enter document title'`

- **Line 269:** `Select category`
  - **Suggested Key:** `forms.selectCategory`
  - **Context:** `<SelectValue placeholder='Select category' />`

- **Line 311:** `Select document type`
  - **Suggested Key:** `forms.selectDocumentType`
  - **Context:** `<SelectValue placeholder='Select document type' />`

- **Line 407:** `Describe the document...`
  - **Suggested Key:** `common.describeTheDocument`
  - **Context:** `placeholder='Describe the document...'`

### src/components/features/EnhancedDocumentList.tsx

- **Line 178:** `Search documents, text content, or metadata...`
  - **Suggested Key:** `common.searchDocumentsTextContentOrMetadata`
  - **Context:** `placeholder='Search documents, text content, or metadata...'`

- **Line 189:** `Category`
  - **Suggested Key:** `common.category`
  - **Context:** `<SelectValue placeholder='Category' />`

- **Line 214:** `Sort by`
  - **Suggested Key:** `common.sortBy`
  - **Context:** `<SelectValue placeholder='Sort by' />`

### src/components/features/DocumentUploader.tsx

- **Line 169:** `document_type`
  - **Suggested Key:** `common.documenttype`
  - **Context:** `document_type: 'General',`

### src/components/features/DocumentScanner.tsx

- **Line 181:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** ``Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}``

- **Line 286:** `Document preview`
  - **Suggested Key:** `common.documentPreview`
  - **Context:** `alt='Document preview'`

- **Line 618:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Overview',`

- **Line 623:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Extracted Text',`

- **Line 628:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Entities',`

- **Line 633:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Metadata',`

### src/components/features/DocumentList.tsx

- **Line 77:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `setError(err instanceof Error ? err.message : 'Unknown error occurred');`

- **Line 93:** `document_type`
  - **Suggested Key:** `common.documenttype`
  - **Context:** `document_type: 'General',`

### src/components/features/DocumentConfirmation.tsx

- **Line 308:** `Document title`
  - **Suggested Key:** `common.documentTitle`
  - **Context:** `placeholder='Document title'`

- **Line 643:** `Bundle name`
  - **Suggested Key:** `common.bundleName`
  - **Context:** `placeholder='Bundle name'`

### src/components/family/SharedFamilyCalendar.tsx

- **Line 98:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Birthday',`

- **Line 103:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Anniversary',`

- **Line 108:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Document Expiry',`

- **Line 113:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Appointment',`

- **Line 118:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Milestone',`

- **Line 123:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Custom Event',`

- **Line 247:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Success',`

- **Line 248:** `description`
  - **Suggested Key:** `success.description`
  - **Context:** `description: 'Event created successfully!',`

- **Line 254:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Failed to create event. Please try again.',`

- **Line 353:** `Enter event title...`
  - **Suggested Key:** `forms.enterEventTitle`
  - **Context:** `placeholder='Enter event title...'`

- **Line 430:** `Add event details...`
  - **Suggested Key:** `common.buttons.addEventDetails`
  - **Context:** `placeholder='Add event details...'`

### src/components/family/PersonRoleAssignment.tsx

- **Line 348:** `Special instructions for guardianship...`
  - **Suggested Key:** `common.specialInstructionsForGuardianship`
  - **Context:** `placeholder='Special instructions for guardianship...'`

- **Line 484:** `Full address...`
  - **Suggested Key:** `common.fullAddress`
  - **Context:** `placeholder='Full address...'`

### src/components/family/MultiGenerationalDocumentSharing.tsx

- **Line 489:** `Search documents...`
  - **Suggested Key:** `common.searchDocuments`
  - **Context:** `placeholder='Search documents...'`

- **Line 499:** `Filter by generation`
  - **Suggested Key:** `common.filterByGeneration`
  - **Context:** `<SelectValue placeholder='Filter by generation' />`

- **Line 513:** `Filter by type`
  - **Suggested Key:** `common.filterByType`
  - **Context:** `<SelectValue placeholder='Filter by type' />`

- **Line 527:** `Sort by`
  - **Suggested Key:** `common.sortBy`
  - **Context:** `<SelectValue placeholder='Sort by' />`

### src/components/family/LegacyStoryCreation.tsx

- **Line 87:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Childhood Memories',`

- **Line 88:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Share stories from your childhood that shaped who you are',`

- **Line 101:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Life Lessons',`

- **Line 102:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Important wisdom and lessons learned throughout your life',`

- **Line 119:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Family Traditions',`

- **Line 120:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Preserve family customs, recipes, and special celebrations',`

- **Line 137:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Life Achievements',`

- **Line 138:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Document your proudest moments and accomplishments',`

- **Line 241:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `title: template ? template.name : 'New Legacy Story',`

- **Line 446:** `Story Title`
  - **Suggested Key:** `common.storyTitle`
  - **Context:** `placeholder='Story Title'`

- **Line 457:** `Story description...`
  - **Suggested Key:** `common.storyDescription`
  - **Context:** `placeholder='Story description...'`

- **Line 697:** `Add tags separated by commas`
  - **Suggested Key:** `common.buttons.addTagsSeparatedByCommas`
  - **Context:** `placeholder='Add tags separated by commas'`

- **Line 729:** `Complete`
  - **Suggested Key:** `success.complete`
  - **Context:** `{story.isComplete ? 'Complete' : 'In Progress'}`

### src/components/family/FamilyViralGrowth.tsx

- **Line 63:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Family Foundation',`

- **Line 64:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Invite your first family member',`

- **Line 73:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Core Family Circle',`

- **Line 74:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Build your immediate family circle',`

- **Line 83:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Extended Protection Network',`

- **Line 84:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Create a comprehensive support network',`

- **Line 93:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Legacy Champions',`

- **Line 94:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Build the ultimate family protection circle',`

- **Line 118:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: "Your family's protection could be stronger 🛡️",`

### src/components/family/FamilyTreeVisualization.tsx

- **Line 381:** `Export`
  - **Suggested Key:** `common.export`
  - **Context:** `<SelectValue placeholder='Export' />`

- **Line 435:** `Enter full name`
  - **Suggested Key:** `forms.enterFullName`
  - **Context:** `placeholder='Enter full name'`

- **Line 487:** `Any additional notes...`
  - **Suggested Key:** `common.anyAdditionalNotes`
  - **Context:** `placeholder='Any additional notes...'`

### src/components/family/FamilyMemberDashboard.tsx

- **Line 115:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Resending invitation to join your family legacy',`

### src/components/family/FamilyInvitationFlow.tsx

- **Line 336:** `Enter their full name`
  - **Suggested Key:** `forms.enterTheirFullName`
  - **Context:** `placeholder='Enter their full name'`

- **Line 367:** `Choose access level`
  - **Suggested Key:** `forms.chooseAccessLevel`
  - **Context:** `<SelectValue placeholder='Choose access level' />`

- **Line 423:** `Write a personal message...`
  - **Suggested Key:** `common.writeAPersonalMessage`
  - **Context:** `placeholder='Write a personal message...'`

### src/components/family/FamilyInsights.tsx

- **Line 48:** `action`
  - **Suggested Key:** `common.action`
  - **Context:** `action: 'Assign an executor',`

- **Line 57:** `action`
  - **Suggested Key:** `common.action`
  - **Context:** `action: 'Add heirs',`

- **Line 66:** `action`
  - **Suggested Key:** `common.action`
  - **Context:** `action: 'Assign guardians',`

- **Line 74:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Create legacy messages for your loved ones',`

- **Line 75:** `action`
  - **Suggested Key:** `common.action`
  - **Context:** `action: 'Add legacy messages',`

- **Line 84:** `action`
  - **Suggested Key:** `common.action`
  - **Context:** `action: 'Review family members',`

- **Line 143:** `Assigned`
  - **Suggested Key:** `common.assigned`
  - **Context:** `{insights.executorAssigned ? 'Assigned' : 'Missing'}`

### src/components/family/FamilyDocumentSharing.tsx

- **Line 85:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Trust Documents',`

- **Line 90:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Insurance',`

- **Line 95:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Medical Records',`

- **Line 100:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Financial',`

- **Line 105:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'ID Documents',`

- **Line 113:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'View Only',`

- **Line 114:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Can view documents but cannot edit or download',`

- **Line 119:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Edit Access',`

- **Line 120:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Can view, edit, and download documents',`

- **Line 125:** `label`
  - **Suggested Key:** `common.label`
  - **Context:** `label: 'Emergency Only',`

- **Line 126:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Access only during verified emergency situations',`

- **Line 157:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Last Will and Testament.pdf',`

- **Line 177:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Life Insurance Policy.pdf',`

- **Line 190:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Medical Directives.pdf',`

- **Line 477:** `Filter by sharing`
  - **Suggested Key:** `common.filterBySharing`
  - **Context:** `<SelectValue placeholder='Filter by sharing' />`

- **Line 489:** `Filter by category`
  - **Suggested Key:** `common.filterByCategory`
  - **Context:** `<SelectValue placeholder='Filter by category' />`

### src/components/family/FamilyDecisionTracking.tsx

- **Line 534:** `All Status`
  - **Suggested Key:** `common.allStatus`
  - **Context:** `<SelectValue placeholder='All Status' />`

- **Line 548:** `All Categories`
  - **Suggested Key:** `common.allCategories`
  - **Context:** `<SelectValue placeholder='All Categories' />`

- **Line 987:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'System',`

### src/components/family/FamilyCommunicationCenter.tsx

- **Line 170:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'General',`

- **Line 171:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'General family discussions',`

- **Line 189:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Announcements',`

- **Line 190:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Important family announcements',`

- **Line 483:** `Channel name`
  - **Suggested Key:** `common.channelName`
  - **Context:** `<Input placeholder='Channel name' />`

- **Line 484:** `Channel description`
  - **Suggested Key:** `common.channelDescription`
  - **Context:** `<Textarea placeholder='Channel description' rows={3} />`

- **Line 487:** `Channel type`
  - **Suggested Key:** `common.channelType`
  - **Context:** `<SelectValue placeholder='Channel type' />`

- **Line 514:** `Search messages...`
  - **Suggested Key:** `common.searchMessages`
  - **Context:** `placeholder='Search messages...'`

- **Line 537:** `Announcement title`
  - **Suggested Key:** `common.announcementTitle`
  - **Context:** `<Input placeholder='Announcement title' />`

- **Line 538:** `Announcement content`
  - **Suggested Key:** `common.announcementContent`
  - **Context:** `<Textarea placeholder='Announcement content' rows={4} />`

- **Line 541:** `Priority`
  - **Suggested Key:** `common.priority`
  - **Context:** `<SelectValue placeholder='Priority' />`

- **Line 740:** `Shared`
  - **Suggested Key:** `common.shared`
  - **Context:** `alt='Shared'`

- **Line 868:** `Type a message...`
  - **Suggested Key:** `common.typeAMessage`
  - **Context:** `placeholder='Type a message...'`

### src/components/enhanced/useMockActivities.ts

- **Line 15:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Last Will and Testament uploaded',`

- **Line 20:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'John Doe',`

- **Line 33:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'John Doe',`

- **Line 41:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Guardian assigned to minor children',`

- **Line 46:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'John Doe',`

- **Line 59:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'John Doe',`

### src/components/enhanced/dataTableUtils.tsx

- **Line 23:** `Select all`
  - **Suggested Key:** `forms.selectAll`
  - **Context:** `aria-label='Select all'`

- **Line 30:** `Select row`
  - **Suggested Key:** `forms.selectRow`
  - **Context:** `aria-label='Select row'`

### src/components/enhanced/DataTable.tsx

- **Line 305:** `Select all`
  - **Suggested Key:** `forms.selectAll`
  - **Context:** `aria-label='Select all'`

- **Line 312:** `Select row`
  - **Suggested Key:** `forms.selectRow`
  - **Context:** `aria-label='Select row'`

### src/components/enhanced/ActivityFeed.tsx

- **Line 235:** `action`
  - **Suggested Key:** `common.action`
  - **Context:** `action: 'Document Uploaded',`

- **Line 236:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Birth Certificate was added to your vault',`

- **Line 238:** `category`
  - **Suggested Key:** `common.category`
  - **Context:** `metadata: { category: 'Personal', status: 'OCR Complete' },`

- **Line 238:** `status`
  - **Suggested Key:** `common.status`
  - **Context:** `metadata: { category: 'Personal', status: 'OCR Complete' },`

- **Line 243:** `action`
  - **Suggested Key:** `common.action`
  - **Context:** `action: 'Family Member Added',`

- **Line 244:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Jane Doe was added as a spouse',`

- **Line 246:** `role`
  - **Suggested Key:** `common.role`
  - **Context:** `metadata: { role: 'Spouse', status: 'Active' },`

- **Line 246:** `status`
  - **Suggested Key:** `common.status`
  - **Context:** `metadata: { role: 'Spouse', status: 'Active' },`

- **Line 251:** `action`
  - **Suggested Key:** `common.action`
  - **Context:** `action: 'Guardian Appointed',`

- **Line 252:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'John Smith was designated as an executor',`

- **Line 254:** `permission`
  - **Suggested Key:** `common.permission`
  - **Context:** `metadata: { permission: 'Full Access' },`

- **Line 259:** `action`
  - **Suggested Key:** `common.action`
  - **Context:** `action: 'Security Update',`

- **Line 267:** `action`
  - **Suggested Key:** `common.action`
  - **Context:** `action: 'Will Progress',`

### src/components/emergency/index.ts

- **Line 152:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Family Protection Notification',`

- **Line 153:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'This is a notification from your family protection system.',`

- **Line 163:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Family Shield System',`

### src/components/emergency/EmergencyContactSystem.tsx

- **Line 399:** `subtitle`
  - **Suggested Key:** `common.subtitle`
  - **Context:** `subtitle: 'Your loving network of trusted friends and family',`

- **Line 400:** `addButtonText`
  - **Suggested Key:** `common.buttons.addbuttontext`
  - **Context:** `addButtonText: 'Add a Caring Guardian',`

- **Line 411:** `subtitle`
  - **Suggested Key:** `common.subtitle`
  - **Context:** `subtitle: 'Structured emergency response and notification system',`

- **Line 412:** `addButtonText`
  - **Suggested Key:** `common.buttons.addbuttontext`
  - **Context:** `addButtonText: 'Add Emergency Contact',`

- **Line 423:** `subtitle`
  - **Suggested Key:** `common.subtitle`
  - **Context:** `subtitle: 'Trusted people who can help protect your family',`

- **Line 424:** `addButtonText`
  - **Suggested Key:** `common.buttons.addbuttontext`
  - **Context:** `addButtonText: 'Add Trusted Contact',`

### src/components/emergency/DeadMansSwitchManager.tsx

- **Line 146:** `Error loading Dead Man`
  - **Suggested Key:** `errors.errorLoadingDeadMan`
  - **Context:** `console.error("Error loading Dead Man's Switch status:", err);`

- **Line 148:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `err instanceof Error ? err.message : 'Failed to load switch status'`

- **Line 266:** `statusActive`
  - **Suggested Key:** `common.statusactive`
  - **Context:** `statusActive: 'Your loving protection is active',`

- **Line 267:** `statusInactive`
  - **Suggested Key:** `common.statusinactive`
  - **Context:** `statusInactive: 'Care shield is paused',`

- **Line 268:** `statusPending`
  - **Suggested Key:** `common.statuspending`
  - **Context:** `statusPending: 'Checking on your wellbeing',`

- **Line 269:** `statusTriggered`
  - **Suggested Key:** `common.statustriggered`
  - **Context:** `statusTriggered: 'Emergency care activated',`

- **Line 270:** `activityButton`
  - **Suggested Key:** `common.activitybutton`
  - **Context:** `activityButton: "Let your family know you're safe",`

- **Line 279:** `subtitle`
  - **Suggested Key:** `common.subtitle`
  - **Context:** `subtitle: 'Automated emergency detection and response system',`

- **Line 281:** `statusInactive`
  - **Suggested Key:** `common.statusinactive`
  - **Context:** `statusInactive: 'Protocol disabled',`

- **Line 282:** `statusPending`
  - **Suggested Key:** `common.statuspending`
  - **Context:** `statusPending: 'Verification required',`

- **Line 283:** `statusTriggered`
  - **Suggested Key:** `common.statustriggered`
  - **Context:** `statusTriggered: 'Emergency protocol activated',`

- **Line 284:** `activityButton`
  - **Suggested Key:** `common.activitybutton`
  - **Context:** `activityButton: 'Confirm system status',`

- **Line 293:** `subtitle`
  - **Suggested Key:** `common.subtitle`
  - **Context:** `subtitle: 'Intelligent guardian system that protects your legacy',`

- **Line 294:** `statusActive`
  - **Suggested Key:** `common.statusactive`
  - **Context:** `statusActive: 'Protection system active',`

- **Line 295:** `statusInactive`
  - **Suggested Key:** `common.statusinactive`
  - **Context:** `statusInactive: 'System standby',`

- **Line 296:** `statusPending`
  - **Suggested Key:** `common.statuspending`
  - **Context:** `statusPending: 'Status verification needed',`

- **Line 297:** `statusTriggered`
  - **Suggested Key:** `common.statustriggered`
  - **Context:** `statusTriggered: 'Emergency protection engaged',`

- **Line 298:** `activityButton`
  - **Suggested Key:** `common.activitybutton`
  - **Context:** `activityButton: 'Update protection status',`

- **Line 346:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Status unknown',`

### src/components/email-import/BulkImportSummary.tsx

- **Line 84:** `trust`
  - **Suggested Key:** `common.trust`
  - **Context:** `trust: 'Trust Documents',`

- **Line 85:** `insurance`
  - **Suggested Key:** `common.insurance`
  - **Context:** `insurance: 'Insurance Policies',`

- **Line 86:** `bank_statement`
  - **Suggested Key:** `common.bankstatement`
  - **Context:** `bank_statement: 'Bank Statements',`

- **Line 87:** `investment`
  - **Suggested Key:** `common.investment`
  - **Context:** `investment: 'Investment Records',`

- **Line 88:** `property_deed`
  - **Suggested Key:** `common.propertydeed`
  - **Context:** `property_deed: 'Property Deeds',`

- **Line 89:** `tax_document`
  - **Suggested Key:** `common.taxdocument`
  - **Context:** `tax_document: 'Tax Documents',`

- **Line 90:** `medical`
  - **Suggested Key:** `common.medical`
  - **Context:** `medical: 'Medical Records',`

- **Line 92:** `other`
  - **Suggested Key:** `common.other`
  - **Context:** `other: 'Other Documents',`

### src/components/dashboard/LegacyOverviewSection.tsx

- **Line 82:** `primaryEntity`
  - **Suggested Key:** `common.primaryentity`
  - **Context:** `primaryEntity: 'Chase Bank, Wells Fargo',`

- **Line 90:** `primaryEntity`
  - **Suggested Key:** `common.primaryentity`
  - **Context:** `primaryEntity: 'Dr. Johnson, City Clinic',`

- **Line 98:** `primaryEntity`
  - **Suggested Key:** `common.primaryentity`
  - **Context:** `primaryEntity: 'Mortgage, Insurance',`

### src/components/examples/WillTranslationShowcase.tsx

- **Line 126:** `fullName`
  - **Suggested Key:** `common.fullname`
  - **Context:** `fullName: 'John Smith',`

- **Line 128:** `Republic`
  - **Suggested Key:** `common.republic`
  - **Context:** `address: selectedScenario?.jurisdiction === 'CZ' ? 'Prague, Czech Republic' : 'Bratislava, Slovakia',`

- **Line 129:** `Czech`
  - **Suggested Key:** `common.czech`
  - **Context:** `citizenship: selectedScenario?.jurisdiction === 'CZ' ? 'Czech' : 'Slovak',`

- **Line 130:** `Prague`
  - **Suggested Key:** `common.prague`
  - **Context:** `city: selectedScenario?.jurisdiction === 'CZ' ? 'Prague' : 'Bratislava',`

- **Line 174:** `German`
  - **Suggested Key:** `common.german`
  - **Context:** `selectedScenario.language === 'de' ? 'German' : 'Slovak'}`

- **Line 180:** `Republic`
  - **Suggested Key:** `common.republic`
  - **Context:** `{selectedScenario.jurisdiction === 'CZ' ? 'Czech Republic' : 'Slovakia'}`

- **Line 267:** `recipient`
  - **Suggested Key:** `common.recipient`
  - **Context:** `recipient: 'Jane Doe'`

### src/components/examples/MigratedDocumentList.tsx

- **Line 37:** `Failed to fetch documents`
  - **Suggested Key:** `errors.failedToFetchDocuments`
  - **Context:** `console.error('Failed to fetch documents', error);`

- **Line 50:** `method`
  - **Suggested Key:** `common.method`
  - **Context:** `method: 'DELETE',`

- **Line 63:** `Delete failed`
  - **Suggested Key:** `common.buttons.deleteFailed`
  - **Context:** `console.error('Delete failed', error);`

- **Line 91:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error instanceof Error ? error.message : 'Failed to load documents'`

- **Line 113:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `error instanceof Error ? error.message : 'Failed to delete document'`

- **Line 126:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `setError(error instanceof Error ? error.message : 'Search failed');`

- **Line 138:** `message`
  - **Suggested Key:** `errors.message`
  - **Context:** `setError(error instanceof Error ? error.message : 'Filter failed');`

- **Line 166:** `Search documents...`
  - **Suggested Key:** `common.searchDocuments`
  - **Context:** `placeholder='Search documents...'`

### src/components/examples/JurisdictionAwareWillExample.tsx

- **Line 28:** `address`
  - **Suggested Key:** `common.buttons.address`
  - **Context:** `address: 'Bratislava, Slovensko',`

- **Line 30:** `city`
  - **Suggested Key:** `common.city`
  - **Context:** `city: 'Bratislava',`

### src/components/common/MetaTags.tsx

- **Line 48:** `type`
  - **Suggested Key:** `common.type`
  - **Context:** `'@type': 'WebApplication',`

- **Line 61:** `type`
  - **Suggested Key:** `common.type`
  - **Context:** `'@type': 'AggregateRating',`

### src/components/analytics/LegacyCompletionTracking.tsx

- **Line 135:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Essential Family Protection',`

- **Line 137:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Critical documents and plans every family needs',`

- **Line 147:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Create Basic Will',`

- **Line 163:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Emergency Contact List',`

- **Line 164:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Comprehensive list of emergency contacts for family',`

- **Line 177:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Healthcare Proxy',`

- **Line 178:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Designate someone to make healthcare decisions',`

- **Line 191:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Foundation Builder',`

- **Line 196:** `reward`
  - **Suggested Key:** `common.reward`
  - **Context:** `reward: 'Priority support access',`

- **Line 201:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Family Guardian',`

- **Line 202:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Complete all essential protection items',`

- **Line 205:** `reward`
  - **Suggested Key:** `common.reward`
  - **Context:** `reward: 'Professional review credit',`

- **Line 212:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Financial Legacy Planning',`

- **Line 214:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Comprehensive financial planning and asset management',`

- **Line 224:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Complete Asset Inventory',`

- **Line 225:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Comprehensive list of all assets and accounts',`

- **Line 238:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Review All Beneficiaries',`

- **Line 239:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Update beneficiaries on all accounts and policies',`

- **Line 252:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Financial Foundation',`

- **Line 253:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Complete basic financial planning tasks',`

- **Line 265:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Advanced family collaboration and communication systems',`

- **Line 274:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Establish Family Meetings',`

- **Line 275:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Set up regular family legacy planning discussions',`

- **Line 292:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Complete Essential Protection',`

- **Line 306:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Comprehensive Legacy Plan',`

- **Line 323:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Getting Started',`

- **Line 324:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Complete your first legacy planning task',`

- **Line 333:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Speed Demon',`

- **Line 339:** `reward`
  - **Suggested Key:** `common.reward`
  - **Context:** `reward: 'Priority feature access',`

### src/components/analytics/FamilyProtectionAnalytics.tsx

- **Line 117:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Financial Protection',`

- **Line 141:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Review Life Insurance Coverage',`

- **Line 154:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Legal Documentation',`

- **Line 168:** `impact`
  - **Suggested Key:** `common.impact`
  - **Context:** `impact: 'Current wishes may not be accurately reflected',`

- **Line 176:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Update Will and Estate Plan',`

- **Line 189:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Healthcare Directives',`

- **Line 202:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'No healthcare proxy or living will in place',`

- **Line 212:** `title`
  - **Suggested Key:** `common.title`
  - **Context:** `title: 'Create Healthcare Directives',`

- **Line 213:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Establish healthcare proxy and living will documents',`

### src/lib/emergency/__tests__/emergency-access.test.ts

- **Line 53:** `reason`
  - **Suggested Key:** `common.reason`
  - **Context:** `reason: 'Medical emergency',`

- **Line 78:** `reason`
  - **Suggested Key:** `common.reason`
  - **Context:** `reason: 'Emergency',`

- **Line 95:** `reason`
  - **Suggested Key:** `common.reason`
  - **Context:** `reason: 'Emergency',`

- **Line 136:** `reason`
  - **Suggested Key:** `common.reason`
  - **Context:** `reason: 'Medical',`

- **Line 153:** `reason`
  - **Suggested Key:** `common.reason`
  - **Context:** `reason: 'Emergency',`

- **Line 168:** `reason`
  - **Suggested Key:** `common.reason`
  - **Context:** `reason: 'Emergency',`

- **Line 249:** `location`
  - **Suggested Key:** `common.location`
  - **Context:** `{ timestamp: Date.now(), location: 'New York', action: 'login' },`

- **Line 251:** `location`
  - **Suggested Key:** `common.location`
  - **Context:** `{ timestamp: Date.now() + 2000, location: 'London', action: 'login' },`

- **Line 311:** `medication`
  - **Suggested Key:** `common.medication`
  - **Context:** `medication: 'Heart medication',`

- **Line 322:** `medication`
  - **Suggested Key:** `common.medication`
  - **Context:** `medication: 'Heart medication',`

- **Line 369:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Emergency access requested',`

- **Line 381:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Guardian',`

- **Line 390:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Critical emergency',`

- **Line 414:** `message`
  - **Suggested Key:** `common.message`
  - **Context:** `message: 'Batch notification',`

### src/components/sofia/__tests__/SofiaContextProvider.test.tsx

- **Line 53:** `fullName`
  - **Suggested Key:** `common.fullname`
  - **Context:** `fullName: 'Test User',`

- **Line 201:** `Available`
  - **Suggested Key:** `common.available`
  - **Context:** `{personalityManager ? 'Manager Available' : 'No Manager'}`

### src/components/time-capsule/wizard-steps/RecordingStep.tsx

- **Line 295:** `A brief description of what this message contains...`
  - **Suggested Key:** `common.aBriefDescriptionOfWhatThisMessageContains`
  - **Context:** `placeholder='A brief description of what this message contains...'`

### src/components/legacy/__tests__/WillUpgradeIntegration.test.ts

- **Line 17:** `fullName`
  - **Suggested Key:** `common.fullname`
  - **Context:** `fullName: 'John Doe',`

- **Line 20:** `citizenship`
  - **Suggested Key:** `common.citizenship`
  - **Context:** `citizenship: 'Slovak',`

- **Line 25:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Jane Doe',`

- **Line 33:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'John Doe Jr.',`

- **Line 43:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Family home in Bratislava',`

- **Line 51:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Jane Doe',`

- **Line 59:** `child_name`
  - **Suggested Key:** `common.childname`
  - **Context:** `child_name: 'John Doe Jr.',`

- **Line 62:** `full_name`
  - **Suggested Key:** `common.fullname`
  - **Context:** `full_name: 'Robert Doe',`

- **Line 71:** `funeralWishes`
  - **Suggested Key:** `common.funeralwishes`
  - **Context:** `funeralWishes: 'Funeral expenses to be reasonable and dignified',`

- **Line 74:** `jurisdiction`
  - **Suggested Key:** `common.jurisdiction`
  - **Context:** `jurisdiction: 'Slovakia',`

- **Line 79:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'John Doe Jr.',`

- **Line 84:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Robert Doe',`

- **Line 96:** `fullName`
  - **Suggested Key:** `common.fullname`
  - **Context:** `fullName: 'John Doe',`

- **Line 99:** `citizenship`
  - **Suggested Key:** `common.citizenship`
  - **Context:** `citizenship: 'Slovak',`

- **Line 105:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Jane Doe',`

- **Line 111:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'John Doe Jr.',`

- **Line 119:** `description`
  - **Suggested Key:** `common.description`
  - **Context:** `description: 'Family home in Bratislava',`

- **Line 127:** `make`
  - **Suggested Key:** `common.make`
  - **Context:** `make: 'Toyota',`

- **Line 137:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Jane Doe',`

- **Line 145:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'John Doe Jr.',`

- **Line 150:** `name`
  - **Suggested Key:** `common.name`
  - **Context:** `name: 'Robert Doe',`

- **Line 155:** `funeralWishes`
  - **Suggested Key:** `common.funeralwishes`
  - **Context:** `funeralWishes: 'Funeral expenses to be reasonable and dignified',`

- **Line 158:** `jurisdiction`
  - **Suggested Key:** `common.jurisdiction`
  - **Context:** `jurisdiction: 'Slovakia',`

### src/components/accessibility/__tests__/SkipLinks.test.tsx

- **Line 66:** `Skip links`
  - **Suggested Key:** `common.skipLinks`
  - **Context:** `const nav = container.querySelector('nav[aria-label="Skip links"]');`

## Suggested Translation Keys

Add these keys to your English locale file (`src/i18n/locale/en.json`):

```json

// Add to common section in en.json:
"common": {
  "notes": "notes",
  "buckettype": "buckettype",
  "name": "name",
  "title": "title",
  "statusmessage": "statusMessage",
  "label": "label",
  "spouse": "Spouse",
  "partner": "partner",
  "parent": "parent",
  "sibling": "sibling",
  "grandparent": "grandparent",
  "grandchild": "grandchild",
  "cousin": "cousin",
  "friend": "friend",
  "professional": "professional",
  "type": "type",
  "eventtype": "eventType",
  "preason": "p_reason",
  "bundlename": "bundleName",
  "description": "description",
  "pbundlename": "p_bundle_name",
  "fullname": "fullName",
  "primary": "Primary",
  "specificbequests": "specificBequests",
  "signature": "signature",
  "witnesses": "witnesses",
  "documenttitle": "documentTitle",
  "headertext": "headerText",
  "personalinfo": "personalInfo",
  "revocation": "revocation",
  "beneficiaries": "beneficiaries",
  "forcedheirs": "forcedHeirs",
  "executor": "executor",
  "guardianship": "guardianship",
  "finalwishes": "finalWishes",
  "holographicrequirements": "holographicRequirements",
  "placeofbirth": "placeOfBirth",
  "citizenship": "citizenship",
  "threattype": "threatType",
  "country": "Country",
  "message": "message",
  "subject": "subject",
  "buttons.nextaction": "nextAction",
  "familyMembersTableNotAvailableUsingFallback": "Family members table not available, using fallback",
  "celebrationmessage": "celebrationMessage",
  "actiontext": "actionText",
  "reason": "reason",
  "area": "area",
  "risk": "risk",
  "recommendation": "recommendation",
  "pending": "pending",
  "inprogress": "in_progress",
  "buttons.cancelled": "cancelled",
  "needsrevision": "needs_revision",
  "underreview": "under_review",
  "rejected": "rejected",
  "ocrServiceNotAvailableReturningFallbackResponse": "OCR service not available, returning fallback response",
  "emotionalframing": "emotionalFraming",
  "emotionalbenefit": "emotionalBenefit",
  "birthplace": "birthPlace",
  "model": "model",
  "city": "city",
  "testatorname": "testatorName",
  "category": "category",
  "username": "userName",
  "delivered": "DELIVERED",
  "testDocumentpdf": "Test Document.pdf",
  "securityDeepDive": "Security Deep Dive",
  "active": "Active",
  "relationship": "relationship",
  "changelabel": "changeLabel",
  "guardian": "guardian",
  "author": "author",
  "publishdate": "publishDate",
  "legalreference": "legalReference",
  "jurisdiction": "jurisdiction",
  "rationale": "rationale",
  "youngprofessional": "young_professional",
  "newparent": "new_parent",
  "establishedfamily": "established_family",
  "blendedfamily": "blended_family",
  "businessowner": "business_owner",
  "retiree": "retiree",
  "singleparent": "single_parent",
  "childlesscouple": "childless_couple",
  "charitablefocused": "charitable_focused",
  "international": "international",
  "autosuggestion": "autoSuggestion",
  "textKey": "Text key ",
  "code": "code",
  "noRefreshTokenAvailable": "No refresh token available",
  "suggestedaction": "suggestedAction",
  "optimization": "optimization",
  "beneficiary": "beneficiary",
  "text": "text",
  "primaryentity": "primaryEntity",
  "displayname": "displayName",
  "generatelegacyletter": "generate_legacy_letter",
  "generatefinancialsummary": "generate_financial_summary",
  "question": "question",
  "fallingBackToMockResponse": "Falling back to mock response",
  "emotionalmessage": "emotional_message",
  "members": "members",
  "person": "Person",
  "value": "value",
  "action": "action",
  "impact": "impact",
  "firmname": "firmName",
  "service": "service",
  "firm": "firm",
  "completionmessage": "completionMessage",
  "will": "will",
  "testator": "testator",
  "inheritance": "inheritance",
  "estate": "estate",
  "property": "property",
  "share": "share",
  "percentage": "percentage",
  "reservedportion": "reserved_portion",
  "husband": "husband",
  "wife": "wife",
  "daughter": "daughter",
  "mother": "mother",
  "brother": "brother",
  "sister": "sister",
  "milestone": "milestone",
  "suggestion": "suggestion",
  "primarymessage": "primary_message",
  "keysLocked": "Keys locked",
  "slovakia": "Slovakia",
  "contract": "contract",
  "receipt": "receipt",
  "powerofattorney": "power_of_attorney",
  "livingwill": "living_will",
  "divorcedecree": "divorce_decree",
  "adoptionpapers": "adoption_papers",
  "investmentaccount": "investment_account",
  "retirementaccount": "retirement_account",
  "taxreturn": "tax_return",
  "loandocument": "loan_document",
  "mortgage": "mortgage",
  "creditcardstatement": "credit_card_statement",
  "financialstatement": "financial_statement",
  "prescription": "prescription",
  "medicaldirective": "medical_directive",
  "healthinsurancecard": "health_insurance_card",
  "vaccinationrecord": "vaccination_record",
  "healthinsurance": "health_insurance",
  "autoinsurance": "auto_insurance",
  "disabilityinsurance": "disability_insurance",
  "socialsecuritycard": "social_security_card",
  "militaryrecords": "military_records",
  "propertytax": "property_tax",
  "utilitybill": "utility_bill",
  "businesslicense": "business_license",
  "businesscontract": "business_contract",
  "businesstax": "business_tax",
  "governmentbenefit": "government_benefit",
  "voterregistration": "voter_registration",
  "warranty": "warranty",
  "manual": "manual",
  "correspondence": "correspondence",
  "documentPreview": "Document preview",
  "customlabel": "customLabel",
  "icon": "icon",
  "emergencyAccessServiceInitialized": "Emergency access service initialized",
  "collaborationServiceInitialized": "Collaboration service initialized",
  "event": "event",
  "startingKeyRotation": "Starting key rotation...",
  "notificationsTableNotAvailableSkippingStorage": "Notifications table not available, skipping storage",
  "serviceWorkerNotSupported": "Service Worker not supported",
  "pwaInstallPromptAvailable": "PWA install prompt available",
  "applicationBackOnline": "Application back online",
  "applicationOffline": "Application offline",
  "pushNotificationsNotSupported": "Push notifications not supported",
  "existingPushSubscriptionFound": "Existing push subscription found",
  "body": "body",
  "hasnotifications": "hasNotifications",
  "pushSubscriptionSentToServer": "Push subscription sent to server",
  "unsubscribedFromPushNotifications": "Unsubscribed from push notifications",
  "pushNotificationServiceInitialized": "Push notification service initialized",
  "notificationPermissionDenied": "Notification permission denied",
  "notificationPermissionNotGranted": "Notification permission not granted",
  "notificationsDisabledByUser": "Notifications disabled by user",
  "notificationBlockedByQuietHours": "Notification blocked by quiet hours",
  "notificationPreferencesUpdated": "Notification preferences updated",
  "foundExistingPushSubscription": "Found existing push subscription",
  "allOfflineDataCleared": "All offline data cleared",
  "yourProfessionalReviewRequestHasBeenSubmitted": "Your Professional Review Request Has Been Submitted",
  "reminder": "Reminder",
  "analyticsDisabledInDevelopment": "Analytics disabled in development",
  "eventcategory": "event_category",
  "term": "term",
  "definition": "definition",
  "script": "script",
  "nativename": "nativeName",
  "dateformat": "dateFormat",
  "legalsystem": "legalSystem",
  "enforcement": "enforcement",
  "rule": "rule",
  "phase": "phase",
  "approach": "approach",
  "requirement": "requirement",
  "key": "key",
  "justification": "justification",
  "source": "source",
  "current": "current",
  "target": "target",
  "documenttype": "document_type",
  "passed": "PASSED",
  "firstreminder": "first_reminder",
  "urgentreminder": "urgent_reminder",
  "inactivitydetected": "inactivity_detected",
  "manualguardian": "manual_guardian",
  "method": "method",
  "context": "context",
  "resolution": "resolution",
  "reasoning": "reasoning",
  "secondary": "secondary",
  "pdf": "pdf",
  "doc": "doc",
  "docx": "docx",
  "txt": "txt",
  "rtf": "rtf",
  "regulation": "regulation",
  "step": "step",
  "escape": "ESCAPE",
  "arrowup": "ARROW_UP",
  "arrowdown": "ARROW_DOWN",
  "arrowleft": "ARROW_LEFT",
  "arrowright": "ARROW_RIGHT",
  "pageup": "PAGE_UP",
  "pagedown": "PAGE_DOWN",
  "buttons.description": "description",
  "pleaseUploadYourDocument": "Please upload your document",
  "youNeedToUploadYourDocument": "You need to upload your document",
  "greeting": "greeting",
  "celebration": "celebration",
  "content": "content",
  "thisIsSensitiveData": "This is sensitive data",
  "yourFullLegalName": "Your full legal name",
  "cityCountry": "City, Country",
  "streetAddress": "Street address",
  "postalCode": "Postal code",
  "child": "Child",
  "email": "Email",
  "placeholder": "placeholder",
  "children": "children",
  "describeYourFamilyGroup": "Describe your family group...",
  "buttons.addAMessageForTheRecipients": "Add a message for the recipients...",
  "buttons.addANote": "Add a note...",
  "orTypeYourOwnQuestion": "Or type your own question...",
  "askSofiaAnything": "Ask Sofia anything...",
  "device": "device",
  "location": "location",
  "status": "status",
  "available": "Available",
  "anySpecificConcernsQuestionsOrAreasYou": "Any specific concerns, questions, or areas you",
  "shareYourExperienceWithThisProfessionalReview": "Share your experience with this professional review...",
  "searchRequests": "Search requests...",
  "professionaltitle": "professional_title",
  "timeline": "timeline",
  "lawfirmname": "law_firm_name",
  "estatePlanningFamilyLawElderLaw": "Estate Planning, Family Law, Elder Law...",
  "clientname": "clientName",
  "reviewername": "reviewerName",
  "servicedescription": "serviceDescription",
  "searchCommissions": "Search commissions...",
  "growth": "Growth",
  "verified": "Verified",
  "searchReviews": "Search reviews...",
  "priority": "Priority",
  "showingInsightsPanel": "Showing insights panel",
  "devicemotionevent": "DeviceMotionEvent",
  "notification": "Notification",
  "user": "user",
  "searchTemplates": "Search templates...",
  "allCategories": "All Categories",
  "fullName": "Full name",
  "takeYourTimeToReflectAndShareYourThoughts": "Take your time to reflect and share your thoughts...",
  "writeYourHeartfeltMessageHere": "Write your heartfelt message here...",
  "encouragement": "encouragement",
  "completion": "completion",
  "welcome": "welcome",
  "toggleControls": "Toggle controls",
  "sofia": "Sofia",
  "dragAndDropFileUploadArea": "Drag and drop file upload area",
  "suggestedarchivereason": "suggestedArchiveReason",
  "describeTheDocument": "Describe the document...",
  "searchDocumentsTextContentOrMetadata": "Search documents, text content, or metadata...",
  "sortBy": "Sort by",
  "documentTitle": "Document title",
  "bundleName": "Bundle name",
  "buttons.addEventDetails": "Add event details...",
  "specialInstructionsForGuardianship": "Special instructions for guardianship...",
  "fullAddress": "Full address...",
  "searchDocuments": "Search documents...",
  "filterByGeneration": "Filter by generation",
  "filterByType": "Filter by type",
  "storyTitle": "Story Title",
  "storyDescription": "Story description...",
  "buttons.addTagsSeparatedByCommas": "Add tags separated by commas",
  "export": "Export",
  "anyAdditionalNotes": "Any additional notes...",
  "writeAPersonalMessage": "Write a personal message...",
  "assigned": "Assigned",
  "filterBySharing": "Filter by sharing",
  "filterByCategory": "Filter by category",
  "allStatus": "All Status",
  "channelName": "Channel name",
  "channelDescription": "Channel description",
  "channelType": "Channel type",
  "searchMessages": "Search messages...",
  "announcementTitle": "Announcement title",
  "announcementContent": "Announcement content",
  "shared": "Shared",
  "typeAMessage": "Type a message...",
  "role": "role",
  "permission": "permission",
  "subtitle": "subtitle",
  "buttons.addbuttontext": "addButtonText",
  "statusactive": "statusActive",
  "statusinactive": "statusInactive",
  "statuspending": "statusPending",
  "statustriggered": "statusTriggered",
  "activitybutton": "activityButton",
  "trust": "trust",
  "insurance": "insurance",
  "bankstatement": "bank_statement",
  "investment": "investment",
  "propertydeed": "property_deed",
  "taxdocument": "tax_document",
  "medical": "medical",
  "other": "other",
  "republic": "Republic",
  "czech": "Czech",
  "prague": "Prague",
  "german": "German",
  "recipient": "recipient",
  "buttons.deleteFailed": "Delete failed",
  "buttons.address": "address",
  "reward": "reward",
  "medication": "medication",
  "aBriefDescriptionOfWhatThisMessageContains": "A brief description of what this message contains...",
  "childname": "child_name",
  "funeralwishes": "funeralWishes",
  "make": "make",
  "skipLinks": "Skip links",
},

// Add to forms section in en.json:
"forms": {
  "sensitiveInformation": "Sensitive information",
  "title": "title",
  "action": "action",
  "enterEmailToTest": "Enter email to test",
  "active": "Active",
  "uppercase": "uppercase",
  "lowercase": "lowercase",
  "number": "number",
  "specialchar": "specialChar",
  "required": "required",
  "confirm": "confirm",
  "nomatch": "noMatch",
  "current": "current",
  "confirmnew": "confirmNew",
  "mustbedifferent": "mustBeDifferent",
  "firstrequired": "firstRequired",
  "lastrequired": "lastRequired",
  "mustaccept": "mustAccept",
  "resetrequired": "resetRequired",
  "text": "text",
  "name": "name",
  "description": "description",
  "area": "area",
  "component": "component",
  "selectRelationship": "Select relationship",
  "selectRecipient": "Select recipient",
  "content": "content",
  "enterDocumentTitle": "Enter document title",
  "selectCategory": "Select category",
  "selectDocumentType": "Select document type",
  "enterEventTitle": "Enter event title...",
  "enterFullName": "Enter full name",
  "enterTheirFullName": "Enter their full name",
  "chooseAccessLevel": "Choose access level",
  "selectAll": "Select all",
  "selectRow": "Select row",
},

// Add to errors section in en.json:
"errors": {
  "error": "error",
  "message": "message",
  "stripeNotLoaded": "Stripe not loaded",
  "userNotAuthenticated": "User not authenticated",
  "missingSupabaseEnvironmentVariables": "Missing Supabase environment variables",
  "encryptionKeyNotAvailable": "Encryption key not available",
  "geolocationDetectionFailedUsingDefault": "Geolocation detection failed, using default",
  "failedToLoadPricingPlans": "Failed to load pricing plans",
  "pleaseSignInToSubscribe": "Please sign in to subscribe",
  "failedToStartCheckoutProcess": "Failed to start checkout process",
  "healthcheckfailure": "health_check_failure",
  "missingRequiredBookingFields": "Missing required booking fields",
  "description": "description",
  "errorLoadingDeadMan": "Error loading Dead Man",
  "failedToFetchDocuments": "Failed to fetch documents",
},

// Add to success section in en.json:
"success": {
  "completed": "completed",
  "message": "message",
  "description": "description",
  "keyRotationCompleted": "Key rotation completed",
  "pwaServiceInitializedSuccessfully": "PWA Service initialized successfully",
  "serviceWorkerRegisteredSuccessfully": "Service Worker registered successfully",
  "pwaInstalledSuccessfully": "PWA installed successfully",
  "successfullySubscribedToPushNotifications": "Successfully subscribed to push notifications",
  "successfullyUnsubscribedFromPushNotifications": "Successfully unsubscribed from push notifications",
  "body": "body",
  "indexeddbInitializedSuccessfully": "IndexedDB initialized successfully",
  "testCompletedCheckConsoleForConfirmedData": "Test completed! Check console for confirmed data.",
  "complete": "Complete",
},

// Add to navigation section in en.json:
"navigation": {
  "message": "message",
  "homeinsurance": "home_insurance",
  "homeappraisal": "home_appraisal",
},

// Add to warnings section in en.json:
"warnings": {
  "finalwarning": "final_warning",
},
```

## Migration Instructions

1. **Add Translation Keys**: Copy the suggested keys to your `en.json` file
2. **Import Translation Hook**: Add `import { useTranslation } from '@/i18n/useTranslation';` to components
3. **Add Hook Usage**: Add `const { t } = useTranslation();` inside components
4. **Replace Strings**: Replace hardcoded strings with `{t('suggested.key')}`
5. **Test**: Verify that all translations display correctly

