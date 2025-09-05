#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔍 Analyzing remaining TypeScript errors...');

// Get all TypeScript errors
const output = execSync('npx tsc --noEmit 2>&1 || true', { encoding: 'utf8' });
const lines = output.split('\n');

// Group fixes by file
const fixes = {
  // Fix motion whileHover/whileTap props (false -> undefined)
  'web/src/components/garden/GardenOrchestrator.tsx': [
    { search: 'whileHover={isInteractive ? { scale: 1.05 } : false}', replace: 'whileHover={isInteractive ? { scale: 1.05 } : undefined}' },
    { search: 'whileTap={isInteractive ? { scale: 0.95 } : false}', replace: 'whileTap={isInteractive ? { scale: 0.95 } : undefined}' },
    { search: 'whileHover={isReady ? { opacity: 1, scale: 1.05 } : false}', replace: 'whileHover={isReady ? { opacity: 1, scale: 1.05 } : undefined}' }
  ],

  // Fix incorrectly renamed imports
  'web/src/hooks/encryption/useEncryptionHooks.ts': [
    { search: 'import { _useContext } from \'react\'', replace: 'import { useContext } from \'react\'' }
  ],

  'web/src/hooks/useSecureEncryption.ts': [
    { search: 'import { _KeyPurpose }', replace: 'import { KeyPurpose }' }
  ],

  // Fix private member access
  'web/src/lib/emergency/emergency-service.ts': [
    { search: 'this.baseUrl', replace: 'this._baseUrl' },
    { search: 'this.isInitialized', replace: 'this._isInitialized' }
  ],

  'web/src/lib/emergency/guardian-notifier.ts': [
    { search: 'this.emailService', replace: 'this._emailService' },
    { search: 'this.smsService', replace: 'this._smsService' }
  ],

  'web/src/lib/enterprise/apiEcosystem.ts': [
    { search: 'this.developerPortal', replace: 'this._developerPortal' }
  ],

  'web/src/lib/professional-review-network.ts': [
    { search: 'this.apiKey', replace: 'this._apiKey' }
  ],

  'web/src/lib/professional/email-notification-service.ts': [
    { search: 'this.apiKey', replace: 'this._apiKey' }
  ],

  'web/src/lib/security/env-config.ts': [
    { search: 'this.validationErrors', replace: 'this._validationErrors' }
  ],

  // Fix typo in variable name
  'web/src/lib/emergency/testing-system.ts': [
    { search: '_testDocuments', replace: '__testDocuments' }
  ],

  // Fix destructured properties
  'web/src/components/professional/ProfessionalReviewPricing.tsx': [
    { search: 'const { _documentType', replace: 'const { documentType: _documentType' }
  ],

  'web/src/lib/ai/smartSearch.ts': [
    { search: 'const { _includeAnalysis', replace: 'const { includeAnalysis: _includeAnalysis' }
  ]
};

// Apply fixes
let totalFixed = 0;
for (const [filePath, fileFixes] of Object.entries(fixes)) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    continue;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let fixCount = 0;
  
  for (const fix of fileFixes) {
    if (content.includes(fix.search)) {
      content = content.replace(new RegExp(fix.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), fix.replace);
      fixCount++;
    }
  }
  
  if (fixCount > 0) {
    fs.writeFileSync(fullPath, content);
    console.log(`✏️  Fixed ${fixCount} issues in ${filePath}`);
    totalFixed += fixCount;
  }
}

console.log(`\n✅ Applied ${totalFixed} fixes`);
console.log('🔄 Run "npx tsc --noEmit" to verify');
