import { DashboardLayout } from '@/components/DashboardLayout';
import { DashboardContent } from '@/components/DashboardContent';
import { usePageTitle } from '@/hooks/usePageTitle';

const Index = () => {
  usePageTitle('Dashboard');

  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
};

export default Index;
