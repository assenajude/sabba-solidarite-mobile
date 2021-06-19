import React from 'react';
import * as ImagePicker from 'expo-image-picker'
import AppCamera from "./AppCamera";

function AppImagePicker({onSelectImage, cameraStyle, cameraContainer, iconSize}) {

    const selectImage = async () => {
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if(status !== 'granted') {
            return alert('Vous devez accepter pour continuer')
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 0.5,
            base64: true
        })
        if(result.cancelled) {
            return;
        }
        onSelectImage({url: result.uri, imageData: result.base64})

    }

    return (
        <AppCamera iconSize={iconSize} cameraContainer={cameraContainer} cameraStyle={cameraStyle} onPress={selectImage}/>
    );
}


export default AppImagePicker;