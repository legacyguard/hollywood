/**
 * Icon Type Fixes and Mappings
 * This file provides proper type definitions for Lucide icons
 */

import type { LucideIcon } from 'lucide-react';

// Proper icon type mapping
export type IconName =
  | 'link'
  | 'search'
  | 'video'
  | 'circle'
  | 'filter'
  | 'key'
  | 'x'
  | 'download'
  | 'loading'
  | 'list'
  | 'send'
  | 'grid'
  | 'copy'
  | 'card'
  | 'warning'
  | 'info'
  | 'help'
  | 'file'
  | 'home'
  | 'user'
  | 'settings'
  | 'mail'
  | 'phone'
  | 'map-pin'
  | 'calendar'
  | 'clock'
  | 'heart'
  | 'shield'
  | 'crown'
  | 'file-text'
  | 'alert-circle'
  | 'check-circle'
  | 'save'
  | 'edit'
  | 'trash'
  | 'plus'
  | 'minus'
  | 'arrow-up'
  | 'arrow-down'
  | 'arrow-left'
  | 'arrow-right'
  | 'chevron-up'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'menu'
  | 'close'
  | 'maximize'
  | 'minimize'
  | 'refresh'
  | 'play'
  | 'pause'
  | 'stop'
  | 'volume'
  | 'volume-x'
  | 'volume-2'
  | 'headphones'
  | 'message-square'
  | 'external-link'
  | 'book-open'
  | 'archive'
  | 'baby'
  | 'scroll'
  | 'checkCircle'
  | 'alertCircle'
  | 'save'
  | 'notifications'
  | 'play-circle'
  | 'maximize'
  | 'triangle-exclamation';

// Icon component type
export type IconComponent = LucideIcon;

// Props for icon components
export interface IconProps {
  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// Safe icon mapping
export const iconMap: Record<string, IconName> = {
  'check-circle': 'checkCircle',
  'alert-circle': 'alertCircle',
  'triangle-exclamation': 'triangle-exclamation',
  'play-circle': 'play-circle',
  'book-open': 'book-open',
  'external-link': 'external-link',
  'message-square': 'message-square',
  'headphones': 'headphones',
  'volume': 'volume',
  'volume-x': 'volume-x',
  'volume-2': 'volume-2',
  'archive': 'archive',
  'baby': 'baby',
  'scroll': 'scroll',
  'notifications': 'notifications',
  'maximize': 'maximize'
};
