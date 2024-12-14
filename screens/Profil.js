import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { auth } from "../data/firebase"; // Import Firebase auth
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native"; // For navigation after logout

const ProfileScreen = () => {
    const navigation = useNavigation(); // Access navigation

    const handleLogout = async () => {
        try {
            await signOut(auth);
            Alert.alert("Logget ut", "Du er nå logget ut.");
            navigation.replace("Auth"); // Navigate back to the login/signup screen
        } catch (error) {
            Alert.alert("Feil", "Noe gikk galt under utlogging.");
            console.error("Error logging out:", error.message);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.headerContainer}>
                <Text style={styles.greeting}>GOD MORGEN, OLA</Text>
                <TouchableOpacity style={styles.profileContainer}>
                    <View style={styles.profileCircle} />
                    <Text style={styles.profileName}>Ola Normann</Text>
                    <Text style={styles.arrow}>{'>'}</Text>
                </TouchableOpacity>
            </View>

            {/* Credits Section */}
            <TouchableOpacity style={styles.creditsContainer} onPress={() => navigation.navigate("CreditsDetails")}>
                <Text style={styles.creditsText}>Kreditter</Text>
            <Text style={styles.creditsAmount}>x kr</Text>
            </TouchableOpacity>


            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logg ut</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    headerContainer: {
        marginBottom: 20,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#5b975b',
        textAlign: 'left',
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    profileCircle: {
        width: 50,
        height: 50,
        backgroundColor: '#5b975b',
        borderRadius: 25,
    },
    profileName: {
        marginLeft: 10,
        fontSize: 16,
        color: '#5b975b',
        fontWeight: 'bold',
    },
    arrow: {
        marginLeft: 'auto',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#5b975b',
    },
    creditsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    creditsText: {
        fontSize: 16,
        color: '#5b975b',
        fontWeight: 'bold',
    },
    creditsAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    logoutButton: {
        marginTop: 30,
        backgroundColor: '#e63946',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProfileScreen;
