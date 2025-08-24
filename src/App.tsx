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
import SofiaContextProvider from "./components/sofia/SofiaContextProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/onboarding/Onboarding";
import VaultPage from "./pages/Vault";
import GuardiansPage from "./pages/Guardians";
import LegacyPage from "./pages/Legacy";
import TestNotifications from "./pages/TestNotifications";
import SignInPage from "./pages/auth/SignIn";
import SignUpPage from "./pages/auth/SignUp";
import TestOCRPage from "./pages/test-ocr/TestOCRPage";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={routerFutureConfig}>
            <DocumentFilterProvider>
              <SofiaContextProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />
            
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
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </SofiaContextProvider>
            </DocumentFilterProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ClerkProvider>
  </ErrorBoundary>
);

export default App;
