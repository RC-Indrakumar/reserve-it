import dayjs from "dayjs";
import _ from 'lodash';

import appConfig from "../config/appConfig";

const getAppointments = (forDays = 3, fromDate = new Date()) => {
    const generateSlots = (startHour = 10, totalHours = 9, format = 24) => {
        let slots = [];
        let hourString = '';
        totalHours = startHour + totalHours;
        for (let index = startHour; index <= totalHours; index++) {
            startHour = format === 12
                ? startHour > 12 ? 1 : startHour
                : startHour === 24 ? 0 : startHour;
            hourString = String(startHour).length < 2 ? `0${startHour}` : startHour;
            slots = slots.concat(`${hourString}:00`);
            slots = slots.concat(`${hourString}:30`);
            startHour++;
        }
        return slots;
    }


    const generateInitialData = () => {
        let currentDate = fromDate;
        const slotsToReturn = {};
        for (let day = 1; day <= forDays; day++) {
            slotsToReturn[day] = {
                actualKey: day,
                easyKey: dayjs(currentDate).format('DDMMYYYY'),
                date: dayjs(currentDate).toISOString(),
                availableSlots: generateSlots(),
                bookedSlots: [],
                bookedInfo: []
            }
            currentDate = dayjs(currentDate).add(1, 'day');
        }
        return slotsToReturn;
    }

    return generateInitialData();

};

const checkIsPastDate = (date) => {
    return dayjs(date).isBefore(dayjs(new Date().toISOString()));
}

const refreshAppointments = (appointments = {}) => {
    const appointmentKeys = Object.keys(appointments)?.sort((a, b) => a - b);
    appointmentKeys?.forEach((key) => {
        if (checkIsPastDate(appointments[key].date)) delete appointments[key]
    });

    if (appointmentKeys.length < appConfig.BookingHorizon) {
        const dayDifference = appConfig.BookingHorizon - appointmentKeys.length;
        const keyOfMaxDate = appointmentKeys[appointmentKeys.length - 1];
        const addDaysFrom = keyOfMaxDate ? appointments[keyOfMaxDate].date : null;
        const numberOfDaysToGenerate = appointmentKeys.length + dayDifference;
        return getAppointments(numberOfDaysToGenerate, addDaysFrom);
    }

    return appointments;
}

export const getAppointmentData = (data) => {
    return _.isEmpty(data) ? getAppointments(appConfig.BookingHorizon) : refreshAppointments(data);
}

export const bookAppointment = (selectedSlot, totalSlot) => {
    if (_.isEmpty(selectedSlot) || _.isEmpty(totalSlot)) return null;
    
}