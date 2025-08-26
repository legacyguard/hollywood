import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSupabaseWithClerk } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon-library';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { FadeIn } from '@/components/motion/FadeIn';
import { 
  EmergencyDashboardData, 
  EmergencyActivation, 
  EmergencyDocument,
  EmergencyContact,
  EmergencyTimeCapsule 
} from '@/types/emergency';
import { GuardianNotificationService } from '@/lib/emergency/guardian-notifier';

interface EmergencyDashboardProps {
  verificationToken?: string;
  guardianAccess?: boolean;
}

export const EmergencyDashboard: React.FC<EmergencyDashboardProps> = ({
  verificationToken,
  guardianAccess = false,
}) => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const createSupabaseClient = useSupabaseWithClerk();
  
  const [dashboardData, setDashboardData] = useState<EmergencyDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [responseNotes, setResponseNotes] = useState('');
  const [selectedTab, setSelectedTab] = useState<'overview' | 'documents' | 'contacts' | 'capsules'>('overview');
  const [error, setError] = useState<string | null>(null);

  const currentToken = verificationToken || token;

  useEffect(() => {
    if (currentToken) {
      loadDashboardData();
    }
  }, [currentToken]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const supabase = await createSupabaseClient();

      // Get activation details by token
      const { data: activation, error: activationError } = await supabase
        .from('family_shield_activation_log')
        .select(`
          *,
          guardians!inner (*)
        `)
        .eq('verification_token', currentToken)
        .single();

      if (activationError || !activation) {
        throw new Error('Invalid or expired verification token');
      }

      // Check if token is expired
      if (new Date(activation.token_expires_at) < new Date()) {
        throw new Error('Verification token has expired');
      }

      // Get user profile information
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, email, avatar_url')
        .eq('user_id', activation.user_id)
        .single();

      if (profileError) {
        console.warn('Could not load user profile:', profileError);
      }

      // Get user's accessible documents based on guardian permissions
      const guardian = activation.guardians;
      const { data: documents, error: documentsError } = await supabase
        .from('documents')
        .select('id, file_name, document_type, updated_at, file_size')
        .eq('user_id', activation.user_id)
        .order('updated_at', { ascending: false });

      // Filter documents based on guardian permissions
      const accessibleDocuments: EmergencyDocument[] = (documents || [])
        .filter(doc => {
          if (guardian.can_access_health_docs && doc.document_type === 'Health') return true;
          if (guardian.can_access_financial_docs && doc.document_type === 'Financial') return true;
          if (doc.document_type === 'Legal' || doc.document_type === 'General') return true;
          return false;
        })
        .map(doc => ({
          id: doc.id,
          file_name: doc.file_name,
          document_type: doc.document_type,
          access_level: doc.document_type.toLowerCase() as any,
          is_accessible: true,
          last_updated: doc.updated_at,
          description: `${doc.document_type} document (${(doc.file_size / 1024).toFixed(1)} KB)`,
        }));

      // Get other guardians as emergency contacts
      const { data: otherGuardians } = await supabase
        .from('guardians')
        .select('name, email, phone, relationship, emergency_contact_priority, is_active')
        .eq('user_id', activation.user_id)
        .eq('is_active', true)
        .order('emergency_contact_priority', { ascending: true });

      const emergencyContacts: EmergencyContact[] = (otherGuardians || [])
        .map(g => ({
          name: g.name,
          email: g.email,
          phone: g.phone,
          relationship: g.relationship || 'Guardian',
          priority: g.emergency_contact_priority,
          is_notified: false, // Would check notification status in real implementation
        }));

      // Get available time capsules if guardian has access
      const { data: timeCapsules } = await supabase
        .from('time_capsules')
        .select('id, message_title, message_preview, delivery_condition, access_token, created_at')
        .eq('user_id', activation.user_id)
        .in('delivery_condition', ['ON_DEATH']);

      const availableTimeCapsules: EmergencyTimeCapsule[] = (timeCapsules || [])
        .map(tc => ({
          id: tc.id,
          message_title: tc.message_title,
          message_preview: tc.message_preview,
          delivery_condition: tc.delivery_condition,
          access_token: tc.access_token,
          is_available: true,
          created_at: tc.created_at,
        }));

      // Compile dashboard data
      const dashboardData: EmergencyDashboardData = {
        user_info: {
          name: profile?.full_name || 'Unknown User',
          email: profile?.email || '',
          last_activity: activation.created_at, // Would be actual last activity
          shield_status: 'pending_verification',
        },
        activation_details: activation,
        available_documents: accessibleDocuments,
        access_permissions: {
          can_trigger_emergency: guardian.can_trigger_emergency,
          can_access_health_docs: guardian.can_access_health_docs,
          can_access_financial_docs: guardian.can_access_financial_docs,
          is_child_guardian: guardian.is_child_guardian,
          is_will_executor: guardian.is_will_executor,
          emergency_contact_priority: guardian.emergency_contact_priority,
        },
        contact_information: emergencyContacts,
        time_capsules: availableTimeCapsules,
      };

      setDashboardData(dashboardData);
      setError(null);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load emergency dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivationResponse = async (response: 'confirmed' | 'rejected') => {
    if (!dashboardData || !currentToken) return;

    try {
      setIsProcessing(true);
      const supabase = await createSupabaseClient();

      // Update activation status
      const { error: updateError } = await supabase
        .from('family_shield_activation_log')
        .update({
          status: response,
          confirmed_at: new Date().toISOString(),
          notes: responseNotes || null,
        })
        .eq('verification_token', currentToken);

      if (updateError) {
        throw updateError;
      }

      // If confirmed, update shield status to active
      if (response === 'confirmed') {
        const { error: shieldError } = await supabase
          .from('family_shield_settings')
          .update({
            shield_status: 'active',
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', dashboardData.activation_details.user_id);

        if (shieldError) {
          console.warn('Error updating shield status:', shieldError);
        }
      }

      // Record guardian response in notifications
      const { error: notificationError } = await supabase
        .from('guardian_notifications')
        .update({
          responded_at: new Date().toISOString(),
        })
        .eq('verification_token', currentToken);

      if (notificationError) {
        console.warn('Error updating notifications:', notificationError);
      }

      const message = response === 'confirmed' 
        ? 'Emergency activation confirmed successfully. The family protection system is now active.'
        : 'Emergency activation has been rejected. The system will remain in its current state.';

      toast.success(message);

      // Navigate to confirmation page or dashboard
      setTimeout(() => {
        navigate('/emergency/confirmation', { 
          state: { 
            response, 
            userName: dashboardData.user_info.name,
            activationType: dashboardData.activation_details.trigger_type
          }
        });
      }, 2000);

    } catch (error) {
      console.error('Error processing activation response:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process response');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadDocument = async (documentId: string, fileName: string) => {
    try {
      const supabase = await createSupabaseClient();
      
      // Get document download URL (would need to implement decryption)
      toast.info('Document access feature will be implemented with decryption system');
      
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to access document');
    }
  };

  const accessTimeCapsule = (capsule: EmergencyTimeCapsule) => {
    // Open time capsule in new tab/window
    const accessUrl = `/time-capsule/view/${capsule.access_token}`;
    window.open(accessUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className=\"min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-4 flex items-center justify-center\">
        <Card className=\"p-8 text-center\">
          <Icon name=\"loading\" className=\"w-8 h-8 animate-spin mx-auto mb-4 text-red-600\" />
          <h2 className=\"text-xl font-semibold mb-2\">Loading Emergency Dashboard</h2>
          <p className=\"text-muted-foreground\">Verifying access and loading data...</p>
        </Card>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className=\"min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-4 flex items-center justify-center\">
        <Card className=\"p-8 text-center max-w-md\">
          <Icon name=\"alert-triangle\" className=\"w-12 h-12 mx-auto mb-4 text-red-600\" />
          <h2 className=\"text-xl font-semibold mb-2 text-red-900 dark:text-red-100\">Access Error</h2>
          <p className=\"text-muted-foreground mb-6\">{error}</p>
          <Button onClick={() => navigate('/')} variant=\"outline\">
            Return Home
          </Button>
        </Card>
      </div>
    );
  }

  const { user_info, activation_details, available_documents, access_permissions, contact_information, time_capsules } = dashboardData;

  return (
    <div className=\"min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-4\">
      <div className=\"max-w-6xl mx-auto\">
        <FadeIn duration={0.6}>
          {/* Header */}
          <div className=\"mb-8\">
            <div className=\"flex items-center gap-4 mb-4\">
              <div className=\"p-3 bg-red-100 dark:bg-red-900/50 rounded-full\">
                <Icon name=\"shield-alert\" className=\"w-8 h-8 text-red-600\" />
              </div>
              <div>
                <h1 className=\"text-3xl font-bold text-red-900 dark:text-red-100\">
                  Emergency Guardian Dashboard
                </h1>
                <p className=\"text-red-700 dark:text-red-300\">
                  Emergency activation request for <strong>{user_info.name}</strong>
                </p>
              </div>
            </div>

            {/* Status Banner */}
            <Card className=\"p-4 bg-red-100 dark:bg-red-900/50 border-red-200 dark:border-red-800\">
              <div className=\"flex items-center justify-between\">
                <div className=\"flex items-center gap-3\">
                  <Badge variant=\"destructive\" className=\"px-3 py-1\">
                    {activation_details.trigger_type.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <span className=\"text-sm text-red-700 dark:text-red-300\">
                    Token expires: {new Date(activation_details.token_expires_at).toLocaleString()}
                  </span>
                </div>
                <Badge 
                  variant={activation_details.status === 'pending' ? 'secondary' : 'default'}
                  className=\"px-3 py-1\"
                >
                  {activation_details.status.toUpperCase()}
                </Badge>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          {activation_details.status === 'pending' && (
            <FadeIn duration={0.8} delay={0.2}>
              <Card className=\"p-6 mb-8 border-red-200 dark:border-red-800\">
                <h2 className=\"text-xl font-semibold mb-4 text-red-900 dark:text-red-100\">
                  Guardian Verification Required
                </h2>
                
                <div className=\"space-y-4 mb-6\">
                  <div className=\"grid md:grid-cols-2 gap-4\">
                    <div>
                      <h3 className=\"font-medium mb-2\">Activation Details</h3>
                      <div className=\"text-sm space-y-1 text-muted-foreground\">
                        <p><strong>Trigger:</strong> {activation_details.trigger_type.replace('_', ' ')}</p>
                        <p><strong>Requested:</strong> {new Date(activation_details.created_at).toLocaleString()}</p>
                        <p><strong>Your Priority:</strong> Level {access_permissions.emergency_contact_priority}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className=\"font-medium mb-2\">Your Permissions</h3>
                      <div className=\"flex flex-wrap gap-2\">
                        {access_permissions.can_access_health_docs && (
                          <Badge variant=\"secondary\">Health Documents</Badge>
                        )}
                        {access_permissions.can_access_financial_docs && (
                          <Badge variant=\"secondary\">Financial Documents</Badge>
                        )}
                        {access_permissions.is_will_executor && (
                          <Badge variant=\"secondary\">Will Executor</Badge>
                        )}
                        {access_permissions.is_child_guardian && (
                          <Badge variant=\"secondary\">Child Guardian</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className=\"block text-sm font-medium mb-2\">
                      Response Notes (Optional)
                    </label>
                    <Textarea
                      value={responseNotes}
                      onChange={(e) => setResponseNotes(e.target.value)}
                      placeholder=\"Add any notes about your decision or additional context...\"
                      className=\"min-h-[100px]\"
                    />
                  </div>
                </div>

                <div className=\"flex gap-4 justify-center\">
                  <Button
                    onClick={() => handleActivationResponse('rejected')}
                    variant=\"outline\"
                    disabled={isProcessing}
                    className=\"min-w-[150px]\"
                  >
                    {isProcessing ? (
                      <Icon name=\"loading\" className=\"w-4 h-4 mr-2 animate-spin\" />
                    ) : (
                      <Icon name=\"x\" className=\"w-4 h-4 mr-2\" />
                    )}
                    Reject Activation
                  </Button>
                  
                  <Button
                    onClick={() => handleActivationResponse('confirmed')}
                    disabled={isProcessing}
                    className=\"min-w-[150px] bg-red-600 hover:bg-red-700\"
                  >
                    {isProcessing ? (
                      <Icon name=\"loading\" className=\"w-4 h-4 mr-2 animate-spin\" />
                    ) : (
                      <Icon name=\"check\" className=\"w-4 h-4 mr-2\" />
                    )}
                    Confirm Activation
                  </Button>
                </div>
              </Card>
            </FadeIn>
          )}

          {/* Navigation Tabs */}
          <div className=\"flex gap-1 mb-6 p-1 bg-white dark:bg-gray-900 rounded-lg border\">
            {[
              { id: 'overview', label: 'Overview', icon: 'dashboard' },
              { id: 'documents', label: 'Documents', icon: 'documents' },
              { id: 'contacts', label: 'Contacts', icon: 'users' },
              { id: 'capsules', label: 'Time Capsules', icon: 'clock' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  selectedTab === tab.id
                    ? 'bg-red-100 dark:bg-red-900/50 text-red-900 dark:text-red-100'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab.icon as any} className=\"w-4 h-4\" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <FadeIn duration={0.6} delay={0.4}>
            {selectedTab === 'overview' && (
              <div className=\"grid md:grid-cols-2 gap-6\">
                <Card className=\"p-6\">
                  <h3 className=\"font-semibold mb-4 flex items-center gap-2\">
                    <Icon name=\"user\" className=\"w-5 h-5\" />
                    User Information
                  </h3>
                  <div className=\"space-y-3 text-sm\">
                    <div><strong>Name:</strong> {user_info.name}</div>
                    <div><strong>Email:</strong> {user_info.email}</div>
                    <div><strong>Last Activity:</strong> {new Date(user_info.last_activity).toLocaleDateString()}</div>
                    <div><strong>Shield Status:</strong> 
                      <Badge className=\"ml-2\" variant=\"secondary\">
                        {user_info.shield_status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </Card>

                <Card className=\"p-6\">
                  <h3 className=\"font-semibold mb-4 flex items-center gap-2\">
                    <Icon name=\"info\" className=\"w-5 h-5\" />
                    Quick Stats
                  </h3>
                  <div className=\"space-y-3 text-sm\">
                    <div><strong>Available Documents:</strong> {available_documents.length}</div>
                    <div><strong>Emergency Contacts:</strong> {contact_information.length}</div>
                    <div><strong>Time Capsules:</strong> {time_capsules.length}</div>
                    <div><strong>Access Level:</strong> Priority {access_permissions.emergency_contact_priority}</div>
                  </div>
                </Card>
              </div>
            )}

            {selectedTab === 'documents' && (
              <Card className=\"p-6\">
                <h3 className=\"font-semibold mb-4 flex items-center gap-2\">
                  <Icon name=\"documents\" className=\"w-5 h-5\" />
                  Accessible Documents ({available_documents.length})
                </h3>
                
                {available_documents.length === 0 ? (
                  <p className=\"text-muted-foreground text-center py-8\">
                    No documents are currently accessible with your permission level.
                  </p>
                ) : (
                  <div className=\"space-y-3\">
                    {available_documents.map((doc) => (
                      <div
                        key={doc.id}
                        className=\"flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800\"
                      >
                        <div className=\"flex items-center gap-3\">
                          <Icon name=\"file\" className=\"w-5 h-5 text-gray-500\" />
                          <div>
                            <div className=\"font-medium\">{doc.file_name}</div>
                            <div className=\"text-sm text-muted-foreground\">
                              {doc.document_type} • Updated {new Date(doc.last_updated).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className=\"flex items-center gap-2\">
                          <Badge 
                            variant={doc.access_level === 'health' ? 'destructive' : 'secondary'}
                            className=\"text-xs\"
                          >
                            {doc.access_level.toUpperCase()}
                          </Badge>
                          <Button
                            size=\"sm\"
                            variant=\"outline\"
                            onClick={() => downloadDocument(doc.id, doc.file_name)}
                          >
                            <Icon name=\"download\" className=\"w-4 h-4\" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {selectedTab === 'contacts' && (
              <Card className=\"p-6\">
                <h3 className=\"font-semibold mb-4 flex items-center gap-2\">
                  <Icon name=\"users\" className=\"w-5 h-5\" />
                  Emergency Contacts ({contact_information.length})
                </h3>
                
                <div className=\"space-y-4\">
                  {contact_information.map((contact, index) => (
                    <div
                      key={index}
                      className=\"flex items-center justify-between p-4 border rounded-lg\"
                    >
                      <div className=\"flex items-center gap-3\">
                        <div className=\"w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center\">
                          <Icon name=\"user\" className=\"w-5 h-5 text-blue-600\" />
                        </div>
                        <div>
                          <div className=\"font-medium\">{contact.name}</div>
                          <div className=\"text-sm text-muted-foreground\">{contact.relationship}</div>
                          <div className=\"text-sm text-muted-foreground\">{contact.email}</div>
                          {contact.phone && (
                            <div className=\"text-sm text-muted-foreground\">{contact.phone}</div>
                          )}
                        </div>
                      </div>
                      
                      <div className=\"text-right\">
                        <Badge variant=\"outline\" className=\"mb-2\">
                          Priority {contact.priority}
                        </Badge>
                        <div className=\"text-xs text-muted-foreground\">
                          {contact.is_notified ? 'Notified' : 'Not Notified'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {selectedTab === 'capsules' && (
              <Card className=\"p-6\">
                <h3 className=\"font-semibold mb-4 flex items-center gap-2\">
                  <Icon name=\"clock\" className=\"w-5 h-5\" />
                  Available Time Capsules ({time_capsules.length})
                </h3>
                
                {time_capsules.length === 0 ? (
                  <p className=\"text-muted-foreground text-center py-8\">
                    No time capsules are currently available for access.
                  </p>
                ) : (
                  <div className=\"space-y-4\">
                    {time_capsules.map((capsule) => (
                      <div
                        key={capsule.id}
                        className=\"p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800\"
                      >
                        <div className=\"flex items-start justify-between mb-3\">
                          <div>
                            <h4 className=\"font-medium\">{capsule.message_title}</h4>
                            {capsule.message_preview && (
                              <p className=\"text-sm text-muted-foreground mt-1\">
                                {capsule.message_preview}
                              </p>
                            )}
                          </div>
                          <Badge variant=\"outline\">
                            {capsule.delivery_condition === 'ON_DEATH' ? 'Emergency Access' : 'Scheduled'}
                          </Badge>
                        </div>
                        
                        <div className=\"flex items-center justify-between\">
                          <div className=\"text-xs text-muted-foreground\">
                            Created: {new Date(capsule.created_at).toLocaleDateString()}
                          </div>
                          <Button
                            size=\"sm\"
                            onClick={() => accessTimeCapsule(capsule)}
                            className=\"bg-amber-600 hover:bg-amber-700\"
                          >
                            <Icon name=\"play\" className=\"w-4 h-4 mr-2\" />
                            Access Message
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}
          </FadeIn>
        </FadeIn>
      </div>
    </div>
  );
};

export default EmergencyDashboard;