import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Alert } from 'react-native';
import {
  YStack,
  H1,
  Button,
  Input,
  Container,
  Spinner
} from '@legacyguard/ui';
import { AuthenticationService } from '@/services/AuthenticationService';
import { useState } from 'react';

// Navigation types
// type AuthStackParamList = {
//   Welcome: undefined;
//   Login: undefined;
// };

type WelcomeScreenProps = {
  navigation: any; // Using 'any' for simplicity, can be properly typed with NavigationProp
};

// Placeholder Screens
const WelcomeScreen = ({ navigation }: WelcomeScreenProps) => (
  <Container size="small" padding="large">
    <YStack flex={1} justify="center" align="center" space="$4">
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

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      await AuthenticationService.loginWithEmail(email, password);
      // Navigation will happen automatically via AuthContext
    } catch (error) {
      Alert.alert(
        'Login Failed',
        error instanceof Error ? error.message : 'An error occurred during login'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container size="small" padding="large">
      <YStack flex={1} justify="center" space="$4">
        <H1 textAlign="center" marginBottom="$6">Login</H1>

        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          disabled={isLoading}
          size="large"
        />

        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          disabled={isLoading}
          size="large"
        />

        {isLoading ? (
          <YStack align="center" marginTop="$4">
            <Spinner size="large" color="$primaryBlue" />
          </YStack>
        ) : (
          <Button
            variant="primary"
            size="large"
            onPress={handleLogin}
            marginTop="$4"
          >
            Log In
          </Button>
        )}
      </YStack>
    </Container>
  );
};

// Styles are now handled by Tamagui components, no need for StyleSheet

const Stack = createNativeStackNavigator();

export const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);
