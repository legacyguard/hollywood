import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SofiaChat from "@/components/sofia/SofiaChat";
import SofiaFloatingButton from "@/components/sofia/SofiaFloatingButton";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSofiaOpen, setIsSofiaOpen] = useState(false);

  const toggleSofia = () => {
    setIsSofiaOpen(!isSofiaOpen);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header with Sidebar Trigger */}
          <header className="lg:hidden h-16 flex items-center px-4 border-b border-card-border bg-card">
            <SidebarTrigger className="mr-4" />
            <h1 className="font-semibold text-card-foreground">LegacyGuard</h1>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 bg-background">
            {children}
          </main>
        </div>

        {/* Sofia AI Assistant */}
        <SofiaFloatingButton 
          onToggleChat={toggleSofia}
          isChatOpen={isSofiaOpen}
        />
        <SofiaChat 
          isOpen={isSofiaOpen}
          onClose={() => setIsSofiaOpen(false)}
          variant="floating"
        />
      </div>
    </SidebarProvider>
  );
}