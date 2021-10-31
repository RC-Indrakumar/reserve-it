import { useReducer } from 'react';
import { isEmpty } from 'lodash';
import { getAppointmentData } from '../dataModule/appointments';
import AsyncStorage from '@react-native-async-storage/async-storage';
import appConfig from '../config/appConfig';

let initialState = {
    upcomingAppointments: getAppointmentData()?.[0] || [],
    pastAppointments: {}
};

const storeData = async (value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(appConfig.storageKey, jsonValue);
    } catch (e) {
        console.error('Async Storage Error Saving Value.');
    }
};

export const getData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(appConfig.storageKey);
        return jsonValue != null ? Promise.resolve(JSON.parse(jsonValue)) : Promise.resolve(null);
    } catch (e) {
        console.error('Async Storage Error Reading Value.');
    }
}

function reducer(state = initialState, action) {
    switch (action.type) {
        case 'REHYDRATE': {
            if (!isEmpty(action.persistedData) && appConfig.allowPersistedData) { 
                state = action.persistedData;
                initialState = state;
            }
            break;
        }
        case 'UPDATE_APPOINTMENT':
        case 'ADD_APPOINTMENT': {
            state.upcomingAppointments = { ...state.upcomingAppointments, ...action.payload };
            break;
        }
    }
    storeData(state);
    return state;
}

export default function useCustomReducer() {
    return useReducer(reducer, initialState);
}