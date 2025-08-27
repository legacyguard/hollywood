import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { Vote, Users, Clock, CheckCircle, XCircle, AlertCircle, MessageSquare, Calendar, Plus, Eye, ThumbsUp, ThumbsDown, Minus, Settings, Archive, Filter, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FamilyMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'head' | 'adult' | 'minor' | 'guardian';
  votingWeight: number;
  isActive: boolean;
  joinedAt: Date;
}

interface VoteOption {
  id: string;
  text: string;
  description?: string;
  votes: string[];
  percentage: number;
}

interface Vote {
  id: string;
  userId: string;
  userName: string;
  optionId: string;
  timestamp: Date;
  reasoning?: string;
  isPublic: boolean;
}

interface DecisionComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  replies: DecisionComment[];
}

interface FamilyDecision {
  id: string;
  title: string;
  description: string;
  category: 'legacy-planning' | 'financial' | 'healthcare' | 'property' | 'family-governance' | 'emergency' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'voting' | 'decided' | 'implemented' | 'archived';
  createdBy: string;
  createdAt: Date;
  votingDeadline?: Date;
  requiredVotes?: number;
  requiresUnanimity: boolean;
  eligibleVoters: string[];
  options: VoteOption[];
  votes: Vote[];
  comments: DecisionComment[];
  result?: {
    winningOption: string;
    finalizedAt: Date;
    finalizedBy: string;
    implementationNotes?: string;
  };
  settings: {
    allowComments: boolean;
    allowVoteChanges: boolean;
    showVoteReasoning: boolean;
    isAnonymous: boolean;
  };
}

interface DecisionTemplate {
  id: string;
  name: string;
  description: string;
  category: FamilyDecision['category'];
  priority: FamilyDecision['priority'];
  defaultOptions: string[];
  suggestedDeadline: number; // days
  requiresUnanimity: boolean;
  icon: React.ReactNode;
}

const decisionTemplates: DecisionTemplate[] = [
  {
    id: 'healthcare-decision',
    name: 'Healthcare Decision',
    description: 'Make important healthcare decisions for family members',
    category: 'healthcare',
    priority: 'high',
    defaultOptions: ['Approve', 'Reject', 'Need More Information'],
    suggestedDeadline: 3,
    requiresUnanimity: true,
    icon: <AlertCircle className="h-4 w-4" />
  },
  {
    id: 'legacy-distribution',
    name: 'Legacy Distribution',
    description: 'Decide on distribution of family assets or heirlooms',
    category: 'legacy-planning',
    priority: 'high',
    defaultOptions: ['Equal Distribution', 'Based on Need', 'Based on Contribution', 'Other'],
    suggestedDeadline: 14,
    requiresUnanimity: false,
    icon: <Users className="h-4 w-4" />
  },
  {
    id: 'family-tradition',
    name: 'Family Tradition',
    description: 'Decisions about maintaining or changing family traditions',
    category: 'family-governance',
    priority: 'medium',
    defaultOptions: ['Continue as is', 'Modify tradition', 'Create new tradition', 'Discontinue'],
    suggestedDeadline: 7,
    requiresUnanimity: false,
    icon: <Calendar className="h-4 w-4" />
  },
  {
    id: 'emergency-protocol',
    name: 'Emergency Protocol',
    description: 'Establish emergency procedures and decision-making authority',
    category: 'emergency',
    priority: 'critical',
    defaultOptions: ['Approve Protocol', 'Modify Protocol', 'Reject Protocol'],
    suggestedDeadline: 5,
    requiresUnanimity: true,
    icon: <AlertCircle className="h-4 w-4" />
  }
];

interface FamilyDecisionTrackingProps {
  familyMembers?: FamilyMember[];
  onDecisionCreated?: (decision: FamilyDecision) => void;
  existingDecisions?: FamilyDecision[];
}

export const FamilyDecisionTracking: React.FC<FamilyDecisionTrackingProps> = ({
  familyMembers = [],
  onDecisionCreated,
  existingDecisions = []
}) => {
  const [decisions, setDecisions] = useState<FamilyDecision[]>(existingDecisions);
  const [activeDecision, setActiveDecision] = useState<FamilyDecision | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DecisionTemplate | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [currentUserId] = useState('current-user-id');
  const [votingFor, setVotingFor] = useState<string | null>(null);

  // Mock current user
  const currentUser: FamilyMember = {
    id: currentUserId,
    name: 'You',
    email: 'user@example.com',
    role: 'head',
    votingWeight: 2,
    isActive: true,
    joinedAt: new Date()
  };

  const allMembers = [currentUser, ...familyMembers];

  const createNewDecision = (template?: DecisionTemplate) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + (template?.suggestedDeadline || 7));

    const newDecision: FamilyDecision = {
      id: `decision-${Date.now()}`,
      title: template ? template.name : 'New Family Decision',
      description: template ? template.description : '',
      category: template?.category || 'other',
      priority: template?.priority || 'medium',
      status: 'draft',
      createdBy: currentUserId,
      createdAt: new Date(),
      votingDeadline: tomorrow,
      requiresUnanimity: template?.requiresUnanimity || false,
      eligibleVoters: allMembers.filter(m => m.role !== 'minor').map(m => m.id),
      options: (template?.defaultOptions || ['Yes', 'No']).map((option, index) => ({
        id: `option-${index}`,
        text: option,
        votes: [],
        percentage: 0
      })),
      votes: [],
      comments: [],
      settings: {
        allowComments: true,
        allowVoteChanges: true,
        showVoteReasoning: true,
        isAnonymous: false
      }
    };

    setActiveDecision(newDecision);
    setSelectedTemplate(template || null);
    setIsCreating(true);
  };

  const saveDecision = () => {
    if (!activeDecision) return;

    const existingIndex = decisions.findIndex(d => d.id === activeDecision.id);
    if (existingIndex >= 0) {
      const updatedDecisions = [...decisions];
      updatedDecisions[existingIndex] = activeDecision;
      setDecisions(updatedDecisions);
    } else {
      setDecisions([...decisions, activeDecision]);
    }

    onDecisionCreated?.(activeDecision);
    setIsCreating(false);
    setActiveDecision(null);
    setSelectedTemplate(null);
  };

  const startVoting = (decisionId: string) => {
    const decision = decisions.find(d => d.id === decisionId);
    if (!decision) return;

    const updatedDecision = {
      ...decision,
      status: 'voting' as const
    };

    setDecisions(decisions.map(d => d.id === decisionId ? updatedDecision : d));
  };

  const castVote = (decisionId: string, optionId: string, reasoning?: string) => {
    const decision = decisions.find(d => d.id === decisionId);
    if (!decision) return;

    // Remove any existing vote by this user
    const filteredVotes = decision.votes.filter(v => v.userId !== currentUserId);
    
    // Add new vote
    const newVote: Vote = {
      id: `vote-${Date.now()}`,
      userId: currentUserId,
      userName: currentUser.name,
      optionId,
      timestamp: new Date(),
      reasoning,
      isPublic: !decision.settings.isAnonymous
    };

    // Update options with vote counts
    const updatedOptions = decision.options.map(option => {
      const votes = option.id === optionId 
        ? [...option.votes.filter(v => v !== currentUserId), currentUserId]
        : option.votes.filter(v => v !== currentUserId);
      
      return {
        ...option,
        votes,
        percentage: Math.round((votes.length / decision.eligibleVoters.length) * 100)
      };
    });

    const updatedDecision = {
      ...decision,
      votes: [...filteredVotes, newVote],
      options: updatedOptions
    };

    // Check if decision is complete
    const totalVotes = updatedDecision.votes.length;
    const requiredVotes = updatedDecision.requiredVotes || updatedDecision.eligibleVoters.length;
    
    if (totalVotes >= requiredVotes || checkDecisionComplete(updatedDecision)) {
      const winningOption = getWinningOption(updatedDecision);
      updatedDecision.status = 'decided';
      updatedDecision.result = {
        winningOption: winningOption?.id || '',
        finalizedAt: new Date(),
        finalizedBy: 'system'
      };
    }

    setDecisions(decisions.map(d => d.id === decisionId ? updatedDecision : d));
    setVotingFor(null);
  };

  const checkDecisionComplete = (decision: FamilyDecision): boolean => {
    if (decision.requiresUnanimity) {
      return decision.votes.length === decision.eligibleVoters.length;
    }
    
    const totalVotes = decision.votes.length;
    const requiredVotes = decision.requiredVotes || Math.ceil(decision.eligibleVoters.length / 2);
    
    return totalVotes >= requiredVotes;
  };

  const getWinningOption = (decision: FamilyDecision): VoteOption | null => {
    if (decision.options.length === 0) return null;
    
    return decision.options.reduce((winner, option) => 
      option.votes.length > winner.votes.length ? option : winner
    );
  };

  const addComment = (decisionId: string, content: string) => {
    const decision = decisions.find(d => d.id === decisionId);
    if (!decision || !content.trim()) return;

    const comment: DecisionComment = {
      id: `comment-${Date.now()}`,
      userId: currentUserId,
      userName: currentUser.name,
      content,
      timestamp: new Date(),
      replies: []
    };

    const updatedDecision = {
      ...decision,
      comments: [...decision.comments, comment]
    };

    setDecisions(decisions.map(d => d.id === decisionId ? updatedDecision : d));
  };

  const getPriorityColor = (priority: FamilyDecision['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: FamilyDecision['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'voting': return 'bg-blue-100 text-blue-800';
      case 'decided': return 'bg-green-100 text-green-800';
      case 'implemented': return 'bg-purple-100 text-purple-800';
      case 'archived': return 'bg-gray-100 text-gray-500';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: FamilyDecision['status']) => {
    switch (status) {
      case 'draft': return <Settings className="h-4 w-4" />;
      case 'voting': return <Vote className="h-4 w-4" />;
      case 'decided': return <CheckCircle className="h-4 w-4" />;
      case 'implemented': return <CheckCircle className="h-4 w-4" />;
      case 'archived': return <Archive className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredDecisions = decisions.filter(decision => {
    const statusMatch = filterStatus === 'all' || decision.status === filterStatus;
    const categoryMatch = filterCategory === 'all' || decision.category === filterCategory;
    return statusMatch && categoryMatch;
  });

  const getUserVote = (decision: FamilyDecision) => {
    return decision.votes.find(v => v.userId === currentUserId);
  };

  const canVote = (decision: FamilyDecision) => {
    return decision.status === 'voting' && 
           decision.eligibleVoters.includes(currentUserId) &&
           (!decision.votingDeadline || new Date() < decision.votingDeadline);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Family Decision Tracking</h2>
          <p className="text-gray-600">Collaborative decision-making for important family matters</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={() => setIsCreating(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                New Decision
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Create New Decision</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {decisionTemplates.map((template) => (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className="cursor-pointer hover:border-blue-300 transition-colors"
                      onClick={() => createNewDecision(template)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            {template.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{template.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={getPriorityColor(template.priority)}>
                                {template.priority}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {template.category.replace('-', ' ')}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => createNewDecision()}
                >
                  Create Custom Decision
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="voting">Voting</SelectItem>
              <SelectItem value="decided">Decided</SelectItem>
              <SelectItem value="implemented">Implemented</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="legacy-planning">Legacy Planning</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
            <SelectItem value="financial">Financial</SelectItem>
            <SelectItem value="family-governance">Family Governance</SelectItem>
            <SelectItem value="emergency">Emergency</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Decision Creation Interface */}
      {isCreating && activeDecision && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Input
                  value={activeDecision.title}
                  onChange={(e) => setActiveDecision({...activeDecision, title: e.target.value})}
                  className="text-xl font-bold border-0 p-0 h-auto"
                  placeholder="Decision Title"
                />
                <Textarea
                  value={activeDecision.description}
                  onChange={(e) => setActiveDecision({...activeDecision, description: e.target.value})}
                  className="text-sm text-gray-600 border-0 p-0 resize-none mt-2"
                  placeholder="Describe the decision that needs to be made..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button onClick={saveDecision}>
                  Create Decision
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="options" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="options">Options</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="voters">Eligible Voters</TabsTrigger>
              </TabsList>

              <TabsContent value="options" className="space-y-4">
                <div>
                  <h3 className="font-medium mb-3">Decision Options</h3>
                  <div className="space-y-2">
                    {activeDecision.options.map((option, index) => (
                      <div key={option.id} className="flex items-center gap-2">
                        <Input
                          value={option.text}
                          onChange={(e) => {
                            const updatedOptions = [...activeDecision.options];
                            updatedOptions[index] = {...option, text: e.target.value};
                            setActiveDecision({...activeDecision, options: updatedOptions});
                          }}
                          placeholder={`Option ${index + 1}`}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const updatedOptions = activeDecision.options.filter((_, i) => i !== index);
                            setActiveDecision({...activeDecision, options: updatedOptions});
                          }}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const newOption: VoteOption = {
                        id: `option-${activeDecision.options.length}`,
                        text: '',
                        votes: [],
                        percentage: 0
                      };
                      setActiveDecision({
                        ...activeDecision,
                        options: [...activeDecision.options, newOption]
                      });
                    }}
                    className="mt-2 gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Option
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Priority</label>
                    <Select 
                      value={activeDecision.priority}
                      onValueChange={(value: FamilyDecision['priority']) => 
                        setActiveDecision({...activeDecision, priority: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <Select 
                      value={activeDecision.category}
                      onValueChange={(value: FamilyDecision['category']) => 
                        setActiveDecision({...activeDecision, category: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="legacy-planning">Legacy Planning</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="financial">Financial</SelectItem>
                        <SelectItem value="property">Property</SelectItem>
                        <SelectItem value="family-governance">Family Governance</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Voting Deadline</label>
                  <Input
                    type="datetime-local"
                    value={activeDecision.votingDeadline?.toISOString().slice(0, 16) || ''}
                    onChange={(e) => setActiveDecision({
                      ...activeDecision, 
                      votingDeadline: e.target.value ? new Date(e.target.value) : undefined
                    })}
                  />
                </div>
              </TabsContent>

              <TabsContent value="voters" className="space-y-4">
                <div>
                  <h3 className="font-medium mb-3">Eligible Voters</h3>
                  <div className="space-y-2">
                    {allMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-gray-500">
                              {member.role} • Weight: {member.votingWeight}
                            </div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={activeDecision.eligibleVoters.includes(member.id)}
                          onChange={(e) => {
                            const voters = e.target.checked
                              ? [...activeDecision.eligibleVoters, member.id]
                              : activeDecision.eligibleVoters.filter(v => v !== member.id);
                            setActiveDecision({...activeDecision, eligibleVoters: voters});
                          }}
                          className="rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Decision List */}
      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence>
          {filteredDecisions.map((decision) => {
            const userVote = getUserVote(decision);
            const winningOption = getWinningOption(decision);
            
            return (
              <motion.div
                key={decision.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                layout
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{decision.title}</CardTitle>
                          <Badge className={getStatusColor(decision.status)}>
                            {getStatusIcon(decision.status)}
                            {decision.status}
                          </Badge>
                          <Badge className={getPriorityColor(decision.priority)}>
                            {decision.priority}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm">{decision.description}</p>
                      </div>
                      <div className="flex gap-2">
                        {decision.status === 'draft' && decision.createdBy === currentUserId && (
                          <Button
                            size="sm"
                            onClick={() => startVoting(decision.id)}
                            className="gap-2"
                          >
                            <Vote className="h-3 w-3" />
                            Start Voting
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setActiveDecision(decision)}
                          className="gap-2"
                        >
                          <Eye className="h-3 w-3" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Voting Interface */}
                    {decision.status === 'voting' && canVote(decision) && !userVote && (
                      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Cast Your Vote</h4>
                        <div className="grid gap-2">
                          {decision.options.map((option) => (
                            <Button
                              key={option.id}
                              variant="outline"
                              className="justify-start"
                              onClick={() => setVotingFor(option.id)}
                            >
                              {option.text}
                            </Button>
                          ))}
                        </div>
                        
                        {/* Vote Confirmation Dialog */}
                        <Dialog open={!!votingFor} onOpenChange={() => setVotingFor(null)}>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Your Vote</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <p>You are voting for: <strong>{decision.options.find(o => o.id === votingFor)?.text}</strong></p>
                              {decision.settings.showVoteReasoning && (
                                <div>
                                  <label className="text-sm font-medium">Reasoning (optional)</label>
                                  <Textarea placeholder="Explain your reasoning..." />
                                </div>
                              )}
                              <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={() => setVotingFor(null)}>
                                  Cancel
                                </Button>
                                <Button onClick={() => votingFor && castVote(decision.id, votingFor)}>
                                  Confirm Vote
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}

                    {/* Current Vote */}
                    {userVote && (
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-green-800 font-medium">
                            You voted: {decision.options.find(o => o.id === userVote.optionId)?.text}
                          </span>
                        </div>
                        {userVote.reasoning && (
                          <p className="text-sm text-green-700 mt-1">"{userVote.reasoning}"</p>
                        )}
                      </div>
                    )}

                    {/* Vote Results */}
                    <div className="space-y-3">
                      {decision.options.map((option) => (
                        <div key={option.id} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{option.text}</span>
                            <span className="text-gray-500">
                              {option.votes.length} votes ({option.percentage}%)
                            </span>
                          </div>
                          <Progress 
                            value={option.percentage} 
                            className={`h-2 ${decision.result?.winningOption === option.id ? 'bg-green-100' : ''}`}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Decision Result */}
                    {decision.result && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-800">
                            Decision: {winningOption?.text}
                          </span>
                        </div>
                        <p className="text-sm text-green-700 mt-1">
                          Decided on {decision.result.finalizedAt.toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    {/* Footer Info */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t text-xs text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {decision.votes.length}/{decision.eligibleVoters.length} voted
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {decision.comments.length} comments
                        </div>
                        {decision.votingDeadline && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Deadline: {decision.votingDeadline.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <div>
                        Created by {allMembers.find(m => m.id === decision.createdBy)?.name} on{' '}
                        {decision.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredDecisions.length === 0 && (
        <div className="text-center py-12">
          <Vote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Decisions Found</h3>
          <p className="text-gray-600 mb-4">
            {filterStatus !== 'all' || filterCategory !== 'all' 
              ? 'Try adjusting your filters to see more decisions'
              : 'Create your first family decision to get started with collaborative decision-making'
            }
          </p>
          {(filterStatus === 'all' && filterCategory === 'all') && (
            <Button onClick={() => setIsCreating(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create First Decision
            </Button>
          )}
        </div>
      )}
    </div>
  );
};