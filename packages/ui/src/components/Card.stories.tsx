import type { Meta, StoryObj } from '@storybook/react';
import { Heart, Settings, Star } from '@tamagui/lucide-icons';
import { Text, View } from 'tamagui';
import { Button } from './Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'filled', 'premium', 'success', 'danger', 'ghost'],
    },
    padding: {
      control: 'select',
      options: ['none', 'small', 'medium', 'large', 'xlarge'],
    },
    clickable: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>Default Card</CardTitle>
          <CardDescription>This is a default card with basic styling</CardDescription>
        </CardHeader>
        <CardContent>
          <Text>This is the main content of the card. It can contain any text or components.</Text>
        </CardContent>
        <CardFooter>
          <Button variant="primary">Action</Button>
        </CardFooter>
      </>
    ),
  },
};

export const WithLongContent: Story = {
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>Card with Long Content</CardTitle>
          <CardDescription>This card demonstrates how content wraps and handles long text</CardDescription>
        </CardHeader>
        <CardContent>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </Text>
          <Text marginTop="$3">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
          </Text>
        </CardContent>
        <CardFooter>
          <Button variant="secondary">Read More</Button>
          <Button variant="primary">Contact</Button>
        </CardFooter>
      </>
    ),
  },
};

export const WithInteractiveElements: Story = {
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>Interactive Card</CardTitle>
          <CardDescription>Card with buttons and inputs inside</CardDescription>
        </CardHeader>
        <CardContent>
          <View gap={12}>
            <View flexDirection="row" alignItems="center" gap={8}>
              <Text>User Profile</Text>
            </View>
            <View flexDirection="row" alignItems="center" gap={8}>
              <Text>user@example.com</Text>
            </View>
            <View flexDirection="row" alignItems="center" gap={8}>
              <Text>+1 (555) 123-4567</Text>
            </View>
            <View marginTop={16} gap={8}>
              <Button variant="outline" size="small">
                Edit Profile
              </Button>
              <Button variant="ghost" size="small">
                Change Settings
              </Button>
            </View>
          </View>
        </CardContent>
        <CardFooter>
          <Button variant="primary">Save Changes</Button>
          <Button variant="secondary">Cancel</Button>
        </CardFooter>
      </>
    ),
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: (
      <>
        <CardHeader>
          <CardTitle>Elevated Card</CardTitle>
          <CardDescription>This card has elevated styling with shadow</CardDescription>
        </CardHeader>
        <CardContent>
          <Text>Elevated cards provide visual depth and are great for highlighting important content.</Text>
        </CardContent>
      </>
    ),
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    children: (
      <>
        <CardHeader>
          <CardTitle>Filled Card</CardTitle>
          <CardDescription>Card with filled background</CardDescription>
        </CardHeader>
        <CardContent>
          <Text>Filled cards use a subtle background color to distinguish content areas.</Text>
        </CardContent>
      </>
    ),
  },
};

export const Premium: Story = {
  args: {
    variant: 'premium',
    children: (
      <>
        <CardHeader>
          <CardTitle>Premium Card</CardTitle>
          <CardDescription>Exclusive premium styling</CardDescription>
        </CardHeader>
        <CardContent>
          <Text>Premium cards use gold accents to indicate premium or exclusive content.</Text>
        </CardContent>
      </>
    ),
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: (
      <>
        <CardHeader>
          <CardTitle>Success Card</CardTitle>
          <CardDescription>Success state styling</CardDescription>
        </CardHeader>
        <CardContent>
          <Text>Success cards use green styling to indicate positive outcomes or successful operations.</Text>
        </CardContent>
      </>
    ),
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: (
      <>
        <CardHeader>
          <CardTitle>Danger Card</CardTitle>
          <CardDescription>Warning or error state</CardDescription>
        </CardHeader>
        <CardContent>
          <Text>Danger cards use red styling to indicate warnings, errors, or destructive actions.</Text>
        </CardContent>
      </>
    ),
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: (
      <>
        <CardHeader>
          <CardTitle>Ghost Card</CardTitle>
          <CardDescription>Transparent background styling</CardDescription>
        </CardHeader>
        <CardContent>
          <Text>Ghost cards have transparent backgrounds and are useful for subtle content separation.</Text>
        </CardContent>
      </>
    ),
  },
};

export const NoPadding: Story = {
  args: {
    padding: 'none',
    children: (
      <>
        <CardHeader>
          <CardTitle>No Padding Card</CardTitle>
          <CardDescription>Card with no padding</CardDescription>
        </CardHeader>
        <CardContent>
          <Text>This card has no padding, useful for full-width content like images.</Text>
        </CardContent>
      </>
    ),
  },
};

export const SmallPadding: Story = {
  args: {
    padding: 'small',
    children: (
      <>
        <CardHeader>
          <CardTitle>Small Padding</CardTitle>
          <CardDescription>Card with small padding</CardDescription>
        </CardHeader>
        <CardContent>
          <Text>This card uses small padding for compact layouts.</Text>
        </CardContent>
      </>
    ),
  },
};

export const LargePadding: Story = {
  args: {
    padding: 'large',
    children: (
      <>
        <CardHeader>
          <CardTitle>Large Padding</CardTitle>
          <CardDescription>Card with large padding</CardDescription>
        </CardHeader>
        <CardContent>
          <Text>This card uses large padding for spacious layouts.</Text>
        </CardContent>
      </>
    ),
  },
};

export const Clickable: Story = {
  args: {
    clickable: true,
    children: (
      <>
        <CardHeader>
          <CardTitle>Clickable Card</CardTitle>
          <CardDescription>This card has hover and press effects</CardDescription>
        </CardHeader>
        <CardContent>
          <Text>Clickable cards provide visual feedback on hover and press interactions.</Text>
        </CardContent>
      </>
    ),
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: (
      <>
        <CardHeader>
          <CardTitle>Full Width Card</CardTitle>
          <CardDescription>Card that spans full width</CardDescription>
        </CardHeader>
        <CardContent>
          <Text>This card spans the full width of its container.</Text>
        </CardContent>
      </>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <View gap={16}>
      <Card variant="default">
        <CardHeader>
          <CardTitle>Default</CardTitle>
        </CardHeader>
        <CardContent>
          <Text>Default variant</Text>
        </CardContent>
      </Card>
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Elevated</CardTitle>
        </CardHeader>
        <CardContent>
          <Text>Elevated variant</Text>
        </CardContent>
      </Card>
      <Card variant="filled">
        <CardHeader>
          <CardTitle>Filled</CardTitle>
        </CardHeader>
        <CardContent>
          <Text>Filled variant</Text>
        </CardContent>
      </Card>
      <Card variant="ghost">
        <CardHeader>
          <CardTitle>Ghost</CardTitle>
        </CardHeader>
        <CardContent>
          <Text>Ghost variant</Text>
        </CardContent>
      </Card>
    </View>
  ),
};

export const ComplexCard: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <View flexDirection="row" alignItems="center" gap={8}>
          <Star size={20} />
          <View>
            <CardTitle>Complex Card Example</CardTitle>
            <CardDescription>With multiple interactive elements</CardDescription>
          </View>
        </View>
      </CardHeader>
      <CardContent>
        <View gap={16}>
          <Text>
            This is a more complex card example that demonstrates how to combine multiple
            components and create rich, interactive experiences.
          </Text>
          <View flexDirection="row" gap={8} flexWrap="wrap">
            <Button size="small" variant="outline">
              Settings
            </Button>
            <Button size="small" variant="ghost">
              Favorite
            </Button>
            <Button size="small" variant="secondary">
              Share
            </Button>
          </View>
        </View>
      </CardContent>
      <CardFooter>
        <Button variant="primary">View Details</Button>
      </CardFooter>
    </Card>
  ),
};