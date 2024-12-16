import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getDatabase, ref, onValue } from "firebase/database";
import { auth } from "../data/firebase"; // Riktig import av Firebase-auth
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    const db = getDatabase();
    const userRef = ref(db, `users/${currentUser.uid}`);

    const unsubscribe = onValue(userRef, (snapshot) => {
      setUserData(snapshot.val());
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Auth");
    } catch (error) {
      Alert.alert("Feil", "Kunne ikke logge ut.");
    }
  };

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Laster brukerdata...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.greeting}>GOD MORGEN, {userData.firstName?.toUpperCase()}</Text>

      {/* Profilinfo */}
      <TouchableOpacity style={styles.profileContainer}>
        <View style={styles.profileCircle} />
        <Text style={styles.profileName}>{userData.firstName} {userData.lastName}</Text>
      </TouchableOpacity>


      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logg ut</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#5b975b",
    marginBottom: 20,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 10,
  },
  profileCircle: {
    width: 50,
    height: 50,
    backgroundColor: "#5b975b",
    borderRadius: 25,
  },
  profileName: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#5b975b",
  },
  arrow: {
    marginLeft: "auto",
    fontSize: 20,
    fontWeight: "bold",
    color: "#5b975b",
  },

  logoutButton: {
    marginTop: 30,
    backgroundColor: "#e6e8d8",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#5b975b",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#888",
  },
});

export default ProfileScreen;
