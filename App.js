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
import Bestilling from "./screens/Bestilling";
import BedriftMapScreen from "./screens/Bestillinger";
import CreditsDetailsScreen from "./screens/Kreditter";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Pantolator Stack Navigator
const PantolatorStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Pantolator"
        component={Kalkulator}
        options={{ headerShown: false }} // Skjuler headeren på hovedskjermen
      />
      <Stack.Screen
        name="CreditsDetails"
        component={CreditsDetailsScreen}
        options={{ title: "Rabatter" }} // Viser header for rabattskjermen
      />
    </Stack.Navigator>
  );
};

// Bottom Tab Navigator
const BottomTabNavigator = ({ userType }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
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
      {/* Visning basert på brukerens type */}
      {userType === "PRIVATPERSON" ? (
        <>
          <Tab.Screen name="Bestill" component={Bestilling} />
          <Tab.Screen name="Pantolator" component={PantolatorStack} />
        </>
      ) : (
        <Tab.Screen name="Bestillinger" component={BedriftMapScreen} />
      )}
      <Tab.Screen name="Kart" component={PantestasjonMapScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default function App() {
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hent brukerdata fra Firebase
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        const db = getDatabase();
        const userRef = ref(db, `users/${currentUser.uid}`);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          setUserType(data?.userType || "PRIVATPERSON"); // Standard: PRIVATPERSON
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

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Logg inn skjerm */}
        <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
        {/* Registreringsskjerm */}
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Opprett Bruker" }} />
        {/* Hovedskjerm */}
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
