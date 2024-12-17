import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { auth } from "../data/firebase";
import { useNavigation } from '@react-navigation/native';


export default function Kalkulator() { 
    const [stats, setStats] = useState({ bottles: 0, glasses: 0 });
    const [orders, setOrders] = useState([]);
    const [pantoCash, setPantoCash] = useState(0); 
    const navigation = useNavigation();
 
    useEffect(() => { // Hent brukerens statistikk og tidligere bestillinger
        const fetchStats = async () => {
            const db = getDatabase(); // Hent database
            const currentUser = auth.currentUser; // Hent gjeldende bruker

            if (!currentUser) { 
                Alert.alert("Feil", "Ingen bruker funnet.");
                return;
            }

            // Hent brukerens statistikk
            const userStatsRef = ref(db, `stats/${currentUser.uid}`);
            onValue(userStatsRef, (snapshot) => {
                const data = snapshot.val();
                const bottles = data?.bottles || 0;
                const glasses = data?.glasses || 0;

                setStats({ bottles, glasses });

                // Kalkuler PantoCash
                const totalPantoCash = bottles * 1 + glasses * 0.5;
                setPantoCash(totalPantoCash);
            });

            // Hent tidligere bestillinger
            const ordersRef = ref(db, `orders/${currentUser.uid}`);
            onValue(ordersRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const orderList = Object.values(data);
                    setOrders(orderList);
                }
            });
        };

        fetchStats();
    }, []);

    const totalItems = stats.bottles + stats.glasses; // Totalt antall pantede enheter
    const co2Saved = totalItems * 0.1; // CO₂ spart per enhet
    const energySaved = totalItems * 2; // Energi spart per enhet
    const phonesCharged = Math.round(energySaved / 5); // Antall mobiltelefoner ladet
    const ledHours = Math.round(energySaved / 10);//   

    return (
        <ScrollView contentContainerStyle={styles.container}>

            
            {/* Totalt statistikk */}
            <View style={styles.statsContainer}>
                <Text style={styles.statText}>Totalt pantede flasker: {stats.bottles}</Text>
                <Text style={styles.statText}>Totalt pantede glass: {stats.glasses}</Text>
                <Text style={styles.statText}>Totalt pantet: {totalItems} enheter</Text>
                <Text style={styles.pantoCashText}>Din PantoCash: {pantoCash} poeng</Text>
            </View>

            {/* Miljøbesparelser */}
            <View style={styles.environmentContainer}>
                <Text style={styles.environmentTextBold}>
                    Du har spart omtrent {co2Saved.toFixed(1)} kg CO₂!
                </Text>
                <Text style={styles.environmentTextBold}>
                    Energi spart: {energySaved} watt timer
                </Text>
            </View>

            <View style={styles.infoRow}>
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>Det tilsvarer å lade {phonesCharged} mobiltelefoner!</Text>
                </View>
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>Eller å drive en LED-lampe i {ledHours} timer!</Text>
                </View>
            </View>

            {/* Naviger til "Bruk PantoCash"-siden */}
            <TouchableOpacity
                style={styles.navigateButton}
                onPress={() => navigation.navigate('CreditsDetails')} // Naviger til CreditsDetailsScreen
            >
                <Text style={styles.navigateButtonText}>Bruk og tjen i PantoShop!</Text>
            </TouchableOpacity>

            {/* Tidligere bestillinger */}
            {orders.map((order, index) => (
                <View key={index} style={styles.orderContainer}>
                    <Text style={styles.orderDate}>{order.date}</Text>
                    <Text style={styles.orderDetails}>
                        Antall pantede flasker: {order.bottles || 0}
                    </Text>
                    <Text style={styles.orderDetails}>
                        Antall pantede glass: {order.glasses || 0}
                    </Text>
                    <Text style={styles.orderDetailsSmall}>
                        Spart CO₂: {(order.bottles + order.glasses) * 0.1} kg
                    </Text>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "white",
    },
   
    statsContainer: {
        marginBottom: 20,
    },
    statText: {
        fontSize: 18,
        color: "#333",
        marginBottom: 8,
    },
    pantoCashText: {
        fontSize: 18,
        color: "#4A8C4B",
        fontWeight: "bold",
    },
    environmentContainer: {
        backgroundColor: "#eaf5e3",
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    environmentTextBold: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#333",
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    infoBox: {
        flex: 1,
        backgroundColor: "#5b975b",
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 5,
    },
    infoText: {
        color: "white",
        textAlign: "center",
        fontSize: 14,
        fontWeight: "bold",
    },
    navigateButton: {
        backgroundColor: "#56d141",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 20,
    },
    navigateButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    orderContainer: {
        backgroundColor: "#f2fbe9",
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    orderDate: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    orderDetails: {
        fontSize: 14,
        color: "#555",
    },
    orderDetailsSmall: {
        fontSize: 12,
        color: "#9c9c9c",
    },
});

