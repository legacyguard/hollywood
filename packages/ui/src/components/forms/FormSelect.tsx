import React from 'react'
import { FormField, type FormFieldProps } from './FormField'
import { Select, type SelectProps } from '../..'

export interface FormSelectProps extends SelectProps, FormFieldProps {}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  error,
  success,
  hint,
  required,
  ...selectProps
}) => {
  return (
    <FormField
      label={label}
      error={error}
      success={success}
      hint={hint}
      required={required}
    >
      <Select
        {...selectProps}
        // Add error styling if needed
        style={{
          ...(error && { borderColor: '$error' }),
          ...(success && { borderColor: '$success' }),
          ...selectProps.style
        }}
      />
    </FormField>
  )
}
