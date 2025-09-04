#!/usr/bin/env tsx
/**
 * Extract Hardcoded Texts
 * Scans codebase for hardcoded strings that should be internationalized
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';

interface HardcodedText {
  text: string;
  file: string;
  line: number;
  column: number;
  type: 'jsx' | 'string' | 'template';
  context?: string;
  component?: string;
  suggestion?: string;
}

interface ExtractionReport {
  timestamp: string;
  totalFiles: number;
  totalTexts: number;
  byFile: Map<string, HardcodedText[]>;
  byComponent: Map<string, HardcodedText[]>;
  ignored: string[];
  suggestions: Map<string, string>;
}

class TextExtractor {
  private texts: HardcodedText[] = [];
  private ignoredPatterns = [
    // Technical strings
    /^[a-z0-9-_]+$/i, // IDs, keys, classes
    /^[A-Z_]+$/, // Constants
    /^\d+$/, // Numbers
    /^[a-z]+:\/\//i, // URLs
    /^#[0-9a-f]{3,8}$/i, // Hex colors
    /^\.[a-z-]+$/i, // File extensions
    /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i, // Emails

    // Code patterns
    /^(import|export|from|const|let|var|function|class|interface|type|enum)/, // JS keywords
    /^(useState|useEffect|useCallback|useMemo)/, // React hooks
    /^(div|span|button|input|form|section|article|nav)$/, // HTML elements

    // Single characters or very short
    /^.{1,2}$/, // Too short to be meaningful text

    // File paths and imports
    /^(@\/|\.\/|\.\.\/|\/)/, // Path prefixes
    /\.(tsx?|jsx?|css|scss|json|png|jpg|svg)$/, // File extensions
  ];

  private meaningfulPatterns = [
    // User-facing text indicators
    /[A-Z][a-z]+/, // Sentence case
    /\s+/, // Contains spaces
    /[.!?]$/, // Ends with punctuation
    /^(Please|Enter|Click|Select|Choose|Submit|Cancel|Save|Delete|Edit|Add|Remove|Update|Create)/, // Action words
  ];

  async extractFromDirectory(directory: string): Promise<ExtractionReport> {
    console.log(`🔍 Scanning directory: ${directory}\n`);

    const pattern = path.join(directory, '**/*.{ts,tsx,js,jsx}');
    const files = await glob(pattern, {
      ignore: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/*.test.*',
        '**/*.spec.*',
        '**/*.d.ts',
        '**/scripts/**',
        '**/locales/**',
      ],
    });

    console.log(`Found ${files.length} files to analyze\n`);

    for (const file of files) {
      await this.extractFromFile(file);
    }

    return this.generateReport();
  }

  private async extractFromFile(filePath: string): Promise<void> {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const ast = parser.parse(content, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript', 'decorators-legacy'],
        sourceFilename: filePath,
      });

      const componentName = this.extractComponentName(ast);

      traverse(ast, {
        // JSX Text
        JSXText: path => {
          const text = path.node.value.trim();
          if (text && this.shouldExtract(text)) {
            this.addText({
              text,
              file: filePath,
              line: path.node.loc?.start.line || 0,
              column: path.node.loc?.start.column || 0,
              type: 'jsx',
              component: componentName,
              context: this.getContext(path),
            });
          }
        },

        // String literals
        StringLiteral: path => {
          const text = path.node.value;

          // Skip import/export statements
          if (path.isImportDeclaration() || path.isExportDeclaration()) {
            return;
          }

          // Check if it's a user-facing string
          if (this.shouldExtract(text) && this.isUserFacing(path)) {
            this.addText({
              text,
              file: filePath,
              line: path.node.loc?.start.line || 0,
              column: path.node.loc?.start.column || 0,
              type: 'string',
              component: componentName,
              context: this.getContext(path),
            });
          }
        },

        // Template literals
        TemplateLiteral: path => {
          // Only extract if it's a simple template without expressions
          if (
            path.node.expressions.length === 0 &&
            path.node.quasis.length === 1
          ) {
            const text = path.node.quasis[0].value.raw;
            if (this.shouldExtract(text) && this.isUserFacing(path)) {
              this.addText({
                text,
                file: filePath,
                line: path.node.loc?.start.line || 0,
                column: path.node.loc?.start.column || 0,
                type: 'template',
                component: componentName,
                context: this.getContext(path),
              });
            }
          }
        },
      });
    } catch (error) {
      console.error(`Error parsing ${filePath}:`, error);
    }
  }

  private shouldExtract(text: string): boolean {
    // Skip if matches ignored patterns
    if (this.ignoredPatterns.some(pattern => pattern.test(text))) {
      return false;
    }

    // Include if matches meaningful patterns
    if (this.meaningfulPatterns.some(pattern => pattern.test(text))) {
      return true;
    }

    // Default: include if longer than 3 characters
    return text.length > 3;
  }

  private isUserFacing(path: any): boolean {
    // Check if the string is likely user-facing
    const parent = path.parent;

    // JSX attributes that typically contain user-facing text
    if (t.isJSXAttribute(parent)) {
      const attrName = parent.name.name;
      const userFacingAttrs = [
        'title',
        'label',
        'placeholder',
        'alt',
        'aria-label',
        'aria-description',
        'helperText',
        'errorMessage',
        'description',
        'tooltip',
        'message',
        'content',
        'text',
      ];
      return userFacingAttrs.includes(attrName);
    }

    // Common function calls with user-facing text
    if (t.isCallExpression(parent)) {
      const callee = parent.callee;
      if (t.isIdentifier(callee)) {
        const userFacingFunctions = [
          'alert',
          'confirm',
          'prompt',
          'toast',
          'notify',
          'setError',
          'setMessage',
          'console.log',
          'console.error',
        ];
        return userFacingFunctions.includes(callee.name);
      }
    }

    // Object properties that typically contain user-facing text
    if (t.isObjectProperty(parent)) {
      const key = parent.key;
      if (t.isIdentifier(key)) {
        const userFacingProps = [
          'title',
          'description',
          'message',
          'label',
          'text',
          'error',
          'success',
          'warning',
          'info',
          'placeholder',
        ];
        return userFacingProps.includes(key.name);
      }
    }

    return false;
  }

  private getContext(path: any): string {
    // Try to get surrounding context
    let context = '';

    // Get parent JSX element name
    const jsxElement = path.findParent((p: any) => t.isJSXElement(p));
    if (jsxElement && t.isJSXIdentifier(jsxElement.node.openingElement.name)) {
      context = jsxElement.node.openingElement.name.name;
    }

    // Get function name if inside one
    const functionParent = path.findParent(
      (p: any) => t.isFunctionDeclaration(p) || t.isArrowFunctionExpression(p)
    );
    if (functionParent && t.isFunctionDeclaration(functionParent.node)) {
      context = `${functionParent.node.id?.name || 'anonymous'}()`;
    }

    return context;
  }

  private extractComponentName(ast: any): string {
    let componentName = 'Unknown';

    traverse(ast, {
      ExportDefaultDeclaration(path) {
        const declaration = path.node.declaration;
        if (t.isIdentifier(declaration)) {
          componentName = declaration.name;
        } else if (t.isFunctionDeclaration(declaration) && declaration.id) {
          componentName = declaration.id.name;
        }
      },
      FunctionDeclaration(path) {
        if (path.node.id && /^[A-Z]/.test(path.node.id.name)) {
          componentName = path.node.id.name;
        }
      },
    });

    return componentName;
  }

  private addText(text: HardcodedText): void {
    // Generate translation key suggestion
    text.suggestion = this.generateKeySuggestion(text);

    // Check for duplicates
    const exists = this.texts.some(
      t => t.text === text.text && t.file === text.file && t.line === text.line
    );

    if (!exists) {
      this.texts.push(text);
    }
  }

  private generateKeySuggestion(text: HardcodedText): string {
    // Generate a suggested translation key
    const namespace = this.suggestNamespace(text);
    const key = text.text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 30);

    return `${namespace}.${key}`;
  }

  private suggestNamespace(text: HardcodedText): string {
    const filePath = text.file.toLowerCase();

    // Determine namespace based on file path
    if (
      filePath.includes('/auth/') ||
      filePath.includes('login') ||
      filePath.includes('register')
    ) {
      return 'auth';
    }
    if (filePath.includes('/vault/')) {
      return 'features.vault';
    }
    if (filePath.includes('/garden/') || filePath.includes('/legacy/')) {
      return 'features.garden';
    }
    if (filePath.includes('/family/') || filePath.includes('/guardian/')) {
      return 'features.family';
    }
    if (filePath.includes('/sofia/')) {
      return 'features.sofia';
    }
    if (filePath.includes('/components/ui/')) {
      return 'common.ui';
    }
    if (filePath.includes('/landing/')) {
      return 'web.landing';
    }

    return 'common';
  }

  private generateReport(): ExtractionReport {
    const byFile = new Map<string, HardcodedText[]>();
    const byComponent = new Map<string, HardcodedText[]>();
    const suggestions = new Map<string, string>();

    // Group texts
    for (const text of this.texts) {
      // By file
      const fileTexts = byFile.get(text.file) || [];
      fileTexts.push(text);
      byFile.set(text.file, fileTexts);

      // By component
      if (text.component) {
        const componentTexts = byComponent.get(text.component) || [];
        componentTexts.push(text);
        byComponent.set(text.component, componentTexts);
      }

      // Suggestions
      if (text.suggestion) {
        suggestions.set(text.text, text.suggestion);
      }
    }

    return {
      timestamp: new Date().toISOString(),
      totalFiles: byFile.size,
      totalTexts: this.texts.length,
      byFile,
      byComponent,
      ignored: [],
      suggestions,
    };
  }

  exportReport(
    report: ExtractionReport,
    format: 'json' | 'csv' | 'markdown' = 'json'
  ): void {
    const outputDir = './locales/_extraction';
    fs.mkdirSync(outputDir, { recursive: true });

    switch (format) {
      case 'json':
        this.exportJSON(report, outputDir);
        break;
      case 'csv':
        this.exportCSV(report, outputDir);
        break;
      case 'markdown':
        this.exportMarkdown(report, outputDir);
        break;
    }
  }

  private exportJSON(report: ExtractionReport, outputDir: string): void {
    const output = {
      ...report,
      byFile: Array.from(report.byFile.entries()),
      byComponent: Array.from(report.byComponent.entries()),
      suggestions: Array.from(report.suggestions.entries()),
    };

    fs.writeFileSync(
      path.join(outputDir, 'hardcoded-texts.json'),
      JSON.stringify(output, null, 2)
    );

    console.log(`✅ JSON report saved to ${outputDir}/hardcoded-texts.json`);
  }

  private exportCSV(report: ExtractionReport, outputDir: string): void {
    const csvLines = [
      'File,Line,Column,Text,Type,Context,Component,Suggestion',
    ];

    for (const [file, texts] of report.byFile) {
      for (const text of texts) {
        csvLines.push(
          [
            file,
            text.line,
            text.column,
            `"${text.text.replace(/"/g, '""')}"`,
            text.type,
            text.context || '',
            text.component || '',
            text.suggestion || '',
          ].join(',')
        );
      }
    }

    fs.writeFileSync(
      path.join(outputDir, 'hardcoded-texts.csv'),
      csvLines.join('\n')
    );

    console.log(`✅ CSV report saved to ${outputDir}/hardcoded-texts.csv`);
  }

  private exportMarkdown(report: ExtractionReport, outputDir: string): void {
    const lines: string[] = [
      '# Hardcoded Texts Extraction Report',
      '',
      `Generated: ${report.timestamp}`,
      '',
      '## Summary',
      '',
      `- **Total Files**: ${report.totalFiles}`,
      `- **Total Texts**: ${report.totalTexts}`,
      '',
      '## Texts by File',
      '',
    ];

    for (const [file, texts] of report.byFile) {
      lines.push(`### ${file}`);
      lines.push('');
      lines.push('| Line | Text | Type | Suggestion |');
      lines.push('|------|------|------|------------|');

      for (const text of texts) {
        lines.push(
          `| ${text.line} | ${text.text} | ${text.type} | ${text.suggestion || '-'} |`
        );
      }
      lines.push('');
    }

    fs.writeFileSync(
      path.join(outputDir, 'hardcoded-texts.md'),
      lines.join('\n')
    );

    console.log(`✅ Markdown report saved to ${outputDir}/hardcoded-texts.md`);
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  const directory = args[0] || './src';
  const format = (args[1] || 'json') as 'json' | 'csv' | 'markdown';

  const extractor = new TextExtractor();
  const report = await extractor.extractFromDirectory(directory);

  console.log('\n📊 Extraction Summary:');
  console.log(`  Total files analyzed: ${report.totalFiles}`);
  console.log(`  Total texts found: ${report.totalTexts}`);
  console.log('');

  // Show top files with most texts
  const topFiles = Array.from(report.byFile.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 5);

  console.log('📌 Top files with hardcoded texts:');
  for (const [file, texts] of topFiles) {
    console.log(`  ${path.relative('.', file)}: ${texts.length} texts`);
  }

  // Export report
  console.log('');
  extractor.exportReport(report, format);
}

if (require.main === module) {
  main().catch(console.error);
}

export { TextExtractor, HardcodedText, ExtractionReport };
