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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 50,
  },
  logoText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#82B366",
    textAlign: "center",
  },
  formContainer: {
    width: "90%",
  },
  loginTitle: {
    fontSize: 14,
    color: "#7D8B75",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
  },
  loginButton: {
    backgroundColor: "#E5F3E3",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#4A8C4B",
    fontSize: 16,
    fontWeight: "bold",
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
  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
});

export default AuthScreen;
