import React, { useState, useEffect } from "react"; // Importerer useState og useEffect fra React
import { NavigationContainer } from "@react-navigation/native"; // Importerer NavigationContainer fra @react-navigation/native
import { createStackNavigator } from "@react-navigation/stack"; // Importerer createStackNavigator fra @react-navigation/stack
import AuthNavigator from "./AuthNavigator"; // Importerer AuthNavigator
import BottomTabNavigator from "./BottomTabNavigator"; // Importerer BottomTabNavigator
import { getDatabase, ref, onValue } from "firebase/database"; // Importerer getDatabase, ref og onValue fra firebase/database
import { auth } from "../data/firebase"; // Importerer auth fra data/firebase
import { View, Text } from "react-native"; // Importerer View og Text fra react-native

const Stack = createStackNavigator(); // Stack Navigator for MainNavigator

export default function MainNavigator() { // Eksporterer MainNavigator
  const [userType, setUserType] = useState(null); // Deklarerer userType og setUserType med useState og setter verdien til null
  const [loading, setLoading] = useState(true); 

  useEffect(() => { // Hent brukertype
    const unsubscribe = auth.onAuthStateChanged((currentUser) => { // Lytter på endringer i autentisering
      if (currentUser) { // Sjekker om bruker er logget inn
        const db = getDatabase(); // Hent database
        const userRef = ref(db, `users/${currentUser.uid}`); // Referanse til brukerens dokument
        onValue(userRef, (snapshot) => {  // Hent brukerdata
          setUserType(snapshot.val()?.userType || "PRIVATPERSON"); // Sett brukertype til brukerens brukertype eller PRIVATPERSON
          setLoading(false); // Sett lasting til false 
        });
      } else { // Hvis bruker ikke er logget inn
        setLoading(false); // Sett lasting til false
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }
{/* Navigering */}
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AuthNavigator" component={AuthNavigator} /> 
        <Stack.Screen name="Main" options={{ headerShown: false }}>
          {() => <BottomTabNavigator userType={userType} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Laster inn...</Text>
  </View>
);
