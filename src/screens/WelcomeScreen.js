import React, {useEffect} from 'react';
import {View, ImageBackground, StyleSheet, Alert, BackHandler} from "react-native";
import AppButton from "../components/AppButton";
import routes from "../navigation/routes";
import AppHeaderGradient from "../components/AppHeaderGradient";

function WelcomeScreen({navigation}) {

    useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
            // Prevent default behavior of leaving the screen
            e.preventDefault();

            // Prompt the user before leaving the screen
            Alert.alert(
                'Discard changes?',
                'You have unsaved changes. Are you sure to discard them and leave the screen?',
                [
                    { text: "Don't leave", style: 'cancel', onPress: () => {} },
                    {
                        text: 'Discard',
                        style: 'destructive',
                        // If the user confirmed, then we dispatch the action we blocked earlier
                        // This will continue the action that had triggered the removal of the screen
                        onPress: () => navigation.dispatch(e.data.action),
                    },
                ]
            );
        })
    }, [])

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