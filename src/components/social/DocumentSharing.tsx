/**
 * Document Sharing Component
 * Phase 8: Social Collaboration & Family Features
 *
 * Advanced document sharing interface with granular permissions,
 * expiration settings, access tracking, and collaboration features.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Share2,
  Users,
  Eye,
  Download,
  Edit,
  MessageCircle,
  RefreshCw,
  Calendar as CalendarIcon,
  Clock,
  Shield,
  Link2,
  Mail,
  Check,
  X,
  MoreVertical,
  Copy,
  Trash2,
  Settings,
  Activity,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import {
  collaborationService,
  type DocumentShare,
  type SharePermissions,
  type FamilyMember
} from '@/lib/social/collaborationService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface DocumentSharingProps {
  documentId?: string;
  documentName?: string;
  className?: string;
}

export default function DocumentSharing({
  documentId,
  documentName,
  className
}: DocumentSharingProps) {
  const [sharedByMe, setSharedByMe] = useState<DocumentShare[]>([]);
  const [sharedWithMe, setSharedWithMe] = useState<DocumentShare[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(documentId ? 'share' : 'shared-with-me');

  const { toast } = useToast();

  useEffect(() => {
    loadSharedDocuments();
    loadFamilyMembers();
  }, []);

  const loadSharedDocuments = async () => {
    try {
      const user = await supabase.auth.getUser();
      if (user.data.user) {
        const [byMe, withMe] = await Promise.all([
          collaborationService.getSharedDocuments(user.data.user.id, 'shared_by_me'),
          collaborationService.getSharedDocuments(user.data.user.id, 'shared_with_me')
        ]);
        setSharedByMe(byMe);
        setSharedWithMe(withMe);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load shared documents",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadFamilyMembers = async () => {
    try {
      const familyId = collaborationService.getCurrentFamilyId();
      if (familyId) {
        const members = await collaborationService.getFamilyMembers(familyId);
        setFamilyMembers(members);
      }
    } catch (error) {
      console.error('Failed to load family members:', error);
    }
  };

  const handleShare = async (shareData: {
    recipients: string[];
    permissions: SharePermissions;
    message?: string;
    expiresAt?: string;
  }) => {
    if (!documentId) return;

    try {
      await collaborationService.shareDocument({
        documentId,
        ...shareData
      });

      toast({
        title: "Document shared",
        description: `Shared with ${shareData.recipients.length} member(s)`
      });

      setShowShareDialog(false);
      await loadSharedDocuments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share document",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Document Sharing</h2>
          <p className="text-muted-foreground">
            Share documents with family members and manage access permissions
          </p>
        </div>
        {documentId && (
          <Button onClick={() => setShowShareDialog(true)}>
            <Share2 className="h-4 w-4 mr-2" />
            Share Document
          </Button>
        )}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          {documentId && (
            <TabsTrigger value="share">Share Document</TabsTrigger>
          )}
          <TabsTrigger value="shared-with-me">Shared With Me</TabsTrigger>
          <TabsTrigger value="shared-by-me">Shared By Me</TabsTrigger>
        </TabsList>

        {documentId && (
          <TabsContent value="share">
            <ShareDocumentTab
              documentId={documentId}
              documentName={documentName}
              familyMembers={familyMembers}
              onShare={handleShare}
            />
          </TabsContent>
        )}

        <TabsContent value="shared-with-me">
          <SharedWithMeTab shares={sharedWithMe} onUpdate={loadSharedDocuments} />
        </TabsContent>

        <TabsContent value="shared-by-me">
          <SharedByMeTab shares={sharedByMe} onUpdate={loadSharedDocuments} />
        </TabsContent>
      </Tabs>

      {/* Share Dialog */}
      <ShareDocumentDialog
        documentId={documentId}
        documentName={documentName}
        familyMembers={familyMembers}
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        onShare={handleShare}
      />
    </div>
  );
}

// Sub-components

function ShareDocumentTab({
  documentId,
  documentName,
  familyMembers,
  onShare
}: {
  documentId: string;
  documentName?: string;
  familyMembers: FamilyMember[];
  onShare: (data: any) => void;
}) {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<SharePermissions>({
    canView: true,
    canDownload: false,
    canComment: false,
    canEdit: false,
    canReshare: false
  });
  const [expiresAt, setExpiresAt] = useState<Date>();
  const [message, setMessage] = useState('');

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleShare = () => {
    onShare({
      recipients: selectedMembers,
      permissions,
      message,
      expiresAt: expiresAt?.toISOString()
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Share {documentName || 'Document'}</CardTitle>
          <CardDescription>
            Choose family members and set permissions for document sharing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Family Members Selection */}
          <div>
            <Label className="text-base">Select Family Members</Label>
            <div className="mt-3 space-y-2">
              {familyMembers.map((member) => (
                <div key={member.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`member-${member.id}`}
                    checked={selectedMembers.includes(member.id)}
                    onCheckedChange={() => handleMemberToggle(member.id)}
                  />
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar_url} />
                    <AvatarFallback>
                      {member.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                  <Badge variant="outline">{member.role}</Badge>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Permissions */}
          <div>
            <Label className="text-base">Permissions</Label>
            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="can-view">Can View</Label>
                  <p className="text-sm text-muted-foreground">Allow viewing the document</p>
                </div>
                <Switch
                  id="can-view"
                  checked={permissions.canView}
                  onCheckedChange={(checked) =>
                    setPermissions(prev => ({ ...prev, canView: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="can-download">Can Download</Label>
                  <p className="text-sm text-muted-foreground">Allow downloading the document</p>
                </div>
                <Switch
                  id="can-download"
                  checked={permissions.canDownload}
                  onCheckedChange={(checked) =>
                    setPermissions(prev => ({ ...prev, canDownload: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="can-comment">Can Comment</Label>
                  <p className="text-sm text-muted-foreground">Allow adding comments</p>
                </div>
                <Switch
                  id="can-comment"
                  checked={permissions.canComment}
                  onCheckedChange={(checked) =>
                    setPermissions(prev => ({ ...prev, canComment: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="can-reshare">Can Reshare</Label>
                  <p className="text-sm text-muted-foreground">Allow sharing with other family members</p>
                </div>
                <Switch
                  id="can-reshare"
                  checked={permissions.canReshare}
                  onCheckedChange={(checked) =>
                    setPermissions(prev => ({ ...prev, canReshare: checked }))
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Expiration */}
          <div>
            <Label className="text-base">Expiration (Optional)</Label>
            <div className="mt-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expiresAt ? format(expiresAt, 'PPP') : 'No expiration'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={expiresAt}
                    onSelect={setExpiresAt}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="share-message">Message (Optional)</Label>
            <Textarea
              id="share-message"
              placeholder="Add a message for the recipients..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {/* Share Button */}
          <Button
            onClick={handleShare}
            disabled={selectedMembers.length === 0}
            className="w-full"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share with {selectedMembers.length} member(s)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function SharedWithMeTab({
  shares,
  onUpdate
}: {
  shares: DocumentShare[];
  onUpdate: () => void;
}) {
  const getPermissionBadges = (permissions: SharePermissions) => {
    const badges = [];
    if (permissions.canView) badges.push('View');
    if (permissions.canDownload) badges.push('Download');
    if (permissions.canComment) badges.push('Comment');
    if (permissions.canEdit) badges.push('Edit');
    if (permissions.canReshare) badges.push('Reshare');
    return badges;
  };

  return (
    <div className="space-y-4">
      {shares.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <Share2 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-lg font-medium">No documents shared with you</p>
              <p className="text-muted-foreground">Documents shared by family members will appear here</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        shares.map((share) => (
          <Card key={share.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">
                      {share.documents?.name || 'Document'}
                    </h3>
                    <Badge variant="outline">
                      {share.documents?.type || 'Unknown'}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Shared by {share.shared_by_user?.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(share.created_at).toLocaleDateString()}
                    </div>
                    {share.expires_at && (
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Expires {new Date(share.expires_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {getPermissionBadges(share.permissions).map((permission) => (
                      <Badge key={permission} variant="secondary" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                  </div>

                  {share.message && (
                    <p className="text-sm text-muted-foreground italic">
                      "{share.message}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {share.permissions.canView && (
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  )}
                  {share.permissions.canDownload && (
                    <Button variant="outline" size="sm">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

function SharedByMeTab({
  shares,
  onUpdate
}: {
  shares: DocumentShare[];
  onUpdate: () => void;
}) {
  return (
    <div className="space-y-4">
      {shares.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <Share2 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-lg font-medium">No documents shared by you</p>
              <p className="text-muted-foreground">Documents you share with family members will appear here</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        shares.map((share) => (
          <Card key={share.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">
                      {share.documents?.name || 'Document'}
                    </h3>
                    <Badge variant="outline">
                      {share.documents?.type || 'Unknown'}
                    </Badge>
                    <Badge
                      variant={share.status === 'accepted' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {share.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Shared with {share.shared_with_user?.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(share.created_at).toLocaleDateString()}
                    </div>
                    {share.viewed_at && (
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        Viewed {new Date(share.viewed_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {share.message && (
                    <p className="text-sm text-muted-foreground italic">
                      "{share.message}"
                    </p>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Permissions
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Activity className="h-4 w-4 mr-2" />
                      View Activity
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Revoke Access
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

function ShareDocumentDialog({
  documentId,
  documentName,
  familyMembers,
  open,
  onOpenChange,
  onShare
}: {
  documentId?: string;
  documentName?: string;
  familyMembers: FamilyMember[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShare: (data: any) => void;
}) {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<SharePermissions>({
    canView: true,
    canDownload: false,
    canComment: false,
    canEdit: false,
    canReshare: false
  });
  const [expiresAt, setExpiresAt] = useState<Date>();
  const [message, setMessage] = useState('');

  const handleShare = () => {
    onShare({
      recipients: selectedMembers,
      permissions,
      message,
      expiresAt: expiresAt?.toISOString()
    });

    // Reset form
    setSelectedMembers([]);
    setPermissions({
      canView: true,
      canDownload: false,
      canComment: false,
      canEdit: false,
      canReshare: false
    });
    setExpiresAt(undefined);
    setMessage('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
          <DialogDescription>
            Share "{documentName || 'document'}" with family members
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Quick share options */}
          <div>
            <Label>Quick Actions</Label>
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedMembers(familyMembers.map(m => m.id));
                  setPermissions({ ...permissions, canView: true, canDownload: true });
                }}
              >
                Share with All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const guardians = familyMembers.filter(m => m.role === 'guardian').map(m => m.id);
                  setSelectedMembers(guardians);
                  setPermissions({ ...permissions, canView: true, canDownload: true });
                }}
              >
                Share with Guardians
              </Button>
            </div>
          </div>

          <Separator />

          {/* Simple member selection */}
          <div>
            <Label>Family Members</Label>
            <div className="max-h-32 overflow-y-auto mt-2 space-y-2">
              {familyMembers.map((member) => (
                <div key={member.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedMembers.includes(member.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedMembers(prev => [...prev, member.id]);
                      } else {
                        setSelectedMembers(prev => prev.filter(id => id !== member.id));
                      }
                    }}
                  />
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={member.avatar_url} />
                    <AvatarFallback className="text-xs">
                      {member.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{member.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="quick-message">Message (Optional)</Label>
            <Input
              id="quick-message"
              placeholder="Add a note..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleShare} disabled={selectedMembers.length === 0}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
