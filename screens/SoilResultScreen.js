import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Card, Button, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { colors } from '../colors';

const { width } = Dimensions.get('window');

export default function SoilResultScreen({ route, navigation }) {
  const { soilData } = route.params;
  const [recommendations, setRecommendations] = useState(null);

  useEffect(() => {
    generateRecommendations();
  }, [generateRecommendations]);

  const generateRecommendations = useCallback(() => {
    const ph = parseFloat(soilData.ph);
    const nitrogen = parseInt(soilData.nitrogen);
    const phosphorus = parseInt(soilData.phosphorus);
    const potassium = parseInt(soilData.potassium);

    let crops = [];
    let soilHealth = 'Good';
    let tips = [];

    // AI-like logic for crop recommendations
    if (ph >= 6.0 && ph <= 7.5 && nitrogen >= 40 && phosphorus >= 20 && potassium >= 150) {
      crops = ['Rice', 'Wheat', 'Corn', 'Tomato', 'Potato'];
      soilHealth = 'Excellent';
    } else if (ph >= 5.5 && ph <= 8.0) {
      crops = ['Barley', 'Soybean', 'Cotton', 'Sugarcane'];
      soilHealth = 'Good';
    } else {
      crops = ['Millet', 'Sorghum', 'Groundnut'];
      soilHealth = 'Fair - Needs improvement';
    }

    // Generate tips
    if (ph < 6.0) tips.push('Add lime to increase soil pH');
    if (ph > 7.5) tips.push('Add organic matter to lower pH');
    if (nitrogen < 40) tips.push('Apply nitrogen-rich fertilizer');
    if (phosphorus < 20) tips.push('Add phosphorus fertilizer');
    if (potassium < 150) tips.push('Apply potassium fertilizer');

    setRecommendations({
      crops,
      soilHealth,
      tips,
      ph,
      nitrogen,
      phosphorus,
      potassium
    });

    // Speak results
    const message = `Soil analysis complete. Recommended crops are ${crops.slice(0, 3).join(', ')}. Soil health is ${soilHealth}.`;
    Speech.speak(message);
  }, [soilData]);

  const getHealthColor = (health) => {
    if (health === 'Excellent') return colors.success;
    if (health === 'Good') return colors.primary;
    return colors.warning;
  };

  const getParameterStatus = (value, min, max) => {
    if (value >= min && value <= max) return { icon: 'checkmark-circle', color: colors.success };
    return { icon: 'warning', color: colors.warning };
  };

  if (!recommendations) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="analytics" size={50} color={colors.primary} />
        <Text style={styles.loadingText}>Analyzing soil composition...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={colors.gradient}
        style={styles.header}
      >
        <Ionicons name="checkmark-circle" size={40} color="white" />
        <Text style={styles.headerTitle}>Analysis Complete</Text>
        <Text style={styles.headerSubtitle}>AI-powered recommendations ready</Text>
      </LinearGradient>

      {/* Soil Health */}
      <Card style={styles.healthCard} elevation={6}>
        <Card.Content>
          <View style={styles.healthHeader}>
            <Ionicons name="fitness" size={24} color={getHealthColor(recommendations.soilHealth)} />
            <Text style={styles.healthTitle}>Soil Health Status</Text>
          </View>
          <View style={[styles.healthBadge, { backgroundColor: getHealthColor(recommendations.soilHealth) + '15' }]}>
            <Text style={[styles.healthText, { color: getHealthColor(recommendations.soilHealth) }]}>
              {recommendations.soilHealth}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Soil Parameters */}
      <Card style={styles.parametersCard} elevation={4}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Soil Parameters</Text>
          <View style={styles.parametersGrid}>
            {[
              { label: 'pH Level', value: recommendations.ph, min: 6.0, max: 7.5, unit: '' },
              { label: 'Nitrogen', value: recommendations.nitrogen, min: 40, max: 200, unit: 'mg/kg' },
              { label: 'Phosphorus', value: recommendations.phosphorus, min: 20, max: 100, unit: 'mg/kg' },
              { label: 'Potassium', value: recommendations.potassium, min: 150, max: 300, unit: 'mg/kg' }
            ].map((param, index) => {
              const status = getParameterStatus(param.value, param.min, param.max);
              return (
                <View key={index} style={styles.parameterRow}>
                  <View style={styles.parameterInfo}>
                    <Text style={styles.parameterLabel}>{param.label}</Text>
                    <Text style={styles.parameterValue}>
                      {param.value}{param.unit}
                    </Text>
                  </View>
                  <Ionicons name={status.icon} size={20} color={status.color} />
                </View>
              );
            })}
          </View>
        </Card.Content>
      </Card>

      {/* Recommended Crops */}
      <Card style={styles.cropsCard} elevation={4}>
        <Card.Content>
          <View style={styles.cropsHeader}>
            <Ionicons name="leaf" size={24} color={colors.success} />
            <Text style={styles.sectionTitle}>Recommended Crops</Text>
          </View>
          <View style={styles.cropsGrid}>
            {recommendations.crops.map((crop, index) => (
              <View key={index} style={styles.cropChip}>
                <Ionicons name="leaf" size={16} color={colors.success} />
                <Text style={styles.cropText}>{crop}</Text>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Improvement Tips */}
      {recommendations.tips.length > 0 && (
        <Card style={styles.tipsCard} elevation={4}>
          <Card.Content>
            <View style={styles.tipsHeader}>
              <Ionicons name="bulb" size={24} color={colors.warning} />
              <Text style={styles.sectionTitle}>Improvement Tips</Text>
            </View>
            {recommendations.tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Ionicons name="arrow-forward" size={16} color={colors.warning} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('SoilInput')}
        >
          <LinearGradient
            colors={[colors.accent, '#00ACC1']}
            style={styles.actionGradient}
          >
            <Ionicons name="refresh" size={20} color="white" />
            <Text style={styles.actionText}>New Analysis</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Weather')}
        >
          <LinearGradient
            colors={[colors.secondary, colors.secondaryLight]}
            style={styles.actionGradient}
          >
            <Ionicons name="cloud" size={20} color="white" />
            <Text style={styles.actionText}>Check Weather</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    marginBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginTop: 12,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 6,
    letterSpacing: 0.1,
  },
  healthCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: colors.borderLight,
  },
  healthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  healthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 10,
  },
  healthBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  healthText: {
    fontSize: 16,
    fontWeight: '600',
  },
  parametersCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: colors.borderLight,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  parametersGrid: {
    gap: 12,
  },
  parameterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  parameterInfo: {
    flex: 1,
  },
  parameterLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  parameterValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 2,
  },
  cropsCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: colors.borderLight,
  },
  cropsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cropsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  cropChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '15',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cropText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: colors.success,
  },
  tipsCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: colors.borderLight,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tipText: {
    marginLeft: 10,
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 40,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  actionText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
    letterSpacing: 0.1,
  },
});
