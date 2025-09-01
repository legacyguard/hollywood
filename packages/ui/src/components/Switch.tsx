import React from 'react'
import { styled, Switch as TamaguiSwitch, XStack, Label, type SwitchProps as TamaguiSwitchProps } from 'tamagui'

// Base Switch component with LegacyGuard styling
const StyledSwitch = styled(TamaguiSwitch, {
  name: 'Switch',
  backgroundColor: '$gray4',
  borderWidth: 2,
  borderColor: '$gray4',

  variants: {
    size: {
      small: {
        width: 44,
        height: 24,
      },
      medium: {
        width: 52,
        height: 28,
      },
      large: {
        width: 60,
        height: 32,
      },
    },

    variant: {
      primary: {
        borderColor: '$gray4',
      },
      success: {
        borderColor: '$gray4',
      },
      premium: {
        borderColor: '$gray4',
      },
    },

    checked: {
      true: {
        backgroundColor: '$primaryBlue',
        borderColor: '$primaryBlue',
      },
    },
  },

  defaultVariants: {
    size: 'medium' as const,
    variant: 'primary' as const,
  },
})

// Thumb styling
const StyledThumb = styled(TamaguiSwitch.Thumb, {
  name: 'SwitchThumb',
  backgroundColor: 'white',
  animation: 'quick',

  variants: {
    size: {
      small: {
        width: 18,
        height: 18,
      },
      medium: {
        width: 22,
        height: 22,
      },
      large: {
        width: 26,
        height: 26,
      },
    },
  },

  defaultVariants: {
    size: 'medium',
  },
})

// Extended Switch props
export interface SwitchProps extends Omit<TamaguiSwitchProps, 'size'> {
  size?: 'small' | 'medium' | 'large'
  variant?: 'primary' | 'success' | 'premium'
  label?: string
  labelPosition?: 'left' | 'right'
  disabled?: boolean
  onValueChange?: (value: boolean) => void
}

// Main Switch component
export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({
    size = 'medium',
    variant = 'primary',
    label,
    labelPosition = 'right',
    disabled = false,
    onValueChange,
    ...props
  }, ref) => {
    const switchComponent = (
      <StyledSwitch
        ref={ref}
        size={size}
        variant={variant}
        disabled={disabled}
        onCheckedChange={onValueChange}
        opacity={disabled ? 0.5 : 1}
        {...props}
      >
        <StyledThumb size={size} animation="quick" />
      </StyledSwitch>
    )

    if (!label) {
      return switchComponent
    }

    return (
      <XStack
        alignItems="center"
        gap="$3"
        opacity={disabled ? 0.5 : 1}
      >
        {labelPosition === 'left' && (
          <Label
            htmlFor={props.id}
            disabled={disabled}
            cursor={disabled ? 'not-allowed' : 'pointer'}
          >
            {label}
          </Label>
        )}
        {switchComponent}
        {labelPosition === 'right' && (
          <Label
            htmlFor={props.id}
            disabled={disabled}
            cursor={disabled ? 'not-allowed' : 'pointer'}
          >
            {label}
          </Label>
        )}
      </XStack>
    )
  }
)

Switch.displayName = 'Switch'
