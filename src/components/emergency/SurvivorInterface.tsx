import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSupabaseWithClerk } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon-library';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { FadeIn } from '@/components/motion/FadeIn';
import { 
  SurvivorInterface as SurvivorInterfaceData, 
  SurvivorAccessRequest,
  SurvivorResource,
  SurvivorGuidanceEntry,
  EmergencyContact,
  EmergencyTimeCapsule,
} from '@/types/emergency';

interface SurvivorInterfaceProps {
  accessToken?: string;
  isPublicAccess?: boolean;
}

export const SurvivorInterface: React.FC<SurvivorInterfaceProps> = ({
  accessToken,
  isPublicAccess = false,
}) => {
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const createSupabaseClient = useSupabaseWithClerk();
  
  const [survivorData, setSurvivorData] = useState<SurvivorInterfaceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'financial' | 'legal' | 'medical' | 'personal' | 'contacts' | 'instructions'>('all');
  const [accessRequest, setAccessRequest] = useState<Partial<SurvivorAccessRequest>>({
    requester_name: searchParams.get('name') || '',
    requester_email: searchParams.get('email') || '',
    relationship: searchParams.get('relationship') || '',
    purpose: '',
    requested_access_types: [],
  });
  const [showAccessRequest, setShowAccessRequest] = useState(!isPublicAccess);

  const currentToken = accessToken || token;

  useEffect(() => {
    if (currentToken || isPublicAccess) {
      loadSurvivorData();
    }
  }, [currentToken, isPublicAccess]);

  const loadSurvivorData = async () => {
    try {
      setIsLoading(true);
      const supabase = await createSupabaseClient();

      let userId: string;
      let hasFullAccess = false;

      if (isPublicAccess && currentToken) {
        // For public memorial access, the token might be a user identifier
        userId = currentToken;
      } else if (currentToken) {
        // Try to find user by emergency activation token or direct access
        const { data: activation } = await supabase
          .from('family_shield_activation_log')
          .select('user_id, status')
          .eq('verification_token', currentToken)
          .eq('status', 'confirmed')
          .single();

        if (activation) {
          userId = activation.user_id;
          hasFullAccess = true;
        } else {
          throw new Error('Invalid or inactive access token');
        }
      } else {
        throw new Error('Access token required');
      }

      // Get user profile information
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, email, avatar_url, memorial_message')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        throw new Error('User profile not found');
      }

      // Get available resources based on access level
      const availableResources: SurvivorResource[] = [];
      
      // Always available resources (public memorial info)
      availableResources.push({
        id: 'memorial',
        category: 'personal',
        title: 'Memorial Information',
        description: profile.memorial_message || 'In loving memory',
        access_level: 'immediate',
        is_available: true,
        resource_type: 'instruction',
      });

      // Get emergency contacts (always available)
      const { data: guardians } = await supabase
        .from('guardians')
        .select('name, email, phone, relationship, emergency_contact_priority')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('emergency_contact_priority', { ascending: true });

      const emergencyContacts: EmergencyContact[] = (guardians || []).map(g => ({
        name: g.name,
        email: g.email,
        phone: g.phone,
        relationship: g.relationship || 'Guardian',
        priority: g.emergency_contact_priority,
        is_notified: true, // Assume notified in emergency scenario
      }));

      // If has full access, load additional resources
      if (hasFullAccess) {
        // Get documents (filtered for appropriate access)
        const { data: documents } = await supabase
          .from('documents')
          .select('id, file_name, document_type, updated_at')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });

        (documents || []).forEach(doc => {
          availableResources.push({
            id: doc.id,
            category: doc.document_type.toLowerCase() as any,
            title: doc.file_name,
            description: `${doc.document_type} document - Last updated ${new Date(doc.updated_at).toLocaleDateString()}`,
            access_level: 'immediate',
            is_available: true,
            resource_type: 'document',
            metadata: { document_id: doc.id },
          });
        });

        // Get survivor guidance entries
        const { data: guidanceEntries } = await supabase
          .from('family_guidance_entries')
          .select('*')
          .eq('user_id', userId)
          .eq('is_completed', true)
          .order('priority', { ascending: true });

        (guidanceEntries || []).forEach(entry => {
          availableResources.push({
            id: entry.id,
            category: entry.entry_type as any,
            title: entry.title,
            description: entry.content.substring(0, 150) + '...',
            access_level: 'immediate',
            is_available: true,
            resource_type: 'instruction',
            metadata: { guidance_id: entry.id },
          });
        });
      }

      // Get time capsules marked for death/emergency delivery
      const { data: timeCapsules } = await supabase
        .from('time_capsules')
        .select('id, message_title, message_preview, delivery_condition, access_token, created_at')
        .eq('user_id', userId)
        .eq('delivery_condition', 'ON_DEATH');

      const availableTimeCapsules: EmergencyTimeCapsule[] = (timeCapsules || []).map(tc => ({
        id: tc.id,
        message_title: tc.message_title,
        message_preview: tc.message_preview,
        delivery_condition: tc.delivery_condition,
        access_token: tc.access_token,
        is_available: true,
        created_at: tc.created_at,
      }));

      // Get guidance entries for survivor interface
      const { data: allGuidance } = await supabase
        .from('family_guidance_entries')
        .select('*')
        .eq('user_id', userId)
        .order('priority', { ascending: true });

      const guidanceEntries: SurvivorGuidanceEntry[] = (allGuidance || []).map(entry => ({
        id: entry.id,
        category: entry.entry_type,
        title: entry.title,
        content: entry.content,
        priority: entry.priority,
        is_completed: entry.is_completed,
        related_documents: entry.related_document_ids || [],
        created_at: entry.created_at,
        updated_at: entry.updated_at,
      }));

      // Compile survivor interface data
      const survivorData: SurvivorInterfaceData = {
        user_info: {
          name: profile.full_name || 'Unknown',
          memorial_message: profile.memorial_message,
          profile_photo_url: profile.avatar_url,
        },
        available_resources: availableResources,
        emergency_contacts: emergencyContacts,
        important_documents: availableResources
          .filter(r => r.resource_type === 'document')
          .map(r => ({
            id: r.id,
            file_name: r.title,
            document_type: r.category,
            access_level: r.category as any,
            is_accessible: r.is_available,
            last_updated: new Date().toISOString(), // Would be actual date
            description: r.description,
          })),
        time_capsules: availableTimeCapsules,
        guidance_entries: guidanceEntries,
      };

      setSurvivorData(survivorData);
      setError(null);

    } catch (error) {
      console.error('Error loading survivor data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load survivor interface');
    } finally {
      setIsLoading(false);
    }
  };

  const submitAccessRequest = async () => {
    if (!currentToken || !accessRequest.requester_email || !accessRequest.purpose) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const supabase = await createSupabaseClient();

      // Create access request record
      const { error } = await supabase
        .from('survivor_access_requests')
        .insert({
          access_token: currentToken,
          requester_email: accessRequest.requester_email,
          requester_name: accessRequest.requester_name,
          relationship: accessRequest.relationship,
          purpose: accessRequest.purpose,
          requested_access_types: accessRequest.requested_access_types,
          status: 'pending',
          created_at: new Date().toISOString(),
        });

      if (error) {
        throw error;
      }

      toast.success('Access request submitted. You will be contacted once reviewed by guardians.');
      setShowAccessRequest(false);

    } catch (error) {
      console.error('Error submitting access request:', error);
      toast.error('Failed to submit access request');
    }
  };

  const accessTimeCapsule = (capsule: EmergencyTimeCapsule) => {
    const accessUrl = `/time-capsule/view/${capsule.access_token}`;
    window.open(accessUrl, '_blank');
  };

  const downloadResource = async (resource: SurvivorResource) => {
    if (resource.resource_type === 'document') {
      toast.info('Document access will be implemented with secure download system');
    } else {
      toast.info('Resource details will be displayed in modal or dedicated page');
    }
  };

  if (isLoading) {
    return (
      <div className=\"min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 p-4 flex items-center justify-center\">
        <Card className=\"p-8 text-center\">
          <Icon name=\"loading\" className=\"w-8 h-8 animate-spin mx-auto mb-4 text-indigo-600\" />
          <h2 className=\"text-xl font-semibold mb-2\">Loading Survivor Interface</h2>
          <p className=\"text-muted-foreground\">Preparing memorial resources...</p>
        </Card>
      </div>
    );
  }

  if (error || !survivorData) {
    return (
      <div className=\"min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 p-4 flex items-center justify-center\">
        <Card className=\"p-8 text-center max-w-md\">
          <Icon name=\"alert-triangle\" className=\"w-12 h-12 mx-auto mb-4 text-amber-600\" />
          <h2 className=\"text-xl font-semibold mb-2\">Access Restricted</h2>
          <p className=\"text-muted-foreground mb-6\">{error}</p>
          <Button onClick={() => setShowAccessRequest(true)} className=\"mr-2\">
            Request Access
          </Button>
          <Button variant=\"outline\" onClick={() => window.location.href = '/'}>
            Return Home
          </Button>
        </Card>
      </div>
    );
  }

  const { user_info, available_resources, emergency_contacts, time_capsules, guidance_entries } = survivorData;

  const filteredResources = selectedCategory === 'all' 
    ? available_resources 
    : available_resources.filter(r => r.category === selectedCategory);

  return (
    <div className=\"min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 p-4\">
      <div className=\"max-w-6xl mx-auto\">
        <FadeIn duration={0.8}>
          {/* Memorial Header */}
          <div className=\"text-center mb-8\">
            <div className=\"relative mb-6\">
              {user_info.profile_photo_url ? (
                <img
                  src={user_info.profile_photo_url}
                  alt={user_info.name}
                  className=\"w-24 h-24 rounded-full mx-auto border-4 border-white dark:border-gray-800 shadow-lg\"
                />
              ) : (
                <div className=\"w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full mx-auto flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg\">
                  <Icon name=\"user\" className=\"w-12 h-12 text-white\" />
                </div>
              )}
            </div>
            
            <h1 className=\"text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2\">
              In Memory of {user_info.name}
            </h1>
            
            {user_info.memorial_message && (
              <Card className=\"p-6 mx-auto max-w-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-indigo-200 dark:border-indigo-800\">
                <p className=\"text-gray-700 dark:text-gray-300 italic text-lg leading-relaxed\">
                  "{user_info.memorial_message}"
                </p>
              </Card>
            )}
          </div>

          {/* Access Request Modal */}
          {showAccessRequest && (
            <FadeIn duration={0.6} delay={0.2}>
              <Card className=\"p-6 mb-8 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50\">
                <h2 className=\"text-xl font-semibold mb-4 text-amber-900 dark:text-amber-100\">
                  Request Additional Access
                </h2>
                <p className=\"text-amber-700 dark:text-amber-300 mb-6\">
                  To access more resources, please provide your information and reason for access.
                  Your request will be reviewed by designated guardians.
                </p>
                
                <div className=\"grid md:grid-cols-2 gap-4 mb-4\">
                  <div>
                    <label className=\"block text-sm font-medium mb-1\">Your Name *</label>
                    <Input
                      value={accessRequest.requester_name}
                      onChange={(e) => setAccessRequest({...accessRequest, requester_name: e.target.value})}
                      placeholder=\"Enter your full name\"
                    />
                  </div>
                  <div>
                    <label className=\"block text-sm font-medium mb-1\">Email Address *</label>
                    <Input
                      type=\"email\"
                      value={accessRequest.requester_email}
                      onChange={(e) => setAccessRequest({...accessRequest, requester_email: e.target.value})}
                      placeholder=\"Enter your email\"
                    />
                  </div>
                  <div>
                    <label className=\"block text-sm font-medium mb-1\">Relationship</label>
                    <Input
                      value={accessRequest.relationship}
                      onChange={(e) => setAccessRequest({...accessRequest, relationship: e.target.value})}
                      placeholder=\"e.g. Family member, Friend, Colleague\"
                    />
                  </div>
                </div>
                
                <div className=\"mb-4\">
                  <label className=\"block text-sm font-medium mb-1\">Purpose of Access *</label>
                  <Textarea
                    value={accessRequest.purpose}
                    onChange={(e) => setAccessRequest({...accessRequest, purpose: e.target.value})}
                    placeholder=\"Please explain why you need access to these resources...\"
                    className=\"min-h-[100px]\"
                  />
                </div>
                
                <div className=\"flex gap-3\">
                  <Button onClick={submitAccessRequest} className=\"bg-amber-600 hover:bg-amber-700\">
                    Submit Request
                  </Button>
                  <Button variant=\"outline\" onClick={() => setShowAccessRequest(false)}>
                    Cancel
                  </Button>
                </div>
              </Card>
            </FadeIn>
          )}

          {/* Quick Actions */}
          <div className=\"grid md:grid-cols-3 gap-6 mb-8\">
            <Card className=\"p-6 text-center hover:shadow-lg transition-shadow\">
              <Icon name=\"users\" className=\"w-8 h-8 mx-auto mb-3 text-indigo-600\" />
              <h3 className=\"font-semibold mb-2\">Emergency Contacts</h3>
              <p className=\"text-sm text-muted-foreground mb-4\">
                {emergency_contacts.length} contacts available
              </p>
              <Button 
                variant=\"outline\" 
                size=\"sm\"
                onClick={() => setSelectedCategory('contacts')}
              >
                View Contacts
              </Button>
            </Card>

            <Card className=\"p-6 text-center hover:shadow-lg transition-shadow\">
              <Icon name=\"clock\" className=\"w-8 h-8 mx-auto mb-3 text-purple-600\" />
              <h3 className=\"font-semibold mb-2\">Time Capsules</h3>
              <p className=\"text-sm text-muted-foreground mb-4\">
                {time_capsules.length} messages available
              </p>
              <Button 
                variant=\"outline\" 
                size=\"sm\"
                onClick={() => setSelectedCategory('personal')}
              >
                View Messages
              </Button>
            </Card>

            <Card className=\"p-6 text-center hover:shadow-lg transition-shadow\">
              <Icon name=\"documents\" className=\"w-8 h-8 mx-auto mb-3 text-green-600\" />
              <h3 className=\"font-semibold mb-2\">Important Resources</h3>
              <p className=\"text-sm text-muted-foreground mb-4\">
                {available_resources.length} items available
              </p>
              <Button 
                variant=\"outline\" 
                size=\"sm\"
                onClick={() => setSelectedCategory('all')}
              >
                Browse All
              </Button>
            </Card>
          </div>

          {/* Category Filter */}
          <div className=\"flex flex-wrap gap-2 mb-6 p-4 bg-white dark:bg-gray-900 rounded-lg border\">
            {[
              { id: 'all', label: 'All Resources', count: available_resources.length },
              { id: 'contacts', label: 'Contacts', count: emergency_contacts.length },
              { id: 'financial', label: 'Financial', count: available_resources.filter(r => r.category === 'financial').length },
              { id: 'legal', label: 'Legal', count: available_resources.filter(r => r.category === 'legal').length },
              { id: 'medical', label: 'Medical', count: available_resources.filter(r => r.category === 'medical').length },
              { id: 'personal', label: 'Personal', count: available_resources.filter(r => r.category === 'personal').length },
              { id: 'instructions', label: 'Instructions', count: guidance_entries.length },
            ].filter(cat => cat.count > 0).map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-900 dark:text-indigo-100'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>

          {/* Content Display */}
          <FadeIn duration={0.6} delay={0.4}>
            {selectedCategory === 'contacts' ? (
              <Card className=\"p-6\">
                <h3 className=\"font-semibold mb-6 flex items-center gap-2\">
                  <Icon name=\"users\" className=\"w-5 h-5\" />
                  Emergency Contacts
                </h3>
                
                <div className=\"grid md:grid-cols-2 gap-4\">
                  {emergency_contacts.map((contact, index) => (
                    <div key={index} className=\"p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50\">
                      <div className=\"flex items-center gap-3 mb-3\">
                        <div className=\"w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center\">
                          <Icon name=\"user\" className=\"w-6 h-6 text-indigo-600\" />
                        </div>
                        <div>
                          <div className=\"font-medium\">{contact.name}</div>
                          <div className=\"text-sm text-muted-foreground\">{contact.relationship}</div>
                        </div>
                      </div>
                      
                      <div className=\"space-y-2 text-sm\">
                        <div className=\"flex items-center gap-2\">
                          <Icon name=\"mail\" className=\"w-4 h-4 text-gray-500\" />
                          <a href={`mailto:${contact.email}`} className=\"text-indigo-600 hover:underline\">
                            {contact.email}
                          </a>
                        </div>
                        {contact.phone && (
                          <div className=\"flex items-center gap-2\">
                            <Icon name=\"phone\" className=\"w-4 h-4 text-gray-500\" />
                            <a href={`tel:${contact.phone}`} className=\"text-indigo-600 hover:underline\">
                              {contact.phone}
                            </a>
                          </div>
                        )}
                        <div className=\"flex items-center gap-2 mt-2\">
                          <Badge variant=\"outline\" className=\"text-xs\">
                            Priority {contact.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ) : selectedCategory === 'instructions' ? (
              <div className=\"space-y-4\">
                {guidance_entries.map((entry) => (
                  <Card key={entry.id} className=\"p-6\">
                    <div className=\"flex items-start justify-between mb-4\">
                      <div>
                        <h3 className=\"font-semibold\">{entry.title}</h3>
                        <Badge variant=\"outline\" className=\"mt-2\">
                          {entry.category.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <Badge 
                        variant={entry.is_completed ? 'default' : 'secondary'}
                        className=\"ml-4\"
                      >
                        {entry.is_completed ? 'Complete' : 'In Progress'}
                      </Badge>
                    </div>
                    
                    <div className=\"prose dark:prose-invert max-w-none\">
                      <p className=\"whitespace-pre-wrap\">{entry.content}</p>
                    </div>
                    
                    {entry.related_documents.length > 0 && (
                      <div className=\"mt-4 pt-4 border-t\">
                        <p className=\"text-sm font-medium mb-2\">Related Documents:</p>
                        <div className=\"flex flex-wrap gap-2\">
                          {entry.related_documents.map((docId, idx) => (
                            <Badge key={idx} variant=\"outline\" className=\"text-xs\">
                              Document #{docId.slice(-6)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
                
                {guidance_entries.length === 0 && (
                  <Card className=\"p-8 text-center\">
                    <Icon name=\"info\" className=\"w-12 h-12 mx-auto mb-4 text-gray-400\" />
                    <p className=\"text-muted-foreground\">
                      No guidance instructions are currently available.
                    </p>
                  </Card>
                )}
              </div>
            ) : (
              <div className=\"space-y-4\">
                {filteredResources.map((resource) => (
                  <Card key={resource.id} className=\"p-6 hover:shadow-lg transition-shadow\">
                    <div className=\"flex items-start justify-between\">
                      <div className=\"flex-1\">
                        <div className=\"flex items-center gap-3 mb-2\">
                          <Icon 
                            name={resource.resource_type === 'document' ? 'file' : 'info'} 
                            className=\"w-5 h-5 text-gray-500\" 
                          />
                          <h3 className=\"font-medium\">{resource.title}</h3>
                          <Badge variant=\"outline\" className=\"text-xs\">
                            {resource.category.toUpperCase()}
                          </Badge>
                        </div>
                        <p className=\"text-sm text-muted-foreground mb-3\">
                          {resource.description}
                        </p>
                        <div className=\"flex items-center gap-4 text-xs text-muted-foreground\">
                          <span>Access Level: {resource.access_level.replace('_', ' ').toUpperCase()}</span>
                          <span>Type: {resource.resource_type.toUpperCase()}</span>
                        </div>
                      </div>
                      
                      <div className=\"ml-4 flex flex-col items-end gap-2\">
                        <Badge 
                          variant={resource.is_available ? 'default' : 'secondary'}
                        >
                          {resource.is_available ? 'Available' : 'Restricted'}
                        </Badge>
                        
                        {resource.is_available && (
                          <Button
                            size=\"sm\"
                            variant=\"outline\"
                            onClick={() => downloadResource(resource)}
                          >
                            <Icon name={resource.resource_type === 'document' ? 'download' : 'eye'} className=\"w-4 h-4 mr-2\" />
                            {resource.resource_type === 'document' ? 'Download' : 'View'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
                
                {/* Time Capsules */}
                {selectedCategory === 'personal' && time_capsules.length > 0 && (
                  <>
                    <div className=\"mt-8 mb-4\">
                      <h3 className=\"text-lg font-semibold flex items-center gap-2\">
                        <Icon name=\"clock\" className=\"w-5 h-5\" />
                        Personal Messages
                      </h3>
                    </div>
                    
                    {time_capsules.map((capsule) => (
                      <Card key={capsule.id} className=\"p-6 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20\">
                        <div className=\"flex items-start justify-between\">
                          <div className=\"flex-1\">
                            <h4 className=\"font-medium mb-2\">{capsule.message_title}</h4>
                            {capsule.message_preview && (
                              <p className=\"text-sm text-muted-foreground mb-3\">
                                {capsule.message_preview}
                              </p>
                            )}
                            <div className=\"text-xs text-muted-foreground\">
                              Created: {new Date(capsule.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          
                          <Button
                            onClick={() => accessTimeCapsule(capsule)}
                            className=\"bg-amber-600 hover:bg-amber-700 ml-4\"
                          >
                            <Icon name=\"play\" className=\"w-4 h-4 mr-2\" />
                            Play Message
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </>
                )}
                
                {filteredResources.length === 0 && selectedCategory !== 'personal' && (
                  <Card className=\"p-8 text-center\">
                    <Icon name=\"search\" className=\"w-12 h-12 mx-auto mb-4 text-gray-400\" />
                    <p className=\"text-muted-foreground\">
                      No resources found in the {selectedCategory} category.
                    </p>
                    {!showAccessRequest && (
                      <Button 
                        className=\"mt-4\" 
                        variant=\"outline\"
                        onClick={() => setShowAccessRequest(true)}
                      >
                        Request Additional Access
                      </Button>
                    )}
                  </Card>
                )}
              </div>
            )}
          </FadeIn>
        </FadeIn>
      </div>
    </div>
  );
};

export default SurvivorInterface;