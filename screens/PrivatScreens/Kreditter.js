import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome-ikoner

const discounts = [ // Rabattkort med informasjon om rabattene som skal vises på skjermen
  {
    id: "1",
    title: "TalkMore",
    description: "Vinn en macbook i julegave!",
    price: "50",
    buttonText: "Motta",
    icon: "laptop", // Ikon for TalkMore
  },
  {
    id: "2",
    title: "Allente",
    description: "Stream uten kostnad i en måned!",
    price: "50",
    buttonText: "Kjøp",
    icon: "tv", // Ikon for Allente
  },
  {
    id: "3",
    title: "Squeeze",
    description: "Gi massasje i julegave!",
    price: "50",
    buttonText: "Kjøp",
    icon: "heartbeat", // Ikon for Squeeze
  },
  {
    id: "4",
    title: "Fabel",
    description: "Lytt for 0 kr i 6 uker!",
    price: "50",
    buttonText: "Kjøp",
    icon: "book", // Ikon for Fabel
  },
];

const CreditsDetailsScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Overskrift */}
      <Text style={styles.title}>Dine rabatter</Text>

      {/* Rabattkort */}
      <View style={styles.grid}>
        {discounts.map((item) => (
          <View key={item.id} style={styles.card}>
            <FontAwesome name={item.icon} size={50} color="#82B366" style={styles.icon} />
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>{item.buttonText} - 🛒 {item.price}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Hovedcontainer
  container: {
    flexGrow: 1,
    backgroundColor: "white",
    padding: 10,
    alignItems: "center",
  },

  // Overskrift
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#5b975b",
    marginBottom: 10,
  },

  // Grid-layout for kortene
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  // Kortstil
  card: {
    width: "48%",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
    elevation: 3, // Skyggeeffekt for Android
    shadowColor: "#000", // Skyggeeffekt for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  icon: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
  },

  // Knapper
  button: {
    backgroundColor: "#82B366",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});


export default CreditsDetailsScreen;
