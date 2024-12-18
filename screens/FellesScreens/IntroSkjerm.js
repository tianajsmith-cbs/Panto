import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

const AuthScreen = ({ navigation }) => { 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const auth = getAuth(); // Hent autentiseringsobjekt

  const handleSignIn = async () => { // Logg inn bruker
    if (!email || !password) { // Sjekk om e-post og passord er fylt ut
      Alert.alert("Feil", "Vennligst fyll inn både e-post og passord.");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password); // Logg inn bruker
      const user = userCredential.user;

      console.log("Bruker logget inn:", user.uid);

      const db = getDatabase(); // Hent database-instans
      const userRef = ref(db, `users/${user.uid}`); //  Referanse til brukerens dokument

      onValue( 
        userRef,
        (snapshot) => {
          const data = snapshot.val(); // Hent brukerdata
          console.log("BrukerType:", data?.userType); // Logg brukertype
          navigation.replace("Main"); // Naviger til hovedskjermen
        },
        { onlyOnce: true }
      );
      setErrorMessage("");
    } catch (error) {
      console.error("Feil ved innlogging:", error.message);
      setErrorMessage("Feil ved innlogging: " + error.message);
    }
  };

  const navigateToRegister = () => { // Naviger til registreringsskjerm
    navigation.navigate("Register");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>PANTO</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.loginTitle}>LOGG INN</Text>
        <TextInput
          style={styles.input}
          placeholder="Brukernavn/email"
          placeholderTextColor="#a0a0a0"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Passord"
          placeholderTextColor="#a0a0a0"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={handleSignIn} style={styles.loginButton}>
          {/* Kjører handleSignIn ved trykk på knappen */}
          <Text style={styles.buttonText}>Logg Inn</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateToRegister} style={styles.registerButton}>
          {/* Navigerer til RegisterScreen ved trykk på knappen */}
          <Text style={styles.registerText}>Opprett bruker</Text>
        </TouchableOpacity>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  // Hovedcontainer for skjermen
  container: {
    flex: 1, // Fyller hele skjermen
    backgroundColor: "#fff", // Hvit bakgrunnsfarge
    justifyContent: "center", // Sentrerer innholdet vertikalt
    alignItems: "center", // Sentrerer innholdet horisontalt
  },

  // Container for logoen
  logoContainer: {
    marginBottom: 50, // Avstand under logoen
  },

  // Tekststil for logoen
  logoText: {
    fontSize: 48, // Stor fontstørrelse for logoen
    fontWeight: "bold", // Fet skrift
    color: "#82B366", // Grønn farge
    textAlign: "center", // Sentrerer teksten horisontalt
  },

  // Container for innloggingsskjemaet
  formContainer: {
    width: "90%", // Gjør skjemaet 90% av skjermbredden
  },

  // Tittelstil for innloggingsskjemaet
  loginTitle: {
    fontSize: 14, // Fontstørrelse
    color: "#7D8B75", // Mørk grønn tekstfarge
    textAlign: "center", // Sentrerer teksten horisontalt
    marginBottom: 20, // Avstand under tittelen
    fontWeight: "bold", // Fet skrift
  },

  // Stil for tekstinnhold/inputfelt
  input: {
    backgroundColor: "#f5f5f5", // Lys grå bakgrunn
    padding: 12, // Innvendig padding
    borderRadius: 8, // Runde hjørner
    marginBottom: 10, // Avstand under elementet
    fontSize: 16, // Fontstørrelse
    color: "#333", // Mørk tekstfarge
  },

  // Stil for innloggingsknappen
  loginButton: {
    backgroundColor: "#E5F3E3", // Lys grønn bakgrunn
    padding: 15, // Innvendig padding
    borderRadius: 8, // Runde hjørner
    alignItems: "center", // Sentrerer innholdet horisontalt
    marginBottom: 10, // Avstand under knappen
  },

  // Stil for teksten i knappene
  buttonText: {
    color: "#4A8C4B", // Grønn tekstfarge
    fontSize: 16, // Fontstørrelse
    fontWeight: "bold", // Fet skrift
  },

  // Stil for registreringsknappen
  registerButton: {
    backgroundColor: "#F6FDF5", // Svak grønn bakgrunn
    padding: 15, // Innvendig padding
    borderRadius: 8, // Runde hjørner
    alignItems: "center", // Sentrerer innholdet horisontalt
  },

  // Stil for teksten på registreringsknappen
  registerText: {
    color: "#4A8C4B", // Grønn tekstfarge
    fontSize: 16, // Fontstørrelse
    fontWeight: "bold", // Fet skrift
  },

  // Stil for feilmeldinger
  errorText: {
    color: "red", // Rød tekstfarge for å indikere feil
    fontSize: 14, // Fontstørrelse
    textAlign: "center", // Sentrerer teksten horisontalt
    marginTop: 10, // Avstand over teksten
  },
});




export default AuthScreen;
