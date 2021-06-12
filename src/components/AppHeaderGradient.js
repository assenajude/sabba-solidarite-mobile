import React from 'react';
import {View, StyleSheet} from "react-native";
import {LinearGradient} from "expo-linear-gradient";

function AppHeaderGradient(props) {
    return (
        <View>
            <LinearGradient
                colors={['#860432', 'transparent']}
                style={styles.background}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    background: {
        height: 30,
        width: '100%',
    }
})
export default AppHeaderGradient;