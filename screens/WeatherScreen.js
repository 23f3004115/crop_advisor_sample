import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function WeatherScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Weather Forecast</Text>
        <Text style={styles.subtitle}>Bangalore, Karnataka</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.temp}>28°C</Text>
        <Text style={styles.condition}>Partly Cloudy</Text>
        <Text style={styles.details}>Humidity: 65% | Wind: 12 km/h</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>7-Day Forecast</Text>
        <Text style={styles.forecastItem}>Today: Partly Cloudy 28°/20°</Text>
        <Text style={styles.forecastItem}>Tomorrow: Sunny 30°/22°</Text>
        <Text style={styles.forecastItem}>Day 3: Cloudy 26°/19°</Text>
        <Text style={styles.forecastItem}>Day 4: Rainy 24°/18°</Text>
        <Text style={styles.forecastItem}>Day 5: Sunny 29°/21°</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  card: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  temp: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2e7d31',
    textAlign: 'center',
  },
  condition: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  details: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  forecastItem: {
    fontSize: 14,
    color: '#666',
    paddingVertical: 5,
  },
});
