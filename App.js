import React, { useState } from 'react';
import { ImageBackground, StyleSheet, View, Image } from 'react-native';
import AppBottomSheet from './app/components/AppBottomSheet';
import AppButton from './app/components/AppButton';
import AppText from './app/components/AppText';
import AppTextInput from './app/components/AppTextInput';
import colors from './app/config/colors'

export default function App() {
  const [showOrHideBottomSheet, setShowOrHideBottomSheet] = useState(false);
  const [toggleModalName, setToggleModalName] = useState(null);

  const renderLogoAndTagline = () => {
    return <View style={styles.logoContainer}>
      <Image style={styles.logo} source={require('./app/assets/logo-red.png')} />
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
        <AppButton buttonStyle={styles.loginButtonStyle}
          containerStyle={styles.buttonContainerStyle}
          onPress={onPressLogin}
          title="Login"
          titleStyle={styles.buttonTitleStyle}
        />
        <AppButton
          buttonStyle={styles.registerButtonStyle}
          containerStyle={styles.buttonContainerStyle}
          onPress={onPressRegistration}
          title="Register"
          titleStyle={styles.buttonTitleStyle}
        />
      </>);
  }

  const renderLoginModal = () => {
    return (<>
      <AppTextInput containerStyle={styles.inputContainerStyle} placeholder="Email" icon="email" ></AppTextInput>
      <AppTextInput containerStyle={styles.inputContainerStyle} isPasswordField placeholder="Password" icon="lock" ></AppTextInput>
      <AppButton containerStyle={{ marginTop: 10 }} onPress={() => setShowOrHideBottomSheet(false)} title="🙇🏻 Welcome aboard!" />
    </>);
  }

  const renderRegistrationModal = () => {
    return (<>
      <AppTextInput containerStyle={styles.inputContainerStyle} placeholder="Name" icon="account" ></AppTextInput>
      <AppTextInput containerStyle={styles.inputContainerStyle} placeholder="Email" icon="email" ></AppTextInput>
      <AppTextInput containerStyle={styles.inputContainerStyle} isPasswordField placeholder="Password" icon="lock" ></AppTextInput>
      <AppButton containerStyle={{ marginTop: 10 }} onPress={() => setShowOrHideBottomSheet(false)} title="👋🏼 See you again!" />
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
      source={require("./app/assets/man-smiling-at-mobile.jpeg")}
      style={styles.imageBackground}>
      {renderLogoAndTagline()}
      {renderLoginRegistrationButton()}
      {renderAppBottomSheet()}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  buttonContainerStyle: {
    width: "90%",
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
  registerButtonStyle: {
    backgroundColor: colors.secondaryColor,
    color: colors.halfWhite,
    marginBottom: 25
  },
  tagLine: {
    color: colors.halfWhite,
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 30
  }
});
