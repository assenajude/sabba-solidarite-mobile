import React from 'react';
import {View, TextInput, StyleSheet} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import defaultStyles from '../utilities/styles'

function AppTextInput({icon,width='100%', style, ...otherProps}) {
    return (
            <View style={[styles.container, {width: width}]}>
            {icon && <MaterialCommunityIcons name={icon} size={24} color='grey'/>}
               <TextInput style={[defaultStyles.text,styles.inputStyle]} {...otherProps}/>
            </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderWidth: 0.2,
        alignItems: 'center',
        borderRadius: 25,
        marginVertical: 10
    },
    inputStyle: {
        padding: 5,
        width: '90%',
    }
})

export default AppTextInput;