// Export configuration
export { config, tamaguiConfig } from './tamagui.config'
export type { AppConfig } from './tamagui.config'

// Export Button components
export {
  Button,
  IconButton,
  type ButtonProps,
  type IconButtonProps,
} from './components/Button'

// Export Card components
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  type CardProps,
  type CardHeaderProps,
  type CardTitleProps,
  type CardDescriptionProps,
  type CardContentProps,
  type CardFooterProps,
} from './components/Card'

// Export Input components
export {
  Input,
  TextArea,
  InputGroup,
  InputLabel,
  InputError,
  InputHelper,
  type InputProps,
  type TextAreaProps,
  type InputGroupProps,
  type InputLabelProps,
  type InputErrorProps,
  type InputHelperProps,
} from './components/Input'

// Export Typography components
export {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Paragraph,
  Span,
  Label,
  Caption,
  type H1Props,
  type H2Props,
  type H3Props,
  type H4Props,
  type H5Props,
  type H6Props,
  type ParagraphProps,
  type SpanProps,
  type LabelProps,
  type CaptionProps,
} from './components/Typography'

// Export Layout components
export {
  Container,
  Stack,
  YStack,
  Row,
  XStack,
  Grid,
  Box,
  Section,
  Divider,
  Spacer,
  ScrollContainer,
  type ContainerProps,
  type StackProps,
  type YStackProps,
  type RowProps,
  type XStackProps,
  type GridProps,
  type BoxProps,
  type SectionProps,
  type DividerProps,
  type SpacerProps,
  type ScrollContainerProps,
} from './components/Layout'

// Export ProgressBar components
export {
  ProgressBar,
  CircularProgress,
  SegmentedProgress,
  ProgressBarContainer,
  ProgressTrack,
  ProgressFill,
  type ProgressBarProps,
  type CircularProgressProps,
  type SegmentedProgressProps,
} from './components/ProgressBar'

// Export Form components
export {
  Switch,
  type SwitchProps,
} from './components/Switch'

export {
  Checkbox,
  CheckboxGroup,
  type CheckboxProps,
  type CheckboxGroupProps,
} from './components/Checkbox'

export {
  RadioGroup,
  RadioButton,
  type RadioGroupProps,
  type RadioButtonProps,
  type RadioOption,
} from './components/RadioGroup'

export {
  Select,
  NativeSelect,
  type SelectProps,
  type SelectOption,
} from './components/Select'

// Export Alert components
export {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  AlertCloseButton,
  AlertBox,
  type AlertProps,
  type AlertTitleProps,
  type AlertDescriptionProps,
  type AlertBoxProps,
} from './components/Alert'

// Export Badge components
export {
  Badge,
  BadgeText,
  BadgeWithIcon,
  BadgeDot,
  BadgeGroup,
  type BadgeProps,
  type BadgeTextProps,
  type BadgeDotProps,
  type BadgeGroupProps,
  type BadgeWithIconProps,
} from './components/Badge'

// Export Spinner component
export {
  Spinner,
  type SpinnerProps,
} from './components/Spinner'

// Export Skeleton components
export {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonList,
  SkeletonButton,
  SkeletonImage,
  type SkeletonProps,
  type SkeletonTextProps,
  type SkeletonAvatarProps,
  type SkeletonCardProps,
  type SkeletonListProps,
  type SkeletonButtonProps,
  type SkeletonImageProps,
} from './components/Skeleton'

// Export ErrorBoundary components
export {
  GlobalErrorBoundary,
  type GlobalErrorBoundaryProps,
  type FallbackProps,
} from './components/ErrorBoundary'

// Export Form components
export {
  FormField,
  FormInput,
  FormTextArea,
  FormSelect,
  FormSection,
  FormRow,
  ValidationPatterns,
  validateField,
  type FormFieldProps,
  type FormInputProps,
  type FormTextAreaProps,
  type FormSelectProps,
  type FormSectionProps,
  type FormRowProps,
} from './components/forms'

// Export Garden and Firefly components
export {
  LegacyGarden,
} from './components/LegacyGarden'

export {
  SofiaFirefly,
} from './components/SofiaFirefly'

// Export Event Bus utilities
export {
  eventBus,
  EVENTS,
  useEventBus,
  useEventEmitter,
  type EventType,
} from './utils/eventBus'

// Export Animation constants
export {
  CardAnimation,
  PressAnimation,
  ListAnimation,
  PageAnimation,
  ModalAnimation,
  ButtonAnimation,
  SkeletonAnimation,
  AnimationSpeed,
  useAnimations,
} from './constants/animations'

// Export Dark Mode utilities
export {
  useDarkMode,
  withDarkMode,
} from './hooks/useDarkMode'

// Re-export Tamagui core components and utilities
export {
  TamaguiProvider,
  Theme,
  useTheme,
  useMedia,
  styled,
  View,
  Text,
  Image,
  AnimatePresence,
} from 'tamagui'
