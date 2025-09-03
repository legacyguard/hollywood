export interface DocumentFilter {
  category?: string;
  documentType?: string;
  isExpiring?: boolean;
  expiringDays?: number;
  searchQuery?: string;
  bundleName?: string;
  bundleId?: string;
}

export interface DocumentFilterContextType {
  filter: DocumentFilter;
  setFilter: (filter: DocumentFilter) => void;
  clearFilter: () => void;
  hasActiveFilter: boolean;
}
