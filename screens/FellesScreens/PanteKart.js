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
  // Hovedcontainer for skjermen
  container: {
    flex: 1, // Fyller hele skjermen
    backgroundColor: "white", // Hvit bakgrunnsfarge
  },

  // Header for skjermen
  header: {
    alignItems: "center", // Sentrerer innholdet horisontalt
    paddingVertical: 20, // Vertikal padding for plass rundt header-innholdet
    backgroundColor: "white", // Hvit bakgrunn for header
  },

  // Tekststil for hovedteksten i headeren
  headerText: {
    fontSize: 20, // Større font for å fremheve teksten
    fontWeight: "bold", // Fet skrift
    color: "#5b975b", // Grønn tekstfarge for å gi et friskt utseende
  },

  // Tekststil for underteksten i headeren
  subHeaderText: {
    fontSize: 16, // Medium fontstørrelse
    color: "black", // Sort tekstfarge for kontrast
  },

  // Stil for kartet
  map: {
    flex: 1, // Kartet skal fylle tilgjengelig plass
    width: "100%", // Tar opp hele bredden av skjermen
  },

  // Container som vises under lasting
  loadingContainer: {
    flex: 1, // Fyller hele skjermen
    justifyContent: "center", // Sentrerer innholdet vertikalt
    alignItems: "center", // Sentrerer innholdet horisontalt
    backgroundColor: "white", // Hvit bakgrunn for en ren skjerm
  },

  // Tekststil for lastemeldingen
  loadingText: {
    fontSize: 18, // Relativt stor tekst for å være lett synlig
    color: "#5b975b", // Grønn farge som matcher headeren
  },
});


