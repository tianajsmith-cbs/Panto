import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import { getDatabase, ref, onValue } from "firebase/database";
import { auth } from "../../data/firebase";

const ReservationsScreen = () => { // Reservasjoner
  const [reservations, setReservations] = useState([]); // Bestillinger
  const currentUser = auth.currentUser; // Gjeldende bruker

  useEffect(() => { // Hent bestillinger reservert av brukeren
    if (!currentUser) return; // Sjekk om bruker er logget inn

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

    return () => unsubscribe();  // Avslutt lytting
  }, [currentUser]);

  return ( // Vis bestillinger
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
  // Hovedcontainer for skjermen
  container: {
    flex: 1, // Fyller hele skjermen
    backgroundColor: "#FFFFFF", // Hvit bakgrunnsfarge
    padding: 20, // Indre mellomrom rundt innholdet
  },

  // Stil for overskriften
  title: {
    fontSize: 24, // Størrelse på teksten
    fontWeight: "bold", // Fet skrift
    color: "#5b975b", // Grønn tekstfarge
    marginBottom: 20, // Avstand under overskriften
  },

  // Stil for kortene som viser reservasjoner
  reservationCard: {
    backgroundColor: "#eaf5e3", // Lysegrønn bakgrunnsfarge
    padding: 15, // Indre mellomrom
    borderRadius: 8, // Runde hjørner
    marginBottom: 10, // Avstand mellom kortene
  },

  // Stil for teksten inne i reservasjonskortet
  cardText: {
    fontSize: 16, // Skriftstørrelse
    color: "#333", // Mørk tekstfarge for god kontrast
  },

  // Stil for meldingen som vises når det ikke er noen reservasjoner
  noReservations: {
    textAlign: "center", // Sentralisert tekst
    fontSize: 16, // Skriftstørrelse
    color: "#888", // Grå tekstfarge for indikasjon
  },
});




export default ReservationsScreen;
