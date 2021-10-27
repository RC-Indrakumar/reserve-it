import { useReducer } from 'react';
import { getAppointmentData } from '../dataModule/appointments';

const initialState = {
    appointmentData: getAppointmentData()
};

function reducer(state, action) {
    switch (action.type) {
        case 'AddAppointment':
            return action.payload;
        case 'decrement':
            return { count: state.count - 1 };
        default:
            throw new Error();
    }
}

export default function useCustomReducer() {
    return useReducer(reducer, initialState);
}