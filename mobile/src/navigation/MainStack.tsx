import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { MainTabs } from './MainTabs'
import { DocumentsScreen } from '@/screens/main/DocumentsScreen'
import { PeopleScreen } from '@/screens/main/PeopleScreen'
import { WillScreen } from '@/screens/main/WillScreen'
import { useTheme } from '@legacyguard/ui'

const Stack = createNativeStackNavigator()

export const MainStack = () => {
  const theme = useTheme()
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background.val,
        },
        headerTintColor: theme.color.val,
        headerTitleStyle: {
          fontFamily: 'Inter',
          fontWeight: '600',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Documents" 
        component={DocumentsScreen}
        options={{ title: 'Documents' }}
      />
      <Stack.Screen 
        name="People" 
        component={PeopleScreen}
        options={{ title: 'Trusted Circle' }}
      />
      <Stack.Screen 
        name="Will" 
        component={WillScreen}
        options={{ title: 'Will Generator' }}
      />
    </Stack.Navigator>
  )
}
