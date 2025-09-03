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
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
  Infinity as InfinityIcon,
  Plus,
  SidebarOpen,
  ArrowRight,
  Lock,
  Unlock,
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  Star,
  Home,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Edit3 as Pencil,
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
  Loader,
  Loader2 as Loading,
  Sparkles,
  DollarSign,
  CreditCard,
  PieChart,
  Mail,
  Phone,
  Video,
  Clock,
  Grid,
  List,
  TrendingUp,
  TrendingDown,
  Key,
  Car,
  Folder,
  File,
  UserPlus,
  Upload as FileUpload,
  RefreshCw,
  FilePlus,
  CreditCard as Card,
  Play,
  Brain,
  Database,
  Globe,
  Lightbulb,
  Inbox,
  Link,
  RotateCcw,
  XCircle,
  ArrowLeft,
} from 'lucide-react';

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
  ShieldCheck,
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
  Pencil,
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
  Loader,
  Sparkles,
  DollarSign,
  CreditCard,
  PieChart,
  Mail,
  Phone,
  Video,
  Clock,
  Grid,
  List,
  TrendingUp,
  TrendingDown,
  Key,
  Car,
  Folder,
  UserPlus,
  FileUpload,
  RefreshCw,
  FilePlus,
  Card,
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
  pencil: Pencil,
  delete: Trash2,
  trash: Trash2,
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
  'shield-check': ShieldCheck,

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
  users: Users,
  send: Send,
  loader: Loader,
  'loader-2': Loader2,
  sparkles: Sparkles,
  shield: Shield,
  x: X,

  // Communication & Media
  mail: Mail,
  phone: Phone,
  video: Video,
  clock: Clock,

  // Layout
  grid: Grid,
  list: List,

  // Financial
  financial: DollarSign,
  money: DollarSign,
  card: CreditCard,
  chart: PieChart,

  // Trends & Analytics
  trendingUp: TrendingUp,
  trendingDown: TrendingDown,

  // Security & Access
  key: Key,

  // New dashboard icons
  car: Car,
  folder: Folder,
  'user-plus': UserPlus,
  'file-upload': FileUpload,
  'refresh-cw': RefreshCw,
  'file-plus': FilePlus,
  'credit-card': Card,
  'alert-circle': AlertCircle,
  'alert-triangle': AlertTriangle,
  'shield-alert': ShieldAlert,

  // File icons
  file: File,
  'file-text': FileText,

  // Media controls
  play: Play,

  // Loading states
  loading: Loading,
  'loading-2': Loader2,

  // Aliases for common usage
  checkCircle: CheckCircle,
  heart: Heart,
  calendar: Calendar,

  // Additional icons
  brain: Brain,
  database: Database,
  globe: Globe,
  lightbulb: Lightbulb,
  inbox: Inbox,
  link: Link,
  plus: Plus,
  'rotate-ccw': RotateCcw,
  'x-circle': XCircle,
  'check-circle': CheckCircle,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  'eye-off': EyeOff,
  unlock: Unlock,
  'triangle-exclamation': AlertTriangle,
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
