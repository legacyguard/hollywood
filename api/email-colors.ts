// Semantic color tokens for transactional emails (inline styles)
// These mirror Tailwind design intent but are safe for email clients

export const EmailColors = {
  // Base
  textMain: '#334155', // slate-700
  background: '#f8fafc', // slate-50
  panelBackground: '#ffffff',
  panelBorder: '#e2e8f0', // slate-200

  // Brand/Primary
  brandStart: '#6366f1', // indigo-500
  brandEnd: '#8b5cf6', // violet-500
  brandLink: '#6366f1',

  // Accents and states
  infoBackground: '#f1f5f9', // slate-100
  mutedText: '#64748b', // slate-500
  headlineText: '#1e293b', // slate-800

  warningBackground: '#fef3c7', // amber-100
  warningBorder: '#f59e0b', // amber-500
  warningText: '#92400e', // amber-800
  warningSubtext: '#78350f', // amber-900

  success: '#059669', // emerald-600
  danger: '#dc2626', // red-600

  translucentWhite20: 'rgba(255, 255, 255, 0.2)'
} as const;

export const getUrgencyColor = (daysUntil: number): string => {
  return daysUntil <= 7 ? EmailColors.danger : EmailColors.success;
};


