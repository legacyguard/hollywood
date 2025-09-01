import React from 'react'
import { FormField } from './FormField'
import { Select, type SelectProps } from '../..'

export interface FormSelectProps extends Omit<SelectProps, 'error' | 'label'> {
  label?: string
  error?: string | boolean
  success?: string
  hint?: string
  required?: boolean
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  error,
  success,
  hint,
  required,
  ...selectProps
}) => {
  // Convert error to appropriate types for each component
  const hasError = Boolean(error)
  const errorMessage = typeof error === 'string' ? error : undefined

  return (
    <FormField
      label={label}
      error={errorMessage}
      success={success}
      hint={hint}
      required={required}
    >
      <Select
        {...selectProps}
        error={hasError}
        errorText={errorMessage}
      />
    </FormField>
  )
}
