import React from 'react';
import {View, TouchableWithoutFeedback, StyleSheet} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'

import defaultStyles from '../utilities/styles'
import AppText from "./AppText";

function AppAddNewButton({onPress, name="plus-circle-outline", compter, compterStyle}) {
    return (
            <View>
            <TouchableWithoutFeedback onPress={onPress}>
                <View elevation={10} style={styles.buttonContainer}>
                    <MaterialCommunityIcons name={name} size={40} color={defaultStyles.colors.white} />
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
        height: 60,
        width: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: defaultStyles.colors.rougeBordeau
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
        backgroundColor: defaultStyles.colors.bleuFbi
    }
})
export default AppAddNewButton;