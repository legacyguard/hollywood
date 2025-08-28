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
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { FolderOpen, Plus, Users, Clock, CheckCircle, AlertCircle, Calendar as CalendarIcon, Target, TrendingUp, FileText, Archive, Filter, MoreVertical, Edit3, Trash2, Eye, Share2, Bell, Flag, Star, Zap, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FamilyMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'project-manager' | 'contributor' | 'reviewer' | 'viewer';
  expertise: string[];
  availability: 'full-time' | 'part-time' | 'limited' | 'unavailable';
}

interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  assigneeName: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: Date;
  completedAt?: Date;
  estimatedHours: number;
  actualHours?: number;
  dependencies: string[];
  tags: string[];
  comments: TaskComment[];
  attachments: TaskAttachment[];
}

interface TaskComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
}

interface TaskAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: Date;
  fileSize: number;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  isCompleted: boolean;
  completedAt?: Date;
  associatedTasks: string[];
  rewards?: string;
}

interface LegacyProject {
  id: string;
  title: string;
  description: string;
  category: 'will-creation' | 'document-organization' | 'family-history' | 'emergency-planning' | 'trust-setup' | 'asset-management' | 'custom';
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'critical';
  ownerId: string;
  teamMembers: FamilyMember[];
  tasks: Task[];
  milestones: Milestone[];
  budget?: number;
  actualCost?: number;
  startDate: Date;
  targetDate?: Date;
  completedDate?: Date;
  progress: number;
  tags: string[];
  resources: ProjectResource[];
  settings: {
    isPrivate: boolean;
    requiresApproval: boolean;
    allowTeamInvites: boolean;
  };
}

interface ProjectResource {
  id: string;
  name: string;
  type: 'document' | 'link' | 'template' | 'contact';
  url: string;
  description?: string;
  addedBy: string;
  addedAt: Date;
}

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: LegacyProject['category'];
  estimatedDuration: string;
  tasks: Omit<Task, 'id' | 'assigneeId' | 'assigneeName' | 'comments' | 'attachments'>[];
  milestones: Omit<Milestone, 'id' | 'associatedTasks' | 'isCompleted'>[];
  requiredRoles: string[];
  icon: React.ReactNode;
}

const projectTemplates: ProjectTemplate[] = [
  {
    id: 'comprehensive-will',
    name: 'Comprehensive Will Creation',
    description: 'Complete will creation with legal review and family consultation',
    category: 'will-creation',
    estimatedDuration: '4-6 weeks',
    tasks: [
      {
        title: 'Gather personal information and assets',
        description: 'Compile all necessary personal and financial information',
        status: 'todo',
        priority: 'high',
        estimatedHours: 8,
        dependencies: [],
        tags: ['information-gathering', 'assets']
      },
      {
        title: 'Define beneficiaries and inheritance wishes',
        description: 'Clearly define who gets what and under what conditions',
        status: 'todo',
        priority: 'high',
        estimatedHours: 4,
        dependencies: [],
        tags: ['beneficiaries', 'inheritance']
      },
      {
        title: 'Draft initial will document',
        description: 'Create the first draft using legal templates',
        status: 'todo',
        priority: 'medium',
        estimatedHours: 6,
        dependencies: [],
        tags: ['drafting', 'legal']
      },
      {
        title: 'Family review and feedback',
        description: 'Share draft with family for input and discussion',
        status: 'todo',
        priority: 'medium',
        estimatedHours: 4,
        dependencies: [],
        tags: ['family-review', 'feedback']
      },
      {
        title: 'Professional legal review',
        description: 'Have attorney review and validate the will',
        status: 'todo',
        priority: 'critical',
        estimatedHours: 3,
        dependencies: [],
        tags: ['legal-review', 'attorney']
      },
      {
        title: 'Finalize and execute will',
        description: 'Complete final signing and witnessing process',
        status: 'todo',
        priority: 'critical',
        estimatedHours: 2,
        dependencies: [],
        tags: ['execution', 'signing']
      }
    ],
    milestones: [
      {
        title: 'Information Collection Complete',
        description: 'All personal and asset information gathered',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        rewards: 'Foundation for will is solid'
      },
      {
        title: 'First Draft Complete',
        description: 'Initial will document is ready for review',
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        rewards: 'Major milestone - will is taking shape'
      },
      {
        title: 'Will Legally Executed',
        description: 'Will is signed, witnessed, and legally valid',
        dueDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000),
        rewards: 'Family protection is now legally secured'
      }
    ],
    requiredRoles: ['project-manager', 'legal-advisor', 'family-members'],
    icon: <FileText className="h-4 w-4" />
  },
  {
    id: 'emergency-planning',
    name: 'Family Emergency Planning',
    description: 'Comprehensive emergency preparedness and response planning',
    category: 'emergency-planning',
    estimatedDuration: '2-3 weeks',
    tasks: [
      {
        title: 'Create emergency contact database',
        description: 'Compile all important emergency contact information',
        status: 'todo',
        priority: 'high',
        estimatedHours: 3,
        dependencies: [],
        tags: ['contacts', 'emergency']
      },
      {
        title: 'Develop emergency procedures',
        description: 'Create step-by-step emergency response procedures',
        status: 'todo',
        priority: 'high',
        estimatedHours: 6,
        dependencies: [],
        tags: ['procedures', 'response']
      },
      {
        title: 'Prepare emergency kits',
        description: 'Assemble physical emergency kits for each household',
        status: 'todo',
        priority: 'medium',
        estimatedHours: 8,
        dependencies: [],
        tags: ['emergency-kit', 'supplies']
      }
    ],
    milestones: [
      {
        title: 'Emergency Contacts Established',
        description: 'All family members have access to emergency contacts',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        rewards: 'Quick access to help in emergencies'
      },
      {
        title: 'Emergency Plan Complete',
        description: 'Comprehensive emergency plan is finalized',
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        rewards: 'Family is prepared for any emergency'
      }
    ],
    requiredRoles: ['project-manager', 'family-members'],
    icon: <AlertCircle className="h-4 w-4" />
  },
  {
    id: 'family-history',
    name: 'Family History Documentation',
    description: 'Preserve family history through stories, photos, and recordings',
    category: 'family-history',
    estimatedDuration: '8-12 weeks',
    tasks: [
      {
        title: 'Interview family elders',
        description: 'Record stories and memories from older family members',
        status: 'todo',
        priority: 'high',
        estimatedHours: 20,
        dependencies: [],
        tags: ['interviews', 'stories', 'memories']
      },
      {
        title: 'Digitize family photos',
        description: 'Scan and organize historical family photographs',
        status: 'todo',
        priority: 'medium',
        estimatedHours: 15,
        dependencies: [],
        tags: ['photos', 'digitization']
      },
      {
        title: 'Create family tree',
        description: 'Build comprehensive family genealogy',
        status: 'todo',
        priority: 'medium',
        estimatedHours: 12,
        dependencies: [],
        tags: ['genealogy', 'family-tree']
      }
    ],
    milestones: [
      {
        title: 'Elder Interviews Complete',
        description: 'All available elder interviews have been recorded',
        dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        rewards: 'Precious memories are preserved forever'
      },
      {
        title: 'Family Archive Complete',
        description: 'Complete digital family history archive is ready',
        dueDate: new Date(Date.now() + 84 * 24 * 60 * 60 * 1000),
        rewards: 'Family legacy is documented for future generations'
      }
    ],
    requiredRoles: ['project-manager', 'family-historian', 'family-members'],
    icon: <Archive className="h-4 w-4" />
  }
];

interface FamilyLegacyProjectManagementProps {
  familyMembers?: FamilyMember[];
  onProjectCreated?: (project: LegacyProject) => void;
  existingProjects?: LegacyProject[];
}

export const FamilyLegacyProjectManagement: React.FC<FamilyLegacyProjectManagementProps> = ({
  familyMembers = [],
  onProjectCreated,
  existingProjects = []
}) => {
  const [projects, setProjects] = useState<LegacyProject[]>(existingProjects);
  const [activeProject, setActiveProject] = useState<LegacyProject | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'calendar'>('kanban');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentUserId] = useState('current-user-id');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Mock current user
  const currentUser: FamilyMember = {
    id: currentUserId,
    name: 'You',
    email: 'user@example.com',
    role: 'project-manager',
    expertise: ['project-management', 'legal-planning'],
    availability: 'full-time'
  };

  const allMembers = [currentUser, ...familyMembers];

  const createProjectFromTemplate = (template: ProjectTemplate) => {
    const newProject: LegacyProject = {
      id: `project-${Date.now()}`,
      title: template.name,
      description: template.description,
      category: template.category,
      status: 'planning',
      priority: 'medium',
      ownerId: currentUserId,
      teamMembers: [currentUser],
      tasks: template.tasks.map((task, index) => ({
        ...task,
        id: `task-${Date.now()}-${index}`,
        assigneeId: currentUserId,
        assigneeName: currentUser.name
      })),
      milestones: template.milestones.map((milestone, index) => ({
        ...milestone,
        id: `milestone-${Date.now()}-${index}`,
        associatedTasks: [],
        isCompleted: false
      })),
      startDate: new Date(),
      targetDate: new Date(Date.now() + 6 * 7 * 24 * 60 * 60 * 1000), // 6 weeks from now
      progress: 0,
      tags: [template.category],
      resources: [],
      settings: {
        isPrivate: false,
        requiresApproval: false,
        allowTeamInvites: true
      }
    };

    setProjects([...projects, newProject]);
    setActiveProject(newProject);
    onProjectCreated?.(newProject);
    setIsCreating(false);
    setSelectedTemplate(null);
  };

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    if (!activeProject) return;

    const updatedTasks = activeProject.tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = {
          ...task,
          status: newStatus,
          completedAt: newStatus === 'completed' ? new Date() : undefined
        };
        return updatedTask;
      }
      return task;
    });

    const completedTasks = updatedTasks.filter(t => t.status === 'completed').length;
    const progress = Math.round((completedTasks / updatedTasks.length) * 100);

    const updatedProject = {
      ...activeProject,
      tasks: updatedTasks,
      progress,
      status: progress === 100 ? ('completed') : activeProject.status,
      completedDate: progress === 100 ? new Date() : undefined
    };

    setActiveProject(updatedProject);
    setProjects(projects.map(p => p.id === activeProject.id ? updatedProject : p));
  };

  const addTaskComment = (taskId: string, content: string) => {
    if (!activeProject || !content.trim()) return;

    const comment: TaskComment = {
      id: `comment-${Date.now()}`,
      userId: currentUserId,
      userName: currentUser.name,
      content,
      timestamp: new Date()
    };

    const updatedTasks = activeProject.tasks.map(task =>
      task.id === taskId
        ? { ...task, comments: [...task.comments, comment] }
        : task
    );

    const updatedProject = {
      ...activeProject,
      tasks: updatedTasks
    };

    setActiveProject(updatedProject);
    setProjects(projects.map(p => p.id === activeProject.id ? updatedProject : p));
  };

  const createNewTask = (taskData: Partial<Task>) => {
    if (!activeProject) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskData.title || 'New Task',
      description: taskData.description || '',
      assigneeId: taskData.assigneeId || currentUserId,
      assigneeName: taskData.assigneeName || currentUser.name,
      status: 'todo',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate,
      estimatedHours: taskData.estimatedHours || 1,
      dependencies: [],
      tags: taskData.tags || []
    };

    const updatedProject = {
      ...activeProject,
      tasks: [...activeProject.tasks, newTask]
    };

    setActiveProject(updatedProject);
    setProjects(projects.map(p => p.id === activeProject.id ? updatedProject : p));
    setShowTaskForm(false);
  };

  const getStatusColor = (status: LegacyProject['status']) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Task['priority'] | LegacyProject['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProjects = projects.filter(project =>
    filterStatus === 'all' || project.status === filterStatus
  );

  const tasksByStatus = activeProject ? {
    'todo': activeProject.tasks.filter(t => t.status === 'todo'),
    'in-progress': activeProject.tasks.filter(t => t.status === 'in-progress'),
    'review': activeProject.tasks.filter(t => t.status === 'review'),
    'completed': activeProject.tasks.filter(t => t.status === 'completed'),
    'blocked': activeProject.tasks.filter(t => t.status === 'blocked')
  } : { 'todo': [], 'in-progress': [], 'review': [], 'completed': [], 'blocked': [] };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Family Legacy Project Management</h2>
          <p className="text-gray-600">Organize and manage your family's legacy planning projects</p>
        </div>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Legacy Project</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {projectTemplates.map((template) => (
                  <motion.div
                    key={template.id}
                    whileHover={{  scale: 1.02  }}
                    whileTap={{  scale: 0.98  }}
                  >
                    <Card
                      className="cursor-pointer hover:border-blue-300 transition-colors h-full"
                      onClick={() => createProjectFromTemplate(template)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            {template.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{template.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                            <div className="flex items-center gap-2 mt-3">
                              <Badge variant={"outline" as any} className="text-xs">
                                {template.category.replace('-', ' ')}
                              </Badge>
                              <Badge variant={"secondary" as any} className="text-xs">
                                {template.estimatedDuration}
                              </Badge>
                            </div>
                            <div className="mt-3 text-xs text-gray-500">
                              {template.tasks.length} tasks • {template.milestones.length} milestones
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant={"outline" as any} onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button variant={"outline" as any}>
                  Create Custom Project
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Active Project Detail View */}
      {activeProject && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-xl">{activeProject.title}</CardTitle>
                  <Badge className={getStatusColor(activeProject.status)}>
                    {activeProject.status}
                  </Badge>
                  <Badge className={getPriorityColor(activeProject.priority)}>
                    {activeProject.priority}
                  </Badge>
                </div>
                <p className="text-gray-600">{activeProject.description}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    Started {activeProject.startDate.toLocaleDateString()}
                  </div>
                  {activeProject.targetDate && (
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      Due {activeProject.targetDate.toLocaleDateString()}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {activeProject.teamMembers.length} members
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kanban">Kanban</SelectItem>
                    <SelectItem value="list">List</SelectItem>
                    <SelectItem value="calendar">Calendar</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant={"outline" as any} onClick={() => setActiveProject(null)}>
                  Close
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Project Progress</span>
                <span className="text-sm text-gray-500">{activeProject.progress}%</span>
              </div>
              <Progress value={activeProject.progress} className="h-2" />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="tasks" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>

              <TabsContent value="tasks" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Tasks ({activeProject.tasks.length})</h3>
                  <Button
                    size="sm"
                    onClick={() => setShowTaskForm(true)}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Task
                  </Button>
                </div>

                {/* Kanban Board */}
                {viewMode === 'kanban' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {Object.entries(tasksByStatus).map(([status, tasks]) => (
                      <div key={status} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm text-gray-700 uppercase tracking-wide">
                            {status.replace('-', ' ')} ({tasks.length})
                          </h4>
                        </div>
                        <div className="space-y-2 min-h-[200px]">
                          <AnimatePresence>
                            {tasks.map((task) => (
                              <motion.div
                                key={task.id}
                                initial={{  opacity: 0, y: 20  }}
                                animate={{  opacity: 1, y: 0  }}
                                exit={{  opacity: 0, y: -20  }}
                                layout
                              >
                                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                  <CardContent className="p-3">
                                    <div className="flex items-start justify-between mb-2">
                                      <h5 className="font-medium text-sm">{task.title}</h5>
                                      <Badge className={getPriorityColor(task.priority)}>
                                        {task.priority}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                                      {task.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-1">
                                        <Avatar className="w-5 h-5">
                                          <AvatarFallback className="text-xs">
                                            {task.assigneeName.charAt(0)}
                                          </AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs text-gray-500">
                                          {task.assigneeName}
                                        </span>
                                      </div>
                                      {task.dueDate && (
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                          <CalendarIcon className="h-3 w-3" />
                                          {task.dueDate.toLocaleDateString()}
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex gap-1 mt-2">
                                      {['todo', 'in-progress', 'review', 'completed', 'blocked'].map((newStatus) => (
                                        <Button
                                          key={newStatus}
                                          size="sm"
                                          variant={task.status === newStatus ? "default" : "outline"}
                                          onClick={() => updateTaskStatus(task.id, newStatus as Task['status'])}
                                          className="text-xs h-6 px-2"
                                        >
                                          {newStatus === 'in-progress' ? 'Progress' : newStatus}
                                        </Button>
                                      ))}
                                    </div>

                                    {task.comments.length > 0 && (
                                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                        <MessageCircle className="h-3 w-3" />
                                        {task.comments.length} comments
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Task Creation Form */}
                <Dialog open={showTaskForm} onOpenChange={setShowTaskForm}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Task</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input placeholder="Task title" />
                      <Textarea placeholder="Task description" rows={3} />
                      <div className="grid grid-cols-2 gap-4">
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Assignee" />
                          </SelectTrigger>
                          <SelectContent>
                            {activeProject.teamMembers.map((member) => (
                              <SelectItem key={member.id} value={member.id}>
                                {member.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Input type="number" placeholder="Estimated hours" min="1" />
                      <Button
                        onClick={() => createNewTask({ title: 'New Task', description: 'Task description' })}
                        className="w-full"
                      >
                        Create Task
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </TabsContent>

              <TabsContent value="milestones" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Milestones ({activeProject.milestones.length})</h3>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Milestone
                  </Button>
                </div>

                <div className="space-y-3">
                  {activeProject.milestones.map((milestone) => (
                    <Card key={milestone.id} className={milestone.isCompleted ? 'bg-green-50 border-green-200' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{milestone.title}</h4>
                              {milestone.isCompleted ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <Clock className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                            {milestone.rewards && (
                              <div className="flex items-center gap-1 mt-2 text-sm text-blue-600">
                                <Star className="h-4 w-4" />
                                {milestone.rewards}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">
                              Due: {milestone.dueDate.toLocaleDateString()}
                            </div>
                            {milestone.isCompleted && milestone.completedAt && (
                              <div className="text-sm text-green-600">
                                Completed: {milestone.completedAt.toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="team" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Team Members ({activeProject.teamMembers.length})</h3>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Member
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeProject.teamMembers.map((member) => (
                    <Card key={member.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-gray-500">{member.email}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={"outline" as any} className="text-xs">
                                {member.role}
                              </Badge>
                              <Badge variant={"secondary" as any} className="text-xs">
                                {member.availability}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        {member.expertise.length > 0 && (
                          <div className="mt-3">
                            <div className="text-xs text-gray-500 mb-1">Expertise:</div>
                            <div className="flex flex-wrap gap-1">
                              {member.expertise.map((skill) => (
                                <Badge key={skill} variant={"outline" as any} className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="resources" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Project Resources ({activeProject.resources.length})</h3>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Resource
                  </Button>
                </div>

                <div className="text-center py-8 text-gray-500">
                  <FolderOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No resources added yet</p>
                  <p className="text-sm">Add templates, documents, or helpful links</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Project List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <motion.div
            key={project.id}
            whileHover={{  y: -2  }}
            transition={{  duration: 0.2  }}
          >
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveProject(project)}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={"outline" as any} className="text-xs">
                    {project.category.replace('-', ' ')}
                  </Badge>
                  <Badge className={getPriorityColor(project.priority)}>
                    {project.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      {project.tasks.filter(t => t.status === 'completed').length}/{project.tasks.length} tasks
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {project.teamMembers.length} members
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div>Started {project.startDate.toLocaleDateString()}</div>
                    {project.targetDate && (
                      <div>Due {project.targetDate.toLocaleDateString()}</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Found</h3>
          <p className="text-gray-600 mb-4">
            {filterStatus !== 'all'
              ? 'Try adjusting your filters to see more projects'
              : 'Create your first legacy project to start organizing your family planning'
            }
          </p>
          {filterStatus === 'all' && (
            <Button onClick={() => setIsCreating(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create First Project
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
