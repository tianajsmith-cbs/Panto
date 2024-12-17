import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Modal,
} from "react-native"; // Importerer nødvendige komponenter fra React Native
import * as Location from "expo-location"; // Importerer Location fra Expo
import DateTimePicker from "@react-native-community/datetimepicker"; // Importerer DateTimePicker
import MapView, { Marker } from "react-native-maps"; // Importerer MapView og Marker fra react-native-maps
import { getDatabase, ref, push, get, set } from "firebase/database";  // Importerer funksjoner fra Firebase database
import { auth } from "../data/firebase"; // Importerer auth fra firebase.js

{/* Funksjonen Bestilling tar inn ingen parametre og returnerer JSX for en bestillingsskjerm */}
const Bestilling = () => { 
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [location, setLocation] = useState(null);
  const [bottles, setBottles] = useState("");
  const [glasses, setGlasses] = useState("");
  const [loading, setLoading] = useState(true);

 {/* useEffect kjører koden inni kun én gang når komponenten rendres */} 
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Feil", "Tillatelse til lokasjon er nødvendig for å bruke kartet.");
        setLoading(false);
        return;
      }
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      setLoading(false);
    })();
  }, []);
{/* Funksjonen handleConfirmDate tar inn et event og en dato og oppdaterer datoen og skjuler datepickeren */}
  const handleConfirmDate = (event, selectedDate) => { // Håndterer bekreftelse av valgt dato
    setShowDatePicker(false); 
    if (selectedDate) { // Sjekker om en dato er valgt
      setDate(selectedDate); // Oppdaterer datoen
    }
  };
{/* Funksjonen handleMapPress tar inn et event og oppdaterer lokasjonen til det punktet som er trykket på kartet */}
  const handleMapPress = (event) => {  // Håndterer trykk på kartet
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
  };
{/* Funksjonen fetchCurrentLocation henter den nåværende lokasjonen */}
  const fetchCurrentLocation = async () => {
    try {
      const currentLocation = await Location.getCurrentPositionAsync({}); // Henter nåværende lokasjon
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    } catch (error) {
      console.error("Feil ved henting av posisjon:", error.message);
      Alert.alert("Feil", "Kunne ikke hente lokasjonen på nytt.");
      setLocation({ latitude: 59.911491, longitude: 10.757933 });
    }
  };
{/* Funksjonen handleSubmitOrder sender en bestilling til databasen */}
  const handleSubmitOrder = () => {
    if (!location || !bottles || !glasses) {
      Alert.alert("Feil", "Vennligst fyll ut alle feltene og velg en posisjon.");
      return;
    }

    const db = getDatabase(); // Henter database-instansen
    const currentUser = auth.currentUser; // Henter den innloggede brukeren

    if (!currentUser) {
      Alert.alert("Feil", "Ingen bruker funnet. Vennligst logg inn igjen.");
      return;
    }
 {/* Variabelen orderData inneholder dataene som skal lagres i databasen */}
    const orderData = {
      date: date.toDateString(), // Dato for bestilling
      location, // Henteposisjon
      bottles: parseInt(bottles, 10), // Konverterer til heltall
      glasses: parseInt(glasses, 10), // Konverterer til heltall
      userId: currentUser.uid, // Brukerens ID
      createdAt: new Date().toISOString(), // Opprettet dato og tid
    };

    const ordersRef = ref(db, "orders/"); // Referanse til "orders"-tabellen
    const userStatsRef = ref(db, `stats/${currentUser.uid}`); // Referanse til brukerens statistikk

    {/* Lagrer bestillingen i databasen */}
    push(ordersRef, orderData) // Legger til bestillingen i databasen
      .then(() => {
        Alert.alert("Suksess", "Din bestilling er sendt!");
        get(userStatsRef)
          .then((snapshot) => { // Henter brukerens statistikk
            const stats = snapshot.val() || { bottles: 0, glasses: 0 };  // Hvis ingen statistikk finnes, settes det til 0
            const updatedStats = { // Oppdaterer statistikken
              bottles: stats.bottles + orderData.bottles,
              glasses: stats.glasses + orderData.glasses,
            };

            return set(userStatsRef, updatedStats);
          });
        setBottles(""); // Nullstiller antall flasker
        setGlasses(""); // Nullstiller antall glass
        fetchCurrentLocation();   // Henter nåværende lokasjon
      })
      .catch((error) => {
        console.error("Feil ved lagring av bestilling:", error.message);
        Alert.alert("Feil", "Kunne ikke sende bestillingen. Prøv igjen senere.");
      });
  };

  return (
    
    <KeyboardAvoidingView  //
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.inner}>
          <Text style={styles.title}>Bestill Pant Henting</Text>

          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.datePickerButton}
          >
            <Text style={styles.datePickerText}>
              {`Velg Dato: ${date.toDateString()}`}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <Modal transparent animationType="fade">
              <View style={styles.modalContainer}>
                <View style={styles.datePickerModal}>
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="spinner"
                    onChange={handleConfirmDate}
                  />
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Text style={styles.closeButtonText}>Lukk</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Antall Flasker"
              keyboardType="numeric"
              value={bottles}
              onChangeText={setBottles}
            />
            <TextInput
              style={styles.input}
              placeholder="Antall Glass"
              keyboardType="numeric"
              value={glasses}
              onChangeText={setGlasses}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitOrder}>
            <Text style={styles.submitButtonText}>Send Bestilling</Text>
          </TouchableOpacity>

          <View style={styles.mapContainer}>
            <Text style={styles.subtitle}>Trykk på kartet for å sette en henteposisjon</Text>
            {location ? (
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
                onPress={handleMapPress}
              >
                <Marker coordinate={location} title="Henteposisjon" />
              </MapView>
            ) : (
              <Text style={styles.loadingText}>Laster kart...</Text>
            )}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  inner: { flexGrow: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#5b975b", textAlign: "center", marginBottom: 20 },
  datePickerButton: { backgroundColor: "#eaf5e3", padding: 15, borderRadius: 10, marginBottom: 20 },
  datePickerText: { fontSize: 16, color: "#5b975b", textAlign: "center" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  datePickerModal: { backgroundColor: "white", padding: 20, borderRadius: 10, alignItems: "center" },
  closeButtonText: { marginTop: 10, fontSize: 16, color: "#007BFF" },
  inputContainer: { marginBottom: 20 },
  input: { backgroundColor: "#f5f5f5", padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  submitButton: { backgroundColor: "#56d141", padding: 15, borderRadius: 10, alignItems: "center", marginBottom: 20 },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  mapContainer: { height: 300, marginBottom: 20 },
  subtitle: { fontSize: 16, color: "#555", marginBottom: 10 },
  map: { flex: 1, borderRadius: 10 },
  loadingText: { textAlign: "center", marginTop: 20, fontSize: 16 },
});

export default Bestilling;
