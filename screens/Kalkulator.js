import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Kalkulator() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>This is an empty screen.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white', 
    },
    text: {
        fontSize: 20,
        color: '#333', 
    },
});
