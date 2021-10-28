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
        return jsonValue != null ? Promise.resolve(JSON.parse(jsonValue)) : Promise.resolve(null);
    } catch (e) {
        console.error('Async Storage Error Reading Value.');
    }
}

function reducer(state = initialState, action) {
    switch (action.type) {
        case 'REHYDRATE': {
            getData()?.then((value) => {
                !isEmpty(value) && (state = value);
            });
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