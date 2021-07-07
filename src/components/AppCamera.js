import React from 'react';
import {TouchableOpacity, View, StyleSheet} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import defaultStyles from "../utilities/styles";
import AppImageValidator from "./AppImageValidator";

function AppCamera({cameraStyle,cameraContainer, iconSize=30, onImageEditing=false,onPress, saveImage, cancelImage}) {

    if(onImageEditing) {
        return <AppImageValidator saveImage={saveImage} cancelImage={cancelImage}/>
    }
    return (
        <View style={cameraContainer}>
        <TouchableOpacity onPress={onPress}>
            <View  style={[styles.avatarCamera, cameraStyle]}>
                <MaterialCommunityIcons  name="camera" size={iconSize} color="black" />
            </View>
        </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    avatarCamera: {
        height: 50,
        width: 50,
        borderRadius: 10,
        marginTop: 20,
        padding: 10,
        backgroundColor: defaultStyles.colors.white
    },
})

export default AppCamera;