import {
  LayoutDashboard,
  Vault,
  Users,
  Gift,
  Settings,
  FileText,
  Calendar,
  Heart,
  Shield,
  CheckCircle,
  Infinity as InfinityIcon,
  Plus,
  SidebarOpen,
  ArrowRight,
  Lock,
  Unlock,
  AlertCircle,
  Info,
  HelpCircle,
  Star,
  Home,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Copy,
  Share,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  X,
  Check,
  Circle,
  Dot,
  GripVertical,
  PanelLeft,
  Search as SearchIcon,
  Bot,
  User,
  Send,
  Loader2,
  Sparkles,
} from "lucide-react";

// Export all icons for direct use
export {
  LayoutDashboard,
  Vault,
  Users,
  Gift,
  Settings,
  FileText,
  Calendar,
  Heart,
  Shield,
  CheckCircle,
  InfinityIcon,
  Plus,
  SidebarOpen,
  ArrowRight,
  Lock,
  Unlock,
  AlertCircle,
  Info,
  HelpCircle,
  Star,
  Home,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Copy,
  Share,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  X,
  Check,
  Circle,
  Dot,
  GripVertical,
  PanelLeft,
  SearchIcon,
  Bot,
  User,
  Send,
  Loader2,
  Sparkles,
};

// Icon mapping for semantic usage
export const IconMap = {
  // Navigation
  dashboard: LayoutDashboard,
  vault: Vault,
  documents: FileText,
  guardians: Users,
  legacy: Gift,
  timeline: Calendar,
  wishes: Heart,
  protection: Shield,
  settings: Settings,
  
  // Actions
  add: Plus,
  edit: Edit,
  delete: Trash2,
  copy: Copy,
  share: Share,
  download: Download,
  upload: Upload,
  search: SearchIcon,
  filter: Filter,
  
  // Status
  success: CheckCircle,
  warning: AlertCircle,
  info: Info,
  help: HelpCircle,
  locked: Lock,
  unlocked: Unlock,
  
  // UI Elements
  close: X,
  check: Check,
  circle: Circle,
  dot: Dot,
  arrowRight: ArrowRight,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  more: MoreHorizontal,
  
  // Legacy Specific
  infinity: InfinityIcon,
  star: Star,
  home: Home,
  eye: Eye,
  eyeOff: EyeOff,
  grip: GripVertical,
  panelLeft: PanelLeft,
  
  // Sofia AI specific
  bot: Bot,
  user: User,
  send: Send,
  'loader-2': Loader2,
  sparkles: Sparkles,
} as const;

// Type for icon names
export type IconName = keyof typeof IconMap;

// Icon component with consistent sizing
interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 24, className }: IconProps) {
  const IconComponent = IconMap[name];
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in IconMap`);
    return null;
  }
  
  return <IconComponent size={size} className={className} />;
}

// Predefined icon sizes
export const IconSizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
} as const;

export type IconSize = keyof typeof IconSizes;
