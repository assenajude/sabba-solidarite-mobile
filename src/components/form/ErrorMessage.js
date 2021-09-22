import React from 'react';
import {StyleSheet} from "react-native"
import AppText from "../AppText";
import colors from "../../utilities/colors";


function ErrorMessage({visible, error}) {
    if(!visible || !error) return null
    return (
        <AppText style={styles.error}>{error}</AppText>
    );
}

const styles = StyleSheet.create({
    error: {
        color: 'red',
        backgroundColor: colors.white,
        padding: 5
    }
})
export default ErrorMessage;