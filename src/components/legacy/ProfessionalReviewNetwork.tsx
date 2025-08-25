import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Calendar, Clock, MapPin, Star, Users, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { WillData } from '@/types/will';
import { 
  ProfessionalProfile, 
  ReviewRequest, 
  ConsultationOffer, 
  NotaryMatch, 
  ReviewFeedback,
  professionalNetwork,
  ReviewPriority,
  ProfessionalType
} from '@/lib/professional-review-network';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { EnhancedTrustSeal, TrustSealLevel, ProfessionalReview } from '@/components/trust/EnhancedTrustSeal';
import { professionalTrustIntegration, TrustSealUpgrade } from '@/lib/professional-trust-integration';
import { toast } from 'sonner';

interface ProfessionalReviewNetworkProps {
  willData: WillData;
  jurisdiction: string;
  onReviewComplete?: (feedback: ReviewFeedback) => void;
  currentTrustLevel?: TrustSealLevel;
  professionalReviews?: ProfessionalReview[];
  onTrustSealUpgrade?: (upgrade: TrustSealUpgrade) => void;
  validationScore?: number;
}

export const ProfessionalReviewNetwork: React.FC<ProfessionalReviewNetworkProps> = ({
  willData,
  jurisdiction,
  onReviewComplete,
  currentTrustLevel = 'basic',
  professionalReviews = [],
  onTrustSealUpgrade,
  validationScore = 0
}) => {
  const [activeTab, setActiveTab] = useState('attorney');
  const [reviewRequest, setReviewRequest] = useState<ReviewRequest | null>(null);
  const [consultationOffers, setConsultationOffers] = useState<ConsultationOffer[]>([]);
  const [notaryMatches, setNotaryMatches] = useState<NotaryMatch[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<ProfessionalProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reviewFeedback, setReviewFeedback] = useState<ReviewFeedback | null>(null);

  // Attorney Review Tab
  const [attorneyForm, setAttorneyForm] = useState({
    priority: 'standard' as ReviewPriority,
    specificConcerns: '',
    budgetMin: 200,
    budgetMax: 800,
    timeline: 'within_week',
    language: 'en'
  });

  // Estate Planner Tab
  const [plannerLocation, setPlannerLocation] = useState('');
  
  // Notary Tab
  const [notaryForm, setNotaryForm] = useState({
    location: '',
    serviceType: 'will_witnessing',
    language: 'en',
    timeframe: 'within_week'
  });

  const handleRequestAttorneyReview = async () => {
    setIsLoading(true);
    try {
      const request = await professionalNetwork.requestAttorneyReview(willData, jurisdiction, {
        priority: attorneyForm.priority,
        specificConcerns: attorneyForm.specificConcerns.split(',').map(s => s.trim()).filter(Boolean),
        budget: { 
          min: attorneyForm.budgetMin, 
          max: attorneyForm.budgetMax, 
          currency: 'EUR' 
        },
        timeline: attorneyForm.timeline,
        preferredLanguage: attorneyForm.language
      });
      
      setReviewRequest(request);
      
      // If assigned, simulate review process
      if (request.status === 'assigned') {
        setTimeout(async () => {
          const feedback = await professionalNetwork.submitForReview(request);
          setReviewFeedback(feedback);
          
          // Process Trust Seal upgrade after review
          try {
            const upgrade = await professionalTrustIntegration.processReviewUpgrade(
              request,
              feedback,
              currentTrustLevel,
              professionalReviews
            );
            
            if (upgrade) {
              const notification = professionalTrustIntegration.createUpgradeNotification(upgrade);
              toast.success(notification.title, {
                description: notification.message,
                duration: 8000,
              });
              onTrustSealUpgrade?.(upgrade);
            }
          } catch (error) {
            console.error('Failed to process trust seal upgrade:', error);
          }
          
          onReviewComplete?.(feedback);
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to request attorney review:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetConsultationOffers = async () => {
    setIsLoading(true);
    try {
      const offers = await professionalNetwork.getEstateplannerConsultation(willData);
      setConsultationOffers(offers);
    } catch (error) {
      console.error('Failed to get consultation offers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindNotaries = async () => {
    setIsLoading(true);
    try {
      const matches = await professionalNetwork.connectWithNotary(notaryForm.location, willData, {
        serviceType: notaryForm.serviceType as any,
        language: notaryForm.language,
        timeframe: notaryForm.timeframe
      });
      setNotaryMatches(matches);
    } catch (error) {
      console.error('Failed to find notaries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderProfessionalCard = (professional: ProfessionalProfile, onSelect?: () => void) => (
    <Card key={professional.id} className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={professional.profileImage} />
            <AvatarFallback>{professional.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{professional.name}</h3>
                <p className="text-sm text-gray-600">{professional.title} at {professional.firm}</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">{professional.rating}</span>
                  <span className="ml-1 text-sm text-gray-500">({professional.reviewCount})</span>
                </div>
                <Badge variant={
                  professional.availability === 'immediate' ? 'default' :
                  professional.availability === 'within_24h' ? 'secondary' : 
                  'outline'
                }>
                  {professional.availability.replace('_', ' ')}
                </Badge>
              </div>
            </div>
            
            <div className="mt-3 space-y-2">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {professional.location.city}, {professional.location.country}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {professional.languages.join(', ')}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {professional.specializations.slice(0, 3).map(spec => (
                  <Badge key={spec} variant="outline" className="text-xs">
                    {spec.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
              
              <p className="text-sm text-gray-700 line-clamp-2">{professional.bio}</p>
              
              <div className="flex items-center justify-between pt-2">
                <span className="text-lg font-semibold">€{professional.hourlyRate}/hour</span>
                {onSelect && (
                  <Button onClick={onSelect} variant="outline" size="sm">
                    Select Professional
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderReviewStatus = () => {
    if (!reviewRequest) return null;

    const statusIcons = {
      pending: <Clock className="h-5 w-5 text-yellow-500" />,
      assigned: <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />,
      in_review: <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />,
      completed: <CheckCircle className="h-5 w-5 text-green-500" />,
      requires_revision: <XCircle className="h-5 w-5 text-red-500" />
    };

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {statusIcons[reviewRequest.status]}
            <span>Review Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Status:</span>
              <Badge variant={reviewRequest.status === 'completed' ? 'default' : 'secondary'}>
                {reviewRequest.status.replace('_', ' ')}
              </Badge>
            </div>
            
            {reviewRequest.estimatedCompletion && (
              <div className="flex justify-between items-center">
                <span className="font-medium">Estimated Completion:</span>
                <span>{reviewRequest.estimatedCompletion.toLocaleDateString()}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Priority:</span>
              <Badge variant="outline">{reviewRequest.priority}</Badge>
            </div>
            
            {reviewRequest.status === 'in_review' || reviewRequest.status === 'assigned' ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Review Progress</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="w-full" />
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderReviewFeedback = () => {
    if (!reviewFeedback) return null;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Professional Review Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Scores */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{reviewFeedback.overall.legalCompliance}%</div>
              <div className="text-sm text-gray-600">Legal Compliance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{reviewFeedback.overall.clarity}%</div>
              <div className="text-sm text-gray-600">Clarity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{reviewFeedback.overall.completeness}%</div>
              <div className="text-sm text-gray-600">Completeness</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{reviewFeedback.overall.recommendations}%</div>
              <div className="text-sm text-gray-600">Recommendations</div>
            </div>
          </div>

          <Separator />

          {/* Summary */}
          <div>
            <h4 className="font-semibold mb-2">Summary</h4>
            <p className="text-gray-700">{reviewFeedback.summary}</p>
          </div>

          {/* Specific Issues */}
          {reviewFeedback.specificIssues.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Issues to Address</h4>
              <div className="space-y-3">
                {reviewFeedback.specificIssues.map((issue, index) => (
                  <Alert key={index} variant={issue.severity === 'critical' ? 'destructive' : 'default'}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <span className="font-medium">{issue.category}</span>
                          <Badge variant={
                            issue.severity === 'critical' ? 'destructive' :
                            issue.severity === 'high' ? 'default' :
                            issue.severity === 'medium' ? 'secondary' : 'outline'
                          }>
                            {issue.severity}
                          </Badge>
                        </div>
                        <p className="text-sm">{issue.description}</p>
                        <p className="text-sm font-medium">Recommendation: {issue.recommendation}</p>
                        <p className="text-xs text-gray-500">Estimated fix time: {issue.estimated_fix_time}</p>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div>
            <h4 className="font-semibold mb-2">Next Steps</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              {reviewFeedback.nextSteps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Professional Review Network</h2>
        <p className="text-gray-600">
          Connect with legal professionals for expert review and validation of your will.
        </p>
      </div>

      {/* Current Trust Seal Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <EnhancedTrustSeal
            level={currentTrustLevel}
            jurisdiction={jurisdiction}
            lastUpdated={new Date()}
            professionalReviews={professionalReviews}
            validationScore={validationScore}
            className="h-fit"
          />
          
          {professionalReviews.length === 0 && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium mb-1">Enhance Your Trust Seal</div>
                <div className="text-sm">
                  Get professional review to upgrade your will's trust seal and enhance its legal credibility.
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          {renderReviewStatus()}
          {renderReviewFeedback()}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="attorney">Attorney Review</TabsTrigger>
          <TabsTrigger value="planner">Estate Planning</TabsTrigger>
          <TabsTrigger value="notary">Notary Services</TabsTrigger>
        </TabsList>

        <TabsContent value="attorney" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Request Attorney Review</CardTitle>
              <CardDescription>
                Get professional legal review of your will from qualified attorneys.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Review Priority</Label>
                  <Select value={attorneyForm.priority} onValueChange={(value) => 
                    setAttorneyForm(prev => ({ ...prev, priority: value as ReviewPriority }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard (7 days) - €200-800</SelectItem>
                      <SelectItem value="urgent">Urgent (3 days) - €400-1200</SelectItem>
                      <SelectItem value="express">Express (24 hours) - €800-2000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="language">Preferred Language</Label>
                  <Select value={attorneyForm.language} onValueChange={(value) => 
                    setAttorneyForm(prev => ({ ...prev, language: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="cs">Czech</SelectItem>
                      <SelectItem value="sk">Slovak</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget-min">Budget Range (EUR)</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={attorneyForm.budgetMin}
                      onChange={(e) => setAttorneyForm(prev => ({ ...prev, budgetMin: parseInt(e.target.value) }))}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={attorneyForm.budgetMax}
                      onChange={(e) => setAttorneyForm(prev => ({ ...prev, budgetMax: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="timeline">Timeline</Label>
                  <Select value={attorneyForm.timeline} onValueChange={(value) => 
                    setAttorneyForm(prev => ({ ...prev, timeline: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="within_week">Within a week</SelectItem>
                      <SelectItem value="within_month">Within a month</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="concerns">Specific Concerns (comma-separated)</Label>
                <Textarea
                  placeholder="e.g., asset distribution, tax implications, guardianship arrangements"
                  value={attorneyForm.specificConcerns}
                  onChange={(e) => setAttorneyForm(prev => ({ ...prev, specificConcerns: e.target.value }))}
                />
              </div>

              <Button 
                onClick={handleRequestAttorneyReview} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Processing...' : 'Request Attorney Review'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planner" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estate Planning Consultation</CardTitle>
              <CardDescription>
                Get comprehensive estate planning advice from certified planners.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleGetConsultationOffers} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Finding Planners...' : 'Get Consultation Offers'}
              </Button>
            </CardContent>
          </Card>

          {consultationOffers.map(offer => (
            <Card key={offer.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>Estate Planning Proposal</span>
                  <Badge variant="outline">{offer.willComplexityAssessment.complexity}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm font-medium">Estimated Hours</span>
                    <div className="text-2xl font-bold">{offer.willComplexityAssessment.estimatedHours}h</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Total Estimate</span>
                    <div className="text-2xl font-bold">
                      €{offer.totalEstimate.min}-{offer.totalEstimate.max}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Timeline</span>
                    <div className="text-lg font-semibold">{offer.proposedTimeline}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Key Issues Identified</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {offer.willComplexityAssessment.keyIssues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Recommended Services</h4>
                  <div className="space-y-2">
                    {offer.recommendedServices.map((service, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium">{service.service}</span>
                          <p className="text-sm text-gray-600">{service.description}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={
                            service.priority === 'essential' ? 'default' :
                            service.priority === 'recommended' ? 'secondary' : 'outline'
                          }>
                            {service.priority}
                          </Badge>
                          <div className="text-sm font-medium">€{service.estimatedCost}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-sm text-gray-600">
                    Valid until: {offer.validUntil.toLocaleDateString()}
                  </span>
                  <Button>Accept Proposal</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="notary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Find Notary Services</CardTitle>
              <CardDescription>
                Connect with certified notaries for will witnessing and document certification.
                Including integration with brnoadvokati.cz for Czech and Slovak services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    placeholder="e.g., Brno, Prague, Bratislava"
                    value={notaryForm.location}
                    onChange={(e) => setNotaryForm(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="service-type">Service Type</Label>
                  <Select value={notaryForm.serviceType} onValueChange={(value) => 
                    setNotaryForm(prev => ({ ...prev, serviceType: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="will_witnessing">Will Witnessing</SelectItem>
                      <SelectItem value="document_certification">Document Certification</SelectItem>
                      <SelectItem value="full_notarization">Full Notarization</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="notary-language">Language</Label>
                  <Select value={notaryForm.language} onValueChange={(value) => 
                    setNotaryForm(prev => ({ ...prev, language: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="cs">Czech</SelectItem>
                      <SelectItem value="sk">Slovak</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timeframe">Timeframe</Label>
                  <Select value={notaryForm.timeframe} onValueChange={(value) => 
                    setNotaryForm(prev => ({ ...prev, timeframe: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="within_week">Within a week</SelectItem>
                      <SelectItem value="within_month">Within a month</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleFindNotaries} 
                disabled={isLoading || !notaryForm.location}
                className="w-full"
              >
                {isLoading ? 'Finding Notaries...' : 'Find Notary Services'}
              </Button>
            </CardContent>
          </Card>

          {notaryMatches.map(match => (
            <Card key={match.professional.id}>
              <CardContent className="p-0">
                {renderProfessionalCard(match.professional)}
                
                <div className="px-6 pb-6 space-y-4">
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold mb-3">Available Services</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {match.services.map((service, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm">{service.service}</span>
                          <div className="text-right">
                            <div className="text-sm font-medium">€{service.price}</div>
                            <div className="text-xs text-gray-500">{service.duration}min</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Available Appointments</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {match.availableSlots.slice(0, 4).map((slot, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border rounded">
                          <div>
                            <div className="text-sm font-medium">
                              {slot.date.toLocaleDateString()} at {slot.time}
                            </div>
                            <div className="text-xs text-gray-500">
                              {slot.type} • {slot.duration}min
                            </div>
                          </div>
                          <Button size="sm" variant="outline">Book</Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {match.distanceFromUser && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      {match.distanceFromUser.toFixed(1)} km away
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
        </div>
      </div>
    </div>
  );
};