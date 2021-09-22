import React from 'react';
import defaultStyles from "../utilities/styles";
import {TouchableOpacity, View, StyleSheet} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";

function AppIconButton({onPress, iconName, iconSize=24, iconColor=defaultStyles.colors.bleuFbi, containerStyle}) {
    return (
            <TouchableOpacity style={[styles.container, containerStyle]} onPress={onPress}>
                <MaterialCommunityIcons name={iconName} size={iconSize} color={iconColor} />
            </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        paddingHorizontal: 15,
        backgroundColor: defaultStyles.colors.white
    }
})
export default AppIconButton;