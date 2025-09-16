import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Card, TextInput, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { colors } from '../App';

export default function FeedbackScreen() {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitFeedback = async () => {
    if (!feedback.trim()) {
      Alert.alert('Missing Feedback', 'Please enter your feedback before submitting.');
      return;
    }

    if (rating === 0) {
      Alert.alert('Missing Rating', 'Please select a rating before submitting.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Thank You!',
        'Your feedback has been submitted successfully. We appreciate your input!',
        [
          {
            text: 'OK',
            onPress: () => {
              setFeedback('');
              setRating(0);
              Speech.speak('Thank you for your valuable feedback. Your input helps us improve Crop Advisor.');
            }
          }
        ]
      );
    }, 2000);
  };

  const speakInstructions = async () => {
    const message = 'Please rate your experience and share your feedback to help us improve Crop Advisor for farmers like you.';
    await Speech.speak(message);
  };

  const setStarRating = (stars) => {
    setRating(stars);
    Speech.speak(`You rated ${stars} out of 5 stars.`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={colors.gradient}
        style={styles.header}
      >
        <Ionicons name="chatbubble-ellipses" size={40} color="white" />
        <Text style={styles.headerTitle}>Feedback</Text>
        <Text style={styles.headerSubtitle}>Help us improve Crop Advisor</Text>
      </LinearGradient>

      {/* Voice Instructions */}
      <Card style={styles.voiceCard} elevation={4}>
        <Card.Content>
          <TouchableOpacity
            style={styles.voiceButton}
            onPress={speakInstructions}
          >
            <Ionicons name="volume-high" size={24} color="white" />
            <Text style={styles.voiceText}>Hear Instructions</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* Rating Section */}
      <Card style={styles.ratingCard} elevation={4}>
        <Card.Content>
          <View style={styles.ratingHeader}>
            <Ionicons name="star" size={24} color={colors.warning} />
            <Text style={styles.ratingTitle}>Rate Your Experience</Text>
          </View>
          
          <Text style={styles.ratingSubtitle}>How would you rate Crop Advisor?</Text>
          
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setStarRating(star)}
                style={styles.starButton}
              >
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={40}
                  color={star <= rating ? colors.warning : colors.textSecondary}
                />
              </TouchableOpacity>
            ))}
          </View>
          
          {rating > 0 && (
            <Text style={styles.ratingText}>
              {rating === 5 ? 'Excellent!' : 
               rating === 4 ? 'Very Good!' :
               rating === 3 ? 'Good!' :
               rating === 2 ? 'Fair' : 'Needs Improvement'}
            </Text>
          )}
        </Card.Content>
      </Card>

      {/* Feedback Form */}
      <Card style={styles.feedbackCard} elevation={4}>
        <Card.Content>
          <View style={styles.feedbackHeader}>
            <Ionicons name="create" size={24} color={colors.primary} />
            <Text style={styles.feedbackTitle}>Your Feedback</Text>
          </View>
          
          <TextInput
            mode="outlined"
            label="Share your thoughts..."
            value={feedback}
            onChangeText={setFeedback}
            multiline
            numberOfLines={6}
            style={styles.feedbackInput}
            theme={{ colors: { primary: colors.primary } }}
            placeholder="Tell us what you liked, what could be improved, or suggest new features..."
          />
          
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={submitFeedback}
            disabled={isSubmitting}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryLight]}
              style={styles.submitGradient}
            >
              {isSubmitting ? (
                <Ionicons name="sync" size={20} color="white" />
              ) : (
                <Ionicons name="send" size={20} color="white" />
              )}
              <Text style={styles.submitText}>
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* Quick Feedback Options */}
      <Card style={styles.quickCard} elevation={4}>
        <Card.Content>
          <Text style={styles.quickTitle}>Quick Feedback</Text>
          <Text style={styles.quickSubtitle}>Tap what applies to your experience:</Text>
          
          <View style={styles.quickOptions}>
            {[
              { icon: 'thumbs-up', text: 'Easy to use', color: colors.success },
              { icon: 'flash', text: 'Fast & reliable', color: colors.accent },
              { icon: 'leaf', text: 'Helpful for farming', color: colors.primary },
              { icon: 'mic', text: 'Love voice features', color: colors.secondary },
              { icon: 'camera', text: 'Great pest detection', color: colors.warning },
              { icon: 'cloud', text: 'Accurate weather', color: colors.primary }
            ].map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.quickOption, { borderColor: option.color }]}
                onPress={() => {
                  setFeedback(prev => prev ? `${prev}\n• ${option.text}` : `• ${option.text}`);
                  Speech.speak(`Added ${option.text} to your feedback.`);
                }}
              >
                <Ionicons name={option.icon} size={16} color={option.color} />
                <Text style={[styles.quickText, { color: option.color }]}>
                  {option.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Contact Info */}
      <Card style={styles.contactCard} elevation={4}>
        <Card.Content>
          <View style={styles.contactHeader}>
            <Ionicons name="mail" size={24} color={colors.accent} />
            <Text style={styles.contactTitle}>Get in Touch</Text>
          </View>
          
          <Text style={styles.contactText}>
            Have specific questions or need support? Reach out to us:
          </Text>
          
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Ionicons name="mail" size={16} color={colors.primary} />
              <Text style={styles.contactDetail}>support@cropadvisor.com</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="call" size={16} color={colors.success} />
              <Text style={styles.contactDetail}>+91 1800-CROP-HELP</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="globe" size={16} color={colors.accent} />
              <Text style={styles.contactDetail}>www.cropadvisor.com</Text>
            </View>
          </View>
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
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 16,
  },
  voiceText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    letterSpacing: 0.1,
  },
  ratingCard: {
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
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 12,
    letterSpacing: -0.2,
  },
  ratingSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 24,
    fontWeight: '400',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },
  starButton: {
    padding: 8,
    borderRadius: 12,
  },
  ratingText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: -0.1,
  },
  feedbackCard: {
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
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 12,
    letterSpacing: -0.2,
  },
  feedbackInput: {
    backgroundColor: 'transparent',
    marginBottom: 24,
    fontSize: 15,
  },
  submitButton: {
    borderRadius: 16,
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
    paddingVertical: 18,
  },
  submitText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    letterSpacing: 0.1,
  },
  quickCard: {
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
  quickTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  quickSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 20,
    fontWeight: '400',
  },
  quickOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1.5,
    backgroundColor: colors.surface,
  },
  quickText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  contactCard: {
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
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 12,
    letterSpacing: -0.2,
  },
  contactText: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 24,
    fontWeight: '400',
  },
  contactInfo: {
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.borderLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  contactDetail: {
    marginLeft: 12,
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
});
