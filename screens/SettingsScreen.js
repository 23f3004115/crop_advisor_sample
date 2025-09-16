import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Card, List, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import * as Speech from 'expo-speech';
import { colors } from '../colors';

export default function SettingsScreen({ currentLanguage, onLanguageChange }) {
  const [settings, setSettings] = useState({
    language: currentLanguage || 'English',
    voiceEnabled: true,
    notifications: true,
    autoLocation: true,
    units: 'metric'
  });

  const languages = [
    { label: 'English', value: 'English' },
    { label: 'हिंदी (Hindi)', value: 'हिंदी' },
    { label: 'தமிழ் (Tamil)', value: 'தமிழ்' },
    { label: 'తెలుగు (Telugu)', value: 'తెలుగు' },
    { label: 'ಕನ್ನಡ (Kannada)', value: 'ಕನ್ನಡ' },
    { label: 'मराठी (Marathi)', value: 'मराठी' }
  ];

  const units = [
    { label: 'Metric (°C, mm)', value: 'metric' },
    { label: 'Imperial (°F, in)', value: 'imperial' }
  ];

  // Sync language when currentLanguage prop changes
  useEffect(() => {
    if (currentLanguage) {
      setSettings(prev => ({ ...prev, language: currentLanguage }));
    }
  }, [currentLanguage]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // If language is being changed, update the main app's language
    if (key === 'language' && onLanguageChange) {
      onLanguageChange(value);
    }
  };

  const testVoice = async () => {
    if (!settings.voiceEnabled) {
      Alert.alert('Voice Disabled', 'Please enable voice features first');
      return;
    }

    const messages = {
      English: 'Voice test successful. Crop Advisor is ready to assist you.',
      'हिंदी': 'आवाज़ परीक्षण सफल। फसल सलाहकार आपकी सहायता के लिए तैयार है।',
      'தமிழ்': 'குரல் சோதனை வெற்றிகரமானது. பயிர் ஆலோசகர் உங்களுக்கு உதவ தயாராக உள்ளது.',
      'తెలుగు': 'వాయిస్ టెస్ట్ విజయవంతమైంది. క్రాప్ అడ్వైజర్ మీకు సహాయం చేయడానికి సిద్ధంగా ఉంది.',
      'ಕನ್ನಡ': 'ಧ್ವನಿ ಪರೀಕ್ಷೆ ಯಶಸ್ವಿಯಾಗಿದೆ. ಬೆಳೆ ಸಲಹೆಗಾರ ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ಸಿದ್ಧವಾಗಿದೆ.',
      'मराठी': 'आवाज चाचणी यशस्वी. पीक सल्लागार तुम्हाला मदत करण्यासाठी तयार आहे.'
    };

    const message = messages[settings.language] || messages.English;
    
    await Speech.speak(message, {
      language: getLanguageCode(settings.language),
      pitch: 1,
      rate: 0.8,
    });
  };

  const getLanguageCode = (language) => {
    const codes = {
      English: 'en-US',
      'हिंदी': 'hi-IN',
      'தமிழ்': 'ta-IN',
      'తెలుగు': 'te-IN',
      'ಕನ್ನಡ': 'kn-IN',
      'मराठी': 'mr-IN'
    };
    return codes[language] || 'en-US';
  };

  const resetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            setSettings({
              language: 'English',
              voiceEnabled: true,
              notifications: true,
              autoLocation: true,
              units: 'metric'
            });
            Speech.speak('Settings have been reset to default values.');
          }
        }
      ]
    );
  };

  const exportData = () => {
    Alert.alert(
      'Export Data',
      'Your crop analysis data and settings will be exported to a file.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => Speech.speak('Data export feature coming soon.') }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={colors.gradient}
        style={styles.header}
      >
        <Ionicons name="settings" size={40} color="white" />
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Customize your experience</Text>
      </LinearGradient>

      {/* Language Settings */}
      <Card style={styles.settingsCard} elevation={4}>
        <Card.Content>
          <View style={styles.settingHeader}>
            <Ionicons name="language" size={24} color={colors.primary} />
            <Text style={styles.settingTitle}>Language & Region</Text>
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>App Language</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={settings.language}
                onValueChange={(value) => updateSetting('language', value)}
                style={styles.picker}
              >
                {languages.map((lang) => (
                  <Picker.Item key={lang.value} label={lang.label} value={lang.value} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Units</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={settings.units}
                onValueChange={(value) => updateSetting('units', value)}
                style={styles.picker}
              >
                {units.map((unit) => (
                  <Picker.Item key={unit.value} label={unit.label} value={unit.value} />
                ))}
              </Picker>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Voice Settings */}
      <Card style={styles.settingsCard} elevation={4}>
        <Card.Content>
          <View style={styles.settingHeader}>
            <Ionicons name="mic" size={24} color={colors.accent} />
            <Text style={styles.settingTitle}>Voice Features</Text>
          </View>
          
          <View style={styles.switchItem}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchLabel}>Voice Assistant</Text>
              <Text style={styles.switchDescription}>Enable voice input and speech output</Text>
            </View>
            <Switch
              value={settings.voiceEnabled}
              onValueChange={(value) => updateSetting('voiceEnabled', value)}
              trackColor={{ false: '#E0E0E0', true: colors.primary + '40' }}
              thumbColor={settings.voiceEnabled ? colors.primary : '#FFFFFF'}
            />
          </View>

          <TouchableOpacity style={styles.testButton} onPress={testVoice}>
            <LinearGradient
              colors={[colors.accent, '#00ACC1']}
              style={styles.testGradient}
            >
              <Ionicons name="volume-high" size={20} color="white" />
              <Text style={styles.testText}>Test Voice</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* App Preferences */}
      <Card style={styles.settingsCard} elevation={4}>
        <Card.Content>
          <View style={styles.settingHeader}>
            <Ionicons name="phone-portrait" size={24} color={colors.success} />
            <Text style={styles.settingTitle}>App Preferences</Text>
          </View>
          
          <View style={styles.switchItem}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchLabel}>Push Notifications</Text>
              <Text style={styles.switchDescription}>Weather alerts and crop reminders</Text>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={(value) => updateSetting('notifications', value)}
              trackColor={{ false: '#E0E0E0', true: colors.success + '40' }}
              thumbColor={settings.notifications ? colors.success : '#FFFFFF'}
            />
          </View>

          <View style={styles.switchItem}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchLabel}>Auto Location</Text>
              <Text style={styles.switchDescription}>Automatically detect your location</Text>
            </View>
            <Switch
              value={settings.autoLocation}
              onValueChange={(value) => updateSetting('autoLocation', value)}
              trackColor={{ false: '#E0E0E0', true: colors.primary + '40' }}
              thumbColor={settings.autoLocation ? colors.primary : '#FFFFFF'}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Data & Privacy */}
      <Card style={styles.settingsCard} elevation={4}>
        <Card.Content>
          <View style={styles.settingHeader}>
            <Ionicons name="shield-checkmark" size={24} color={colors.warning} />
            <Text style={styles.settingTitle}>Data & Privacy</Text>
          </View>
          
          <TouchableOpacity style={styles.actionItem} onPress={exportData}>
            <View style={styles.actionInfo}>
              <Ionicons name="download" size={20} color={colors.accent} />
              <Text style={styles.actionLabel}>Export Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionInfo}>
              <Ionicons name="document-text" size={20} color={colors.primary} />
              <Text style={styles.actionLabel}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionInfo}>
              <Ionicons name="help-circle" size={20} color={colors.success} />
              <Text style={styles.actionLabel}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* App Info */}
      <Card style={styles.settingsCard} elevation={4}>
        <Card.Content>
          <View style={styles.settingHeader}>
            <Ionicons name="information-circle" size={24} color={colors.secondary} />
            <Text style={styles.settingTitle}>App Information</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Build</Text>
            <Text style={styles.infoValue}>2024.1</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Developer</Text>
            <Text style={styles.infoValue}>Crop Advisor Team</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Reset Button */}
      <TouchableOpacity style={styles.resetButton} onPress={resetSettings}>
        <LinearGradient
          colors={[colors.error, '#F44336']}
          style={styles.resetGradient}
        >
          <Ionicons name="refresh" size={20} color="white" />
          <Text style={styles.resetText}>Reset All Settings</Text>
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
  settingsCard: {
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
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 12,
    letterSpacing: -0.2,
  },
  settingItem: {
    marginBottom: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  picker: {
    height: 50,
  },
  switchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchInfo: {
    flex: 1,
    marginRight: 15,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  switchDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  testButton: {
    marginTop: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  testGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  testText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  actionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionLabel: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  resetButton: {
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
  resetGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  resetText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    letterSpacing: 0.1,
  },
});
