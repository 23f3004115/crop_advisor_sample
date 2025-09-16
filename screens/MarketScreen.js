import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function MarketScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Market Prices</Text>
        <Text style={styles.subtitle}>Bangalore Market</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Prices</Text>
        
        <View style={styles.priceRow}>
          <Text style={styles.cropName}>Rice</Text>
          <Text style={styles.price}>₹2,500/quintal</Text>
          <Text style={styles.priceUp}>+₹50</Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.cropName}>Wheat</Text>
          <Text style={styles.price}>₹2,200/quintal</Text>
          <Text style={styles.priceDown}>-₹30</Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.cropName}>Tomato</Text>
          <Text style={styles.price}>₹800/quintal</Text>
          <Text style={styles.priceUp}>+₹120</Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.cropName}>Onion</Text>
          <Text style={styles.price}>₹1,200/quintal</Text>
          <Text style={styles.priceDown}>-₹80</Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.cropName}>Potato</Text>
          <Text style={styles.price}>₹1,500/quintal</Text>
          <Text style={styles.priceUp}>+₹25</Text>
        </View>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Market Insights</Text>
        <Text style={styles.insight}>• Vegetable prices showing upward trend</Text>
        <Text style={styles.insight}>• Best selling time: Early morning</Text>
        <Text style={styles.insight}>• Prices updated hourly 6 AM - 6 PM</Text>
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cropName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  price: {
    fontSize: 16,
    color: '#666',
    flex: 2,
    textAlign: 'center',
  },
  priceUp: {
    fontSize: 14,
    color: '#4caf50',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  priceDown: {
    fontSize: 14,
    color: '#f44336',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  insight: {
    fontSize: 14,
    color: '#666',
    paddingVertical: 3,
    lineHeight: 20,
  },
});
