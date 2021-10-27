import React, { useRef } from 'react'
import { StyleSheet, TextInput, View, Keyboard } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import colors from '../config/colors'

export default function AppTextInput(props) {
    const { editable, value, containerStyle, icon, isPasswordField, placeholder } = props;
    const inputEl = useRef(null);
    const handleOnSubmitEditing = () => {
        Keyboard.dismiss();
    }
    return (
        <View
            style={{ ...styles.container, ...containerStyle }} >
            {icon && <MaterialCommunityIcons name={icon} size={20} style={styles.icon} color={colors.grey} />}
            <TextInput
                editable={editable}
                value={value}
                onChangeText={(text) => { console.log(text) }}
                onSubmitEditing={handleOnSubmitEditing}
                placeholder={placeholder}
                secureTextEntry={isPasswordField}
                ref={inputEl}
                style={styles.text} />
        </View>
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
        padding: 10
    },
    icon: {
        marginRight: 10
    },
    text: {
        color: colors.grey,
        fontSize: 20,
        width: "100%"
    }
})
