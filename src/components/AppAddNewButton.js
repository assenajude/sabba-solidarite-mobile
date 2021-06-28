import React from 'react';
import {View, TouchableWithoutFeedback, StyleSheet} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'

import defaultStyles from '../utilities/styles'
import AppText from "./AppText";

function AppAddNewButton({onPress, name="plus-circle-outline", compter, compterStyle, buttonContainerStyle}) {
    return (
            <View>
            <TouchableWithoutFeedback onPress={onPress}>
                <View elevation={10} style={[styles.buttonContainer, buttonContainerStyle]}>
                    <MaterialCommunityIcons name={name} size={30} color={defaultStyles.colors.white} />
                </View>
            </TouchableWithoutFeedback>
               {compter > 0 ? <View style={[styles.compter, compterStyle]}>
                    <AppText style={{color: defaultStyles.colors.white}}>{compter}</AppText>
                </View>: null}
            </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        height: 50,
        width: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: defaultStyles.colors.bleuFbi
    },
    compter: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        height: 20,
        right: -10,
        top: -5,
        width: 20,
        borderRadius: 10,
        backgroundColor: defaultStyles.colors.rougeBordeau
    }
})
export default AppAddNewButton;