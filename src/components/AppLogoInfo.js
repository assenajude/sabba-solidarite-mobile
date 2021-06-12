import React from 'react';
import {View, Image, StyleSheet} from "react-native";
import AppText from "./AppText";
import defaultStyles from "../utilities/styles";

function AppLogoInfo(props) {
    return (
        <>
            <Image
                source={require('../../assets/icon.png')}
                style={styles.image}/>
            <View style={{
                position: 'absolute',
                bottom:5,
                alignSelf: 'center'
            }}>
                <AppText style={styles.slogan}>Ensemble nous sommes plut fort.</AppText>
            </View>
        </>
    );
}
const styles = StyleSheet.create({
    image: {
        height: 120,
        width: 120
    },
    slogan:{
        color: defaultStyles.colors.or,
        fontWeight: 'bold'
    },
})
export default AppLogoInfo;