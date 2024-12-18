import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location"; 
import { getDatabase, ref, onValue, update } from "firebase/database";
import { auth } from "../../data/firebase";

const BedriftMap = () => {
  const [orders, setOrders] = useState([]); // Bestillinger
  const [selectedOrder, setSelectedOrder] = useState(null);   // Valgt bestilling
  const [userLocation, setUserLocation] = useState(null); // Brukerens lokasjon
  const [loading, setLoading] = useState(true); // Laster-status

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
      setUserLocation({ // Sett brukerens lokasjon
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

    if (!currentUser) {   // Sjekk om bruker er logget inn
      Alert.alert("Feil", "Du må logge inn for å reservere bestillinger.");
      return;
    }

    const db = getDatabase(); // Hent database
    const orderRef = ref(db, `orders/${orderId}`); // Referanse til bestilling

    update(orderRef, { // Oppdater bestillingen
      reserved: true, // Sett bestillingen som reservert
      reservedBy: currentUser.uid, // Sett bruker-ID
    })
      .then(() => {   // Håndter suksess
        Alert.alert("Suksess", "Bestillingen er reservert!");
        setSelectedOrder(null);
      })
      .catch((error) => { // Håndter feil
        console.error("Feil ved reservasjon:", error.message);
        Alert.alert("Feil", "Kunne ikke reservere bestillingen.");
      });
  };

  return (
    <View style={styles.container}>
      {!loading && userLocation ? ( // Vis kart når lokasjon er lastet
        <MapView // Kartkomponent
          style={styles.map} // Stil for kartet
          initialRegion={{ // Startposisjon
            latitude: userLocation.latitude, // Brukerens breddegrad
            longitude: userLocation.longitude, // Brukerens lengdegrad
            latitudeDelta: 0.05, // Zoom-nivå for breddegrad
            longitudeDelta: 0.05, // Zoom-nivå for lengdegrad
          }}
        >
          <Marker
            coordinate={userLocation} // Marker for brukerens posisjon
            title="Din posisjon" // Tittel på markøren
            pinColor="blue" // Farge på markøren
          />
          {orders.map((order) => ( // Vis bestillinger som markører
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

      {selectedOrder && !selectedOrder.reserved && ( // Vis bestillingsdetaljer
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
  // Hovedcontainer for skjermen
  container: {
    flex: 1, // Fyller hele skjermens høyde
  },

  // Stil for kartkomponenten
  map: {
    flex: 1, // Fyller hele tilgjengelige plassen
  },

  // Stil for detaljkortet som vises over kartet
  orderDetails: {
    position: "absolute", // Plasserer kortet over kartet
    bottom: 20, // Plasserer det 20 enheter fra bunnen av skjermen
    left: 20, // Avstand fra venstre side
    right: 20, // Avstand fra høyre side
    backgroundColor: "white", // Hvit bakgrunn
    padding: 15, // Indre mellomrom
    borderRadius: 10, // Runde hjørner
    elevation: 5, // Skyggeeffekt (Android)
  },

  // Stil for tekst i detaljkortet
  detailsText: {
    fontSize: 16, // Skriftstørrelse
    marginBottom: 5, // Avstand under teksten
  },

  // Stil for reserveringsknappen
  reserveButton: {
    backgroundColor: "#56d141", // Grønn bakgrunn
    padding: 10, // Indre mellomrom
    borderRadius: 5, // Runde hjørner
    alignItems: "center", // Sentrerer teksten i knappen
  },

  // Stil for tekst på knappen
  buttonText: {
    color: "#fff", // Hvit tekst
    fontWeight: "bold", // Fet tekst
  },

  // Stil for tekst som vises under lasting
  loadingText: {
    textAlign: "center", // Sentrerer teksten horisontalt
    fontSize: 18, // Skriftstørrelse
    marginTop: 20, // Avstand fra toppen
  },
});




export default BedriftMap;
