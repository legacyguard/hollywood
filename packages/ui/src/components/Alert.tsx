import React from 'react'
import { type GetProps, styled, Text } from 'tamagui'
import { AlertCircle, CheckCircle, Info, XCircle, X } from '@tamagui/lucide-icons'
import { Button } from './Button'
import { YStack, XStack } from './Layout'

// Alert Container
export const Alert = styled(YStack, {
  name: 'LGAlert',
  borderRadius: '$2',
  padding: '$4',
  borderWidth: 1,
  borderColor: '$borderColor',
  backgroundColor: '$background',

  variants: {
    variant: {
      info: {
        borderColor: '$info',
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
      },
      success: {
        borderColor: '$success',
        backgroundColor: 'rgba(34, 197, 94, 0.05)',
      },
      warning: {
        borderColor: '$warning',
        backgroundColor: 'rgba(245, 158, 11, 0.05)',
      },
      error: {
        borderColor: '$error',
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
      },
      default: {
        borderColor: '$borderColor',
        backgroundColor: '$background',
      },
    },
    size: {
      small: {
        padding: '$2',
      },
      medium: {
        padding: '$4',
      },
      large: {
        padding: '$6',
      },
    },
  } as const,

  defaultVariants: {
    variant: 'default',
    size: 'medium',
  },
})

// Alert Icon
export const AlertIcon = ({ variant = 'default', ...props }: { variant?: string } & any) => {
  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertCircle,
    error: XCircle,
    default: Info,
  }

  const Icon = icons[variant as keyof typeof icons] || icons.default
  const color = variant === 'default' ? '$gray6' : `$${variant}`

  return <Icon size={20} color={color} {...props} />
}

// Alert Title
export const AlertTitle = styled(Text, {
  name: 'LGAlertTitle',
  fontSize: '$5',
  fontWeight: '600',
  color: '$color',
  marginBottom: '$1',
})

// Alert Description
export const AlertDescription = styled(Text, {
  name: 'LGAlertDescription',
  fontSize: '$4',
  color: '$gray6',
  lineHeight: 1.5,
})

// Alert Close Button
export const AlertCloseButton = ({ onPress, ...props }: any) => (
  <Button
    size="small"
    variant="ghost"
    circular
    icon={<X size={16} />}
    onPress={onPress}
    {...props}
  />
)

// Alert Component with composition
export const AlertBox = ({
  variant = 'default',
  title,
  description,
  showIcon = true,
  closable = false,
  onClose,
  children,
  ...props
}: {
  variant?: 'info' | 'success' | 'warning' | 'error' | 'default'
  title?: string
  description?: string
  showIcon?: boolean
  closable?: boolean
  onClose?: () => void
  children?: React.ReactNode
} & GetProps<typeof Alert>) => {
  return (
    <Alert variant={variant} {...props}>
      <XStack space="small" alignItems="flex-start">
        {showIcon && <AlertIcon variant={variant} />}
        <YStack flex={1} space="xs">
          {title && <AlertTitle>{title}</AlertTitle>}
          {description && <AlertDescription>{description}</AlertDescription>}
          {children}
        </YStack>
        {closable && <AlertCloseButton onPress={onClose} />}
      </XStack>
    </Alert>
  )
}

// Export types
export type AlertProps = GetProps<typeof Alert>
export type AlertTitleProps = GetProps<typeof AlertTitle>
export type AlertDescriptionProps = GetProps<typeof AlertDescription>
export type AlertBoxProps = Parameters<typeof AlertBox>[0]
