import React from 'react';
import {View, StyleSheet} from "react-native";
import defaultStyles from '../utilities/styles'
function AppSwiper({containerStyle,children}) {
    return (
        <View style={[styles.container, containerStyle]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        width: 100,
        backgroundColor: defaultStyles.colors.white
    }
})
export default AppSwiper;