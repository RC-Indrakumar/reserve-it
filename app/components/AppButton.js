import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'

import colors from '../config/colors'

export default function AppButton(props) {
    const { buttonStyle, containerStyle, title, titleStyle, onPress = () => { } } = props;
    return (
        <Button
            buttonStyle={[styles.buttonStyle, buttonStyle]}
            containerStyle={containerStyle}
            onPress={onPress}
            title={title}
            titleStyle={titleStyle}></Button>
    )
}

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: colors.primaryColor,
        marginHorizontal: 10,
        height: 50,
        borderRadius: 50,
    }
})
