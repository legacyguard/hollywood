import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routerFutureConfig } from "./lib/router";
import { ClerkProvider } from "./providers/ClerkProvider";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { OnboardingWrapper } from "./components/onboarding/OnboardingWrapper";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { DocumentFilterProvider } from "./contexts/DocumentFilterContext";
import { LocalizationProvider } from "./contexts/LocalizationContext";
import SofiaContextProvider from "./components/sofia/SofiaContextProvider";
// import { EncryptionProvider } from "@/hooks/encryption/useEncryption";
// import { PasswordPrompt } from "@/components/encryption/PasswordPrompt";
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import ComponentShowcase from '@/pages/ComponentShowcase';
import Onboarding from "./pages/onboarding/Onboarding";
import VaultPage from "./pages/Vault";
import GuardiansPage from "./pages/Guardians";
import LegacyPage from "./pages/Legacy";
import { MyFamilyPage } from "./pages/MyFamily";
import TestNotifications from "./pages/TestNotifications";
import SignInPage from "./pages/auth/SignIn";
import SignUpPage from "./pages/auth/SignUp";
import TestOCRPage from "./pages/test-ocr/TestOCRPage";
import IntelligentOrganizer from "./pages/IntelligentOrganizer";
import SettingsPage from "./pages/Settings";
import FamilyShieldSettingsPage from "./pages/ProtocolSettings";
import FamilyGuidanceManualPage from "./pages/SurvivorManual";
import FamilyShieldAccessPage from "./pages/EmergencyAccess";
import TimeCapsulePage from "./pages/TimeCapsule";
import TimeCapsuleViewPage from "./pages/TimeCapsuleView";

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
                    {/* <PasswordPrompt /> */}
      <Routes>
        {/* Public routes */}
        <Route path="/auth/sign-in" element={<SignInPage />} />
        <Route path="/auth/sign-up" element={<SignUpPage />} />

        {/* Component Showcase (for development) */}
        <Route path="/showcase" element={<ComponentShowcase />} />
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <OnboardingWrapper>
                  <Index />
                </OnboardingWrapper>
              </ProtectedRoute>
            } />
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            } />
            <Route path="/vault" element={
              <ProtectedRoute>
                <VaultPage />
              </ProtectedRoute>
            } />
            <Route path="/guardians" element={
              <ProtectedRoute>
                <GuardiansPage />
              </ProtectedRoute>
            } />
            <Route path="/family" element={
              <ProtectedRoute>
                <MyFamilyPage />
              </ProtectedRoute>
            } />
            <Route path="/legacy" element={
              <ProtectedRoute>
                <LegacyPage />
              </ProtectedRoute>
            } />
            <Route path="/test-notifications" element={
              <ProtectedRoute>
                <TestNotifications />
              </ProtectedRoute>
            } />
            <Route path="/test-ocr" element={
              <ProtectedRoute>
                <TestOCRPage />
              </ProtectedRoute>
            } />
            <Route path="/intelligent-organizer" element={
              <ProtectedRoute>
                <IntelligentOrganizer />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            <Route path="/protocol-settings" element={
              <ProtectedRoute>
                <FamilyShieldSettingsPage />
              </ProtectedRoute>
            } />
            <Route path="/survivor-manual" element={
              <ProtectedRoute>
                <FamilyGuidanceManualPage />
              </ProtectedRoute>
            } />
            <Route path="/time-capsule" element={
              <ProtectedRoute>
                <TimeCapsulePage />
              </ProtectedRoute>
            } />

            {/* Emergency access (public route with token verification) */}
            <Route path="/emergency-access/:token" element={<FamilyShieldAccessPage />} />

            {/* Time Capsule public viewing (public route with token verification) */}
            <Route path="/time-capsule-view/:token" element={<TimeCapsuleViewPage />} />

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
                    </Routes>
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
