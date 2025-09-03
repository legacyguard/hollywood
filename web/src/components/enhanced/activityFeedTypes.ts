export interface ActivityItem {
  id: string;
  type: 'document' | 'family' | 'guardian' | 'will' | 'security' | 'system';
  action: string;
  description: string;
  timestamp: Date;
  icon?: string;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  metadata?: Record<string, unknown>;
  user?: {
    name: string;
    avatar?: string;
  };
}

export interface ActivityFeedProps {
  activities: ActivityItem[];
  title?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
  maxHeight?: string;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}
