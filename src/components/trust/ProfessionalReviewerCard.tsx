/**
 * Professional Reviewer Profile Card Component
 * Displays reviewer credentials and expertise for trust building
 */

import { Star, Award, Clock, CheckCircle, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { ProfessionalReviewer } from '@/types/professional';

interface ProfessionalReviewerCardProps {
  reviewer: ProfessionalReviewer;
  variant?: 'full' | 'compact' | 'minimal';
  showContactButton?: boolean;
  showStats?: boolean;
  onContact?: (reviewer: ProfessionalReviewer) => void;
  className?: string;
}

export function ProfessionalReviewerCard({
  reviewer,
  variant = 'full',
  showContactButton = true,
  showStats = true,
  onContact,
  className
}: ProfessionalReviewerCardProps) {
  const getAvailabilityColor = (status: ProfessionalReviewer['availability_status']) => {
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-100';
      case 'busy':
        return 'text-yellow-600 bg-yellow-100';
      case 'unavailable':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getAvailabilityLabel = (status: ProfessionalReviewer['availability_status']) => {
    switch (status) {
      case 'available':
        return 'Available Now';
      case 'busy':
        return 'Limited Availability';
      case 'unavailable':
        return 'Currently Booked';
      default:
        return 'Status Unknown';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          'h-4 w-4',
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        )}
      />
    ));
  };

  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center gap-3 p-2', className)}>
        <Avatar className="h-8 w-8">
          <AvatarImage src={reviewer.avatar_url} alt={reviewer.name} />
          <AvatarFallback className="text-xs">
            {reviewer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{reviewer.name}</p>
          <p className="text-xs text-muted-foreground truncate">{reviewer.credentials}</p>
        </div>
        <div className="flex items-center gap-1">
          {renderStars(Math.floor(reviewer.average_rating)).slice(0, 3)}
          <span className="text-xs text-muted-foreground ml-1">
            {reviewer.average_rating.toFixed(1)}
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={reviewer.avatar_url} alt={reviewer.name} />
              <AvatarFallback>
                {reviewer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div>
                <h3 className="font-semibold text-base">{reviewer.name}</h3>
                <p className="text-sm text-muted-foreground">{reviewer.credentials}</p>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  {renderStars(Math.floor(reviewer.average_rating))}
                  <span className="text-muted-foreground ml-1">
                    {reviewer.average_rating.toFixed(1)} ({reviewer.total_reviews})
                  </span>
                </div>

                <Badge className={cn('text-xs', getAvailabilityColor(reviewer.availability_status))}>
                  {getAvailabilityLabel(reviewer.availability_status)}
                </Badge>
              </div>

              {showContactButton && (
                <Button
                  size="sm"
                  variant={"outline" as any}
                  onClick={() => onContact?.(reviewer)}
                  className="w-full"
                >
                  Request Review
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full variant
  return (
    <Card className={cn('w-full hover:shadow-lg transition-shadow', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={reviewer.avatar_url} alt={reviewer.name} />
            <AvatarFallback className="text-lg">
              {reviewer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold">{reviewer.name}</h3>
                <p className="text-muted-foreground font-medium">{reviewer.credentials}</p>
              </div>
              <Badge className={cn('ml-2', getAvailabilityColor(reviewer.availability_status))}>
                {getAvailabilityLabel(reviewer.availability_status)}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {renderStars(Math.floor(reviewer.average_rating))}
                <span className="text-sm font-medium ml-2">
                  {reviewer.average_rating.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({reviewer.total_reviews} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Specialization */}
        {reviewer.specialization && (
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm capitalize font-medium">{reviewer.specialization}</span>
          </div>
        )}

        {/* Location */}
        {reviewer.location && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{reviewer.location}</span>
          </div>
        )}

        {/* Experience */}
        {reviewer.years_experience && (
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{reviewer.years_experience} years of experience</span>
          </div>
        )}

        {/* Bio */}
        {reviewer.bio && (
          <div className="pt-2">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {reviewer.bio}
            </p>
          </div>
        )}

        {/* Stats */}
        {showStats && (
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-lg font-bold">{reviewer.total_reviews}</span>
              </div>
              <p className="text-xs text-muted-foreground">Reviews</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Award className="h-4 w-4 text-blue-600" />
                <span className="text-lg font-bold">
                  {Math.round(reviewer.average_rating * 20)}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Success Rate</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-lg font-bold">
                  {reviewer.average_turnaround_days}d
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Avg. Time</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {showContactButton && (
          <div className="pt-4 space-y-2">
            <Button
              onClick={() => onContact?.(reviewer)}
              className="w-full"
              disabled={reviewer.availability_status === 'unavailable'}
            >
              {reviewer.availability_status === 'unavailable'
                ? 'Currently Unavailable'
                : 'Request Professional Review'
              }
            </Button>
            {reviewer.rate_per_hour && (
              <p className="text-center text-sm text-muted-foreground">
                Starting from ${reviewer.rate_per_hour}/hour
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
