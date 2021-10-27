import React from 'react'
import { View, Text } from 'react-native'

export default function MyAccountScreen({ mainScreenP2P }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>My Profile!</Text>
            <Text onPress={() => mainScreenP2P()} style={{ marginTop: 10, color: 'dodgerblue' }}>👋🏼 See you again!</Text>
        </View>
    );
}