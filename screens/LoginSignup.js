import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { auth } from "../data/firebase"; // Importer Firebase auth
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const AuthScreen = ({ navigation }) => {
  // State-variabler for e-post, passord og feilmelding
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Funksjon for å håndtere brukerregistrering
  const handleSignUp = async () => {
    try {
      // Opprett en ny bruker med e-post og passord
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Bruker registrert:", userCredential.user);
      setErrorMessage(""); // Tøm feilmeldingen
      navigation.replace("Main"); // Naviger etter vellykket registrering
    } catch (error) {
      console.error("Feil ved registrering:", error.message);
      setErrorMessage(error.message); // Sett feilmeldingen
    }
  };

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in:", userCredential.user);
      setErrorMessage(""); // Clear error message
      navigation.replace("Main"); // Navigate after successful sign-in
    } catch (error) {
      console.error("Error signing in:", error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>PANTO</Text>
          <Text style={styles.subtitle}>I SAMARBEID MED</Text>
          <View style={styles.partnersContainer}>
            {/*  Posten and Bring logo */}
            <Image
              source={require("../assets/PostenBringLogo.png")}
              style={styles.partnerLogo}
            />
          </View>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="E-post"
            placeholderTextColor="#777"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Passord"
            placeholderTextColor="#777"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={handleSignIn} style={styles.button}>
            <Text style={styles.buttonText}>Logg Inn</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSignUp} style={styles.buttonOutline}>
            <Text style={styles.buttonOutlineText}>Opprett Konto</Text>
          </TouchableOpacity>

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  logoText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#5b975b", // Green color for the logo
  },
  subtitle: {
    fontSize: 16,
    color: "#e63946", // Red color for "I SAMARBEID MED"
    marginTop: 5,
    marginBottom: 20,
  },
  partnersContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  partnerLogo: {
    width: 200, // Adjust the width of the image
    height: 100, // Adjust the height of the image
    resizeMode: "contain",
  },
  formContainer: {
    width: "80%",
  },
  input: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    width: "100%",
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonOutline: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonOutlineText: {
    color: "#007BFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
});

export default AuthScreen;
