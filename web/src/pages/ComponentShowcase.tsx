import { DashboardLayout } from '@/components/DashboardLayout';
import { MetricCard, MetricsGrid } from '@/components/enhanced/MetricCard';
import {
  ActivityFeed,
  useMockActivities,
} from '@/components/enhanced/ActivityFeed';
import {
  DataTable,
  createSelectColumn,
  createSortableHeader,
  createActionsColumn,
} from '@/components/enhanced/DataTable';
import {
  RadialProgress,
  LinearProgress,
  ProgressGroup,
} from '@/components/enhanced/RadialProgress';
import { ProfileCard, ProfileGrid, type ProfileData } from '@/components/enhanced/ProfileCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FadeIn } from '@/components/motion/FadeIn';
import { toast } from 'sonner';
import type { ColumnDef } from '@tanstack/react-table';

// Mock data for DataTable
interface DocumentData {
  id: string;
  name: string;
  category: string;
  size: string;
  uploadedAt: string;
  status: 'processed' | 'processing' | 'pending';
}

const mockDocuments: DocumentData[] = [
  {
    id: '1',
    name: 'Birth Certificate.pdf',
    category: 'Personal',
    size: '2.4 MB',
    uploadedAt: '2024-01-15',
    status: 'processed',
  },
  {
    id: '2',
    name: 'Insurance Policy.pdf',
    category: 'Financial',
    size: '1.8 MB',
    uploadedAt: '2024-01-14',
    status: 'processed',
  },
  {
    id: '3',
    name: 'Will Draft.docx',
    category: 'Legal',
    size: '345 KB',
    uploadedAt: '2024-01-13',
    status: 'processing',
  },
  {
    id: '4',
    name: 'Property Deed.pdf',
    category: 'Property',
    size: '5.2 MB',
    uploadedAt: '2024-01-12',
    status: 'processed',
  },
  {
    id: '5',
    name: 'Medical Records.pdf',
    category: 'Health',
    size: '3.1 MB',
    uploadedAt: '2024-01-11',
    status: 'pending',
  },
];

// Mock profiles
const mockProfiles: ProfileData[] = [
  {
    id: '1',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+1 234 567 8900',
    relationship: 'Spouse',
    roles: ['Executor', 'Beneficiary'],
    status: 'active',
    completionPercentage: 100,
    dateOfBirth: '1985-03-15',
  },
  {
    id: '2',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 234 567 8901',
    relationship: 'Brother',
    roles: ['Guardian'],
    status: 'pending',
    completionPercentage: 75,
  },
  {
    id: '3',
    name: 'Mary Johnson',
    email: 'mary.j@example.com',
    relationship: 'Mother',
    roles: ['Beneficiary'],
    status: 'active',
    completionPercentage: 90,
  },
];

export default function ComponentShowcase() {
  const activities = useMockActivities();

  // Define columns for DataTable
  const columns: ColumnDef<DocumentData>[] = [
    createSelectColumn<DocumentData>(),
    {
      accessorKey: 'name',
      header: createSortableHeader('Document Name'),
    },
    {
      accessorKey: 'category',
      header: createSortableHeader('Category'),
      cell: ({ row }) => (
        <span className='px-2 py-1 bg-primary/10 text-primary rounded-md text-xs'>
          {row.getValue('category')}
        </span>
      ),
    },
    {
      accessorKey: 'size',
      header: 'Size',
    },
    {
      accessorKey: 'uploadedAt',
      header: createSortableHeader('Uploaded'),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const colors = {
          processed: 'bg-green-100 text-green-800',
          processing: 'bg-yellow-100 text-yellow-800',
          pending: 'bg-gray-100 text-gray-800',
        };
        return (
          <span
            className={`px-2 py-1 rounded-md text-xs ${colors[status as keyof typeof colors]}`}
          >
            {status}
          </span>
        );
      },
    },
    createActionsColumn<DocumentData>([
      {
        label: 'View',
        onClick: row => toast.info(`Viewing ${row.name}`),
      },
      {
        label: 'Download',
        onClick: row => toast.success(`Downloading ${row.name}`),
      },
      {
        label: 'Delete',
        onClick: row => toast.error(`Deleted ${row.name}`),
      },
    ]),
  ];

  const metrics = [
    {
      title: 'Total Documents',
      value: '156',
      change: 12,
      trend: 'up',
      icon: 'file-text',
      color: 'primary',
    },
    {
      title: 'Family Members',
      value: '12',
      change: 8,
      trend: 'up',
      icon: 'users',
      color: 'success',
    },
    {
      title: 'Completion Rate',
      value: '87%',
      change: 5,
      trend: 'up',
      icon: 'trending-up',
      color: 'warning',
    },
    {
      title: 'Days Active',
      value: '234',
      icon: 'calendar',
      color: 'info',
    },
  ];

  const progressItems = [
    { label: 'Documents', value: 85, color: 'primary' },
    { label: 'Family Setup', value: 92, color: 'success' },
    { label: 'Will Progress', value: 67, color: 'warning' },
    { label: 'Security', value: 100, color: 'info' },
  ];

  return (
    <DashboardLayout>
      <div className='min-h-screen bg-background'>
        <header className='bg-card border-b border-card-border'>
          <div className='max-w-7xl mx-auto px-6 lg:px-8 py-8'>
            <FadeIn duration={0.5} delay={0.2}>
              <h1 className='text-3xl lg:text-4xl font-bold font-heading text-card-foreground mb-3'>
                Enhanced Components Showcase
              </h1>
            </FadeIn>
            <FadeIn duration={0.5} delay={0.4}>
              <p className='text-lg leading-relaxed max-w-2xl text-muted-foreground'>
                Preview all enhanced UI components from Tailadmin and Hero UI
                templates
              </p>
            </FadeIn>
          </div>
        </header>

        <main className='max-w-7xl mx-auto px-6 lg:px-8 py-12'>
          <Tabs defaultValue='metrics' className='space-y-8'>
            <TabsList className='grid w-full grid-cols-5'>
              <TabsTrigger value='metrics'>Metrics</TabsTrigger>
              <TabsTrigger value='activity'>Activity</TabsTrigger>
              <TabsTrigger value='datatable'>Data Table</TabsTrigger>
              <TabsTrigger value='progress'>Progress</TabsTrigger>
              <TabsTrigger value='profiles'>Profiles</TabsTrigger>
            </TabsList>

            <TabsContent value='metrics' className='space-y-8'>
              <Card>
                <CardHeader>
                  <CardTitle>Metric Cards</CardTitle>
                </CardHeader>
                <CardContent className='space-y-8'>
                  <div>
                    <h3 className='text-sm font-medium mb-4'>
                      Grid Layout (4 columns)
                    </h3>
                    <MetricsGrid metrics={metrics} columns={4} />
                  </div>

                  <div>
                    <h3 className='text-sm font-medium mb-4'>
                      Individual Cards
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <MetricCard
                        title='Revenue This Month'
                        value='$45,231'
                        change={23}
                        trend='up'
                        icon='dollar-sign'
                        color='success'
                      />
                      <MetricCard
                        title='Pending Tasks'
                        value='17'
                        change={-5}
                        trend='down'
                        icon='check-circle'
                        color='warning'
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='activity' className='space-y-8'>
              <Card>
                <CardHeader>
                  <CardTitle>Activity Feed</CardTitle>
                </CardHeader>
                <CardContent>
                  <ActivityFeed
                    activities={activities}
                    title='Recent Activity'
                    maxHeight='500px'
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='datatable' className='space-y-8'>
              <DataTable
                columns={columns}
                data={mockDocuments}
                title='Document Management'
                description='Advanced data table with sorting, filtering, and bulk actions'
                onExport={() =>
                  toast.info('Export functionality would be here')
                }
              />
            </TabsContent>

            <TabsContent value='progress' className='space-y-8'>
              <Card>
                <CardHeader>
                  <CardTitle>Progress Indicators</CardTitle>
                </CardHeader>
                <CardContent className='space-y-8'>
                  <div>
                    <h3 className='text-sm font-medium mb-4'>
                      Radial Progress
                    </h3>
                    <div className='flex flex-wrap gap-8'>
                      <RadialProgress value={75} label='Overall' size='sm' />
                      <RadialProgress
                        value={85}
                        label='Documents'
                        size='md'
                        color='success'
                      />
                      <RadialProgress
                        value={60}
                        label='Family'
                        size='lg'
                        color='warning'
                      />
                      <RadialProgress
                        value={95}
                        label='Security'
                        size='xl'
                        color='info'
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className='text-sm font-medium mb-4'>
                      Linear Progress
                    </h3>
                    <div className='space-y-4'>
                      <LinearProgress value={75} label='Profile Completion' />
                      <LinearProgress
                        value={90}
                        label='Document Upload'
                        color='success'
                      />
                      <LinearProgress
                        value={45}
                        label='Will Draft'
                        color='warning'
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className='text-sm font-medium mb-4'>Progress Group</h3>
                    <ProgressGroup items={progressItems} type='linear' />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='profiles' className='space-y-8'>
              <Card>
                <CardHeader>
                  <CardTitle>Profile Cards</CardTitle>
                </CardHeader>
                <CardContent className='space-y-8'>
                  <div>
                    <h3 className='text-sm font-medium mb-4'>Default Grid</h3>
                    <ProfileGrid
                      profiles={mockProfiles}
                      columns={3}
                      onEdit={profile => toast.info(`Edit ${profile.name}`)}
                      onDelete={profile =>
                        toast.error(`Delete ${profile.name}`)
                      }
                      onViewDetails={profile =>
                        toast.info(`View ${profile.name}`)
                      }
                    />
                  </div>

                  <div>
                    <h3 className='text-sm font-medium mb-4'>
                      Compact Variant
                    </h3>
                    <ProfileGrid
                      profiles={mockProfiles}
                      variant={"compact"}
                      columns={2}
                    />
                  </div>

                  <div>
                    <h3 className='text-sm font-medium mb-4'>
                      Detailed Variant
                    </h3>
                    <ProfileCard
                      profile={{
                        ...mockProfiles[0],
                        metadata: {
                          'Last Login': '2 hours ago',
                          Documents: '24',
                          Tasks: '5 pending',
                        },
                      }}
                      variant={"detailed"}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </DashboardLayout>
  );
}
