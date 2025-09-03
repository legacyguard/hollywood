/**
 * Professional Network Launch Materials
 * Landing pages and marketing materials for attorney partnership program
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Shield,
  Users,
  TrendingUp,
  Star,
  CheckCircle,
  Award,
  DollarSign,
  Calendar,
  FileText,
  Scale,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  Clock,
  Target,
  Handshake
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfessionalNetworkLaunchProps {
  variant: 'attorney-landing' | 'client-marketplace' | 'partnership-overview';
}

// Attorney Partnership Landing Page
const AttorneyLandingPage: React.FC = () => {
  const [applicationForm, setApplicationForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    firm: '',
    barNumber: '',
    state: '',
    specializations: '',
    experience: '',
    motivation: ''
  });

  const benefits = [
    {
      icon: DollarSign,
      title: "Additional Revenue Stream",
      description: "Earn $150-$500 per document review with flexible scheduling",
      highlight: true
    },
    {
      icon: Users,
      title: "Quality Client Referrals",
      description: "Connect with pre-qualified families who value professional guidance"
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description: "Choose your availability and accept reviews that fit your schedule"
    },
    {
      icon: Shield,
      title: "Professional Platform",
      description: "Secure, compliant platform designed specifically for legal professionals"
    },
    {
      icon: TrendingUp,
      title: "Growing Market",
      description: "Join the fastest-growing family legacy planning platform"
    },
    {
      icon: Award,
      title: "Build Your Reputation",
      description: "Showcase your expertise and build a strong professional profile"
    }
  ];

  const process = [
    {
      step: 1,
      title: "Apply to Join",
      description: "Complete our application with your credentials and specializations",
      icon: FileText
    },
    {
      step: 2,
      title: "Verification Process",
      description: "We verify your bar admission and professional credentials",
      icon: Shield
    },
    {
      step: 3,
      title: "Platform Training",
      description: "Quick onboarding to our platform and review processes",
      icon: Target
    },
    {
      step: 4,
      title: "Start Reviewing",
      description: "Accept review requests and start earning immediately",
      icon: CheckCircle
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attorney application submitted:', applicationForm);
    // Handle application submission
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-blue-100 text-blue-800">
              <Scale className="h-3 w-3 mr-1" />
              Professional Partnership Program
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Join the Leading
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}Legal Network
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Partner with LegacyGuard to provide professional document reviews and legal guidance
              to families planning their legacy. Earn additional revenue while making a meaningful impact.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Briefcase className="h-5 w-5 mr-2" />
                Apply Now
              </Button>
              <Button size="lg" variant="outline">
                <Phone className="h-5 w-5 mr-2" />
                Schedule Call
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { number: "500+", label: "Partner Attorneys" },
              { number: "$350", label: "Avg. Review Fee" },
              { number: "10K+", label: "Reviews Completed" },
              { number: "98%", label: "Client Satisfaction" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-blue-600">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Join LegacyGuard's Network?
            </h2>
            <p className="text-xl text-gray-600">
              Discover the benefits of partnering with the leading family legacy platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={cn(
                  "h-full hover:shadow-lg transition-shadow",
                  benefit.highlight && "border-2 border-blue-500 bg-blue-50"
                )}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className={cn(
                        "p-3 rounded-full mr-4",
                        benefit.highlight
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-600"
                      )}>
                        <benefit.icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-gray-900">
                        {benefit.title}
                      </h3>
                    </div>
                    <p className="text-gray-600">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple Application Process
            </h2>
            <p className="text-xl text-gray-600">
              Get started in just 4 easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 mx-auto bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {step.step}
                  </div>
                  {index < process.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-blue-200 -z-10" />
                  )}
                </div>
                <div className="flex justify-center mb-4">
                  <step.icon className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Apply to Join Our Network
            </h2>
            <p className="text-xl text-gray-600">
              Complete the application below to get started
            </p>
          </div>

          <Card className="border-2 border-blue-200">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <Input
                      required
                      value={applicationForm.firstName}
                      onChange={(e) => setApplicationForm({...applicationForm, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <Input
                      required
                      value={applicationForm.lastName}
                      onChange={(e) => setApplicationForm({...applicationForm, lastName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      required
                      value={applicationForm.email}
                      onChange={(e) => setApplicationForm({...applicationForm, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      required
                      value={applicationForm.phone}
                      onChange={(e) => setApplicationForm({...applicationForm, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Law Firm/Practice *
                    </label>
                    <Input
                      required
                      value={applicationForm.firm}
                      onChange={(e) => setApplicationForm({...applicationForm, firm: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bar Number *
                    </label>
                    <Input
                      required
                      value={applicationForm.barNumber}
                      onChange={(e) => setApplicationForm({...applicationForm, barNumber: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specializations (comma-separated)
                  </label>
                  <Input
                    placeholder="Estate Planning, Family Law, Elder Law..."
                    value={applicationForm.specializations}
                    onChange={(e) => setApplicationForm({...applicationForm, specializations: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why do you want to join LegacyGuard's network?
                  </label>
                  <Textarea
                    rows={4}
                    value={applicationForm.motivation}
                    onChange={(e) => setApplicationForm({...applicationForm, motivation: e.target.value})}
                  />
                </div>

                <div className="flex justify-center">
                  <Button type="submit" size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
                    <FileText className="h-5 w-5 mr-2" />
                    Submit Application
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Join Our Network?
          </h2>
          <p className="text-xl mb-8">
            Start earning additional revenue while helping families secure their legacy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              <Mail className="h-5 w-5 mr-2" />
              Get More Information
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
              <Calendar className="h-5 w-5 mr-2" />
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

// Client Marketplace View
const ClientMarketplace: React.FC = () => {
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  const specializations = [
    'All Specializations',
    'Estate Planning',
    'Family Law',
    'Elder Law',
    'Tax Law',
    'Business Law'
  ];

  const attorneys = [
    {
      id: '1',
      name: 'Sarah Johnson, Esq.',
      firm: 'Johnson Estate Planning',
      specializations: ['Estate Planning', 'Elder Law'],
      location: 'San Francisco, CA',
      rating: 4.9,
      reviews: 127,
      hourlyRate: '$350',
      avatar: undefined,
      verified: true,
      responseTime: '< 2 hours',
      completedReviews: 245
    },
    {
      id: '2',
      name: 'Michael Chen, Esq.',
      firm: 'Chen Family Law Group',
      specializations: ['Family Law', 'Estate Planning'],
      location: 'Los Angeles, CA',
      rating: 4.8,
      reviews: 89,
      hourlyRate: '$275',
      avatar: undefined,
      verified: true,
      responseTime: '< 4 hours',
      completedReviews: 156
    },
    {
      id: '3',
      name: 'Jennifer Williams, Esq.',
      firm: 'Williams & Associates',
      specializations: ['Estate Planning', 'Tax Law'],
      location: 'New York, NY',
      rating: 4.9,
      reviews: 203,
      hourlyRate: '$425',
      avatar: undefined,
      verified: true,
      responseTime: '< 1 hour',
      completedReviews: 312
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Professional Legal Network
            </h1>
            <p className="text-xl text-gray-600">
              Connect with verified attorneys for professional document review and legal guidance
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Specialization:</label>
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {specializations.map((spec) => (
                  <option key={spec} value={spec.toLowerCase().replace(' ', '-')}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Location:</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Locations</option>
                <option value="california">California</option>
                <option value="new-york">New York</option>
                <option value="texas">Texas</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Attorney Cards */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attorneys.map((attorney, index) => (
              <motion.div
                key={attorney.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {attorney.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 flex items-center">
                            {attorney.name}
                            {attorney.verified && (
                              <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
                            )}
                          </h3>
                          <p className="text-sm text-gray-600">{attorney.firm}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          {attorney.hourlyRate}
                        </div>
                        <div className="text-xs text-gray-500">per review</div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {attorney.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        Responds {attorney.responseTime}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="h-4 w-4 mr-2 text-yellow-500" />
                        {attorney.rating} ({attorney.reviews} reviews)
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {attorney.specializations.map((spec) => (
                          <Badge key={spec} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-center text-sm text-gray-500 mb-4">
                      {attorney.completedReviews} completed reviews
                    </div>

                    <div className="flex space-x-2">
                      <Button className="flex-1" size="sm">
                        <Handshake className="h-4 w-4 mr-2" />
                        Request Review
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Main component that renders different variants
export const ProfessionalNetworkLaunch: React.FC<ProfessionalNetworkLaunchProps> = ({ variant }) => {
  switch (variant) {
    case 'attorney-landing':
      return <AttorneyLandingPage />;
    case 'client-marketplace':
      return <ClientMarketplace />;
    case 'partnership-overview':
      return <AttorneyLandingPage />; // Could be a separate component
    default:
      return <AttorneyLandingPage />;
  }
};
