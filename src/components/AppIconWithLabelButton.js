import React from 'react';
import {TouchableWithoutFeedback, View, StyleSheet} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import defaultStyles from "../utilities/styles";
import AppText from "./AppText";

function AppIconWithLabelButton({onPress, iconColor='black',
                                    iconName='account', iconSize=24,
                                    buttonContainerStyle, labelStyle, label}) {
    return (
        <TouchableWithoutFeedback
            onPress={onPress}>
            <View style={[styles.container, buttonContainerStyle]}>
                <MaterialCommunityIcons name={iconName} size={iconSize} color={iconColor} />
                <AppText style={[{color: defaultStyles.colors.bleuFbi, marginHorizontal: 5}, labelStyle]}>{label}</AppText>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})
export default AppIconWithLabelButton;