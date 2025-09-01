import React from 'react'
import { styled, RadioGroup as TamaguiRadioGroup, Label, YStack, XStack } from 'tamagui'

// Base RadioGroup component with LegacyGuard styling
const StyledRadioGroup = styled(TamaguiRadioGroup, {
  name: 'RadioGroup',
  gap: '$3',
})

// Radio item container
const StyledRadioGroupItem = styled(TamaguiRadioGroup.Item, {
  name: 'RadioGroupItem',
  backgroundColor: '$background',
  borderWidth: 2,
  borderColor: '$gray4',
  borderRadius: 1000, // Full circle
  alignItems: 'center',
  justifyContent: 'center',
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

    variant: {
      primary: {
        focusStyle: {
          borderColor: '$primaryBlueLight',
          outlineWidth: 2,
          outlineColor: '$primaryBlueLight',
          outlineStyle: 'solid',
        },
        '$group-radio-checked': {
          borderColor: '$primaryBlue',
        },
      },
      success: {
        focusStyle: {
          borderColor: '$primaryGreenLight',
          outlineWidth: 2,
          outlineColor: '$primaryGreenLight',
          outlineStyle: 'solid',
        },
        '$group-radio-checked': {
          borderColor: '$primaryGreen',
        },
      },
      premium: {
        focusStyle: {
          borderColor: '$accentGoldLight',
          outlineWidth: 2,
          outlineColor: '$accentGoldLight',
          outlineStyle: 'solid',
        },
        '$group-radio-checked': {
          borderColor: '$accentGold',
        },
      },
    },

    disabled: {
      true: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
  },

  defaultVariants: {
    size: 'medium',
    variant: 'primary',
  },
})

// Radio indicator (inner circle)
const StyledRadioGroupIndicator = styled(TamaguiRadioGroup.Indicator, {
  name: 'RadioGroupIndicator',
  borderRadius: 1000,
  animation: 'quick',

  variants: {
    size: {
      small: {
        width: 8,
        height: 8,
      },
      medium: {
        width: 10,
        height: 10,
      },
      large: {
        width: 12,
        height: 12,
      },
    },

    variant: {
      primary: {
        backgroundColor: '$primaryBlue',
      },
      success: {
        backgroundColor: '$primaryGreen',
      },
      premium: {
        backgroundColor: '$accentGold',
      },
    },
  },

  defaultVariants: {
    size: 'medium',
    variant: 'primary',
  },
})

// Radio option props
export interface RadioOption {
  value: string
  label: string
  disabled?: boolean
  description?: string
}

// RadioGroup props
export interface RadioGroupProps {
  options: RadioOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
  size?: 'small' | 'medium' | 'large'
  variant?: 'primary' | 'success' | 'premium'
  disabled?: boolean
  name?: string
  required?: boolean
  'aria-label'?: string
}

// RadioGroup component
export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({
    options,
    value,
    defaultValue,
    onValueChange,
    orientation = 'vertical',
    size = 'medium',
    variant = 'primary',
    disabled = false,
    name,
    required,
    'aria-label': ariaLabel,
  }, ref) => {

    const StackComponent = orientation === 'horizontal' ? XStack : YStack

    return (
      <StyledRadioGroup
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        name={name}
        required={required}
        aria-label={ariaLabel}
        disabled={disabled}
      >
        <StackComponent gap="$3" flexWrap={orientation === 'horizontal' ? 'wrap' : undefined}>
          {options.map((option) => (
            <XStack key={option.value} alignItems="center" gap="$3">
              <StyledRadioGroupItem
                value={option.value}
                id={`${name}-${option.value}`}
                size={size}
                variant={variant}
                disabled={disabled || option.disabled}
              >
                <StyledRadioGroupIndicator size={size} variant={variant} />
              </StyledRadioGroupItem>
              <YStack flex={1}>
                <Label
                  htmlFor={`${name}-${option.value}`}
                  disabled={disabled || option.disabled}
                  cursor={disabled || option.disabled ? 'not-allowed' : 'pointer'}
                  onPress={() => {
                    if (!disabled && !option.disabled && onValueChange) {
                      onValueChange(option.value)
                    }
                  }}
                >
                  {option.label}
                </Label>
                {option.description && (
                  <Label
                    size="$2"
                    color="$gray6"
                    marginTop="$1"
                    disabled={disabled || option.disabled}
                  >
                    {option.description}
                  </Label>
                )}
              </YStack>
            </XStack>
          ))}
        </StackComponent>
      </StyledRadioGroup>
    )
  }
)

RadioGroup.displayName = 'RadioGroup'

// Standalone RadioButton component
export interface RadioButtonProps {
  value: string
  label: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  size?: 'small' | 'medium' | 'large'
  variant?: 'primary' | 'success' | 'premium'
  disabled?: boolean
  description?: string
}

export const RadioButton = React.forwardRef<HTMLButtonElement, RadioButtonProps>(
  ({
    value,
    label,
    checked = false,
    onCheckedChange,
    size = 'medium',
    variant = 'primary',
    disabled = false,
    description,
  }, ref) => {

    return (
      <XStack alignItems="center" gap="$3">
        <StyledRadioGroup value={checked ? value : ''}>
          <StyledRadioGroupItem
            ref={ref}
            value={value}
            size={size}
            variant={variant}
            disabled={disabled}
            onPress={() => {
              if (!disabled && onCheckedChange) {
                onCheckedChange(!checked)
              }
            }}
          >
            {checked && <StyledRadioGroupIndicator size={size} variant={variant} />}
          </StyledRadioGroupItem>
        </StyledRadioGroup>
        <YStack flex={1}>
          <Label
            disabled={disabled}
            cursor={disabled ? 'not-allowed' : 'pointer'}
            onPress={() => {
              if (!disabled && onCheckedChange) {
                onCheckedChange(!checked)
              }
            }}
          >
            {label}
          </Label>
          {description && (
            <Label
              size="$2"
              color="$gray6"
              marginTop="$1"
              disabled={disabled}
            >
              {description}
            </Label>
          )}
        </YStack>
      </XStack>
    )
  }
)

RadioButton.displayName = 'RadioButton'
