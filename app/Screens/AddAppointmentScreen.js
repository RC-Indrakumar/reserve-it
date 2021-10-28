import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from 'react-native'
import AppTextInput from '../components/AppTextInput'
import DateTimePicker from '@react-native-community/datetimepicker';
import AppBottomSheet from '../components/AppBottomSheet';
import dayjs from 'dayjs';
import _ from 'lodash';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import useCustomReducer from '../reducers/AppointmentReducer';

import appConfig from '../config/appConfig';
import AppButton from '../components/AppButton';
import RNDateTimePicker from '@react-native-community/datetimepicker';

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
        setShowDateTimePicker(Platform.OS === 'ios');
        setDate(currentDate);
        setSelectedDate(currentDate);
    };

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

    const findSelectedAppointment = (currentDate) => {
        const selectedDaysKey = dayjs(currentDate.toISOString()).format('DDMMYYYY').toString();
        if (!_.isEmpty(state?.appointmentData)) {
            const easyMap = _.mapKeys(state?.appointmentData, function (value, key) {
                return value?.easyKey;
            });
            return !_.isEmpty(easyMap[selectedDaysKey]) ? _.cloneDeep(easyMap[selectedDaysKey]) : {};
        }
        return null;
    }

    const renderAvailableSlots = () => {
        const selectedAppointment = findSelectedAppointment(selectedDate);
        if (!_.isEmpty(selectedAppointment)) {
            const availableRenderList = selectedAppointment?.availableSlots?.map((slot, index) => (
                <TouchableWithoutFeedback key={`${index}_${slot}`} style={styles.slot} onPress={() => setSlot(slot)}>
                    <Text>{slot}</Text>
                </TouchableWithoutFeedback>
            ));
            return <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {availableRenderList}
            </ScrollView>
        }
        return <Text style={{ justifyContent: "center" }}>😱 Oops! No Slots Available.</Text>;
    }

    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    };

    const renderDateTimePicker = () => {
        const maximumDate = Platform.OS === "ios" ? dayjs(new Date()).add(appConfig.BookingHorizon - 1, 'day').toISOString() : new Date().addDays(appConfig.BookingHorizon - 1);
        const minimumDate = Platform.OS === "ios" ? dayjs(new Date()).toISOString() : new Date();

        const props = {
            value: date,
            mode: 'date',
            is24Hour: true,
            display: Platform.OS === "ios" ? "spinner" : "calendar",
            onChange,
            maximumDate,
            minimumDate,
            ...Platform.OS === "ios" ? { style: { width: "100%" } } : {}
        }

        return <>
            {Platform.OS === "android" ? <RNDateTimePicker {...props} /> : <DateTimePicker {...props} />}
            {Platform.OS === "ios" && <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                {renderAvailableSlots()}
            </View>}
        </>;
    }

    const renderAppBottomSheet = () => {
        return (Platform.OS === "ios"
            ? <AppBottomSheet
                containerStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                isVisible={showDateTimePicker}
                setIsVisible={setShowDateTimePicker}
                children={renderDateTimePicker()} />
            : renderDateTimePicker());
    }

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
            return showAlert('😯 Oops', '⚠️ Name, Phone, or DateTime is missing. Please try again!');
        }
        const selectedDaysKey = dayjs(date.toISOString()).format('DDMMYYYY').toString();
        if (!_.isEmpty(state?.appointmentData)) {
            const easyMap = _.mapKeys(state?.appointmentData, value => value?.easyKey);
            if (!_.isEmpty(easyMap[selectedDaysKey])) {
                const selectedAppointmentData = _.cloneDeep(easyMap[selectedDaysKey]);
                const bookedSlotIndex = selectedAppointmentData.availableSlots.indexOf(slot);
                if (bookedSlotIndex !== -1) selectedAppointmentData?.availableSlots?.splice(bookedSlotIndex, 1);
                selectedAppointmentData.bookedSlots.push(slot);
                const dateAndTime = getDateAndTime(date, slot).toISOString();
                selectedAppointmentData.bookedInfo.push({ name, phone, dateAndTime });
                const payload = {}
                payload[selectedAppointmentData.actualKey] = selectedAppointmentData;
                dispatch({ type: 'ADD_APPOINTMENT', payload });
                resetForm();
            }
            return;
        }
        return showAlert('😯 Oops', '⚠️ Something went really wrong. Please try again!');
    }

    const formattedDate = dayjs(date.toISOString()).format('MMM DD YYYY');
    const formattedDateTime = `${formattedDate} ${slot ? ', ' + slot : ''}`;

    return (
        <View style={styles.container}>
            <View>
                {getAppTextInput("Name", "account", (text) => { setName(text) }, name, { maxLength: 24 })}
                {getAppTextInput("Phone", "phone", (text) => { setPhone(text) }, phone.replace(/[^0-9]/g, ''), { keyboardType: 'phone-pad', maxLength: 10 })}
                <TouchableWithoutFeedback onPress={() => setShowDateTimePicker(true)}>
                    <View pointerEvents="none">
                        {getAppTextInput("Date and Time", "clock-time-nine", null, formattedDateTime, { editable: false })}
                    </View>
                </TouchableWithoutFeedback>
                {Platform.OS === "android" && <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 10 }}>
                    {renderAvailableSlots()}
                </View>}
                {showDateTimePicker && renderAppBottomSheet()}
            </View>
            <AppButton containerStyle={{ marginTop: 5, width: "100%" }} onPress={bookAppointment} title="🖊 Book an appointment!" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        ...Platform.OS === "android" && {
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
        ...Platform.OS === "android" && { marginTop: 10 }
    },
    slotList: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }
});