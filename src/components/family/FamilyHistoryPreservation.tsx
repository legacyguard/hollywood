import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Camera,
  Mic,
  Video,
  FileText,
  MapPin,
  Calendar,
  Heart,
  Users,
  Book,
  Archive,
  Download,
  Upload,
  Play,
  Pause,
  Square,
  RotateCcw,
  Save,
  Edit3,
  Trash2,
  Share2,
  Clock,
  Tag,
  Image as ImageIcon,
  Music,
  Sparkles
} from 'lucide-react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';

export interface HistoryItem {
  id: string;
  type: 'story' | 'photo' | 'video' | 'audio' | 'document' | 'timeline_event';
  title: string;
  description?: string;
  content?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  location?: {
    name: string;
    coordinates?: { lat: number; lng: number };
  };
  dateOfEvent?: string;
  relatedPeople: string[];
  category: 'childhood' | 'education' | 'career' | 'family' | 'travel' | 'traditions' | 'achievements' | 'challenges' | 'other';
  importance: 'low' | 'medium' | 'high' | 'milestone';
  isPrivate: boolean;
  metadata?: {
    duration?: number; // for audio/video
    resolution?: string; // for video/photo
    fileSize?: number;
    transcription?: string; // for audio/video
  };
}

export interface FamilyTimeline {
  id: string;
  name: string;
  description: string;
  startYear: number;
  endYear?: number;
  events: HistoryItem[];
  collaborators: string[];
  isPublic: boolean;
  theme: 'classic' | 'modern' | 'vintage' | 'elegant';
}

interface FamilyHistoryPreservationProps {
  historyItems: HistoryItem[];
  timelines: FamilyTimeline[];
  familyMembers: Array<{ id: string; name: string; relationship: string }>;
  currentUserId: string;
  onSaveHistoryItem?: (item: Omit<HistoryItem, 'id'>) => void;
  onUpdateHistoryItem?: (item: HistoryItem) => void;
  onDeleteHistoryItem?: (itemId: string) => void;
  onCreateTimeline?: (timeline: Omit<FamilyTimeline, 'id'>) => void;
  onRecordAudio?: (audioBlob: Blob, metadata: any) => void;
  onRecordVideo?: (videoBlob: Blob, metadata: any) => void;
  onUploadPhoto?: (file: File, metadata: any) => void;
}

export const FamilyHistoryPreservation: React.FC<FamilyHistoryPreservationProps> = ({
  historyItems,
  timelines,
  familyMembers,
  currentUserId,
  onSaveHistoryItem,
  onUpdateHistoryItem,
  onDeleteHistoryItem,
  onCreateTimeline,
  onRecordAudio,
  onRecordVideo,
  onUploadPhoto
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [isRecording, setIsRecording] = useState<'audio' | 'video' | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showTimelineDialog, setShowTimelineDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<HistoryItem | null>(null);

  // Recording state
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  // New item state
  const [newItem, setNewItem] = useState<Partial<HistoryItem>>({
    type: 'story',
    title: '',
    description: '',
    content: '',
    tags: [],
    relatedPeople: [],
    category: 'family',
    importance: 'medium',
    isPrivate: false
  });

  // New timeline state
  const [newTimeline, setNewTimeline] = useState<Partial<FamilyTimeline>>({
    name: '',
    description: '',
    startYear: new Date().getFullYear(),
    theme: 'classic',
    isPublic: false,
    collaborators: []
  });

  // Start recording
  const startRecording = async (type: 'audio' | 'video') => {
    try {
      const constraints = type === 'video'
        ? { video: true, audio: true }
        : { audio: true };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (type === 'video' && videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play();
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, {
          type: type === 'video' ? 'video/webm' : 'audio/webm'
        });

        const metadata = {
          duration: recordingTime,
          type: type,
          timestamp: new Date().toISOString()
        };

        if (type === 'video') {
          onRecordVideo?.(blob, metadata);
        } else {
          onRecordAudio?.(blob, metadata);
        }

        // Clean up
        stream.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      };

      mediaRecorder.start();
      setIsRecording(type);
      setRecordingTime(0);

      // Start timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to access camera/microphone. Please check permissions.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }

    setIsRecording(null);
    setRecordingTime(0);

    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = null;
    }
  };

  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'document') => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (type === 'photo' && file.type.startsWith('image/')) {
      const metadata = {
        originalName: file.name,
        size: file.size,
        type: file.type,
        timestamp: new Date().toISOString()
      };
      onUploadPhoto?.(file, metadata);
    }
  };

  // Save new history item
  const handleSaveItem = () => {
    if (!newItem.title) return;

    const item: Omit<HistoryItem, 'id'> = {
      type: newItem.type as HistoryItem['type'],
      title: newItem.title,
      description: newItem.description,
      content: newItem.content,
      author: currentUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: newItem.tags || [],
      relatedPeople: newItem.relatedPeople || [],
      category: newItem.category as HistoryItem['category'],
      importance: newItem.importance as HistoryItem['importance'],
      isPrivate: newItem.isPrivate || false,
      dateOfEvent: newItem.dateOfEvent
    };

    onSaveHistoryItem?.(item);

    // Reset form
    setNewItem({
      type: 'story',
      title: '',
      description: '',
      content: '',
      tags: [],
      relatedPeople: [],
      category: 'family',
      importance: 'medium',
      isPrivate: false
    });
    setShowCreateDialog(false);
  };

  // Create timeline
  const handleCreateTimeline = () => {
    if (!newTimeline.name) return;

    const timeline: Omit<FamilyTimeline, 'id'> = {
      name: newTimeline.name,
      description: newTimeline.description || '',
      startYear: newTimeline.startYear || new Date().getFullYear(),
      events: [],
      collaborators: newTimeline.collaborators || [],
      isPublic: newTimeline.isPublic || false,
      theme: newTimeline.theme as FamilyTimeline['theme']
    };

    onCreateTimeline?.(timeline);

    // Reset form
    setNewTimeline({
      name: '',
      description: '',
      startYear: new Date().getFullYear(),
      theme: 'classic',
      isPublic: false,
      collaborators: []
    });
    setShowTimelineDialog(false);
  };

  const HistoryItemCard = ({ item }: { item: HistoryItem }) => {
    const getTypeIcon = (type: string) => {
      const icons = {
        story: BookIcon,
        photo: ImageIcon,
        video: Video,
        audio: Music,
        document: FileText,
        timeline_event: Calendar
      };
      return icons[type as keyof typeof icons] || BookIcon;
    };

    const TypeIcon = getTypeIcon(item.type);

    return (
      <motion.div
        initial={{  opacity: 0, y: 20  }}
        animate={{  opacity: 1, y: 0  }}
        className="group"
      >
        <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-102">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  item.importance === 'milestone' ? 'bg-yellow-100' :
                  item.importance === 'high' ? 'bg-red-100' :
                  item.importance === 'medium' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <TypeIcon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-medium line-clamp-1">
                    {item.title}
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={item.importance === 'milestone' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {item.importance}
                </Badge>
                {item.isPrivate && <Badge variant={"outline" as any} className="text-xs">Private</Badge>}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-3">
              {item.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {item.description}
                </p>
              )}

              {item.location && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin className="h-3 w-3" />
                  {item.location.name}
                </div>
              )}

              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant={"outline" as any} className="text-xs px-1">
                      #{tag}
                    </Badge>
                  ))}
                  {item.tags.length > 3 && (
                    <Badge variant={"outline" as any} className="text-xs px-1">
                      +{item.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {item.relatedPeople.slice(0, 3).map(personId => {
                    const person = familyMembers.find(m => m.id === personId);
                    return person ? (
                      <div
                        key={personId}
                        className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium border-2 border-white"
                        title={person.name}
                      >
                        {person.name.charAt(0)}
                      </div>
                    ) : null;
                  })}
                  {item.relatedPeople.length > 3 && (
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium border-2 border-white">
                      +{item.relatedPeople.length - 3}
                    </div>
                  )}
                </div>

                <div className="flex gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant={"ghost" as any}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setEditingItem(item)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={"ghost" as any}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onDeleteHistoryItem?.(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={"ghost" as any}
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const RecordingInterface = () => {
    if (!isRecording) return null;

    return (
      <motion.div
        initial={{  opacity: 0, y: 50  }}
        animate={{  opacity: 1, y: 0  }}
        className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl p-6 z-50 border"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-medium">
                Recording {isRecording === 'video' ? 'Video' : 'Audio'}
              </span>
            </div>
            <div className="text-lg font-mono">
              {formatTime(recordingTime)}
            </div>
          </div>

          {isRecording === 'video' && (
            <video
              ref={videoPreviewRef}
              className="w-64 h-48 bg-black rounded-lg"
              muted
              autoPlay
            />
          )}

          {isRecording === 'audio' && (
            <div className="w-64 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <div className="flex space-x-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={i}
                    className="w-2 bg-white rounded-full animate-pulse"
                    style={{
                      height: `${Math.random() * 40 + 20 }}px`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant={"destructive" as any}
              onClick={stopRecording}
              className="flex-1"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop Recording
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Archive className="h-6 w-6" />
            Family History Preservation
          </h2>
          <p className="text-gray-600">
            Capture, preserve, and share your family's stories and memories
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={"outline" as any}
            onClick={() => startRecording('audio')}
            disabled={!!isRecording}
          >
            <Mic className="h-4 w-4 mr-2" />
            Record Audio
          </Button>

          <Button
            variant={"outline" as any}
            onClick={() => startRecording('video')}
            disabled={!!isRecording}
          >
            <Video className="h-4 w-4 mr-2" />
            Record Video
          </Button>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, 'photo')}
            className="hidden"
            id="photo-upload"
          />
          <Button variant={"outline" as any} onClick={() => document.getElementById('photo-upload')?.click()}>
            <Camera className="h-4 w-4 mr-2" />
            Upload Photo
          </Button>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Add Story
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New History Item</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Type</Label>
                    <Select
                      value={newItem.type}
                      onValueChange={(value) => setNewItem(prev => ({ ...prev, type: value as HistoryItem['type'] }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="story">Story</SelectItem>
                        <SelectItem value="photo">Photo</SelectItem>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="timeline_event">Timeline Event</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Category</Label>
                    <Select
                      value={newItem.category}
                      onValueChange={(value) => setNewItem(prev => ({ ...prev, category: value as HistoryItem['category'] }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="childhood">Childhood</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="career">Career</SelectItem>
                        <SelectItem value="family">Family</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                        <SelectItem value="traditions">Traditions</SelectItem>
                        <SelectItem value="achievements">Achievements</SelectItem>
                        <SelectItem value="challenges">Challenges</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Title</Label>
                  <Input
                    value={newItem.title || ''}
                    onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter a memorable title"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newItem.description || ''}
                    onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description"
                    rows={2}
                  />
                </div>

                {newItem.type === 'story' && (
                  <div>
                    <Label>Story Content</Label>
                    <Textarea
                      value={newItem.content || ''}
                      onChange={(e) => setNewItem(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Tell your story..."
                      rows={6}
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Importance</Label>
                    <Select
                      value={newItem.importance}
                      onValueChange={(value) => setNewItem(prev => ({ ...prev, importance: value as HistoryItem['importance'] }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="milestone">Milestone</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Date of Event (Optional)</Label>
                    <Input
                      type="date"
                      value={newItem.dateOfEvent || ''}
                      onChange={(e) => setNewItem(prev => ({ ...prev, dateOfEvent: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant={"outline" as any} onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveItem}>
                    Save History Item
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stories">Stories</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="timelines">Timelines</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <BookIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">
                      {historyItems.filter(item => item.type === 'story').length}
                    </p>
                    <p className="text-sm text-gray-600">Stories</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <ImageIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">
                      {historyItems.filter(item => item.type === 'photo').length}
                    </p>
                    <p className="text-sm text-gray-600">Photos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Video className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">
                      {historyItems.filter(item => item.type === 'video').length}
                    </p>
                    <p className="text-sm text-gray-600">Videos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <Sparkles className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">
                      {historyItems.filter(item => item.importance === 'milestone').length}
                    </p>
                    <p className="text-sm text-gray-600">Milestones</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Items */}
          <Card>
            <CardHeader>
              <CardTitle>Recent History Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {historyItems
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 6)
                  .map(item => (
                    <HistoryItemCard key={item.id} item={item} />
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stories">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historyItems
              .filter(item => item.type === 'story')
              .map(item => (
                <HistoryItemCard key={item.id} item={item} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="media">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {historyItems
              .filter(item => ['photo', 'video', 'audio'].includes(item.type))
              .map(item => (
                <HistoryItemCard key={item.id} item={item} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="timelines">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Family Timelines</h3>
              <Dialog open={showTimelineDialog} onOpenChange={setShowTimelineDialog}>
                <DialogTrigger asChild>
                  <Button>Create Timeline</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Timeline</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label>Timeline Name</Label>
                      <Input
                        value={newTimeline.name || ''}
                        onChange={(e) => setNewTimeline(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Smith Family Journey"
                      />
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={newTimeline.description || ''}
                        onChange={(e) => setNewTimeline(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe this timeline..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Start Year</Label>
                        <Input
                          type="number"
                          value={newTimeline.startYear || ''}
                          onChange={(e) => setNewTimeline(prev => ({ ...prev, startYear: parseInt(e.target.value) }))}
                        />
                      </div>

                      <div>
                        <Label>Theme</Label>
                        <Select
                          value={newTimeline.theme}
                          onValueChange={(value) => setNewTimeline(prev => ({ ...prev, theme: value as FamilyTimeline['theme'] }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="classic">Classic</SelectItem>
                            <SelectItem value="modern">Modern</SelectItem>
                            <SelectItem value="vintage">Vintage</SelectItem>
                            <SelectItem value="elegant">Elegant</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant={"outline" as any} onClick={() => setShowTimelineDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateTimeline}>
                        Create Timeline
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {timelines.map(timeline => (
                <Card key={timeline.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{timeline.name}</CardTitle>
                        <p className="text-sm text-gray-600">{timeline.description}</p>
                      </div>
                      <Badge variant={timeline.isPublic ? 'default' : 'secondary'}>
                        {timeline.isPublic ? 'Public' : 'Private'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{timeline.startYear} - {timeline.endYear || 'Present'}</span>
                        <span>{timeline.events.length} events</span>
                        <span>{timeline.collaborators.length} collaborators</span>
                      </div>

                      <div className="flex gap-2">
                        <Button variant={"outline" as any} size="sm">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant={"outline" as any} size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Recording Interface */}
      <RecordingInterface />
    </div>
  );
};

// Helper component for missing import
const BookIcon = Book;
const Camera = ImageIcon;

export default FamilyHistoryPreservation;
