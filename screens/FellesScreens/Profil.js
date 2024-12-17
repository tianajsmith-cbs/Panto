import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { getDatabase, ref, onValue } from "firebase/database";
import { auth } from "../../data/firebase";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => { // Profilskjerm
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;
 
    const db = getDatabase(); // Hent database
    const userRef = ref(db, `users/${currentUser.uid}`); // Referanse til brukerens dokument

    // Hent brukerdata
    const unsubscribeUser = onValue(userRef, (snapshot) => {
      setUserData(snapshot.val());
    });

    return () => unsubscribeUser();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("AuthNavigator"); // Navigerer til AuthNavigator
    } catch (error) {
      Alert.alert("Feil", "Kunne ikke logge ut."); 
    }
  };
  

  const navigateToEditProfile = () => {
    navigation.navigate("EditProfile"); // Navigerer til redigeringsskjermen
  };

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Laster brukerdata...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.greeting}>Hei, {userData.firstName?.toUpperCase()}</Text>
        <TouchableOpacity style={styles.logoButton}>
          <Text style={styles.logoText}>PANTO</Text>
        </TouchableOpacity>
      </View>

      {/* Profilinfo */}
      <View style={styles.profileSection}>
        <TouchableOpacity style={styles.profileRow} onPress={navigateToEditProfile}>
          <View style={styles.profileCircle} />
          <Text style={styles.profileName}>
            {userData.firstName} {userData.lastName}
          </Text>
          <Text style={styles.arrow}>➔</Text>
        </TouchableOpacity>
      </View>

        {/* Vis egne reservasjoner for bedriftsbrukere */}
        {userData.userType === "BEDRIFT" && (
        <>
            <Text style={styles.sectionTitle}>Se dine reservasjoner</Text>
            <TouchableOpacity
            style={styles.reservationSection}
            onPress={() => navigation.navigate("Reservations")}
            >
            <Text style={styles.infoText}>Trykk her for å se dine reservasjoner</Text>
            </TouchableOpacity>
        </>
        )}


      {/* Logg ut */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logg ut</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#5b975b",
  },
  logoButton: {
    padding: 5,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5b975b",
  },
  profileSection: {
    marginBottom: 20,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
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
    color: "#333",
    flex: 1,
  },
  arrow: {
    fontSize: 20,
    color: "#5b975b",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  reservationSection: {
    backgroundColor: "#eaf5e3",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  infoText: {
    fontSize: 14,
    color: "#555",
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
