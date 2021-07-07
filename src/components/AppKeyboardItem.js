import React from 'react';
import AppText from "./AppText";
import {TouchableWithoutFeedback, StyleSheet, View} from "react-native";
import defaultStyles from "../utilities/styles";

function AppKeyboardItem({keyValue, onPress}) {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.container}>
            <AppText style={styles.numberStyle}>{keyValue}</AppText>
        </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        width: 60,
        marginHorizontal: 20,
        backgroundColor: defaultStyles.colors.rougeBordeau,

    },
    numberStyle: {
        color: defaultStyles.colors.white,
        fontWeight: 'bold',
        fontSize: 20
    }
})
export default AppKeyboardItem;