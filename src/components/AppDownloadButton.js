import React, {useState} from 'react';
import AppIconButton from "./AppIconButton";
import {StyleSheet, ToastAndroid, Alert} from "react-native";
import * as FileSystem from "expo-file-system";
import AppUploadModal from "./AppUploadModal";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from 'expo-sharing'

function AppDownloadButton({label, url}) {


    const [progress, setProgress] = useState(0)
    const [uploadModal, setUploadModal] = useState(false)

    let fileTypeArray
    let fileType
    const isValidUrl = url !== "" && url !== undefined && url !== null
    if(isValidUrl) {
     fileTypeArray = url.split('.')
      fileType = fileTypeArray.pop()

    }
    const saveFileToLocalMedia = async(file_uri) => {
        try {
            const {granted} = await MediaLibrary.requestPermissionsAsync();
            if (granted) {
                const asset = await MediaLibrary.createAssetAsync(file_uri);
                const album = await MediaLibrary.getAlbumAsync('Download');
                if (album === null || Object.keys(album).length === 0) {
                    await MediaLibrary.createAlbumAsync('Download', asset);
                } else {
                    await MediaLibrary.addAssetsToAlbumAsync([asset], album.id);
                }
            } else {
                return alert("Vous devez accepter toutes les permissions.")
            }
            alert(`Le fichier a été téléchargé et enregistré sur votre appareil. son nom est: _${label}`)
        } catch (error) {
            Alert.alert("Alert", "Nous n'avons pas pu enregister le fichier.", [{
                text: "Essayer encore", onPress: async () => {
                    const result = await Sharing.isAvailableAsync()
                    if(result) {
                        await Sharing.shareAsync(file_uri)
                    }
                }
            }, {text: "Retour", onPress: () => {return;}}])
        }
    }

    const downloadFile = async () => {
        if(!isValidUrl) {
            return alert("Aucun document telechargeable trouvé.")
        }

        setProgress(0)
        setUploadModal(true)

        const callback = downloadProgress => {
            const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
            setProgress(progress)
        };

        const downloadResumable = FileSystem.createDownloadResumable(
            url,
            FileSystem.documentDirectory + `${label}_.${fileType}`,
            {},
            callback
        );

        try {

            const { uri} = await downloadResumable.downloadAsync();
            await saveFileToLocalMedia(uri)
            ToastAndroid.showWithGravity("Télécharger terminé",
                ToastAndroid.LONG, ToastAndroid.CENTER
            );
            setUploadModal(false)
        } catch (e) {
            setUploadModal(false)
            throw new Error(e)
        }

    }

    return (
        <>
        <AppIconButton
            onPress={downloadFile}
            containerStyle={styles.icon}
            iconSize={24}
            iconName='download-outline'
        />
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
export default AppDownloadButton;