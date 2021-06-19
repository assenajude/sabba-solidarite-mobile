import React, {useState} from 'react';
import AppIconButton from "./AppIconButton";
import {StyleSheet, ToastAndroid} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import {getReglementUpdate} from "../store/slices/associationSlice";
import useUploadImage from "../hooks/useUploadImage";
import {useDispatch, useStore} from "react-redux";
import AppUploadModal from "./AppUploadModal";

function AppUploadButton({association}) {
    const {dataTransformer, directUpload} = useUploadImage()
    const store = useStore()
    const dispatch = useDispatch()

    const [progress, setProgress] = useState(0)
    const [uploadModal, setUploadModal] = useState(false)

    const getFileAndUploadIt = async () => {
        try {
            const {type, uri, name} = await DocumentPicker.getDocumentAsync()
            if(type === 'success') {
                const content = await FileSystem.readAsStringAsync(uri, {encoding:'base64'})
                const fileObject =  {name, url: uri}
                const newArray = []
                newArray.push(fileObject)
                const transformResutl = dataTransformer(newArray)
                const imageArray = [{url: uri, imageData: content}]
                setProgress(0)
                setUploadModal(true)

                const result = await directUpload(transformResutl, imageArray, progress => {
                    setProgress(progress)
                })
                setUploadModal(false)

                if(result) {
                    const signedArray = store.getState().uploadImage.signedRequestArray
                    const reglementUrl = signedArray[0].url
                    const data = {
                        associationId: association.id,
                        reglementUrl,
                    }
                    await dispatch(getReglementUpdate(data))
                    const error = store.getState().entities.association.error
                    if(error !== null) {
                        ToastAndroid.showWithGravity("Impossible de faire la mise à jour.",
                            ToastAndroid.LONG, ToastAndroid.CENTER
                        )
                        return;
                    }
                    ToastAndroid.showWithGravity("Mise à jour effectuée avec succès.",
                        ToastAndroid.LONG, ToastAndroid.CENTER
                    )
                }
            }
        } catch (e) {
            throw new Error(e)
        }
    }

    return (
        <>
        <AppIconButton
            containerStyle={styles.icon}
            iconSize={24}
            iconName='upload-outline'
            onPress={getFileAndUploadIt}/>
            <AppUploadModal progress={progress} uploadModalVisible={uploadModal} closeModal={() => setUploadModal(false)}/>
        </>
    );
}

const styles = StyleSheet.create({
    icon: {
        height: 40,
        width: 40,
        borderRadius: 20,
        paddingHorizontal: 0
    }
})
export default AppUploadButton;