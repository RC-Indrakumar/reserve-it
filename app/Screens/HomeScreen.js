import React, { useState } from 'react';
import { ImageBackground, StyleSheet, View, Image } from 'react-native';
import AppBottomSheet from '../components/AppBottomSheet';
import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
import AppTextInput from '../components/AppTextInput';
import colors from '../config/colors'

export default function HomeScreen({ navigation }) {
    const [showOrHideBottomSheet, setShowOrHideBottomSheet] = useState(false);
    const [toggleModalName, setToggleModalName] = useState(null);

    const renderLogoAndTagline = () => {
        return <View style={styles.logoContainer}>
            <Image style={styles.logo} source={require('../assets/logo-red.png')} />
            <AppText style={styles.tagLine} text="📚 Bookings made easy!" />
        </View>
    }

    const renderLoginRegistrationButton = () => {
        const onPressLogin = () => {
            setShowOrHideBottomSheet(true);
            setToggleModalName('Login');
        };
        const onPressRegistration = () => {
            setShowOrHideBottomSheet(true)
            setToggleModalName('Registration')
        };
        return (
            <>
                <View style={styles.loginRegistrationButtonContainer}>
                    <AppButton buttonStyle={styles.loginButtonStyle}
                        containerStyle={styles.buttonContainerStyle}
                        handleOnPress={onPressLogin}
                        title="Login"
                        titleStyle={styles.buttonTitleStyle}
                    />
                    <AppButton
                        buttonStyle={styles.registerButtonStyle}
                        containerStyle={styles.buttonContainerStyle}
                        handleOnPress={onPressRegistration}
                        title="Register"
                        titleStyle={styles.buttonTitleStyle}
                    />
                </View>
            </>);
    }

    const renderLoginModal = () => {
        const onPressSign = () => {
            setShowOrHideBottomSheet(false);
            navigation.navigate('AppointmentsScreen');
        };
        return (<>
            <AppTextInput containerStyle={styles.inputContainerStyle} placeholder="Email" icon="email" ></AppTextInput>
            <AppTextInput containerStyle={styles.inputContainerStyle} isPasswordField placeholder="Password" icon="lock" ></AppTextInput>
            <AppButton containerStyle={{ marginTop: 10 }} handleOnPress={onPressSign} title="Sign In" />
            <AppText style={styles.loginRegisterMessage} text="🎉 Good to see you again!" />
        </>);
    }

    const renderRegistrationModal = () => {
        const onPressRegistration = () => {
            setShowOrHideBottomSheet(false);
            navigation.navigate('AppointmentsScreen');
        };
        return (<>
            <AppTextInput containerStyle={styles.inputContainerStyle} placeholder="Name" icon="account" ></AppTextInput>
            <AppTextInput containerStyle={styles.inputContainerStyle} placeholder="Email" icon="email" ></AppTextInput>
            <AppTextInput containerStyle={styles.inputContainerStyle} isPasswordField placeholder="Password" icon="lock" ></AppTextInput>
            <AppButton containerStyle={{ marginTop: 10 }} handleOnPress={onPressRegistration} title="Sign Up" />
            <AppText style={styles.loginRegisterMessage} text="🙇🏻 Welcome aboard!" />
        </>);
    }

    const renderAppBottomSheet = () => {
        if (!toggleModalName) return null;
        const children = toggleModalName === 'Registration' ? renderRegistrationModal() : renderLoginModal();
        return <AppBottomSheet isVisible={showOrHideBottomSheet} setIsVisible={setShowOrHideBottomSheet} children={children} />;
    }

    return (
        <ImageBackground
            blurRadius={8}
            source={require("../assets/man-smiling-at-mobile.jpeg")}
            style={styles.imageBackground}>
            {renderLogoAndTagline()}
            {renderLoginRegistrationButton()}
            {renderAppBottomSheet()}
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    buttonContainerStyle: {
        marginVertical: 5
    },
    imageBackground: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center"
    },
    inputContainerStyle: {
        backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)'
    },
    loginButtonStyle: {
        backgroundColor: colors.primaryColor,
        color: colors.halfWhite
    },
    logoContainer: {
        alignItems: "center",
        position: "absolute",
        top: 100
    },
    logo: {
        width: 100,
        height: 100
    },
    loginRegistrationButtonContainer: {
        alignSelf: "center",
        marginBottom: 25,
        width: "100%"
    },
    registerButtonStyle: {
        backgroundColor: colors.secondaryColor,
        color: colors.halfWhite,
    },
    tagLine: {
        color: colors.halfWhite,
        fontWeight: "bold",
        fontSize: 20,
        marginVertical: 30
    },
    loginRegisterMessage: {
        alignSelf: "center",
        color: colors.black,
        fontSize: 20,
        marginVertical: 30
    }
});
