import React, { type ReactNode } from 'react'
import { Stack, Label, Paragraph, Input, TextArea, type InputProps, type TextAreaProps } from '../..'
import { AlertCircle, CheckCircle } from 'lucide-react-native'
import { View } from 'tamagui'

export interface FormFieldProps {
  label?: string
  error?: string
  success?: string
  hint?: string
  required?: boolean
  children?: ReactNode
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  success,
  hint,
  required,
  children
}) => {
  return (
    <Stack gap="$2" width="100%">
      {label && (
        <Label>
          {label}
          {required && <Paragraph color="danger" style={{ display: 'inline' }}> *</Paragraph>}
        </Label>
      )}

      {children}

      {hint && !error && !success && (
        <Paragraph size="small" color="muted">
          {hint}
        </Paragraph>
      )}

      {error && (
        <View flexDirection="row" alignItems="center" gap="$1">
          <AlertCircle size={14} color="$error" />
          <Paragraph size="small" color="danger">
            {error}
          </Paragraph>
        </View>
      )}

      {success && !error && (
        <View flexDirection="row" alignItems="center" gap="$1">
          <CheckCircle size={14} color="$success" />
          <Paragraph size="small" color="success">
            {success}
          </Paragraph>
        </View>
      )}
    </Stack>
  )
}

// FormInput - Input with FormField wrapper
export interface FormInputProps extends InputProps, FormFieldProps {}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  success,
  hint,
  required,
  ...inputProps
}) => {
  return (
    <FormField
      label={label}
      error={error}
      success={success}
      hint={hint}
      required={required}
    >
      <Input
        {...inputProps}
        variant={error ? 'error' : success ? 'success' : inputProps.variant}
      />
    </FormField>
  )
}

// FormTextArea - TextArea with FormField wrapper
export interface FormTextAreaProps extends TextAreaProps, FormFieldProps {}

export const FormTextArea: React.FC<FormTextAreaProps> = ({
  label,
  error,
  success,
  hint,
  required,
  ...textAreaProps
}) => {
  return (
    <FormField
      label={label}
      error={error}
      success={success}
      hint={hint}
      required={required}
    >
      <TextArea
        {...textAreaProps}
        variant={error ? 'error' : success ? 'success' : textAreaProps.variant}
      />
    </FormField>
  )
}
