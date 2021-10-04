import React from 'react';
import AppText from "./AppText";
import {View, StyleSheet} from "react-native";
function AppSimpleLabelWithValue({label, labelValue, valueStyle}) {

    return (
        <View style={styles.container}>
            <AppText style={{fontWeight: 'bold'}}>{label}</AppText>
            <View style={{
                justifyContent: 'flex-start',
                width: 170,
            }}>
                <AppText style={valueStyle}>{labelValue}</AppText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
    flexDirection: 'row',
     alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10
}
})
export default AppSimpleLabelWithValue;