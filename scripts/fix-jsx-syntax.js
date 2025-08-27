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
  cyan: '\x1b[36m'
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
      if (stat && stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.next')) {
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

// Fix JSX attribute object syntax
function fixJSXObjectAttributes(content, filePath) {
  let fixed = content;
  let fixCount = 0;
  
  // Fix motion.div and similar animation props that were broken
  // Pattern: initial={ opacity: -> initial={{ opacity:
  // Pattern: animate={ opacity: -> animate={{ opacity:
  // Pattern: exit={ opacity: -> exit={{ opacity:
  // Pattern: transition={ duration: -> transition={{ duration:
  const brokenObjectPatterns = [
    // Fix object attributes that lost their outer braces
    {
      pattern: /(initial|animate|exit|transition|whileHover|whileTap|style|viewport|custom|drag|layout|layoutId)=\s*{\s*([a-zA-Z_$][a-zA-Z0-9_$]*\s*:)/g,
      replacement: '$1={{ $2'
    },
    // Fix closing braces for these attributes
    {
      pattern: /(initial|animate|exit|transition|whileHover|whileTap|style|viewport|custom|drag|layout|layoutId)={{([^}]+)}(?!})/g,
      replacement: '$1={{ $2 }}'
    },
    // Specifically fix motion attributes with multiple properties
    {
      pattern: /initial={ opacity: ([0-9.]+), x: ([0-9-]+) }/g,
      replacement: 'initial={{ opacity: $1, x: $2 }}'
    },
    {
      pattern: /animate={ opacity: ([0-9.]+), x: ([0-9-]+) }/g,
      replacement: 'animate={{ opacity: $1, x: $2 }}'
    },
    {
      pattern: /exit={ opacity: ([0-9.]+), x: ([0-9-]+) }/g,
      replacement: 'exit={{ opacity: $1, x: $2 }}'
    },
    {
      pattern: /transition={ duration: ([0-9.]+) }/g,
      replacement: 'transition={{ duration: $1 }}'
    },
    // Fix single property cases
    {
      pattern: /initial={ opacity: ([0-9.]+) }/g,
      replacement: 'initial={{ opacity: $1 }}'
    },
    {
      pattern: /animate={ opacity: ([0-9.]+) }/g,
      replacement: 'animate={{ opacity: $1 }}'
    },
    {
      pattern: /exit={ opacity: ([0-9.]+) }/g,
      replacement: 'exit={{ opacity: $1 }}'
    },
    // Fix y property cases
    {
      pattern: /initial={ y: ([0-9-]+) }/g,
      replacement: 'initial={{ y: $1 }}'
    },
    {
      pattern: /animate={ y: ([0-9-]+) }/g,
      replacement: 'animate={{ y: $1 }}'
    },
    {
      pattern: /exit={ y: ([0-9-]+) }/g,
      replacement: 'exit={{ y: $1 }}'
    },
    // Fix scale property cases
    {
      pattern: /initial={ scale: ([0-9.]+) }/g,
      replacement: 'initial={{ scale: $1 }}'
    },
    {
      pattern: /animate={ scale: ([0-9.]+) }/g,
      replacement: 'animate={{ scale: $1 }}'
    },
    {
      pattern: /whileHover={ scale: ([0-9.]+) }/g,
      replacement: 'whileHover={{ scale: $1 }}'
    },
    {
      pattern: /whileTap={ scale: ([0-9.]+) }/g,
      replacement: 'whileTap={{ scale: $1 }}'
    }
  ];

  for (const { pattern, replacement } of brokenObjectPatterns) {
    const matches = fixed.match(pattern);
    if (matches) {
      fixed = fixed.replace(pattern, replacement);
      fixCount += matches.length;
    }
  }

  // Fix style attributes that may have been broken
  fixed = fixed.replace(/style={ ([^}]+) }/g, 'style={{ $1 }}');
  
  // Fix className template literals that might have been broken
  fixed = fixed.replace(/className={`([^`]+)`}/g, (match, content) => {
    // Check if this contains ${} expressions
    if (content.includes('${')) {
      return match; // Keep as is
    }
    // If it's a simple string, it could be converted to a regular string
    return `className="${content}"`;
  });

  if (fixCount > 0) {
    console.log(`${colors.green}Fixed ${fixCount} JSX object attribute issues in ${path.basename(filePath)}${colors.reset}`);
  }

  return { fixed, fixCount };
}

// Fix array/object destructuring and other syntax issues
function fixDestructuringSyntax(content, filePath) {
  let fixed = content;
  let fixCount = 0;

  // Fix cases where destructuring was broken
  // Example: const [value, setValue = useState(... should be const [value, setValue] = useState(...
  const destructuringPattern = /const\s+\[([a-zA-Z_$][a-zA-Z0-9_$]*),\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(useState|useReducer|useMemo|useCallback)/g;
  const matches = fixed.match(destructuringPattern);
  if (matches) {
    fixed = fixed.replace(destructuringPattern, 'const [$1, $2] = $3');
    fixCount += matches.length;
  }

  if (fixCount > 0) {
    console.log(`${colors.green}Fixed ${fixCount} destructuring syntax issues in ${path.basename(filePath)}${colors.reset}`);
  }

  return { fixed, fixCount };
}

// Main fix function
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let totalFixCount = 0;

    // Apply JSX object attribute fixes
    const jsxResult = fixJSXObjectAttributes(content, filePath);
    content = jsxResult.fixed;
    totalFixCount += jsxResult.fixCount;

    // Apply destructuring fixes
    const destructResult = fixDestructuringSyntax(content, filePath);
    content = destructResult.fixed;
    totalFixCount += destructResult.fixCount;

    // Only write if changes were made
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      filesFixed++;
      totalFixed += totalFixCount;
      console.log(`${colors.bright}${colors.green}✓${colors.reset} Fixed ${totalFixCount} issues in ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`${colors.red}Error processing ${filePath}: ${error.message}${colors.reset}`);
    return false;
  }
}

// Main execution
console.log(`${colors.bright}${colors.blue}Starting JSX Syntax Fix Script${colors.reset}`);
console.log(`${colors.cyan}Scanning for TypeScript/React files...${colors.reset}\n`);

const srcDir = path.join(process.cwd(), 'src');
const files = findFiles(srcDir, /\.(tsx?)$/);

console.log(`Found ${colors.yellow}${files.length}${colors.reset} TypeScript files\n`);

// Process all files
files.forEach(file => {
  fixFile(file);
});

// Summary
console.log(`\n${colors.bright}${colors.blue}Fix Summary:${colors.reset}`);
console.log(`${colors.green}✓ Fixed ${filesFixed} files${colors.reset}`);
console.log(`${colors.green}✓ Total fixes applied: ${totalFixed}${colors.reset}`);

if (filesFixed === 0) {
  console.log(`${colors.yellow}No JSX syntax issues found that match the patterns.${colors.reset}`);
}
