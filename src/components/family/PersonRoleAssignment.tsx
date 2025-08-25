import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  X,
  Crown,
  Shield,
  Heart,
  FileText,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  Save
} from 'lucide-react';
import type { WillData } from '@/types/will';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  dateOfBirth?: string;
  roles: {
    isHeir?: boolean;
    heirPercentage?: number;
    isGuardian?: boolean;
    isExecutor?: boolean;
    hasLegacyMessages?: boolean;
    isEmergencyContact?: boolean;
  };
  status: 'complete' | 'partial' | 'missing_info';
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

interface PersonRoleAssignmentProps {
  person: FamilyMember | null;
  onClose: () => void;
  onRoleUpdate: (personId: string, newRoles: FamilyMember['roles']) => void;
  willData?: WillData;
}

export const PersonRoleAssignment: React.FC<PersonRoleAssignmentProps> = ({
  person,
  onClose,
  onRoleUpdate,
  willData
}) => {
  const [roles, setRoles] = useState<FamilyMember['roles']>({});
  const [heirPercentage, setHeirPercentage] = useState(0);
  const [legacyMessage, setLegacyMessage] = useState('');
  const [guardianNotes, setGuardianNotes] = useState('');
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (person) {
      setRoles(person.roles || {});
      setHeirPercentage(person.roles.heirPercentage || 0);
      setContactInfo(person.contactInfo || { email: '', phone: '', address: '' });
    }
  }, [person]);

  if (!person) return null;

  const handleRoleToggle = (role: keyof FamilyMember['roles'], value: boolean) => {
    setRoles(prev => ({
      ...prev,
      [role]: value,
      ...(role === 'isHeir' && value && { heirPercentage: heirPercentage || 10 })
    }));
  };

  const handleSave = () => {
    const updatedRoles = {
      ...roles,
      heirPercentage: roles.isHeir ? heirPercentage : undefined
    };

    onRoleUpdate(person.id, updatedRoles);
    onClose();
  };

  const getTotalInheritanceAssigned = () => {
    if (!willData?.beneficiaries) return 0;
    return willData.beneficiaries
      .filter(b => b.id !== person.id)
      .reduce((total, beneficiary) => total + (beneficiary.percentage || 0), 0);
  };

  const remainingPercentage = 100 - getTotalInheritanceAssigned();
  const maxAllowedPercentage = remainingPercentage + (roles.isHeir ? heirPercentage : 0);

  const getRecommendedRoles = () => {
    const recommendations = [];

    // Inheritance recommendations
    if (person.relationship === 'spouse' && !roles.isHeir) {
      recommendations.push({
        role: 'heir',
        reason: 'Spouse typically inherits a significant portion of the estate',
        suggested: true
      });
    }

    if (person.relationship === 'child' && !roles.isHeir) {
      recommendations.push({
        role: 'heir',
        reason: 'Children are often primary beneficiaries',
        suggested: true
      });
    }

    // Executor recommendations
    if (person.relationship === 'spouse' && !roles.isExecutor) {
      recommendations.push({
        role: 'executor',
        reason: 'Spouse is often the most trusted person to manage the estate',
        suggested: true
      });
    }

    // Guardian recommendations
    if (person.relationship === 'sibling' && !roles.isGuardian) {
      const hasMinorChildren = willData?.beneficiaries?.some(b =>
        b.relationship === 'child' && new Date().getFullYear() - new Date(b.dateOfBirth || '').getFullYear() < 18
      );

      if (hasMinorChildren) {
        recommendations.push({
          role: 'guardian',
          reason: 'Siblings often serve as guardians for minor children',
          suggested: true
        });
      }
    }

    return recommendations;
  };

  const recommendations = getRecommendedRoles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{person.name}</CardTitle>
            <p className="text-gray-600 capitalize">{person.relationship}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Current Status */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Current Status:</span>
            <Badge variant={
              person.status === 'complete' ? 'default' :
              person.status === 'partial' ? 'secondary' :
              'destructive'
            }>
              {person.status === 'complete' && <CheckCircle className="h-3 w-3 mr-1" />}
              {person.status !== 'complete' && <AlertCircle className="h-3 w-3 mr-1" />}
              {person.status.replace('_', ' ')}
            </Badge>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium mb-2">Recommended roles for this family member:</div>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {recommendations.map((rec, index) => (
                    <li key={index}>
                      <span className="font-medium capitalize">{rec.role}:</span> {rec.reason}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Role Assignment */}
            <div className="space-y-6">
              {/* Inheritance Role */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <FileText className="h-5 w-5 mr-2 text-green-600" />
                    Inheritance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={roles.isHeir || false}
                      onCheckedChange={(checked) => handleRoleToggle('isHeir', checked)}
                      id="heir-toggle"
                    />
                    <Label htmlFor="heir-toggle">Include as heir in will</Label>
                  </div>

                  {roles.isHeir && (
                    <div className="space-y-3 pl-6 border-l-2 border-green-200">
                      <div>
                        <Label htmlFor="heir-percentage">Inheritance Percentage</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="heir-percentage"
                            type="number"
                            min="0"
                            max={maxAllowedPercentage}
                            value={heirPercentage}
                            onChange={(e) => setHeirPercentage(Number(e.target.value))}
                            className="w-20"
                          />
                          <span>%</span>
                          <span className="text-sm text-gray-600">
                            (Available: {maxAllowedPercentage}%)
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-600">
                        This person will inherit {heirPercentage}% of your estate
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Executor Role */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Crown className="h-5 w-5 mr-2 text-purple-600" />
                    Executor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={roles.isExecutor || false}
                      onCheckedChange={(checked) => handleRoleToggle('isExecutor', checked)}
                      id="executor-toggle"
                    />
                    <Label htmlFor="executor-toggle">Appoint as will executor</Label>
                  </div>

                  {roles.isExecutor && (
                    <div className="pl-6 border-l-2 border-purple-200">
                      <p className="text-sm text-gray-600">
                        This person will be responsible for managing your estate and ensuring
                        your will is carried out according to your wishes.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Guardian Role */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Shield className="h-5 w-5 mr-2 text-blue-600" />
                    Guardian
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={roles.isGuardian || false}
                      onCheckedChange={(checked) => handleRoleToggle('isGuardian', checked)}
                      id="guardian-toggle"
                    />
                    <Label htmlFor="guardian-toggle">Appoint as guardian for minor children</Label>
                  </div>

                  {roles.isGuardian && (
                    <div className="space-y-3 pl-6 border-l-2 border-blue-200">
                      <div>
                        <Label htmlFor="guardian-notes">Guardian Notes</Label>
                        <Textarea
                          id="guardian-notes"
                          placeholder="Special instructions for guardianship..."
                          value={guardianNotes}
                          onChange={(e) => setGuardianNotes(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <p className="text-sm text-gray-600">
                        This person will care for your minor children if something happens to you.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Additional Features */}
            <div className="space-y-6">
              {/* Legacy Messages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Heart className="h-5 w-5 mr-2 text-red-600" />
                    Legacy Messages
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={roles.hasLegacyMessages || false}
                      onCheckedChange={(checked) => handleRoleToggle('hasLegacyMessages', checked)}
                      id="legacy-toggle"
                    />
                    <Label htmlFor="legacy-toggle">Create legacy messages</Label>
                  </div>

                  {roles.hasLegacyMessages && (
                    <div className="space-y-3 pl-6 border-l-2 border-red-200">
                      <p className="text-sm text-gray-600">
                        Create personal messages, time capsules, and memory prompts for this person.
                      </p>
                      <Button variant="outline" size="sm">
                        <Heart className="h-4 w-4 mr-2" />
                        Create Legacy Message
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Phone className="h-5 w-5 mr-2 text-orange-600" />
                    Emergency Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={roles.isEmergencyContact || false}
                      onCheckedChange={(checked) => handleRoleToggle('isEmergencyContact', checked)}
                      id="emergency-toggle"
                    />
                    <Label htmlFor="emergency-toggle">Designate as emergency contact</Label>
                  </div>

                  {roles.isEmergencyContact && (
                    <div className="space-y-3 pl-6 border-l-2 border-orange-200">
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <Label htmlFor="contact-phone">Phone Number</Label>
                          <Input
                            id="contact-phone"
                            type="tel"
                            value={contactInfo.phone}
                            onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        <div>
                          <Label htmlFor="contact-email">Email Address</Label>
                          <Input
                            id="contact-email"
                            type="email"
                            value={contactInfo.email}
                            onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="email@example.com"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Mail className="h-5 w-5 mr-2 text-gray-600" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={contactInfo.address}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Full address..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <div className="space-x-2">
              <Button variant="outline">
                <Heart className="h-4 w-4 mr-2" />
                Create Time Capsule
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Roles
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
