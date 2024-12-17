import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"; // Importerer createBottomTabNavigator fra @react-navigation/bottom-tabs
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"; // Importerer Ionicons og MaterialCommunityIcons fra @expo/vector-icons
import Bestilling from "../screens/PrivatScreens/Bestilling"; // Importerer Bestilling fra Bestilling.js
import PantestasjonMapScreen from "../screens/FellesScreens/PanteKart"; // Importerer PantestasjonMapScreen fra PanteKart.js
import BedriftMapScreen from "../screens/BedriftScreens/Bestillinger"; // Importerer BedriftMapScreen fra Bestillinger.js
import ProfileStack from "./ProfileStack"; // Importerer ProfileStack fra ProfileStack.js
import Kalkulator from "../screens/PrivatScreens/Kalkulator"; // Importerer Kalkulator fra Kalkulator.js

const Tab = createBottomTabNavigator(); 

export default function BottomTabNavigator({ userType }) { 
  return (
  
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Bestill") {
            iconName = focused ? "refresh-circle" : "refresh-circle-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === "Bestillinger") {
            iconName = "clipboard-list";
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          } else if (route.name === "Pantolator") {
            iconName = "calculator";
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          } else if (route.name === "Kart") {
            iconName = focused ? "map" : "map-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === "Profil") {
            iconName = "person-circle-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: "#7ecf63",
        tabBarInactiveTintColor: "#777",
      })}
    >
      {userType === "PRIVATPERSON" ? ( // If userType is PRIVATPERSON show Bestill and Pantolator, else show Bestillinger
        <>
          <Tab.Screen name="Bestill" component={Bestilling} /> 
          <Tab.Screen name="Pantolator" component={Kalkulator} />
        </>
      ) : (
        <Tab.Screen name="Bestillinger" component={BedriftMapScreen} /> 
      )}
      <Tab.Screen name="Kart" component={PantestasjonMapScreen} /> 
      <Tab.Screen name="Profil" component={ProfileStack} /> 
    </Tab.Navigator>
  );
}
