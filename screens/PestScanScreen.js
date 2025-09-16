import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { Card, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as Speech from 'expo-speech';

const { width } = Dimensions.get('window');

export default function PestScanScreen({ navigation }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera roll access is required to select images');
    }
  };

  const showInstructions = () => {
    Alert.alert(
      'Instructions',
      'Take a clear photo of your crop leaves or upload an existing image to detect pests and diseases using AI analysis.',
      [{ text: 'Got it', style: 'default' }]
    );
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera access is required to take photos');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const selectFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const useSampleImage = () => {
    // Use a sample pest image for demo
    setSelectedImage('https://via.placeholder.com/300x300/4CAF50/FFFFFF?text=Sample+Crop');
  };

  const analyzeImage = () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select or take a photo first');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      const mockResults = {
        image: selectedImage,
        detected: Math.random() > 0.3,
        pests: [
          { name: 'Aphids', confidence: 85, severity: 'Medium', treatment: 'Neem oil spray' },
          { name: 'Leaf Blight', confidence: 72, severity: 'High', treatment: 'Copper fungicide' }
        ],
        overallHealth: Math.random() > 0.5 ? 'Good' : 'Needs Attention'
      };
      
      navigation.navigate('PestResult', { pestResults: mockResults });
    }, 3000);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="bug" size={40} color="#2E7D31" />
        <Text style={styles.title}>Pest Detection</Text>
        <Text style={styles.subtitle}>Scan crops for diseases and pests</Text>
      </View>

      {/* Voice Instructions */}
      <Card style={styles.voiceCard} elevation={4}>
        <Card.Content>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={showInstructions}
          >
            <Ionicons name="information-circle" size={24} color="white" />
            <Text style={styles.infoButtonText}>View Instructions</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* Image Selection */}
      <Card style={styles.imageCard} elevation={6}>
        <Card.Content>
          {selectedImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => setSelectedImage(null)}
              >
                <Ionicons name="close-circle" size={30} color="#D32F2F" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <Ionicons name="camera-outline" size={80} color="#6B7280" />
              <Text style={styles.placeholderText}>No image selected</Text>
              <Text style={styles.placeholderSubtext}>
                Take a photo or select from gallery
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
          <LinearGradient
            colors={['#2E7D31', '#4CAF50']}
            style={styles.actionGradient}
          >
            <Ionicons name="camera" size={20} color="white" />
            <Text style={styles.actionText}>Take Photo</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={selectFromGallery}>
          <LinearGradient
            colors={['#2196F3', '#42A5F5']}
            style={styles.actionGradient}
          >
            <Ionicons name="images" size={20} color="white" />
            <Text style={styles.actionText}>Gallery</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={useSampleImage}>
          <LinearGradient
            colors={['#43A047', '#66BB6A']}
            style={styles.actionGradient}
          >
            <Ionicons name="image" size={20} color="white" />
            <Text style={styles.actionText}>Sample</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Analyze Button */}
      <TouchableOpacity
        style={[styles.analyzeButton, !selectedImage && styles.disabledButton]}
        onPress={analyzeImage}
        disabled={!selectedImage || isAnalyzing}
      >
        <LinearGradient
          colors={selectedImage ? ['#4CAF50', '#4CAF50'] : ['#CCCCCC', '#AAAAAA']}
          style={styles.analyzeGradient}
        >
          {isAnalyzing ? (
            <>
              <Ionicons name="sync" size={20} color="white" />
              <Text style={styles.analyzeText}>Analyzing...</Text>
            </>
          ) : (
            <>
              <Ionicons name="search" size={20} color="white" />
              <Text style={styles.analyzeText}>Analyze for Pests</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* Info Card */}
      <Card style={styles.infoCard} elevation={2}>
        <Card.Content>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={20} color="#FF6F00" />
            <Text style={styles.infoTitle}>Tips for best results</Text>
          </View>
          <Text style={styles.infoText}>
            • Take clear, well-lit photos of affected leaves{'\n'}
            • Focus on visible symptoms or pests{'\n'}
            • Avoid blurry or distant shots{'\n'}
            • Multiple angles help improve accuracy
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 6,
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  voiceCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6F00',
    paddingVertical: 16,
    borderRadius: 16,
  },
  infoButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    letterSpacing: 0.1,
  },
  imageCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    minHeight: 280,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  selectedImage: {
    width: width - 80,
    height: 240,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: -12,
    right: -12,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  placeholderContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 20,
    letterSpacing: -0.1,
  },
  placeholderSubtext: {
    fontSize: 15,
    color: '#9E9E9E',
    marginTop: 8,
    letterSpacing: 0.1,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
    letterSpacing: 0.1,
  },
  analyzeButton: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  analyzeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  analyzeText: {
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
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginLeft: 10,
    letterSpacing: -0.1,
  },
  infoText: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 24,
    fontWeight: '400',
  },
});
