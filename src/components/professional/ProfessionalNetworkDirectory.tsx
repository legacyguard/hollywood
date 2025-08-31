/**
 * Professional Network Directory
 * Comprehensive directory of verified legal professionals
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Star,
  MapPin,
  Award,
  Calendar,
  Clock,
  CheckCircle,
  Shield,
  Eye,
  MessageSquare,
  FileText,
  Target,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  ChevronDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { ProfessionalReviewer } from '@/types/professional';

interface ProfessionalProfile extends ProfessionalReviewer {
  rating: number;
  reviewCount: number;
  responseTime: string;
  availability: 'available' | 'busy' | 'unavailable';
  featuredReview?: {
    rating: number;
    comment: string;
    clientName: string;
    date: string;
  };
  services: Array<{
    type: 'review' | 'consultation' | 'retainer';
    description: string;
    startingPrice: number;
  }>;
  achievements?: string[];
  languages?: string[];
}

interface DirectoryFilters {
  search: string;
  specializations: string[];
  states: string[];
  experienceRange: [number, number];
  ratingMin: number;
  priceRange: [number, number];
  availability: string;
  languages: string[];
  sortBy: 'rating' | 'experience' | 'price' | 'reviews';
  sortOrder: 'asc' | 'desc';
}

interface ProfessionalNetworkDirectoryProps {
  onSelectProfessional: (professional: ProfessionalProfile) => void;
  onBookConsultation: (professional: ProfessionalProfile) => void;
  onRequestReview: (professional: ProfessionalProfile) => void;
  className?: string;
}

const SAMPLE_PROFESSIONALS: ProfessionalProfile[] = [
  {
    id: '1',
    user_id: 'user1',
    email: 'sarah.johnson@law.com',
    full_name: 'Sarah Johnson',
    professional_title: 'Estate Planning Attorney',
    law_firm_name: 'Johnson & Associates',
    bar_number: '123456',
    licensed_states: ['California', 'Nevada', 'Arizona'],
    specializations: [
      { id: '1', name: 'Estate Planning', category: 'estate_planning' },
      { id: '2', name: 'Tax Law', category: 'tax_law' },
      { id: '3', name: 'Asset Protection', category: 'estate_planning' }
    ],
    experience_years: 15,
    status: 'active',
    verification_status: 'verified',
    hourly_rate: 350,
    bio: 'Specializing in comprehensive estate planning for high-net-worth families with complex asset structures.',
    profile_image_url: 'https://images.unsplash.com/photo-1494790108755-2616b619e04c?w=150&h=150&fit=crop&crop=face',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    rating: 4.9,
    reviewCount: 127,
    responseTime: '< 2 hours',
    availability: 'available',
    featuredReview: {
      rating: 5,
      comment: 'Sarah provided exceptional guidance through our complex estate planning process. Her attention to detail and proactive communication made the entire experience smooth and reassuring.',
      clientName: 'Michael R.',
      date: '2024-01-10'
    },
    services: [
      { type: 'consultation', description: 'Initial estate planning consultation', startingPrice: 300 },
      { type: 'review', description: 'Comprehensive document review', startingPrice: 750 },
      { type: 'retainer', description: 'Ongoing legal counsel', startingPrice: 2500 }
    ],
    achievements: ['Top 10 Estate Attorneys 2023', 'Client Choice Award', '15+ Years Experience'],
    languages: ['English', 'Spanish']
  },
  {
    id: '2',
    user_id: 'user2',
    email: 'michael.chen@legaleagle.com',
    full_name: 'Michael Chen',
    professional_title: 'Senior Partner',
    law_firm_name: 'LegalEagle Partners',
    bar_number: '789012',
    licensed_states: ['New York', 'New Jersey', 'Connecticut'],
    specializations: [
      { id: '4', name: 'Business Law', category: 'business_law' },
      { id: '5', name: 'Real Estate Law', category: 'real_estate' },
      { id: '6', name: 'Family Law', category: 'family_law' }
    ],
    experience_years: 22,
    status: 'active',
    verification_status: 'verified',
    hourly_rate: 450,
    bio: 'Leading expert in business succession planning and multi-generational wealth transfer strategies.',
    profile_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    rating: 4.8,
    reviewCount: 89,
    responseTime: '< 4 hours',
    availability: 'busy',
    featuredReview: {
      rating: 5,
      comment: 'Michael helped us restructure our business for optimal tax efficiency and succession planning. His expertise saved us thousands and provided peace of mind.',
      clientName: 'Jennifer L.',
      date: '2024-01-08'
    },
    services: [
      { type: 'consultation', description: 'Business succession consultation', startingPrice: 400 },
      { type: 'review', description: 'Business agreement review', startingPrice: 1200 },
      { type: 'retainer', description: 'Corporate counsel retainer', startingPrice: 5000 }
    ],
    achievements: ['Super Lawyers 2020-2024', 'Business Journal Top Attorney', 'Harvard Law Review'],
    languages: ['English', 'Mandarin']
  },
  {
    id: '3',
    user_id: 'user3',
    email: 'emily.rodriguez@elderlaw.com',
    full_name: 'Emily Rodriguez',
    professional_title: 'Elder Law Attorney',
    law_firm_name: 'Rodriguez Elder Law',
    bar_number: '345678',
    licensed_states: ['Florida', 'Georgia'],
    specializations: [
      { id: '7', name: 'Elder Law', category: 'estate_planning' },
      { id: '8', name: 'Probate Law', category: 'estate_planning' },
      { id: '9', name: 'Healthcare Directives', category: 'estate_planning' }
    ],
    experience_years: 12,
    status: 'active',
    verification_status: 'verified',
    hourly_rate: 275,
    bio: 'Compassionate legal counsel specializing in senior care planning and protecting family assets.',
    profile_image_url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&h=150&fit=crop&crop=face',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    rating: 4.9,
    reviewCount: 156,
    responseTime: '< 1 hour',
    availability: 'available',
    featuredReview: {
      rating: 5,
      comment: 'Emily guided our family through a difficult time with incredible compassion and expertise. She made complex legal matters understandable and manageable.',
      clientName: 'Robert K.',
      date: '2024-01-12'
    },
    services: [
      { type: 'consultation', description: 'Elder care planning session', startingPrice: 250 },
      { type: 'review', description: 'Healthcare directive review', startingPrice: 400 },
      { type: 'retainer', description: 'Family legal support', startingPrice: 1500 }
    ],
    achievements: ['Elder Law Specialist Certification', 'Community Service Award', 'Client Advocate 2023'],
    languages: ['English', 'Spanish', 'Portuguese']
  }
];

const SPECIALIZATIONS = [
  'Estate Planning', 'Tax Law', 'Business Law', 'Real Estate Law', 'Family Law',
  'Elder Law', 'Asset Protection', 'Probate Law', 'Healthcare Directives'
];

const _STATES = [
  'California', 'New York', 'Texas', 'Florida', 'Illinois', 'Pennsylvania',
  'Ohio', 'Georgia', 'North Carolina', 'Michigan', 'New Jersey', 'Virginia',
  'Washington', 'Arizona', 'Massachusetts', 'Tennessee', 'Indiana', 'Missouri',
  'Maryland', 'Wisconsin', 'Colorado', 'Minnesota', 'South Carolina', 'Alabama',
  'Louisiana', 'Kentucky', 'Oregon', 'Oklahoma', 'Connecticut', 'Utah'
];

const _LANGUAGES = ['English', 'Spanish', 'Mandarin', 'French', 'German', 'Portuguese', 'Italian'];

export function ProfessionalNetworkDirectory({
  onSelectProfessional: _onSelectProfessional,
  onBookConsultation,
  onRequestReview,
  className
}: ProfessionalNetworkDirectoryProps) {
  const [professionals, _setProfessionals] = useState<ProfessionalProfile[]>(SAMPLE_PROFESSIONALS);
  const [filters, setFilters] = useState<DirectoryFilters>({
    search: '',
    specializations: [],
    states: [],
    experienceRange: [0, 30],
    ratingMin: 0,
    priceRange: [100, 1000],
    availability: 'all',
    languages: [],
    sortBy: 'rating',
    sortOrder: 'desc'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<ProfessionalProfile | null>(null);
  const [_isLoading, _setIsLoading] = useState(false);

  const filteredAndSortedProfessionals = professionals
    .filter(prof => {
      // Search filter
      if (filters.search) {
        const search = filters.search.toLowerCase();
        if (!prof.full_name.toLowerCase().includes(search) &&
            !prof.professional_title.toLowerCase().includes(search) &&
            !prof.law_firm_name?.toLowerCase().includes(search) &&
            !prof.specializations.some(s => s.name.toLowerCase().includes(search))) {
          return false;
        }
      }

      // Specialization filter
      if (filters.specializations.length > 0) {
        const profSpecs = prof.specializations.map(s => s.name);
        if (!filters.specializations.some(spec => profSpecs.includes(spec))) {
          return false;
        }
      }

      // State filter
      if (filters.states.length > 0) {
        if (!filters.states.some(state => prof.licensed_states.includes(state))) {
          return false;
        }
      }

      // Experience range
      if (prof.experience_years < filters.experienceRange[0] ||
          prof.experience_years > filters.experienceRange[1]) {
        return false;
      }

      // Rating filter
      if (prof.rating < filters.ratingMin) {
        return false;
      }

      // Price range
      if (prof.hourly_rate &&
          (prof.hourly_rate < filters.priceRange[0] || prof.hourly_rate > filters.priceRange[1])) {
        return false;
      }

      // Availability filter
      if (filters.availability !== 'all' && prof.availability !== filters.availability) {
        return false;
      }

      // Language filter
      if (filters.languages.length > 0) {
        if (!filters.languages.some(lang => prof.languages?.includes(lang))) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (filters.sortBy) {
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'experience':
          aValue = a.experience_years;
          bValue = b.experience_years;
          break;
        case 'price':
          aValue = a.hourly_rate || 0;
          bValue = b.hourly_rate || 0;
          break;
        case 'reviews':
          aValue = a.reviewCount;
          bValue = b.reviewCount;
          break;
        default:
          return 0;
      }

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

  const getAvailabilityColor = (availability: ProfessionalProfile['availability']) => {
    switch (availability) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'unavailable':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      specializations: [],
      states: [],
      experienceRange: [0, 30],
      ratingMin: 0,
      priceRange: [100, 1000],
      availability: 'all',
      languages: [],
      sortBy: 'rating',
      sortOrder: 'desc'
    });
  };

  const renderProfessionalCard = (professional: ProfessionalProfile) => (
    <motion.div
      key={professional.id}
      initial={{  opacity: 0, y: 20  }}
      animate={{  opacity: 1, y: 0  }}
      className="group"
    >
      <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 cursor-pointer"
            onClick={() => setSelectedProfessional(professional)}>
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            <div className="relative">
              <Avatar className="w-16 h-16 border-2 border-white shadow-lg">
                <AvatarImage src={professional.profile_image_url} />
                <AvatarFallback className="text-lg font-semibold">
                  {professional.full_name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div className={cn(
                'absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white',
                professional.availability === 'available' ? 'bg-green-500' :
                professional.availability === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
              )} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-lg truncate">{professional.full_name}</h3>
                  <p className="text-muted-foreground text-sm truncate">{professional.professional_title}</p>
                  {professional.law_firm_name && (
                    <p className="text-xs text-muted-foreground truncate">{professional.law_firm_name}</p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-1 ml-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{professional.rating}</span>
                    <span className="text-xs text-muted-foreground">({professional.reviewCount})</span>
                  </div>
                  <Badge className={getAvailabilityColor(professional.availability)} variant={"outline" as any}>
                    {professional.availability}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  {professional.experience_years} yrs
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {professional.responseTime}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {professional.licensed_states.length} state{professional.licensed_states.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Specializations</Label>
            <div className="flex flex-wrap gap-1">
              {professional.specializations.slice(0, 3).map(spec => (
                <Badge key={spec.id} variant={"secondary" as any} className="text-xs">
                  {spec.name}
                </Badge>
              ))}
              {professional.specializations.length > 3 && (
                <Badge variant={"outline" as any} className="text-xs">
                  +{professional.specializations.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {professional.bio && (
            <div>
              <p className="text-sm text-muted-foreground line-clamp-2">{professional.bio}</p>
            </div>
          )}

          {professional.featuredReview && (
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                {[...Array(professional.featuredReview.rating)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 text-yellow-500 fill-current" />
                ))}
                <span className="text-xs text-muted-foreground ml-1">
                  - {professional.featuredReview.clientName}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                "{professional.featuredReview.comment}"
              </p>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Starting from:</span>
              <span className="font-semibold">${professional.hourly_rate}/hour</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onBookConsultation(professional);
                }}
                className="text-xs"
              >
                <Calendar className="h-3 w-3 mr-1" />
                Book Call
              </Button>
              <Button
                size="sm"
                variant={"outline" as any}
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestReview(professional);
                }}
                className="text-xs"
              >
                <FileText className="h-3 w-3 mr-1" />
                Review
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderProfessionalListItem = (professional: ProfessionalProfile) => (
    <motion.div
      key={professional.id}
      initial={{  opacity: 0, y: 10  }}
      animate={{  opacity: 1, y: 0  }}
      className="group"
    >
      <Card className="hover:shadow-lg transition-all duration-300 border hover:border-blue-200 cursor-pointer"
            onClick={() => setSelectedProfessional(professional)}>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="relative flex-shrink-0">
              <Avatar className="w-20 h-20 border-2 border-white shadow-lg">
                <AvatarImage src={professional.profile_image_url} />
                <AvatarFallback className="text-xl font-semibold">
                  {professional.full_name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div className={cn(
                'absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white',
                professional.availability === 'available' ? 'bg-green-500' :
                professional.availability === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
              )} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-xl mb-1">{professional.full_name}</h3>
                  <p className="text-muted-foreground mb-1">{professional.professional_title}</p>
                  {professional.law_firm_name && (
                    <p className="text-sm text-muted-foreground mb-2">{professional.law_firm_name}</p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      {professional.experience_years} years experience
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Responds in {professional.responseTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {professional.licensed_states.join(', ')}
                    </span>
                  </div>

                  {professional.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{professional.bio}</p>
                  )}

                  <div className="flex flex-wrap gap-1 mb-3">
                    {professional.specializations.map(spec => (
                      <Badge key={spec.id} variant={"secondary" as any} className="text-xs">
                        {spec.name}
                      </Badge>
                    ))}
                  </div>

                  {professional.achievements && professional.achievements.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {professional.achievements.slice(0, 2).map(achievement => (
                        <Badge key={achievement} variant={"outline" as any} className="text-xs">
                          <Award className="h-2 w-2 mr-1" />
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-3 ml-4">
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-lg font-bold">{professional.rating}</span>
                      <span className="text-sm text-muted-foreground">({professional.reviewCount})</span>
                    </div>
                    <Badge className={getAvailabilityColor(professional.availability)}>
                      {professional.availability}
                    </Badge>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Starting from</p>
                    <p className="text-xl font-bold">${professional.hourly_rate}/hour</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookConsultation(professional);
                      }}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Consultation
                    </Button>
                    <Button
                      size="sm"
                      variant={"outline" as any}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRequestReview(professional);
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Request Review
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <motion.div
      initial={{  opacity: 0, y: 20  }}
      animate={{  opacity: 1, y: 0  }}
      className={cn('space-y-6', className)}
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
          <Shield className="h-4 w-4" />
          Verified Professional Network
        </div>
        <h2 className="text-3xl font-bold">Find Your Legal Professional</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Connect with verified, licensed attorneys who specialize in estate planning,
          family law, and business counsel. All professionals are vetted and client-reviewed.
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, specialization, or location..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-12 pr-4 h-12 text-lg"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant={"outline" as any}
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Advanced Filters
                  <ChevronDown className={cn('h-4 w-4 transition-transform', showFilters && 'rotate-180')} />
                </Button>

                <div className="flex items-center gap-2">
                  <Label className="text-sm">Sort by:</Label>
                  <Select value={filters.sortBy} onValueChange={(value: any) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="experience">Experience</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="reviews">Reviews</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant={"outline" as any}
                    size="sm"
                    onClick={() => setFilters(prev => ({
                      ...prev,
                      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
                    }))}
                  >
                    {filters.sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {filteredAndSortedProfessionals.length} results
                </span>

                <Separator orientation="vertical" className="h-6" />

                <div className="flex rounded-md border">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{  opacity: 0, height: 0  }}
                  animate={{  opacity: 1, height: 'auto'  }}
                  exit={{  opacity: 0, height: 0  }}
                  className="border-t pt-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <Label className="font-medium">Specializations</Label>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {SPECIALIZATIONS.map(spec => (
                          <div key={spec} className="flex items-center space-x-2">
                            <Checkbox
                              id={spec}
                              checked={filters.specializations.includes(spec)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFilters(prev => ({
                                    ...prev,
                                    specializations: [...prev.specializations, spec]
                                  }));
                                } else {
                                  setFilters(prev => ({
                                    ...prev,
                                    specializations: prev.specializations.filter(s => s !== spec)
                                  }));
                                }
                              }}
                            />
                            <Label htmlFor={spec} className="text-sm">{spec}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="font-medium">Experience Range</Label>
                      <div className="px-2">
                        <Slider
                          value={filters.experienceRange}
                          onValueChange={(value) => setFilters(prev => ({
                            ...prev,
                            experienceRange: value as [number, number]
                          }))}
                          max={30}
                          min={0}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground mt-1">
                          <span>{filters.experienceRange[0]} years</span>
                          <span>{filters.experienceRange[1]} years</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="font-medium">Hourly Rate Range</Label>
                      <div className="px-2">
                        <Slider
                          value={filters.priceRange}
                          onValueChange={(value) => setFilters(prev => ({
                            ...prev,
                            priceRange: value as [number, number]
                          }))}
                          max={1000}
                          min={100}
                          step={25}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground mt-1">
                          <span>${filters.priceRange[0]}</span>
                          <span>${filters.priceRange[1]}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="font-medium">Minimum Rating</Label>
                      <Select
                        value={filters.ratingMin.toString()}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, ratingMin: Number(value) }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Any Rating</SelectItem>
                          <SelectItem value="4">4+ Stars</SelectItem>
                          <SelectItem value="4.5">4.5+ Stars</SelectItem>
                          <SelectItem value="4.8">4.8+ Stars</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label className="font-medium">Availability</Label>
                      <Select
                        value={filters.availability}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, availability: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="available">Available Now</SelectItem>
                          <SelectItem value="busy">Busy but Taking Clients</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">Active Filters</Label>
                        {(filters.specializations.length > 0 || filters.states.length > 0 || filters.languages.length > 0) && (
                          <Button variant={"ghost" as any} size="sm" onClick={resetFilters}>
                            Clear All
                          </Button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {filters.specializations.map(spec => (
                          <Badge key={spec} variant={"secondary" as any} className="text-xs">
                            {spec}
                            <Button
                              variant={"ghost" as any}
                              size="sm"
                              className="ml-1 h-auto p-0 text-xs"
                              onClick={() => setFilters(prev => ({
                                ...prev,
                                specializations: prev.specializations.filter(s => s !== spec)
                              }))}
                            >
                              ×
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedProfessionals.map(renderProfessionalCard)}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedProfessionals.map(renderProfessionalListItem)}
          </div>
        )}

        {filteredAndSortedProfessionals.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Professionals Found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or filters to find more professionals.
              </p>
              <Button variant={"outline" as any} onClick={resetFilters}>
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Professional Detail Modal */}
      <Dialog open={!!selectedProfessional} onOpenChange={() => setSelectedProfessional(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Professional Profile
            </DialogTitle>
          </DialogHeader>

          {selectedProfessional && (
            <div className="space-y-6">
              {/* Professional Header */}
              <div className="flex items-start gap-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                  <AvatarImage src={selectedProfessional.profile_image_url} />
                  <AvatarFallback className="text-2xl font-semibold">
                    {selectedProfessional.full_name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">{selectedProfessional.full_name}</h2>
                      <p className="text-lg text-muted-foreground mb-1">{selectedProfessional.professional_title}</p>
                      {selectedProfessional.law_firm_name && (
                        <p className="text-muted-foreground mb-2">{selectedProfessional.law_firm_name}</p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          {selectedProfessional.experience_years} years experience
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Responds in {selectedProfessional.responseTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Shield className="h-4 w-4" />
                          Verified Attorney
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-5 w-5 text-yellow-500 fill-current" />
                        <span className="text-xl font-bold">{selectedProfessional.rating}</span>
                        <span className="text-muted-foreground">({selectedProfessional.reviewCount} reviews)</span>
                      </div>
                      <Badge className={getAvailabilityColor(selectedProfessional.availability)} className="mb-2">
                        {selectedProfessional.availability}
                      </Badge>
                      <p className="text-lg font-bold">${selectedProfessional.hourly_rate}/hour</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={() => onBookConsultation(selectedProfessional)}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Consultation
                    </Button>
                    <Button variant={"outline" as any} onClick={() => onRequestReview(selectedProfessional)}>
                      <FileText className="h-4 w-4 mr-2" />
                      Request Review
                    </Button>
                    <Button variant={"outline" as any}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </div>

              {/* Professional Details */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="credentials">Credentials</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About {selectedProfessional.full_name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{selectedProfessional.bio}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="font-medium mb-2 block">Specializations</Label>
                          <div className="flex flex-wrap gap-2">
                            {selectedProfessional.specializations.map(spec => (
                              <Badge key={spec.id} variant={"secondary" as any}>
                                {spec.name}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="font-medium mb-2 block">Licensed States</Label>
                          <div className="flex flex-wrap gap-2">
                            {selectedProfessional.licensed_states.map(state => (
                              <Badge key={state} variant={"outline" as any}>
                                {state}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {selectedProfessional.languages && (
                          <div>
                            <Label className="font-medium mb-2 block">Languages</Label>
                            <div className="flex flex-wrap gap-2">
                              {selectedProfessional.languages.map(lang => (
                                <Badge key={lang} variant={"outline" as any}>
                                  {lang}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedProfessional.achievements && (
                          <div>
                            <Label className="font-medium mb-2 block">Achievements</Label>
                            <div className="space-y-1">
                              {selectedProfessional.achievements.map(achievement => (
                                <div key={achievement} className="flex items-center gap-2">
                                  <Award className="h-4 w-4 text-yellow-600" />
                                  <span className="text-sm">{achievement}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="services" className="space-y-4">
                  {selectedProfessional.services.map((service, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <Badge variant={"outline" as any} className="mb-2 capitalize">
                              {service.type}
                            </Badge>
                            <h3 className="font-semibold">{service.description}</h3>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">${service.startingPrice}</p>
                            <p className="text-sm text-muted-foreground">Starting from</p>
                          </div>
                        </div>
                        <Button size="sm">
                          Select Service
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="reviews" className="space-y-4">
                  {selectedProfessional.featuredReview && (
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex">
                            {[...Array(selectedProfessional.featuredReview.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                            ))}
                          </div>
                          <span className="font-medium">{selectedProfessional.featuredReview.clientName}</span>
                          <span className="text-sm text-muted-foreground">
                            • {new Date(selectedProfessional.featuredReview.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-muted-foreground">"{selectedProfessional.featuredReview.comment}"</p>
                      </CardContent>
                    </Card>
                  )}

                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>More reviews available after initial consultation</p>
                  </div>
                </TabsContent>

                <TabsContent value="credentials" className="space-y-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="font-medium mb-2 block">Bar Information</Label>
                          <p className="text-muted-foreground">Bar Number: {selectedProfessional.bar_number}</p>
                          <p className="text-muted-foreground">Status: {selectedProfessional.verification_status}</p>
                        </div>

                        <div>
                          <Label className="font-medium mb-2 block">Experience</Label>
                          <p className="text-muted-foreground">{selectedProfessional.experience_years} years in practice</p>
                          <p className="text-muted-foreground">Member since {new Date(selectedProfessional.created_at).getFullYear()}</p>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 text-green-800">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-medium">Verified Professional</span>
                        </div>
                        <p className="text-sm text-green-700 mt-1">
                          This attorney's credentials have been verified and they maintain professional liability insurance.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Trust Footer */}
      <div className="bg-gray-50 rounded-lg p-8">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2">Why Choose Our Network?</h3>
          <p className="text-muted-foreground">
            Every attorney in our network is personally vetted and client-verified
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-semibold">100% Verified</h4>
            <p className="text-sm text-muted-foreground">
              All attorneys are licensed, insured, and background-checked
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Star className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-semibold">Client-Reviewed</h4>
            <p className="text-sm text-muted-foreground">
              Real reviews from real clients, with satisfaction guarantee
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-semibold">Perfect Matches</h4>
            <p className="text-sm text-muted-foreground">
              Advanced matching ensures you find the right attorney for your needs
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
