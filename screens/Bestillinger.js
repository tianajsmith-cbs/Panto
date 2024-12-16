import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { auth } from "../data/firebase";

const BedriftMap = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const db = getDatabase();
    const ordersRef = ref(db, "orders/");

    // Fetch orders submitted by Privatperson users
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      const fetchedOrders = data
        ? Object.entries(data).map(([key, order]) => ({
            id: key, // Use database key as unique ID
            latitude: order.location.latitude,
            longitude: order.location.longitude,
            bottles: order.bottles,
            glasses: order.glasses,
            reserved: order.reserved || false,
            reservedBy: order.reservedBy || null,
          }))
        : [];
      setOrders(fetchedOrders);
    });

    return () => unsubscribe();
  }, []);

  const handleReserveOrder = (orderId) => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      Alert.alert("Feil", "Du må logge inn for å reservere bestillinger.");
      return;
    }

    const db = getDatabase();
    const orderRef = ref(db, `orders/${orderId}`);

    update(orderRef, {
      reserved: true,
      reservedBy: currentUser.uid,
    })
      .then(() => {
        Alert.alert("Suksess", "Bestillingen er reservert!");
        setSelectedOrder(null); // Fjern utvalget etter reservasjon
      })
      .catch((error) => {
        console.error("Feil ved reservasjon:", error.message);
        Alert.alert("Feil", "Kunne ikke reservere bestillingen.");
      });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 59.911491,
          longitude: 10.757933,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
      >
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

      {selectedOrder && (
        <View style={styles.orderDetails}>
          <Text style={styles.detailsText}>
            Flasker: {selectedOrder.bottles}, Glass: {selectedOrder.glasses}
          </Text>
          <Text style={styles.detailsText}>
            Status: {selectedOrder.reserved ? "Reservert" : "Tilgjengelig"}
          </Text>
          {!selectedOrder.reserved && (
            <TouchableOpacity
              style={styles.reserveButton}
              onPress={() => handleReserveOrder(selectedOrder.id)}
            >
              <Text style={styles.buttonText}>Reserver</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
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
  detailsText: {
    fontSize: 16,
    marginBottom: 5,
  },
  reserveButton: {
    backgroundColor: "#56d141",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default BedriftMap;
