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
} from "react-native";
import * as Location from "expo-location";
import DateTimePicker from "@react-native-community/datetimepicker";
import MapView, { Marker } from "react-native-maps";
import { getDatabase, ref, push, get, set } from "firebase/database";
import { auth } from "../data/firebase";


const Bestilling = () => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [location, setLocation] = useState(null);
  const [bottles, setBottles] = useState("");
  const [glasses, setGlasses] = useState("");
  const [loading, setLoading] = useState(true);

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

  const handleConfirmDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
  };

  const fetchCurrentLocation = async () => {
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


  const handleSubmitOrder = () => {
    if (!location || !bottles || !glasses) {
      Alert.alert("Feil", "Vennligst fyll ut alle feltene og velg en posisjon.");
      return;
    }
  
    const db = getDatabase();
    const currentUser = auth.currentUser;
  
    if (!currentUser) {
      Alert.alert("Feil", "Ingen bruker funnet. Vennligst logg inn igjen.");
      return;
    }
  
    const orderData = {
      date: date.toDateString(),
      location,
      bottles: parseInt(bottles, 10), // Konverter til tall
      glasses: parseInt(glasses, 10), // Konverter til tall
      userId: currentUser.uid,
      createdAt: new Date().toISOString(),
    };
  
    const ordersRef = ref(db, "orders/");
    const userStatsRef = ref(db, `stats/${currentUser.uid}`);
  
    // Lagre bestillingen
    push(ordersRef, orderData)
      .then(() => {
        Alert.alert("Suksess", "Din bestilling er sendt!");
        console.log("Order saved:", orderData);
  
        // Oppdater brukerens stats
        get(userStatsRef)
          .then((snapshot) => {
            const stats = snapshot.val() || { bottles: 0, glasses: 0 };
            const updatedStats = {
              bottles: stats.bottles + orderData.bottles,
              glasses: stats.glasses + orderData.glasses,
            };
  
            return set(userStatsRef, updatedStats); // Oppdater stats i databasen
          })
          .then(() => {
            console.log("Stats updated successfully");
          })
          .catch((error) => {
            console.error("Feil ved oppdatering av stats:", error.message);
          });
  
        // Tilbakestill inputfeltene
        setBottles("");
        setGlasses("");
  
        // Hent brukerens posisjon på nytt
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
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleConfirmDate}
            />
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

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitOrder}
          >
            <Text style={styles.submitButtonText}>Send Bestilling</Text>
          </TouchableOpacity>

          <View style={styles.mapContainer}>
            <Text style={styles.subtitle}>
              Trykk på kartet for å sette en henteposisjon
            </Text>
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
                <Marker
                  coordinate={location}
                  title="Henteposisjon"
                  description="Dette er stedet hvor flaskene skal hentes"
                />
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
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  inner: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5b975b",
    textAlign: "center",
    marginBottom: 20,
  },
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
  mapContainer: {
    height: 300,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
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
});

export default Bestilling;
