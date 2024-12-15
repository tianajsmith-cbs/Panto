import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { cityCoordinates } from '../data/const'; // Importer bykoordinater

{/* Skjermbilde for kart med pantestasjoner */} 
export default function PantestasjonMapScreen() {
    const selectedCity = "Oslo"; // Erstatt dette med dynamisk ruting hvis nødvendig
    const country = selectedCity
        ? Object.keys(cityCoordinates).find((key) =>
              cityCoordinates[key].hasOwnProperty(selectedCity)
          )
        : null;

    const coordinates = country
        ? cityCoordinates[country][selectedCity]
        : { latitude: 0, longitude: 0 };

    // Funksjon for å generere tilfeldige pins rundt et senter
    const generateRandomPins = (center, numberOfPins) => {
        const pins = [];
        const radius = 0.01; // Juster radius for pin-distribusjon

        for (let i = 0; i < numberOfPins; i++) {
            const randomLat = center.latitude + (Math.random() - 0.5) * radius;
            const randomLng = center.longitude + (Math.random() - 0.5) * radius;
            pins.push({ latitude: randomLat, longitude: randomLng });
        }

        return pins;
    };

    const randomPins = generateRandomPins(coordinates, 5);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>PANTO</Text>
                <Text style={styles.subHeaderText}>
                    Finn din nærmeste pantestasjon
                </Text>
            </View>

            {/* Kart */}
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: coordinates.latitude,
                    longitude: coordinates.longitude,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                }}
            >
                <Marker coordinate={coordinates} title={selectedCity} />
                {randomPins.map((pin, index) => (
                    <Marker
                        key={index}
                        coordinate={pin}
                        title={`Pantemaskin ${index + 1}`}
                        pinColor="blue"
                    />
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: 'white',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#5b975b',
    },
    subHeaderText: {
        fontSize: 16,
        color: 'black',
    },
    map: {
        flex: 1,
        width: '100%',
    },
});

