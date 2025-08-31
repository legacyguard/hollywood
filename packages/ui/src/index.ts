// Export configuration
export { config as tamaguiConfig } from './tamagui.config'
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
  Row,
  Grid,
  Box,
  Section,
  Divider,
  Spacer,
  ScrollContainer,
  type ContainerProps,
  type StackProps,
  type RowProps,
  type GridProps,
  type BoxProps,
  type SectionProps,
  type DividerProps,
  type SpacerProps,
  type ScrollContainerProps,
} from './components/Layout'

// Export PillarCard components
export {
  PillarCard,
  PillarCardContainer,
  IconContainer,
  LockBadge,
  ActiveGradient,
  type PillarCardProps,
} from './components/PillarCard'

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

// Export Form components
export {
  FormField,
  FormInput,
  FormTextArea,
  FormSelect,
  FormSection,
  FormRow,
  FormDatePicker,
  FormDateInput,
  ValidationPatterns,
  validateField,
  type FormFieldProps,
  type FormInputProps,
  type FormTextAreaProps,
  type FormSelectProps,
  type FormSectionProps,
  type FormRowProps,
  type FormDatePickerProps,
} from './components/forms'

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
