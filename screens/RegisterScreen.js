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
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

const RegisterScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("PRIVATPERSON");

  const auth = getAuth();
  const db = getDatabase();

  const handleRegister = async () => {
    if (!email || !password || !firstName || !lastName) {
      Alert.alert("Feil", "Vennligst fyll inn alle feltene.");
      return;
    }

    try {
      // Opprett bruker i Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Lagre data i Realtime Database
      const userRef = ref(db, `users/${user.uid}`);
      await set(userRef, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        userType: userType,
      });

      console.log("Bruker opprettet og lagret i Realtime Database:", user.uid);
      Alert.alert("Suksess", "Bruker opprettet!");
      navigation.replace("Main");
    } catch (error) {
      console.error("Feil ved opprettelse:", error.message);
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
