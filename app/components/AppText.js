import React from 'react'
import { StyleSheet, Text } from 'react-native'

export default function AppText({ text, style }) {
    return <Text style={[styles.textStyle, style]}>{text}</Text>
}

const styles = StyleSheet.create({
    textStyle: {
        color: "#fff",
        fontSize: 20,
        marginVertical: 15
    }
})
