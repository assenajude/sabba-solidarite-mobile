import React from 'react';
import {View, StyleSheet} from "react-native";
import AppText from "./AppText";
import ListItemSeparator from "./ListItemSeparator";

function AppLabelWithValue({label, value, showLimit=true}) {
    return (
        <View>
            <View style={styles.detailContainer}>
                <AppText style={{fontWeight: 'bold'}}>{label}</AppText>
            </View>
            <View style={{
                alignItems: 'center'
            }}>
                <AppText>{value}</AppText>
            </View>
            {showLimit && <ListItemSeparator/>}
        </View>
    );
}

const styles = StyleSheet.create({
    detailContainer: {
        flexDirection: 'row',
        paddingVertical: 15,
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },
})

export default AppLabelWithValue;