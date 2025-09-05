#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing syntax errors from improperly commented code...');

const fixes = [
  {
    file: 'web/src/components/family/FamilyPlanUpgrade.tsx',
    fix: (content) => {
      // Find and fix the commented out object
      return content.replace(
        /\/\/ const __planBadgeColors = {\s*\/\/ Unused\s*\n\s*family: 'bg-blue-100 text-blue-800',\s*\n\s*premium: 'bg-purple-100 text-purple-800',\s*\n}/,
        `// const __planBadgeColors = { // Unused
//   family: 'bg-blue-100 text-blue-800',
//   premium: 'bg-purple-100 text-purple-800',
// };`
      );
    }
  },
  {
    file: 'web/src/components/legacy/EnhancedWillWizard.tsx',
    fix: (content) => {
      // Fix the commented out function
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('// const __handleBackToWillType = () => {')) {
          // Find the matching closing brace and comment it out
          let braceCount = 1;
          for (let j = i + 1; j < lines.length && braceCount > 0; j++) {
            if (!lines[j].trim().startsWith('//')) {
              if (lines[j].includes('{')) braceCount++;
              if (lines[j].includes('}')) {
                braceCount--;
                if (braceCount === 0) {
                  lines[j] = '  // }; // Unused';
                  break;
                }
              }
              lines[j] = '  // ' + lines[j].trim();
            }
          }
          break;
        }
      }
      return lines.join('\n');
    }
  },
  {
    file: 'web/src/components/legacy/EnhancedWillWizardWithValidation.tsx',
    fix: (content) => {
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('// const __goToStep = useCallback((stepId: string) => {')) {
          let braceCount = 1;
          for (let j = i + 1; j < lines.length && braceCount > 0; j++) {
            if (!lines[j].trim().startsWith('//')) {
              if (lines[j].includes('{')) braceCount++;
              if (lines[j].includes('}')) braceCount--;
              lines[j] = '  // ' + lines[j].trim();
            }
          }
          break;
        }
      }
      return lines.join('\n');
    }
  },
  {
    file: 'web/src/components/legacy/WillWizard.tsx',
    fix: (content) => {
      // Comment out the entire JURISDICTIONS array properly
      return content.replace(
        /\/\/ const __JURISDICTIONS = \[\s*\/\/ Unused\s*\n([\s\S]*?)\n\];/,
        (match) => {
          const lines = match.split('\n');
          return lines.map((line, i) => {
            if (i === 0) return line;
            return '// ' + line;
          }).join('\n');
        }
      );
    }
  },
  {
    file: 'web/src/components/professional/ProfessionalNetworkDirectory.tsx',
    fix: (content) => {
      // Fix STATES and LANGUAGES arrays
      return content
        .replace(/\/\/ const __STATES = \[\s*\/\/ Unused\s*\n([\s\S]*?)\n\];/, (match) => {
          const lines = match.split('\n');
          return lines.map(line => '// ' + line.replace(/^\/\/ /, '')).join('\n');
        })
        .replace(/\/\/ const __LANGUAGES = \[\s*\/\/ Unused\s*\n([\s\S]*?)\n\];/, (match) => {
          const lines = match.split('\n');
          return lines.map(line => '// ' + line.replace(/^\/\/ /, '')).join('\n');
        });
    }
  },
  {
    file: 'web/src/components/sofia/SofiaFloatingButton.tsx',
    fix: (content) => {
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('// const __unreadCount = messages.filter(')) {
          // Comment out the entire expression
          for (let j = i + 1; j < lines.length; j++) {
            if (lines[j].includes(').length;')) {
              lines[j] = '  // ).length; // Unused';
              break;
            }
            if (!lines[j].trim().startsWith('//')) {
              lines[j] = '  // ' + lines[j].trim();
            }
          }
          break;
        }
      }
      return lines.join('\n');
    }
  },
  {
    file: 'web/src/components/ui/optimized-image.tsx',
    fix: (content) => {
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('// const __generateSrcSet = useCallback')) {
          let braceCount = 0;
          let inFunction = false;
          for (let j = i; j < lines.length; j++) {
            if (!inFunction && lines[j].includes('{')) {
              inFunction = true;
              braceCount = 1;
            } else if (inFunction) {
              if (lines[j].includes('{')) braceCount++;
              if (lines[j].includes('}')) braceCount--;
              if (braceCount === 0 && lines[j].includes('}, []')) {
                lines[j] = '  // }, []); // Unused';
                break;
              }
            }
            if (!lines[j].trim().startsWith('//')) {
              lines[j] = '  // ' + lines[j].trim();
            }
          }
        }
        if (lines[i].includes('// const __getOptimizedSrc = useCallback')) {
          let braceCount = 0;
          let inFunction = false;
          for (let j = i; j < lines.length; j++) {
            if (!inFunction && lines[j].includes('{')) {
              inFunction = true;
              braceCount = 1;
            } else if (inFunction) {
              if (lines[j].includes('{')) braceCount++;
              if (lines[j].includes('}')) braceCount--;
              if (braceCount === 0 && lines[j].includes('}, []')) {
                lines[j] = '  // }, []); // Unused';
                break;
              }
            }
            if (!lines[j].trim().startsWith('//')) {
              lines[j] = '  // ' + lines[j].trim();
            }
          }
        }
      }
      return lines.join('\n');
    }
  },
  {
    file: 'web/src/lib/emergency/guardian-notifier.ts',
    fix: (content) => {
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('// const __emailBody = this.generateEmailTemplate(')) {
          for (let j = i + 1; j < lines.length; j++) {
            if (lines[j].includes(');')) {
              lines[j] = '      // ); // Unused';
              break;
            }
            if (!lines[j].trim().startsWith('//')) {
              lines[j] = '      // ' + lines[j].trim();
            }
          }
          break;
        }
      }
      return lines.join('\n');
    }
  },
  {
    file: 'web/src/lib/enterprise/teamCollaboration.ts',
    fix: (content) => {
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('// const __templates = [')) {
          let bracketCount = 1;
          for (let j = i + 1; j < lines.length; j++) {
            if (!lines[j].trim().startsWith('//')) {
              if (lines[j].includes('[')) bracketCount++;
              if (lines[j].includes(']')) {
                bracketCount--;
                if (bracketCount === 0) {
                  lines[j] = '    // ]; // Unused';
                  break;
                }
              }
              lines[j] = '    // ' + lines[j].trim();
            }
          }
          break;
        }
      }
      return lines.join('\n');
    }
  },
  {
    file: 'web/src/lib/enterprise/whiteLabelSolutions.ts',
    fix: (content) => {
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('// const __deployment = Array.from(this.deployments.values()).find(')) {
          for (let j = i + 1; j < lines.length; j++) {
            if (lines[j].includes(');')) {
              lines[j] = '    // ); // Unused';
              break;
            }
            if (!lines[j].trim().startsWith('//')) {
              lines[j] = '    // ' + lines[j].trim();
            }
          }
          break;
        }
      }
      return lines.join('\n');
    }
  },
  {
    file: 'web/src/pages/Guardians.tsx',
    fix: (content) => {
      const lines = content.split('\n');
      // Fix handleDeleteConfirm
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('// const __handleDeleteConfirm = async () => {')) {
          let braceCount = 1;
          for (let j = i + 1; j < lines.length && braceCount > 0; j++) {
            if (!lines[j].trim().startsWith('//')) {
              if (lines[j].includes('{')) braceCount++;
              if (lines[j].includes('}')) {
                braceCount--;
                if (braceCount === 0) {
                  lines[j] = '  // }; // Unused';
                  break;
                }
              }
              lines[j] = '  // ' + lines[j].trim();
            }
          }
        }
        // Fix handleDeleteCancel
        if (lines[i].includes('// const __handleDeleteCancel = () => {')) {
          let braceCount = 1;
          for (let j = i + 1; j < lines.length && braceCount > 0; j++) {
            if (!lines[j].trim().startsWith('//')) {
              if (lines[j].includes('{')) braceCount++;
              if (lines[j].includes('}')) {
                braceCount--;
                if (braceCount === 0) {
                  lines[j] = '  // }; // Unused';
                  break;
                }
              }
              lines[j] = '  // ' + lines[j].trim();
            }
          }
        }
      }
      return lines.join('\n');
    }
  },
  {
    file: 'web/src/pages/TimeCapsuleView.tsx',
    fix: (content) => {
      const lines = content.split('\n');
      // Fix handleSeek
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('// const __handleSeek = (time: number) => {')) {
          let braceCount = 1;
          for (let j = i + 1; j < lines.length && braceCount > 0; j++) {
            if (!lines[j].trim().startsWith('//')) {
              if (lines[j].includes('{')) braceCount++;
              if (lines[j].includes('}')) {
                braceCount--;
                if (braceCount === 0) {
                  lines[j] = '  // }; // Unused';
                  break;
                }
              }
              lines[j] = '  // ' + lines[j].trim();
            }
          }
        }
        // Fix handleVolumeChange
        if (lines[i].includes('// const __handleVolumeChange = (newVolume: number) => {')) {
          let braceCount = 1;
          for (let j = i + 1; j < lines.length && braceCount > 0; j++) {
            if (!lines[j].trim().startsWith('//')) {
              if (lines[j].includes('{')) braceCount++;
              if (lines[j].includes('}')) {
                braceCount--;
                if (braceCount === 0) {
                  lines[j] = '  // }; // Unused';
                  break;
                }
              }
              lines[j] = '  // ' + lines[j].trim();
            }
          }
        }
      }
      return lines.join('\n');
    }
  }
];

let totalFixed = 0;

for (const { file, fix } of fixes) {
  const fullPath = path.join(process.cwd(), file);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${file}`);
    continue;
  }
  
  const content = fs.readFileSync(fullPath, 'utf8');
  const fixed = fix(content);
  
  if (content !== fixed) {
    fs.writeFileSync(fullPath, fixed);
    console.log(`✏️  Fixed syntax errors in ${file}`);
    totalFixed++;
  }
}

console.log(`\n✅ Fixed ${totalFixed} files`);
console.log('🔄 Run "npx tsc --noEmit" to verify');
