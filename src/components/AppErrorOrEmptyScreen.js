import React from 'react';
import {View, StyleSheet} from "react-native";
import AppText from "./AppText";

function AppErrorOrEmptyScreen({message}) {
    return (
        <View style={styles.container}>
            <AppText>{message}</AppText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
export default AppErrorOrEmptyScreen;