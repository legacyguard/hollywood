/**
 * Legal Consultation Booking System
 * Professional consultation scheduling with premium UX
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Video,
  Phone,
  MapPin,
  User,
  Star,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Info,
  Shield,
  Zap,
  MessageSquare,
  Award,
  Briefcase,
  Timer
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { ProfessionalReviewer } from '@/types/professional';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  price?: number;
}

interface ConsultationBookingSystemProps {
  reviewer: ProfessionalReviewer;
  onBookConsultation: (booking: ConsultationBooking) => void;
  onCancel: () => void;
  className?: string;
}

interface ConsultationBooking {
  reviewerId: string;
  consultationType: 'phone' | 'video' | 'in_person';
  date: string;
  time: string;
  duration: number;
  totalCost: number;
  clientInfo: {
    name: string;
    email: string;
    phone: string;
    consultationTopic: string;
    backgroundInfo: string;
    urgencyLevel: 'low' | 'medium' | 'high';
  };
  specialRequests?: string;
}

type BookingStep = 'type' | 'schedule' | 'details' | 'review' | 'confirmation';

const CONSULTATION_TYPES = [
  {
    id: 'phone',
    name: 'Phone Consultation',
    description: 'Professional advice over a secure phone call',
    icon: Phone,
    duration: [30, 60],
    priceMultiplier: 1.0,
    features: ['Secure phone line', 'Call recording available', 'Follow-up summary email']
  },
  {
    id: 'video',
    name: 'Video Consultation',
    description: 'Face-to-face consultation via secure video call',
    icon: Video,
    duration: [30, 60, 90],
    priceMultiplier: 1.1,
    features: ['HD video call', 'Screen sharing', 'Session recording', 'Digital document review']
  },
  {
    id: 'in_person',
    name: 'In-Person Meeting',
    description: 'Traditional office consultation',
    icon: MapPin,
    duration: [60, 90, 120],
    priceMultiplier: 1.3,
    features: ['Office meeting', 'Document review', 'Comprehensive discussion', 'Follow-up materials']
  }
];

const SAMPLE_AVAILABILITY = {
  '2024-01-15': [
    { id: '1', time: '09:00', available: true },
    { id: '2', time: '10:30', available: true },
    { id: '3', time: '14:00', available: false },
    { id: '4', time: '15:30', available: true },
    { id: '5', time: '17:00', available: true }
  ],
  '2024-01-16': [
    { id: '6', time: '09:00', available: true },
    { id: '7', time: '11:00', available: true },
    { id: '8', time: '13:30', available: true },
    { id: '9', time: '15:00', available: false },
    { id: '10', time: '16:30', available: true }
  ],
  '2024-01-17': [
    { id: '11', time: '08:30', available: true },
    { id: '12', time: '10:00', available: true },
    { id: '13', time: '14:30', available: true },
    { id: '14', time: '16:00', available: true }
  ]
};

export function ConsultationBookingSystem({
  reviewer,
  onBookConsultation,
  onCancel,
  className
}: ConsultationBookingSystemProps) {
  const [currentStep, setCurrentStep] = useState<BookingStep>('type');
  const [booking, setBooking] = useState<Partial<ConsultationBooking>>({
    reviewerId: reviewer.id,
    duration: 60,
    clientInfo: {
      name: '',
      email: '',
      phone: '',
      consultationTopic: '',
      backgroundInfo: '',
      urgencyLevel: 'medium'
    }
  });
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const steps: { key: BookingStep; title: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'type', title: 'Consultation Type', icon: MessageSquare },
    { key: 'schedule', title: 'Date & Time', icon: Calendar },
    { key: 'details', title: 'Your Information', icon: User },
    { key: 'review', title: 'Review & Pay', icon: CheckCircle }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  useEffect(() => {
    if (selectedDate && selectedDate in SAMPLE_AVAILABILITY) {
      setAvailableSlots(
        SAMPLE_AVAILABILITY[
          selectedDate as keyof typeof SAMPLE_AVAILABILITY
        ]
      );
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate]);

  const calculateTotalCost = () => {
    if (!booking.consultationType || !booking.duration || !reviewer.hourly_rate) return 0;

    const consultationType = CONSULTATION_TYPES.find(t => t.id === booking.consultationType);
    const baseRate = reviewer.hourly_rate;
    const multiplier = consultationType?.priceMultiplier || 1;
    const hours = booking.duration / 60;

    return Math.round(baseRate * hours * multiplier);
  };

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].key);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].key);
    }
  };

  const handleBooking = async () => {
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (
      !booking.consultationType ||
      !booking.date ||
      !booking.time ||
      !booking.duration ||
      !booking.clientInfo
    ) {
      console.error('Missing required booking fields');
      return;
    }

    const finalBooking: ConsultationBooking = {
      reviewerId: booking.reviewerId!,
      consultationType: booking.consultationType,
      date: booking.date,
      time: booking.time,
      duration: booking.duration,
      clientInfo: booking.clientInfo,
      specialRequests: booking.specialRequests,
      totalCost: calculateTotalCost()
    };

    onBookConsultation(finalBooking);
    setCurrentStep('confirmation');
    setIsLoading(false);
  };

  const getNextWeekDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        display: date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        }),
        dayName: date.toLocaleDateString('en-US', { weekday: 'long' })
      });
    }

    return dates;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'type':
        return (
          <motion.div
            initial={{  opacity: 0, x: 20  }}
            animate={{  opacity: 1, x: 0  }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-2">Choose Consultation Type</h3>
              <p className="text-muted-foreground">
                Select the format that works best for your legal consultation needs
              </p>
            </div>

            <RadioGroup
              value={booking.consultationType}
              onValueChange={(value: 'phone' | 'video' | 'in_person') =>
                setBooking(prev => ({ ...prev, consultationType: value }))
              }
              className="space-y-4"
            >
              {CONSULTATION_TYPES.map(type => {
                const Icon = type.icon;
                const isSelected = booking.consultationType === type.id;

                return (
                  <div key={type.id} className="relative">
                    <RadioGroupItem value={type.id} id={type.id} className="sr-only" />
                    <label
                      htmlFor={type.id}
                      className={cn(
                        'block p-6 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300',
                        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          'w-12 h-12 rounded-full flex items-center justify-center',
                          isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                        )}>
                          <Icon className="h-6 w-6" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{type.name}</h4>
                            {reviewer.hourly_rate && (
                              <Badge variant="outline">
                                ${Math.round(reviewer.hourly_rate * type.priceMultiplier)}/hour
                              </Badge>
                            )}
                          </div>

                          <p className="text-muted-foreground mb-3">{type.description}</p>

                          <div className="space-y-2">
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-muted-foreground">Available durations:</span>
                              <div className="flex gap-2">
                                {type.duration.map(duration => (
                                  <Badge key={duration} variant="secondary" className="text-xs">
                                    {duration} min
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <span className="text-sm text-muted-foreground">Includes:</span>
                              <ul className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                {type.features.map(feature => (
                                  <li key={feature} className="text-sm text-muted-foreground">
                                    • {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="absolute top-4 right-4">
                          <CheckCircle className="h-6 w-6 text-blue-500" />
                        </div>
                      )}
                    </label>
                  </div>
                );
              })}
            </RadioGroup>

            {booking.consultationType && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Duration Options</p>
                      <div className="flex flex-wrap justify-center gap-1 mt-1">
                        {CONSULTATION_TYPES.find(t => t.id === booking.consultationType)?.duration.map(duration => (
                          <Button
                            key={duration}
                            size="sm"
                            variant={booking.duration === duration ? 'default' : 'outline'}
                            onClick={() => setBooking(prev => ({ ...prev, duration }))}
                            className="text-xs h-7"
                          >
                            {duration}min
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Hourly Rate</p>
                      <p className="font-semibold">
                        ${Math.round((reviewer.hourly_rate || 0) * (CONSULTATION_TYPES.find(t => t.id === booking.consultationType)?.priceMultiplier || 1))}/hour
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Total Cost</p>
                      <p className="font-bold text-lg">${calculateTotalCost()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        );

      case 'schedule':
        return (
          <motion.div
            initial={{  opacity: 0, x: 20  }}
            animate={{  opacity: 1, x: 0  }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-2">Select Date & Time</h3>
              <p className="text-muted-foreground">
                Choose a convenient time slot for your consultation with {reviewer.full_name}
              </p>
            </div>

            {/* Date Selection */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Available Dates</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {getNextWeekDates().map(dateInfo => (
                  <Button
                    key={dateInfo.date}
                    variant={selectedDate === dateInfo.date ? 'default' : 'outline'}
                    onClick={() => setSelectedDate(dateInfo.date)}
                    className="h-auto p-3 flex flex-col gap-1"
                  >
                    <span className="font-semibold">{dateInfo.display.split(',')[0]}</span>
                    <span className="text-xs opacity-75">{dateInfo.display.split(' ').slice(-2).join(' ')}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <motion.div
                initial={{  opacity: 0, y: 20  }}
                animate={{  opacity: 1, y: 0  }}
                className="space-y-4"
              >
                <Label className="text-base font-medium">Available Times</Label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {availableSlots.map(slot => (
                    <Button
                      key={slot.id}
                      variant={booking.time === slot.time ? 'default' : 'outline'}
                      disabled={!slot.available}
                      onClick={() => setBooking(prev => ({ ...prev, time: slot.time, date: selectedDate }))}
                      className="h-auto p-3 flex flex-col gap-1"
                    >
                      <span className="font-semibold">{slot.time}</span>
                      {!slot.available && (
                        <span className="text-xs text-red-500">Booked</span>
                      )}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}

            {booking.date && booking.time && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Selected Time</AlertTitle>
                <AlertDescription className="text-green-700">
                  {booking.consultationType} consultation on {new Date(booking.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} at {booking.time} ({booking.duration} minutes) - ${calculateTotalCost()}
                </AlertDescription>
              </Alert>
            )}
          </motion.div>
        );

      case 'details':
        return (
          <motion.div
            initial={{  opacity: 0, x: 20  }}
            animate={{  opacity: 1, x: 0  }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-2">Your Information</h3>
              <p className="text-muted-foreground">
                Help us prepare for your consultation by sharing some background information
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={booking.clientInfo?.name || ''}
                    onChange={(e) => setBooking(prev => ({
                      ...prev,
                      clientInfo: { ...prev.clientInfo, name: e.target.value }
                    }))}
                    placeholder="John Smith"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={booking.clientInfo?.email || ''}
                    onChange={(e) => setBooking(prev => ({
                      ...prev,
                      clientInfo: { ...prev.clientInfo, email: e.target.value }
                    }))}
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={booking.clientInfo?.phone || ''}
                    onChange={(e) => setBooking(prev => ({
                      ...prev,
                      clientInfo: { ...prev.clientInfo, phone: e.target.value }
                    }))}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="urgency">Urgency Level</Label>
                  <Select
                    value={booking.clientInfo?.urgencyLevel}
                    onValueChange={(value: 'low' | 'medium' | 'high') =>
                      setBooking(prev => ({
                        ...prev,
                        clientInfo: { ...prev.clientInfo, urgencyLevel: value }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - General consultation</SelectItem>
                      <SelectItem value="medium">Medium - Important matter</SelectItem>
                      <SelectItem value="high">High - Urgent legal issue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Consultation Topic *</Label>
                  <Textarea
                    id="topic"
                    value={booking.clientInfo?.consultationTopic || ''}
                    onChange={(e) => setBooking(prev => ({
                      ...prev,
                      clientInfo: { ...prev.clientInfo, consultationTopic: e.target.value }
                    }))}
                    placeholder="Brief description of what you'd like to discuss..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="background">Background Information</Label>
                  <Textarea
                    id="background"
                    value={booking.clientInfo?.backgroundInfo || ''}
                    onChange={(e) => setBooking(prev => ({
                      ...prev,
                      clientInfo: { ...prev.clientInfo, backgroundInfo: e.target.value }
                    }))}
                    placeholder="Any additional context that would help prepare for our discussion..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requests">Special Requests</Label>
                  <Textarea
                    id="requests"
                    value={booking.specialRequests || ''}
                    onChange={(e) => setBooking(prev => ({ ...prev, specialRequests: e.target.value }))}
                    placeholder="Any special accommodations or requests..."
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'review':
        return (
          <motion.div
            initial={{  opacity: 0, x: 20  }}
            animate={{  opacity: 1, x: 0  }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-2">Review & Confirm</h3>
              <p className="text-muted-foreground">
                Please review your consultation details before confirming your booking
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Attorney Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Attorney</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={reviewer.profile_image_url} />
                      <AvatarFallback>
                        {reviewer.full_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h4 className="font-semibold">{reviewer.full_name}</h4>
                      <p className="text-muted-foreground">{reviewer.professional_title}</p>
                      {reviewer.law_firm_name && (
                        <p className="text-sm text-muted-foreground">{reviewer.law_firm_name}</p>
                      )}
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm">4.9 (127 reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span>{reviewer.experience_years} years experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>{reviewer.specializations?.map(s => s.name).join(', ')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Booking Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Consultation Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <Badge variant="outline">
                        {CONSULTATION_TYPES.find(t => t.id === booking.consultationType)?.name}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">
                        {booking.date && new Date(booking.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="font-medium">{booking.time}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{booking.duration} minutes</span>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between text-lg font-semibold">
                      <span>Total Cost:</span>
                      <span>${calculateTotalCost()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Client Information Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Name:</strong> {booking.clientInfo?.name}</div>
                  <div><strong>Email:</strong> {booking.clientInfo?.email}</div>
                  <div><strong>Phone:</strong> {booking.clientInfo?.phone}</div>
                  <div><strong>Urgency:</strong> {booking.clientInfo?.urgencyLevel}</div>
                </div>

                <Separator className="my-3" />

                <div>
                  <strong>Consultation Topic:</strong>
                  <p className="text-muted-foreground mt-1">{booking.clientInfo?.consultationTopic}</p>
                </div>

                {booking.clientInfo?.backgroundInfo && (
                  <div>
                    <strong>Background:</strong>
                    <p className="text-muted-foreground mt-1">{booking.clientInfo.backgroundInfo}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">What happens next?</AlertTitle>
              <AlertDescription className="text-blue-700">
                After confirming your booking, you'll receive a confirmation email with meeting details and preparation instructions.
                The attorney will also receive your consultation information to prepare for your session.
              </AlertDescription>
            </Alert>
          </motion.div>
        );

      case 'confirmation':
        return (
          <motion.div
            initial={{  opacity: 0, scale: 0.9  }}
            animate={{  opacity: 1, scale: 1  }}
            className="text-center space-y-6 py-8"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">Consultation Booked!</h3>
              <p className="text-muted-foreground">
                Your consultation with {reviewer.full_name} has been confirmed.
              </p>
            </div>

            <Card className="max-w-md mx-auto">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Date & Time:</span>
                  <span className="font-medium">
                    {booking.date && new Date(booking.date).toLocaleDateString()} at {booking.time}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium">
                    {CONSULTATION_TYPES.find(t => t.id === booking.consultationType)?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{booking.duration} minutes</span>
                </div>
              </CardContent>
            </Card>

            <Alert className="max-w-md mx-auto">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Confirmation details have been sent to {booking.clientInfo?.email}
              </AlertDescription>
            </Alert>

            <div className="flex gap-4 justify-center">
              <Button onClick={onCancel}>Done</Button>
              <Button variant="outline">Add to Calendar</Button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 'type':
        return !!booking.consultationType && !!booking.duration;
      case 'schedule':
        return !!booking.date && !!booking.time;
      case 'details':
        return !!(booking.clientInfo?.name && booking.clientInfo?.email && booking.clientInfo?.phone && booking.clientInfo?.consultationTopic);
      case 'review':
        return true;
      default:
        return false;
    }
  };

  if (currentStep === 'confirmation') {
    return (
      <div className={cn('max-w-2xl mx-auto', className)}>
        {renderStepContent()}
      </div>
    );
  }

  return (
    <motion.div
      initial={{  opacity: 0, y: 20  }}
      animate={{  opacity: 1, y: 0  }}
      className={cn('max-w-4xl mx-auto', className)}
    >
      <Card className="border-2">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-2xl font-bold">Book Legal Consultation</CardTitle>
              <p className="text-muted-foreground">Schedule a consultation with {reviewer.full_name}</p>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              Step {currentStepIndex + 1} of {steps.length}
            </Badge>
          </div>

          <div className="space-y-4">
            <Progress value={progress} className="h-2" />

            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div key={step.key} className="flex flex-col items-center flex-1">
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors',
                      isCompleted ? 'bg-green-500 text-white' :
                      isCurrent ? 'bg-blue-500 text-white' :
                      'bg-gray-200 text-gray-500'
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={cn(
                      'text-xs text-center font-medium',
                      (isCompleted || isCurrent) ? 'text-gray-900' : 'text-gray-500'
                    )}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{  opacity: 0, x: 20  }}
              animate={{  opacity: 1, x: 0  }}
              exit={{  opacity: 0, x: -20  }}
              transition={{  duration: 0.2  }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </CardContent>

        <div className="p-6 pt-0">
          <Separator className="mb-6" />

          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              {currentStepIndex > 0 && (
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>

            <div className="flex gap-3 items-center">
              {booking.consultationType && booking.duration && (
                <span className="text-sm text-muted-foreground">
                  Total: <span className="font-semibold">${calculateTotalCost()}</span>
                </span>
              )}

              {currentStep !== 'review' ? (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleBooking}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <>
                      <Timer className="h-4 w-4 mr-2 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Confirm & Pay ${calculateTotalCost()}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
