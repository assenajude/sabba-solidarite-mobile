import React from 'react';
import {View, StyleSheet} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import AppText from "../AppText";
import useManageAssociation from "../../hooks/useManageAssociation";

function FondsLabel({icon="credit-card-multiple",iconColor='black', label, value, labelStyle, valueStyle}) {
    const {formatFonds} = useManageAssociation()
    return (
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={styles.secondFonds}>
                <MaterialCommunityIcons name={icon} size={24} color={iconColor} />
                <AppText style={[styles.fondsText, labelStyle]}>{label}</AppText>
            </View>
            <AppText style={[styles.fondsText, valueStyle]}>{formatFonds(value)}</AppText>
        </View>
    );
}

const styles = StyleSheet.create({
    fondsText: {
        fontSize: 15,
        margin : 5
    },
    secondFonds: {
        flexDirection: 'row',
    }
})
export default FondsLabel;