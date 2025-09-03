import { useContext } from 'react';
import type { DocumentFilterContextType } from './documentFilterTypes';

// This context is defined in DocumentFilterContext.tsx
declare const DocumentFilterContext: any;

export const useDocumentFilter = () => {
  const context = useContext(DocumentFilterContext);
  if (!context) {
    throw new Error(
      'useDocumentFilter must be used within a DocumentFilterProvider'
    );
  }
  return context;
};
