#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔍 Applying final fixes for remaining TypeScript errors...');

const edits = [
  // Fix motion props in GardenOrchestrator
  {
    file: 'web/src/components/garden/GardenOrchestrator.tsx',
    replacements: [
      { from: 'whileHover={!shouldReduceMotion ? { scale: 1.05 } : false}', to: 'whileHover={!shouldReduceMotion ? { scale: 1.05 } : undefined}' },
      { from: 'whileTap={!shouldReduceMotion ? { scale: 0.95 } : false}', to: 'whileTap={!shouldReduceMotion ? { scale: 0.95 } : undefined}' },
      { from: 'exit={!shouldReduceMotion ? { opacity: 0, scale: 1.05 } : false}', to: 'exit={!shouldReduceMotion ? { opacity: 0, scale: 1.05 } : undefined}' }
    ]
  },
  
  // Fix incorrect import renames
  {
    file: 'web/src/hooks/encryption/useEncryptionHooks.ts',
    replacements: [
      { from: 'import { _useContext, useEffect } from \'react\'', to: 'import { useContext, useEffect } from \'react\'' }
    ]
  },
  
  {
    file: 'web/src/hooks/useSecureEncryption.ts',
    replacements: [
      { from: 'type _KeyPurpose', to: 'type KeyPurpose' }
    ]
  },
  
  // Fix property access
  {
    file: 'web/src/lib/sofia-memory.ts',
    replacements: [
      { from: 'this.userId = userId', to: 'this._userId = userId' }
    ]
  },
  
  {
    file: 'web/src/services/ocrService.ts',
    replacements: [
      { from: 'this.projectId =', to: 'this._projectId =' }
    ]
  },
  
  // Fix test documents variable name
  {
    file: 'web/src/lib/emergency/testing-system.ts',
    replacements: [
      { from: 'let ___testDocuments', to: 'let __testDocuments' },
      { from: '___testDocuments', to: '__testDocuments' }
    ]
  },
  
  // Fix milestone service
  {
    file: 'web/src/services/realMilestonesService.ts',
    replacements: [
      { from: 'event.user_id', to: 'event.userId' }
    ]
  },
  
  // Fix destructuring
  {
    file: 'web/src/components/professional/ProfessionalReviewPricing.tsx',
    replacements: [
      { from: '_documentType = \'will\'', to: 'documentType: _documentType = \'will\'' }
    ]
  },
  
  {
    file: 'web/src/lib/ai/smartSearch.ts',
    replacements: [
      { from: '_includeAnalysis = false', to: 'includeAnalysis: _includeAnalysis = false' }
    ]
  },
  
  // Fix stripe service
  {
    file: 'web/src/services/StripeService.ts',
    replacements: [
      { from: 'expiresAt: data.expires_at', to: 'expiresAt: data.current_period_end' }
    ]
  }
];

let totalFixed = 0;

for (const edit of edits) {
  const fullPath = path.join(process.cwd(), edit.file);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${edit.file}`);
    continue;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let fixCount = 0;
  
  for (const { from, to } of edit.replacements) {
    const regex = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const before = content.length;
    content = content.replace(regex, to);
    if (content.length !== before) fixCount++;
  }
  
  if (fixCount > 0) {
    fs.writeFileSync(fullPath, content);
    console.log(`✏️  Fixed ${fixCount} issues in ${edit.file}`);
    totalFixed += fixCount;
  }
}

console.log(`\n✅ Applied ${totalFixed} fixes`);
console.log('🔄 Run "npx tsc --noEmit" to verify');
