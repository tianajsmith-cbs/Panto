import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { getDatabase, ref, onValue } from "firebase/database";
import { auth } from "./data/firebase";

// Import Screens
import AuthScreen from "./screens/IntroSkjerm";
import RegisterScreen from "./screens/RegisterScreen";
import Kalkulator from "./screens/Kalkulator";
import PantestasjonMapScreen from "./screens/PanteKart";
import ProfileScreen from "./screens/Profil";
import EditProfile from "./screens/EditProfile";
import Bestilling from "./screens/Bestilling";
import BedriftMapScreen from "./screens/Bestillinger";
import CreditsDetailsScreen from "./screens/Kreditter";
import ReservationsScreen from "./screens/ReservationsScreen"; 


const Tab = createBottomTabNavigator(); // Bottom Tab Navigator
const Stack = createStackNavigator(); // Stack Navigator

// Pantolator Stack Navigator
const PantolatorStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Pantolatoren"
        component={Kalkulator}
        options={{ headerShown: false }} // Hovedskjermen for Pantolator
      />
      <Stack.Screen
        name="CreditsDetails"
        component={CreditsDetailsScreen}
        options={{ title: "Rabatter" }} // Skjerm for rabatter
      />
    </Stack.Navigator>
  );
};

// Profile Stack Navigator
const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ headerShown: false }} // Hovedskjerm for profil
      />
      <Stack.Screen
        name="Reservations"
        component={ReservationsScreen}
        options={{ title: "Dine Reservasjoner" }} // Skjerm for reservasjoner
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ title: "Rediger Profil" }} // Skjerm for redigering av profil
      />
    </Stack.Navigator>
  );
};


// Bottom Tab Navigator med brukertype som prop for å vise riktig skjermer for bruker 
const BottomTabNavigator = ({ userType }) => { // Tar inn brukertype som prop
  return ( // Returnerer Bottom Tab Navigator
    <Tab.Navigator // Bottom Tab Navigator
      screenOptions={({ route }) => ({ // Screen Options
        tabBarIcon: ({ focused, color, size }) => { 
          let iconName;
          if (route.name === "Bestill") {
            iconName = focused ? "refresh-circle" : "refresh-circle-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === "Bestillinger") {
            iconName = focused ? "clipboard-list" : "clipboard-list-outline";
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          } else if (route.name === "Pantolator") {
            iconName = "calculator";
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          } else if (route.name === "Kart") {
            iconName = focused ? "map" : "map-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === "Profil") {
            iconName = focused ? "person-circle" : "person-circle-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: "#7ecf63",
        tabBarInactiveTintColor: "#777",
        tabBarStyle: { backgroundColor: "#eaf5e3", borderTopWidth: 0, height: 70 },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "bold" },
      })}
    >
      {userType === "PRIVATPERSON" ? ( // Sjekk om bruker er privatperson eller bedrift
        <>
          <Tab.Screen name="Bestill" component={Bestilling} />  
          <Tab.Screen name="Pantolator" component={PantolatorStack} />
        </>
      ) : (
        <Tab.Screen name="Bestillinger" component={BedriftMapScreen} />
      )}
      <Tab.Screen name="Kart" component={PantestasjonMapScreen} />
      <Tab.Screen name="Profil" component={ProfileStack} />
    </Tab.Navigator>
  );
};


export default function App() {
  const [userType, setUserType] = useState(null); // Brukertype
  const [loading, setLoading] = useState(true); // Laster inn

  useEffect(() => { // Hent brukertype fra Firebase
    const unsubscribe = auth.onAuthStateChanged((currentUser) => { // Lytt etter endringer i autentisering
      if (currentUser) { // Sjekk om bruker er logget inn
        const db = getDatabase(); // Hent database
        const userRef = ref(db, `users/${currentUser.uid}`); // Referanse til brukerens dokument
        onValue(userRef, (snapshot) => { // Hent brukerdata
          const data = snapshot.val(); // Hent data
          setUserType(data?.userType || "PRIVATPERSON"); // Sett brukertype
          setLoading(false); 
        });
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Laster inn...</Text>
      </View>
    );
  }

// Returnerer navigasjonskontaineren med stack navigator for autentisering og bottom tab navigator for hovedskjermer
  return ( 
    <NavigationContainer> 
      <Stack.Navigator>
        <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Opprett Bruker" }} />
        <Stack.Screen name="Main" options={{ headerShown: false }}>
          {() => <BottomTabNavigator userType={userType} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    fontSize: 18,
    color: "#5b975b",
    fontWeight: "bold",
  },
});
