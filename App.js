import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './app/Screens/HomeScreen';
import AppointmentsScreen from './app/Screens/AppointmentsScreen';
import colors from './app/config/colors';
import useCustomReducer, { getData } from './app/reducers/AppointmentReducer';
import { isEmpty } from 'lodash';
import { getAppointmentData } from './app/dataModule/appointments';
import appConfig from './app/config/appConfig';

const Stack = createNativeStackNavigator();

const getScreenOptions = (screenName) => {
  const headerOptions = {
    headerShown: true,
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
  const [state, dispatch] = useCustomReducer();
  useEffect(async () => {
    /** 
     * REHYDRATING the data from async storage, to update existing bookings into the App State.
     * 
     * Since we are not stoing the data anywhere in servers as of now. So, this ways we can achieve showing an 
     * existing appointments to the user, even though the user has cleared the app data from the recent history.
     */
    const persistedData = appConfig.allowPersistedData ? await getData() : null;
    if (!isEmpty(persistedData)) {
      const [upcomingAppointments, pastAppointments] = getAppointmentData(persistedData.upcomingAppointments);
      persistedData.upcomingAppointments = upcomingAppointments;
      persistedData.pastAppointments = pastAppointments;
      dispatch({ type: 'REHYDRATE', persistedData });
    }
  }, []);

  return (<NavigationContainer>
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={getScreenOptions("HomeScreen")} />
      <Stack.Screen name="AppointmentsScreen" component={AppointmentsScreen} options={getScreenOptions("AppointmentsScreen")} />
    </Stack.Navigator>
  </NavigationContainer>)
}