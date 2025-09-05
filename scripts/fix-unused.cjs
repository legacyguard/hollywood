#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function parseErrors() {
  const output = execSync('npx tsc --noEmit 2>&1 || true', { encoding: 'utf8' });
  const lines = output.split('\n');
  const errors = [];
  for (const line of lines) {
    const match = line.match(/^(.+?)\((\d+),(\d+)\): error TS(\d+): '(.+?)' is/);
    if (match) {
      errors.push({ file: match[1], line: parseInt(match[2]), col: parseInt(match[3]), code: match[4], symbol: match[5] });
    }
  }
  return errors;
}

function groupByFile(errors) {
  const grouped = {};
  for (const error of errors) {
    if (!grouped[error.file]) grouped[error.file] = [];
    grouped[error.file].push(error);
  }
  for (const file in grouped) grouped[file].sort((a, b) => b.line - a.line);
  return grouped;
}

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

    if (error.code === '6133') {
      if (error.symbol === 'React' && line.includes('import')) {
        if (line.match(/^import\s+React\s+from\s+["']react["']/)) {
          lines[lineIndex] = '';
        } else if (line.match(/^import\s+\*\s+as\s+React\s+from\s+["']react["']/)) {
          lines[lineIndex] = '';
        } else if (line.includes('React,')) {
          lines[lineIndex] = line.replace(/React,\s*/, '');
        } else if (line.includes(', React')) {
          lines[lineIndex] = line.replace(/,\s*React/, '');
        }
      } else if (line.includes(`const ${error.symbol}`) || line.includes(`let ${error.symbol}`) || line.includes(`var ${error.symbol}`)) {
        if (!line.trim().startsWith('//')) {
          lines[lineIndex] = '// Unused: ' + line;
        }
      } else if (line.includes(error.symbol) && (line.includes('const {') || line.includes('const ['))) {
        const regex = new RegExp(`\\b${error.symbol}\\b`, 'g');
        lines[lineIndex] = line.replace(regex, `_${error.symbol}`);
      }
    } else if (error.code === '6196' || error.code === '6198') {
      if (!line.trim().startsWith('//')) {
        lines[lineIndex] = '// Unused: ' + line;
      }
    }
  }
  content = lines.join('\n');
  content = content.replace(/^import\s*{\s*}\s*from\s*['"][^'"]+['"];?\s*$/gm, '');
  content = content.replace(/\n\n\n+/g, '\n\n');
  fs.writeFileSync(filePath, content);
  console.log(`Fixed ${errors.length} issues in ${filePath}`);
}

async function main() {
  console.log('Parsing TypeScript errors...');
  const errors = parseErrors();
  console.log(`Found ${errors.length} unused variable/import errors`);
  if (errors.length === 0) return;
  const grouped = groupByFile(errors);
  console.log(`Errors found in ${Object.keys(grouped).length} files`);
  for (const [file, fileErrors] of Object.entries(grouped)) {
    fixFile(file, fileErrors);
  }
  console.log('Done. Run: npx tsc --noEmit');
}

main().catch(console.error);

