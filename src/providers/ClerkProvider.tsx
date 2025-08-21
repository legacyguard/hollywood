import { ClerkProvider as BaseClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Clerk Publishable Key");
}

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseClerkProvider
      publishableKey={clerkPubKey}
      appearance={{
        baseTheme: dark,
        elements: {
          formButtonPrimary: 'bg-primary hover:bg-primary-hover text-primary-foreground',
          card: 'bg-card',
          headerTitle: 'text-card-foreground',
          headerSubtitle: 'text-muted-foreground',
          socialButtonsBlockButton: 'bg-card border-card-border hover:bg-sidebar-accent',
          formFieldInput: 'bg-background border-card-border',
          footerActionLink: 'text-primary hover:text-primary-hover',
        },
        variables: {
          colorPrimary: 'hsl(221.2 83.2% 53.3%)',
          colorBackground: 'hsl(222.2 84% 4.9%)',
          colorInputBackground: 'hsl(222.2 84% 4.9%)',
          colorInputText: 'hsl(210 40% 98%)',
        }
      }}
    >
      {children}
    </BaseClerkProvider>
  );
}
