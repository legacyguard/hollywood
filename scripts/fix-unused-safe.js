#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔍 Parsing TypeScript unused errors...');

// Get all TypeScript unused errors
const output = execSync('npx tsc --noEmit 2>&1 || true', { encoding: 'utf8' });
const lines = output.split('\n');
const errors = [];

for (const line of lines) {
  // Match pattern: file(line,col): error TS6133: 'X' is declared but its value is never read
  const match = line.match(/^(.+?)\((\d+),(\d+)\): error TS(\d+): '(.+?)' is/);
  if (match) {
    const [, file, lineNum, col, code, symbol] = match;
    errors.push({ 
      file, 
      line: parseInt(lineNum), 
      col: parseInt(col), 
      code, 
      symbol 
    });
  }
}

console.log(`📊 Found ${errors.length} unused errors`);

if (errors.length === 0) {
  console.log('✅ No unused errors found!');
  process.exit(0);
}

// Group errors by file
const fileGroups = {};
for (const error of errors) {
  if (!fileGroups[error.file]) {
    fileGroups[error.file] = [];
  }
  fileGroups[error.file].push(error);
}

// Process each file
let totalFixed = 0;
for (const [filePath, fileErrors] of Object.entries(fileGroups)) {
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let fixCount = 0;
  
  // Fix React imports (most common issue)
  if (content.includes('import React') && !content.includes('React.')) {
    // Remove standalone React imports  
    content = content.replace(/^import\s+React\s+from\s+['"]react['"];\s*\n?/gm, '');
    content = content.replace(/^import\s+\*\s+as\s+React\s+from\s+['"]react['"];\s*\n?/gm, '');
    fixCount++;
  }
  
  // Process each error in reverse order (from bottom to top)
  const sortedErrors = fileErrors.sort((a, b) => b.line - a.line);
  const lines = content.split('\n');
  
  for (const error of sortedErrors) {
    const lineIdx = error.line - 1;
    if (lineIdx >= lines.length) continue;
    
    const line = lines[lineIdx];
    
    // Handle different error codes
    if (error.code === '6133') {
      // Variable/import declared but never read
      // Prefix unused parameters/variables with underscore
      if (line.includes(`${error.symbol}:`) || line.includes(`${error.symbol},`) || line.includes(`${error.symbol})`) || line.includes(`${error.symbol} =`)) {
        const regex = new RegExp(`\\b${error.symbol}\\b`, 'g');
        lines[lineIdx] = line.replace(regex, `_${error.symbol}`);
        fixCount++;
      }
    }
  }
  
  content = lines.join('\n');
  
  // Clean up empty lines
  content = content.replace(/\n\n\n+/g, '\n\n');
  
  if (fixCount > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`✏️  Fixed ${fixCount} issues in ${path.relative(process.cwd(), filePath)}`);
    totalFixed += fixCount;
  }
}

console.log(`\n✅ Fixed ${totalFixed} total issues`);
console.log('🔄 Run "npx tsc --noEmit" to verify');
