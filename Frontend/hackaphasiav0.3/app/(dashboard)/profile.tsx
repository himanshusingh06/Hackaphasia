/**
 * Profile Tab Screen - Enhanced for Refugee Support
 * Professional user profile with compassionate design and support features
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useUser } from '../../contexts/UserContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Settings,
  Shield,
  Bell,
  CircleHelp as HelpCircle,
  LogOut,
  ChevronRight,
  Heart,
  Globe,
  FileText,
  Camera,
  Edit,
  Star,
  Award,
  Languages
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, isLoading } = useUser();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  /**
   * Handle user logout
   */
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            const result = await logout();
            if (result.success) {
              router.replace('/(auth)/login');
            } else {
              Alert.alert('Error', result.error || 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  /**
   * Handle settings navigation
   */
  const handleSettingsNavigation = (setting) => {
    Alert.alert('Coming Soon', `${setting} feature will be available in the next update.`);
  };

  /**
   * Handle profile edit
   */
  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing feature will be available soon.');
  };

  const supportOptions = [
    {
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: '24/7 assistance available',
      color: '#3B82F6',
      bgColor: '#EBF8FF',
      onPress: () => handleSettingsNavigation('Help & Support'),
    },
    {
      icon: Languages,
      title: 'Language Support',
      subtitle: 'Multilingual assistance',
      color: '#7C3AED',
      bgColor: '#F3E8FF',
      onPress: () => handleSettingsNavigation('Language Support'),
    },
    {
      icon: FileText,
      title: 'Documents & Records',
      subtitle: 'Manage your documents',
      color: '#059669',
      bgColor: '#ECFDF5',
      onPress: () => handleSettingsNavigation('Documents'),
    },
    {
      icon: Heart,
      title: 'Wellness Resources',
      subtitle: 'Mental health support',
      color: '#DC2626',
      bgColor: '#FEF2F2',
      onPress: () => handleSettingsNavigation('Wellness'),
    },
  ];

  const settingsOptions = [
    {
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Manage your alerts',
      color: '#F59E0B',
      hasToggle: true,
      toggleValue: notificationsEnabled,
      onToggle: setNotificationsEnabled,
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      subtitle: 'Protect your information',
      color: '#10B981',
      onPress: () => handleSettingsNavigation('Privacy & Security'),
    },
    {
      icon: Globe,
      title: 'Language',
      subtitle: 'العربية • English • Español',
      color: '#3B82F6',
      onPress: () => handleSettingsNavigation('Language'),
    },
    {
      icon: Settings,
      title: 'General Settings',
      subtitle: 'App preferences',
      color: '#64748B',
      onPress: () => handleSettingsNavigation('General Settings'),
    },
  ];

  const achievements = [
    { icon: Award, title: 'Profile Complete', color: '#F59E0B' },
    { icon: Heart, title: 'Health Checkup', color: '#DC2626' },
    { icon: Star, title: 'Community Member', color: '#7C3AED' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <LinearGradient
          colors={['#1E40AF', '#3B82F6']}
          style={styles.profileHeader}
        >
          <View style={styles.profileHeaderContent}>
            <View style={styles.avatarSection}>
              <LinearGradient
                colors={['#FFFFFF', '#F3F4F6']}
                style={styles.avatarContainer}
              >
                <User size={40} color="#3B82F6" />
              </LinearGradient>

              <TouchableOpacity style={styles.cameraButton} activeOpacity={0.8}>
                <Camera size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || 'Welcome, Friend'}</Text>
              <Text style={styles.userRole}>Community Member</Text>
              <View style={styles.userStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>5</Text>
                  <Text style={styles.statLabel}>Services Used</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>12</Text>
                  <Text style={styles.statLabel}>Days Active</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={handleEditProfile}
              activeOpacity={0.8}
            >
              <Edit size={16} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Achievements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Your Achievements</Text>
          <View style={styles.achievementsContainer}>
            {achievements.map((achievement, index) => (
              <LinearGradient
                key={index}
                colors={[`${achievement.color}15`, `${achievement.color}25`]}
                style={styles.achievementBadge}
              >
                <achievement.icon size={20} color={achievement.color} />
                <Text style={[styles.achievementText, { color: achievement.color }]}>
                  {achievement.title}
                </Text>
              </LinearGradient>
            ))}
          </View>
        </View>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Personal Information</Text>

          <LinearGradient
            colors={['#FFFFFF', '#F8FAFC']}
            style={styles.infoCard}
          >
            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: '#FEE2E2' }]}>
                <Mail size={20} color="#DC2626" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email Address</Text>
                <Text style={styles.infoValue}>{user?.email || 'Not provided'}</Text>
              </View>
              <ChevronRight size={20} color="#64748B" />
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: '#DCFCE7' }]}>
                <Phone size={20} color="#059669" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone Number</Text>
                <Text style={styles.infoValue}>{user?.phone || 'Add phone number'}</Text>
              </View>
              <ChevronRight size={20} color="#64748B" />
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: '#EBF8FF' }]}>
                <MapPin size={20} color="#3B82F6" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Current Location</Text>
                <Text style={styles.infoValue}>
                  {user?.address ?
                    `${user.address.street}, ${user.address.city}` :
                    'Set your location'
                  }
                </Text>
              </View>
              <ChevronRight size={20} color="#64748B" />
            </View>
          </LinearGradient>
        </View>

        {/* Support Services Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🤝 Support Services</Text>

          <View style={styles.supportGrid}>
            {supportOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.supportCard, { backgroundColor: option.bgColor }]}
                onPress={option.onPress}
                activeOpacity={0.8}
              >
                <View style={[styles.supportIcon, { backgroundColor: `${option.color}20` }]}>
                  <option.icon size={24} color={option.color} />
                </View>
                <Text style={styles.supportTitle}>{option.title}</Text>
                <Text style={styles.supportSubtitle}>{option.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Settings</Text>

          <LinearGradient
            colors={['#FFFFFF', '#F8FAFC']}
            style={styles.settingsCard}
          >
            {settingsOptions.map((option, index) => (
              <View key={index}>
                <TouchableOpacity
                  style={styles.settingRow}
                  onPress={option.onPress}
                  activeOpacity={0.8}
                >
                  <View style={[styles.settingIcon, { backgroundColor: `${option.color}15` }]}>
                    <option.icon size={20} color={option.color} />
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>{option.title}</Text>
                    <Text style={styles.settingSubtitle}>{option.subtitle}</Text>
                  </View>
                  {option.hasToggle ? (
                    <Switch
                      value={option.toggleValue}
                      onValueChange={option.onToggle}
                      trackColor={{ false: '#E5E7EB', true: '#DBEAFE' }}
                      thumbColor={option.toggleValue ? '#3B82F6' : '#9CA3AF'}
                    />
                  ) : (
                    <ChevronRight size={20} color="#64748B" />
                  )}
                </TouchableOpacity>
                {index < settingsOptions.length - 1 && (
                  <View style={styles.settingDivider} />
                )}
              </View>
            ))}
          </LinearGradient>
        </View>

        {/* Emergency Contact Card */}
        <View style={styles.section}>
          <LinearGradient
            colors={['#FEF2F2', '#FEE2E2']}
            style={styles.emergencyCard}
          >
            <View style={styles.emergencyHeader}>
              <View style={styles.emergencyIcon}>
                <Phone size={24} color="#DC2626" />
              </View>
              <View>
                <Text style={styles.emergencyTitle}>Emergency Contact</Text>
                <Text style={styles.emergencySubtitle}>24/7 Crisis Support</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.emergencyButton} activeOpacity={0.8}>
              <LinearGradient
                colors={['#DC2626', '#EF4444']}
                style={styles.emergencyButtonGradient}
              >
                <Text style={styles.emergencyButtonText}>Call Now</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FFFFFF', '#F9FAFB']}
              style={styles.logoutGradient}
            >
              <LogOut size={20} color="#DC2626" />
              <Text style={styles.logoutButtonText}>
                {isLoading ? 'Signing out...' : 'Sign Out'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.footerText}>
            Built with care for our community
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  scrollContainer: {
    paddingBottom: 120,
  },
  profileHeader: {
    margin: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  profileHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarSection: {
    position: 'relative',
    marginRight: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: '#BFDBFE',
    marginBottom: 12,
  },
  userStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#BFDBFE',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 16,
  },
  editProfileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  achievementText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoCard: {
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginLeft: 72,
  },
  supportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  supportCard: {
    width: (width - 52) / 2,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  supportIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  supportTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 4,
  },
  supportSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  settingsCard: {
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  settingDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginLeft: 68,
  },
  emergencyCard: {
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emergencyIcon: {
    marginRight: 16,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: 2,
  },
  emergencySubtitle: {
    fontSize: 14,
    color: '#991B1B',
  },
  emergencyButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  emergencyButtonGradient: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  logoutButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    gap: 12,
  },
  logoutButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
});