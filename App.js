import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; // Icons

import AuthScreen from './screens/LoginSignup'; // Login/Sign-up screen
import Kalkulator from './screens/Kalkulator';
import PantestasjonMapScreen from './screens/PanteKart';
import ProfileScreen from './screens/Profil';
import Bestilling from './screens/Bestilling';
import CreditsDetailsScreen from './screens/Kreditter'; // New Credits Details Screen

// Create bottom tab navigator
const Tab = createBottomTabNavigator();
// Create stack navigator
const Stack = createStackNavigator();



// Bottom tab navigator for the main app
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Custom icons for each tab
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Bestill') {
            iconName = focused ? 'refresh-circle' : 'refresh-circle-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Kalkulator') {
            iconName = focused ? 'calculator' : 'calculator';
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Kart') {
            iconName = focused ? 'map' : 'map-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Profil') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#7ecf63', // Green for active tabs
        tabBarInactiveTintColor: '#777', // Gray for inactive tabs
        tabBarStyle: {
          backgroundColor: '#eaf5e3', // Light green background
          borderTopWidth: 0,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Bestill" component={Bestilling} />
      <Tab.Screen name="Kalkulator" component={Kalkulator} />
      <Tab.Screen name="Kart" component={PantestasjonMapScreen} />
      <Tab.Screen name="Profil" component={ProfileStack} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

// Main app with stack navigation
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Auth Screen as the initial route */}
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ headerShown: false }} // Hide header for login screen
        />
        {/* Main App after login */}
        <Stack.Screen
          name="Main"
          component={BottomTabNavigator}
          options={{ headerShown: false }} // Hide header for main app
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
// Profile stack navigator to include CreditsDetailsScreen
const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }} // No header for Profile screen
      />
      <Stack.Screen
        name="CreditsDetails"
        component={CreditsDetailsScreen}
        options={{ title: 'Kredittdetaljer' }} // Header title for Credits Details
      />
    </Stack.Navigator>
  );
};
