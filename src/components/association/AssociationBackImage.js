import React, {useState, useEffect} from 'react';
import {View, Image, StyleSheet, TouchableWithoutFeedback, Alert} from "react-native";
import LottieView from "lottie-react-native";
import AppImagePicker from "../AppImagePicker";
import AppText from "../AppText";
import useUploadImage from "../../hooks/useUploadImage";
import AppUploadModal from "../AppUploadModal";
import useAuth from "../../hooks/useAuth";
import {useDispatch} from "react-redux";
import {getSelectedAssociation, mainAssociationImageLoaded} from "../../store/slices/associationSlice";
import {associationImageLoaded, getConnectedUserAssociations} from "../../store/slices/memberSlice";
import colors from "../../utilities/colors";

function AssociationBackImage({association, cameraContainer,uploadResult, cameraStyle}) {
    const dispatch = useDispatch()
    const {isModerator, isAdmin} = useAuth()
    const {dataTransformer, directUpload} = useUploadImage()
    const [progress, setProgress] = useState(0)
    const [uploadModalVisible, setUploadModalVisible] = useState(false)
    const [imageUrl, setImageUrl] = useState(association.avatar)
    const [imageData, setImageData] = useState([])
    const [onEdit, setOnEdit] = useState(false)
    const [selectingImage, setSelectingImage] = useState(false)
    const [imageLoading, setImageLoading] = useState(false)

    const isImage = imageUrl !== null && imageUrl !== ''
    const isAuthorized = isAdmin() || isModerator()

    const handleChangeImage = (image) => {
        setSelectingImage(false)
        setImageUrl(image.url)
        setImageData([image])
        setOnEdit(true)
    }

    const handleCancelImage = () => {
        setImageUrl(association.avatar)
        setImageData([])
        setOnEdit(false)
    }

    const handleSaveImage = async() => {
        const result = dataTransformer(imageData)
        setUploadModalVisible(true)
        setProgress(0)
        const uploaded = await directUpload(result, imageData, (progress) => {
            setProgress(progress)
        })
        setOnEdit(false)
        setUploadModalVisible(false)
        uploadResult(uploaded)
        if (uploaded) {
            dispatch(getSelectedAssociation({associationId: association.id}))
            dispatch(getConnectedUserAssociations())
        }
        if(!uploaded) setImageUrl(association.avatar)
        setOnEdit(false)
    }

    const editImage = () => {
        if(isAuthorized) {
            Alert.alert("Alert", "voulez-vous supprimer l'image?", [{
                text: 'supprimer', onPress: () => {setImageUrl(association.avatar)}
            }, {
                text: 'retour', onPress: () => {return;}
            }])
        }

    }



    useEffect(() => {
        setImageUrl(association.avatar)
        setImageLoading(association.imageLoading)
    }, [association, association.imageLoading])

    return (
        <View>
            <TouchableWithoutFeedback onPress={editImage}>
                <View>
                    <Image
                    onLoadEnd={() => setImageLoading(false)}
                    style={styles.image} source={isImage?{uri: imageUrl}:require('../../../assets/solidariteImg.jpg')}/>
                    {imageLoading && <View style={styles.loading}>
                        <LottieView
                            autoPlay={true}
                            loop={true}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: 200
                            }}
                            source={require('../../../assets/animations/image-loading')}/>
                    </View>}

                </View>
            </TouchableWithoutFeedback>
            <View style={styles.nom}>
                <AppText style={{fontWeight: 'bold'}}>{association.nom}</AppText>
            </View>
           {isAuthorized && <View style={{
                position: 'absolute',
                top: onEdit?10:-20,
                right: 5
            }}>
                <AppImagePicker
                    cameraStyle={[cameraStyle, {height: 40, width: 40}]}
                    iconSize={20}
                    cameraContainer={cameraContainer}
                    onPressCamera={() => setSelectingImage(true)}
                    cancelImage={handleCancelImage}
                    onPressCloseButton={() => setSelectingImage(false)}
                    onSelectImage={handleChangeImage}
                    onImageEditing={onEdit}
                    selectingImage={selectingImage}
                    saveImage={handleSaveImage}/>
            </View>}
            <AppUploadModal
                closeModal={() => setUploadModalVisible(false)}
                progress={progress}
                uploadModalVisible={uploadModalVisible}/>
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
    loading: {
        position: 'absolute',
      width: "100%",
      height: '100%',
        backgroundColor:colors.lightGrey
    },
    nom: {
        alignItems: 'center',
        marginVertical: 5
    }
})
export default AssociationBackImage;