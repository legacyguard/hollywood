import { type GetProps, styled, View, ScrollView } from 'tamagui'

// Container - Main content wrapper
export const Container = styled(View, {
  name: 'LGContainer',
  width: '100%',
  maxWidth: 1280,
  marginHorizontal: 'auto',
  paddingHorizontal: '$4',

  variants: {
    size: {
      small: {
        maxWidth: 640,
      },
      medium: {
        maxWidth: 768,
      },
      large: {
        maxWidth: 1024,
      },
      xlarge: {
        maxWidth: 1280,
      },
      full: {
        maxWidth: '100%',
      },
    },
    padding: {
      none: {
        paddingHorizontal: 0,
      },
      small: {
        paddingHorizontal: '$2',
      },
      medium: {
        paddingHorizontal: '$4',
      },
      large: {
        paddingHorizontal: '$6',
      },
    },
  } as const,

  defaultVariants: {
    size: 'xlarge',
    padding: 'medium',
  },
})

// Stack - Vertical layout
export const Stack = styled(View, {
  name: 'LGStack',
  flexDirection: 'column',

  variants: {
    space: {
      none: { gap: 0 },
      xs: { gap: '$1' },
      small: { gap: '$2' },
      medium: { gap: '$4' },
      large: { gap: '$6' },
      xlarge: { gap: '$8' },
    },
    align: {
      start: { alignItems: 'flex-start' },
      center: { alignItems: 'center' },
      end: { alignItems: 'flex-end' },
      stretch: { alignItems: 'stretch' },
    },
    justify: {
      start: { justifyContent: 'flex-start' },
      center: { justifyContent: 'center' },
      end: { justifyContent: 'flex-end' },
      between: { justifyContent: 'space-between' },
      around: { justifyContent: 'space-around' },
      evenly: { justifyContent: 'space-evenly' },
    },
    fullWidth: {
      true: { width: '100%' },
    },
    fullHeight: {
      true: { height: '100%' },
    },
  } as const,

  defaultVariants: {
    space: 'medium',
    align: 'stretch',
    justify: 'start',
    fullWidth: false,
    fullHeight: false,
  },
})

// Row - Horizontal layout
export const Row = styled(View, {
  name: 'LGRow',
  flexDirection: 'row',

  variants: {
    space: {
      none: { gap: 0 },
      xs: { gap: '$1' },
      small: { gap: '$2' },
      medium: { gap: '$4' },
      large: { gap: '$6' },
      xlarge: { gap: '$8' },
    },
    align: {
      start: { alignItems: 'flex-start' },
      center: { alignItems: 'center' },
      end: { alignItems: 'flex-end' },
      stretch: { alignItems: 'stretch' },
      baseline: { alignItems: 'baseline' },
    },
    justify: {
      start: { justifyContent: 'flex-start' },
      center: { justifyContent: 'center' },
      end: { justifyContent: 'flex-end' },
      between: { justifyContent: 'space-between' },
      around: { justifyContent: 'space-around' },
      evenly: { justifyContent: 'space-evenly' },
    },
    wrap: {
      true: { flexWrap: 'wrap' },
      false: { flexWrap: 'nowrap' },
    },
    fullWidth: {
      true: { width: '100%' },
    },
  } as const,

  defaultVariants: {
    space: 'medium',
    align: 'center',
    justify: 'start',
    wrap: false,
    fullWidth: false,
  },
})

// Grid - Grid layout
export const Grid = styled(View, {
  name: 'LGGrid',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',

  variants: {
    columns: {
      1: {
        '> *': { width: '100%' },
      },
      2: {
        '> *': { width: '50%' },
      },
      3: {
        '> *': { width: '33.333%' },
      },
      4: {
        '> *': { width: '25%' },
      },
      6: {
        '> *': { width: '16.666%' },
      },
      12: {
        '> *': { width: '8.333%' },
      },
    },
    gap: {
      none: { gap: 0 },
      xs: { gap: '$1' },
      small: { gap: '$2' },
      medium: { gap: '$4' },
      large: { gap: '$6' },
      xlarge: { gap: '$8' },
    },
  } as const,

  defaultVariants: {
    columns: 1,
    gap: 'medium',
  },
})

// Box - Basic container
export const Box = styled(View, {
  name: 'LGBox',

  variants: {
    padding: {
      none: { padding: 0 },
      xs: { padding: '$1' },
      small: { padding: '$2' },
      medium: { padding: '$4' },
      large: { padding: '$6' },
      xlarge: { padding: '$8' },
    },
    margin: {
      none: { margin: 0 },
      xs: { margin: '$1' },
      small: { margin: '$2' },
      medium: { margin: '$4' },
      large: { margin: '$6' },
      xlarge: { margin: '$8' },
    },
    centered: {
      true: {
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    flex: {
      true: { flex: 1 },
      false: { flex: 0 },
    },
  } as const,

  defaultVariants: {
    padding: 'none',
    margin: 'none',
    centered: false,
    flex: false,
  },
})

// Section - Page section
export const Section = styled(View, {
  name: 'LGSection',
  width: '100%',
  paddingVertical: '$8',

  variants: {
    background: {
      default: { backgroundColor: '$background' },
      secondary: { backgroundColor: '$backgroundSecondary' },
      tertiary: { backgroundColor: '$backgroundTertiary' },
      dark: { backgroundColor: '$backgroundDark' },
      transparent: { backgroundColor: 'transparent' },
    },
    padding: {
      none: { paddingVertical: 0 },
      small: { paddingVertical: '$4' },
      medium: { paddingVertical: '$8' },
      large: { paddingVertical: '$12' },
      xlarge: { paddingVertical: '$16' },
    },
  } as const,

  defaultVariants: {
    background: 'default',
    padding: 'medium',
  },
})

// Divider - Visual separator
export const Divider = styled(View, {
  name: 'LGDivider',
  backgroundColor: '$gray3',

  variants: {
    orientation: {
      horizontal: {
        width: '100%',
        height: 1,
      },
      vertical: {
        width: 1,
        height: '100%',
      },
    },
    spacing: {
      none: { margin: 0 },
      small: {
        marginVertical: '$2',
      },
      medium: {
        marginVertical: '$4',
      },
      large: {
        marginVertical: '$6',
      },
    },
    color: {
      default: { backgroundColor: '$gray3' },
      light: { backgroundColor: '$gray2' },
      dark: { backgroundColor: '$gray5' },
      primary: { backgroundColor: '$primaryBlue' },
    },
  } as const,

  defaultVariants: {
    orientation: 'horizontal',
    spacing: 'medium',
    color: 'default',
  },
})

// Spacer - Flexible space component
export const Spacer = styled(View, {
  name: 'LGSpacer',
  flex: 1,

  variants: {
    size: {
      xs: { height: '$1', flex: 0 },
      small: { height: '$2', flex: 0 },
      medium: { height: '$4', flex: 0 },
      large: { height: '$6', flex: 0 },
      xlarge: { height: '$8', flex: 0 },
      flex: { flex: 1 },
    },
    horizontal: {
      true: {
        height: 'auto',
        width: '$4',
      },
    },
  } as const,

  defaultVariants: {
    size: 'flex',
    horizontal: false,
  },
})

// ScrollContainer - Scrollable container
export const ScrollContainer = styled(ScrollView, {
  name: 'LGScrollContainer',
  flex: 1,

  variants: {
    padding: {
      none: { padding: 0 },
      small: { padding: '$2' },
      medium: { padding: '$4' },
      large: { padding: '$6' },
    },
    showsScrollIndicator: {
      true: {
        showsVerticalScrollIndicator: true,
        showsHorizontalScrollIndicator: true,
      },
      false: {
        showsVerticalScrollIndicator: false,
        showsHorizontalScrollIndicator: false,
      },
    },
  } as const,

  defaultVariants: {
    padding: 'none',
    showsScrollIndicator: false,
  },
})

// Export types
export type ContainerProps = GetProps<typeof Container>
export type StackProps = GetProps<typeof Stack>
export type RowProps = GetProps<typeof Row>
export type GridProps = GetProps<typeof Grid>
export type BoxProps = GetProps<typeof Box>
export type SectionProps = GetProps<typeof Section>
export type DividerProps = GetProps<typeof Divider>
export type SpacerProps = GetProps<typeof Spacer>
export type ScrollContainerProps = GetProps<typeof ScrollContainer>
