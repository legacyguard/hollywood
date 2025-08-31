import React, { useState } from 'react'
import { FormField, type FormFieldProps } from './FormField'
import { Input, Button, Row, Stack } from '../..'
import { Calendar } from 'lucide-react-native'
import { Platform } from 'react-native'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'

export interface FormDatePickerProps extends FormFieldProps {
  value?: Date
  onChange?: (date: Date) => void
  placeholder?: string
  minDate?: Date
  maxDate?: Date
  mode?: 'date' | 'time' | 'datetime'
  disabled?: boolean
}

export const FormDatePicker: React.FC<FormDatePickerProps> = ({
  label,
  error,
  success,
  hint,
  required,
  value,
  onChange,
  placeholder = 'Select date',
  minDate,
  maxDate,
  mode = 'date',
  disabled = false
}) => {
  const [showPicker, setShowPicker] = useState(false)
  
  const formatDate = (date: Date | undefined) => {
    if (!date) return ''
    
    if (mode === 'date') {
      return date.toLocaleDateString()
    } else if (mode === 'time') {
      return date.toLocaleTimeString()
    } else {
      return date.toLocaleString()
    }
  }
  
  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false)
    }
    
    if (selectedDate && onChange) {
      onChange(selectedDate)
    }
  }
  
  const handlePress = () => {
    if (!disabled) {
      setShowPicker(true)
    }
  }
  
  return (
    <FormField
      label={label}
      error={error}
      success={success}
      hint={hint}
      required={required}
    >
      <Stack width="100%">
        <Row gap="$2" width="100%">
          <Input
            value={formatDate(value)}
            placeholder={placeholder}
            editable={false}
            disabled={disabled}
            variant={error ? 'error' : success ? 'success' : 'default'}
            flex={1}
            onPress={handlePress}
          />
          <Button
            size="medium"
            variant="secondary"
            icon={Calendar}
            onPress={handlePress}
            disabled={disabled}
          />
        </Row>
        
        {showPicker && (
          <DateTimePicker
            value={value || new Date()}
            mode={mode}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={minDate}
            maximumDate={maxDate}
          />
        )}
        
        {Platform.OS === 'ios' && showPicker && (
          <Row gap="$2" marginTop="$2">
            <Button
              variant="ghost"
              size="small"
              onPress={() => setShowPicker(false)}
              flex={1}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="small"
              onPress={() => setShowPicker(false)}
              flex={1}
            >
              Done
            </Button>
          </Row>
        )}
      </Stack>
    </FormField>
  )
}

// Simple date input for web or when native picker is not available
export const FormDateInput: React.FC<FormDatePickerProps> = ({
  label,
  error,
  success,
  hint,
  required,
  value,
  onChange,
  placeholder = 'YYYY-MM-DD',
  disabled = false
}) => {
  const [inputValue, setInputValue] = useState(
    value ? value.toISOString().split('T')[0] : ''
  )
  
  const handleChange = (text: string) => {
    setInputValue(text)
    
    // Basic date validation
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (dateRegex.test(text)) {
      const date = new Date(text)
      if (!isNaN(date.getTime()) && onChange) {
        onChange(date)
      }
    }
  }
  
  return (
    <FormField
      label={label}
      error={error}
      success={success}
      hint={hint}
      required={required}
    >
      <Input
        value={inputValue}
        onChangeText={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        variant={error ? 'error' : success ? 'success' : 'default'}
        maxLength={10}
      />
    </FormField>
  )
}
