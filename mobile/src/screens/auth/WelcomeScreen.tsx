import React from 'react';
import {
  YStack,
  H1,
  Button,
  Container
} from '@legacyguard/ui';

interface WelcomeScreenProps {
  navigation: any; // Using 'any' for simplicity, can be properly typed with NavigationProp
}

export const WelcomeScreen = ({ navigation }: WelcomeScreenProps) => (
  <Container size="small" padding="large">
    <YStack flex={1} justifyContent="center" alignItems="center" gap="$4">
      <H1>Welcome to LegacyGuard</H1>
      <Button
        variant="primary"
        size="large"
        onPress={() => navigation.navigate('Login')}
      >
        Login
      </Button>
    </YStack>
  </Container>
);

export default WelcomeScreen;
