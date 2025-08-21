import { LayoutDashboard, Vault, Users, Gift, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "My Vault", url: "/vault", icon: Vault },
  { title: "Guardians", url: "/guardians", icon: Users },
  { title: "Legacy", url: "/legacy", icon: Gift },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

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
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <div className="w-5 h-5 bg-primary-foreground rounded-sm"></div>
            </div>
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
                        <item.icon className="w-5 h-5 flex-shrink-0" />
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
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-medium text-primary-foreground">
              JN
            </div>
            {!collapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium text-sidebar-text">Jana Nováková</p>
                <p className="text-xs text-sidebar-muted">Personal Account</p>
              </div>
            )}
            {!collapsed && (
              <button className="p-1.5 rounded-md hover:bg-sidebar-accent/50 text-sidebar-muted hover:text-sidebar-text transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </Sidebar>
  );
}