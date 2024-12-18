import React from "react"; // Importerer React fra react
import { createStackNavigator } from "@react-navigation/stack"; // Importerer createStackNavigator fra @react-navigation/stack
import ProfileScreen from "../screens/FellesScreens/Profil"; // Importerer ProfileScreen fra Profil.js
import EditProfile from "../screens/FellesScreens/EditProfile"; //  Importerer EditProfile fra EditProfile.js
import ReservationsScreen from "../screens/BedriftScreens/ReservationsScreen"; // Importerer ReservationsScreen fra ReservationsScreen.js

const Stack = createStackNavigator(); // Stack Navigator for ProfileStack

export default function ProfileStack() { // Eksporterer ProfileStack
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ title: "Rediger Profil" }}
      />
      <Stack.Screen
        name="Reservations"
        component={ReservationsScreen}
        options={{ title: "Dine Reservasjoner" }}
      />
    </Stack.Navigator>
  );
}
