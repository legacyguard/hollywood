import React, { ReactNode } from 'react'
import { Stack, H3, Paragraph, Divider, Card, CardContent } from '../..'
import { View } from 'tamagui'

export interface FormSectionProps {
  title?: string
  description?: string
  children: ReactNode
  variant?: 'default' | 'card' | 'bordered'
  spacing?: '$1' | '$2' | '$3' | '$4' | '$5'
  showDivider?: boolean
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  variant = 'default',
  spacing = '$4',
  showDivider = false
}) => {
  const content = (
    <Stack gap={spacing} width="100%">
      {(title || description) && (
        <Stack gap="$2">
          {title && <H3>{title}</H3>}
          {description && (
            <Paragraph size="small" color="muted">
              {description}
            </Paragraph>
          )}
        </Stack>
      )}
      {children}
    </Stack>
  )

  switch (variant) {
    case 'card':
      return (
        <Card width="100%">
          <CardContent>{content}</CardContent>
        </Card>
      )
    
    case 'bordered':
      return (
        <View
          borderWidth={1}
          borderColor="$gray3"
          borderRadius="$3"
          padding="$4"
          width="100%"
        >
          {content}
        </View>
      )
    
    default:
      return (
        <Stack width="100%">
          {content}
          {showDivider && <Divider marginTop={spacing} />}
        </Stack>
      )
  }
}

// FormRow - Helper component for horizontal form layouts
export interface FormRowProps {
  children: ReactNode
  gap?: '$1' | '$2' | '$3' | '$4' | '$5'
  responsive?: boolean
}

export const FormRow: React.FC<FormRowProps> = ({
  children,
  gap = '$3',
  responsive = true
}) => {
  return (
    <View
      flexDirection="row"
      flexWrap={responsive ? "wrap" : "nowrap"}
      gap={gap}
      width="100%"
    >
      {React.Children.map(children, (child) => (
        <View flex={1} minWidth={responsive ? 300 : 0}>
          {child}
        </View>
      ))}
    </View>
  )
}
