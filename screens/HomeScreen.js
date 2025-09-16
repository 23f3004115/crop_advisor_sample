import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Card, Button, Title, Paragraph, Avatar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { colors } from '../App';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    getLocationAndWeather();
  }, []);

  const getLocationAndWeather = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location access is needed for weather updates');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      setWeatherData({
        temperature: 28,
        condition: 'Partly Cloudy',
        humidity: 72,
        rainfall: 0,
        location: 'Bangalore, Karnataka'
      });
    } catch (error) {
      console.log('Error getting location:', error);
    }
  };

  const quickActions = [
    {
      title: 'Soil Analysis',
      subtitle: 'Get crop recommendations',
      icon: 'leaf',
      color: colors.success,
      onPress: () => navigation.navigate('Soil', { screen: 'SoilInput' })
    },
    {
      title: 'Pest Detection',
      subtitle: 'Identify crop diseases',
      icon: 'camera',
      color: colors.warning,
      onPress: () => navigation.navigate('Pest', { screen: 'PestScan' })
    },
    {
      title: 'Weather Forecast',
      subtitle: '7-day predictions',
      icon: 'cloud',
      color: colors.accent,
      onPress: () => navigation.navigate('Weather')
    },
    {
      title: 'Market Prices',
      subtitle: 'Current crop rates',
      icon: 'trending-up',
      color: colors.secondary,
      onPress: () => navigation.navigate('Market')
    }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Gradient */}
      <LinearGradient
        colors={colors.gradient}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.appTitle}>Crop Advisor</Text>
          <Text style={styles.subtitle}>AI-Powered Farming Assistant</Text>
        </View>
      </LinearGradient>

      {/* Weather Card */}
      {weatherData && (
        <Card style={styles.weatherCard} elevation={8}>
          <Card.Content>
            <View style={styles.weatherHeader}>
              <Ionicons name="location" size={20} color={colors.primary} />
              <Text style={styles.locationText}>{weatherData.location}</Text>
            </View>
            <View style={styles.weatherContent}>
              <View style={styles.temperatureSection}>
                <Text style={styles.temperature}>{weatherData.temperature}°C</Text>
                <Text style={styles.condition}>{weatherData.condition}</Text>
              </View>
              <View style={styles.weatherDetails}>
                <View style={styles.weatherItem}>
                  <Ionicons name="water" size={16} color={colors.accent} />
                  <Text style={styles.weatherValue}>{weatherData.humidity}%</Text>
                </View>
                <View style={styles.weatherItem}>
                  <Ionicons name="rainy" size={16} color={colors.accent} />
                  <Text style={styles.weatherValue}>{weatherData.rainfall}mm</Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={action.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color + '15' }]}>
                <Ionicons name={action.icon} size={28} color={action.color} />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Features Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>
        <Card style={styles.featureCard} elevation={4}>
          <Card.Content>
            <View style={styles.featureItem}>
              <Ionicons name="analytics" size={20} color={colors.primary} />
              <Text style={styles.featureText}>AI-powered soil analysis and crop recommendations</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="camera" size={20} color={colors.primary} />
              <Text style={styles.featureText}>Advanced pest and disease detection</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="cloud" size={20} color={colors.primary} />
              <Text style={styles.featureText}>Accurate weather forecasting</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="trending-up" size={20} color={colors.primary} />
              <Text style={styles.featureText}>Real-time market price updates</Text>
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* Feedback Button */}
      <TouchableOpacity
        style={styles.feedbackButton}
        onPress={() => navigation.navigate('Feedback')}
      >
        <LinearGradient
          colors={[colors.secondary, colors.secondaryLight]}
          style={styles.feedbackGradient}
        >
          <Ionicons name="chatbubble-ellipses" size={20} color="white" />
          <Text style={styles.feedbackText}>Send Feedback</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 40,
    marginBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  welcomeText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '400',
    letterSpacing: 0.3,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    marginVertical: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  weatherCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  weatherContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  temperatureSection: {
    flex: 1,
  },
  temperature: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: -1,
  },
  condition: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  weatherDetails: {
    alignItems: 'flex-end',
    gap: 8,
  },
  weatherItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.borderLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  weatherValue: {
    marginLeft: 6,
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  actionsGrid: {
    gap: 16,
  },
  actionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: colors.borderLight,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.1,
  },
  actionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '400',
    letterSpacing: 0.1,
  },
  featureCard: {
    borderRadius: 20,
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: colors.borderLight,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  featureText: {
    marginLeft: 16,
    fontSize: 15,
    color: colors.text,
    flex: 1,
    lineHeight: 22,
    fontWeight: '400',
    letterSpacing: 0.1,
  },
  feedbackButton: {
    marginHorizontal: 24,
    marginBottom: 40,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  feedbackGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  feedbackText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    letterSpacing: 0.1,
  },
});
