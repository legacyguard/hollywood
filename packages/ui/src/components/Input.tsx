import { styled, Input as TamaguiInput, TextArea as TamaguiTextArea, View, Text, GetProps } from 'tamagui'

// Base Input component
export const Input = styled(TamaguiInput, {
  name: 'LGInput',
  
  // Base styles
  backgroundColor: '$background',
  borderWidth: 1,
  borderColor: '$gray3',
  borderRadius: '$2',
  paddingHorizontal: '$3',
  paddingVertical: '$2',
  fontSize: '$4',
  fontFamily: '$body',
  color: '$color',
  placeholderTextColor: '$gray5',
  height: 40,
  width: '100%',
  
  // Focus styles
  focusStyle: {
    borderColor: '$primaryBlue',
    outlineColor: '$primaryBlueLight',
    outlineStyle: 'solid',
    outlineWidth: 2,
    outlineOffset: 1,
  },
  
  // Hover styles
  hoverStyle: {
    borderColor: '$gray4',
  },
  
  // Disabled styles
  disabledStyle: {
    backgroundColor: '$gray2',
    color: '$gray5',
    cursor: 'not-allowed',
    opacity: 0.6,
  },
  
  // Variants
  variants: {
    variant: {
      default: {
        backgroundColor: '$background',
        borderColor: '$gray3',
      },
      filled: {
        backgroundColor: '$gray2',
        borderColor: 'transparent',
      },
      ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderBottomWidth: 1,
        borderBottomColor: '$gray3',
        borderRadius: 0,
        paddingHorizontal: 0,
      },
      error: {
        borderColor: '$error',
        focusStyle: {
          borderColor: '$error',
          outlineColor: '#fca5a5',
        },
      },
      success: {
        borderColor: '$success',
        focusStyle: {
          borderColor: '$success',
          outlineColor: '$primaryGreenLight',
        },
      },
    },
    
    size: {
      small: {
        height: 32,
        fontSize: '$3',
        paddingHorizontal: '$2',
        paddingVertical: '$1',
      },
      medium: {
        height: 40,
        fontSize: '$4',
        paddingHorizontal: '$3',
        paddingVertical: '$2',
      },
      large: {
        height: 48,
        fontSize: '$5',
        paddingHorizontal: '$4',
        paddingVertical: '$3',
      },
    },
    
    fullWidth: {
      true: {
        width: '100%',
      },
      false: {
        width: 'auto',
      },
    },
  } as const,
  
  // Default variants
  defaultVariants: {
    variant: 'default',
    size: 'medium',
    fullWidth: true,
  },
})

// TextArea component
export const TextArea = styled(TamaguiTextArea, {
  name: 'LGTextArea',
  
  // Inherit all Input styles
  backgroundColor: '$background',
  borderWidth: 1,
  borderColor: '$gray3',
  borderRadius: '$2',
  paddingHorizontal: '$3',
  paddingVertical: '$2',
  fontSize: '$4',
  fontFamily: '$body',
  color: '$color',
  placeholderTextColor: '$gray5',
  width: '100%',
  minHeight: 100,
  textAlignVertical: 'top',
  
  // Focus styles
  focusStyle: {
    borderColor: '$primaryBlue',
    outlineColor: '$primaryBlueLight',
    outlineStyle: 'solid',
    outlineWidth: 2,
    outlineOffset: 1,
  },
  
  // Hover styles
  hoverStyle: {
    borderColor: '$gray4',
  },
  
  // Disabled styles
  disabledStyle: {
    backgroundColor: '$gray2',
    color: '$gray5',
    cursor: 'not-allowed',
    opacity: 0.6,
  },
  
  // Variants (same as Input)
  variants: {
    variant: {
      default: {
        backgroundColor: '$background',
        borderColor: '$gray3',
      },
      filled: {
        backgroundColor: '$gray2',
        borderColor: 'transparent',
      },
      error: {
        borderColor: '$error',
        focusStyle: {
          borderColor: '$error',
          outlineColor: '#fca5a5',
        },
      },
      success: {
        borderColor: '$success',
        focusStyle: {
          borderColor: '$success',
          outlineColor: '$primaryGreenLight',
        },
      },
    },
    
    size: {
      small: {
        minHeight: 80,
        fontSize: '$3',
        paddingHorizontal: '$2',
        paddingVertical: '$2',
      },
      medium: {
        minHeight: 100,
        fontSize: '$4',
        paddingHorizontal: '$3',
        paddingVertical: '$3',
      },
      large: {
        minHeight: 120,
        fontSize: '$5',
        paddingHorizontal: '$4',
        paddingVertical: '$4',
      },
    },
  } as const,
  
  // Default variants
  defaultVariants: {
    variant: 'default',
    size: 'medium',
  },
})

// Input Group for labels and error messages
export const InputGroup = styled(View, {
  name: 'LGInputGroup',
  width: '100%',
  gap: '$2',
})

// Input Label
export const InputLabel = styled(Text, {
  name: 'LGInputLabel',
  fontSize: '$3',
  fontWeight: '$4',
  color: '$gray7',
  fontFamily: '$body',
  marginBottom: '$1',
})

// Input Error Message
export const InputError = styled(Text, {
  name: 'LGInputError',
  fontSize: '$3',
  color: '$error',
  fontFamily: '$body',
  marginTop: '$1',
})

// Input Helper Text
export const InputHelper = styled(Text, {
  name: 'LGInputHelper',
  fontSize: '$3',
  color: '$gray6',
  fontFamily: '$body',
  marginTop: '$1',
})

// Export types
export type InputProps = GetProps<typeof Input>
export type TextAreaProps = GetProps<typeof TextArea>
export type InputGroupProps = GetProps<typeof InputGroup>
export type InputLabelProps = GetProps<typeof InputLabel>
export type InputErrorProps = GetProps<typeof InputError>
export type InputHelperProps = GetProps<typeof InputHelper>
