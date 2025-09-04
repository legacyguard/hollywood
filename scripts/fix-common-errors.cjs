#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Common fixes
const fixes = {
  // Fix FamilyLegacyProjectManagement issues - remove extra properties from templates
  removeCommentsFromTasks: (content, filePath) => {
    if (filePath.includes('FamilyLegacyProjectManagement')) {
      // Remove comments and attachments from task templates
      content = content.replace(
        /,\s*comments:\s*\[\],?\s*attachments:\s*\[\]/g,
        ''
      );
      // Clean up trailing commas
      content = content.replace(/,(\s*})/g, '$1');
    }
    return content;
  },

  // Fix Camera import issues
  fixCameraImport: (content, filePath) => {
    if (
      filePath.includes('FamilyHistoryPreservation') ||
      filePath.includes('MultiGenerationalDocumentSharing')
    ) {
      // Check if Camera is in the imports from lucide-react
      const lucideImportRegex =
        /import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/;
      const match = content.match(lucideImportRegex);

      if (match) {
        const imports = match[1];
        if (!imports.includes('Camera')) {
          // Add Camera to existing imports
          const newImports = imports.trim() + ', Camera';
          content = content.replace(
            lucideImportRegex,
            `import { ${newImports} } from 'lucide-react'`
          );
        }
      }
    }
    return content;
  },

  // Fix FileText import issues
  fixFileTextImport: (content, filePath) => {
    if (filePath.includes('ProfessionalRecommendationEngine')) {
      const lucideImportRegex =
        /import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/;
      const match = content.match(lucideImportRegex);

      if (match) {
        const imports = match[1];
        if (!imports.includes('FileText')) {
          const newImports = imports.trim() + ', FileText';
          content = content.replace(
            lucideImportRegex,
            `import { ${newImports} } from 'lucide-react'`
          );
        }
      }
    }
    return content;
  },

  // Fix undefined user variable
  fixUndefinedUser: (content, filePath) => {
    if (filePath.includes('IntelligentWillDraftGenerator')) {
      // Replace standalone 'user' with proper context
      content = content.replace(/\buser\b(?!\s*[:=])/g, 'currentUser');

      // Add currentUser declaration if not present
      if (!content.includes('const currentUser')) {
        const useAuthMatch = content.match(
          /const\s*\{\s*userId[^}]*\}\s*=\s*useAuth\(\)/
        );
        if (useAuthMatch) {
          content = content.replace(
            useAuthMatch[0],
            `${useAuthMatch[0]};\n  const currentUser = { id: userId, name: 'Current User' }`
          );
        }
      }
    }
    return content;
  },

  // Remove 'size' prop from Badge components
  removeBadgeSizeProp: content => {
    // Remove size="sm" or size="..." from Badge components
    return content.replace(
      /<Badge([^>]*)size=["'][^"']*["']([^>]*)>/g,
      '<Badge$1$2>'
    );
  },

  // Fix test file imports
  fixTestImports: (content, filePath) => {
    if (filePath.endsWith('.test.ts') || filePath.endsWith('.test.tsx')) {
      // Add vitest imports if missing
      if (
        !content.includes("from 'vitest'") &&
        !content.includes('from "vitest"')
      ) {
        content =
          `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';\n` +
          content;
      }
    }
    return content;
  },
};

// Process a single file
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    const originalContent = content;

    // Apply all fixes
    Object.values(fixes).forEach(fix => {
      const newContent = fix(content, filePath);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${path.relative(process.cwd(), filePath)}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Walk directory recursively
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
        walkDir(filePath, callback);
      }
    } else if (
      stat.isFile() &&
      (file.endsWith('.tsx') || file.endsWith('.ts'))
    ) {
      callback(filePath);
    }
  });
}

// Main execution
console.log('🔧 Fixing common TypeScript errors...\n');

const srcDir = path.join(process.cwd(), 'src');
let totalFixed = 0;

walkDir(srcDir, filePath => {
  if (processFile(filePath)) {
    totalFixed++;
  }
});

console.log(`\n✨ Fixed ${totalFixed} files`);
