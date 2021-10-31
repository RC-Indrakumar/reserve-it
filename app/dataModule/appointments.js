import dayjs from "dayjs";
import { isEmpty } from 'lodash';

import appConfig from "../config/appConfig";

/**
 * Method to generate appointments for the given number of days. Passing second param will generate the data
 * from that date to number of days given.
 * For Example: Taking, given for days as 1 and given date as Oct, 1 2021. Method will result us back with the
 * templated appointment data for Oct, 1 2021.
 * @param {*} forDays
 * @param {*} fromDate 
 * @returns {Object}
 */
const getAppointments = (forDays = 3, fromDate = new Date()) => {

    /**
     * Method to generate the slots with the intervel of 30 minutes. Provided starting hour of the day, total hours of working, and the time format with which
     * the slots to be generated.
     * For Example: Provided with the values startHour as 12, and working as 2, with the timeFormat 24. Method will result
     * us back with the slots [12:00, 12:30, 13:00, 13:30, 14:00, 14:30, 15:00, 15:30]
     * @param {*} startHour 
     * @param {*} totalHours 
     * @param {*} format 
     * @returns {Array}
     */
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

    /**
     * Method to generate the appointment template for the configurations set up from appConfig.
     * { dailyStartHour, totalWorkingHours, slotFormat: 24 }
     * @returns {Object}
     */
    const generateInitialData = () => {
        let currentDate = fromDate;
        const daySlotsToReturn = {};
        for (let day = 1; day <= forDays; day++) {
            daySlotsToReturn[day] = {
                actualKey: day,
                easyKey: dayjs(currentDate).format('DDMMYYYY'),
                date: dayjs(currentDate).toISOString(),
                availableSlots: generateSlots(appConfig.dailyStartHour, appConfig.totalWorkingHours, appConfig.slotFormat),
                bookedSlots: [],
                bookedInfo: []
            }
            currentDate = dayjs(currentDate).add(1, 'day');
        }
        return daySlotsToReturn;
    }

    return generateInitialData();
};

/**
 * Checks, is provided date is past of current date.
 * @param {*} date 
 * @returns {Boolean}
 */
const checkIsPastDate = (date) => {
    return dayjs(date).isBefore(dayjs(new Date().toISOString()), 'date');
}

/**
 * Method to refresh the appointments. This will split of the past bookings separate by comparing current date with
 * previous appointment dates.
 * @param {*} appointments 
 * @returns {Object}
 */
const refreshAppointments = (appointments = {}) => {
    let appointmentKeys = Object.keys(appointments)?.sort((a, b) => a - b);
    const deletedAppointments = {}
    appointmentKeys?.forEach((key) => {
        if (checkIsPastDate(appointments[key].date)) {
            deletedAppointments[key] = appointments[key];
            delete appointments[key];
        }
    });
    const updatedAppointmentKeys = Object.keys(appointments);
    if (appointmentKeys.length !== updatedAppointmentKeys.length)
        appointmentKeys = updatedAppointmentKeys?.sort((a, b) => a - b);

    if (appointmentKeys.length < appConfig.bookingHorizon) {
        const dayDifference = appConfig.bookingHorizon - appointmentKeys.length;
        const keyOfMaxDate = appointmentKeys[appointmentKeys.length - 1];
        const addDaysFrom = keyOfMaxDate ? appointments[keyOfMaxDate].date : null;
        const numberOfDaysToGenerate = appointmentKeys.length + dayDifference;
        return [getAppointments(numberOfDaysToGenerate, addDaysFrom), deletedAppointments];
    }

    return [appointments, deletedAppointments];
}

export const getAppointmentData = (data) => {
    return isEmpty(data) ? [getAppointments(appConfig.bookingHorizon), {}] : refreshAppointments(data);
}