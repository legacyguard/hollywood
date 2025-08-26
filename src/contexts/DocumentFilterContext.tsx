import type { ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react';

export interface DocumentFilter {
  category?: string;
  documentType?: string;
  isExpiring?: boolean;
  expiringDays?: number;
  searchQuery?: string;
  bundleName?: string;
  bundleId?: string;
}

interface DocumentFilterContextType {
  filter: DocumentFilter;
  setFilter: (filter: DocumentFilter) => void;
  clearFilter: () => void;
  hasActiveFilter: boolean;
}

const DocumentFilterContext = createContext<
  DocumentFilterContextType | undefined
>(undefined);

export const useDocumentFilter = () => {
  const context = useContext(DocumentFilterContext);
  if (!context) {
    throw new Error(
      'useDocumentFilter must be used within a DocumentFilterProvider'
    );
  }
  return context;
};

interface DocumentFilterProviderProps {
  children: ReactNode;
}

export const DocumentFilterProvider: React.FC<DocumentFilterProviderProps> = ({
  children,
}) => {
  const [filter, setFilterState] = useState<DocumentFilter>({});

  const setFilter = (newFilter: DocumentFilter) => {
    setFilterState(newFilter);
  };

  const clearFilter = () => {
    setFilterState({});
  };

  const hasActiveFilter = Object.keys(filter).some(key => {
    const value = filter[key as keyof DocumentFilter];
    return value !== undefined && value !== '' && value !== null;
  });

  return (
    <DocumentFilterContext.Provider
      value={{
        filter,
        setFilter,
        clearFilter,
        hasActiveFilter,
      }}
    >
      {children}
    </DocumentFilterContext.Provider>
  );
};
