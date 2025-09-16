# Crop Advisor - Expo Snack Files

## 📱 Features Included

- **Premium UI Design**: Modern color scheme with gradients and glassmorphism
- **Voice Integration**: Speech input and output using Expo Speech
- **Camera & Image Picker**: For pest detection and crop analysis
- **Location Services**: Auto-detect user location for weather and market data
- **Multi-Screen Navigation**: Stack and tab navigation with 9 screens
- **Responsive Design**: Works on both iOS and Android devices

## 🎨 Color Scheme

The app uses a premium agricultural color palette:
- **Primary**: `#4CAF50` (Green)
- **Secondary**: `#FF9800` (Orange) 
- **Accent**: `#00BCD4` (Cyan)
- **Success**: `#8BC34A` (Light Green)
- **Warning**: `#FFC107` (Amber)
- **Error**: `#F44336` (Red)

## 📂 File Structure

```
snack-files/
├── App.js                 # Main app with navigation
├── package.json           # Dependencies
├── app.json              # Expo configuration
├── README.md             # This file
└── screens/
    ├── HomeScreen.js      # Dashboard with weather & quick actions
    ├── SoilInputScreen.js # Soil analysis input form
    ├── SoilResultScreen.js# Crop recommendations display
    ├── PestScanScreen.js  # Camera integration for pest detection
    ├── PestResultScreen.js# Pest analysis results
    ├── WeatherScreen.js   # 7-day weather forecast
    ├── MarketScreen.js    # Real-time crop prices
    └── SettingsScreen.js  # App preferences & language settings
```

## 🔧 Key Dependencies

- **React Navigation**: Stack and bottom tab navigation
- **React Native Paper**: Material Design components
- **Expo Location**: GPS and location services
- **Expo Speech**: Voice input and text-to-speech
- **Expo Camera**: Camera integration
- **Expo Image Picker**: Photo selection
- **Expo Linear Gradient**: Beautiful gradient backgrounds
- **Expo Vector Icons**: Ionicons icon set

## 📋 Screen Details

### 1. Home Screen
- Weather overview card
- Quick action buttons
- Location-based services
- Voice-enabled navigation

### 2. Soil Analysis Flow
- **Input Screen**: Form with voice input, location detection
- **Result Screen**: AI-powered crop recommendations with detailed analysis

### 3. Pest Detection Flow
- **Scan Screen**: Camera integration with voice instructions
- **Result Screen**: Pest identification with treatment recommendations

### 4. Weather Screen
- 7-day detailed forecast
- Agricultural recommendations
- Location-based weather data
- Voice weather summaries

### 5. Market Screen
- Real-time crop prices
- Market trends and insights
- Price comparison tools
- Quick action buttons

### 6. Settings Screen
- Multi-language support (6 Indian languages)
- Voice feature controls
- App preferences
- Data export options

## 🎯 Voice Features

All screens include voice capabilities:
- **Voice Input**: Speak instead of typing
- **Voice Instructions**: Hear how to use each feature
- **Voice Output**: Results read aloud
- **Multi-language**: Supports Hindi, Tamil, Telugu, Kannada, Marathi

## 🌐 Offline Capabilities

The app includes mock data and simulated API responses, making it fully functional in Expo Snack without requiring backend connectivity.

## 📱 Testing Instructions

1. **Upload to Snack**: Copy all files to your Expo Snack project
2. **Install Expo Go**: Download from App Store or Google Play
3. **Scan QR Code**: Use Expo Go to scan the Snack QR code
4. **Test Features**: Try voice input, camera, location services
5. **Share**: Send the Snack URL to others for testing

## 🔄 Building APK

To build a standalone APK:
1. Use the Snack "Export" feature
2. Or set up local Expo CLI development environment
3. Run `expo build:android` for APK generation

## 🎨 UI Highlights

- **Glassmorphism Effects**: Modern translucent card designs
- **Gradient Backgrounds**: Beautiful color transitions
- **Responsive Layout**: Adapts to different screen sizes
- **Accessibility**: Voice controls and clear typography
- **Animation**: Smooth transitions and loading states

## 🌱 Agricultural Focus

The app is specifically designed for farmers and agricultural professionals:
- **Crop Recommendations**: Based on soil analysis
- **Pest Management**: Visual identification and treatment
- **Weather Planning**: 7-day agricultural forecasts
- **Market Intelligence**: Real-time pricing data
- **Multi-language**: Supports major Indian languages

