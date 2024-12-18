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
        {userType === "BEDRIFT" && ( // Vis dropdown for bedrift hvis bruker er bedrift
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
          {userType === "PRIVATPERSON" // Vis informasjon om valgt brukertype
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
  // Hovedcontainer for skjermen
  container: {
    flex: 1, // Fyller hele skjermen
    backgroundColor: "#fff", // Hvit bakgrunn
    justifyContent: "center", // Sentrerer innhold vertikalt
    alignItems: "center", // Sentrerer innhold horisontalt
  },

  // Container for logoen
  logoContainer: {
    marginBottom: 30, // Avstand under logoen
  },

  // Tekststil for logoen
  logoText: {
    fontSize: 48, // Stor skriftstørrelse
    fontWeight: "bold", // Fet tekst
    color: "#82B366", // Grønn farge
  },

  // Stil for tittelteksten
  titleText: {
    color: "#7D8B75", // Mørk grønn tekst
    fontSize: 14, // Mindre skriftstørrelse
    fontWeight: "bold", // Fet tekst
    marginBottom: 20, // Avstand under teksten
  },

  // Container for skjemaet
  formContainer: {
    width: "90%", // Fyller 90% av skjermens bredde
  },

  // Stil for inputfeltene
  input: {
    backgroundColor: "#f5f5f5", // Lys grå bakgrunn
    padding: 12, // Indre mellomrom
    borderRadius: 8, // Myke hjørner
    marginBottom: 10, // Avstand under hvert inputfelt
    fontSize: 16, // Skriftstørrelse
  },

  // Raden som holder alternativknappene
  buttonRow: {
    flexDirection: "row", // Plasserer knappene horisontalt
    justifyContent: "space-between", // Plass mellom knappene
    marginBottom: 20, // Avstand under raden
  },

  // Stil for alternativknappene
  optionButton: {
    flex: 1, // Fordeler plass likt mellom knappene
    backgroundColor: "#4A8C4B", // Mørk grønn farge
    padding: 15, // Indre mellomrom
    borderRadius: 8, // Myke hjørner
    alignItems: "center", // Sentrerer tekst horisontalt
    marginHorizontal: 5, // Mellomrom på sidene
  },

  // Stil for aktivert alternativknapp
  optionButtonActive: {
    backgroundColor: "#82B366", // Lysere grønn farge
    borderWidth: 2, // Kantlinje rundt knappen
    borderColor: "#4A8C4B", // Farge på kantlinjen
  },

  // Tekststil for knappene
  optionText: {
    color: "#fff", // Hvit tekst
    fontSize: 14, // Skriftstørrelse
    fontWeight: "bold", // Fet tekst
  },

  // Stil for informasjonsfelt
  selectionInfo: {
    textAlign: "center", // Sentrerer teksten
    fontSize: 14, // Skriftstørrelse
    color: "#333", // Mørk grå tekst
    marginBottom: 10, // Avstand under teksten
  },

  // Container for picker (valgkomponent)
  pickerContainer: {
    marginBottom: 20, // Avstand under pickeren
  },

  // Etikett for picker
  pickerLabel: {
    fontSize: 14, // Skriftstørrelse
    color: "#7D8B75", // Mørk grønn tekst
    marginBottom: 5, // Avstand under etiketten
  },

  // Stil for picker-komponenten
  picker: {
    backgroundColor: "#f5f5f5", // Lys grå bakgrunn
    borderRadius: 8, // Myke hjørner
  },

  // Stil for registreringsknappen
  registerButton: {
    backgroundColor: "#F6FDF5", // Lys grønn bakgrunn
    padding: 15, // Indre mellomrom
    borderRadius: 8, // Myke hjørner
    alignItems: "center", // Sentrerer tekst horisontalt
  },

  // Tekststil for registreringsknappen
  registerText: {
    color: "#4A8C4B", // Mørk grønn tekst
    fontSize: 16, // Skriftstørrelse
    fontWeight: "bold", // Fet tekst
  },
});



export default RegisterScreen;
