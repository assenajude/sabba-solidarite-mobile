import React, {useEffect, useState} from 'react';
import {View, ImageBackground, StyleSheet, Alert} from "react-native";
import AppButton from "../components/AppButton";
import routes from "../navigation/routes";
import AppText from "../components/AppText";
import colors from "../utilities/colors";
import {useDispatch} from "react-redux";
import {getWelcomeImageState} from "../store/slices/authSlice";
import AppActivityIndicator from "../components/AppActivityIndicator";

function WelcomeScreen({navigation}) {

    const dispatch = useDispatch()
    const [imageLoading, setImageLoading] = useState(true)
    useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
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
    }, [navigation])

    return (
        <View style={{
            flex: 1
        }}>
        <ImageBackground
            onLoadEnd={() => setImageLoading(false)}
            style={styles.container} source={require('../../assets/backImage.png')}>

            <View style={styles.buttonStyle}>
                <AppButton title='Se connecter' onPress={() => navigation.navigate(routes.LOGIN)}/>
                <AppButton color1='#FFA500' color2='#ff7f00' color3='#efd807'
                           title='Créer un compte' onPress={() => navigation.navigate(routes.REGISTER)}/>
            </View>
        </ImageBackground>
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
    buttonStyle: {
        padding: 20,
        paddingBottom: 5
    }
})

export default WelcomeScreen;