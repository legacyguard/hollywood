import React, { useCallback, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import type { WillType } from './WillTypeSelector';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Icon } from '@/components/ui/icon-library';
import { FadeIn } from '@/components/motion/FadeIn';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { LiveWillPreview } from './LiveWillPreview';
import { SofiaCorrectnessCheck } from './SofiaCorrectnessCheck';
import { FocusModeWrapper } from './FocusModeWrapper';
import { FocusModeToggle } from './FocusModeToggle';
import { VaultAssetSelector } from './VaultAssetSelector';
import { useFocusMode } from '@/contexts/FocusModeContext';

// Types based on our database schema
export interface WillData {
  assets: {
    bankAccounts?: Array<{
      accountNumber: string;
      bank: string;
      type: 'checking' | 'investment' | 'savings';
    }>;
    investments?: Array<{
      accountType: string;
      company: string;
      value?: number;
    }>;
    personalProperty?: Array<{
      description: string;
      recipient?: string;
      value?: number;
    }>;
    realEstate?: Array<{
      address: string;
      description: string;
      value?: number;
    }>;
    vehicles?: Array<{
      description: string;
      make: string;
      model: string;
      value?: number;
      vin?: string;
      year: number;
    }>;
  };
  beneficiaries: Array<{
    conditions?: string;
    id: string;
    name: string;
    percentage: number;
    relationship:
      | 'charity'
      | 'child'
      | 'friend'
      | 'grandchild'
      | 'other'
      | 'parent'
      | 'sibling'
      | 'spouse';
    specificGifts?: string[];
  }>;
  completeness_score: number;
  executor_data: {
    backupExecutor?: {
      name: string;
      phone?: string;
      relationship: string;
    };
    executorPowers?: string[];
    primaryExecutor?: {
      name: string;
      phone?: string;
      relationship: string;
    };
  };
  family_protection_level: 'basic' | 'comprehensive' | 'premium' | 'standard';
  guardianship_data: {
    backupGuardian?: {
      name: string;
      relationship: string;
    };
    guardianInstructions?: string;
    minorChildren?: Array<{
      dateOfBirth: string;
      name: string;
    }>;
    primaryGuardian?: {
      name: string;
      relationship: string;
    };
  };
  legal_data: {
    jurisdiction?: string;
    notarization?: boolean;
    previousWills?: string;
    revocationClause?: boolean;
    witnessRequirements?: number;
  };

  // Additional properties for compatibility with main WillData interface
  review_eligibility: boolean;
  special_instructions: {
    charitableBequests?: Array<{
      amount: number;
      charity: string;
    }>;
    digitalAssets?: string;
    funeralWishes?: string;
    organDonation?: boolean;
    personalMessages?: Array<{
      message: string;
      recipient: string;
    }>;
    petCare?: string;
  };
  testator_data: {
    address?: string;
    citizenship?: string;
    dateOfBirth?: string;
    fullName?: string;
    maritalStatus?: 'divorced' | 'married' | 'single' | 'widowed';
  };
}

interface WillWizardProps {
  initialData?: null | WillData;
  onBack?: () => void;
  onClose: () => void;
  onComplete: (willData: WillData) => void;
  willType: WillType;
}

const STEPS = [
  { id: 'personal', title: 'Personal Info', description: 'Your details' },
  { id: 'beneficiaries', title: 'Beneficiaries', description: 'Who inherits' },
  { id: 'assets', title: 'Assets', description: 'What you own' },
  { id: 'executor', title: 'Executor', description: 'Who manages' },
  {
    id: 'guardianship',
    title: 'Guardianship',
    description: 'For minor children',
  },
  { id: 'wishes', title: 'Final Wishes', description: 'Special instructions' },
  {
    id: 'sofia_check',
    title: "Sofia's Check",
    description: 'Correctness review',
  },
  { id: 'review', title: 'Final Review', description: 'Confirm and generate' },
];

const _JURISDICTIONS = [
  { value: 'US-General', label: 'United States (General)' },
  { value: 'US-California', label: 'California, USA' },
  { value: 'US-Texas', label: 'Texas, USA' },
  { value: 'US-Florida', label: 'Florida, USA' },
  { value: 'US-NewYork', label: 'New York, USA' },
  { value: 'Slovakia', label: 'Slovakia' },
  { value: 'Czech-Republic', label: 'Czech Republic' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Australia', label: 'Australia' },
];

const RELATIONSHIPS = [
  { value: 'spouse', label: 'Spouse/Partner' },
  { value: 'child', label: 'Child' },
  { value: 'parent', label: 'Parent' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'grandchild', label: 'Grandchild' },
  { value: 'friend', label: 'Friend' },
  { value: 'charity', label: 'Charity/Organization' },
  { value: 'other', label: 'Other' },
];

export const WillWizard: React.FC<WillWizardProps> = ({
  onClose,
  onComplete,
  onBack,
  willType,
  initialData,
}) => {
  useAuth();
  const { user } = useUser();
  const { isFocusMode } = useFocusMode();
  const [currentStep, setCurrentStep] = useState(0);
  const [showVaultSelector, setShowVaultSelector] = useState(false);
  const [vaultSelectorType, setVaultSelectorType] = useState<
    'all' | 'bankAccounts' | 'personalProperty' | 'realEstate' | 'vehicles'
  >('all');

  // Initialize with draft data if provided, otherwise use empty data
  const [willData, setWillData] = useState<WillData>(
    initialData || {
      testator_data: {
        fullName: user?.fullName || '',
      },
      beneficiaries: [],
      assets: {},
      executor_data: {},
      guardianship_data: {},
      special_instructions: {},
      legal_data: {},
      review_eligibility: true,
      family_protection_level: 'standard' as const,
      completeness_score: 0,
    }
  );

  const currentStepId = STEPS[currentStep].id;
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const updateWillData = useCallback(
    (section: keyof WillData, data: Partial<WillData[keyof WillData]>) => {
      setWillData(prev => ({
        ...prev,
        [section]: { ...(prev[section] as any), ...(data as any) },
      }));
    },
    []
  );

  const handleComplete = useCallback(() => {
    onComplete(willData);
  }, [willData, onComplete]);

  const handleNext = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  }, [currentStep, handleComplete]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else if (onBack) {
      onBack();
    }
  }, [currentStep, onBack]);

  const goToStep = useCallback((stepId: string) => {
    const stepIndex = STEPS.findIndex(step => step.id === stepId);
    if (stepIndex !== -1) {
      setCurrentStep(stepIndex);
    }
  }, []);

  const handleOpenVaultSelector = (
    assetType:
      | 'all'
      | 'bankAccounts'
      | 'personalProperty'
      | 'realEstate'
      | 'vehicles'
  ) => {
    setVaultSelectorType(assetType);
    setShowVaultSelector(true);
  };

  const handleVaultAssetsSelected = (selectedAssets: string[]) => {
    // Add selected assets to the appropriate category
    if (vaultSelectorType === 'all') {
      // Distribute to a default category when 'all' is selected
      const currentAssets = willData.assets.personalProperty || [];
      const newAssets = selectedAssets.map(asset => ({
        description: asset,
        value: 0, // User can edit this later
      }));
      updateWillData('assets', {
        personalProperty: [...currentAssets, ...newAssets],
      });
      setShowVaultSelector(false);
      toast.success(
        `Added ${selectedAssets.length} asset${selectedAssets.length > 1 ? 's' : ''} from your vault`
      );
      return;
    }
    const currentAssets = (willData.assets as any)[vaultSelectorType] || [];
    const newAssets = selectedAssets.map(asset => ({
      description: asset,
      value: 0, // User can edit this later
    }));

    updateWillData('assets', {
      [vaultSelectorType]: [...currentAssets, ...newAssets],
    });

    setShowVaultSelector(false);
    toast.success(
      `Added ${selectedAssets.length} asset${selectedAssets.length > 1 ? 's' : ''} from your vault`
    );
  };

  const addBeneficiary = useCallback(() => {
    const newBeneficiary = {
      id: crypto.randomUUID(),
      name: '',
      relationship: 'child' as const,
      percentage: 0,
      specificGifts: [],
      conditions: '',
    };
    setWillData(prev => ({
      ...prev,
      beneficiaries: [...prev.beneficiaries, newBeneficiary],
    }));
  }, []);

  const updateBeneficiary = useCallback(
    (id: string, field: string, value: number | string | string[]) => {
      setWillData(prev => ({
        ...prev,
        beneficiaries: prev.beneficiaries.map(b =>
          b.id === id ? { ...b, [field]: value } : b
        ),
      }));
    },
    []
  );

  const removeBeneficiary = useCallback((id: string) => {
    setWillData(prev => ({
      ...prev,
      beneficiaries: prev.beneficiaries.filter(b => b.id !== id),
    }));
  }, []);

  const renderStepContent = () => {
    switch (currentStepId) {
      case 'personal':
        return (
          <div className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='fullName'>Full Name</Label>
                <Input
                  id='fullName'
                  value={willData.testator_data.fullName || ''}
                  onChange={e =>
                    updateWillData('testator_data', {
                      fullName: e.target.value,
                    })
                  }
                  placeholder='Enter your full legal name'
                />
              </div>
              <div>
                <Label htmlFor='dateOfBirth'>Date of Birth</Label>
                <Input
                  id='dateOfBirth'
                  type='date'
                  value={willData.testator_data.dateOfBirth || ''}
                  onChange={e =>
                    updateWillData('testator_data', {
                      dateOfBirth: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor='address'>Address</Label>
              <Textarea
                id='address'
                value={willData.testator_data.address || ''}
                onChange={e =>
                  updateWillData('testator_data', { address: e.target.value })
                }
                placeholder='Enter your full address'
                rows={3}
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='citizenship'>Citizenship</Label>
                <Input
                  id='citizenship'
                  value={willData.testator_data.citizenship || ''}
                  onChange={e =>
                    updateWillData('testator_data', {
                      citizenship: e.target.value,
                    })
                  }
                  placeholder='e.g., United States'
                />
              </div>
              <div>
                <Label htmlFor='maritalStatus'>Marital Status</Label>
                <Select
                  value={willData.testator_data.maritalStatus}
                  onValueChange={value =>
                    updateWillData('testator_data', {
                      maritalStatus: value as
                        | 'divorced'
                        | 'married'
                        | 'single'
                        | 'widowed',
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='single'>Single</SelectItem>
                    <SelectItem value='married'>Married</SelectItem>
                    <SelectItem value='divorced'>Divorced</SelectItem>
                    <SelectItem value='widowed'>Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 'beneficiaries':
        return (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold'>Your Beneficiaries</h3>
              <Button onClick={addBeneficiary} variant='outline' size='sm'>
                <Icon name='add' className='w-4 h-4 mr-2' />
                Add Beneficiary
              </Button>
            </div>

            {willData.beneficiaries.length === 0 ? (
              <Card className='p-8 text-center'>
                <Icon
                  name='users'
                  className='w-12 h-12 text-muted-foreground mx-auto mb-4'
                />
                <p className='text-muted-foreground'>
                  No beneficiaries added yet
                </p>
                <p className='text-sm text-muted-foreground mt-2'>
                  Click "Add Beneficiary" to start
                </p>
              </Card>
            ) : (
              <div className='space-y-4'>
                {willData.beneficiaries.map((beneficiary, index) => (
                  <Card key={beneficiary.id} className='p-4'>
                    <div className='flex items-center justify-between mb-4'>
                      <Badge variant='secondary'>Beneficiary {index + 1}</Badge>
                      <Button
                        onClick={() => removeBeneficiary(beneficiary.id)}
                        variant='ghost'
                        size='sm'
                        className='text-red-600 hover:text-red-700'
                      >
                        <Icon name='trash' className='w-4 h-4' />
                      </Button>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={beneficiary.name}
                          onChange={e =>
                            updateBeneficiary(
                              beneficiary.id,
                              'name',
                              e.target.value
                            )
                          }
                          placeholder='Beneficiary name'
                        />
                      </div>
                      <div>
                        <Label>Relationship</Label>
                        <Select
                          value={beneficiary.relationship}
                          onValueChange={value =>
                            updateBeneficiary(
                              beneficiary.id,
                              'relationship',
                              value
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {RELATIONSHIPS.map(rel => (
                              <SelectItem key={rel.value} value={rel.value}>
                                {rel.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Inheritance Percentage</Label>
                        <Input
                          type='number'
                          min='0'
                          max='100'
                          value={beneficiary.percentage}
                          onChange={e =>
                            updateBeneficiary(
                              beneficiary.id,
                              'percentage',
                              parseInt(e.target.value) || 0
                            )
                          }
                          placeholder='0'
                        />
                      </div>
                    </div>
                    <div className='mt-4'>
                      <Label>Special Conditions (Optional)</Label>
                      <Input
                        value={beneficiary.conditions || ''}
                        onChange={e =>
                          updateBeneficiary(
                            beneficiary.id,
                            'conditions',
                            e.target.value
                          )
                        }
                        placeholder='e.g., if surviving, if over 18 years old'
                      />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 'assets':
        return (
          <div className='space-y-6'>
            <div className='text-center p-6'>
              <Icon
                name={'building-office' as any}
                className='w-12 h-12 text-primary mx-auto mb-4'
              />
              <h3 className='text-lg font-semibold mb-2'>
                Document Your Assets
              </h3>
              <p className='text-muted-foreground mb-4'>
                Add your assets manually or import them from your LegacyGuard
                vault for convenience.
              </p>
              <Button
                onClick={() => handleOpenVaultSelector('all')}
                variant='outline'
                className='bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary'
              >
                <Icon name={'vault' as any} className='w-4 h-4 mr-2' />
                Import from My Vault
              </Button>
            </div>

            {/* Real Estate */}
            <Card className='p-4'>
              <div className='flex items-center justify-between mb-4'>
                <h4 className='font-semibold flex items-center gap-2'>
                  <Icon name={'home' as any} className='w-4 h-4' />
                  Real Estate
                </h4>
                <div className='flex items-center gap-2'>
                  <Button
                    onClick={() => handleOpenVaultSelector('realEstate')}
                    variant='ghost'
                    size='sm'
                    className='text-primary hover:text-primary-hover'
                  >
                    <Icon name={'vault' as any} className='w-3 h-3 mr-1' />
                    From Vault
                  </Button>
                  <Button
                    onClick={() => {
                      const newAsset = {
                        description: '',
                        address: '',
                        value: 0,
                      };
                      updateWillData('assets', {
                        realEstate: [
                          ...(willData.assets.realEstate || []),
                          newAsset,
                        ],
                      });
                    }}
                    variant='outline'
                    size='sm'
                  >
                    <Icon name={'add' as any} className='w-3 h-3 mr-1' />
                    Add Property
                  </Button>
                </div>
              </div>
              {willData.assets.realEstate?.length ? (
                <div className='space-y-3'>
                  {willData.assets.realEstate.map((property, index) => (
                    <div
                      key={index}
                      className='grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-muted/50 rounded'
                    >
                      <Input
                        placeholder='Property description'
                        value={property.description}
                        onChange={e => {
                          const updated = [...willData.assets.realEstate!];
                          updated[index] = {
                            ...updated[index],
                            description: e.target.value,
                          };
                          updateWillData('assets', { realEstate: updated });
                        }}
                      />
                      <Input
                        placeholder='Address'
                        value={property.address}
                        onChange={e => {
                          const updated = [...willData.assets.realEstate!];
                          updated[index] = {
                            ...updated[index],
                            address: e.target.value,
                          };
                          updateWillData('assets', { realEstate: updated });
                        }}
                      />
                      <div className='flex gap-2'>
                        <Input
                          type='number'
                          placeholder='Estimated value'
                          value={property.value || ''}
                          onChange={e => {
                            const updated = [...willData.assets.realEstate!];
                            updated[index] = {
                              ...updated[index],
                              value: parseFloat(e.target.value) || 0,
                            };
                            updateWillData('assets', { realEstate: updated });
                          }}
                        />
                        <Button
                          onClick={() => {
                            const updated = willData.assets.realEstate!.filter(
                              (_, i) => i !== index
                            );
                            updateWillData('assets', { realEstate: updated });
                          }}
                          variant='ghost'
                          size='sm'
                          className='text-red-600 hover:text-red-700'
                        >
                          <Icon name='trash' className='w-3 h-3' />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-sm text-muted-foreground text-center py-4'>
                  No real estate properties added yet
                </p>
              )}
            </Card>

            {/* Vehicles */}
            <Card className='p-4'>
              <div className='flex items-center justify-between mb-4'>
                <h4 className='font-semibold flex items-center gap-2'>
                  <Icon name={'car' as any} className='w-4 h-4' />
                  Vehicles
                </h4>
                <div className='flex items-center gap-2'>
                  <Button
                    onClick={() => handleOpenVaultSelector('vehicles')}
                    variant='ghost'
                    size='sm'
                    className='text-primary hover:text-primary-hover'
                  >
                    <Icon name={'vault' as any} className='w-3 h-3 mr-1' />
                    From Vault
                  </Button>
                  <Button
                    onClick={() => {
                      const newVehicle = {
                        description: '',
                        make: '',
                        model: '',
                        year: new Date().getFullYear(),
                        value: 0,
                        vin: '',
                      };
                      updateWillData('assets', {
                        vehicles: [
                          ...(willData.assets.vehicles || []),
                          newVehicle,
                        ],
                      });
                    }}
                    variant='outline'
                    size='sm'
                  >
                    <Icon name={'add' as any} className='w-3 h-3 mr-1' />
                    Add Vehicle
                  </Button>
                </div>
              </div>
              {willData.assets.vehicles?.length ? (
                <div className='space-y-3'>
                  {willData.assets.vehicles.map((vehicle, index) => (
                    <div
                      key={index}
                      className='grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-muted/50 rounded'
                    >
                      <Input
                        placeholder='Make'
                        value={vehicle.make}
                        onChange={e => {
                          const updated = [...willData.assets.vehicles!];
                          updated[index] = {
                            ...updated[index],
                            make: e.target.value,
                          };
                          updateWillData('assets', { vehicles: updated });
                        }}
                      />
                      <Input
                        placeholder='Model'
                        value={vehicle.model}
                        onChange={e => {
                          const updated = [...willData.assets.vehicles!];
                          updated[index] = {
                            ...updated[index],
                            model: e.target.value,
                          };
                          updateWillData('assets', { vehicles: updated });
                        }}
                      />
                      <Input
                        type='number'
                        placeholder='Year'
                        value={vehicle.year}
                        onChange={e => {
                          const updated = [...willData.assets.vehicles!];
                          updated[index] = {
                            ...updated[index],
                            year:
                              parseInt(e.target.value) ||
                              new Date().getFullYear(),
                          };
                          updateWillData('assets', { vehicles: updated });
                        }}
                      />
                      <div className='flex gap-2'>
                        <Input
                          placeholder='VIN (optional)'
                          value={vehicle.vin || ''}
                          onChange={e => {
                            const updated = [...willData.assets.vehicles!];
                            updated[index] = {
                              ...updated[index],
                              vin: e.target.value,
                            };
                            updateWillData('assets', { vehicles: updated });
                          }}
                        />
                        <Button
                          onClick={() => {
                            const updated = willData.assets.vehicles!.filter(
                              (_, i) => i !== index
                            );
                            updateWillData('assets', { vehicles: updated });
                          }}
                          variant='ghost'
                          size='sm'
                          className='text-red-600 hover:text-red-700'
                        >
                          <Icon name='trash' className='w-3 h-3' />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-sm text-muted-foreground text-center py-4'>
                  No vehicles added yet
                </p>
              )}
            </Card>

            {/* Bank Accounts */}
            <Card className='p-4'>
              <div className='flex items-center justify-between mb-4'>
                <h4 className='font-semibold flex items-center gap-2'>
                  <Icon name={'credit-card' as any} className='w-4 h-4' />
                  Bank Accounts & Investments
                </h4>
                <div className='flex items-center gap-2'>
                  <Button
                    onClick={() => handleOpenVaultSelector('bankAccounts')}
                    variant='ghost'
                    size='sm'
                    className='text-primary hover:text-primary-hover'
                  >
                    <Icon name={'vault' as any} className='w-3 h-3 mr-1' />
                    From Vault
                  </Button>
                  <Button
                    onClick={() => {
                      const newAccount = {
                        bank: '',
                        accountNumber: '',
                        type: 'checking' as
                          | 'checking'
                          | 'investment'
                          | 'savings',
                      };
                      updateWillData('assets', {
                        bankAccounts: [
                          ...(willData.assets.bankAccounts || []),
                          newAccount,
                        ],
                      });
                    }}
                    variant='outline'
                    size='sm'
                  >
                    <Icon name={'add' as any} className='w-3 h-3 mr-1' />
                    Add Account
                  </Button>
                </div>
              </div>
              {willData.assets.bankAccounts?.length ? (
                <div className='space-y-3'>
                  {willData.assets.bankAccounts.map((account, index) => (
                    <div
                      key={index}
                      className='grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-muted/50 rounded'
                    >
                      <Input
                        placeholder='Bank name'
                        value={account.bank}
                        onChange={e => {
                          const updated = [...willData.assets.bankAccounts!];
                          updated[index] = {
                            ...updated[index],
                            bank: e.target.value,
                          };
                          updateWillData('assets', { bankAccounts: updated });
                        }}
                      />
                      <Select
                        value={account.type}
                        onValueChange={value => {
                          const updated = [...willData.assets.bankAccounts!];
                          updated[index] = {
                            ...updated[index],
                            type: value as
                              | 'checking'
                              | 'investment'
                              | 'savings',
                          };
                          updateWillData('assets', { bankAccounts: updated });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='checking'>Checking</SelectItem>
                          <SelectItem value='savings'>Savings</SelectItem>
                          <SelectItem value='investment'>Investment</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className='flex gap-2'>
                        <Input
                          placeholder='Last 4 digits'
                          value={account.accountNumber}
                          onChange={e => {
                            const updated = [...willData.assets.bankAccounts!];
                            updated[index] = {
                              ...updated[index],
                              accountNumber: e.target.value,
                            };
                            updateWillData('assets', { bankAccounts: updated });
                          }}
                        />
                        <Button
                          onClick={() => {
                            const updated =
                              willData.assets.bankAccounts!.filter(
                                (_, i) => i !== index
                              );
                            updateWillData('assets', { bankAccounts: updated });
                          }}
                          variant='ghost'
                          size='sm'
                          className='text-red-600 hover:text-red-700'
                        >
                          <Icon name='trash' className='w-3 h-3' />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-sm text-muted-foreground text-center py-4'>
                  No bank accounts added yet
                </p>
              )}
            </Card>

            {/* Personal Property */}
            <Card className='p-4'>
              <div className='flex items-center justify-between mb-4'>
                <h4 className='font-semibold flex items-center gap-2'>
                  <Icon name={'star' as any} className='w-4 h-4' />
                  Personal Property
                </h4>
                <div className='flex items-center gap-2'>
                  <Button
                    onClick={() => handleOpenVaultSelector('personalProperty')}
                    variant='ghost'
                    size='sm'
                    className='text-primary hover:text-primary-hover'
                  >
                    <Icon name={'vault' as any} className='w-3 h-3 mr-1' />
                    From Vault
                  </Button>
                  <Button
                    onClick={() => {
                      const newItem = {
                        description: '',
                        value: 0,
                        recipient: '',
                      };
                      updateWillData('assets', {
                        personalProperty: [
                          ...(willData.assets.personalProperty || []),
                          newItem,
                        ],
                      });
                    }}
                    variant='outline'
                    size='sm'
                  >
                    <Icon name={'add' as any} className='w-3 h-3 mr-1' />
                    Add Item
                  </Button>
                </div>
              </div>
              {willData.assets.personalProperty?.length ? (
                <div className='space-y-3'>
                  {willData.assets.personalProperty.map((item, index) => (
                    <div
                      key={index}
                      className='grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-muted/50 rounded'
                    >
                      <Input
                        placeholder='Item description'
                        value={item.description}
                        onChange={e => {
                          const updated = [
                            ...willData.assets.personalProperty!,
                          ];
                          updated[index] = {
                            ...updated[index],
                            description: e.target.value,
                          };
                          updateWillData('assets', {
                            personalProperty: updated,
                          });
                        }}
                      />
                      <Input
                        type='number'
                        placeholder='Estimated value'
                        value={item.value || ''}
                        onChange={e => {
                          const updated = [
                            ...willData.assets.personalProperty!,
                          ];
                          updated[index] = {
                            ...updated[index],
                            value: parseFloat(e.target.value) || 0,
                          };
                          updateWillData('assets', {
                            personalProperty: updated,
                          });
                        }}
                      />
                      <div className='flex gap-2'>
                        <Input
                          placeholder='Designated recipient'
                          value={item.recipient || ''}
                          onChange={e => {
                            const updated = [
                              ...willData.assets.personalProperty!,
                            ];
                            updated[index] = {
                              ...updated[index],
                              recipient: e.target.value,
                            };
                            updateWillData('assets', {
                              personalProperty: updated,
                            });
                          }}
                        />
                        <Button
                          onClick={() => {
                            const updated =
                              willData.assets.personalProperty!.filter(
                                (_, i) => i !== index
                              );
                            updateWillData('assets', {
                              personalProperty: updated,
                            });
                          }}
                          variant='ghost'
                          size='sm'
                          className='text-red-600 hover:text-red-700'
                        >
                          <Icon name='trash' className='w-3 h-3' />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-sm text-muted-foreground text-center py-4'>
                  No personal property items added yet
                </p>
              )}
            </Card>
          </div>
        );

      case 'executor':
        return (
          <div className='space-y-6'>
            <div>
              <h3 className='text-lg font-semibold mb-4'>Primary Executor</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='primaryExecutorName'>Name</Label>
                  <Input
                    id='primaryExecutorName'
                    value={willData.executor_data.primaryExecutor?.name || ''}
                    onChange={e =>
                      updateWillData('executor_data', {
                        primaryExecutor: {
                          name: e.target.value,
                          relationship:
                            willData.executor_data.primaryExecutor
                              ?.relationship || '',
                          phone:
                            willData.executor_data.primaryExecutor?.phone || '',
                        },
                      })
                    }
                    placeholder="Executor's full name"
                  />
                </div>
                <div>
                  <Label htmlFor='primaryExecutorRelationship'>
                    Relationship
                  </Label>
                  <Input
                    id='primaryExecutorRelationship'
                    value={
                      willData.executor_data.primaryExecutor?.relationship || ''
                    }
                    onChange={e =>
                      updateWillData('executor_data', {
                        primaryExecutor: {
                          name:
                            willData.executor_data.primaryExecutor?.name || '',
                          relationship: e.target.value,
                          phone:
                            willData.executor_data.primaryExecutor?.phone || '',
                        },
                      })
                    }
                    placeholder='e.g., spouse, friend, attorney'
                  />
                </div>
              </div>
              <div className='mt-4'>
                <Label htmlFor='primaryExecutorPhone'>Phone (Optional)</Label>
                <Input
                  id='primaryExecutorPhone'
                  value={willData.executor_data.primaryExecutor?.phone || ''}
                  onChange={e =>
                    updateWillData('executor_data', {
                      primaryExecutor: {
                        name:
                          willData.executor_data.primaryExecutor?.name || '',
                        relationship:
                          willData.executor_data.primaryExecutor
                            ?.relationship || '',
                        phone: e.target.value,
                      },
                    })
                  }
                  placeholder='Phone number'
                />
              </div>
            </div>

            <div>
              <h3 className='text-lg font-semibold mb-4'>
                Backup Executor (Optional)
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='backupExecutorName'>Name</Label>
                  <Input
                    id='backupExecutorName'
                    value={willData.executor_data.backupExecutor?.name || ''}
                    onChange={e =>
                      updateWillData('executor_data', {
                        backupExecutor: {
                          name: e.target.value,
                          relationship:
                            willData.executor_data.backupExecutor
                              ?.relationship || '',
                          phone:
                            willData.executor_data.backupExecutor?.phone || '',
                        },
                      })
                    }
                    placeholder="Backup executor's name"
                  />
                </div>
                <div>
                  <Label htmlFor='backupExecutorRelationship'>
                    Relationship
                  </Label>
                  <Input
                    id='backupExecutorRelationship'
                    value={
                      willData.executor_data.backupExecutor?.relationship || ''
                    }
                    onChange={e =>
                      updateWillData('executor_data', {
                        backupExecutor: {
                          name:
                            willData.executor_data.backupExecutor?.name || '',
                          relationship: e.target.value,
                          phone:
                            willData.executor_data.backupExecutor?.phone || '',
                        },
                      })
                    }
                    placeholder='e.g., sibling, friend'
                  />
                </div>
              </div>
            </div>

            <Card className='p-4 bg-amber-50 dark:bg-amber-900/20'>
              <div className='flex gap-3'>
                <Icon
                  name={'info' as any}
                  className='w-5 h-5 text-amber-600 flex-shrink-0 mt-1'
                />
                <div>
                  <h4 className='font-semibold text-amber-900 dark:text-amber-200'>
                    Executor Responsibilities
                  </h4>
                  <p className='text-sm text-amber-700 dark:text-amber-300 mt-1'>
                    Your executor will handle settling your estate, paying
                    debts, distributing assets, and ensuring your wishes are
                    carried out. Choose someone you trust who is organized and
                    responsible.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        );

      case 'wishes':
        return (
          <div className='space-y-6'>
            <div>
              <Label htmlFor='funeralWishes'>Funeral and Memorial Wishes</Label>
              <Textarea
                id='funeralWishes'
                value={willData.special_instructions.funeralWishes || ''}
                onChange={e =>
                  updateWillData('special_instructions', {
                    funeralWishes: e.target.value,
                  })
                }
                placeholder='Describe your preferences for funeral arrangements, memorial service, burial/cremation, etc.'
                rows={4}
              />
            </div>

            <div className='flex items-center space-x-3'>
              <input
                type='checkbox'
                id='organDonation'
                checked={willData.special_instructions.organDonation || false}
                onChange={e =>
                  updateWillData('special_instructions', {
                    organDonation: e.target.checked,
                  })
                }
                className='rounded'
              />
              <Label htmlFor='organDonation'>I wish to be an organ donor</Label>
            </div>

            <div>
              <Label htmlFor='petCare'>
                Pet Care Instructions (If applicable)
              </Label>
              <Textarea
                id='petCare'
                value={willData.special_instructions.petCare || ''}
                onChange={e =>
                  updateWillData('special_instructions', {
                    petCare: e.target.value,
                  })
                }
                placeholder='Instructions for the care of your pets'
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor='digitalAssets'>Digital Assets and Accounts</Label>
              <Textarea
                id='digitalAssets'
                value={willData.special_instructions.digitalAssets || ''}
                onChange={e =>
                  updateWillData('special_instructions', {
                    digitalAssets: e.target.value,
                  })
                }
                placeholder='Instructions for social media accounts, digital files, online subscriptions, etc.'
                rows={3}
              />
            </div>
          </div>
        );

      case 'sofia_check':
        return (
          <SofiaCorrectnessCheck
            willData={willData}
            willType={willType}
            onContinue={() => setCurrentStep(prev => prev + 1)}
            onGoToStep={goToStep}
          />
        );

      case 'review':
        return (
          <div className='space-y-6'>
            <div className='text-center mb-8'>
              <Icon
                name={'documents' as any}
                className='w-12 h-12 text-primary mx-auto mb-4'
              />
              <h3 className='text-2xl font-semibold mb-2'>Review Your Will</h3>
              <p className='text-muted-foreground'>
                Please review all information before creating your will document
              </p>
            </div>

            {/* Summary cards for each section */}
            <div className='grid gap-4'>
              <Card className='p-4'>
                <h4 className='font-semibold mb-2 flex items-center gap-2'>
                  <Icon name={'user' as any} className='w-4 h-4' />
                  Personal Information
                </h4>
                <p className='text-sm text-muted-foreground'>
                  {willData.testator_data.fullName} •{' '}
                  {willData.legal_data.jurisdiction}
                </p>
              </Card>

              <Card className='p-4'>
                <h4 className='font-semibold mb-2 flex items-center gap-2'>
                  <Icon name={'users' as any} className='w-4 h-4' />
                  Beneficiaries
                </h4>
                <p className='text-sm text-muted-foreground'>
                  {willData.beneficiaries.length} beneficiaries defined
                </p>
              </Card>

              <Card className='p-4'>
                <h4 className='font-semibold mb-2 flex items-center gap-2'>
                  <Icon name={'shield-check' as any} className='w-4 h-4' />
                  Executor
                </h4>
                <p className='text-sm text-muted-foreground'>
                  {willData.executor_data.primaryExecutor?.name ||
                    'Not specified'}
                </p>
              </Card>
            </div>

            <Card className='p-4 bg-green-50 dark:bg-green-900/20'>
              <div className='flex gap-3'>
                <Icon
                  name={'shield-check' as any}
                  className='w-5 h-5 text-green-600 flex-shrink-0 mt-1'
                />
                <div>
                  <h4 className='font-semibold text-green-900 dark:text-green-200'>
                    Ready to Create
                  </h4>
                  <p className='text-sm text-green-700 dark:text-green-300 mt-1'>
                    Your will document will be generated based on the
                    information provided. You can always edit and update it
                    later.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return <div>Step not implemented</div>;
    }
  };

  return (
    <FocusModeWrapper
      currentStepTitle={STEPS[currentStep].title}
      currentStepIndex={currentStep}
      totalSteps={STEPS.length}
      onExitWizard={onClose}
    >
      <div className='min-h-screen bg-background flex flex-col'>
        {/* Header - Hidden in Focus Mode */}
        {!isFocusMode && (
          <header className='bg-card border-b border-card-border sticky top-0 z-50'>
            <div className='max-w-4xl mx-auto px-6 py-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <Button
                    onClick={onClose}
                    variant='ghost'
                    size='sm'
                    className='flex items-center gap-2'
                  >
                    <Icon name={'arrow-left' as any} className='w-4 h-4' />
                    Back to Legacy Planning
                  </Button>
                </div>
                <div className='text-center'>
                  <h1 className='text-xl font-semibold'>Will Creator</h1>
                  <p className='text-sm text-muted-foreground'>
                    Step {currentStep + 1} of {STEPS.length}:{' '}
                    {STEPS[currentStep].title}
                  </p>
                </div>
                <div className='flex items-center gap-2'>
                  <FocusModeToggle />
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Progress Bar - Hidden in Focus Mode */}
        {!isFocusMode && (
          <div className='bg-card border-b border-card-border'>
            <div className='max-w-4xl mx-auto px-6 py-4'>
              <Progress value={progress} className='h-2' />
              <div className='flex justify-between mt-2 text-xs text-muted-foreground'>
                {STEPS.map((step, index) => (
                  <span
                    key={step.id}
                    className={
                      index <= currentStep ? 'text-primary font-medium' : ''
                    }
                  >
                    {step.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Draft Data Indicator */}
        {initialData && !isFocusMode && (
          <div className='bg-primary/5 border-b border-primary/20'>
            <div className='max-w-4xl mx-auto px-6 py-3'>
              <div className='flex items-center gap-3 text-sm'>
                <Icon
                  name={'sparkles' as any}
                  className='w-4 h-4 text-primary'
                />
                <span className='text-primary font-medium'>
                  Sofia's Intelligent Draft Active
                </span>
                <span className='text-muted-foreground'>
                  I've pre-filled your will based on your existing data. Review
                  and modify as needed.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Content - Conditional Layout */}
        <main className='flex-1 flex overflow-hidden'>
          {currentStepId === 'sofia_check' || currentStepId === 'review' ? (
            /* Full Width for Sofia Check and Review */
            <div className='flex-1 flex flex-col'>
              <div className='p-6 overflow-y-auto max-w-4xl mx-auto w-full'>
                <FadeIn key={currentStep} duration={0.3}>
                  <div className='mb-6'>
                    <h2 className='text-2xl font-semibold mb-2'>
                      {STEPS[currentStep].title}
                    </h2>
                    <p className='text-muted-foreground'>
                      {STEPS[currentStep].description}
                    </p>
                  </div>

                  {renderStepContent()}
                </FadeIn>
              </div>
            </div>
          ) : (
            /* Dual Panel Layout for Form Steps */
            <>
              {/* Left Panel - Form (40% width) */}
              <div className='w-2/5 flex flex-col border-r border-card-border'>
                <div className='p-6 overflow-y-auto'>
                  <FadeIn key={currentStep} duration={0.3}>
                    <div className='mb-6'>
                      <h2 className='text-2xl font-semibold mb-2'>
                        {STEPS[currentStep].title}
                      </h2>
                      <p className='text-muted-foreground'>
                        {STEPS[currentStep].description}
                      </p>
                    </div>

                    {renderStepContent()}
                  </FadeIn>
                </div>
              </div>

              {/* Right Panel - Live Preview (60% width) */}
              <div className='w-3/5 flex flex-col'>
                <LiveWillPreview
                  willData={willData}
                  willType={willType}
                  currentStep={currentStepId}
                />
              </div>
            </>
          )}
        </main>

        {/* Navigation */}
        <footer className='bg-card border-t border-card-border'>
          <div className='px-6 py-4'>
            <div className='flex justify-between items-center'>
              <Button
                onClick={handleBack}
                variant='outline'
                disabled={currentStep === 0 && !onBack}
              >
                <Icon name={'arrow-left' as any} className='w-4 h-4 mr-2' />
                {currentStep === 0 ? 'Change Will Type' : 'Back'}
              </Button>

              <div className='flex items-center gap-4'>
                {!isFocusMode && (
                  <div className='text-sm text-muted-foreground'>
                    Step {currentStep + 1} of {STEPS.length}
                  </div>
                )}
                <Button
                  onClick={handleNext}
                  className='bg-primary hover:bg-primary-hover text-primary-foreground'
                >
                  {currentStep === STEPS.length - 1
                    ? 'Create Will'
                    : 'Continue'}
                  {currentStep !== STEPS.length - 1 && (
                    <Icon
                      name={'arrow-right' as any}
                      className='w-4 h-4 ml-2'
                    />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Vault Asset Selector Modal */}
      {showVaultSelector && (
        <VaultAssetSelector
          onAssetsSelected={handleVaultAssetsSelected}
          onClose={() => setShowVaultSelector(false)}
          assetType={vaultSelectorType}
        />
      )}
    </FocusModeWrapper>
  );
};
