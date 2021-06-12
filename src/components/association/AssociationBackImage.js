import React, {useState} from 'react';
import {View, Image, StyleSheet} from "react-native";
import AppImagePicker from "../AppImagePicker";
import AppText from "../AppText";
import AppButton from "../AppButton";
import useUploadImage from "../../hooks/useUploadImage";
import AppUploadModal from "../AppUploadModal";
import useAuth from "../../hooks/useAuth";
function AssociationBackImage({association, cameraContainer,uploadResult, cameraStyle}) {
    const {isModerator, isAdmin} = useAuth()
    const {dataTransformer, directUpload} = useUploadImage()
    const [progress, setProgress] = useState(0)
    const [uploadModalVisible, setUploadModalVisible] = useState(false)
    const [imageUrl, setImageUrl] = useState(association.avatar)
    const [imageData, setImageData] = useState([])
    const [onEdit, setOnEdit] = useState(false)

    const isImage = imageUrl !== null && imageUrl !== ''
    const isAuthorized = isAdmin() || isModerator()

    const handleChangeImage = (image) => {
        setImageUrl(image.url)
        setImageData([image])
        setOnEdit(true)
    }

    const handleSaveImage = async() => {
        const result = dataTransformer(imageData)

        setUploadModalVisible(true)
        setProgress(0)
        const uploaded = await directUpload(result, imageData, (progress) => {
            setProgress(progress)
        })
        setUploadModalVisible(false)
        uploadResult(uploaded)
    }

    return (
        <View>
            <Image style={styles.image} source={isImage?{uri: imageUrl}:require('../../../assets/solidariteImg.jpg')}/>
            <View style={styles.nom}>
                <AppText style={{fontWeight: 'bold'}}>{association.nom}</AppText>
            </View>
            {isAuthorized && <View style={styles.camera}>
                <AppImagePicker iconSize={20}
                    cameraContainer={[cameraContainer]}
                    onSelectImage={handleChangeImage}
                    cameraStyle={[cameraStyle, {height: 40, width: 40}]}/>
            </View>}
           {onEdit && <View style={{
                position: 'absolute',
                top: 10,
                right: 10
            }}>
                <AppButton
                    onPress={handleSaveImage}
                    iconName='content-save-edit' iconSize={20}
                    title='save'
                    otherButtonStyle={{
                        height: 30,
                        padding: 5
                    }}
                    textStyle={{
                    }}/>
            </View>}

            <AppUploadModal progress={progress} uploadModalVisible={uploadModalVisible}/>
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 200
    },
    camera: {
        position: 'absolute',
        right:15,
        bottom: 20
    },
    nom: {
        alignItems: 'center',
        marginVertical: 5
    }
})
export default AssociationBackImage;