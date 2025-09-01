import type React from 'react';
import { useCallback, useEffect } from 'react';
import { type UseFormProps, type UseFormReturn, type FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodSchema, ZodTypeDef } from 'zod';

// Custom hook options
interface UseZodFormOptions<TSchema extends ZodSchema<any, ZodTypeDef, any>>
  extends Omit<UseFormProps<TSchema['_input']>, 'resolver'> {
  schema: TSchema;
  onSubmit?: (data: TSchema['_output']) => void | Promise<void>;
  resetOnSubmit?: boolean;
  disableOnSubmit?: boolean;
}

// Enhanced form return type
interface EnhancedFormReturn<TSchema extends ZodSchema<any, ZodTypeDef, any>>
  extends UseFormReturn<TSchema['_input']> {
  isSubmitDisabled: boolean;
  submitHandler: (e?: React.BaseSyntheticEvent) => Promise<void>;
  errors: UseFormReturn<TSchema['_input']>['formState']['errors'];
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
}

/**
 * Custom hook that combines react-hook-form with Zod validation
 * Provides consistent error handling, submit state management, and button disable states
 */
export function useZodForm<TSchema extends ZodSchema<any, ZodTypeDef, any>>({
  schema,
  onSubmit,
  resetOnSubmit = false,
  disableOnSubmit = true,
  ...formOptions
}: UseZodFormOptions<TSchema>): EnhancedFormReturn<TSchema> {
  const form = useForm<TSchema['_input']>({
    ...formOptions,
    resolver: zodResolver(schema),
    mode: formOptions.mode || 'onBlur',
    criteriaMode: 'all',
    shouldFocusError: true,
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid, isSubmitSuccessful },
    reset,
    setError,
  } = form;

  // Reset form after successful submission if configured
  useEffect(() => {
    if (isSubmitSuccessful && resetOnSubmit) {
      reset();
    }
  }, [isSubmitSuccessful, reset, resetOnSubmit]);

  // Handle form submission with error handling
  const submitHandler = useCallback(
    async (e?: React.BaseSyntheticEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (!onSubmit) return;

      await handleSubmit(
        async (data) => {
          try {
            await onSubmit(data);
          } catch (error) {
            // Handle API errors and set form errors
            if (error instanceof Error) {
              // Check if error has field-specific messages
              if ('fields' in error && typeof error.fields === 'object') {
                const fieldErrors = error.fields as Record<string, string>;
                Object.entries(fieldErrors).forEach(([field, message]) => {
                  setError(field as any, {
                    type: 'manual',
                    message,
                  });
                });
              } else {
                // Set root error for general errors
                setError('root', {
                  type: 'manual',
                  message: error.message || 'An error occurred',
                });
              }
            } else {
              setError('root', {
                type: 'manual',
                message: 'An unexpected error occurred',
              });
            }
            throw error; // Re-throw to maintain error state
          }
        },
        (errors) => {
          // Log validation errors in development
          if (process.env.NODE_ENV === 'development') {
            console.error('Form validation errors:', errors);
          }
        }
      )(e);
    },
    [handleSubmit, onSubmit, setError]
  );

  // Determine if submit button should be disabled
  const isSubmitDisabled = disableOnSubmit
    ? isSubmitting || !isDirty || !isValid
    : isSubmitting;

  return {
    ...form,
    isSubmitDisabled,
    submitHandler,
    errors,
    isSubmitting,
    isDirty,
    isValid,
  };
}

// Helper function to get error message
export function getErrorMessage(
  errors: FieldValues,
  field: string
): string | undefined {
  const fieldParts = field.split('.');
  let error: any = errors;

  for (const part of fieldParts) {
    error = error?.[part];
    if (!error) break;
  }

  return error?.message;
}

// Helper function to check if field has error
export function hasError(errors: FieldValues, field: string): boolean {
  return !!getErrorMessage(errors, field);
}
