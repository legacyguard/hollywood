/**
 * PWA Install Prompt Component
 * Phase 7: Mobile & PWA Capabilities
 *
 * Provides a user-friendly interface for PWA installation
 * with device-specific instructions and fallback options.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Download,
  Smartphone,
  Monitor,
  Wifi,
  WifiOff,
  Shield,
  Zap,
  Bell,
  Camera,
  X,
  Info,
  ExternalLink
} from 'lucide-react';
import { type PWACapabilities, pwaService } from '@/lib/pwa/pwaService';
import { cn } from '@/lib/utils';

interface PWAInstallPromptProps {
  className?: string;
  autoShow?: boolean;
  showMinimal?: boolean;
}

export default function PWAInstallPrompt({
  className,
  autoShow = false,
  showMinimal = false
}: PWAInstallPromptProps) {
  const [capabilities, setCapabilities] = useState<PWACapabilities | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const updateCapabilities = () => {
      const caps = pwaService.getCapabilities();
      setCapabilities(caps);

      if (autoShow && caps.canInstall && !dismissed && !caps.isInstalled) {
        setIsVisible(true);
      }
    };

    updateCapabilities();

    // Listen for install availability changes
    const handleInstallChange = (_canInstall: boolean) => {
      updateCapabilities();
    };

    pwaService.addInstallListener(handleInstallChange);

    return () => {
      pwaService.removeInstallListener(handleInstallChange);
    };
  }, [autoShow, dismissed]);

  const handleInstall = async () => {
    if (!capabilities?.canInstall) {
      setShowInstructions(true);
      return;
    }

    try {
      setIsInstalling(true);
      const installed = await pwaService.installPWA();

      if (installed) {
        setIsVisible(false);
        setDismissed(true);
      }
    } catch (error) {
      console.error('PWA installation failed:', error);
      setShowInstructions(true);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  const getDeviceInstructions = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /ipad|iphone|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
    const isChrome = /chrome/.test(userAgent);

    if (isIOS && isSafari) {
      return {
        device: 'iOS Safari',
        icon: <Smartphone className="h-5 w-5" />,
        steps: [
          'Tap the Share button (square with arrow) at the bottom',
          'Scroll down and tap "Add to Home Screen"',
          'Tap "Add" to confirm installation'
        ]
      };
    }

    if (isAndroid && isChrome) {
      return {
        device: 'Android Chrome',
        icon: <Smartphone className="h-5 w-5" />,
        steps: [
          'Tap the three-dot menu in the top right',
          'Tap "Add to Home screen"',
          'Tap "Add" to confirm installation'
        ]
      };
    }

    if (isChrome) {
      return {
        device: 'Desktop Chrome',
        icon: <Monitor className="h-5 w-5" />,
        steps: [
          'Click the install icon in the address bar',
          'Or go to Chrome menu → "Install LegacyGuard"',
          'Click "Install" to confirm'
        ]
      };
    }

    return {
      device: 'Other Browser',
      icon: <Monitor className="h-5 w-5" />,
      steps: [
        'Look for an install prompt in your browser',
        'Check the address bar for an install icon',
        'Or bookmark this page for quick access'
      ]
    };
  };

  const features = [
    { icon: <WifiOff className="h-4 w-4" />, text: 'Work offline' },
    { icon: <Zap className="h-4 w-4" />, text: 'Faster loading' },
    { icon: <Bell className="h-4 w-4" />, text: 'Push notifications' },
    { icon: <Camera className="h-4 w-4" />, text: 'Camera access' },
    { icon: <Shield className="h-4 w-4" />, text: 'Enhanced security' }
  ];

  if (!capabilities || capabilities.isInstalled || (!capabilities.canInstall && !autoShow)) {
    return null;
  }

  if (showMinimal) {
    return (
      <div className={cn('fixed bottom-4 right-4 z-50', className)}>
        <Card className="max-w-sm shadow-lg border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Download className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Install LegacyGuard</p>
                <p className="text-xs text-gray-600">Quick access & offline use</p>
              </div>
              <div className="flex gap-1">
                <Button size="sm" onClick={handleInstall} disabled={isInstalling}>
                  {isInstalling ? '...' : 'Install'}
                </Button>
                <Button size="sm" variant="ghost" onClick={handleDismiss}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        Install App
      </Button>
    );
  }

  const instructions = getDeviceInstructions();

  return (
    <>
      <Card className={cn('max-w-md mx-auto shadow-lg border-blue-200', className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Install LegacyGuard</CardTitle>
                <CardDescription>Get the full app experience</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleDismiss}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {features.map((feature, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {feature.icon}
                {feature.text}
              </Badge>
            ))}
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Installing the app gives you faster access, offline functionality, and push notifications for important updates.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              {capabilities?.isOnline ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-gray-400" />
              )}
              <span>{capabilities?.isOnline ? 'Online' : 'Offline'}</span>
            </div>

            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span>Secure Context</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleInstall}
              disabled={isInstalling}
              className="flex-1"
            >
              {isInstalling ? (
                'Installing...'
              ) : capabilities?.canInstall ? (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Install Now
                </>
              ) : (
                <>
                  <Info className="h-4 w-4 mr-2" />
                  Show Instructions
                </>
              )}
            </Button>

            <Button variant="outline" onClick={handleDismiss}>
              Later
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Manual Installation Instructions Dialog */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {instructions.icon}
              Install on {instructions.device}
            </DialogTitle>
            <DialogDescription>
              Follow these steps to install LegacyGuard on your device
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              {instructions.steps.map((step, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-600 flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-700">{step}</p>
                </div>
              ))}
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                If you don't see install options, try refreshing the page or using a supported browser like Chrome or Safari.
              </AlertDescription>
            </Alert>

            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Benefits of Installing:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Faster app startup and navigation</li>
                <li>• Works offline for viewing documents</li>
                <li>• Receive important security notifications</li>
                <li>• Native app-like experience</li>
                <li>• Secure local storage</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInstructions(false)}>
              Got it
            </Button>
            <Button asChild>
              <a href="https://web.dev/install-criteria/" target="_blank" rel="noopener noreferrer">
                Learn More
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
