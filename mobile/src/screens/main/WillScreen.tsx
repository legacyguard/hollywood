import React, { useState, useEffect } from 'react'
import { 
  Container, 
  Stack, 
  H2, 
  H3,
  Paragraph, 
  Card, 
  CardContent,
  Button,
  Row,
  ScrollContainer,
  useTheme,
  Divider,
  Input,
  RadioGroup,
  CheckboxGroup,
  TextArea,
  SegmentedProgress,
  PillarCard,
  Label,
  useMedia,
  Grid
} from '@legacyguard/ui'
import { 
  FileText,
  ChevronRight,
  ChevronLeft,
  User,
  Users,
  Heart,
  Gift,
  Home,
  MessageSquare,
  CheckCircle,
  Lock,
  AlertCircle
} from 'lucide-react-native'
import { Alert, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '@/hooks/useAuth'

// Will wizard steps
const WILL_STEPS = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'executor', label: 'Executor', icon: Users },
  { id: 'guardians', label: 'Guardians', icon: Heart },
  { id: 'gifts', label: 'Specific Gifts', icon: Gift },
  { id: 'residue', label: 'Residue', icon: Home },
  { id: 'wishes', label: 'Final Wishes', icon: MessageSquare },
  { id: 'review', label: 'Review', icon: CheckCircle }
]

interface WillData {
  personal: {
    fullName: string
    dateOfBirth: string
    address: string
    maritalStatus: string
  }
  executor: {
    name: string
    relationship: string
    email: string
    phone: string
    alternativeName?: string
  }
  guardians: Array<{
    childName: string
    guardianName: string
    relationship: string
  }>
  gifts: Array<{
    item: string
    beneficiary: string
    fallback?: string
  }>
  residue: {
    primaryBeneficiary: string
    percentage: number
    alternativeBeneficiary?: string
  }
  wishes: {
    funeral: string
    burial: string
    specialRequests?: string
  }
}

export const WillScreen = () => {
  const navigation = useNavigation()
  const theme = useTheme()
  const media = useMedia()
  const { user } = useAuth()
  
  const [currentStep, setCurrentStep] = useState(0)
  const [willData, setWillData] = useState<Partial<WillData>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  
  // Check premium status
  useEffect(() => {
    checkPremiumStatus()
  }, [])
  
  const checkPremiumStatus = () => {
    // TODO: Check actual premium status from user metadata
    setIsPremium(false) // For now, assume free user
  }
  
  const handleNext = () => {
    if (currentStep < WILL_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }
  
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }
  
  const handleSaveProgress = async () => {
    try {
      // TODO: Save to localStorage or API
      console.log('Saving will progress:', willData)
      Alert.alert('Progress Saved', 'Your will progress has been saved.')
    } catch (error) {
      Alert.alert('Error', 'Failed to save progress. Please try again.')
    }
  }
  
  const handleGenerateWill = async () => {
    if (!isPremium) {
      Alert.alert(
        'Premium Feature',
        'Generating a complete will document is a premium feature. Upgrade to access this and other premium features.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Upgrade', 
            onPress: () => {
              // Navigate to web for upgrade
              console.log('Navigate to upgrade page')
            }
          }
        ]
      )
      return
    }
    
    setIsLoading(true)
    try {
      // TODO: Generate will document
      console.log('Generating will with data:', willData)
      Alert.alert('Success', 'Your will has been generated successfully!')
    } catch (error) {
      Alert.alert('Error', 'Failed to generate will. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  const renderStepContent = () => {
    const step = WILL_STEPS[currentStep]
    
    switch (step.id) {
      case 'personal':
        return (
          <Stack gap="$4">
            <H3>Personal Information</H3>
            <Paragraph color="$gray6">
              Let's start with your basic information
            </Paragraph>
            
            <Input
              label="Full Legal Name"
              placeholder="Enter your full name"
              value={willData.personal?.fullName || ''}
              onChangeText={(text) => setWillData(prev => ({
                ...prev,
                personal: { ...prev.personal, fullName: text }
              }))}
            />
            
            <Input
              label="Date of Birth"
              placeholder="DD/MM/YYYY"
              value={willData.personal?.dateOfBirth || ''}
              onChangeText={(text) => setWillData(prev => ({
                ...prev,
                personal: { ...prev.personal, dateOfBirth: text }
              }))}
            />
            
            <TextArea
              label="Current Address"
              placeholder="Enter your full address"
              value={willData.personal?.address || ''}
              onChangeText={(text) => setWillData(prev => ({
                ...prev,
                personal: { ...prev.personal, address: text }
              }))}
              numberOfLines={3}
            />
            
            <RadioGroup
              options={[
                { value: 'single', label: 'Single' },
                { value: 'married', label: 'Married' },
                { value: 'divorced', label: 'Divorced' },
                { value: 'widowed', label: 'Widowed' }
              ]}
              value={willData.personal?.maritalStatus || ''}
              onValueChange={(value) => setWillData(prev => ({
                ...prev,
                personal: { ...prev.personal, maritalStatus: value }
              }))}
              orientation={media.gtSm ? 'horizontal' : 'vertical'}
            />
          </Stack>
        )
      
      case 'executor':
        return (
          <Stack gap="$4">
            <H3>Appoint Your Executor</H3>
            <Paragraph color="$gray6">
              Choose someone you trust to carry out your wishes
            </Paragraph>
            
            <Input
              label="Executor's Name"
              placeholder="Enter executor's full name"
              value={willData.executor?.name || ''}
              onChangeText={(text) => setWillData(prev => ({
                ...prev,
                executor: { ...prev.executor, name: text }
              }))}
            />
            
            <Input
              label="Relationship"
              placeholder="e.g., Spouse, Friend, Lawyer"
              value={willData.executor?.relationship || ''}
              onChangeText={(text) => setWillData(prev => ({
                ...prev,
                executor: { ...prev.executor, relationship: text }
              }))}
            />
            
            <Input
              label="Email Address"
              placeholder="executor@example.com"
              value={willData.executor?.email || ''}
              onChangeText={(text) => setWillData(prev => ({
                ...prev,
                executor: { ...prev.executor, email: text }
              }))}
              keyboardType="email-address"
            />
            
            <Input
              label="Phone Number"
              placeholder="+421 900 000 000"
              value={willData.executor?.phone || ''}
              onChangeText={(text) => setWillData(prev => ({
                ...prev,
                executor: { ...prev.executor, phone: text }
              }))}
              keyboardType="phone-pad"
            />
            
            <Divider />
            
            <Input
              label="Alternative Executor (Optional)"
              placeholder="Enter alternative executor's name"
              value={willData.executor?.alternativeName || ''}
              onChangeText={(text) => setWillData(prev => ({
                ...prev,
                executor: { ...prev.executor, alternativeName: text }
              }))}
            />
          </Stack>
        )
      
      case 'review':
        return (
          <Stack gap="$4">
            <H3>Review Your Will</H3>
            <Paragraph color="$gray6">
              Please review all the information before generating your will
            </Paragraph>
            
            {/* Summary Cards */}
            <Card>
              <CardContent>
                <Label marginBottom="$2">Personal Information</Label>
                <Paragraph>{willData.personal?.fullName}</Paragraph>
                <Paragraph size="$3" color="$gray6">
                  {willData.personal?.maritalStatus}, born {willData.personal?.dateOfBirth}
                </Paragraph>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <Label marginBottom="$2">Executor</Label>
                <Paragraph>{willData.executor?.name}</Paragraph>
                <Paragraph size="$3" color="$gray6">
                  {willData.executor?.relationship}
                </Paragraph>
              </CardContent>
            </Card>
            
            {!isPremium && (
              <Card backgroundColor="$accentGold" opacity={0.1}>
                <CardContent>
                  <Row alignItems="center" gap="$3">
                    <Lock size={24} color={theme.accentGold.val} />
                    <Stack flex={1}>
                      <Paragraph fontWeight="600">Premium Feature</Paragraph>
                      <Paragraph size="$3" color="$gray6">
                        Generate and download your complete will document
                      </Paragraph>
                    </Stack>
                  </Row>
                </CardContent>
              </Card>
            )}
          </Stack>
        )
      
      default:
        return (
          <Stack alignItems="center" justifyContent="center" padding="$8">
            <AlertCircle size={48} color={theme.warning.val} />
            <Paragraph marginTop="$3">
              This section is coming soon
            </Paragraph>
          </Stack>
        )
    }
  }
  
  return (
    <Container>
      <ScrollContainer>
        <Stack 
          padding="$4" 
          gap="$4"
          maxWidth={media.gtMd ? 1200 : media.gtSm ? 800 : '100%'}
          marginHorizontal="auto"
          width="100%"
        >
          {/* Header */}
          <Row justifyContent="space-between" alignItems="center">
            <H2>Will Generator</H2>
            <Button
              size="small"
              variant="ghost"
              onPress={handleSaveProgress}
            >
              Save Progress
            </Button>
          </Row>
          
          {/* Progress */}
          <SegmentedProgress
            segments={WILL_STEPS.length}
            currentSegment={currentStep + 1}
            labels={WILL_STEPS.map(s => s.label)}
          />
          
          {/* Premium Banner for Free Users */}
          {!isPremium && (
            <PillarCard
              title="Unlock Full Will Generator"
              subtitle="Create a legally valid will document"
              icon={FileText}
              variant="premium"
              actionButton={{
                text: 'Upgrade to Premium',
                onPress: () => console.log('Navigate to upgrade')
              }}
            />
          )}
          
          {/* Step Content */}
          <Card>
            <CardContent>
              {renderStepContent()}
            </CardContent>
          </Card>
          
          {/* Navigation Buttons */}
          <Row 
            justifyContent="space-between" 
            gap="$3"
            flexDirection={media.gtSm ? 'row' : 'column-reverse'}
          >
            <Button
              variant="secondary"
              icon={ChevronLeft}
              onPress={handlePrev}
              disabled={currentStep === 0}
              flex={media.gtSm ? 1 : undefined}
              fullWidth={!media.gtSm}
            >
              Previous
            </Button>
            
            {currentStep === WILL_STEPS.length - 1 ? (
              <Button
                variant={isPremium ? 'primary' : 'premium'}
                icon={isPremium ? CheckCircle : Lock}
                onPress={handleGenerateWill}
                loading={isLoading}
                flex={media.gtSm ? 1 : undefined}
                fullWidth={!media.gtSm}
              >
                {isPremium ? 'Generate Will' : 'Upgrade'}
              </Button>
            ) : (
              <Button
                variant="primary"
                iconAfter={ChevronRight}
                onPress={handleNext}
                flex={media.gtSm ? 1 : undefined}
                fullWidth={!media.gtSm}
              >
                Next
              </Button>
            )}
          </Row>
        </Stack>
      </ScrollContainer>
    </Container>
  )
}

export default WillScreen
