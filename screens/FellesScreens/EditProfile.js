import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { getDatabase, ref, update, remove } from "firebase/database";
import { auth } from "../../data/firebase";
import { updatePassword, deleteUser } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

{/* Rediger profil */}
const EditProfile = () => { 
  const currentUser = auth.currentUser; // Hent gjeldende bruker
  const [firstName, setFirstName] = useState(""); 
  const [lastName, setLastName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigation = useNavigation(); 

  // Lagre oppdateringer
  const handleSave = async () => { 
    const db = getDatabase(); // Hent database-instans
    const userRef = ref(db, `users/${currentUser.uid}`); // Referanse til brukerens dokument
{/* Oppdater brukerens fornavn og etternavn */}
    const updates = {}; 
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
{/* Oppdater passord hvis nytt passord er satt */}
    try {
      await update(userRef, updates);
      if (newPassword) {
        await updatePassword(currentUser, newPassword);
        Alert.alert("Suksess", "Passord oppdatert!");
      }
      Alert.alert("Suksess", "Profil oppdatert!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Feil", "Kunne ikke oppdatere profil.");
      console.error(error.message);
    }
  };

  // Slett bruker med bekreftelse
  const handleDeleteUser = () => {
    Alert.alert(
      "Bekreft Sletting",
      "Er du sikker på at du vil slette brukeren din? Dette kan ikke angres.",
      [
        { text: "Avbryt", style: "cancel" },
        {
          text: "Slett",
          style: "destructive",
          onPress: async () => { // Slett bruker
            try {
              const db = getDatabase(); // Hent database-instans
              const userRef = ref(db, `users/${currentUser.uid}`); // Referanse til brukerens dokument

              
              await remove(userRef); // Slett bruker fra databasen
             
              await deleteUser(currentUser);  // Slett bruker fra Authentication

              Alert.alert("Suksess", "Brukerkontoen din er slettet.");
              navigation.replace("Auth"); // Naviger til Auth-skjermen
            } catch (error) {
              Alert.alert("Feil", "Kunne ikke slette brukerkontoen.");
              console.error("Sletting mislyktes:", error.message);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rediger Profil</Text>

      <TextInput
        style={styles.input}
        placeholder="Nytt Fornavn"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Nytt Etternavn"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Nytt Passord"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
{/* Lagre og slett-knapper */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}> 
        <Text style={styles.buttonText}>Lagre</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteUser}>
        <Text style={styles.buttonText}>Slett Bruker</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFFFFF" },
  title: { fontSize: 22, fontWeight: "bold", color: "#5b975b", marginBottom: 20 },
  input: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#56d141",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default EditProfile;