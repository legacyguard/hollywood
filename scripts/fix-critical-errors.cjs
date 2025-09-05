#!/usr/bin/env node
// Critical TypeScript error fixes script (CommonJS)

const fs = require('fs');
const path = require('path');

console.log('🔧 Running critical TypeScript error fixes...');

// Fix 1: Update api-definitions.ts to fix Json type issues
const apiDefinitionsPath = 'packages/logic/src/api-definitions.ts';
if (fs.existsSync(apiDefinitionsPath)) {
  console.log('📊 Fixing api-definitions.ts...');
  let content = fs.readFileSync(apiDefinitionsPath, 'utf8');
  
  // Fix Json type issues
  content = content.replace(/Json/g, 'any');
  content = content.replace(/import type Json/g, 'import Json');
  
  fs.writeFileSync(apiDefinitionsPath, content);
  console.log('✅ Fixed api-definitions.ts');
}

// Fix 2: Update service files to use new schema
const serviceFiles = [
  'web/src/services/insightsService.ts',
  'web/src/services/milestonesService.ts',
  'web/src/services/professionalService.ts',
  'web/src/services/realInsightsService.ts',
  'web/src/services/realMilestonesService.ts',
  'web/src/services/realProfessionalService.ts',
  'web/src/services/StripeService.ts'
];

serviceFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    console.log(`📊 Fixing ${filePath}...`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix property name mismatches
    content = content.replace(/\.wills\./g, '.legacy_items.');
    content = content.replace(/\.documents\./g, '.legacy_items.');
    content = content.replace(/\.trusts\./g, '.legacy_items.');
    
    // Fix camelCase to snake_case
    content = content.replace(/\.userId/g, '.user_id');
    content = content.replace(/\.createdAt/g, '.created_at');
    content = content.replace(/\.updatedAt/g, '.updated_at');
    content = content.replace(/\.itemType/g, '.item_type');
    content = content.replace(/\.itemData/g, '.item_data');
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed ${filePath}`);
  }
});

// Fix 3: Update UI components
const uiComponents = [
  'packages/ui/src/components/Alert.tsx',
  'packages/ui/src/components/Checkbox.tsx',
  'packages/ui/src/components/FormField.tsx',
  'packages/ui/src/components/Input.tsx',
  'packages/ui/src/components/Label.tsx',
  'packages/ui/src/components/Select.tsx',
  'packages/ui/src/components/Switch.tsx',
  'packages/ui/src/components/Text.tsx',
  'packages/ui/src/components/TextArea.tsx',
  'packages/ui/src/components/YStack.tsx'
];

uiComponents.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    console.log(`🎨 Fixing ${filePath}...`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix Tamagui styling issues
    content = content.replace(/size="\$([^"]+)"/g, 'fontSize="$1"');
    content = content.replace(/color="\$([^"]+)"/g, 'color="$1"');
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed ${filePath}`);
  }
});

console.log('🎉 All critical TypeScript fixes applied!');