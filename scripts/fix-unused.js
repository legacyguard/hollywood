#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse TypeScript errors
function parseErrors() {
  const output = execSync('npx tsc --noEmit 2>&1 || true', { encoding: 'utf8' });
  const lines = output.split('\n');
  const errors = [];
  
  for (const line of lines) {
    // Pattern: file(line,col): error TS6133: 'X' is declared but its value is never read.
    const match = line.match(/^(.+?)\((\d+),(\d+)\): error TS(\d+): '(.+?)' is/);
    if (match) {
      errors.push({
        file: match[1],
        line: parseInt(match[2]),
        col: parseInt(match[3]),
        code: match[4],
        symbol: match[5]
      });
    }
  }
  
  return errors;
}

// Group errors by file
function groupByFile(errors) {
  const grouped = {};
  for (const error of errors) {
    if (!grouped[error.file]) {
      grouped[error.file] = [];
    }
    grouped[error.file].push(error);
  }
  // Sort errors in reverse line order (process from bottom to top)
  for (const file in grouped) {
    grouped[file].sort((a, b) => b.line - a.line);
  }
  return grouped;
}

// Fix unused imports and variables in a file
function fixFile(filePath, errors) {
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping non-existent file: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  for (const error of errors) {
    const lineIndex = error.line - 1;
    
    if (lineIndex >= lines.length) continue;
    
    const line = lines[lineIndex];
    
    // Handle different error codes
    if (error.code === '6133') { // Variable/import declared but never read
      // Check if it's a React import
      if (error.symbol === 'React' && line.includes("import React")) {
        // Remove React import if it's a standalone import
        if (line.match(/^import\s+React\s+from\s+['"]react['"]/)) {
          lines[lineIndex] = ''; // Remove the line
        } else if (line.includes('React,')) {
          // Remove React from a multi-import
          lines[lineIndex] = line.replace(/React,\s*/, '');
        } else if (line.includes(', React')) {
          lines[lineIndex] = line.replace(/,\s*React/, '');
        }
      }
      // Handle unused variables/constants
      else if (line.includes(`const ${error.symbol}`) || 
               line.includes(`let ${error.symbol}`) || 
               line.includes(`var ${error.symbol}`)) {
        // Comment out instead of removing to be safe
        if (!line.trim().startsWith('//')) {
          lines[lineIndex] = '// Unused: ' + line;
        }
      }
      // Handle unused destructured variables
      else if (line.includes(error.symbol) && (line.includes('const {') || line.includes('const ['))) {
        // For destructuring, prefix with underscore
        const regex = new RegExp(`\\b${error.symbol}\\b`, 'g');
        lines[lineIndex] = line.replace(regex, `_${error.symbol}`);
      }
    } 
    else if (error.code === '6196' || error.code === '6198') { // Never used / All destructured unused
      // Comment out the line
      if (!line.trim().startsWith('//')) {
        lines[lineIndex] = '// Unused: ' + line;
      }
    }
  }
  
  // Clean up empty import statements
  content = lines.join('\n');
  content = content.replace(/^import\s*{\s*}\s*from\s*['"][^'"]+['"];?\s*$/gm, '');
  content = content.replace(/\n\n\n+/g, '\n\n'); // Remove excessive newlines
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed ${errors.length} issues in ${filePath}`);
}

// Main execution
async function main() {
  console.log('Parsing TypeScript errors...');
  const errors = parseErrors();
  console.log(`Found ${errors.length} unused variable/import errors`);
  
  if (errors.length === 0) {
    console.log('No unused errors found!');
    return;
  }
  
  const grouped = groupByFile(errors);
  console.log(`Errors found in ${Object.keys(grouped).length} files`);
  
  for (const [file, fileErrors] of Object.entries(grouped)) {
    fixFile(file, fileErrors);
  }
  
  console.log('\nDone! Re-run TypeScript to verify:');
  console.log('npx tsc --noEmit');
}

main().catch(console.error);
