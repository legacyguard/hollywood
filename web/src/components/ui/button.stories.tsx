
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import {
  ChevronRight,
  Download,
  Heart,
  Loader2,
  Mail,
  Plus,
  Settings,
  Trash,
} from 'lucide-react';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The Button component is a fundamental UI element used throughout the LegacyGuard application.
It supports multiple variants, sizes, and states to accommodate various use cases.

## Features
- **Multiple variants**: default, destructive, outline, secondary, ghost, link
- **Four sizes**: sm, default, lg, icon
- **Loading state**: Shows a spinner when loading
- **Icon support**: Can include icons before or after text
- **Full width option**: Can expand to fill container width
- **Keyboard accessible**: Fully keyboard navigable
- **Screen reader friendly**: Proper ARIA attributes

## Usage

\`\`\`tsx
import { Button } from '@/components/ui/button';

// Basic usage
<Button>Click me</Button>

// With variant
<Button variant="destructive">Delete</Button>

// With icon
<Button>
  <Mail className="mr-2 h-4 w-4" />
  Send Email
</Button>

// Loading state
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Processing...
</Button>
\`\`\`

## Best Practices
- Use descriptive labels that clearly indicate the action
- Choose appropriate variants based on the action importance
- Provide loading states for async operations
- Include icons for better visual hierarchy
- Ensure sufficient color contrast for accessibility
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
      ],
      description: 'The visual style variant of the button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'The size of the button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    asChild: {
      control: 'boolean',
      description: 'Render as child element (useful for Next.js Link)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    children: {
      control: 'text',
      description: 'Button content',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Variants
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete Account',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
};

// Sizes
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

export const Icon: Story = {
  args: {
    size: 'icon',
    children: <Settings className='h-4 w-4' />,
  },
};

// With Icons
export const WithLeftIcon: Story = {
  args: {
    children: (
      <>
        <Mail className='mr-2 h-4 w-4' />
        Send Email
      </>
    ),
  },
};

export const WithRightIcon: Story = {
  args: {
    children: (
      <>
        Continue
        <ChevronRight className='ml-2 h-4 w-4' />
      </>
    ),
  },
};

// States
export const Loading: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
        Processing...
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};

// Complex Examples
export const DownloadButton: Story = {
  args: {
    variant: 'outline',
    children: (
      <>
        <Download className='mr-2 h-4 w-4' />
        Download Report
      </>
    ),
  },
};

export const DeleteButton: Story = {
  args: {
    variant: 'destructive',
    size: 'sm',
    children: (
      <>
        <Trash className='mr-2 h-4 w-4' />
        Delete
      </>
    ),
  },
};

export const FavoriteButton: Story = {
  args: {
    variant: 'ghost',
    size: 'icon',
    children: <Heart className='h-4 w-4' />,
  },
};

export const CreateButton: Story = {
  args: {
    size: 'lg',
    children: (
      <>
        <Plus className='mr-2 h-5 w-5' />
        Create New Document
      </>
    ),
  },
};

// Button Group Example
export const ButtonGroup: Story = {
  render: () => (
    <div className='flex gap-2'>
      <Button variant='outline'>Cancel</Button>
      <Button>Save Changes</Button>
    </div>
  ),
};

// Full Width
export const FullWidth: Story = {
  args: {
    className: 'w-full',
    children: 'Full Width Button',
  },
  parameters: {
    layout: 'padded',
  },
};
