import React from 'react'
import { View, StyleSheet } from 'react-native'
import { BottomSheet } from 'react-native-elements'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import colors from '../config/colors';
import AppButton from './AppButton';

export default function AppBottomSheet(props) {
    const { isVisible, containerStyle, setIsVisible, children } = props;
    return (
        <BottomSheet isVisible={isVisible}
            containerStyle={{ ...styles.defaultContainerStyle, ...containerStyle }}>
            <View style={styles.childrenContainer}>
                <MaterialCommunityIcons
                    color={colors.grey}
                    name={'close'}
                    onPress={() => setIsVisible(false)}
                    size={25}
                    style={styles.icon} />
                {children}
            </View>
        </BottomSheet>
    )
}

const styles = StyleSheet.create({
    childrenContainer: {
        backgroundColor: colors.halfWhite,
        height: 350,
        padding: 10,
        paddingTop: 40
    },
    defaultContainerStyle: {
        marginBottom: -35,
        backgroundColor: 'rgba(0, 0, 0, 0)'
    },
    icon: {
        position: 'absolute',
        top: 10,
        right: 10
    },
})