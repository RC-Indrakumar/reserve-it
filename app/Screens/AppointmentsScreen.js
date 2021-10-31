import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import colors from '../config/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AddAppointment from './AddAppointmentScreen';
import ListAppointmentsScreen from './ListAppointmentsScreen';
import MyAccountScreen from './MyAccountScreen';

const Tab = createMaterialBottomTabNavigator();
const getTabBarIcon = (focused, iconName) => {
    return <MaterialCommunityIcons name={iconName} color={focused ? colors.secondaryColor : colors.halfWhite} size={25} />;
}

const getScreenOptions = (screenName) => {
    const screenOptions = {};
    switch (screenName) {
        case "Appointments":
            screenOptions.title = "Appointments";
            screenOptions.tabBarLabel = "Appointments";
            screenOptions.tabBarIcon = ({ focused }) => getTabBarIcon(focused, "calendar");
            return screenOptions;
        case "AddAppointment":
            screenOptions.tabBarLabel = "AddAppointment";
            screenOptions.tabBarIcon = ({ focused }) => getTabBarIcon(focused, "plus-circle-outline");
            return screenOptions;
        case "MyAccount":
            screenOptions.tabBarLabel = "MyAccount";
            screenOptions.tabBarIcon = ({ focused }) => getTabBarIcon(focused, "account");
            return screenOptions;
        default:
            return screenOptions;
    }
}


export default function AppointmentsScreen({ navigation }) {
    const TabNavigatorProps = {
        activeColor: colors.secondaryColor,
        backBehavior: "none",
        barStyle: styles.bottomBarStyle,
        inactiveColor: colors.halfWhite,
        initialRouteName: "Appointments",
        shifting: true
    };
    return (
        <Tab.Navigator {...TabNavigatorProps} >
            <Tab.Screen name="Appointments" component={ListAppointmentsScreen} options={getScreenOptions("Appointments")} />
            <Tab.Screen name="AddAppointment" component={AddAppointment} options={getScreenOptions("AddAppointment")} />
            <Tab.Screen name="MyAccount" options={getScreenOptions("MyAccount")}>
                {props => <MyAccountScreen {...props} mainScreenP2P={navigation.popToTop} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    bottomBarStyle: {
        backgroundColor: colors.primaryColor
    }
});