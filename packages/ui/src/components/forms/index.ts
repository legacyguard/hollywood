// Form Field Components
export {
  FormField,
  type FormFieldProps,
  FormInput,
  type FormInputProps,
  FormTextArea,
  type FormTextAreaProps,
} from './FormField';

// Form Section Components
export {
  FormRow,
  type FormRowProps,
  FormSection,
  type FormSectionProps,
} from './FormSection';

// Form Select Component
export { FormSelect, type FormSelectProps } from './FormSelect';

// Re-export validation utilities if needed
export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s()-]+$/,
  postalCode: /^[A-Z0-9\s-]+$/i,
  url: /^https?:\/\/.+\..+/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  numeric: /^\d+$/,
};

// Helper function for form validation
export const validateField = (
  value: string,
  rules: {
    custom?: (value: string) => string | undefined;
    maxLength?: number;
    minLength?: number;
    pattern?: RegExp;
    required?: boolean;
  }
): string | undefined => {
  if (rules.required && !value.trim()) {
    return 'This field is required';
  }

  if (rules.minLength && value.length < rules.minLength) {
    return `Must be at least ${rules.minLength} characters`;
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    return `Must be no more than ${rules.maxLength} characters`;
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    return 'Invalid format';
  }

  if (rules.custom) {
    return rules.custom(value);
  }

  return undefined;
};
