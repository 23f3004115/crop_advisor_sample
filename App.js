import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Easing, Dimensions, Appearance } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, Card, TextInput, FAB, MD3LightTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { colors } from './colors';

// Import existing screens
import SoilInputScreen from './screens/SoilInputScreen';
import PestScanScreen from './screens/PestScanScreen';
import WeatherScreen from './screens/WeatherScreen';
import MarketScreen from './screens/MarketScreen';
import SettingsScreen from './screens/SettingsScreen';

const { width } = Dimensions.get('window');

// Force light theme for the entire app
const customLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    primaryContainer: colors.primaryLight,
    secondary: colors.secondary,
    surface: colors.surface,
    background: colors.background,
    onBackground: colors.text,
    onSurface: colors.text,
  }
};

export default function App() {
  const [isListening, setIsListening] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [voiceInput, setVoiceInput] = useState('');
  const [showVoicePanel, setShowVoicePanel] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [isRecording, setIsRecording] = useState(false);
  const [assistantResponse, setAssistantResponse] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const languages = [
    { name: 'English', code: 'en-US', greeting: 'Hello farmer! How can I help you today?' },
    { name: 'हिंदी', code: 'hi-IN', greeting: 'नमस्ते किसान भाई! आज मैं आपकी कैसे मदद कर सकता हूं?' },
    { name: 'தமிழ்', code: 'ta-IN', greeting: 'வணக்கம் விவசாயி! இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?' },
    { name: 'తెలుగు', code: 'te-IN', greeting: 'నమస్కారం రైతు గారు! ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?' },
    { name: 'ಕನ್ನಡ', code: 'kn-IN', greeting: 'ನಮಸ್ಕಾರ ರೈತರೇ! ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?' },
    { name: 'मराठी', code: 'mr-IN', greeting: 'नमस्कार शेतकरी मित्रा! आज मी तुमची कशी मदत करू शकतो?' }
  ];

  useEffect(() => {
    // Force light mode for the entire app
    Appearance.setColorScheme('light');
  }, []);

  useEffect(() => {
    // Pulse animation for voice button
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true })
      ]).start(() => pulse());
    };
    pulse();
  }, [pulseAnim]);

  const handleVoiceAssistant = async () => {
    setIsListening(!isListening);
    setShowVoicePanel(!showVoicePanel);
    
    if (!isListening) {
      setIsRecording(true);
      const responses = {
        'English': 'I am your farming assistant. You can ask me about crops, weather, soil analysis, pest control, or market prices. I can also help you navigate to different features.',
        'हिंदी': 'मैं आपका कृषि सहायक हूं। आप मुझसे फसल, मौसम, मिट्टी विश्लेषण, कीट नियंत्रण या बाजार की कीमतों के बारे में पूछ सकते हैं। मैं विभिन्न सुविधाओं में नेविगेट करने में भी मदद कर सकता हूं।',
        'தமிழ்': 'நான் உங்கள் விவசாய உதவியாளர். நீங்கள் பயிர்கள், வானிலை, மண் பகுப்பாய்வு, பூச்சி கட்டுப்பாடு அல்லது சந்தை விலைகளைப் பற்றி என்னிடம் கேட்கலாம்.',
        'తెలుగు': 'నేను మీ వ్యవసాయ సహాయకుడను. మీరు పంటలు, వాతావరణం, మట్టి విశ్లేషణ, కీటక నియంత్రణ లేదా మార్కెట్ ధరల గురించి నన్ను అడగవచ్చు.',
        'ಕನ್ನಡ': 'ನಾನು ನಿಮ್ಮ ಕೃಷಿ ಸಹಾಯಕ. ನೀವು ಬೆಳೆಗಳು, ಹವಾಮಾನ, ಮಣ್ಣಿನ ವಿಶ್ಲೇಷಣೆ, ಕೀಟ ನಿಯಂತ್ರಣ ಅಥವಾ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳ ಬಗ್ಗೆ ನನ್ನನ್ನು ಕೇಳಬಹುದು.',
        'मराठी': 'मी तुमचा शेती सहाय्यक आहे. तुम्ही मला पिके, हवामान, माती विश्लेषण, कीटक नियंत्रण किंवा बाजारभावांबद्दल विचारू शकता.'
      };
      
      setAssistantResponse(responses[currentLanguage]);
      
      // Simulate listening for 3 seconds
      setTimeout(() => {
        setIsRecording(false);
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  const navigateToScreen = (screenName) => {
    setCurrentScreen(screenName);
    const navigationMessages = {
      'English': `Opening ${screenName} for you.`,
      'हिंदी': `आपके लिए ${screenName} खोल रहा हूं।`,
      'தமிழ்': `உங்களுக்காக ${screenName} திறக்கிறேன்.`,
      'తెలుగు': `మీ కోసం ${screenName} తెరుస్తున్నాను.`,
      'ಕನ್ನಡ': `ನಿಮಗಾಗಿ ${screenName} ತೆರೆಯುತ್ತಿದ್ದೇನೆ.`,
      'मराठी': `तुमच्यासाठी ${screenName} उघडत आहे.`
    };
    
    // Navigation message removed - no speech synthesis
  };

  const menuItems = [
    { 
      name: 'Home', 
      icon: 'home', 
      screen: 'Home',
      description: 'Main dashboard'
    },
    { 
      name: 'Soil Analysis', 
      icon: 'leaf', 
      screen: 'SoilAnalysis',
      description: 'Test soil and get crop recommendations'
    },
    { 
      name: 'Pest Detection', 
      icon: 'camera', 
      screen: 'PestDetection',
      description: 'Scan crops for diseases and pests'
    },
    { 
      name: 'Weather Forecast', 
      icon: 'cloud', 
      screen: 'Weather',
      description: '7-day agricultural predictions'
    },
    { 
      name: 'Market Prices', 
      icon: 'trending-up', 
      screen: 'Market',
      description: 'Current crop pricing data'
    },
    { 
      name: 'Settings', 
      icon: 'settings', 
      screen: 'Settings',
      description: 'App preferences and language selection'
    }
  ];

  const handleMenuItemPress = (screen) => {
    setCurrentScreen(screen);
    setShowMenu(false);
  };

  const processVoiceCommand = (command) => {
    const responses = {
      'English': {
        soil: 'For soil analysis, check pH levels between 6-7. Add organic matter for better fertility. Would you like me to open the Soil Analysis screen?',
        weather: 'Check weather forecast regularly. Avoid irrigation before rain. Opening Weather screen for detailed forecast.',
        pest: 'Look for yellow leaves or spots. Use neem oil for organic pest control. Let me open Pest Detection for you.',
        market: 'Current rice prices are good. Consider selling after harvest. Opening Market Prices screen.',
        navigate_soil: 'Opening Soil Analysis screen for detailed crop recommendations.',
        navigate_pest: 'Opening Pest Detection screen to scan your crops.',
        navigate_weather: 'Opening Weather Forecast for agricultural planning.',
        navigate_market: 'Opening Market Prices for current crop rates.',
        default: 'I can help with soil analysis, weather forecast, pest detection, and market prices. You can also say "open soil analysis" or "show weather" to navigate.'
      },
      'हिंदी': {
        soil: 'मिट्टी की जांच के लिए, pH स्तर 6-7 के बीच रखें। बेहतर उर्वरता के लिए जैविक पदार्थ मिलाएं। क्या आप चाहते हैं कि मैं मिट्टी विश्लेषण स्क्रीन खोलूं?',
        weather: 'मौसम का पूर्वानुमान नियमित रूप से देखें। बारिश से पहले सिंचाई न करें। विस्तृत पूर्वानुमान के लिए मौसम स्क्रीन खोल रहा हूं।',
        pest: 'पीले पत्ते या धब्बे देखें। जैविक कीट नियंत्रण के लिए नीम का तेल उपयोग करें। आपके लिए कीट पहचान खोल रहा हूं।',
        market: 'वर्तमान में चावल की कीमतें अच्छी हैं। फसल के बाद बेचने पर विचार करें। बाजार भाव स्क्रीन खोल रहा हूं।',
        default: 'मैं मिट्टी विश्लेषण, मौसम पूर्वानुमान, कीट पहचान और बाजार भाव में मदद कर सकता हूं।'
      }
    };

    const langResponses = responses[currentLanguage] || responses['English'];
    let response = langResponses.default;
    let shouldNavigate = false;
    let targetScreen = '';

    // Check for navigation commands
    if (command.toLowerCase().includes('open soil') || command.toLowerCase().includes('soil analysis') || command.includes('मिट्टी')) {
      response = langResponses.navigate_soil || langResponses.soil;
      shouldNavigate = true;
      targetScreen = 'SoilAnalysis';
    } else if (command.toLowerCase().includes('open weather') || command.toLowerCase().includes('weather') || command.includes('मौसम')) {
      response = langResponses.navigate_weather || langResponses.weather;
      shouldNavigate = true;
      targetScreen = 'Weather';
    } else if (command.toLowerCase().includes('open pest') || command.toLowerCase().includes('pest') || command.includes('कीट')) {
      response = langResponses.navigate_pest || langResponses.pest;
      shouldNavigate = true;
      targetScreen = 'PestDetection';
    } else if (command.toLowerCase().includes('open market') || command.toLowerCase().includes('market') || command.includes('बाजार')) {
      response = langResponses.navigate_market || langResponses.market;
      shouldNavigate = true;
      targetScreen = 'Market';
    } else if (command.toLowerCase().includes('soil')) {
      response = langResponses.soil;
    } else if (command.toLowerCase().includes('weather')) {
      response = langResponses.weather;
    } else if (command.toLowerCase().includes('pest')) {
      response = langResponses.pest;
    } else if (command.toLowerCase().includes('market')) {
      response = langResponses.market;
    }
    setAssistantResponse(response);
    setVoiceInput('');
    
    // Navigate to screen if requested
    if (shouldNavigate) {
      setCurrentScreen(targetScreen);
    }
  };

  // Mock navigation object for screens
  const mockNavigation = {
    navigate: (screenName, params) => {
      console.log(`Navigating to ${screenName}`, params);
      if (screenName === 'SoilResult') {
        setCurrentScreen('SoilResult');
      } else if (screenName === 'PestResult') {
        setCurrentScreen('PestResult');
      }
    },
    goBack: () => setCurrentScreen('Home')
  };

  // Render different screens based on currentScreen state
  const renderScreen = () => {
    switch (currentScreen) {
      case 'SoilAnalysis':
        return <SoilInputScreen navigation={mockNavigation} />;
      case 'PestDetection':
        return <PestScanScreen navigation={mockNavigation} />;
      case 'Weather':
        return <WeatherScreen navigation={mockNavigation} />;
      case 'Market':
        return <MarketScreen navigation={mockNavigation} />;
      case 'Settings':
        return <SettingsScreen navigation={mockNavigation} currentLanguage={currentLanguage} onLanguageChange={setCurrentLanguage} />;
      default:
        return renderHomeScreen();
    }
  };

  const renderHomeScreen = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Voice Assistant Panel */}
      {showVoicePanel && (
        <Card style={styles.voicePanel} elevation={8}>
          <Card.Content>
            <View style={styles.voicePanelHeader}>
              <Ionicons name="microphone" size={24} color={colors.primary} />
              <Text style={styles.voicePanelTitle}>Voice Assistant</Text>
              <TouchableOpacity onPress={() => setShowVoicePanel(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            {isRecording && (
              <View style={styles.recordingIndicator}>
                <Animated.View style={[styles.recordingDot, { transform: [{ scale: pulseAnim }] }]} />
                <Text style={styles.recordingText}>Listening...</Text>
              </View>
            )}
            
            {assistantResponse && (
              <View style={styles.responseContainer}>
                <Text style={styles.responseText}>{assistantResponse}</Text>
              </View>
            )}
            
            <TextInput
              mode="outlined"
              label="Type your question or speak..."
              value={voiceInput}
              onChangeText={setVoiceInput}
              multiline
              style={styles.voiceInput}
              theme={{ colors: { primary: colors.primary } }}
            />
            
            <TouchableOpacity 
              style={styles.processButton}
              onPress={() => processVoiceCommand(voiceInput)}
            >
              <LinearGradient colors={[colors.primary, colors.success]} style={styles.processGradient}>
                <Ionicons name="send" size={20} color="white" />
                <Text style={styles.processText}>Get Answer</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      )}

      {/* Welcome Message */}
      <Card style={styles.welcomeCard} elevation={6}>
        <Card.Content>
          <View style={styles.welcomeHeader}>
            <Ionicons name="hand-left" size={30} color={colors.secondary} />
            <Text style={styles.welcomeTitle}>Welcome, Farmer!</Text>
          </View>
          <Text style={styles.welcomeText}>
            Your AI farming assistant is ready to help with crops, weather, soil analysis, and market prices. 
            Speak in your preferred language or tap the features below!
          </Text>
        </Card.Content>
      </Card>
      
      {/* Feature Grid */}
      <View style={styles.featureGrid}>
        {[
          { 
            icon: 'leaf', 
            title: 'Soil Analysis', 
            desc: 'Get crop recommendations based on soil health',
            color: colors.success,
            gradient: [colors.success, colors.primary],
            screen: 'SoilAnalysis'
          },
          { 
            icon: 'camera', 
            title: 'Pest Detection', 
            desc: 'Identify crop diseases using AI',
            color: colors.error,
            gradient: [colors.error, '#FF5722'],
            screen: 'PestDetection'
          },
          { 
            icon: 'cloud', 
            title: 'Weather Forecast', 
            desc: '7-day agricultural predictions',
            color: colors.accent,
            gradient: [colors.accent, '#0097A7'],
            screen: 'Weather'
          },
          { 
            icon: 'trending-up', 
            title: 'Market Prices', 
            desc: 'Real-time crop pricing data',
            color: colors.warning,
            gradient: [colors.warning, '#FF8F00'],
            screen: 'Market'
          }
        ].map((feature, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.featureCard}
            onPress={() => {
              navigateToScreen(feature.title);
              setCurrentScreen(feature.screen);
            }}
          >
            <LinearGradient colors={feature.gradient} style={styles.featureGradient}>
              <Ionicons name={feature.icon} size={35} color="white" />
            </LinearGradient>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDesc}>{feature.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Tips */}
      <Card style={styles.tipsCard} elevation={4}>
        <Card.Content>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb" size={24} color={colors.warning} />
            <Text style={styles.tipsTitle}>Quick Farming Tips</Text>
          </View>
          <View style={styles.tipsList}>
            {[
              'Check soil moisture before watering',
              'Monitor weather for pest activity',
              'Rotate crops for better soil health',
              'Use organic fertilizers when possible'
            ].map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );

  return (
    <PaperProvider theme={customLightTheme}>
      <StatusBar style="light" backgroundColor={colors.primary} />
      <View style={styles.container}>
        {/* Beautiful Header with Gradient */}
        <LinearGradient colors={colors.gradient} style={styles.header}>
          <View style={styles.headerContent}>
            {/* Hamburger Menu Button */}
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={() => setShowMenu(!showMenu)}
            >
              <Ionicons name="menu" size={28} color="white" />
            </TouchableOpacity>
            
            <Ionicons name="leaf" size={50} color="white" />
            <Text style={styles.title}>Crop Advisor</Text>
            <Text style={styles.subtitle}>AI-Powered Farming Assistant</Text>
            
            {/* Back to Home Button */}
            {currentScreen !== 'Home' && (
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => setCurrentScreen('Home')}
              >
                <Ionicons name="arrow-back" size={20} color="white" />
                <Text style={styles.backText}>Back to Home</Text>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
        
        {/* Hamburger Menu Overlay */}
        {showMenu && (
          <View style={styles.menuOverlay}>
            <TouchableOpacity 
              style={styles.menuBackdrop}
              onPress={() => setShowMenu(false)}
            />
            <View style={styles.menuContainer}>
              <View style={styles.menuHeader}>
                <Text style={styles.menuTitle}>Navigation</Text>
                <TouchableOpacity onPress={() => setShowMenu(false)}>
                  <Ionicons name="close" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.menuItems}>
                {menuItems.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.menuItem,
                      currentScreen === item.screen && styles.activeMenuItem
                    ]}
                    onPress={() => handleMenuItemPress(item.screen)}
                  >
                    <View style={styles.menuItemIcon}>
                      <Ionicons 
                        name={item.icon} 
                        size={24} 
                        color={currentScreen === item.screen ? colors.primary : colors.textSecondary} 
                      />
                    </View>
                    <View style={styles.menuItemContent}>
                      <Text style={[
                        styles.menuItemName,
                        currentScreen === item.screen && styles.activeMenuItemName
                      ]}>
                        {item.name}
                      </Text>
                      <Text style={styles.menuItemDescription}>
                        {item.description}
                      </Text>
                    </View>
                    {currentScreen === item.screen && (
                      <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}

        {/* Render Current Screen */}
        {renderScreen()}

        {/* Floating Voice Assistant Button - Always Visible */}
        <Animated.View style={[styles.fabContainer, { transform: [{ scale: pulseAnim }] }]}>
          <FAB
            icon={isListening ? "stop" : "microphone"}
            style={[styles.fab, { backgroundColor: isListening ? colors.error : colors.primary }]}
            onPress={handleVoiceAssistant}
            color="white"
          />
        </Animated.View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    position: 'relative',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  menuButton: {
    position: 'absolute',
    left: 0,
    top: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 15,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  voicePanel: {
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  voicePanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  voicePanelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginLeft: 10,
  },
  voiceInput: {
    backgroundColor: 'transparent',
    marginBottom: 15,
  },
  processButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  processGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  processText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  welcomeCard: {
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 12,
  },
  welcomeText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    textAlign: 'center',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  featureCard: {
    width: (width - 60) / 2,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  featureGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  tipsCard: {
    marginBottom: 100,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 10,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipText: {
    marginLeft: 12,
    fontSize: 14,
    color: colors.text,
    flex: 1,
    lineHeight: 18,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
  },
  fab: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
  },
  backText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: colors.surface,
    borderRadius: 10,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.error,
    marginRight: 8,
  },
  recordingText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  responseContainer: {
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  responseText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  // Hamburger Menu Styles
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  menuBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.8,
    height: '100%',
    backgroundColor: colors.surface,
    paddingTop: 60,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  menuItems: {
    flex: 1,
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '30',
  },
  activeMenuItem: {
    backgroundColor: colors.primary + '10',
    borderRightWidth: 4,
    borderRightColor: colors.primary,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  activeMenuItemName: {
    color: colors.primary,
  },
  menuItemDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});
