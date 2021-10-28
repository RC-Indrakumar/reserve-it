import { useReducer } from 'react';
import { isEmpty } from 'lodash';
import { getAppointmentData } from '../dataModule/appointments';
import AsyncStorage from '@react-native-async-storage/async-storage';
import appConfig from '../config/appConfig';

const initialState = {
    appointmentData: getAppointmentData()
};

const storeData = async (value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(appConfig.StorageKey, jsonValue);
    } catch (e) {
        console.error('Async Storage Error Saving Value.');
    }
};

storeData(initialState);

const getData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(appConfig.StorageKey);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error('Async Storage Error Reading Value.');
    }
}

async function reducer(state = initialState, action) {
    switch (action.type) {
        case 'REHYDRATE': {
            const prevData = await getData();
            !isEmpty(prevData) && (state = prevData);
            break;
        }
        case 'ADD_APPOINTMENT': {
            state.appointmentData = { ...state.appointmentData, ...action.payload };
            break;
        }
    }
    storeData(state);
    return state;
}

export default function useCustomReducer() {
    return useReducer(reducer, initialState);
}