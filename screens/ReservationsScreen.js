import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import { getDatabase, ref, onValue } from "firebase/database";
import { auth } from "../data/firebase";

const ReservationsScreen = () => {
  const [reservations, setReservations] = useState([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    const db = getDatabase();// Hent database
    const ordersRef = ref(db, "orders/"); // Referanse til bestillinger

    const unsubscribe = onValue(ordersRef, (snapshot) => { // Hent bestillinger
      const data = snapshot.val(); // Hent data
      const reservedOrders = data // Filtrer ut bestillinger reservert av brukeren
        ? Object.entries(data) // Konverterer data til array
            .filter(([_, order]) => order.reservedBy === currentUser.uid) // Filtrer ut bestillinger reservert av brukeren
            .map(([key, order]) => ({ id: key, ...order })) // Legg til bestillings-ID
        : [];
      setReservations(reservedOrders); // Sett bestillinger
    });

    return () => unsubscribe(); 
  }, [currentUser]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dine Reservasjoner</Text>
      {reservations.length > 0 ? (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.reservationCard}>
              <Text style={styles.cardText}>Dato: {item.date}</Text>
              <Text style={styles.cardText}>Flasker: {item.bottles}</Text>
              <Text style={styles.cardText}>Glass: {item.glasses}</Text>
              <Text style={styles.cardText}>
                Lokasjon: {item.location.latitude}, {item.location.longitude}
              </Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noReservations}>Ingen reservasjoner funnet.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#5b975b", marginBottom: 20 },
  reservationCard: {
    backgroundColor: "#eaf5e3",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardText: { fontSize: 16, color: "#333" },
  noReservations: { textAlign: "center", fontSize: 16, color: "#888" },
});

export default ReservationsScreen;
