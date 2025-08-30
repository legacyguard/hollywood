import { Icon, type IconName } from '@/components/ui/icon-library';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PillarCardProps {
  title: string;
  subtitle?: string;
  icon: IconName;
  isActive?: boolean;
  isLocked?: boolean;
  children?: React.ReactNode;
  actionButton?: {
    text: string;
    onClick?: () => void;
    href?: string;
  };
}

export function PillarCard({
  title,
  subtitle,
  icon,
  isActive = false,
  isLocked = false,
  children,
  actionButton,
}: PillarCardProps) {
  return (
    <div
      className={cn(
        'pillar-card rounded-2xl p-8 transition-all duration-300 hover:shadow-xl relative overflow-hidden',
        isActive && 'ring-2 ring-primary/20',
        isLocked && 'opacity-60'
      )}
    >
      {/* Background Gradient for Active Card */}
      {isActive && (
        <div className='absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl' />
      )}

      {/* Lock Badge */}
      {isLocked && (
        <div className='absolute top-4 right-4 px-3 py-1 bg-status-locked text-status-locked-foreground text-xs font-medium rounded-full'>
          Coming Soon
        </div>
      )}

      <div className='relative z-10'>
        {/* Icon */}
        <div
          className={cn(
            'w-16 h-16 rounded-2xl flex items-center justify-center mb-6',
            isActive
              ? 'bg-primary text-primary-foreground'
              : isLocked
                ? 'bg-status-locked text-status-locked-foreground'
                : 'bg-primary/10 text-primary'
          )}
        >
          <Icon name={icon} className='w-8 h-8' />
        </div>

        {/* Title Section */}
        <div className='mb-6'>
          <h3 className='text-xl font-bold font-heading text-card-foreground mb-2'>
            {title}
          </h3>
          {subtitle && (
            <p className='text-sm text-muted-foreground leading-relaxed'>
              {subtitle}
            </p>
          )}
        </div>

        {/* Content */}
        {children && <div className='mb-6'>{children}</div>}

        {/* Action Button */}
        {actionButton &&
          !isLocked &&
          (actionButton.href ? (
            <a
              href={actionButton.href}
              className='inline-flex items-center justify-center rounded-md border border-primary/20 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground'
            >
              {actionButton.text}
            </a>
          ) : (
            <Button
              variant="outline"
              size='sm'
              onClick={actionButton.onClick}
              className='border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground'
            >
              {actionButton.text}
            </Button>
          ))}
      </div>
    </div>
  );
}
