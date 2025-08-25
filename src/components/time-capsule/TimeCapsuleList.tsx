import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon-library';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import type { TimeCapsule } from '@/types/timeCapsule';
import { format } from 'date-fns';

interface TimeCapsuleListProps {
  timeCapsules: TimeCapsule[];
  onDelete: (id: string) => void;
  onRefresh?: () => void;
}

export function TimeCapsuleList({ timeCapsules, onDelete }: TimeCapsuleListProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'DELIVERED':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'FAILED':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'clock';
      case 'DELIVERED':
        return 'check-circle';
      case 'FAILED':
        return 'alert-circle';
      case 'CANCELLED':
        return 'x-circle';
      default:
        return 'help-circle';
    }
  };

  const handleDeleteConfirm = (capsuleId: string) => {
    onDelete(capsuleId);
    setDeleteConfirm(null);
  };

  // Group capsules by status
  const groupedCapsules = timeCapsules.reduce((groups, capsule) => {
    const key = capsule.is_delivered ? 'delivered' :
                capsule.status === 'FAILED' ? 'failed' : 'pending';
    if (!groups[key]) groups[key] = [];
    groups[key].push(capsule);
    return groups;
  }, {} as Record<string, TimeCapsule[]>);

  return (
    <div className="space-y-6">
      {/* Pending Capsules */}
      {groupedCapsules.pending && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Icon name="clock" className="w-5 h-5 text-orange-600" />
            Pending Delivery ({groupedCapsules.pending.length})
          </h3>
          <div className="grid gap-4">
            {groupedCapsules.pending.map((capsule) => (
              <TimeCapsuleCard
                key={capsule.id}
                capsule={capsule}
                onDelete={() => setDeleteConfirm(capsule.id)}
                getInitials={getInitials}
                formatDuration={formatDuration}
                formatFileSize={formatFileSize}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
              />
            ))}
          </div>
        </div>
      )}

      {/* Delivered Capsules */}
      {groupedCapsules.delivered && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Icon name="check-circle" className="w-5 h-5 text-green-600" />
            Delivered ({groupedCapsules.delivered.length})
          </h3>
          <div className="grid gap-4">
            {groupedCapsules.delivered.map((capsule) => (
              <TimeCapsuleCard
                key={capsule.id}
                capsule={capsule}
                onDelete={() => setDeleteConfirm(capsule.id)}
                getInitials={getInitials}
                formatDuration={formatDuration}
                formatFileSize={formatFileSize}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
                isDelivered={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Failed Capsules */}
      {groupedCapsules.failed && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Icon name="alert-circle" className="w-5 h-5 text-red-600" />
            Failed Delivery ({groupedCapsules.failed.length})
          </h3>
          <div className="grid gap-4">
            {groupedCapsules.failed.map((capsule) => (
              <TimeCapsuleCard
                key={capsule.id}
                capsule={capsule}
                onDelete={() => setDeleteConfirm(capsule.id)}
                getInitials={getInitials}
                formatDuration={formatDuration}
                formatFileSize={formatFileSize}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
                isFailed={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Time Capsule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this Time Capsule? This action cannot be undone,
              and your recorded message will be permanently lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDeleteConfirm(deleteConfirm)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Time Capsule
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface TimeCapsuleCardProps {
  capsule: TimeCapsule;
  onDelete: () => void;
  getInitials: (name: string) => string;
  formatDuration: (seconds: number) => string;
  formatFileSize: (bytes: number) => string;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => string;
  isDelivered?: boolean;
  isFailed?: boolean;
}

function TimeCapsuleCard({
  capsule,
  onDelete,
  getInitials,
  formatDuration,
  formatFileSize,
  getStatusColor,
  getStatusIcon,
  isDelivered,
  isFailed
}: TimeCapsuleCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Avatar>
              <AvatarFallback>
                {getInitials(capsule.recipient_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-lg truncate">{capsule.message_title}</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Icon name="user" className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">For {capsule.recipient_name}</span>
                <span>•</span>
                <Icon name="mail" className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{capsule.recipient_email}</span>
              </div>
              {capsule.message_preview && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {capsule.message_preview}
                </p>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Icon name="more-horizontal" className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isDelivered && (
                <>
                  <DropdownMenuItem>
                    <Icon name="external-link" className="w-4 h-4 mr-2" />
                    View Delivered Message
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              {!isDelivered && (
                <>
                  <DropdownMenuItem>
                    <Icon name="eye" className="w-4 h-4 mr-2" />
                    Preview Recording
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem
                onClick={onDelete}
                className="text-red-600 focus:text-red-600"
              >
                <Icon name="trash-2" className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Delivery Information */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon
              name={capsule.delivery_condition === 'ON_DATE' ? 'calendar' : 'shield'}
              className="w-4 h-4 text-muted-foreground"
            />
            <span className="text-sm">
              {capsule.delivery_condition === 'ON_DATE' && capsule.delivery_date
                ? `Scheduled for ${format(new Date(capsule.delivery_date), "MMM d, yyyy")}`
                : 'On Family Shield Activation'
              }
            </span>
          </div>

          <Badge className={getStatusColor(capsule.status)}>
            <Icon name={getStatusIcon(capsule.status)} className="w-3 h-3 mr-1" />
            {capsule.status === 'PENDING' ? 'Pending' :
             capsule.status === 'DELIVERED' ? 'Delivered' :
             capsule.status === 'FAILED' ? 'Failed' :
             capsule.status}
          </Badge>
        </div>

        {/* Recording Details */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Icon
                name={capsule.file_type === 'video' ? 'video' : 'mic'}
                className="w-3 h-3 text-muted-foreground"
              />
              <span className="capitalize">{capsule.file_type}</span>
            </div>
            {capsule.duration_seconds && (
              <div className="flex items-center space-x-1">
                <Icon name="clock" className="w-3 h-3 text-muted-foreground" />
                <span>{formatDuration(capsule.duration_seconds)}</span>
              </div>
            )}
            {capsule.file_size_bytes && (
              <div className="flex items-center space-x-1">
                <Icon name="hard-drive" className="w-3 h-3 text-muted-foreground" />
                <span>{formatFileSize(capsule.file_size_bytes)}</span>
              </div>
            )}
          </div>

          <span className="text-muted-foreground">
            Created {format(new Date(capsule.created_at), "MMM d, yyyy")}
          </span>
        </div>

        {/* Delivery Status Details */}
        {isDelivered && capsule.delivered_at && (
          <div className="p-2 bg-green-50 border border-green-200 rounded text-sm">
            <Icon name="check-circle" className="w-4 h-4 inline mr-2 text-green-600" />
            <span className="text-green-800">
              Delivered on {format(new Date(capsule.delivered_at), "MMMM d, yyyy 'at' h:mm a")}
            </span>
          </div>
        )}

        {isFailed && capsule.delivery_error && (
          <div className="p-2 bg-red-50 border border-red-200 rounded text-sm">
            <Icon name="alert-circle" className="w-4 h-4 inline mr-2 text-red-600" />
            <span className="text-red-800">
              Delivery failed: {capsule.delivery_error}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
