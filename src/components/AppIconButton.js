import React from 'react';
import defaultStyles from "../utilities/styles";
import {TouchableOpacity, View, StyleSheet} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";

function AppIconButton({onPress, iconName, iconSize=30, iconColor=defaultStyles.colors.bleuFbi, containerStyle}) {
    return (
        <View style={[styles.container, containerStyle]}>
            <TouchableOpacity onPress={onPress}>
                <MaterialCommunityIcons name={iconName} size={iconSize} color={iconColor} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        paddingHorizontal: 15,
        backgroundColor: defaultStyles.colors.white
    }
})
export default AppIconButton;