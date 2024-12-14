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
import DateTimePicker from "@react-native-community/datetimepicker"; // Date picker
import MapView, { Marker } from "react-native-maps";

const Bestilling = () => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [location, setLocation] = useState(null);
  const [bottles, setBottles] = useState("");
  const [glasses, setGlasses] = useState("");

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

  const handleSubmitOrder = () => {
    console.log("Order Submitted:");
    console.log("Date:", date.toDateString());
    console.log("Location:", location);
    console.log("Bottles:", bottles);
    console.log("Glasses:", glasses);
    alert("Din bestilling er sendt!");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.inner}>
          <Text style={styles.title}>Bestill Pant Henting</Text>

          {/* Date Picker Section */}
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

          {/* Input Section */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Antall Flasker"
              keyboardType="numeric"
              value={bottles}
              onChangeText={setBottles}
              onSubmitEditing={Keyboard.dismiss} // Dismiss keyboard after pressing Done
              returnKeyType="done" // Change keyboard button to "Done"
            />
            <TextInput
              style={styles.input}
              placeholder="Antall Glass"
              keyboardType="numeric"
              value={glasses}
              onChangeText={setGlasses}
              onSubmitEditing={Keyboard.dismiss} // Dismiss keyboard after pressing Done
              returnKeyType="done" // Change keyboard button to "Done"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitOrder}
          >
            <Text style={styles.submitButtonText}>Send Bestilling</Text>
          </TouchableOpacity>

          {/* Map Section */}
          <View style={styles.mapContainer}>
            <Text style={styles.subtitle}>
              Trykk på kartet for å sette en henteposisjon
            </Text>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: 59.911491,
                longitude: 10.757933,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              onPress={handleMapPress}
            >
              {location && (
                <Marker
                  coordinate={location}
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
