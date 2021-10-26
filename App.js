import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './app/Screens/HomeScreen';
import AppointmentsScreen from './app/Screens/AppointmentsScreen';
import colors from './app/config/colors';

const Stack = createNativeStackNavigator();

const getScreenOptions = (screenName) => {
  const headerOptions = {
    headerStyle: {
      backgroundColor: colors.secondaryColor,
    },
    headerTintColor: colors.halfWhite,
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };
  switch (screenName) {
    case "AppointmentsScreen":
      headerOptions.headerShown = false;
      return headerOptions;
    default:
      return headerOptions;
  }
}

export default function App() {
  return (<NavigationContainer>
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={getScreenOptions("HomeScreen")} />
      <Stack.Screen name="AppointmentsScreen" component={AppointmentsScreen} options={getScreenOptions("AppointmentsScreen")} />
    </Stack.Navigator>
  </NavigationContainer>)
}