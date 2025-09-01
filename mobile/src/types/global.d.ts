// Global type declarations for mobile app

declare module '@legacyguard/ui' {
  export * from 'tamagui';
  export const tamaguiConfig: any;
}

declare module '@legacyguard/logic' {
  export interface TextManager {
    setUserStyle(userId: string, style: string): void;
    analyzeUserInput(input: string): void;
  }
  
  export const textManager: TextManager;
  
  export class TextAnalyzer {
    constructor();
    analyzeText(text: string): { detectedStyle: string };
  }
}

declare module '@hollywood/shared' {
  // Add shared module exports here
}

// Expo module declarations
declare module 'expo-web-browser' {
  export function openBrowserAsync(url: string): Promise<any>;
  export function maybeCompleteAuthSession(): { type: string };
}

// Fix for React Native types
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
