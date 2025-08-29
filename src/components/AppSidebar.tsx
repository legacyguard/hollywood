import { Icon, type IconMap } from '@/components/ui/icon-library';
import { LegacyGuardLogo } from './LegacyGuardLogo';
import { NavLink } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useSidebar } from '@/components/ui/sidebar-hooks';

const navigationItems = [
  { title: 'Dashboard', url: '/dashboard', icon: 'dashboard' },
  { title: 'My Vault', url: '/vault', icon: 'vault' },
  { title: 'Documents', url: '/documents', icon: 'documents' },
  { title: 'AI Organizer', url: '/intelligent-organizer', icon: 'brain' },
  { title: 'Analytics', url: '/analytics', icon: 'chart' },
  { title: 'My Family', url: '/family', icon: 'users' },
  { title: 'Legacy', url: '/legacy', icon: 'legacy' },
  { title: 'Time Capsule', url: '/time-capsule', icon: 'heart' },
  { title: 'Timeline', url: '/timeline', icon: 'timeline' },
  { title: 'Wishes', url: '/wishes', icon: 'wishes' },
  { title: 'Family Shield', url: '/family-protection', icon: 'protection' },
  { title: 'Settings', url: '/settings', icon: 'settings' },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { user } = useUser();

  const getNavClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-sidebar-accent text-sidebar-text font-medium'
        : 'text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-text'
    }`;

  return (
    <Sidebar className='border-r-0 bg-sidebar-primary'>
      <div className='flex flex-col h-full'>
        {/* Logo Section */}
        <motion.div
          className='p-6 border-b border-sidebar-accent/20'
          whileHover={{  backgroundColor: 'rgba(var(--sidebar-accent), 0.05)'  }}
          transition={{  duration: 0.2  }}
        >
          <div className='flex items-center gap-3'>
            <motion.div
              whileHover={{  scale: 1.05, rotate: 5  }}
              transition={{  duration: 0.3, ease: 'easeInOut'  }}
            >
              <LegacyGuardLogo />
            </motion.div>
            <AnimatePresence mode='wait'>
              {!collapsed && (
                <motion.div
                  className='flex flex-col'
                  initial={{  opacity: 0, width: 0  }}
                  animate={{  opacity: 1, width: 'auto'  }}
                  exit={{  opacity: 0, width: 0  }}
                  transition={{  duration: 0.3  }}
                >
                  <span className='text-sidebar-text font-semibold text-lg font-heading'>
                    LegacyGuard
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Navigation */}
        <SidebarContent className='px-4 py-6'>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item, index) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className='p-0'>
                      <motion.div
                        initial={{  opacity: 0, x: -20  }}
                        animate={{  opacity: 1, x: 0  }}
                        transition={{  duration: 0.3, delay: index * 0.05  }}
                      >
                        <NavLink to={item.url} end className={getNavClasses}>
                          <motion.div
                            whileHover={{  scale: 1.1  }}
                            whileTap={{  scale: 0.95  }}
                            transition={{  duration: 0.2  }}
                          >
                            <Icon
                              name={item.icon as keyof typeof IconMap}
                              className='w-5 h-5 flex-shrink-0'
                            />
                          </motion.div>
                          <AnimatePresence mode='wait'>
                            {!collapsed && (
                              <motion.span
                                className='text-sm font-medium'
                                initial={{  opacity: 0, width: 0  }}
                                animate={{  opacity: 1, width: 'auto'  }}
                                exit={{  opacity: 0, width: 0  }}
                                transition={{  duration: 0.2  }}
                              >
                                {item.title}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </NavLink>
                      </motion.div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* User Profile Section */}
        <motion.div
          className='p-4 mt-auto border-t border-sidebar-accent/20'
          whileHover={{  backgroundColor: 'rgba(var(--sidebar-accent), 0.05)'  }}
          transition={{  duration: 0.2  }}
        >
          <div className='flex items-center gap-3'>
            <motion.div
              whileHover={{  scale: 1.05  }}
              transition={{  duration: 0.2  }}
            >
              <UserButton
                afterSignOutUrl='/sign-in'
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8',
                    userButtonTrigger: 'focus:shadow-none',
                  },
                }}
              />
            </motion.div>
            <AnimatePresence mode='wait'>
              {!collapsed && user && (
                <motion.div
                  className='flex-1'
                  initial={{  opacity: 0, width: 0  }}
                  animate={{  opacity: 1, width: 'auto'  }}
                  exit={{  opacity: 0, width: 0  }}
                  transition={{  duration: 0.3  }}
                >
                  <p className='text-sm font-medium text-sidebar-text'>
                    {user.firstName || user.username || 'User'}
                  </p>
                  <p className='text-xs text-sidebar-muted'>
                    {user.primaryEmailAddress?.emailAddress}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </Sidebar>
  );
}
