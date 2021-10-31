import React, { useRef } from 'react'
import { StyleSheet, TextInput, View, Keyboard } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import colors from '../config/colors'

export default function AppTextInput(props) {
    const { value, onChange = (text) => { console.log(text) }, containerStyle, icon, isPasswordField, placeholder, otherProps = {} } = props;
    const inputEl = useRef(null);
    const handleOnSubmitEditing = () => {
        Keyboard.dismiss();
    }
    return (
        <View
            style={{ ...styles.container, ...containerStyle }} >
            {icon && <MaterialCommunityIcons name={icon} size={20} style={styles.icon} color={colors.grey} />}
            <TextInput
                value={value}
                onChangeText={onChange}
                onSubmitEditing={handleOnSubmitEditing}
                placeholder={placeholder}
                secureTextEntry={isPasswordField}
                ref={inputEl}
                style={styles.text}
                {...otherProps}
            />
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
        width: "90%"
    }
})
