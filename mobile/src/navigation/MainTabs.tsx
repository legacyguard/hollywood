// src/navigation/MainTabs.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardScreen } from '@/screens/main/DashboardScreen';
import { VaultScreen } from '@/screens/main/VaultScreen';
import { ScannerScreen } from '@/screens/main/ScannerScreen';
import { Camera, Home, Shield } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#4CAF50',
      tabBarInactiveTintColor: '#999',
      tabBarStyle: {
        paddingBottom: 5,
        paddingTop: 5,
        height: 60,
      },
      tabBarLabelStyle: {
        fontSize: 12,
      },
    }}
  >
    <Tab.Screen 
      name="Dashboard" 
      component={DashboardScreen} 
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
      component={VaultScreen} 
      options={{ 
        tabBarIcon: ({ color, size }) => <Shield color={color} size={size} />,
        tabBarLabel: 'Vault',
      }} 
    />
  </Tab.Navigator>
);
