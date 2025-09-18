/**
 * Entry Point - Main Index Screen
 * Handles initial app routing based on authentication state
 */

import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../contexts/UserContext';

export default function IndexScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkStoredUser } = useUser();
  const [hasNavigated, setHasNavigated] = useState(false);

  /**
   * Check authentication status on mount
   * Redirect to appropriate navigation based on user state
   */
  useEffect(() => {
    const initializeApp = async () => {
      // Check for stored user
      await checkStoredUser();
    };

    initializeApp();
  }, []);

  /**
   * Handle navigation based on authentication state
   */
  useEffect(() => {
    if (!isLoading && !hasNavigated) {
      if (isAuthenticated) {
        // User is logged in - redirect to dashboard
        router.replace('/(dashboard)/');
        setHasNavigated(true);
      } else {
        // User is not logged in - redirect to auth
        router.replace('/(auth)/login');
        setHasNavigated(true);
      }
    }
  }, [isAuthenticated, isLoading, router, hasNavigated]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // This should not be reached due to navigation
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
});