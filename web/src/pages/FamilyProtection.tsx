
// Family Protection Page - Main interface for Phase 3A Family Shield System
// Comprehensive family emergency protection management with Sofia personality integration

import React from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { DashboardLayout } from '@/components/DashboardLayout';
import { FamilyProtectionDashboard } from '@/components/emergency/FamilyProtectionDashboard';

export default function FamilyProtectionPage() {
  usePageTitle('Family Protection');

  return (
    <DashboardLayout>
      <div className='min-h-screen bg-background'>
        {/* Main Content */}
        <main className='max-w-7xl mx-auto px-6 lg:px-8 py-8'>
          <FamilyProtectionDashboard />
        </main>
      </div>
    </DashboardLayout>
  );
}
