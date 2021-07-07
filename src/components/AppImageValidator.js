import React from 'react';
import AppIconButton from "./AppIconButton";
import colors from "../utilities/colors";
import {View, StyleSheet} from "react-native";

function AppImageValidator({saveImage, cancelImage}) {
    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            marginHorizontal: 10,
            marginVertical: 10,
            backgroundColor: colors.white
        }}>
            <AppIconButton
                onPress={saveImage}
                containerStyle={styles.buttonContainer}
                iconSize={25}
                iconName='check'/>

            <AppIconButton
                onPress={cancelImage}
                containerStyle={styles.buttonContainer}
                iconSize={25}
                iconColor={colors.rougeBordeau}
                iconName='cancel'/>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer:{
        paddingHorizontal:0,
        height: 40,
        width: 40,
        borderRadius: 20,
        marginRight: 5
    }
})
export default AppImageValidator;