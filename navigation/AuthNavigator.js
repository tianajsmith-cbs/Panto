{/* <AuthNavigator /> */ }
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import IntroSkjerm from "../screens/FellesScreens/IntroSkjerm";
import RegisterScreen from "../screens/FellesScreens/RegisterScreen";

const Stack = createStackNavigator(); // Stack Navigator for AuthNavigator


export default function AuthNavigator() { 
  
  return ( 
    <Stack.Navigator>
      <Stack.Screen name="Auth" component={IntroSkjerm} options={{ headerShown: false }} /> 
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Opprett Bruker" }} />
    </Stack.Navigator>
  );
}
