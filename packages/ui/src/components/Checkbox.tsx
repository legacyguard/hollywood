import React from 'react'
import { styled, Checkbox as TamaguiCheckbox, CheckboxProps as TamaguiCheckboxProps, Label, XStack, Theme } from 'tamagui'
import { Check } from 'lucide-react-native'

// Base Checkbox component with LegacyGuard styling
const StyledCheckbox = styled(TamaguiCheckbox, {
  name: 'Checkbox',
  backgroundColor: '$background',
  borderWidth: 2,
  borderColor: '$gray4',
  borderRadius: '$2',
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
        checked: {
          backgroundColor: '$primaryBlue',
          borderColor: '$primaryBlue',
        },
        focusStyle: {
          borderColor: '$primaryBlueLight',
          outlineWidth: 2,
          outlineColor: '$primaryBlueLight',
          outlineStyle: 'solid',
        },
      },
      success: {
        checked: {
          backgroundColor: '$primaryGreen',
          borderColor: '$primaryGreen',
        },
        focusStyle: {
          borderColor: '$primaryGreenLight',
          outlineWidth: 2,
          outlineColor: '$primaryGreenLight',
          outlineStyle: 'solid',
        },
      },
      premium: {
        checked: {
          backgroundColor: '$accentGold',
          borderColor: '$accentGold',
        },
        focusStyle: {
          borderColor: '$accentGoldLight',
          outlineWidth: 2,
          outlineColor: '$accentGoldLight',
          outlineStyle: 'solid',
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

// Checkbox indicator (checkmark)
const StyledIndicator = styled(TamaguiCheckbox.Indicator, {
  name: 'CheckboxIndicator',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
})

// Extended Checkbox props
export interface CheckboxProps extends Omit<TamaguiCheckboxProps, 'size'> {
  size?: 'small' | 'medium' | 'large'
  variant?: 'primary' | 'success' | 'premium'
  label?: string
  labelPosition?: 'left' | 'right'
  disabled?: boolean
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  indeterminate?: boolean
}

// Main Checkbox component
export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ 
    size = 'medium', 
    variant = 'primary', 
    label, 
    labelPosition = 'right',
    disabled = false,
    checked,
    defaultChecked,
    onCheckedChange,
    indeterminate = false,
    ...props 
  }, ref) => {
    
    // Calculate icon size based on checkbox size
    const iconSize = size === 'small' ? 12 : size === 'medium' ? 16 : 20
    
    const checkboxComponent = (
      <StyledCheckbox
        ref={ref}
        size={size}
        variant={variant}
        disabled={disabled}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        {...props}
      >
        <StyledIndicator>
          {indeterminate ? (
            <Theme name={variant}>
              <XStack 
                width={iconSize * 0.7} 
                height={2} 
                backgroundColor="white"
                borderRadius="$1"
              />
            </Theme>
          ) : (
            <Check size={iconSize} color="white" strokeWidth={3} />
          )}
        </StyledIndicator>
      </StyledCheckbox>
    )
    
    if (!label) {
      return checkboxComponent
    }
    
    return (
      <XStack 
        alignItems="center" 
        gap="$3"
        opacity={disabled ? 0.5 : 1}
        cursor={disabled ? 'not-allowed' : 'pointer'}
        onPress={() => {
          if (!disabled && onCheckedChange) {
            onCheckedChange(!checked)
          }
        }}
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
        {checkboxComponent}
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

Checkbox.displayName = 'Checkbox'

// CheckboxGroup component for managing multiple checkboxes
export interface CheckboxGroupProps {
  options: Array<{
    value: string
    label: string
    disabled?: boolean
  }>
  value: string[]
  onValueChange: (value: string[]) => void
  orientation?: 'horizontal' | 'vertical'
  size?: 'small' | 'medium' | 'large'
  variant?: 'primary' | 'success' | 'premium'
  disabled?: boolean
}

export const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  ({ 
    options, 
    value = [], 
    onValueChange, 
    orientation = 'vertical',
    size = 'medium',
    variant = 'primary',
    disabled = false,
  }, ref) => {
    
    const handleCheckboxChange = (optionValue: string, checked: boolean) => {
      if (checked) {
        onValueChange([...value, optionValue])
      } else {
        onValueChange(value.filter(v => v !== optionValue))
      }
    }
    
    const StackComponent = orientation === 'horizontal' ? XStack : styled(XStack, {
      flexDirection: 'column',
    })
    
    return (
      <StackComponent ref={ref} gap="$3" flexWrap="wrap">
        {options.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            size={size}
            variant={variant}
            checked={value.includes(option.value)}
            onCheckedChange={(checked) => handleCheckboxChange(option.value, checked)}
            disabled={disabled || option.disabled}
          />
        ))}
      </StackComponent>
    )
  }
)

CheckboxGroup.displayName = 'CheckboxGroup'

// Export types
export type { CheckboxProps, CheckboxGroupProps }
