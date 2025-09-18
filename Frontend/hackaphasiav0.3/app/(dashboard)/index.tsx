/**
 * Home Tab Screen - Enhanced for Refugee Support
 * Professional dashboard with AI assistant and refugee-focused features
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../../contexts/UserContext';
import {
  Calendar,
  MapPin,
  Phone,
  Activity,
  Mic,
  Heart,
  Users,
  Home,
  AlertTriangle,
  MessageCircle
} from 'lucide-react-native';
import { SpeechUtils } from '../../utils/TTS.ts'

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user } = useUser();
  const [isListening, setIsListening] = useState(false);
  const [micScale] = useState(new Animated.Value(1));

  const emergencyActions = [
    {
      icon: Phone,
      title: 'Emergency Call',
      subtitle: '24/7 Support',
      color: '#DC2626',
      bgColor: '#FEF2F2'
    },
    {
      icon: AlertTriangle,
      title: 'Report Issue',
      subtitle: 'Safety Concerns',
      color: '#D97706',
      bgColor: '#FFFBEB'
    },
  ];

  const quickActions = [
    {
      icon: Heart,
      title: 'Health Services',
      subtitle: 'Medical assistance',
      color: '#059669',
      bgColor: '#ECFDF5'
    },
    {
      icon: Home,
      title: 'Housing',
      subtitle: 'Find shelter',
      color: '#0369A1',
      bgColor: '#EFF6FF'
    },
    {
      icon: Users,
      title: 'Community',
      subtitle: 'Connect with others',
      color: '#7C3AED',
      bgColor: '#F3E8FF'
    },
    {
      icon: MapPin,
      title: 'Local Services',
      subtitle: 'Find nearby help',
      color: '#0891B2',
      bgColor: '#ECFEFF'
    },
  ];

  /**
   * Handle AI assistant interaction
   */
  const handleAIAssistant = async () => {
    if (isListening) {
      try {
        // Stop listening
        setIsListening(false);
        Animated.spring(micScale, {
          toValue: 1,
          useNativeDriver: true,
        }).start();

        // Wait for first speech to complete before starting the second
        await SpeechUtils.speak('Hello, world!');
        await SpeechUtils.speak('Bonjour le monde!', { language: 'fr-FR', rate: 0.7 });

        Alert.alert('AI Assistant', 'Voice recording stopped. Processing your request...');
      } catch (error) {
        console.error('TTS Error:', error);
        Alert.alert('Error', 'Failed to play speech. Please try again.');
      }
    }
    else {
          // Start listening
          setIsListening(true);
          Animated.loop(
            Animated.sequence([
              Animated.timing(micScale, {
                toValue: 1.2,
                duration: 500,
                useNativeDriver: true,
              }),
              Animated.timing(micScale, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
              }),
            ])
          ).start();
          Alert.alert('AI Assistant', 'Listening... Speak your question or concern.');
        }
  };


  const renderEmergencyCard = (action, index) => (
    <TouchableOpacity
      key={index}
      style={[styles.emergencyCard, { backgroundColor: action.bgColor }]}
      activeOpacity={0.8}
    >
      <View style={[styles.emergencyIcon, { backgroundColor: `${action.color}20` }]}>
        <action.icon size={24} color={action.color} />
      </View>
      <View style={styles.emergencyContent}>
        <Text style={[styles.emergencyTitle, { color: action.color }]}>{action.title}</Text>
        <Text style={styles.emergencySubtitle}>{action.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderQuickAction = (action, index) => (
    <TouchableOpacity
      key={index}
      style={[styles.quickActionCard, { backgroundColor: action.bgColor }]}
      activeOpacity={0.8}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}20` }]}>
        <action.icon size={24} color={action.color} />
      </View>
      <Text style={styles.quickActionTitle}>{action.title}</Text>
      <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Gradient Background */}
        <LinearGradient
          colors={['#1E40AF', '#3B82F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.userName}>{user?.name || 'Friend'}</Text>
              <Text style={styles.subtitle}>We're here to support you</Text>
            </View>

            {/* AI Assistant Button */}
            <TouchableOpacity
              style={styles.aiAssistantButton}
              onPress={handleAIAssistant}
              activeOpacity={0.8}
            >
              <Animated.View
                style={[
                  styles.micContainer,
                  { transform: [{ scale: micScale }] },
                  isListening && styles.micListening
                ]}
              >
                <Mic size={24} color={isListening ? '#DC2626' : '#FFFFFF'} />
              </Animated.View>
              <Text style={styles.aiAssistantText}>
                {isListening ? 'Listening...' : 'Ask AI'}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Emergency Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🚨 Emergency Support</Text>
            <Text style={styles.sectionDescription}>Immediate help available 24/7</Text>
          </View>

          <View style={styles.emergencyGrid}>
            {emergencyActions.map((action, index) => renderEmergencyCard(action, index))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🤝 Support Services</Text>
            <Text style={styles.sectionDescription}>Essential services for your wellbeing</Text>
          </View>

          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => renderQuickAction(action, index))}
          </View>
        </View>

        {/* Today's Overview Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Today's Overview</Text>

          <LinearGradient
            colors={['#FFFFFF', '#F8FAFC']}
            style={styles.overviewCard}
          >
            <View style={styles.overviewHeader}>
              <Text style={styles.overviewTitle}>
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
              <Text style={styles.overviewSubtitle}>Stay informed about your day</Text>
            </View>

            <View style={styles.overviewStats}>
              <View style={styles.statItem}>
                <LinearGradient
                  colors={['#3B82F6', '#1E40AF']}
                  style={styles.statIcon}
                >
                  <Calendar size={16} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.statValue}>2</Text>
                <Text style={styles.statLabel}>Appointments</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <LinearGradient
                  colors={['#059669', '#10B981']}
                  style={styles.statIcon}
                >
                  <Heart size={16} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.statValue}>1</Text>
                <Text style={styles.statLabel}>Check-ups</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <LinearGradient
                  colors={['#7C3AED', '#8B5CF6']}
                  style={styles.statIcon}
                >
                  <MessageCircle size={16} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.statValue}>3</Text>
                <Text style={styles.statLabel}>Messages</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Community Message */}
        <View style={styles.section}>
          <LinearGradient
            colors={['#FEF3C7', '#FDE68A']}
            style={styles.communityCard}
          >
            <View style={styles.communityIcon}>
              <Users size={24} color="#D97706" />
            </View>
            <View style={styles.communityContent}>
              <Text style={styles.communityTitle}>Community Support</Text>
              <Text style={styles.communityMessage}>
                You're not alone. Connect with others in your community for support, friendship, and shared experiences.
              </Text>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    paddingBottom: 32,
  },
  headerGradient: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 32,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 16,
    color: '#BFDBFE',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#DBEAFE',
  },
  aiAssistantButton: {
    alignItems: 'center',
    gap: 8,
  },
  micContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  micListening: {
    backgroundColor: '#FEF2F2',
    borderColor: '#DC2626',
  },
  aiAssistantText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#64748B',
  },
  emergencyGrid: {
    gap: 12,
  },
  emergencyCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emergencyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  emergencyContent: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emergencySubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  quickActionCard: {
    width: (width - 56) / 2,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  overviewCard: {
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  overviewHeader: {
    marginBottom: 24,
  },
  overviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  overviewSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  overviewStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 60,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
  },
  communityCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    alignItems: 'flex-start',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  communityIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  communityContent: {
    flex: 1,
  },
  communityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 8,
  },
  communityMessage: {
    fontSize: 14,
    color: '#A16207',
    lineHeight: 20,
  },
});