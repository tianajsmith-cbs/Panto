import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function PantestasjonMapScreen() { 
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hent brukerens lokasjon
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") { // Sjekk om brukeren har gitt tillatelse til lokasjon
        Alert.alert("Feil", "Lokasjonstillatelse ble avslått.");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({}); // Hent brukerens lokasjon
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setLoading(false);
    })();
  }, []);

  // Generer tilfeldige pins rundt brukerens lokasjon
  const generateRandomPins = (center, numberOfPins) => {
    const pins = [];
    const radius = 0.01;

    for (let i = 0; i < numberOfPins; i++) {
      const randomLat = center.latitude + (Math.random() - 0.5) * radius;
      const randomLng = center.longitude + (Math.random() - 0.5) * radius;
      pins.push({ latitude: randomLat, longitude: randomLng });
    }
    return pins;
  };

  if (loading || !userLocation) { // Vis en loading-skjerm mens lokasjonen lastes
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Laster kart...</Text>
      </View>
    );
  }

  const randomPins = generateRandomPins(userLocation, 5); // Generer tilfeldige pins

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>PANTO</Text>
        <Text style={styles.subHeaderText}>Finn din nærmeste pantestasjon</Text>
      </View>

      {/* Kart */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {/* Marker for brukerens posisjon */}
        <Marker
          coordinate={userLocation}
          title="Din posisjon"
          pinColor="green"
        />
        {/* Tilfeldige pantestasjoner */}
        {randomPins.map((pin, index) => (
          <Marker
            key={index}
            coordinate={pin}
            title={`Pantemaskin ${index + 1}`}
            pinColor="blue"
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "white",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#5b975b",
  },
  subHeaderText: {
    fontSize: 16,
    color: "black",
  },
  map: {
    flex: 1,
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  loadingText: {
    fontSize: 18,
    color: "#5b975b",
  },
});
