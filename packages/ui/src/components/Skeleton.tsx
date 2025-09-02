import React from 'react'
import { type GetProps, styled, View } from 'tamagui'
import { YStack, XStack } from './Layout'

// Base Skeleton component with animation
export const Skeleton = styled(View, {
  name: 'LGSkeleton',
  backgroundColor: '$gray3',
  borderRadius: '$1',
  overflow: 'hidden',
  position: 'relative',

  // Add shimmer animation
  animation: 'lazy',
  animateOnly: ['opacity'],
  opacity: 0.7,

  enterStyle: {
    opacity: 0.5,
  },

  exitStyle: {
    opacity: 0.5,
  },

  variants: {
    variant: {
      text: {
        height: '$4',
        borderRadius: 4,
      },
      title: {
        height: '$6',
        borderRadius: 4,
      },
      button: {
        height: '$10',
        borderRadius: '$2',
      },
      avatar: {
        borderRadius: 9999,
      },
      card: {
        borderRadius: '$2',
      },
      image: {
        borderRadius: '$2',
      },
    },
    width: {
      small: { width: '25%' },
      medium: { width: '50%' },
      large: { width: '75%' },
      full: { width: '100%' },
    },
    height: {
      small: { height: '$8' },
      medium: { height: '$12' },
      large: { height: '$16' },
      xlarge: { height: '$20' },
    },
    animated: {
      true: {
        animation: 'slow',
        animateOnly: ['backgroundColor'],
        backgroundColor: '$gray3',
        enterStyle: {
          backgroundColor: '$gray2',
        },
        exitStyle: {
          backgroundColor: '$gray4',
        },
      },
    },
  } as const,
})

// Skeleton Text - for loading text
export const SkeletonText = ({ lines = 3, spacing = '$2', ...props }: {
  lines?: number
  spacing?: GetProps<typeof YStack>['space']
} & GetProps<typeof YStack>) => {
  return (
    <YStack space={spacing} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? 'large' : 'full'}
        />
      ))}
    </YStack>
  )
}

// Skeleton Avatar
export const SkeletonAvatar = styled(Skeleton, {
  name: 'LGSkeletonAvatar',
  variant: 'avatar',
  width: '$10',
  height: '$10',

  variants: {
    size: {
      small: {
        width: '$8',
        height: '$8',
      },
      medium: {
        width: '$10',
        height: '$10',
      },
      large: {
        width: '$12',
        height: '$12',
      },
      xlarge: {
        width: '$16',
        height: '$16',
      },
    },
  } as const,

  defaultVariants: {
    size: 'medium',
  },
})

// Skeleton Card
export const SkeletonCard = ({
  showAvatar = true,
  showTitle = true,
  showDescription = true,
  ...props
}: {
  showAvatar?: boolean
  showTitle?: boolean
  showDescription?: boolean
} & GetProps<typeof View>) => {
  return (
    <View
      padding="$4"
      borderRadius="$2"
      borderWidth={1}
      borderColor="$borderColor"
      backgroundColor="$background"
      {...props}
    >
      <XStack space="small" alignItems="flex-start">
        {showAvatar && <SkeletonAvatar />}
        <YStack flex={1} space="small">
          {showTitle && <Skeleton variant="title" width="large" />}
          {showDescription && <SkeletonText lines={2} />}
        </YStack>
      </XStack>
    </View>
  )
}

// Skeleton List
export const SkeletonList = ({
  items = 3,
  spacing = '$3',
  renderItem,
  ...props
}: {
  items?: number
  spacing?: GetProps<typeof YStack>['space']
  renderItem?: (index: number) => React.ReactNode
} & GetProps<typeof YStack>) => {
  return (
    <YStack space={spacing} {...props}>
      {Array.from({ length: items }).map((_, i) => (
        <View key={i}>
          {renderItem ? renderItem(i) : <SkeletonCard />}
        </View>
      ))}
    </YStack>
  )
}

// Skeleton Button
export const SkeletonButton = styled(Skeleton, {
  name: 'LGSkeletonButton',
  variant: 'button',

  variants: {
    size: {
      small: {
        height: '$8',
        width: '$20',
      },
      medium: {
        height: '$10',
        width: '$25',
      },
      large: {
        height: '$12',
        width: '$30',
      },
    },
    fullWidth: {
      true: {
        width: '100%',
      },
    },
  } as const,

  defaultVariants: {
    size: 'medium',
    fullWidth: false,
  },
})

// Skeleton Image
export const SkeletonImage = styled(Skeleton, {
  name: 'LGSkeletonImage',
  variant: 'image',
  width: '100%',

  variants: {
    aspectRatio: {
      square: {
        aspectRatio: 1,
      },
      video: {
        aspectRatio: 16 / 9,
      },
      portrait: {
        aspectRatio: 3 / 4,
      },
      landscape: {
        aspectRatio: 4 / 3,
      },
    },
  } as const,

  defaultVariants: {
    aspectRatio: 'square',
  },
})

// Export types
export type SkeletonProps = GetProps<typeof Skeleton>
export type SkeletonTextProps = Parameters<typeof SkeletonText>[0]
export type SkeletonAvatarProps = GetProps<typeof SkeletonAvatar>
export type SkeletonCardProps = Parameters<typeof SkeletonCard>[0]
export type SkeletonListProps = Parameters<typeof SkeletonList>[0]
export type SkeletonButtonProps = GetProps<typeof SkeletonButton>
export type SkeletonImageProps = GetProps<typeof SkeletonImage>
