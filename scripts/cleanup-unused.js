#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🧹 Cleaning up all unused variables, imports, and parameters...\n');

// Parse TypeScript errors
function getUnusedErrors() {
  try {
    const output = execSync('npx tsc --noEmit 2>&1 || true', { encoding: 'utf8' });
    const lines = output.split('\n');
    const errors = [];
    
    for (const line of lines) {
      // Parse different error patterns
      const patterns = [
        // TS6133: 'X' is declared but its value is never read
        /^(.+?)\((\d+),(\d+)\): error TS6133: '(.+?)' is declared but its value is never read\./,
        // TS6196: 'X' is declared but never used
        /^(.+?)\((\d+),(\d+)\): error TS6196: '(.+?)' is declared but never used\./,
        // TS6198: All destructured elements are unused
        /^(.+?)\((\d+),(\d+)\): error TS6198: All destructured elements are unused\./,
        // TS6205: All type parameters are unused
        /^(.+?)\((\d+),(\d+)\): error TS6205: All type parameters are unused\./,
        // TS7006: Parameter implicitly has an 'any' type
        /^(.+?)\((\d+),(\d+)\): error TS7006: Parameter '(.+?)' implicitly has an 'any' type\./
      ];
      
      for (const pattern of patterns) {
        const match = line.match(pattern);
        if (match) {
          errors.push({
            file: match[1],
            line: parseInt(match[2]),
            col: parseInt(match[3]),
            symbol: match[4] || 'unknown',
            message: line,
            code: line.match(/TS(\d+)/)?.[1] || '0000'
          });
          break;
        }
      }
    }
    
    return errors;
  } catch (error) {
    console.error('Error running TypeScript compiler:', error);
    return [];
  }
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
  // Sort errors by line number in reverse (process from bottom to top)
  for (const file in grouped) {
    grouped[file].sort((a, b) => b.line - a.line);
  }
  return grouped;
}

// Fix a single file
function fixFile(filePath, errors) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return 0;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let fixCount = 0;
  
  for (const error of errors) {
    const lineIdx = error.line - 1;
    if (lineIdx >= lines.length) continue;
    
    const line = lines[lineIdx];
    
    // Handle different error types
    if (error.code === '6133') {
      // Unused variable/import
      if (line.includes('import') && error.symbol !== 'React') {
        // For imports, check if it's a type import
        if (line.includes(`type { ${error.symbol}`) || line.includes(`{ type ${error.symbol}`)) {
          // Remove just this type import
          const regex = new RegExp(`(type )?${error.symbol},?\\s*`, 'g');
          lines[lineIdx] = line.replace(regex, '');
        } else if (line.includes(`import ${error.symbol}`) && !line.includes('{')) {
          // Default import - comment out the line
          lines[lineIdx] = `// Unused: ${line}`;
        } else if (line.includes(`{ ${error.symbol}`) || line.includes(`, ${error.symbol}`)) {
          // Named import - remove from imports
          lines[lineIdx] = line
            .replace(new RegExp(`{\\s*${error.symbol}\\s*}`, 'g'), '{}')
            .replace(new RegExp(`{\\s*${error.symbol},`, 'g'), '{')
            .replace(new RegExp(`,\\s*${error.symbol}\\s*}`, 'g'), '}')
            .replace(new RegExp(`,\\s*${error.symbol},`, 'g'), ',');
        }
      } else if (line.includes(`const ${error.symbol}`) || line.includes(`let ${error.symbol}`) || line.includes(`var ${error.symbol}`)) {
        // Check if it's a destructuring assignment that might be needed
        if (line.includes('useState') || line.includes('useReducer')) {
          // For React hooks, prefix with underscore
          const regex = new RegExp(`\\b${error.symbol}\\b`, 'g');
          lines[lineIdx] = line.replace(regex, `_${error.symbol}`);
        } else {
          // Otherwise comment out
          lines[lineIdx] = `  // Unused: ${line.trim()}`;
        }
      } else {
        // For function parameters and other cases, prefix with underscore
        const regex = new RegExp(`\\b${error.symbol}\\b`, 'g');
        lines[lineIdx] = line.replace(regex, `_${error.symbol}`);
      }
      fixCount++;
    } else if (error.code === '6196' || error.code === '6198') {
      // Unused type or all destructured elements unused
      if (!line.trim().startsWith('//')) {
        lines[lineIdx] = `// Unused: ${line}`;
        fixCount++;
      }
    } else if (error.code === '6205') {
      // Unused type parameters - prefix with underscore
      const regex = new RegExp(`<(\\w+)([,>])`, 'g');
      lines[lineIdx] = line.replace(regex, '<_$1$2');
      fixCount++;
    } else if (error.code === '7006') {
      // Implicit any - add type annotation
      const regex = new RegExp(`\\b${error.symbol}\\b(?!:)`, 'g');
      lines[lineIdx] = line.replace(regex, `${error.symbol}: any`);
      fixCount++;
    }
  }
  
  // Clean up the result
  content = lines.join('\n');
  
  // Remove empty import statements
  content = content.replace(/^import\s*{\s*}\s*from\s*['"][^'"]+['"];?\s*$/gm, '');
  content = content.replace(/^import\s+type\s*{\s*}\s*from\s*['"][^'"]+['"];?\s*$/gm, '');
  
  // Remove multiple consecutive empty lines
  content = content.replace(/\n\n\n+/g, '\n\n');
  
  // Remove trailing whitespace
  content = content.replace(/[ \t]+$/gm, '');
  
  fs.writeFileSync(filePath, content);
  return fixCount;
}

// Main cleanup function
async function cleanup() {
  let iteration = 1;
  let totalFixed = 0;
  
  while (true) {
    console.log(`\n🔄 Iteration ${iteration}...`);
    
    const errors = getUnusedErrors();
    
    if (errors.length === 0) {
      console.log('✅ No more unused code found!');
      break;
    }
    
    console.log(`Found ${errors.length} issues to fix...`);
    
    const grouped = groupByFile(errors);
    let iterationFixed = 0;
    
    for (const [file, fileErrors] of Object.entries(grouped)) {
      const fixed = fixFile(file, fileErrors);
      if (fixed > 0) {
        console.log(`  ✏️  Fixed ${fixed} issues in ${path.basename(file)}`);
        iterationFixed += fixed;
      }
    }
    
    totalFixed += iterationFixed;
    
    // Safety check to prevent infinite loops
    if (iteration > 10) {
      console.log('⚠️  Maximum iterations reached. Some issues may remain.');
      break;
    }
    
    iteration++;
  }
  
  console.log(`\n✨ Cleanup complete! Fixed ${totalFixed} total issues.`);
  
  // Final verification
  console.log('\n🔍 Running final TypeScript check...');
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    console.log('✅ TypeScript compilation successful with all strict checks enabled!');
  } catch (error) {
    const output = error.stdout ? error.stdout.toString() : '';
    const errorOutput = error.stderr ? error.stderr.toString() : '';
    const remainingErrors = (output + errorOutput).split('\n').filter(line => line.includes('error TS')).length;
    if (remainingErrors > 0) {
      console.log(`⚠️  ${remainingErrors} errors remain. These may require manual review.`);
    }
  }
}

// Run cleanup
cleanup().catch(console.error);
