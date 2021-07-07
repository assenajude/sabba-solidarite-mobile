import React from 'react';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import defaultStyles from "../utilities/styles";
import {View, StyleSheet} from "react-native";

function AppCodeInput({isValid}) {
    return (
        <View style={[styles.container]}>
            {!isValid && <MaterialCommunityIcons name="circle-outline" size={20} color={defaultStyles.colors.grey} />}
            {isValid && <MaterialCommunityIcons name="circle" size={20} color={defaultStyles.colors.or} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 30,
        width: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 20,
        marginBottom: 10
    }
})
export default AppCodeInput;