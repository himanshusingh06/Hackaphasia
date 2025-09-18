/**
 * Dashboard Tab Layout - Enhanced for Refugee Support
 * Professional navigation with gradient styling and refugee-focused design
 */

import { Tabs } from 'expo-router';
import { Chrome as Home, Heart, User } from 'lucide-react-native';
import { Platform } from 'react-native';

export default function DashboardLayout() {
  return (
    <Tabs
      screenOptions={{
        statusBar: 'dark',
        headerShown: false,
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 12,
          paddingHorizontal: 20,
          borderRadius: 24,
          marginHorizontal: 20,
          marginBottom: Platform.OS === 'ios' ? 0 : 12,
          position: 'absolute',
          shadowColor: '#3B82F6',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
        },
        tabBarItemStyle: {
          borderRadius: 16,
          marginHorizontal: 4,
          paddingVertical: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
        tabBarActiveBackgroundColor: 'rgba(59, 130, 246, 0.08)',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color, focused }) => (
            <Home
              size={focused ? 26 : 24}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          title: 'Health Care',
          tabBarIcon: ({ size, color, focused }) => (
            <Heart
              size={focused ? 26 : 24}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
              fill={focused ? color : 'transparent'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'My Profile',
          tabBarIcon: ({ size, color, focused }) => (
            <User
              size={focused ? 26 : 24}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
    </Tabs>
  );
}