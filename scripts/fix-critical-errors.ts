#!/usr/bin/env node
// Critical TypeScript error fix script
// This script will fix the most critical TypeScript errors in the codebase

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const rootDir = process.cwd();

// Critical files to fix
const criticalFiles = [
  'packages/logic/src/api-definitions.ts',
  'web/src/services/insightsService.ts',
  'web/src/services/milestonesService.ts',
  'web/src/services/professionalService.ts',
  'web/src/services/realInsightsService.ts',
  'web/src/services/realMilestonesService.ts',
  'web/src/services/realProfessionalService.ts',
  'web/src/services/StripeService.ts'
];

// Fix for api-definitions.ts
function fixApiDefinitions() {
  const filePath = join(rootDir, 'packages/logic/src/api-definitions.ts');
  if (!existsSync(filePath)) return;
  
  let content = readFileSync(filePath, 'utf8');
  
  // Fix Json type issues
  content = content.replace(
    /Json \| undefined/g,
    'Json'
  );
  
  content = content.replace(
    /unknown\[\]/g,
    'Json'
  );
  
  content = content.replace(
    /Record<string, unknown>/g,
    'Json'
  );
  
  writeFileSync(filePath, content);
  console.log('Fixed api-definitions.ts');
}

// Fix for insightsService.ts
function fixInsightsService() {
  const filePath = join(rootDir, 'web/src/services/insightsService.ts');
  if (!existsSync(filePath)) return;
  
  let content = readFileSync(filePath, 'utf8');
  
  // Fix table name issues
  content = content.replace(/from 'wills'/g, "from 'legacy_items'");
  content = content.replace(/from 'documents'/g, "from 'legacy_items'");
  content = content.replace(/from 'trusts'/g, "from 'legacy_items'");
  
  // Fix property name issues
  content = content.replace(/\.createdAt/g, '.created_at');
  content = content.replace(/\.updatedAt/g, '.updated_at');
  content = content.replace(/\.userId/g, '.user_id');
  content = content.replace(/\.fileUrls/g, '.file_urls');
  content = content.replace(/\.isPublic/g, '.is_public');
  content = content.replace(/\.dueDate/g, '.due_date');
  
  // Fix type issues
  content = content.replace(
    /import type \{ ([^}]+) \} from ['"]([^'"]+)['"];/g,
    'import { $1 } from \'$2\';'
  );
  
  writeFileSync(filePath, content);
  console.log('Fixed insightsService.ts');
}

// Fix for milestonesService.ts
function fixMilestonesService() {
  const filePath = join(rootDir, 'web/src/services/milestonesService.ts');
  if (!existsSync(filePath)) return;
  
  let content = readFileSync(filePath, 'utf8');
  
  // Fix table name issues
  content = content.replace(/from 'legacy_milestones'/g, "from 'legacy_items'");
  
  // Fix property name issues
  content = content.replace(/\.createdAt/g, '.created_at');
  content = content.replace(/\.updatedAt/g, '.updated_at');
  content = content.replace(/\.userId/g, '.user_id');
  
  writeFileSync(filePath, content);
  console.log('Fixed milestonesService.ts');
}

// Fix for professionalService.ts
function fixProfessionalService() {
  const filePath = join(rootDir, 'web/src/services/professionalService.ts');
  if (!existsSync(filePath)) return;
  
  let content = readFileSync(filePath, 'utf8');
  
  // Fix property name issues
  content = content.replace(/\.createdAt/g, '.created_at');
  content = content.replace(/\.updatedAt/g, '.updated_at');
  content = content.replace(/\.userId/g, '.user_id');
  content = content.replace(/\.hourlyRate/g, '.hourly_rate');
  content = content.replace(/\.availabilityStatus/g, '.availability_status');
  
  writeFileSync(filePath, content);
  console.log('Fixed professionalService.ts');
}

// Fix for realInsightsService.ts
function fixRealInsightsService() {
  const filePath = join(rootDir, 'web/src/services/realInsightsService.ts');
  if (!existsSync(filePath)) return;
  
  let content = readFileSync(filePath, 'utf8');
  
  // Fix property name issues
  content = content.replace(/\.createdAt/g, '.created_at');
  content = content.replace(/\.updatedAt/g, '.updated_at');
  content = content.replace(/\.userId/g, '.user_id');
  content = content.replace(/\.documentId/g, '.document_id');
  content = content.replace(/\.actionText/g, '.action_text');
  content = content.replace(/\.actionUrl/g, '.action_url');
  
  // Fix type issues
  content = content.replace(
    /import type \{ ([^}]+) \} from ['"]([^'"]+)['"];/g,
    'import { $1 } from \'$2\';'
  );
  
  writeFileSync(filePath, content);
  console.log('Fixed realInsightsService.ts');
}

// Fix for realMilestonesService.ts
function fixRealMilestonesService() {
  const filePath = join(rootDir, 'web/src/services/realMilestonesService.ts');
  if (!existsSync(filePath)) return;
  
  let content = readFileSync(filePath, 'utf8');
  
  // Fix property name issues
  content = content.replace(/\.createdAt/g, '.created_at');
  content = content.replace(/\.updatedAt/g, '.updated_at');
  content = content.replace(/\.userId/g, '.user_id');
  content = content.replace(/\.celebrationColor/g, '.celebration_color');
  content = content.replace(/\.celebrationEmotionalFraming/g, '.celebration_emotional_framing');
  
  writeFileSync(filePath, content);
  console.log('Fixed realMilestonesService.ts');
}

// Fix for realProfessionalService.ts
function fixRealProfessionalService() {
  const filePath = join(rootDir, 'web/src/services/realProfessionalService.ts');
  if (!existsSync(filePath)) return;
  
  let content = readFileSync(filePath, 'utf8');
  
  // Fix property name issues
  content = content.replace(/\.createdAt/g, '.created_at');
  content = content.replace(/\.updatedAt/g, '.updated_at');
  content = content.replace(/\.userId/g, '.user_id');
  content = content.replace(/\.documentId/g, '.document_id');
  content = content.replace(/\.professionalId/g, '.professional_id');
  content = content.replace(/\.consultationType/g, '.consultation_type');
  content = content.replace(/\.durationMinutes/g, '.duration_minutes');
  content = content.replace(/\.hourlyRate/g, '.hourly_rate');
  content = content.replace(/\.availabilityStatus/g, '.availability_status');
  
  writeFileSync(filePath, content);
  console.log('Fixed realProfessionalService.ts');
}

// Fix for StripeService.ts
function fixStripeService() {
  const filePath = join(rootDir, 'web/src/services/StripeService.ts');
  if (!existsSync(filePath)) return;
  
  let content = readFileSync(filePath, 'utf8');
  
  // Fix property name issues
  content = content.replace(/\.createdAt/g, '.created_at');
  content = content.replace(/\.updatedAt/g, '.updated_at');
  content = content.replace(/\.userId/g, '.user_id');
  content = content.replace(/\.stripeSubscriptionId/g, '.stripe_subscription_id');
  content = content.replace(/\.currentPeriodStart/g, '.current_period_start');
  content = content.replace(/\.currentPeriodEnd/g, '.current_period_end');
  content = content.replace(/\.cancelAtPeriodEnd/g, '.cancel_at_period_end');
  
  writeFileSync(filePath, content);
  console.log('Fixed StripeService.ts');
}

// Main execution
console.log('Starting critical TypeScript error fixes...');

try {
  fixApiDefinitions();
  fixInsightsService();
  fixMilestonesService();
  fixProfessionalService();
  fixRealInsightsService();
  fixRealMilestonesService();
  fixRealProfessionalService();
  fixStripeService();
  
  console.log('Critical TypeScript error fixes completed successfully!');
} catch (error) {
  console.error('Error fixing critical TypeScript errors:', error);
  process.exit(1);
}