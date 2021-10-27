import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import AppTextInput from '../components/AppTextInput'
import DateTimePicker from '@react-native-community/datetimepicker';
import AppBottomSheet from '../components/AppBottomSheet';
import dayjs from 'dayjs';
import _ from 'lodash';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import useCustomReducer from '../reducers/AppointmentReducer';

import appConfig from '../config/appConfig';
import AppButton from '../components/AppButton';

export default function AddAppointment() {
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(null);
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const [state, dispatch] = useCustomReducer();

    const findSelectedAppointment = (currentDate) => {
        const selectedDaysKey = dayjs(currentDate.toISOString()).format('DDMMYYYY').toString();
        if (!_.isEmpty(state?.appointmentData)) {
            const easyMap = _.mapKeys(state?.appointmentData, function (value, key) {
                return value?.easyKey;
            });
            return !_.isEmpty(easyMap[selectedDaysKey]) ? easyMap[selectedDaysKey] : {};
        }
        return null;
    }

    const [selectedAppointment, setSelectedAppointment] = useState(findSelectedAppointment(new Date()));

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDateTimePicker(Platform.OS === 'ios');
        setDate(currentDate);
        setSelectedAppointment(findSelectedAppointment(currentDate));
    };

    const getAppTextInput = (placeholder, icon, value = '', editable) => {
        return <AppTextInput
            editable={editable}
            containerStyle={styles.inputContainerStyle}
            value={value}
            placeholder={placeholder}
            icon={icon} />
    }

    const renderAvailableSlots = () => {
        if (!_.isEmpty(selectedAppointment)) {
            const availableRenderList = selectedAppointment?.availableSlots?.map((slot, index) => (
                <TouchableWithoutFeedback key={`${index}_${slot}`} style={styles.slot} onPress={() => setTime(slot)}>
                    <Text>{slot}</Text>
                </TouchableWithoutFeedback>
            ));
            return <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {availableRenderList}
            </ScrollView>
        }
        return <Text style={{ justifyContent: "center" }}>😱 Oops! No Slots Available.</Text>;
    }

    const renderDateTimePicker = () => {
        const maximumDate = dayjs(new Date()).add(appConfig.BookingHorizon, 'day').toISOString();
        const minimumDate = dayjs(new Date()).toISOString();
        return <>
            <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode='date'
                is24Hour={true}
                display="spinner"
                onChange={onChange}
                maximumDate={maximumDate}
                minimumDate={minimumDate}
                style={{ width: "100%" }}
            />
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                {renderAvailableSlots()}
            </View>
        </>;
    }

    const renderAppBottomSheet = () => {
        return <AppBottomSheet
            containerStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            isVisible={showDateTimePicker}
            setIsVisible={setShowDateTimePicker}
            children={renderDateTimePicker()} />;
    }

    const bookAppointment = () => {
        console.log('sfsf')
        if (time === null) {
            // Show Alert
        }
        const selectedDaysKey = dayjs(date.toISOString()).format('DDMMYYYY').toString();
        if (!_.isEmpty(state?.appointmentData)) {
            const easyMap = _.mapKeys(state?.appointmentData, function (value, key) {
                return value?.easyKey;
            });
            if (!_.isEmpty(easyMap[selectedDaysKey])) {
                const selectedAppointmentData = easyMap[selectedDaysKey];
                const index = selectedAppointmentData.availableSlots.indexOf(time);
                if (index !== -1) selectedAppointmentData?.availableSlots?.splice(index, 1);
                selectedAppointmentData.bookedSlots.push(time);
                selectedAppointmentData.bookedInfo.push({ name: '', phone: '', otherInfo: '' });
                dispatch({ type: 'AddAppointment', payload: state?.appointmentData });
            }
        }
        // Show Alert!
    }

    const formattedDate = dayjs(date.toISOString()).format('MMM DD YYYY');
    const formattedDateTime = `${formattedDate} ${time ? ', ' + time : ''}`;

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback>
                {getAppTextInput("Name", "account")}
                {getAppTextInput("Phone", "phone")}
                <TouchableWithoutFeedback onPress={() => setShowDateTimePicker(true)}>
                    {getAppTextInput("Date and Time", "clock-time-nine", formattedDateTime, false)}
                </TouchableWithoutFeedback>
                {showDateTimePicker && renderAppBottomSheet()}
            </TouchableWithoutFeedback>
            <AppButton containerStyle={{ marginTop: 5 }} onPress={bookAppointment} title="🖊 Book an appointment!" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
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
        marginHorizontal: 5
    },
    slotList: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }
});