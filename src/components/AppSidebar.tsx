import { Icon, IconMap } from "@/components/ui/icon-library";
import { LegacyGuardLogo } from "./LegacyGuardLogo";
import { NavLink } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar-hooks";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: "dashboard" },
  { title: "My Vault", url: "/vault", icon: "vault" },
  { title: "Documents", url: "/documents", icon: "documents" },
  { title: "AI Organizer", url: "/intelligent-organizer", icon: "brain" },
  { title: "My Family", url: "/family", icon: "users" },
  { title: "Legacy", url: "/legacy", icon: "legacy" },
  { title: "Timeline", url: "/timeline", icon: "timeline" },
  { title: "Wishes", url: "/wishes", icon: "wishes" },
  { title: "Protection", url: "/protection", icon: "protection" },
  { title: "Settings", url: "/settings", icon: "settings" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user } = useUser();

  const getNavClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-sidebar-accent text-sidebar-text font-medium"
        : "text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-text"
    }`;

  return (
    <Sidebar className="border-r-0 bg-sidebar-primary">
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-6 border-b border-sidebar-accent/20">
          <div className="flex items-center gap-3">
            <LegacyGuardLogo />
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sidebar-text font-semibold text-lg font-heading">
                  LegacyGuard
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarContent className="px-4 py-6">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="p-0">
                      <NavLink to={item.url} end className={getNavClasses}>
                        <Icon name={item.icon as keyof typeof IconMap} className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* User Profile Section */}
        <div className="p-4 mt-auto border-t border-sidebar-accent/20">
          <div className="flex items-center gap-3">
            <UserButton 
              afterSignOutUrl="/sign-in"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                  userButtonTrigger: "focus:shadow-none",
                }
              }}
            />
            {!collapsed && user && (
              <div className="flex-1">
                <p className="text-sm font-medium text-sidebar-text">
                  {user.firstName || user.username || 'User'}
                </p>
                <p className="text-xs text-sidebar-muted">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Sidebar>
  );
}