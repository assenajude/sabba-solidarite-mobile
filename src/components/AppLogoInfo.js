import React from 'react';
import {View, Image, StyleSheet} from "react-native";
import AppText from "./AppText";
import defaultStyles from "../utilities/styles";

function AppLogoInfo(props) {
    return (
        <View style={{
            alignItems: 'center'
        }}>
            <Image
                source={require('../../assets/icon.png')}
                style={styles.image}/>
            <View style={{
                position: 'absolute',
                bottom:-10,
                alignSelf: 'center',
                marginTop: 20
            }}>
                <AppText style={styles.slogan}>Ensemble nous sommes plut forts.</AppText>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    image: {
        height: 120,
        width: 120
    },
    slogan:{
        color: defaultStyles.colors.dark
    },
})
export default AppLogoInfo;