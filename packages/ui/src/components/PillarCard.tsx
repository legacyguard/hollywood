import React from 'react';
import { 
  Card, 
  H3, 
  Paragraph, 
  Button, 
  Stack, 
  View, 
  styled,
  GetProps,
  AnimatePresence
} from 'tamagui';
import { Lucide, LucideIcon } from 'lucide-react-native';

// Styled components for PillarCard
const PillarCardContainer = styled(Card, {
  name: 'PillarCard',
  padding: '$6',
  borderRadius: '$4',
  backgroundColor: '$background',
  borderWidth: 1,
  borderColor: '$borderColor',
  overflow: 'hidden',
  position: 'relative',
  
  variants: {
    isActive: {
      true: {
        borderColor: '$primaryBlue',
        borderWidth: 2,
      },
    },
    isLocked: {
      true: {
        opacity: 0.6,
      },
    },
  },
  
  pressStyle: {
    scale: 0.98,
  },
  
  hoverStyle: {
    borderColor: '$primaryBlueLight',
    shadowColor: '$shadowColor',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
});

const IconContainer = styled(View, {
  width: 56,
  height: 56,
  borderRadius: '$3',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '$4',
  
  variants: {
    isActive: {
      true: {
        backgroundColor: '$primaryBlue',
      },
      false: {
        backgroundColor: '$gray2',
      },
    },
    isLocked: {
      true: {
        backgroundColor: '$gray4',
      },
    },
  },
});

const LockBadge = styled(View, {
  position: 'absolute',
  top: 12,
  right: 12,
  paddingHorizontal: '$3',
  paddingVertical: '$1',
  backgroundColor: '$gray4',
  borderRadius: '$10',
  zIndex: 10,
});

const ActiveGradient = styled(View, {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: '$primaryBlue',
  opacity: 0.05,
  borderRadius: '$4',
});

export interface PillarCardProps extends GetProps<typeof PillarCardContainer> {
  title: string;
  subtitle?: string;
  icon: LucideIcon | string;
  isActive?: boolean;
  isLocked?: boolean;
  children?: React.ReactNode;
  actionButton?: {
    text: string;
    onPress?: () => void;
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
  ...props
}: PillarCardProps) {
  const IconComponent = typeof icon === 'string' 
    ? Lucide[icon as keyof typeof Lucide] || Lucide.HelpCircle
    : icon;

  return (
    <PillarCardContainer 
      isActive={isActive} 
      isLocked={isLocked}
      animation="medium"
      {...props}
    >
      {/* Active card gradient background */}
      <AnimatePresence>
        {isActive && (
          <ActiveGradient 
            animation="medium"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Lock badge for locked cards */}
      {isLocked && (
        <LockBadge>
          <Paragraph size="$1" fontWeight="600" color="$gray8">
            Coming Soon
          </Paragraph>
        </LockBadge>
      )}

      <Stack space="$4" zIndex={1}>
        {/* Icon */}
        <IconContainer 
          isActive={isActive} 
          isLocked={isLocked}
          animation="medium"
        >
          <IconComponent 
            size={28} 
            color={isActive ? '#ffffff' : isLocked ? '#6b7280' : '#1e40af'} 
          />
        </IconContainer>

        {/* Title and subtitle */}
        <Stack space="$2">
          <H3 size="$6" fontWeight="700" color="$color">
            {title}
          </H3>
          {subtitle && (
            <Paragraph size="$3" color="$gray6" lineHeight="$3">
              {subtitle}
            </Paragraph>
          )}
        </Stack>

        {/* Content slot */}
        {children && (
          <View>
            {children}
          </View>
        )}

        {/* Action button */}
        {actionButton && !isLocked && (
          <Button
            size="$3"
            variant={isActive ? 'primary' : 'outlined'}
            onPress={actionButton.onPress}
            animation="medium"
            pressStyle={{ scale: 0.96 }}
          >
            {actionButton.text}
          </Button>
        )}
      </Stack>
    </PillarCardContainer>
  );
}

// Export styled components for customization
export { PillarCardContainer, IconContainer, LockBadge, ActiveGradient };
