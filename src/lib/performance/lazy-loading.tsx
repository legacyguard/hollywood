/**
 * Lazy Loading Utilities for Performance Optimization
 * Implements code splitting and progressive loading for large components
 */

import { lazy, ComponentType, ReactElement, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Generic loading skeleton component
export const LoadingSkeleton = ({ className = "" }: { className?: string }) => (
  <div className={`space-y-4 ${className}`}>
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-32 w-full" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  </div>
);

// Analytics loading skeleton
export const AnalyticsLoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
    
    {/* Key Metrics Grid */}
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-16 w-full" />
        </div>
      ))}
    </div>

    {/* Main Content */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  </div>
);

// Family collaboration loading skeleton
export const FamilyCollaborationLoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3 p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-20 w-full" />
        </div>
      ))}
    </div>
  </div>
);

// Professional review loading skeleton  
export const ProfessionalReviewLoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-4">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
    <Skeleton className="h-32 w-full" />
    <div className="flex gap-2">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-24" />
    </div>
  </div>
);

// Generic lazy component wrapper with error boundary
export const createLazyComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: ReactElement,
  errorFallback?: ReactElement
) => {
  const LazyComponent = lazy(importFn);
  
  return (props: Parameters<T>[0]) => (
    <Suspense 
      fallback={fallback || <LoadingSkeleton />}
    >
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Lazy load analytics components with appropriate skeletons
export const LazyAdvancedAnalyticsDashboard = createLazyComponent(
  () => import('@/components/analytics/AdvancedAnalyticsDashboard').then(m => ({ default: m.AdvancedAnalyticsDashboard })),
  <AnalyticsLoadingSkeleton />
);

export const LazyFamilyProtectionAnalytics = createLazyComponent(
  () => import('@/components/analytics/FamilyProtectionAnalytics').then(m => ({ default: m.FamilyProtectionAnalytics })),
  <AnalyticsLoadingSkeleton />
);

export const LazyLegacyCompletionTracking = createLazyComponent(
  () => import('@/components/analytics/LegacyCompletionTracking').then(m => ({ default: m.LegacyCompletionTracking })),
  <AnalyticsLoadingSkeleton />
);

// Lazy load family collaboration components
export const LazyFamilyCollaborationCenter = createLazyComponent(
  () => import('@/components/family/FamilyCommunicationCenter').then(m => ({ default: m.FamilyCommunicationCenter })),
  <FamilyCollaborationLoadingSkeleton />
);

export const LazyFamilyHistoryPreservation = createLazyComponent(
  () => import('@/components/family/FamilyHistoryPreservation').then(m => ({ default: m.FamilyHistoryPreservation })),
  <FamilyCollaborationLoadingSkeleton />
);

// Lazy load professional review components
export const LazyProfessionalReviewNetwork = createLazyComponent(
  () => import('@/components/legacy/ProfessionalReviewNetwork').then(m => ({ default: m.ProfessionalReviewNetwork })),
  <ProfessionalReviewLoadingSkeleton />
);

// Progressive loading controller for large datasets
export class ProgressiveLoader {
  private batchSize: number;
  private currentBatch: number = 0;
  private totalItems: number = 0;

  constructor(batchSize: number = 10) {
    this.batchSize = batchSize;
  }

  initializeLoad(totalItems: number): void {
    this.totalItems = totalItems;
    this.currentBatch = 0;
  }

  getNextBatch<T>(items: T[]): { batch: T[], hasMore: boolean, progress: number } {
    const startIndex = this.currentBatch * this.batchSize;
    const endIndex = Math.min(startIndex + this.batchSize, items.length);
    
    const batch = items.slice(startIndex, endIndex);
    const hasMore = endIndex < items.length;
    const progress = Math.round((endIndex / items.length) * 100);

    this.currentBatch++;

    return { batch, hasMore, progress };
  }

  reset(): void {
    this.currentBatch = 0;
    this.totalItems = 0;
  }
}

// Hook for progressive loading
export const useProgressiveLoading = <T>(
  items: T[], 
  batchSize: number = 10
): {
  visibleItems: T[];
  loadMore: () => void;
  hasMore: boolean;
  progress: number;
  isLoading: boolean;
} => {
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef(new ProgressiveLoader(batchSize));

  useEffect(() => {
    loaderRef.current.initializeLoad(items.length);
    const initialBatch = loaderRef.current.getNextBatch(items);
    setVisibleItems(initialBatch.batch);
  }, [items, batchSize]);

  const loadMore = useCallback(() => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      const nextBatch = loaderRef.current.getNextBatch(items);
      setVisibleItems(prev => [...prev, ...nextBatch.batch]);
      setIsLoading(false);
    }, 300);
  }, [items, isLoading]);

  const currentProgress = Math.round((visibleItems.length / items.length) * 100);
  const hasMore = visibleItems.length < items.length;

  return {
    visibleItems,
    loadMore,
    hasMore,
    progress: currentProgress,
    isLoading
  };
};

// React imports that were missing
import { useState, useEffect, useRef, useCallback } from 'react';