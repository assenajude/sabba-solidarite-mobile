import React from 'react';
import {View, ImageBackground, StyleSheet} from "react-native";
import AppButton from "../components/AppButton";
import routes from "../navigation/routes";
import AppHeaderGradient from "../components/AppHeaderGradient";

function WelcomeScreen({navigation}) {
    return (
        <>
            <AppHeaderGradient/>
        <ImageBackground blurRadius={1} style={styles.container} source={require('../../assets/solidariteImg.jpg')}>
            <View style={styles.buttonStyle}>
                <AppButton title='Se connecter' onPress={() => navigation.navigate(routes.LOGIN)}/>
                <AppButton color1='#FFA500' color2='#ff7f00' color3='#efd807'
                           title='Créer un compte' onPress={() => navigation.navigate(routes.REGISTER)}/>
            </View>
        </ImageBackground>
    </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    buttonStyle: {
        padding: 20,
        paddingBottom: 5
    }
})

export default WelcomeScreen;