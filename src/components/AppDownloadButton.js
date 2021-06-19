import React, {useState} from 'react';
import AppIconButton from "./AppIconButton";
import {StyleSheet, ToastAndroid} from "react-native";
import * as FileSystem from "expo-file-system";
import AppUploadModal from "./AppUploadModal";
import * as MediaLibrary from "expo-media-library";

function AppDownloadButton({association}) {


    const [progress, setProgress] = useState(0)
    const [uploadModal, setUploadModal] = useState(false)

    let fileTypeArray
    let fileType
    if(association.reglementInterieur && association.reglementInterieur !== null) {
     fileTypeArray = association.reglementInterieur.split('.')
      fileType = fileTypeArray.pop()

    }
    const saveFileToLocalMedia = async(file_uri) => {
        try {
            const {granted} = await MediaLibrary.requestPermissionsAsync();
            if (granted) {
                const asset = await MediaLibrary.createAssetAsync(file_uri);
                const album = await MediaLibrary.getAlbumAsync('Download');
                if (album === null || Object.keys(album).length === 0) {
                    const result = await MediaLibrary.createAlbumAsync('Download', asset, false);
                } else {
                    await MediaLibrary.addAssetsToAlbumAsync([asset], album.id, false);
                }
            } else {
                return alert("Vous devez accepter toutes les permissions.")
            }
            alert(`Le fichier a été téléchargé et enregistré sur votre appareil. son nom est: ${association.nom}Reglement.${fileType}`)
        } catch (error) {
            alert("Une erreur est survenue lors de l'enregistrement du fichier sur votre appareil. Veuillez reessayer plutard.");
            throw new Error(error);
        }
    }

    const downloadFile = async () => {
        if(!association.reglementInterieur || association.reglementInterieur === '') {
            return alert("Aucun texte de reglementation pour cette association.")
        }

        setProgress(0)
        setUploadModal(true)

        const callback = downloadProgress => {
            const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
            setProgress(progress)
        };

        const downloadResumable = FileSystem.createDownloadResumable(
            association.reglementInterieur,
            FileSystem.documentDirectory + `${association.nom}Reglement.${fileType}`,
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