#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Analyzing TypeScript errors...\n');

// Capture all TypeScript errors
const errors = execSync('npx tsc --noEmit 2>&1 || true', { 
  encoding: 'utf8',
  maxBuffer: 1024 * 1024 * 10 // 10MB buffer
});

// Parse and categorize errors
const errorLines = errors.split('\n').filter(line => line.includes('error TS'));
const categorizedErrors = {
  byPackage: {},
  byErrorCode: {},
  byType: {
    unknown: [],
    propsMismatch: [],
    missingExports: [],
    implicitAny: [],
    typeAssignment: [],
    other: []
  },
  summary: {
    total: errorLines.length,
    files: new Set()
  }
};

// Regex patterns for error categorization
const patterns = {
  unknown: /unknown|'unknown'/,
  propsMismatch: /Property .* does not exist on type|Type .* is not assignable to type/,
  missingExports: /Cannot find name|Cannot find module|Export .* conflicts/,
  implicitAny: /implicitly has an 'any' type/,
  typeAssignment: /Type .* is not assignable|Argument of type .* is not assignable/
};

errorLines.forEach(line => {
  // Extract file path and error code
  const match = line.match(/^(.+?)\((\d+),(\d+)\): error (TS\d+): (.+)$/);
  if (!match) return;
  
  const [, filePath, lineNum, colNum, errorCode, errorMsg] = match;
  const fileName = filePath.replace(process.cwd() + '/', '');
  
  // Track unique files
  categorizedErrors.summary.files.add(fileName);
  
  // Determine package
  let pkg = 'root';
  if (fileName.startsWith('packages/')) {
    pkg = fileName.split('/')[1];
  } else if (fileName.startsWith('web/')) {
    pkg = 'web';
  } else if (fileName.startsWith('mobile/')) {
    pkg = 'mobile';
  }
  
  // Initialize package category if needed
  if (!categorizedErrors.byPackage[pkg]) {
    categorizedErrors.byPackage[pkg] = [];
  }
  
  // Initialize error code category if needed
  if (!categorizedErrors.byErrorCode[errorCode]) {
    categorizedErrors.byErrorCode[errorCode] = {
      count: 0,
      description: '',
      examples: []
    };
  }
  
  const errorEntry = {
    file: fileName,
    line: parseInt(lineNum),
    column: parseInt(colNum),
    code: errorCode,
    message: errorMsg
  };
  
  // Categorize by package
  categorizedErrors.byPackage[pkg].push(errorEntry);
  
  // Categorize by error code
  categorizedErrors.byErrorCode[errorCode].count++;
  categorizedErrors.byErrorCode[errorCode].description = errorMsg;
  if (categorizedErrors.byErrorCode[errorCode].examples.length < 3) {
    categorizedErrors.byErrorCode[errorCode].examples.push(fileName + ':' + lineNum);
  }
  
  // Categorize by type
  let categorized = false;
  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(errorMsg)) {
      categorizedErrors.byType[type].push(errorEntry);
      categorized = true;
      break;
    }
  }
  if (!categorized) {
    categorizedErrors.byType.other.push(errorEntry);
  }
});

// Generate report
console.log('📊 TypeScript Error Analysis Report\n');
console.log('=' .repeat(60));

console.log('\n📦 Errors by Package:');
console.log('-'.repeat(40));
Object.entries(categorizedErrors.byPackage)
  .sort((a, b) => b[1].length - a[1].length)
  .forEach(([pkg, errors]) => {
    console.log(`  ${pkg.padEnd(15)} ${errors.length} errors`);
  });

console.log('\n🔢 Top Error Codes:');
console.log('-'.repeat(40));
Object.entries(categorizedErrors.byErrorCode)
  .sort((a, b) => b[1].count - a[1].count)
  .slice(0, 10)
  .forEach(([code, data]) => {
    console.log(`  ${code}: ${data.count} occurrences`);
    console.log(`    ${data.description.substring(0, 60)}...`);
  });

console.log('\n🏷️  Error Categories:');
console.log('-'.repeat(40));
Object.entries(categorizedErrors.byType)
  .sort((a, b) => b[1].length - a[1].length)
  .forEach(([type, errors]) => {
    const percentage = ((errors.length / categorizedErrors.summary.total) * 100).toFixed(1);
    console.log(`  ${type.padEnd(20)} ${errors.length} (${percentage}%)`);
  });

console.log('\n📈 Summary:');
console.log('-'.repeat(40));
console.log(`  Total Errors: ${categorizedErrors.summary.total}`);
console.log(`  Affected Files: ${categorizedErrors.summary.files.size}`);
console.log(`  Errors per File: ${(categorizedErrors.summary.total / categorizedErrors.summary.files.size).toFixed(1)}`);

// Save detailed report
const reportPath = path.join(process.cwd(), 'ts-errors-report.json');
fs.writeFileSync(reportPath, JSON.stringify(categorizedErrors, null, 2));
console.log(`\n✅ Detailed report saved to: ${reportPath}`);

// Generate fix priority list
console.log('\n🎯 Recommended Fix Priority:');
console.log('-'.repeat(40));
console.log('  1. Fix "unknown" types (likely Supabase/API types)');
console.log('  2. Fix Tamagui component props mismatches');
console.log('  3. Resolve missing imports/exports');
console.log('  4. Address implicit any types');
console.log('  5. Fix type assignment issues');

process.exit(0);
