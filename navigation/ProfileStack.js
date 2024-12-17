import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "../screens/FellesScreens/Profil";
import EditProfile from "../screens/FellesScreens/EditProfile";
import ReservationsScreen from "../screens/BedriftScreens/ReservationsScreen";

const Stack = createStackNavigator();

export default function ProfileStack() {
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
