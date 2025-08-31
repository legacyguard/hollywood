// Form Field Components
export {
  FormField,
  FormInput,
  FormTextArea,
  type FormFieldProps,
  type FormInputProps,
  type FormTextAreaProps
} from './FormField'

// Form Select Component
export {
  FormSelect,
  type FormSelectProps
} from './FormSelect'

// Form Section Components
export {
  FormSection,
  FormRow,
  type FormSectionProps,
  type FormRowProps
} from './FormSection'

// Form Date Picker Components
export {
  FormDatePicker,
  FormDateInput,
  type FormDatePickerProps
} from './FormDatePicker'

// Re-export validation utilities if needed
export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s()-]+$/,
  postalCode: /^[A-Z0-9\s-]+$/i,
  url: /^https?:\/\/.+\..+/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  numeric: /^\d+$/,
}

// Helper function for form validation
export const validateField = (
  value: string,
  rules: {
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    custom?: (value: string) => string | undefined
  }
): string | undefined => {
  if (rules.required && !value.trim()) {
    return 'This field is required'
  }
  
  if (rules.minLength && value.length < rules.minLength) {
    return `Must be at least ${rules.minLength} characters`
  }
  
  if (rules.maxLength && value.length > rules.maxLength) {
    return `Must be no more than ${rules.maxLength} characters`
  }
  
  if (rules.pattern && !rules.pattern.test(value)) {
    return 'Invalid format'
  }
  
  if (rules.custom) {
    return rules.custom(value)
  }
  
  return undefined
}
