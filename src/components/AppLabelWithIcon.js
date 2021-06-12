import React from 'react';
import {View, StyleSheet} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import defaultStyles from '../utilities/styles'
import AppText from "./AppText";

function AppLabelWithIcon({icon, label}) {
    return (
        <View style={styles.container}>
            <MaterialCommunityIcons
                name={icon}
                color={defaultStyles.colors.white}
                size={30}
            />
            <AppText style={{marginLeft: 10, color: defaultStyles.colors.white}}>{label}</AppText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})
export default AppLabelWithIcon;