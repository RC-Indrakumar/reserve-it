import { isEmpty, mapKeys, cloneDeep } from 'lodash';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import appConfig from '../config/appConfig';
import AppButton from '../components/AppButton';
import AppTextInput from '../components/AppTextInput'
import AppBottomSheet from '../components/AppBottomSheet';
import useCustomReducer from '../reducers/AppointmentReducer';

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

const platform = Platform.OS;

export default function AddAppointment() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('')
    const [date, setDate] = useState(new Date());
    const [slot, setSlot] = useState(null);
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [state, dispatch] = useCustomReducer();

    const resetForm = () => {
        setName('');
        setPhone('');
        setSlot(null);
    }

    useEffect(() => {
        return () => {
            setSelectedDate(new Date());
            resetForm();
        }
    }, []);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDateTimePicker(platform === 'ios');
        setDate(currentDate);
        setSelectedDate(currentDate);
    };

    const showAlert = (title = 'No Title', message = 'No Message') => {
        Alert.alert(title,
            message,
            [{ text: 'OK', onPress: () => { } }]
        );
    }

    const getDateAndTime = (date, slot) => {
        const splittedHourAndTime = slot.split(':');
        return dayjs(date).hour(splittedHourAndTime[0]).minute(splittedHourAndTime[1]);
    }

    const bookAppointment = () => {
        if (slot === null || !name || !phone) {
            return showAlert('😯 Oops', 'Name, Phone, or DateTime value is missing. Please try again!');
        }
        const selectedDaysKey = dayjs(date.toISOString()).format('DDMMYYYY').toString();
        if (!isEmpty(state?.upcomingAppointments)) {
            const easyMap = mapKeys(state?.upcomingAppointments, value => value?.easyKey);
            if (!isEmpty(easyMap[selectedDaysKey])) {
                const selectedAppointmentData = cloneDeep(easyMap[selectedDaysKey]);
                const bookedSlotIndex = selectedAppointmentData.availableSlots.indexOf(slot);
                if (bookedSlotIndex !== -1) selectedAppointmentData?.availableSlots?.splice(bookedSlotIndex, 1);
                selectedAppointmentData.bookedSlots.push(slot);
                const dateAndTime = getDateAndTime(date, slot).toISOString();
                selectedAppointmentData.bookedInfo.push({ name, phone, dateAndTime });
                const payload = {}
                payload[selectedAppointmentData.actualKey] = selectedAppointmentData;
                dispatch({ type: 'UPDATE_APPOINTMENT', payload });
                resetForm();
            }
            return;
        }
        return showAlert('😯 Oops', '⚠️ Something went really wrong. Please try again!');
    }

    const findSelectedAppointment = (currentDate) => {
        const selectedDaysKey = dayjs(currentDate.toISOString()).format('DDMMYYYY').toString();
        if (!isEmpty(state?.upcomingAppointments)) {
            const easyMap = mapKeys(state?.upcomingAppointments, function (value, key) {
                return value?.easyKey;
            });
            return !isEmpty(easyMap[selectedDaysKey]) ? cloneDeep(easyMap[selectedDaysKey]) : {};
        }
        return null;
    }

    const checkIsUpcomingSlot = (slot = "00:00") => {
        const splittedHourAndTime = slot?.split(':');
        return dayjs(selectedDate.toISOString())
            .set('hour', Number(splittedHourAndTime[0]))
            .set('minute', Number(splittedHourAndTime[1]))
            .subtract(appConfig.canBookBefore_InMinutes, 'minutes') // Users can book an appointment at least 5 mins before the slot begins
            .isAfter(new Date());
    }

    const renderAvailableSlots = () => {
        const selectedAppointment = findSelectedAppointment(selectedDate);
        if (!isEmpty(selectedAppointment)) {
            const availableRenderList = selectedAppointment?.availableSlots?.map((slot = "00:00", index) => (
                checkIsUpcomingSlot(slot) && <TouchableWithoutFeedback key={`${index}_${slot}`} style={styles.slot} onPress={() => setSlot(slot)}>
                    <Text>{slot}</Text>
                </TouchableWithoutFeedback>
            )).filter(value => value);
            if (availableRenderList.length)
                return <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {availableRenderList}
                </ScrollView>
        }
        return <Text style={{ justifyContent: "center" }}>😱 Oops! No Slots Available.</Text>;
    }

    const getDateTimePicker = () => {
        const maximumDate = platform === "ios"
            ? dayjs(new Date()).add(appConfig.bookingHorizon - 1, 'day').toISOString()
            : new Date().addDays(appConfig.bookingHorizon - 1);
        const minimumDate = platform === "ios"
            ? dayjs(new Date()).toISOString()
            : new Date();

        const props = {
            value: date,
            mode: 'date',
            is24Hour: true,
            display: platform === "ios" ? "spinner" : "default",
            onChange,
            maximumDate,
            minimumDate,
            ...platform === "ios" ? { style: { width: "100%" } } : {}
        }

        return platform === "android"
            ? <RNDateTimePicker {...props} />
            : <>
                <DateTimePicker {...props} />
                <View style={styles.slotList}>{renderAvailableSlots()}</View>
            </>
    }

    const renderDateTimePicker = () => {
        return (platform === "ios"
            ? <AppBottomSheet
                containerStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                isVisible={showDateTimePicker}
                setIsVisible={setShowDateTimePicker}
                children={getDateTimePicker()} />
            : getDateTimePicker());
    }

    const renderAndroidSlotPicker = () => (<View style={[styles.slotList, { paddingHorizontal: 10 }]}>
        {renderAvailableSlots()}
    </View>);

    const getAppTextInput = (placeholder, icon, onChange, value = '', otherProps) => {
        return <AppTextInput
            onChange={onChange}
            containerStyle={styles.inputContainerStyle}
            value={value}
            placeholder={placeholder}
            icon={icon}
            otherProps={otherProps}
        />
    }

    const formattedDate = dayjs(date.toISOString()).format('MMM DD YYYY');
    const formattedDateTime = `${formattedDate}${slot ? ', ' + slot : ''}`;

    const getDateTimeInput = () => (
        <TouchableWithoutFeedback onPress={() => setShowDateTimePicker(true)}>
            <View pointerEvents="none">
                {getAppTextInput("Date and Time", "clock-time-nine", null, formattedDateTime, { editable: false })}
            </View>
        </TouchableWithoutFeedback>);

    return (
        <View style={styles.container}>
            <View>
                {getAppTextInput("Name", "account", (text) => { setName(text) }, name, { maxLength: 24 })}
                {getAppTextInput("Phone", "phone", (text) => { setPhone(text) }, phone.replace(/[^0-9]/g, ''), { keyboardType: 'phone-pad', maxLength: 10 })}
                {getDateTimeInput()}
                {showDateTimePicker && renderDateTimePicker()}
                {platform === "android" && renderAndroidSlotPicker()}
            </View>
            <AppButton containerStyle={{ marginTop: 5, width: "100%" }} handleOnPress={bookAppointment} title="🖊 Book an appointment!" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        ...platform === "android" && {
            top: 270,
            maxHeight: 250
        }
    },
    inputContainerStyle: {
        backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)',
        marginHorizontal: 10
    },
    slot: {
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 5,
        justifyContent: "center",
        height: 30,
        width: 60,
        marginHorizontal: 5,
        ...platform === "android" && { marginTop: 10 }
    },
    slotList: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }
});