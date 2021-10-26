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
            containerStyle={{ ...containerStyle, ...styles.defaultContainerStyle }}>
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
        height: 300,
        padding: 10,
        paddingTop: 40
    },
    defaultContainerStyle: {
        marginBottom: -35
    },
    icon: {
        position: 'absolute',
        top: 10,
        right: 10
    },
})