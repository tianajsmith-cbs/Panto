import React, { useState } from "react"; // Import React, useState
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native"; // Import React, useState, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert
import { Picker } from "@react-native-picker/picker"; // Import Picker
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"; // Import createUserWithEmailAndPassword
import { getDatabase, ref, set } from "firebase/database"; // Import getDatabase, ref, set

const RegisterScreen = ({ navigation }) => { // Registreringsskjerm
  const [firstName, setFirstName] = useState(""); // States for fornavn, etternavn, e-post og passord
  const [lastName, setLastName] = useState(""); // States for fornavn, etternavn, e-post og passord
  const [email, setEmail] = useState(""); // States for fornavn, etternavn, e-post og passord
  const [password, setPassword] = useState(""); // States for fornavn, etternavn, e-post og passord
  const [userType, setUserType] = useState("PRIVATPERSON"); // Brukertype
  const [selectedCompany, setSelectedCompany] = useState(""); // Ny state for bedrift

  const auth = getAuth(); // Hent autentiseringsobjekt
  const db = getDatabase(); // Hent database-instans

  {/* Opprett bruker */}
  const handleRegister = async () => { 
    if (!email || !password || !firstName || !lastName) { // Sjekk om alle felt er fylt ut
      Alert.alert("Feil", "Vennligst fyll inn alle feltene.");
      return;
    }

    if (userType === "BEDRIFT" && !selectedCompany) { // Sjekk om bedrift er valgt
      Alert.alert("Feil", "Vennligst velg en bedrift."); 
      return;
    }

    try { 
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = ref(db, `users/${user.uid}`); // Referanse til brukerens dokument
      await set(userRef, { // Opprett bruker
        firstName: firstName.trim(), 
        lastName: lastName.trim(),
        email: email.trim(),
        userType: userType,
        company: userType === "BEDRIFT" ? selectedCompany : null, // Legg til bedrift hvis bruker er bedrift
      });

      Alert.alert("Suksess", "Bruker opprettet!");
      navigation.replace("Main");
    } catch (error) {
      Alert.alert("Feil", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>PANTO</Text>
      </View>

      <Text style={styles.titleText}>OPPRETT BRUKER</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Fornavn"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Etternavn"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="E-post"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Passord"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
    {/* Knapper for valg av brukertype */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              userType === "PRIVATPERSON" && styles.optionButtonActive,
            ]}
            onPress={() => setUserType("PRIVATPERSON")}
          >
            <Text style={styles.optionText}>PRIVATPERSON</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.optionButton,
              userType === "BEDRIFT" && styles.optionButtonActive,
            ]}
            onPress={() => setUserType("BEDRIFT")}
          >
            <Text style={styles.optionText}>BEDRIFT</Text>
          </TouchableOpacity>
        </View>

        {/* Dropdown for bedrift */}
        {userType === "BEDRIFT" && (
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Velg bedrift:</Text>
            <Picker
              selectedValue={selectedCompany}
              onValueChange={(itemValue) => setSelectedCompany(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Velg en bedrift..." value="" />
              <Picker.Item label="PostNord" value="PostNord" />
              <Picker.Item label="Posten" value="Posten" />
              <Picker.Item label="Bring" value="Bring" />
            </Picker>
          </View>
        )}

        <Text style={styles.selectionInfo}>
          {userType === "PRIVATPERSON"
            ? "Du oppretter en konto som privatperson."
            : "Du oppretter en konto som bedrift."}
        </Text>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerText}>Opprett bruker</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#82B366",
  },
  titleText: {
    color: "#7D8B75",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 20,
  },
  formContainer: {
    width: "90%",
  },
  input: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  optionButton: {
    flex: 1,
    backgroundColor: "#4A8C4B",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  optionButtonActive: {
    backgroundColor: "#82B366",
    borderWidth: 2,
    borderColor: "#4A8C4B",
  },
  optionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  selectionInfo: {
    textAlign: "center",
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 14,
    color: "#7D8B75",
    marginBottom: 5,
  },
  picker: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  registerButton: {
    backgroundColor: "#F6FDF5",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  registerText: {
    color: "#4A8C4B",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RegisterScreen;
