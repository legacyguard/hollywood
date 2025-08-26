import React from 'react';
import { useParams } from 'react-router-dom';
import EmergencyDashboard from '@/components/emergency/EmergencyDashboard';

/**
 * Route component for guardian emergency verification
 * URL: /emergency/verify/:token
 */
export default function EmergencyVerification() {
  const { token } = useParams<{ token: string }>();

  return (
    <div className='min-h-screen'>
      <EmergencyDashboard verificationToken={token} guardianAccess={true} />
    </div>
  );
}
