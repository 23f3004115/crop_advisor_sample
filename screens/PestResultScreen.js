import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { colors } from '../colors';

const { width } = Dimensions.get('window');

export default function PestResultScreen({ route, navigation }) {
  const { pestResults } = route.params;

  useEffect(() => {
    speakResults();
  }, [speakResults]);

  const speakResults = useCallback(() => {
    const message = pestResults.detected 
      ? `Pest detection complete. Found ${pestResults.pests.length} potential issues in your crop.`
      : 'Pest detection complete. No pests detected. Your crop looks healthy.';
    Speech.speak(message);
  }, [pestResults]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return colors.error;
      case 'Medium': return colors.warning;
      case 'Low': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const getHealthColor = (health) => {
    return health === 'Good' ? colors.success : colors.warning;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={colors.gradient}
        style={styles.header}
      >
        <Ionicons 
          name={pestResults.detected ? "warning" : "checkmark-circle"} 
          size={40} 
          color="white" 
        />
        <Text style={styles.headerTitle}>Detection Complete</Text>
        <Text style={styles.headerSubtitle}>AI analysis results</Text>
      </LinearGradient>

      {/* Image and Health Status */}
      <Card style={styles.imageCard} elevation={6}>
        <Card.Content>
          <View style={styles.imageSection}>
            <Image source={{ uri: pestResults.image }} style={styles.cropImage} />
            <View style={styles.healthStatus}>
              <View style={[styles.healthBadge, { backgroundColor: getHealthColor(pestResults.overallHealth) + '15' }]}>
                <Ionicons 
                  name={pestResults.overallHealth === 'Good' ? "leaf" : "warning"} 
                  size={16} 
                  color={getHealthColor(pestResults.overallHealth)} 
                />
                <Text style={[styles.healthText, { color: getHealthColor(pestResults.overallHealth) }]}>
                  Plant Health: {pestResults.overallHealth}
                </Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Detection Results */}
      {pestResults.detected && pestResults.pests.length > 0 ? (
        <Card style={styles.resultsCard} elevation={4}>
          <Card.Content>
            <View style={styles.resultsHeader}>
              <Ionicons name="bug" size={24} color={colors.error} />
              <Text style={styles.sectionTitle}>Detected Issues</Text>
            </View>
            
            {pestResults.pests.map((pest, index) => (
              <View key={index} style={[styles.pestItem, { borderLeftColor: getSeverityColor(pest.severity) }]}>
                <View style={styles.pestHeader}>
                  <Text style={styles.pestName}>{pest.name}</Text>
                  <View style={[styles.confidenceBadge, { backgroundColor: colors.accent + '15' }]}>
                    <Text style={[styles.confidenceText, { color: colors.accent }]}>
                      {pest.confidence}% confidence
                    </Text>
                  </View>
                </View>
                
                <View style={styles.pestDetails}>
                  <View style={styles.pestDetail}>
                    <Text style={styles.detailLabel}>Severity:</Text>
                    <Text style={[styles.detailValue, { color: getSeverityColor(pest.severity) }]}>
                      {pest.severity}
                    </Text>
                  </View>
                  
                  <View style={styles.pestDetail}>
                    <Text style={styles.detailLabel}>Treatment:</Text>
                    <Text style={styles.detailValue}>{pest.treatment}</Text>
                  </View>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
      ) : (
        <Card style={styles.healthyCard} elevation={4}>
          <Card.Content>
            <View style={styles.healthyContent}>
              <Ionicons name="checkmark-circle" size={60} color={colors.success} />
              <Text style={styles.healthyTitle}>No Pests Detected!</Text>
              <Text style={styles.healthySubtitle}>
                Your crop appears healthy. Continue regular monitoring for best results.
              </Text>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Recommendations */}
      <Card style={styles.recommendationsCard} elevation={4}>
        <Card.Content>
          <View style={styles.recommendationsHeader}>
            <Ionicons name="bulb" size={24} color={colors.warning} />
            <Text style={styles.sectionTitle}>Recommendations</Text>
          </View>
          
          <View style={styles.recommendationsList}>
            {pestResults.detected ? (
              <>
                <View style={styles.recommendationItem}>
                  <Ionicons name="medical" size={16} color={colors.success} />
                  <Text style={styles.recommendationText}>
                    Apply recommended treatments immediately
                  </Text>
                </View>
                <View style={styles.recommendationItem}>
                  <Ionicons name="eye" size={16} color={colors.accent} />
                  <Text style={styles.recommendationText}>
                    Monitor crop daily for changes
                  </Text>
                </View>
                <View style={styles.recommendationItem}>
                  <Ionicons name="people" size={16} color={colors.primary} />
                  <Text style={styles.recommendationText}>
                    Consult local agricultural expert if needed
                  </Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.recommendationItem}>
                  <Ionicons name="calendar" size={16} color={colors.success} />
                  <Text style={styles.recommendationText}>
                    Continue regular crop monitoring
                  </Text>
                </View>
                <View style={styles.recommendationItem}>
                  <Ionicons name="water" size={16} color={colors.accent} />
                  <Text style={styles.recommendationText}>
                    Maintain proper irrigation schedule
                  </Text>
                </View>
                <View style={styles.recommendationItem}>
                  <Ionicons name="leaf" size={16} color={colors.primary} />
                  <Text style={styles.recommendationText}>
                    Apply preventive organic treatments
                  </Text>
                </View>
              </>
            )}
          </View>
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('PestScan')}
        >
          <LinearGradient
            colors={[colors.accent, '#00ACC1']}
            style={styles.actionGradient}
          >
            <Ionicons name="camera" size={20} color="white" />
            <Text style={styles.actionText}>New Scan</Text>
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
            <Text style={styles.actionText}>Weather</Text>
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
  imageCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 0.5,
    borderColor: colors.borderLight,
  },
  imageSection: {
    alignItems: 'center',
  },
  cropImage: {
    width: width - 80,
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  healthStatus: {
    marginTop: 15,
  },
  healthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  healthText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  resultsCard: {
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
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 12,
    letterSpacing: -0.2,
  },
  pestItem: {
    borderLeftWidth: 4,
    paddingLeft: 15,
    paddingVertical: 15,
    marginBottom: 15,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  pestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  pestName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  confidenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  pestDetails: {
    gap: 8,
  },
  pestDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 8,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  healthyCard: {
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
  healthyContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  healthyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.success,
    marginTop: 15,
  },
  healthySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  recommendationsCard: {
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
  recommendationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  recommendationsList: {
    gap: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendationText: {
    marginLeft: 12,
    fontSize: 14,
    color: colors.text,
    flex: 1,
    lineHeight: 18,
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
