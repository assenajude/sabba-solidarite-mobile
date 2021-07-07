import React from 'react';
import {TouchableWithoutFeedback, View, StyleSheet} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import defaultStyles from "../utilities/styles"
import AppKeyboardItem from "./AppKeyboardItem";

function AppKeyboard({pressKey1,pressKey2,pressKey3,pressKey4,pressKey5,pressKey6,
                         pressKey7,pressKey8,pressKey9,pressKey0, deleteFocused}) {
    return (
        <View>
        <View style={styles.numberContainer}>
            <AppKeyboardItem keyValue={1} onPress={pressKey1}/>
            <AppKeyboardItem keyValue={2} onPress={pressKey2}/>
            <AppKeyboardItem keyValue={3} onPress={pressKey3}/>
        </View>
            <View style={styles.numberContainer}>
                <AppKeyboardItem keyValue={4} onPress={pressKey4}/>
                <AppKeyboardItem keyValue={5} onPress={pressKey5}/>
                <AppKeyboardItem keyValue={6} onPress={pressKey6}/>
            </View>
            <View style={styles.numberContainer}>
                <AppKeyboardItem keyValue={7} onPress={pressKey7}/>
                <AppKeyboardItem keyValue={8} onPress={pressKey8}/>
                <AppKeyboardItem keyValue={9} onPress={pressKey9}/>
            </View>
                <View style={[styles.numberContainer, {justifyContent: 'center'}]}>
                    <AppKeyboardItem keyValue={0} onPress={pressKey0}/>
                </View>
            <View style={{
                position: 'absolute',
                right: 50,
                bottom: 30
            }}>
                <TouchableWithoutFeedback onPress={deleteFocused}>
                    <MaterialCommunityIcons name="arrow-left-box" size={40} color={defaultStyles.colors.rougeBordeau} />
                </TouchableWithoutFeedback>
            </View>


        </View>
    );
}

const styles = StyleSheet.create({
    numberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 10
    },
    numberStyle: {
        borderWidth: 0.5,
        padding: 20,
        marginHorizontal: 20,
        backgroundColor: defaultStyles.colors.rougeBordeau,
        color: defaultStyles.colors.white,
        fontWeight: 'bold',
        fontSize: 20
    }
})
export default AppKeyboard;