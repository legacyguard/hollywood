
// src/App.tsx - Web Application Entry Point

import { Suspense } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n/config';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ClerkProvider } from '@/providers/ClerkProvider';
import { LocalizationProvider } from '@/contexts/LocalizationContext';
import SignInPage from '@/pages/auth/SignIn';
import SignUpPage from '@/pages/auth/SignUp';
import { DashboardLayout } from '@/components/DashboardLayout';
import { SkipLinks } from '@/components/accessibility/SkipLinks';
import { ErrorBoundary } from 'react-error-boundary';

// Public Pages
import { LandingPage } from '@/pages/LandingPage';
import Blog from '@/pages/Blog';
import BlogArticle from '@/pages/BlogArticle';
import { TermsPage as Terms } from '@/pages/Terms';
import { PrivacyPage as Privacy } from '@/pages/Privacy';
import NotFound from '@/pages/NotFound';

// Protected Pages
import Index from '@/pages/Index';
import Vault from '@/pages/Vault';
import Guardians from '@/pages/Guardians';
import Legacy from '@/pages/Legacy';
import TimeCapsule from '@/pages/TimeCapsule';
import TimeCapsuleView from '@/pages/TimeCapsuleView';
import Settings from '@/pages/Settings';
import ProtocolSettings from '@/pages/ProtocolSettings';
import { MyFamilyPage as MyFamily } from '@/pages/MyFamily';
import Family from '@/pages/Family';
import FamilyProtection from '@/pages/FamilyProtection';
import EmergencyAccess from '@/pages/EmergencyAccess';
import EmergencyVerification from '@/pages/EmergencyVerification';
import EmergencyConfirmation from '@/pages/EmergencyConfirmation';
import SurvivorAccess from '@/pages/SurvivorAccess';
import SurvivorManual from '@/pages/SurvivorManual';
import SocialCollaborationPage from '@/pages/SocialCollaborationPage';
import { SecurityDeepDivePage } from '@/pages/SecurityDeepDivePage';
import MonitoringPage from '@/pages/MonitoringPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import IntelligentOrganizer from '@/pages/IntelligentOrganizer';
import ComponentShowcase from '@/pages/ComponentShowcase';
import Performance from '@/pages/Performance';
import { WillManagement } from '@/pages/WillManagement';

// Onboarding Pages
import { OnboardingWrapper } from '@/components/onboarding/OnboardingWrapper';

// Test Pages
import TestNotifications from '@/pages/TestNotifications';
import WillWizardCombinations from '@/pages/test/WillWizardCombinations';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div role='alert'>
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary fallbackRender={ErrorFallback}>
      <I18nextProvider i18n={i18n}>
        <Suspense fallback={<div>Loading translations...</div>}>
          <ClerkProvider>
            <Router>
              <SkipLinks />
              <Routes>
                {/* Public Routes */}
                <Route path='/' element={<LandingPage />} />
                <Route path='/sign-in/*' element={<SignInPage />} />
                <Route path='/sign-up/*' element={<SignUpPage />} />
                <Route path='/blog' element={<Blog />} />
                <Route path='/blog/:slug' element={<BlogArticle />} />
                <Route path='/terms' element={<Terms />} />
                <Route path='/privacy' element={<Privacy />} />

                {/* Protected Routes with Dashboard Layout */}
                <Route
                  path='/dashboard'
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Index />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path='/vault'
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Vault />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path='/guardians'
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Guardians />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path='/legacy'
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Legacy />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path='/time-capsule'
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <TimeCapsule />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path='/time-capsule/:id'
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <TimeCapsuleView />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path='/settings'
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Settings />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path='/protocol-settings'
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <ProtocolSettings />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path='/my-family'
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <MyFamily />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path='/family'
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Family />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path='/family-protection'
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <FamilyProtection />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path='/emergency-access'
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <EmergencyAccess />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path='/emergency-verification'
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <EmergencyVerification />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path='/emergency-confirmation'
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <EmergencyConfirmation />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path='/survivor-access'
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <SurvivorAccess />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path='/survivor-manual'
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <SurvivorManual />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path='/social-collaboration'
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <SocialCollaborationPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path='/security-deep-dive'
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <SecurityDeepDivePage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path='/monitoring'
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <MonitoringPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path='/analytics'
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <AnalyticsPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path='/intelligent-organizer'
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <IntelligentOrganizer />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path='/component-showcase'
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <ComponentShowcase />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path='/performance'
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Performance />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path='/will-management'
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <WillManagement />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path='/onboarding'
                  element={
                    <ProtectedRoute>
                      <OnboardingWrapper>
                        <div>Onboarding content</div>
                      </OnboardingWrapper>
                    </ProtectedRoute>
                  }
                />

                {/* Test Routes */}
                <Route
                  path='/test-notifications'
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <TestNotifications />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path='/test/will-wizard-combinations'
                  element={
                    <LocalizationProvider>
                      <WillWizardCombinations />
                    </LocalizationProvider>
                  }
                />

                {/* 404 Route */}
                <Route path='*' element={<NotFound />} />
              </Routes>
            </Router>
          </ClerkProvider>
        </Suspense>
      </I18nextProvider>
    </ErrorBoundary>
  );
}
