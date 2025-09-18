/**
 * Health Service Tab Screen - Enhanced for Refugee Support
 * Professional health services display with compassionate design
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Phone,
  MapPin,
  Clock,
  Star,
  CircleAlert as AlertCircle,
  Heart,
  Shield,
  Users,
  Activity,
  Stethoscope,
  Pill
} from 'lucide-react-native';
import HealthService from '../../services/healthService';

const { width } = Dimensions.get('window');

export default function HealthScreen() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Services', icon: Heart, color: '#3B82F6' },
    { id: 'emergency', name: 'Emergency', icon: AlertCircle, color: '#DC2626' },
    { id: 'general', name: 'General Care', icon: Stethoscope, color: '#059669' },
    { id: 'mental', name: 'Mental Health', icon: Users, color: '#7C3AED' },
    { id: 'pharmacy', name: 'Pharmacy', icon: Pill, color: '#D97706' },
  ];

  /**
   * Load health services on component mount
   */
  useEffect(() => {
    loadHealthServices();
  }, []);

  /**
   * Fetch health services from API
   */
  const loadHealthServices = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await HealthService.getHealthServices();

      if (result.success) {
        setServices(result.services);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Load health services error:', err);
      setError('Failed to load health services');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle service contact
   */
  const handleContact = (service) => {
    Alert.alert(
      `Contact ${service.name}`,
      `Phone: ${service.contact}\nAddress: ${service.address}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Now', onPress: () => console.log(`Calling ${service.contact}`) },
        { text: 'Get Directions', onPress: () => console.log(`Navigate to ${service.address}`) },
      ]
    );
  };

  /**
   * Filter services by category
   */
  const getFilteredServices = () => {
    if (selectedCategory === 'all') return services;
    return services.filter(service =>
      selectedCategory === 'emergency' ? service.emergency : service.category.toLowerCase().includes(selectedCategory)
    );
  };

  /**
   * Render category filter
   */
  const renderCategoryFilter = (category) => {
    const isSelected = selectedCategory === category.id;
    const IconComponent = category.icon;

    return (
      <TouchableOpacity
        key={category.id}
        style={[
          styles.categoryChip,
          isSelected && { backgroundColor: category.color }
        ]}
        onPress={() => setSelectedCategory(category.id)}
        activeOpacity={0.8}
      >
        <IconComponent
          size={16}
          color={isSelected ? '#FFFFFF' : category.color}
        />
        <Text style={[
          styles.categoryText,
          isSelected && { color: '#FFFFFF' }
        ]}>
          {category.name}
        </Text>
      </TouchableOpacity>
    );
  };

  /**
   * Render service card with enhanced styling
   */
  const renderServiceCard = (service) => (
    <View key={service.id} style={styles.serviceCard}>
      <LinearGradient
        colors={service.emergency ? ['#FEE2E2', '#FECACA'] : ['#FFFFFF', '#F8FAFC']}
        style={styles.serviceGradient}
      >
        {/* Service Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: service.image }} style={styles.serviceImage} />
          {service.emergency && (
            <LinearGradient
              colors={['#DC2626', '#EF4444']}
              style={styles.emergencyOverlay}
            >
              <AlertCircle size={16} color="#FFFFFF" />
              <Text style={styles.emergencyOverlayText}>Emergency</Text>
            </LinearGradient>
          )}
        </View>

        {/* Service Content */}
        <View style={styles.serviceContent}>
          <View style={styles.serviceHeader}>
            <View style={styles.serviceHeaderLeft}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.serviceCategory}>{service.category}</Text>
              </View>
            </View>

            <View style={styles.ratingContainer}>
              <Star size={16} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.rating}>{service.rating}</Text>
            </View>
          </View>

          <Text style={styles.serviceDescription} numberOfLines={2}>
            {service.description}
          </Text>

          {/* Service Details */}
          <View style={styles.serviceDetails}>
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Phone size={16} color="#059669" />
              </View>
              <Text style={styles.detailText}>{service.contact}</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <MapPin size={16} color="#3B82F6" />
              </View>
              <Text style={styles.detailText} numberOfLines={1}>
                {service.address}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Clock size={16} color="#7C3AED" />
              </View>
              <Text style={styles.detailText}>{service.hours}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => handleContact(service)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={service.emergency ? ['#DC2626', '#EF4444'] : ['#3B82F6', '#1D4ED8']}
                style={styles.buttonGradient}
              >
                <Phone size={16} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Contact Now</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => console.log('View details:', service.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#EBF8FF', '#F0F9FF']}
          style={styles.loadingContainer}
        >
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>Finding health services...</Text>
            <Text style={styles.loadingSubtext}>We're locating the best care for you</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#FEF2F2', '#FEE2E2']}
          style={styles.errorContainer}
        >
          <View style={styles.errorContent}>
            <Shield size={48} color="#DC2626" />
            <Text style={styles.errorTitle}>Connection Issue</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadHealthServices}>
              <LinearGradient
                colors={['#3B82F6', '#1D4ED8']}
                style={styles.retryGradient}
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const filteredServices = getFilteredServices();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={['#059669', '#10B981']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text style={styles.title}>🏥 Health Services</Text>
            <Text style={styles.subtitle}>
              Quality healthcare support when you need it most
            </Text>
          </View>

          <View style={styles.headerStats}>
            <View style={styles.statBubble}>
              <Heart size={20} color="#FFFFFF" />
              <Text style={styles.statNumber}>{services.length}</Text>
              <Text style={styles.statLabel}>Services</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Category Filters */}
        <View style={styles.categoriesSection}>
          <Text style={styles.categoriesTitle}>Find the right care</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {categories.map(category => renderCategoryFilter(category))}
          </ScrollView>
        </View>

        {/* Services List */}
        <View style={styles.servicesSection}>
          {filteredServices.length > 0 ? (
            <>
              <Text style={styles.servicesSectionTitle}>
                {selectedCategory === 'all' ? 'All Available Services' :
                 selectedCategory === 'emergency' ? 'Emergency Services' :
                 `${categories.find(c => c.id === selectedCategory)?.name || 'Selected'} Services`}
              </Text>
              {filteredServices.map(service => renderServiceCard(service))}
            </>
          ) : (
            <LinearGradient
              colors={['#FEF3C7', '#FDE68A']}
              style={styles.emptyState}
            >
              <Activity size={48} color="#D97706" />
              <Text style={styles.emptyTitle}>No Services Found</Text>
              <Text style={styles.emptyText}>
                Try selecting a different category or check back later
              </Text>
            </LinearGradient>
          )}
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
    paddingBottom: 100,
  },
  header: {
    margin: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  headerContent: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#D1FAE5',
  },
  headerStats: {
    alignItems: 'center',
  },
  statBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#D1FAE5',
  },
  categoriesSection: {
    marginBottom: 24,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 20,
    marginBottom: 16,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  servicesSection: {
    paddingHorizontal: 20,
  },
  servicesSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  serviceCard: {
    marginBottom: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  serviceGradient: {
    borderRadius: 16,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  serviceImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  emergencyOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  emergencyOverlayText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  serviceContent: {
    padding: 20,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serviceHeaderLeft: {
    flex: 1,
    marginRight: 12,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  serviceCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D97706',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },
  serviceDetails: {
    marginBottom: 20,
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  secondaryButtonText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContent: {
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DC2626',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#991B1B',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  retryGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 16,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400E',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#A16207',
    textAlign: 'center',
  },
});