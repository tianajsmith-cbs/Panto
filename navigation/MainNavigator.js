import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthNavigator from "./AuthNavigator";
import BottomTabNavigator from "./BottomTabNavigator";
import { getDatabase, ref, onValue } from "firebase/database";
import { auth } from "../data/firebase";
import { View, Text } from "react-native";

const Stack = createStackNavigator();

export default function MainNavigator() {
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        const db = getDatabase();
        const userRef = ref(db, `users/${currentUser.uid}`);
        onValue(userRef, (snapshot) => {
          setUserType(snapshot.val()?.userType || "PRIVATPERSON"); // Sett brukertype
          setLoading(false); // Sett lasting til false
        });
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

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
