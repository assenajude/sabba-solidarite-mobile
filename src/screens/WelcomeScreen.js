import React, {useEffect, useState} from 'react';
import {View, ImageBackground, StyleSheet, Alert} from "react-native";
import AppButton from "../components/AppButton";
import routes from "../navigation/routes";
import AppText from "../components/AppText";
import colors from "../utilities/colors";
import AppActivityIndicator from "../components/AppActivityIndicator";

function WelcomeScreen({navigation}) {

    const [imageLoading, setImageLoading] = useState(true)
    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            Alert.alert(
                'Alert?',
                "Etes-vous sûr de quitter l'application?",
                [
                    { text: "Non", style: 'cancel', onPress: () => {} },
                    {
                        text: 'Quitter',
                        style: 'destructive',
                        onPress: () => navigation.dispatch(e.data.action),
                    },
                ]
            );
        })
        return unsubscribe
    }, [navigation])

    return (
        <View style={{
            flex: 1
        }}>
        <ImageBackground
            onLoadEnd={() => setImageLoading(false)}
            style={styles.container} source={require('../../assets/backImage.png')}>
        </ImageBackground>
            <View
                style={styles.buttons}>
                <AppButton
                    iconName='lock-open-outline'
                    style={{backgroundColor: colors.bleuFbi}}
                    onPress={() => navigation.navigate(routes.LOGIN)}
                    title='Se connecter'
                />

                <AppButton
                    iconName='email'
                    labelStyle={{color: colors.dark}}
                    onPress={() => navigation.navigate(routes.REGISTER)}
                    style={{
                        marginVertical: 10,
                        marginTop: 20,
                        backgroundColor: colors.or
                    }}
                    title='Creer un compte'
                />
            </View>
            <AppText
                style={{
                    color: colors.bleuFbi,
                    position: 'absolute',
                    alignSelf: 'center',
                    top:10
                }}
                onPress={() => navigation.navigate(routes.CGU)}>Conditions Générales d'utilisation</AppText>
            <AppActivityIndicator visible={imageLoading}/>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    buttons: {
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        width: '80%',
        marginHorizontal: 20,
        marginVertical: 10
    }
})

export default WelcomeScreen;