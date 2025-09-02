import React from 'react';
import { Icon, type IconName } from '@/components/ui/icon-library';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  Button,
  YStack,
  H3,
  Paragraph,
  Box,
  Badge
} from '@legacyguard/ui';

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
  const { t } = useTranslation('ui/pillar-card');
  return (
    <Card
      padding="$8"
      borderRadius="$4"
      animation="medium"
      hoverStyle={{
        scale: 1.02,
        shadowColor: '$shadowColor',
        shadowRadius: 20,
        shadowOpacity: 0.2,
      }}
      pressStyle={{
        scale: 0.98,
      }}
      opacity={isLocked ? 0.6 : 1}
      borderWidth={isActive ? 2 : 0}
      borderColor={isActive ? '$primaryBlue' : undefined}
      position="relative"
      overflow="hidden"
    >
      {/* Background Gradient for Active Card */}
      {isActive && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          backgroundColor="$primaryBlue"
          opacity={0.05}
          borderRadius="$4"
        />
      )}

      {/* Lock Badge */}
      {isLocked && (
        <Badge
          variant="outline"
          position="absolute"
          top="$4"
          right="$4"
          zIndex={1}
        >
          {t('comingSoon')}
        </Badge>
      )}

      <CardContent>
        <YStack space="$6">
          {/* Icon */}
          <Box
            width="$16"
            height="$16"
            borderRadius="$4"
            backgroundColor={isActive ? '$primaryBlue' : isLocked ? '$gray5' : '$primaryBlue'}
            opacity={isActive || isLocked ? 1 : 0.1}
            alignItems="center"
            justifyContent="center"
          >
            <Icon name={icon} className='w-8 h-8' />
          </Box>

          {/* Title Section */}
          <YStack space="$2">
            <H3>{title}</H3>
            {subtitle && (
              <Paragraph size="$3" color="$gray6">
                {subtitle}
              </Paragraph>
            )}
          </YStack>

          {/* Content */}
          {children && <Box>{children}</Box>}

          {/* Action Button */}
          {actionButton && !isLocked && (
            <Button
              variant="outline"
              size="small"
              onPress={actionButton.onClick}
              {...(actionButton.href && { as: 'a', href: actionButton.href })}
            >
              {actionButton.text}
            </Button>
          )}
        </YStack>
      </CardContent>
    </Card>
  );
}
