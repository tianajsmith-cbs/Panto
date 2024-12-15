import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker"; // Komponent for datovalg
import MapView, { Marker } from "react-native-maps"; // Kartkomponent

const Bestilling = () => {
  // Tilstandshåndtering for dato, kartposisjon og brukerinput
  const [date, setDate] = useState(new Date()); // Holder valgt dato
  const [showDatePicker, setShowDatePicker] = useState(false); // Styrer visning av dato-velger
  const [location, setLocation] = useState(null); // Holder valgt henteposisjon
  const [bottles, setBottles] = useState(""); // Antall flasker som skal hentes
  const [glasses, setGlasses] = useState(""); // Antall glass som skal hentes

  // Håndterer valg av dato fra dato-velgeren
  const handleConfirmDate = (event, selectedDate) => {
    setShowDatePicker(false); // Skjuler dato-velgeren
    if (selectedDate) {
      setDate(selectedDate); // Oppdaterer valgt dato
    }
  };

  // Håndterer trykk på kartet for å sette en posisjon
  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLocation({ latitude, longitude }); // Oppdaterer posisjon
  };

  // Håndterer innsending av bestilling
  const handleSubmitOrder = () => {
    // Logger bestillingsinformasjonen til konsollen
    console.log("Order Submitted:");
    console.log("Date:", date.toDateString());
    console.log("Location:", location);
    console.log("Bottles:", bottles);
    console.log("Glasses:", glasses);
    // Viser en bekreftelsesmelding til brukeren
    alert("Din bestilling er sendt!");
  };

  return (
    // Gjør komponenten kompatibel med tastatur ved innskriving
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Dismisser tastaturet når brukeren trykker utenfor inputfeltene */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.inner}>
          {/* Tittel */}
          <Text style={styles.title}>Bestill Pant Henting</Text>

          {/* Seksjon for datovalg */}
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)} // Viser dato-velgeren
            style={styles.datePickerButton}
          >
            <Text style={styles.datePickerText}>
              {`Velg Dato: ${date.toDateString()}`} {/* Viser valgt dato */}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date" // Bruker dato-modus
              display="default"
              onChange={handleConfirmDate} // Oppdaterer datoen når valgt
            />
          )}

          {/* Inputfelter for antall flasker og glass */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Antall Flasker"
              keyboardType="numeric" // Numerisk tastatur
              value={bottles}
              onChangeText={setBottles} // Oppdaterer flasker
              onSubmitEditing={Keyboard.dismiss} // Skjuler tastaturet
              returnKeyType="done" // Endrer knappen til "Done"
            />
            <TextInput
              style={styles.input}
              placeholder="Antall Glass"
              keyboardType="numeric" // Numerisk tastatur
              value={glasses}
              onChangeText={setGlasses} // Oppdaterer glass
              onSubmitEditing={Keyboard.dismiss} // Skjuler tastaturet
              returnKeyType="done" // Endrer knappen til "Done"
            />
          </View>

          {/* Send bestilling-knapp */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitOrder} // Sender bestillingen
          >
            <Text style={styles.submitButtonText}>Send Bestilling</Text>
          </TouchableOpacity>

          {/* Seksjon for kart */}
          <View style={styles.mapContainer}>
            <Text style={styles.subtitle}>
              Trykk på kartet for å sette en henteposisjon
            </Text>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: 59.911491, // Startposisjon i Oslo
                longitude: 10.757933,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              onPress={handleMapPress} // Oppdaterer henteposisjon ved trykk
            >
              {location && (
                <Marker
                  coordinate={location} // Viser valgt posisjon
                  title="Henteposisjon"
                  description="Dette er stedet hvor flaskene skal hentes"
                />
              )}
            </MapView>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

// Stiler for komponenten
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white", // Bakgrunnsfarge
  },
  inner: {
    flexGrow: 1,
    padding: 20, // Padding for innhold
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
    backgroundColor: "#007BFF",
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
});

export default Bestilling;
