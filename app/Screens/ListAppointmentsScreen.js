import React, { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Platform } from 'react-native';
import dayjs from 'dayjs';
import _ from 'lodash';

import useCustomReducer from '../reducers/AppointmentReducer';
import SegmentedControlTab from 'react-native-segmented-control-ui'
import colors from '../config/colors';

export default function ListAppointmentsScreen({ navigation }) {
    const [refresh, setRefresh] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [state, dispatch] = useCustomReducer();

    /** Trick to reload the screen once, when it get focused - Starts */
    useFocusEffect(useCallback(() => {
        !refresh && setRefresh(true);
    }, []));

    const unsubscribe = navigation.addListener('blur', () => {
        setRefresh(false)
    });

    useEffect(() => () => unsubscribe(), []);
    /** Trick - Ends */

    const keyExtractor = (item, index) => `list-item-${index}`;

    const getAppointments = () => {
        const upcomingAppointments = [];
        const pastAppointments = [];
        const appointmentData = state.appointmentData;
        let totalAppointments = [];
        if (!_.isEmpty(appointmentData)) {
            Object.keys(appointmentData)?.forEach((key) => totalAppointments.push(...appointmentData[key].bookedInfo));
            totalAppointments?.forEach(appointment => {
                dayjs(appointment?.dateAndTime).isAfter(new Date())
                    ? upcomingAppointments.push(appointment)
                    : pastAppointments.push(appointment)
            })

        }
        return { upcomingAppointments, pastAppointments, totalAppointments };
    }

    const renderEmptyListMessage = () => (<View style={styles.noAppointmentsMessage}>
        <Text>{`👀 No ${selectedIndex === 0 ? 'Upcoming' : 'Past'} Appointments`}</Text>
    </View>);

    const renderCard = (item) => {
        const date = dayjs(item.dateAndTime).format('ddd, MMM DD');
        const time = dayjs(item.dateAndTime).format('HH:mm');
        const backgroundColor = selectedIndex === 0 ? styles.tileUpcomingBackground : styles.tilePastBackground;
        return (
            <View style={[styles.tile, backgroundColor]}>
                <Text style={styles.tileText}>{`Name\t: ${item.name}`}</Text>
                <Text style={styles.tileText}>{`Phone\t: ${item.phone}`}</Text>
                <Text style={styles.tileText}>{`Date\t: ${date}`}</Text>
                <Text style={styles.tileText}>{`Time\t: ${time}`}</Text>
            </View>
        );
    }

    const { upcomingAppointments, pastAppointments, totalAppointments } = getAppointments();
    const segmentedData = selectedIndex === 0 ? upcomingAppointments : pastAppointments;

    const renderAppointmentsList = () => {
        const flatListStyle = [{ flexGrow: 1 }, totalAppointments.length ? null : { justifyContent: 'space-between' }];
        return (
            segmentedData.length ?
                <FlatList
                    contentContainerStyle={flatListStyle}
                    keyExtractor={keyExtractor}
                    data={segmentedData}
                    renderItem={({ item }) => renderCard(item)}
                    ListEmptyComponent={renderEmptyListMessage()}
                    initialNumToRender={5}
                /> : renderEmptyListMessage())
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <SegmentedControlTab values={[`Upcoming (${upcomingAppointments.length})`, `Expired (${pastAppointments.length})`]}
                allowFontScaling={false}
                selectedIndex={selectedIndex}
                onTabPress={(index) => setSelectedIndex(index)}
                tabsContainerStyle={styles.tabsContainer}
                tabStyle={styles.tabStyle}
                activeTabStyle={selectedIndex === 0 ? styles.activeTabStyleUpcoming : styles.activeTabStylePast}
                tabTextStyle={styles.tabTextStyle}
            />
            {renderAppointmentsList()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    tileUpcomingBackground: {
        backgroundColor: 'rgba(174, 189, 56, 0.4)'
    },
    tilePastBackground: {
        backgroundColor: 'rgba(189, 69, 56, 0.2)'
    },
    tile: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "center",
        height: 130,
        width: "100%",
        padding: 10,
        borderColor: colors.grey,
        borderRadius: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        marginVertical: 5
    },
    tileText: {
        marginVertical: 5
    },
    noAppointmentsMessage: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    mainContainer: {
        flex: 1,
        marginHorizontal: 10,
        padding: 10,
        marginTop: Platform.OS === "android" ? 50 : 0,
    },
    tabsContainer: {
        marginVertical: 5,
        height: 40,
        borderColor: colors.primaryColor
    },
    tabStyle: {
        backgroundColor: colors.primaryColor,
        borderLeftColor: 'transparent',
    },
    activeTabStyleUpcoming: {
        backgroundColor: 'rgba(174, 189, 56, 1)'
    },
    activeTabStylePast: {
        backgroundColor: 'rgba(189, 69, 56, 1)'
    },
    tabTextStyle: {
        color: colors.grey
    }
})