import React from 'react';
import AppText from "../AppText";
import {View, StyleSheet} from "react-native";
import defaultStyles from "../../utilities/styles";

function SubInfo({value, label}) {

    return (
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <AppText style={{fontSize: 15}}>{label}</AppText>
            <View style={styles.cotisation}>
                <AppText style={{fontWeight: 'bold', fontSize: 15}}>{value}</AppText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cotisation: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: defaultStyles.colors.white,
        height: 50,
        width: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: defaultStyles.colors.or
    },
})
export default SubInfo;