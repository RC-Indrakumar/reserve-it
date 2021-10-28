import { useReducer } from 'react';
import { getAppointmentData } from '../dataModule/appointments';

const initialState = {
    appointmentData: getAppointmentData()
};

function reducer(state = initialState, action) {
    switch (action.type) {
        case 'AddAppointment':
            state.appointmentData = { ...state.appointmentData, ...action.payload }
            return state;
        case 'decrement':
            return { count: state.count - 1 };
        default:
            throw new Error();
    }
}

export default function useCustomReducer() {
    return useReducer(reducer, initialState);
}