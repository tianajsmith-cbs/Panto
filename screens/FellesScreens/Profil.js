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
    const unsubscribeUser = onValue(userRef, (snapshot) => { // Lytt etter endringer i brukerdata
      setUserData(snapshot.val()); // Oppdater brukerdata 
    });

    return () => unsubscribeUser(); // Avslutt lytting ved opprydding 
  }, [currentUser]); // Kjør effekten når currentUser endres (innlogging/utlogging) 

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

  if (!userData) { // Vis en loading-skjerm mens brukerdata lastes
    return ( // Loading-skjerm
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
          <Text style={styles.profileName}>
            {userData.firstName} {userData.lastName}
          </Text>
          <Text style={styles.arrow}>➔</Text>
        </TouchableOpacity>
      </View>

        {/* Vis egne reservasjoner for bedriftsbrukere */}
        {userData.userType === "BEDRIFT" && ( // Sjekk om brukeren er en bedriftsbruker
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
  // Hovedcontainer for skjermen
  container: {
    flexGrow: 1, // Gjør at innhold kan vokse utover tilgjengelig plass
    backgroundColor: "#FFFFFF", // Hvit bakgrunnsfarge
    paddingHorizontal: 20, // Horisontal padding for å skape plass på sidene
    paddingTop: 50, // Vertikal padding på toppen
  },

  // Container for headeren
  headerContainer: {
    flexDirection: "row", // Plasserer innhold i headeren horisontalt
    justifyContent: "space-between", // Fordeler plass mellom elementene
    alignItems: "center", // Sentrerer innholdet vertikalt
    marginBottom: 20, // Avstand til neste element
  },

  // Stil for velkomstteksten
  greeting: {
    fontSize: 22, // Størrelse på teksten
    fontWeight: "bold", // Fet skrift
    color: "#5b975b", // Grønn tekstfarge
  },

  // Stil for knapp rundt logoen
  logoButton: {
    padding: 5, // Padding rundt innholdet
  },

  // Stil for tekst på logoen
  logoText: {
    fontSize: 18, // Størrelse på logo-teksten
    fontWeight: "bold", // Fet skrift
    color: "#5b975b", // Grønn tekstfarge
  },

  // Seksjon for profildetaljer
  profileSection: {
    marginBottom: 20, // Avstand til neste element
  },

  // Rad for profilinformasjon
  profileRow: {
    flexDirection: "row", // Plasserer elementene horisontalt
    alignItems: "center", // Sentrerer vertikalt
    borderBottomWidth: 1, // Underlinje nederst
    borderColor: "#ddd", // Grå farge på underlinjen
    paddingBottom: 10, // Padding under innholdet
  },

  // Sirkel for profilbilde
  profileCircle: {
    width: 50, // Bredde på sirkelen
    height: 50, // Høyde på sirkelen
    backgroundColor: "#5b975b", // Grønn bakgrunnsfarge
    borderRadius: 25, // Gjør elementet til en sirkel
  },

  // Navn på brukeren
  profileName: {
    marginLeft: 10, // Avstand til venstre
    fontSize: 18, // Størrelse på teksten
    fontWeight: "bold", // Fet skrift
    color: "#333", // Mørk grå tekstfarge
    flex: 1, // Fyller tilgjengelig plass
  },

  // Pilikon i profillinjen
  arrow: {
    fontSize: 20, // Størrelse på ikonet
    color: "#5b975b", // Grønn farge
  },

  // Tittel for hver seksjon
  sectionTitle: {
    fontSize: 18, // Størrelse på teksten
    fontWeight: "bold", // Fet skrift
    marginBottom: 10, // Avstand under teksten
    color: "#333", // Mørk grå tekstfarge
  },

  // Seksjon for reservasjoner
  reservationSection: {
    backgroundColor: "#eaf5e3", // Lys grønn bakgrunn
    padding: 15, // Padding rundt innholdet
    borderRadius: 8, // Myke hjørner
    alignItems: "center", // Sentrerer innhold horisontalt
  },

  // Informasjonstekst
  infoText: {
    fontSize: 14, // Størrelse på teksten
    color: "#555", // Middels grå tekstfarge
  },

  // Logg ut-knapp
  logoutButton: {
    marginTop: 30, // Avstand til toppen
    backgroundColor: "#e6e8d8", // Lys bakgrunnsfarge
    paddingVertical: 15, // Vertikal padding
    borderRadius: 10, // Myke hjørner
    alignItems: "center", // Sentrerer tekst horisontalt
  },

  // Tekst for logg ut-knappen
  logoutText: {
    color: "#5b975b", // Grønn tekstfarge
    fontSize: 16, // Størrelse på teksten
    fontWeight: "bold", // Fet skrift
  },

  // Container som vises under lasting
  loadingContainer: {
    flex: 1, // Fyller hele skjermen
    justifyContent: "center", // Sentrerer vertikalt
    alignItems: "center", // Sentrerer horisontalt
  },

  // Tekst som vises under lasting
  loadingText: {
    fontSize: 16, // Størrelse på teksten
    color: "#888", // Lys grå tekstfarge
  },
});



export default ProfileScreen;
