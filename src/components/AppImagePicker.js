import React, {useState} from 'react';
import * as ImagePicker from 'expo-image-picker'
import AppCamera from "./AppCamera";
import {Modal, View} from "react-native";
import defaultStyles from '../utilities/styles'
import AppText from "./AppText";
import AppIconButton from "./AppIconButton";

function AppImagePicker({onSelectImage, cameraStyle, cameraContainer, iconSize}) {

    const [changeImage, setChangeImage] = useState(false)

    const selectImage = async () => {
        try {
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
            setChangeImage(false)
        } catch (e) {
            throw new Error(e)
        }
    }

    const takePhoto = async () => {
        try {
            const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync()
            if(status !== 'granted') {
                return alert('Vous devez accepter pour continuer')
            }
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                quality: 0.5,
                base64: true
            })
            if(result.cancelled) {
                return;
            }
            onSelectImage({url: result.uri, imageData: result.base64})
            setChangeImage(false)
        } catch (e) {
            throw new Error(e)
        }
    }

    return (
        <>
        <AppCamera iconSize={iconSize} cameraContainer={cameraContainer} cameraStyle={cameraStyle} onPress={() => setChangeImage(true)}/>
            <Modal visible={changeImage} transparent>
                <View style={{
                    backgroundColor:  defaultStyles.colors.white,
                    height: 300,
                    width: '100%',
                    top: '70%'
                }}>
                    <AppIconButton
                        onPress={() => setChangeImage(false)}
                        containerStyle={{
                            alignSelf: 'flex-end',
                            marginVertical: 10
                        }}
                        iconColor={defaultStyles.colors.rougeBordeau}
                        iconName='close'
                    />
                    <View style={{
                        alignItems: 'center'
                    }}>
                        <AppText
                            onPress={takePhoto}
                            style={{
                                color: defaultStyles.colors.bleuFbi,
                                marginVertical: 10
                            }}>Prendre une photo</AppText>

                        <AppText
                            onPress={selectImage}
                            style={{
                                color: defaultStyles.colors.bleuFbi,
                                marginVertical: 10
                            }}>choisir une image</AppText>
                    </View>
                </View>
            </Modal>
        </>
    );
}


export default AppImagePicker;