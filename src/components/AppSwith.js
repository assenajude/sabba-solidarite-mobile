import React from 'react';
import {View, Switch, StyleSheet} from "react-native";
import AppText from "./AppText";

function AppSwith({isEnabled, toggleSwitch, label}) {
    return (
        <View style={styles.container}>
            <AppText>{label}</AppText>
            <Switch
                trackColor={{false: "#767577", true: "#2d3d86" }}
                thumbColor={isEnabled ? "#efd807" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                value={isEnabled}
                onValueChange={toggleSwitch}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20
    }
});
export default AppSwith;