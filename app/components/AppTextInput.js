import React, { useRef } from 'react'
import { StyleSheet, TextInput } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import colors from '../config/colors'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export default function AppTextInput({ placeholder, icon, ...otherProps }) {
    const inputEl = useRef(null);
    return (
        <TouchableWithoutFeedback
            onPress={() => inputEl.current.focus()}
            style={{ ...styles.container, ...otherProps.containerStyle }} >
            {icon && <MaterialCommunityIcons name={icon} size={20} style={styles.icon} color={colors.grey} />}
            <TextInput
                ref={inputEl}
                onChangeText={(text) => { console.log(text) }}
                placeholder={placeholder} {...otherProps}
                secureTextEntry={otherProps.isPasswordField}
                style={styles.text} />
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.black,
        borderRadius: 20,
        marginHorizontal: 10,
        marginVertical: 5,
        padding: 10,
    },
    icon: {
        marginRight: 10
    },
    text: {
        color: colors.grey,
        fontSize: 20
    }
})
