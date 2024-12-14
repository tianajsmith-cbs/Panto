import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CreditsDetailsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dette er bare en kladd på kreditter, vi kan endre det senere</Text>
      <Text style={styles.subtitle}>Du har pantet:</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.detail}>- Flasker: x stk</Text>
        <Text style={styles.detail}>- Glass: x stk</Text>
     <Text style={styles.subtitle}>Og har derfor x kr tilgode</Text>
        
      </View>
      <Text style={styles.subtitle}>Rabatter :</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.detail}>- Sabi Sushi: 10% på en valgfri meny</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5b975b',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detail: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
});

export default CreditsDetailsScreen;
