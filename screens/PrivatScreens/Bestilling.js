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
} from "react-native";
import * as Location from "expo-location";
import DateTimePicker from "@react-native-community/datetimepicker";
import MapView, { Marker } from "react-native-maps";
import { getDatabase, ref, push, get, set } from "firebase/database";
import { auth } from "../../data/firebase";

// Komponent for å bestille henting av pant
const Bestilling = () => {
  const [date, setDate] = useState(new Date()); // Dato for henting
  const [showDatePicker, setShowDatePicker] = useState(false); // Viser datepicker
  const [location, setLocation] = useState(null); // Henteposisjon
  const [bottles, setBottles] = useState(""); // Antall flasker
  const [glasses, setGlasses] = useState(""); // Antall glass
  const [loading, setLoading] = useState(true); // Laster lokasjon
  const [donationOption, setDonationOption] = useState("self"); // "self" eller "charity"

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync(); // Sjekker om appen har tilgang til lokasjon
      if (status !== "granted") {
        Alert.alert("Feil", "Tillatelse til lokasjon er nødvendig for å bruke kartet.");
        setLoading(false);
        return;
      }
      const currentLocation = await Location.getCurrentPositionAsync({}); // Henter gjeldende posisjon
      setLocation({   // Setter lokasjon
        latitude: currentLocation.coords.latitude,  // Breddegrad
        longitude: currentLocation.coords.longitude, // Lengdegrad
      });
      setLoading(false); // Slutter å laste
    })();
  }, []);

  const handleConfirmDate = (event, selectedDate) => { // Håndterer valgt dato
    setShowDatePicker(false); // Lukker datepicker
    if (selectedDate) { // Sjekker om dato er valgt
      setDate(selectedDate); // Setter valgt dato
    }
  };

  const handleMapPress = (event) => { // Håndterer trykk på kartet
    const { latitude, longitude } = event.nativeEvent.coordinate; // Henter koordinater
    setLocation({ latitude, longitude }); // Setter henteposisjon
  };

  const fetchCurrentLocation = async () => { // Henter gjeldende posisjon på nytt
    try {
      const currentLocation = await Location.getCurrentPositionAsync({});  
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

  const handleSubmitOrder = () => { // Sender bestilling
    if (!location || !bottles || !glasses) {
      Alert.alert("Feil", "Vennligst fyll ut alle feltene og velg en posisjon.");
      return;
    }

    const db = getDatabase(); // Henter database referanse
    const currentUser = auth.currentUser; // Henter gjeldende bruker

    if (!currentUser) {
      Alert.alert("Feil", "Ingen bruker funnet. Vennligst logg inn igjen."); 
      return;
    }

    const orderData = { // Data for bestilling
      date: date.toDateString(), // Dato for henting som tekst
      location, // Henteposisjon
      bottles: parseInt(bottles, 10), // Antall flasker og glass som tall
      glasses: parseInt(glasses, 10), 
      donationOption, // Valgt donasjonsalternativ
      userId: currentUser.uid, // Bruker-ID
      createdAt: new Date().toISOString(), // Opprettet dato og tid
    };

    const ordersRef = ref(db, "orders/"); // Referanse til bestillinger i databasen
    const userStatsRef = ref(db, `stats/${currentUser.uid}`); // Referanse til brukerens statistikk

    push(ordersRef, orderData) // Lagrer bestillingen i databasen
      .then(() => {
        Alert.alert("Suksess", "Din bestilling er sendt!");
        get(userStatsRef).then((snapshot) => {
          const stats = snapshot.val() || { bottles: 0, glasses: 0 };
          const updatedStats = {
            bottles: stats.bottles + orderData.bottles,
            glasses: stats.glasses + orderData.glasses,
          };

          return set(userStatsRef, updatedStats);
        });
        setBottles("");
        setGlasses("");
        setDonationOption("self");
        fetchCurrentLocation();
      })
      .catch((error) => {
        console.error("Feil ved lagring av bestilling:", error.message);
        Alert.alert("Feil", "Kunne ikke sende bestillingen. Prøv igjen senere.");
      });
  };

  return (
    <KeyboardAvoidingView
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

          <View style={styles.donationContainer}>
            <Text style={styles.subtitle}>Hva vil du gjøre med pantebeløpet?</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  donationOption === "self" && styles.selectedOption,
                ]}
                onPress={() => setDonationOption("self")}
              >
                <Text style={styles.optionText}>Behold selv</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  donationOption === "charity" && styles.selectedOption,
                ]}
                onPress={() => setDonationOption("charity")}
              >
                <Text style={styles.optionText}>Gi til veldedighet</Text>
              </TouchableOpacity>
            </View>
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
  // Hovedcontainer
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  inner: {
    flexGrow: 1,
    padding: 20,
  },

  // Overskrifter og undertekster
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5b975b",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },

  // Datovelger
  datePickerButton: {
    backgroundColor: "#eaf5e3",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  datePickerText: {
    fontSize: 16,
    color: "#5b975b",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  datePickerModal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    marginTop: 10,
    fontSize: 16,
    color: "#007BFF",
  },

  // Inputfelt
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },

  // Knapp: Send bestilling
  submitButton: {
    backgroundColor: "#56d141",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Kartvisning
  mapContainer: {
    height: 300,
    marginBottom: 20,
  },
  map: {
    flex: 1,
    borderRadius: 10,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },

  // Donasjonvalg
  donationContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#eaf5e3",
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: "#56d141",
  },
  optionText: {
    color: "#333",
    fontWeight: "bold",
  },
});




export default Bestilling;
