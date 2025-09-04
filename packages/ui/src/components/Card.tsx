import { type GetProps, styled, Text, View } from 'tamagui';

// Main Card container
export const Card = styled(View, {
  name: 'LGCard',

  // Base styles
  backgroundColor: '$background',
  borderRadius: '$3',
  borderWidth: 1,
  borderColor: '$gray3',
  padding: '$4',
  shadowColor: '$shadowColor',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,

  // Animations
  animation: 'lazy',
  enterStyle: {
    opacity: 0,
    scale: 0.95,
  },
  exitStyle: {
    opacity: 0,
    scale: 0.95,
  },

  // Hover effects
  hoverStyle: {
    borderColor: '$gray4',
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  // Variants
  variants: {
    variant: {
      default: {
        backgroundColor: '$background',
        borderColor: '$gray3',
      },
      elevated: {
        backgroundColor: '$background',
        borderColor: 'transparent',
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      filled: {
        backgroundColor: '$gray2',
        borderColor: '$gray3',
      },
      premium: {
        backgroundColor: '$accentGold',
        borderColor: '$accentGoldDark',
        color: 'white',
      },
      success: {
        backgroundColor: '$primaryGreen',
        borderColor: '$primaryGreenDark',
        color: 'white',
      },
      danger: {
        backgroundColor: '$error',
        borderColor: '#b91c1c',
        color: 'white',
      },
      ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        shadowOpacity: 0,
      },
    },

    padding: {
      none: {
        padding: 0,
      },
      small: {
        padding: '$3',
      },
      medium: {
        padding: '$4',
      },
      large: {
        padding: '$5',
      },
      xlarge: {
        padding: '$6',
      },
    },

    clickable: {
      true: {
        cursor: 'pointer',
        pressStyle: {
          scale: 0.98,
          opacity: 0.9,
        },
      },
    },

    fullWidth: {
      true: {
        width: '100%',
      },
    },
  } as const,

  // Default variants
  defaultVariants: {
    variant: 'default',
    padding: 'medium',
    clickable: false,
    fullWidth: false,
  },
});

// Card Header
export const CardHeader = styled(View, {
  name: 'LGCardHeader',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '$3',
  paddingBottom: '$3',
  borderBottomWidth: 1,
  borderBottomColor: '$gray3',

  variants: {
    noBorder: {
      true: {
        borderBottomWidth: 0,
        paddingBottom: 0,
      },
    },
  },

  defaultVariants: {
    noBorder: false,
  },
});

// Card Title
export const CardTitle = styled(Text, {
  name: 'LGCardTitle',
  fontSize: '$6',
  fontWeight: '$5',
  color: '$color',
  fontFamily: '$heading',
});

// Card Description
export const CardDescription = styled(Text, {
  name: 'LGCardDescription',
  fontSize: '$4',
  color: '$gray6',
  fontFamily: '$body',
  marginTop: '$1',
});

// Card Content
export const CardContent = styled(View, {
  name: 'LGCardContent',
  flex: 1,
});

// Card Footer
export const CardFooter = styled(View, {
  name: 'LGCardFooter',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginTop: '$4',
  paddingTop: '$3',
  borderTopWidth: 1,
  borderTopColor: '$gray3',
  gap: '$2',

  variants: {
    noBorder: {
      true: {
        borderTopWidth: 0,
        paddingTop: 0,
      },
    },
    justify: {
      start: {
        justifyContent: 'flex-start',
      },
      center: {
        justifyContent: 'center',
      },
      end: {
        justifyContent: 'flex-end',
      },
      between: {
        justifyContent: 'space-between',
      },
    },
  },
});

// Export types
export type CardProps = GetProps<typeof Card>;
export type CardHeaderProps = GetProps<typeof CardHeader>;
export type CardTitleProps = GetProps<typeof CardTitle>;
export type CardDescriptionProps = GetProps<typeof CardDescription>;
export type CardContentProps = GetProps<typeof CardContent>;
export type CardFooterProps = GetProps<typeof CardFooter>;
