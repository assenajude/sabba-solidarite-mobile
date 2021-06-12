import React from 'react';
import {Text, StyleSheet} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import defaultStyles from '../utilities/styles'

function GradientButton({title,onPress, iconSize=24, iconColor=defaultStyles.colors.white, iconName, otherProps}) {
    return (
        <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.button}>

            {iconName && <MaterialCommunityIcons name={iconName} size={iconSize} color={iconColor}/>}
            <Text style={styles.text} onPress={onPress} {...otherProps}>{title}</Text>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    text: {
    color: defaultStyles.colors.white,
        fontSize: 20,
        marginLeft: 10
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        alignItems: 'center',
        marginHorizontal: 20,
        borderRadius: 20
    }
})
export default GradientButton;
