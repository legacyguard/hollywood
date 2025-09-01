import { Spinner as TamaguiSpinner, type GetProps } from 'tamagui'

// Simple wrapper around Tamagui Spinner
export const Spinner = TamaguiSpinner

export type SpinnerProps = GetProps<typeof TamaguiSpinner>
