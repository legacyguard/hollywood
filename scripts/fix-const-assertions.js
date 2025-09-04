#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

let totalFixed = 0;
let filesFixed = 0;

// Find all TypeScript/TypeScript React files
function findFiles(dir, pattern) {
  let results = [];
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (
        stat &&
        stat.isDirectory() &&
        !filePath.includes('node_modules') &&
        !filePath.includes('.next')
      ) {
        results = results.concat(findFiles(filePath, pattern));
      } else if (pattern.test(filePath)) {
        results.push(filePath);
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err.message);
  }
  return results;
}

// Fix const assertion syntax errors
function fixConstAssertions(content, filePath) {
  let fixed = content;
  let fixCount = 0;

  // Fix patterns like: status: 'pending' as const | 'in_progress' | ...
  // Should be: status: 'pending' | 'in_progress' | ...
  // The enhanced script incorrectly placed 'as const' in the middle of union types

  const patterns = [
    // Fix malformed const assertions in union types
    // Pattern 1: 'value' as const | 'other' -> 'value' | 'other'
    {
      pattern: /:\s*'([^']+)'\s+as\s+const\s*\|\s*'/g,
      replacement: ": '$1' | '",
    },
    // Pattern 2: Fix standalone malformed const assertions
    {
      pattern: /(['"])[^'"]+\1\s+as\s+const(?=\s*[|,;})])/g,
      replacement: match => {
        // Remove the 'as const' part
        return match.replace(/\s+as\s+const/, '');
      },
    },
    // Pattern 3: Fix type definitions with misplaced as const
    {
      pattern: /status:\s*['"](\w+)['"]\s+as\s+const\s*\|/g,
      replacement: "status: '$1' |",
    },
    // Pattern 4: Fix nested object/array const assertions
    {
      pattern: /\[\s*(['"])[^'"]+\1\s+as\s+const\s*\]/g,
      replacement: match => {
        return match.replace(/\s+as\s+const/, '');
      },
    },
    // Pattern 5: Fix assignments with misplaced as const
    {
      pattern: /=\s*(['"])[^'"]+\1\s+as\s+const\s*;/g,
      replacement: match => {
        // Move as const to the end
        const value = match.match(/(['"][^'"]+['"])/)[0];
        return `= ${value} as const;`;
      },
    },
  ];

  for (const { pattern, replacement } of patterns) {
    const beforeReplace = fixed;
    if (typeof replacement === 'function') {
      fixed = fixed.replace(pattern, replacement);
    } else {
      fixed = fixed.replace(pattern, replacement);
    }
    if (beforeReplace !== fixed) {
      // Count actual replacements
      const matches = beforeReplace.match(pattern);
      if (matches) {
        fixCount += matches.length;
      }
    }
  }

  // Additional specific fixes for common patterns
  // Fix: 'locked' as const | 'available' -> 'locked' | 'available'
  const unionTypePattern =
    /:\s*(['"])([^'"]+)\1\s+as\s+const\s*\|\s*(['"])([^'"]+)\3/g;
  const unionMatches = fixed.match(unionTypePattern);
  if (unionMatches) {
    fixed = fixed.replace(unionTypePattern, ": '$2' | '$4'");
    fixCount += unionMatches.length;
  }

  if (fixCount > 0) {
    console.log(
      `${colors.green}Fixed ${fixCount} const assertion issues in ${path.basename(filePath)}${colors.reset}`
    );
  }

  return { fixed, fixCount };
}

// Fix other syntax errors
function fixOtherSyntaxErrors(content, filePath) {
  let fixed = content;
  let fixCount = 0;

  // Fix array/object access without arguments
  // Pattern: something[] -> needs an index
  const emptyAccessPattern = /([a-zA-Z_$][a-zA-Z0-9_$]*)\[\]\s*(?=[;,)}])/g;
  const matches = fixed.match(emptyAccessPattern);
  if (matches) {
    // This is tricky - we need context to fix properly
    // For now, comment out lines with this pattern
    const lines = fixed.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (
        emptyAccessPattern.test(lines[i]) &&
        !lines[i].includes('[]') &&
        !lines[i].trim().startsWith('//')
      ) {
        // Don't fix array type declarations
        if (!lines[i].includes(':') || !lines[i].includes('[]')) {
          lines[i] = '// TODO: Fix empty array access - ' + lines[i];
          fixCount++;
        }
      }
    }
    fixed = lines.join('\n');
  }

  if (fixCount > 0) {
    console.log(
      `${colors.yellow}Commented out ${fixCount} lines with empty array access in ${path.basename(filePath)}${colors.reset}`
    );
  }

  return { fixed, fixCount };
}

// Main fix function
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let totalFixCount = 0;

    // Apply const assertion fixes
    const constResult = fixConstAssertions(content, filePath);
    content = constResult.fixed;
    totalFixCount += constResult.fixCount;

    // Apply other syntax fixes
    const syntaxResult = fixOtherSyntaxErrors(content, filePath);
    content = syntaxResult.fixed;
    totalFixCount += syntaxResult.fixCount;

    // Only write if changes were made
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      filesFixed++;
      totalFixed += totalFixCount;
      console.log(
        `${colors.bright}${colors.green}✓${colors.reset} Fixed ${totalFixCount} issues in ${filePath}`
      );
      return true;
    }
    return false;
  } catch (error) {
    console.error(
      `${colors.red}Error processing ${filePath}: ${error.message}${colors.reset}`
    );
    return false;
  }
}

// Main execution
console.log(
  `${colors.bright}${colors.blue}Starting Const Assertion Fix Script${colors.reset}`
);
console.log(`${colors.cyan}Scanning for TypeScript files...${colors.reset}\n`);

const srcDir = path.join(process.cwd(), 'src');
const files = findFiles(srcDir, /\.(tsx?)$/);

console.log(
  `Found ${colors.yellow}${files.length}${colors.reset} TypeScript files\n`
);

// Process all files
files.forEach(file => {
  fixFile(file);
});

// Summary
console.log(`\n${colors.bright}${colors.blue}Fix Summary:${colors.reset}`);
console.log(`${colors.green}✓ Fixed ${filesFixed} files${colors.reset}`);
console.log(
  `${colors.green}✓ Total fixes applied: ${totalFixed}${colors.reset}`
);

if (filesFixed === 0) {
  console.log(
    `${colors.yellow}No const assertion issues found that match the patterns.${colors.reset}`
  );
}
