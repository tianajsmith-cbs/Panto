import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Bestilling from "../screens/PrivatScreens/Bestilling";
import PantestasjonMapScreen from "../screens/FellesScreens/PanteKart";
import BedriftMapScreen from "../screens/BedriftScreens/Bestillinger";
import ProfileStack from "./ProfileStack";
import Kalkulator from "../screens/PrivatScreens/Kalkulator";

const Tab = createBottomTabNavigator(); // Bottom Tab Navigator for BottomTabNavigator

export default function BottomTabNavigator({ userType }) { // BottomTabNavigator function 
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
      {userType === "PRIVATPERSON" ? ( // If userType is PRIVATPERSON
        <>
          <Tab.Screen name="Bestill" component={Bestilling} /> 
          <Tab.Screen name="Pantolator" component={Kalkulator} />
        </>
      ) : (
        <Tab.Screen name="Bestillinger" component={BedriftMapScreen} /> 
      )}
      <Tab.Screen name="Kart" component={PantestasjonMapScreen} /> // Show PantestasjonMapScreen
      <Tab.Screen name="Profil" component={ProfileStack} /> 
    </Tab.Navigator>
  );
}
