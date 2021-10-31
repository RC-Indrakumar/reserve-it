import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function MyAccountScreen({ mainScreenP2P }) {
    return (
        <View style={styles.container}>
            <Text>My Profile!</Text>
            <Text onPress={() => mainScreenP2P()}
                style={styles.logoutText}>
                👋🏼 See you again!
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoutText: {
        marginTop: 10,
        color: 'dodgerblue'
    }
})