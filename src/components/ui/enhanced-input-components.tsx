import * as React from 'react';
import type { EnhancedInputProps } from './enhanced-input-types';

// Specialized input components
export const PersonalityInput = React.forwardRef<HTMLInputElement,
  Omit<EnhancedInputProps, 'personalityAdapt'>
>((props, ref) => (
  <EnhancedInput
    ref={ref}
    personalityAdapt={true}
    animateOnFocus={true}
    animateOnError={true}
    glowEffect={true}
    {...props}
  />
));

PersonalityInput.displayName = "PersonalityInput";

export const ValidatedInput = React.forwardRef<HTMLInputElement,
  EnhancedInputProps & {
    validation?: (value: string) => { valid: boolean, message?: string }
  }
>(({ validation, onChange, ...props }, ref) => {
  const [validationState, setValidationState] = React.useState<{
    valid: boolean
    message?: string
  }>({ valid: true });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (validation) {
      const result = validation(value);
      setValidationState(result);
    }
    onChange?.(e);
  };

  return (
    <EnhancedInput
      ref={ref}
      error={!validationState.valid ? (validationState.message || true) : false}
      success={validationState.valid && Boolean(props.value)}
      onChange={handleChange}
      personalityAdapt={true}
      {...props}
    />
  );
});

ValidatedInput.displayName = "ValidatedInput";

// This component is defined in enhanced-input.tsx
declare const EnhancedInput: React.ForwardRefExoticComponent<EnhancedInputProps & React.RefAttributes<HTMLInputElement>>;
