import { lazy, Suspense } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { PerformanceMonitor } from '@/components/monitoring/PerformanceMonitor';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { routerFutureConfig } from './lib/router';
import { ClerkProvider } from './providers/ClerkProvider';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { OnboardingWrapper } from './components/onboarding/OnboardingWrapper';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DocumentFilterProvider } from './contexts/DocumentFilterContext';
import { LocalizationProvider } from './contexts/LocalizationContext';
import SofiaContextProvider from './components/sofia/SofiaContextProvider';
import { FireflyProvider } from './contexts/FireflyContext';
import SofiaFirefly from './components/animations/SofiaFirefly';
import { PageLoader } from './components/ui/page-loader';

// Lazy load pages for better performance
const Index = lazy(() => import('@/pages/Index'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const ComponentShowcase = lazy(() => import('@/pages/ComponentShowcase'));
const LandingPage = lazy(() => import('@/pages/LandingPage').then(m => ({ default: m.LandingPage })));
const PrivacyPage = lazy(() => import('@/pages/Privacy').then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('@/pages/Terms').then(m => ({ default: m.TermsPage })));
const TermsOfService = lazy(() => import('@/pages/legal/TermsOfService').then(m => ({ default: m.TermsOfService })));
const PrivacyPolicy = lazy(() => import('@/pages/legal/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const SecurityPolicy = lazy(() => import('@/pages/legal/SecurityPolicy').then(m => ({ default: m.SecurityPolicy })));
const Onboarding = lazy(() => import('./pages/onboarding/Onboarding'));
const VaultPage = lazy(() => import('./pages/Vault'));
const GuardiansPage = lazy(() => import('./pages/Guardians'));
const LegacyPage = lazy(() => import('./pages/Legacy'));
const FamilyPage = lazy(() => import('./pages/Family'));
const FamilyProtectionPage = lazy(() => import('./pages/FamilyProtection'));
const TestNotifications = lazy(() => import('./pages/TestNotifications'));
const SignInPage = lazy(() => import('./pages/auth/SignIn'));
const SignUpPage = lazy(() => import('./pages/auth/SignUp'));
const TestOCRPage = lazy(() => import('./pages/test-ocr/TestOCRPage'));
const IntelligentOrganizer = lazy(() => import('./pages/IntelligentOrganizer'));
const SettingsPage = lazy(() => import('./pages/Settings'));
const FamilyShieldSettingsPage = lazy(() => import('./pages/ProtocolSettings'));
const FamilyGuidanceManualPage = lazy(() => import('./pages/SurvivorManual'));
const FamilyShieldAccessPage = lazy(() => import('./pages/EmergencyAccess'));
const TimeCapsulePage = lazy(() => import('./pages/TimeCapsule'));
const TimeCapsuleViewPage = lazy(() => import('./pages/TimeCapsuleView'));
const BlogPage = lazy(() => import('./pages/Blog'));
const BlogArticlePage = lazy(() => import('./pages/BlogArticle'));
const MonitoringPage = lazy(() => import('./pages/MonitoringPage'));

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <LocalizationProvider>
            {/* <EncryptionProvider> */}
            <BrowserRouter future={routerFutureConfig}>
              <DocumentFilterProvider>
                <SofiaContextProvider>
                  <FireflyProvider>
                    {/* <PasswordPrompt /> */}
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
                      {/* Public routes */}
                      <Route path='/' element={<LandingPage />} />
                      <Route path='/sign-in' element={<SignInPage />} />
                      <Route path='/sign-up' element={<SignUpPage />} />
                      <Route path='/auth/sign-in' element={<SignInPage />} />
                      <Route path='/auth/sign-up' element={<SignUpPage />} />
                      <Route path='/privacy' element={<PrivacyPage />} />
                      <Route path='/terms' element={<TermsPage />} />
                      <Route path='/terms-of-service' element={<TermsOfService />} />
                      <Route path='/privacy-policy' element={<PrivacyPolicy />} />
                      <Route path='/security-policy' element={<SecurityPolicy />} />
                      
                      {/* Blog routes */}
                      <Route path='/blog' element={<BlogPage />} />
                      <Route path='/blog/:slug' element={<BlogArticlePage />} />

                      {/* Component Showcase (for development) */}
                      <Route path='/showcase' element={<ComponentShowcase />} />
                      
                      {/* Monitoring Dashboard (for development) */}
                      <Route path='/monitoring' element={<MonitoringPage />} />

                      {/* Protected routes */}
                      <Route
                        path='/dashboard'
                        element={
                          <ProtectedRoute>
                            <OnboardingWrapper>
                              <Index />
                            </OnboardingWrapper>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/onboarding'
                        element={
                          <ProtectedRoute>
                            <Onboarding />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/vault'
                        element={
                          <ProtectedRoute>
                            <VaultPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/guardians'
                        element={
                          <ProtectedRoute>
                            <GuardiansPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/family-protection'
                        element={
                          <ProtectedRoute>
                            <FamilyProtectionPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/family'
                        element={
                          <ProtectedRoute>
                            <OnboardingWrapper>
                              <FamilyPage />
                            </OnboardingWrapper>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/legacy'
                        element={
                          <ProtectedRoute>
                            <LegacyPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/test-notifications'
                        element={
                          <ProtectedRoute>
                            <TestNotifications />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/test-ocr'
                        element={
                          <ProtectedRoute>
                            <TestOCRPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/intelligent-organizer'
                        element={
                          <ProtectedRoute>
                            <IntelligentOrganizer />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/settings'
                        element={
                          <ProtectedRoute>
                            <SettingsPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/protocol-settings'
                        element={
                          <ProtectedRoute>
                            <FamilyShieldSettingsPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/survivor-manual'
                        element={
                          <ProtectedRoute>
                            <FamilyGuidanceManualPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/time-capsule'
                        element={
                          <ProtectedRoute>
                            <TimeCapsulePage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Emergency access (public route with token verification) */}
                      <Route
                        path='/emergency-access/:token'
                        element={<FamilyShieldAccessPage />}
                      />

                      {/* Time Capsule public viewing (public route with token verification) */}
                      <Route
                        path='/time-capsule-view/:token'
                        element={<TimeCapsuleViewPage />}
                      />

                      {/* 404 route */}
                      <Route path='*' element={<NotFound />} />
                      </Routes>
                    </Suspense>

                    {/* Global Sofia Firefly */}
                    <SofiaFirefly />
                    
                    {/* Performance Monitoring */}
                    <PerformanceMonitor />
                  </FireflyProvider>
                </SofiaContextProvider>
              </DocumentFilterProvider>
            </BrowserRouter>
            {/* </EncryptionProvider> */}
          </LocalizationProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  </ErrorBoundary>
);

export default App;
