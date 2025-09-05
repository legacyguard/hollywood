
/**
 * Social Collaboration Page
 * Phase 8: Social Collaboration & Family Features
 *
 * Main hub for family collaboration, document sharing, and social features
 */

import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  Bell,
  Heart,
  MessageCircle,
  Settings,
  Share2,
  Shield,
  Users,
} from 'lucide-react';
import FamilyManagement from '@/components/social/FamilyManagement';
import DocumentSharing from '@/components/social/DocumentSharing';
import { cn } from '@/lib/utils';

export default function SocialCollaborationPage() {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in real implementation, this would come from services
  const stats = {
    familyMembers: 4,
    sharedDocuments: 12,
    pendingInvites: 2,
    recentActivity: 8,
  };

  return (
    <DashboardLayout>
      <div className='container mx-auto p-6 space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>
              Family Collaboration
            </h1>
            <p className='text-muted-foreground'>
              Manage your family network and share important documents securely
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Button variant='outline'>
              <Bell className='h-4 w-4 mr-2' />
              Notifications
              {stats.recentActivity > 0 && (
                <Badge variant='destructive' className='ml-2'>
                  {stats.recentActivity}
                </Badge>
              )}
            </Button>
            <Button variant='outline'>
              <Settings className='h-4 w-4 mr-2' />
              Settings
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className='space-y-6'
        >
          <TabsList className='grid w-full grid-cols-5'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='family'>Family</TabsTrigger>
            <TabsTrigger value='sharing'>Sharing</TabsTrigger>
            <TabsTrigger value='emergency'>Emergency</TabsTrigger>
            <TabsTrigger value='activity'>Activity</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value='overview' className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Family Members
                  </CardTitle>
                  <Users className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {stats.familyMembers}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    {stats.pendingInvites} pending invites
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Shared Documents
                  </CardTitle>
                  <Share2 className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {stats.sharedDocuments}
                  </div>
                  <p className='text-xs text-muted-foreground'>Active shares</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Emergency Access
                  </CardTitle>
                  <Shield className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold text-green-600'>
                    Active
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    3 emergency contacts
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Recent Activity
                  </CardTitle>
                  <Activity className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {stats.recentActivity}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    In the last 7 days
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Users className='h-5 w-5' />
                    Quick Family Actions
                  </CardTitle>
                  <CardDescription>
                    Common family management tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <Button variant='outline' className='w-full justify-start'>
                    <Users className='h-4 w-4 mr-2' />
                    Invite New Family Member
                  </Button>
                  <Button variant='outline' className='w-full justify-start'>
                    <Share2 className='h-4 w-4 mr-2' />
                    Share Important Documents
                  </Button>
                  <Button variant='outline' className='w-full justify-start'>
                    <Shield className='h-4 w-4 mr-2' />
                    Update Emergency Contacts
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Heart className='h-5 w-5' />
                    Family Insights
                  </CardTitle>
                  <CardDescription>
                    Recent collaboration highlights
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <div className='flex items-center gap-3 p-3 bg-green-50 rounded-lg'>
                    <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                    <div className='flex-1'>
                      <p className='text-sm font-medium'>
                        All family members active
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        Everyone has accessed shared documents recently
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-3 p-3 bg-blue-50 rounded-lg'>
                    <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                    <div className='flex-1'>
                      <p className='text-sm font-medium'>
                        5 new documents shared
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        Family members added important files this week
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-3 p-3 bg-yellow-50 rounded-lg'>
                    <div className='w-2 h-2 bg-yellow-500 rounded-full'></div>
                    <div className='flex-1'>
                      <p className='text-sm font-medium'>
                        Emergency protocol updated
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        Review new emergency access settings
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity Preview */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Activity className='h-5 w-5' />
                  Recent Family Activity
                </CardTitle>
                <CardDescription>
                  Latest collaboration and sharing events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {[
                    {
                      action: 'shared a document',
                      user: 'Sarah Johnson',
                      target: 'Insurance Policy 2024',
                      time: '2 hours ago',
                      icon: Share2,
                    },
                    {
                      action: 'joined the family',
                      user: 'Michael Johnson',
                      target: 'The Johnson Family',
                      time: '1 day ago',
                      icon: Users,
                    },
                    {
                      action: 'commented on',
                      user: 'Emma Johnson',
                      target: 'Will and Testament',
                      time: '2 days ago',
                      icon: MessageCircle,
                    },
                    {
                      action: 'updated emergency contact',
                      user: 'David Johnson',
                      target: 'Emergency Protocol',
                      time: '3 days ago',
                      icon: Shield,
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className='flex items-center gap-3 pb-3 border-b last:border-0'
                    >
                      <div className='p-2 bg-muted rounded-full'>
                        <activity.icon className='h-3 w-3' />
                      </div>
                      <div className='flex-1'>
                        <p className='text-sm'>
                          <span className='font-medium'>{activity.user}</span>{' '}
                          {activity.action}{' '}
                          <span className='font-medium'>{activity.target}</span>
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className='mt-4'>
                  <Button
                    variant='outline'
                    className='w-full'
                    onClick={() => setActiveTab('activity')}
                  >
                    View All Activity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Family Management Tab */}
          <TabsContent value='family'>
            <FamilyManagement />
          </TabsContent>

          {/* Document Sharing Tab */}
          <TabsContent value='sharing'>
            <DocumentSharing />
          </TabsContent>

          {/* Emergency Access Tab */}
          <TabsContent value='emergency'>
            <EmergencyAccessTab />
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value='activity'>
            <ActivityFeedTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

// Sub-components for different tabs

function EmergencyAccessTab() {
  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Shield className='h-5 w-5' />
            Emergency Access Management
          </CardTitle>
          <CardDescription>
            Configure emergency protocols and trusted contacts for critical
            situations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>Emergency Contacts</h3>

              {[
                {
                  name: 'Sarah Johnson',
                  relationship: 'Spouse',
                  phone: '+1 (555) 123-4567',
                  email: 'sarah@example.com',
                  priority: 1,
                  verified: true,
                },
                {
                  name: 'Dr. Emily Roberts',
                  relationship: 'Family Doctor',
                  phone: '+1 (555) 987-6543',
                  email: 'emily@medicalpractice.com',
                  priority: 2,
                  verified: true,
                },
                {
                  name: 'James Wilson',
                  relationship: 'Attorney',
                  phone: '+1 (555) 456-7890',
                  email: 'james@lawfirm.com',
                  priority: 3,
                  verified: false,
                },
              ].map((contact, index) => (
                <Card key={index}>
                  <CardContent className='p-4'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <div className='flex items-center gap-2'>
                          <h4 className='font-medium'>{contact.name}</h4>
                          <Badge variant='outline' className='text-xs'>
                            Priority {contact.priority}
                          </Badge>
                          {contact.verified && (
                            <Badge
                              variant='default'
                              className='text-xs bg-green-100 text-green-800'
                            >
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className='text-sm text-muted-foreground'>
                          {contact.relationship}
                        </p>
                        <div className='flex items-center gap-4 mt-1'>
                          <span className='text-xs text-muted-foreground'>
                            {contact.phone}
                          </span>
                          <span className='text-xs text-muted-foreground'>
                            {contact.email}
                          </span>
                        </div>
                      </div>
                      <Button variant='ghost' size='sm'>
                        <Settings className='h-4 w-4' />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button variant='outline' className='w-full'>
                <Users className='h-4 w-4 mr-2' />
                Add Emergency Contact
              </Button>
            </div>

            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>Emergency Protocols</h3>

              <Card>
                <CardContent className='p-4'>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>
                        Inactivity Trigger
                      </span>
                      <Badge variant='outline'>30 days</Badge>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>
                        Verification Required
                      </span>
                      <Badge variant='default'>Yes</Badge>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>Access Level</span>
                      <Badge variant='outline'>Standard</Badge>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>Time Delay</span>
                      <Badge variant='outline'>72 hours</Badge>
                    </div>
                  </div>

                  <div className='mt-4 pt-3 border-t'>
                    <p className='text-xs text-muted-foreground'>
                      Last tested: Never
                    </p>
                    <div className='flex gap-2 mt-2'>
                      <Button variant='outline' size='sm'>
                        Edit Protocol
                      </Button>
                      <Button variant='outline' size='sm'>
                        Test Protocol
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='text-base'>
                    Accessible Documents
                  </CardTitle>
                  <CardDescription className='text-sm'>
                    Documents available during emergency access
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    {[
                      'Legal Documents (5)',
                      'Financial Records (8)',
                      'Medical Information (3)',
                      'Insurance Policies (4)',
                      'Emergency Instructions (2)',
                    ].map((category, index) => (
                      <div
                        key={index}
                        className='flex items-center justify-between py-2 border-b last:border-0'
                      >
                        <span className='text-sm'>{category}</span>
                        <Badge variant='outline' className='text-xs'>
                          Included
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ActivityFeedTab() {
  const activities = [
    {
      id: 1,
      type: 'document_shared',
      user: 'Sarah Johnson',
      action: 'shared',
      target: 'Medical Records 2024',
      targetType: 'document',
      timestamp: '2024-01-15T14:30:00Z',
      metadata: { recipients: 2, permissions: ['view', 'download'] },
    },
    {
      id: 2,
      type: 'member_joined',
      user: 'Michael Johnson',
      action: 'joined',
      target: 'The Johnson Family',
      targetType: 'family',
      timestamp: '2024-01-14T09:15:00Z',
      metadata: { role: 'member' },
    },
    {
      id: 3,
      type: 'emergency_updated',
      user: 'David Johnson',
      action: 'updated',
      target: 'Emergency Protocol',
      targetType: 'protocol',
      timestamp: '2024-01-13T16:45:00Z',
      metadata: { changes: ['contact_added', 'delay_updated'] },
    },
    {
      id: 4,
      type: 'document_accessed',
      user: 'Emma Johnson',
      action: 'accessed',
      target: 'Will and Testament',
      targetType: 'document',
      timestamp: '2024-01-12T11:20:00Z',
      metadata: { access_type: 'view' },
    },
    {
      id: 5,
      type: 'member_invited',
      user: 'Sarah Johnson',
      action: 'invited',
      target: 'alex@example.com',
      targetType: 'invitation',
      timestamp: '2024-01-11T13:00:00Z',
      metadata: { role: 'guardian', relationship: 'friend' },
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'document_shared':
        return <Share2 className='h-4 w-4' />;
      case 'member_joined':
        return <Users className='h-4 w-4' />;
      case 'emergency_updated':
        return <Shield className='h-4 w-4' />;
      case 'document_accessed':
        return <Activity className='h-4 w-4' />;
      case 'member_invited':
        return <Users className='h-4 w-4' />;
      default:
        return <Activity className='h-4 w-4' />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'document_shared':
        return 'bg-blue-100 text-blue-600';
      case 'member_joined':
        return 'bg-green-100 text-green-600';
      case 'emergency_updated':
        return 'bg-orange-100 text-orange-600';
      case 'document_accessed':
        return 'bg-purple-100 text-purple-600';
      case 'member_invited':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Activity className='h-5 w-5' />
            Complete Activity Feed
          </CardTitle>
          <CardDescription>
            Comprehensive log of all family collaboration activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {activities.map(activity => (
              <div
                key={activity.id}
                className='flex items-start gap-4 pb-4 border-b last:border-0'
              >
                <div
                  className={cn(
                    'p-2 rounded-full',
                    getActivityColor(activity.type)
                  )}
                >
                  {getActivityIcon(activity.type)}
                </div>
                <div className='flex-1 space-y-1'>
                  <p className='text-sm'>
                    <span className='font-medium'>{activity.user}</span>{' '}
                    {activity.action}{' '}
                    <span className='font-medium'>{activity.target}</span>
                  </p>
                  <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                    <span>{new Date(activity.timestamp).toLocaleString()}</span>
                    {activity.metadata && (
                      <>
                        <span>•</span>
                        <span>
                          {activity.type === 'document_shared' &&
                            `Shared with ${activity.metadata.recipients} member(s)`}
                          {activity.type === 'member_joined' &&
                            `Role: ${activity.metadata.role}`}
                          {activity.type === 'emergency_updated' &&
                            `${activity.metadata.changes?.length} changes made`}
                          {activity.type === 'document_accessed' &&
                            `Access type: ${activity.metadata.access_type}`}
                          {activity.type === 'member_invited' &&
                            `${activity.metadata.relationship} - ${activity.metadata.role}`}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <Button variant='ghost' size='sm'>
                  <Settings className='h-4 w-4' />
                </Button>
              </div>
            ))}
          </div>

          <div className='mt-6 pt-4 border-t'>
            <Button variant='outline' className='w-full'>
              Load More Activity
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
