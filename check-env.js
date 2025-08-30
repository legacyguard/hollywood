#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 * Run this before deployment to ensure all required variables are set
 */

const chalk = require('chalk') || { red: s => s, green: s => s, yellow: s => s, blue: s => s };

// Define required and optional environment variables
const REQUIRED_VARS = [
  'NODE_ENV',
  'VITE_APP_ENV', 
  'VITE_APP_VERSION',
  'VITE_APP_URL',
  'VITE_CLERK_PUBLISHABLE_KEY',
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];

const OPTIONAL_VARS = [
  'VITE_SENTRY_DSN',
  'VITE_ENABLE_ENCRYPTION',
  'VITE_ENABLE_RATE_LIMITING',
  'VITE_ENCRYPTION_KEY',
  'VITE_GOOGLE_CLOUD_PROJECT_ID',
  'VITE_GOOGLE_VISION_API_KEY',
  'VITE_TESSERACT_ENDPOINT',
  'VITE_OPENAI_API_KEY',
  'VITE_PROFESSIONAL_NETWORK_API_KEY',
  'VITE_DEFAULT_JURISDICTION',
  'VITE_API_URL'
];

// Security checks
const SECURITY_CHECKS = {
  'VITE_APP_URL': (value) => {
    if (process.env.NODE_ENV === 'production' && !value.startsWith('https://')) {
      return 'Production URL must use HTTPS';
    }
    return null;
  },
  'VITE_SUPABASE_URL': (value) => {
    if (!value.includes('supabase.co') && !value.includes('supabase.io')) {
      return 'Invalid Supabase URL format';
    }
    return null;
  },
  'VITE_CLERK_PUBLISHABLE_KEY': (value) => {
    if (!value.startsWith('pk_')) {
      return 'Clerk key should start with pk_';
    }
    return null;
  },
  'NODE_ENV': (value) => {
    if (!['development', 'test', 'production'].includes(value)) {
      return 'NODE_ENV must be development, test, or production';
    }
    return null;
  }
};

console.log('🔍 Checking environment variables...\n');

let hasErrors = false;
let hasWarnings = false;

// Check required variables
console.log(chalk.blue('Required Variables:'));
REQUIRED_VARS.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(chalk.red(`  ✗ ${varName} - NOT SET`));
    hasErrors = true;
  } else {
    // Run security check if exists
    const securityCheck = SECURITY_CHECKS[varName];
    if (securityCheck) {
      const error = securityCheck(value);
      if (error) {
        console.log(chalk.red(`  ✗ ${varName} - ${error}`));
        hasErrors = true;
      } else {
        console.log(chalk.green(`  ✓ ${varName} - OK`));
      }
    } else {
      console.log(chalk.green(`  ✓ ${varName} - SET`));
    }
  }
});

console.log('\n' + chalk.blue('Optional Variables:'));
OPTIONAL_VARS.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(chalk.yellow(`  ⚠ ${varName} - Not set (optional)`));
    hasWarnings = true;
  } else {
    // Run security check if exists
    const securityCheck = SECURITY_CHECKS[varName];
    if (securityCheck) {
      const error = securityCheck(value);
      if (error) {
        console.log(chalk.red(`  ✗ ${varName} - ${error}`));
        hasErrors = true;
      } else {
        console.log(chalk.green(`  ✓ ${varName} - OK`));
      }
    } else {
      console.log(chalk.green(`  ✓ ${varName} - SET`));
    }
  }
});

// Production-specific checks
if (process.env.NODE_ENV === 'production') {
  console.log('\n' + chalk.blue('Production Checks:'));
  
  if (!process.env.VITE_SENTRY_DSN) {
    console.log(chalk.yellow('  ⚠ Sentry DSN not configured - error tracking disabled'));
    hasWarnings = true;
  }
  
  if (!process.env.VITE_ENCRYPTION_KEY) {
    console.log(chalk.yellow('  ⚠ Encryption key not set - using default (not recommended)'));
    hasWarnings = true;
  }
  
  if (process.env.VITE_APP_ENV !== 'production') {
    console.log(chalk.red('  ✗ VITE_APP_ENV should be "production"'));
    hasErrors = true;
  }
}

// Summary
console.log('\n' + chalk.blue('Summary:'));
if (hasErrors) {
  console.log(chalk.red('  ✗ Environment validation FAILED'));
  console.log(chalk.red('  Please set all required variables before deployment'));
  process.exit(1);
} else if (hasWarnings) {
  console.log(chalk.yellow('  ⚠ Environment validation passed with warnings'));
  console.log(chalk.yellow('  Consider setting optional variables for full functionality'));
  process.exit(0);
} else {
  console.log(chalk.green('  ✓ All environment variables are properly configured!'));
  process.exit(0);
}
