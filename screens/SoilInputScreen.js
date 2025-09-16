import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { TextInput, Button, Card, Title } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { colors } from '../colors';

const { width } = Dimensions.get('window');

export default function SoilInputScreen({ navigation }) {
  const [soilData, setSoilData] = useState({
    ph: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    location: 'Bangalore, Karnataka'
  });
  const [isListening, setIsListening] = useState(false);
  const [recording, setRecording] = useState();

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let location = await Location.getCurrentPositionAsync({});
        let address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        
        if (address[0]) {
          setSoilData(prev => ({
            ...prev,
            location: `${address[0].city}, ${address[0].region}`
          }));
        }
      }
    } catch (error) {
      console.log('Location error:', error);
    }
  };

  const startVoiceInput = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Microphone access is required for voice input.');
        return;
      }

      setIsListening(true);
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);

      // Simulate voice input after 3 seconds
      setTimeout(async () => {
        await stopVoiceInput();
        setSoilData(prev => ({
          ...prev,
          ph: '6.5',
          nitrogen: '45',
          phosphorus: '23',
          potassium: '180'
        }));
        Alert.alert('Voice Input Complete', 'Soil parameters have been filled automatically.');
      }, 3000);

    } catch (err) {
      console.log('Failed to start recording', err);
      setIsListening(false);
    }
  };

  const stopVoiceInput = async () => {
    setIsListening(false);
    if (recording) {
      await recording.stopAndUnloadAsync();
      setRecording(undefined);
    }
  };

  const showInstructions = () => {
    Alert.alert(
      'Instructions',
      'Please enter your soil pH level, nitrogen, phosphorus, and potassium values. You can also use voice input to fill these values automatically.',
      [{ text: 'Got it', style: 'default' }]
    );
  };

  const validateAndSubmit = () => {
    const { ph, nitrogen, phosphorus, potassium } = soilData;
    
    if (!ph || !nitrogen || !phosphorus || !potassium) {
      Alert.alert('Missing Information', 'Please fill in all soil parameters');
      return;
    }

    const phNum = parseFloat(ph);
    const nNum = parseInt(nitrogen);
    const pNum = parseInt(phosphorus);
    const kNum = parseInt(potassium);

    if (phNum < 0 || phNum > 14) {
      Alert.alert('Invalid pH', 'pH should be between 0 and 14');
      return;
    }

    if (nNum < 0 || pNum < 0 || kNum < 0) {
      Alert.alert('Invalid Values', 'Nutrient values should be positive numbers');
      return;
    }

    navigation.navigate('SoilResult', { soilData });
  };

  const inputFields = [
    {
      label: 'pH Level (0-14)',
      key: 'ph',
      placeholder: '6.5',
      keyboardType: 'numeric',
      icon: 'flask',
      color: colors.primary
    },
    {
      label: 'Nitrogen (mg/kg)',
      key: 'nitrogen',
      placeholder: '45',
      keyboardType: 'numeric',
      icon: 'leaf',
      color: colors.success
    },
    {
      label: 'Phosphorus (mg/kg)',
      key: 'phosphorus',
      placeholder: '23',
      keyboardType: 'numeric',
      icon: 'nutrition',
      color: colors.warning
    },
    {
      label: 'Potassium (mg/kg)',
      key: 'potassium',
      placeholder: '180',
      keyboardType: 'numeric',
      icon: 'fitness',
      color: colors.accent
    }
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="flask" size={40} color={colors.primary} />
        <Text style={styles.title}>Soil Analysis</Text>
        <Text style={styles.subtitle}>Get AI-powered crop recommendations</Text>
      </View>

      {/* Voice Controls */}
      <Card style={styles.voiceCard} elevation={4}>
        <Card.Content>
          <Text style={styles.voiceTitle}>Voice Assistant</Text>
          <View style={styles.voiceControls}>
            <TouchableOpacity
              style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
              onPress={isListening ? stopVoiceInput : startVoiceInput}
            >
              <Ionicons 
                name={isListening ? "stop" : "mic"} 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.infoButton}
              onPress={showInstructions}
            >
              <Ionicons name="information-circle" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.voiceHint}>
            {isListening ? 'Listening... Speak your soil parameters' : 'Tap mic for voice input or info for instructions'}
          </Text>
        </Card.Content>
      </Card>

      {/* Location */}
      <Card style={styles.locationCard} elevation={2}>
        <Card.Content>
          <View style={styles.locationHeader}>
            <Ionicons name="location" size={20} color={colors.primary} />
            <Text style={styles.locationTitle}>Location</Text>
          </View>
          <TextInput
            mode="outlined"
            value={soilData.location}
            onChangeText={(text) => setSoilData(prev => ({ ...prev, location: text }))}
            style={styles.locationInput}
            theme={{ colors: { primary: colors.primary } }}
          />
        </Card.Content>
      </Card>

      {/* Soil Parameters */}
      <Card style={styles.parametersCard} elevation={4}>
        <Card.Content>
          <Text style={styles.parametersTitle}>Soil Parameters</Text>
          <View style={styles.parametersGrid}>
            {inputFields.map((field, index) => (
              <View key={field.key} style={styles.parameterItem}>
                <View style={styles.parameterHeader}>
                  <View style={[styles.parameterIcon, { backgroundColor: field.color + '15' }]}>
                    <Ionicons name={field.icon} size={20} color={field.color} />
                  </View>
                  <Text style={styles.parameterLabel}>{field.label}</Text>
                </View>
                <TextInput
                  mode="outlined"
                  value={soilData[field.key]}
                  onChangeText={(text) => setSoilData(prev => ({ ...prev, [field.key]: text }))}
                  placeholder={field.placeholder}
                  keyboardType={field.keyboardType}
                  style={styles.parameterInput}
                  theme={{ colors: { primary: field.color } }}
                />
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={validateAndSubmit}>
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          style={styles.submitGradient}
        >
          <Ionicons name="analytics" size={20} color="white" />
          <Text style={styles.submitText}>Analyze Soil & Get Recommendations</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Info Card */}
      <Card style={styles.infoCard} elevation={2}>
        <Card.Content>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={20} color={colors.accent} />
            <Text style={styles.infoTitle}>How it works</Text>
          </View>
          <Text style={styles.infoText}>
            Our AI analyzes your soil parameters to recommend the best crops for your land. 
            Accurate soil data leads to better recommendations and higher yields.
          </Text>
        </Card.Content>
      </Card>
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
    paddingVertical: 32,
    paddingHorizontal: 24,
    marginBottom: 24,
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  voiceCard: {
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
  voiceTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
    letterSpacing: -0.2,
  },
  voiceControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 20,
  },
  voiceButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  voiceButtonActive: {
    backgroundColor: colors.error,
  },
  infoButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  voiceHint: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '400',
    letterSpacing: 0.1,
  },
  locationCard: {
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
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 10,
    letterSpacing: -0.1,
  },
  locationInput: {
    backgroundColor: 'transparent',
    fontSize: 15,
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
  parametersTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 24,
    letterSpacing: -0.3,
  },
  parametersGrid: {
    gap: 24,
  },
  parameterItem: {
    marginBottom: 8,
  },
  parameterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  parameterIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  parameterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.1,
  },
  parameterInput: {
    backgroundColor: 'transparent',
    fontSize: 15,
  },
  submitButton: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  submitText: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    letterSpacing: -0.1,
  },
  infoCard: {
    marginHorizontal: 24,
    marginBottom: 40,
    borderRadius: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: colors.borderLight,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 10,
    letterSpacing: -0.1,
  },
  infoText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
    fontWeight: '400',
  },
});
