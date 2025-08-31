// src/navigation/MainTabs.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardScreenV2 } from '@/screens/main/DashboardScreenV2';
import { VaultScreenV2 } from '@/screens/main/VaultScreenV2';
import { ScannerScreen } from '@/screens/main/ScannerScreen';
import { ProfileScreen } from '@/screens/main/ProfileScreen';
import { Camera, Home, Shield, User } from 'lucide-react-native';
import { useTheme } from '@legacyguard/ui';

const Tab = createBottomTabNavigator();

export const MainTabs = () => {
  const theme = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.primaryBlue.val,
        tabBarInactiveTintColor: theme.gray5.val,
        tabBarStyle: {
          backgroundColor: theme.background.val,
          borderTopColor: theme.borderColor.val,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
          shadowColor: theme.shadowColor.val,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Inter',
        },
        headerStyle: {
          backgroundColor: theme.background.val,
          shadowColor: theme.shadowColor.val,
        },
        headerTintColor: theme.color.val,
        headerTitleStyle: {
          fontFamily: 'Inter',
          fontWeight: '600',
        },
      }}
  >
    <Tab.Screen 
      name="Dashboard" 
      component={DashboardScreenV2} 
      options={{ 
        tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        tabBarLabel: 'Home',
      }} 
    />
    <Tab.Screen 
      name="Scan" 
      component={ScannerScreen} 
      options={{ 
        tabBarIcon: ({ color, size }) => <Camera color={color} size={size} />,
        tabBarLabel: 'Scan',
        headerShown: false, // Hide header for full-screen scanner
      }} 
    />
    <Tab.Screen 
      name="Vault" 
      component={VaultScreenV2} 
      options={{ 
        tabBarIcon: ({ color, size }) => <Shield color={color} size={size} />,
        tabBarLabel: 'Vault',
      }} 
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen} 
      options={{ 
        tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        tabBarLabel: 'Profile',
      }} 
    />
    </Tab.Navigator>
  );
};
