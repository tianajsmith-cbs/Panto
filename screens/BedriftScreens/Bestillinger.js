import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location"; 
import { getDatabase, ref, onValue, update } from "firebase/database";
import { auth } from "../../data/firebase";

const BedriftMap = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { // Hent bestillinger og brukerens lokasjon
    const fetchOrders = () => { // Hent bestillinger
      const db = getDatabase(); // Hent database
      const ordersRef = ref(db, "orders/"); // Referanse til bestillinger

      const unsubscribe = onValue(ordersRef, (snapshot) => { 
        const data = snapshot.val(); // Hent data
        const fetchedOrders = data // Filtrer ut bestillinger
          ? Object.entries(data).map(([key, order]) => ({ // Konverterer data til array
              id: key,
              latitude: order.location.latitude,
              longitude: order.location.longitude,
              bottles: order.bottles,
              glasses: order.glasses,
              reserved: order.reserved || false,
              reservedBy: order.reservedBy || null,
            }))
          : [];
        setOrders(fetchedOrders); // Sett bestillinger
      });
      return () => unsubscribe();
    };

    const fetchUserLocation = async () => { // Hent brukerens lokasjon 
      let { status } = await Location.requestForegroundPermissionsAsync(); // Sjekk om brukeren har gitt tillatelse til lokasjon
      if (status !== "granted") {
        Alert.alert("Feil", "Tillatelse til lokasjon er nødvendig for å bruke kartet.");
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});  // Hent brukerens lokasjon 
      setUserLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      setLoading(false);
    };

    fetchOrders(); // Hent bestillinger
    fetchUserLocation(); // Hent brukerens lokasjon 
  }, []);

  const handleReserveOrder = (orderId) => { // Reserver bestilling
    const currentUser = auth.currentUser; // Hent gjeldende bruker

    if (!currentUser) {
      Alert.alert("Feil", "Du må logge inn for å reservere bestillinger.");
      return;
    }

    const db = getDatabase(); // Hent database
    const orderRef = ref(db, `orders/${orderId}`); // Referanse til bestilling

    update(orderRef, { // Oppdater bestillingen
      reserved: true, // Sett bestillingen som reservert
      reservedBy: currentUser.uid, // Sett bruker-ID
    })
      .then(() => {
        Alert.alert("Suksess", "Bestillingen er reservert!");
        setSelectedOrder(null);
      })
      .catch((error) => {
        console.error("Feil ved reservasjon:", error.message);
        Alert.alert("Feil", "Kunne ikke reservere bestillingen.");
      });
  };

  return (
    <View style={styles.container}>
      {!loading && userLocation ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            coordinate={userLocation}
            title="Din posisjon"
            pinColor="blue"
          />
          {orders.map((order) => (
            <Marker
              key={order.id}
              coordinate={{
                latitude: order.latitude,
                longitude: order.longitude,
              }}
              title={`Mengde: ${order.bottles} flasker, ${order.glasses} glass`}
              description={order.reserved ? "Reservert" : "Tilgjengelig"}
              pinColor={order.reserved ? "red" : "green"}
              onPress={() => setSelectedOrder(order)}
            />
          ))}
        </MapView>
      ) : (
        <Text style={styles.loadingText}>Laster kart...</Text>
      )}

      {selectedOrder && !selectedOrder.reserved && (
        <View style={styles.orderDetails}>
          <Text style={styles.detailsText}>
            Flasker: {selectedOrder.bottles}, Glass: {selectedOrder.glasses}
          </Text>
          <TouchableOpacity
            style={styles.reserveButton}
            onPress={() => handleReserveOrder(selectedOrder.id)}
          >
            <Text style={styles.buttonText}>Reserver</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  orderDetails: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    elevation: 5,
  },
  detailsText: { fontSize: 16, marginBottom: 5 },
  reserveButton: {
    backgroundColor: "#56d141",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  loadingText: { textAlign: "center", fontSize: 18, marginTop: 20 },
});

export default BedriftMap;
