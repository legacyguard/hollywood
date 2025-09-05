
import React from 'react';
import { PerformanceDashboard } from '@/components/performance/PerformanceDashboard';

export default function PerformancePage() {
  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-3xl font-bold mb-8'>Performance Dashboard</h1>
      <PerformanceDashboard />
    </div>
  );
}
