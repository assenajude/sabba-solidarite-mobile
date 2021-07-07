import React, {useState} from 'react';
import {Modal, View, StyleSheet, TouchableOpacity} from "react-native";
import * as Yup from 'yup'
import { MaterialCommunityIcons } from '@expo/vector-icons';

import defaultStyles from '../../utilities/styles'
import FormImagePicker from "../form/FormImagePicker";
import {AppForm, FormSubmitButton} from "../form";
import AppText from "../AppText";
import useUploadImage from "../../hooks/useUploadImage";
import useAuth from "../../hooks/useAuth";
import {useDispatch, useStore} from "react-redux";
import {getImagesEdit} from "../../store/slices/memberSlice";
import AppUploadModal from "../AppUploadModal";

const validImages = Yup.object().shape({
    avatar: Yup.object(),
    backImge: Yup.object()
})
function EditImagesModal({editImagesModalVisible,closeModal, member}) {
    const store = useStore()
    const dispatch = useDispatch()

    const {directUpload, dataTransformer} = useUploadImage()
    const {getConnectedMember} = useAuth()

    const [error, setError] = useState(null)
    const [progress, setProgress] = useState(0)
    const [uploadModal, setUploadModal] = useState(false)
    const [editingAvatar, setEditingAvatar] = useState(false)
    const [editingBackImage, setEditingBackImage] = useState(false)

    const handleValidateImages = async (images) => {
        console.log('avatar url',images.avatar.url);
        console.log('backimage url',images.backImage.url);
        const avatarKeys = Object.keys(images.avatar)
        const backImageKeys = Object.keys(images.backImage)
        const editAvatar = avatarKeys.indexOf('imageData') !== -1
        const editBackImage = backImageKeys.indexOf('imageData') !== -1
        if(editAvatar) setEditingAvatar(true)
        if(editBackImage) setEditingBackImage(true)
        const isNotAvatarAndBackImage = Object.keys(images.avatar).length === 0 && Object.keys(images.backImage).length === 0 && editingAvatar===false && editingBackImage === false
        const isOnlyAvatar = Object.keys(images.avatar).length > 0 && Object.keys(images.backImage).length === 0
        const isOnlyBackImage = Object.keys(images.avatar).length === 0 && Object.keys(images.backImage).length>0
        let imagesArray = []
        if (isNotAvatarAndBackImage) {
            setError('Veuillez selectionner au moins une image')
            return;
        }
        if(isOnlyAvatar && editingAvatar) {
            console.log("editing only avatar......................")
            imagesArray = [images.avatar]
        } else if(isOnlyBackImage && editingBackImage) {
            console.log("editing only backimage.....................")
            imagesArray = [images.backImage]
        }else if(editingBackImage && editingAvatar){
            console.log("editing avatar and backimage.....................")
            imagesArray = [images.avatar, images.backImage]
        }
        editImagesModalVisible = false
        setProgress(0)
        setUploadModal(true)
        const transformedArray = dataTransformer(imagesArray)
        const result = await directUpload(transformedArray, imagesArray, (progress) => {
            setProgress(progress)
        })
        setUploadModal(false)
        if(!result) {
            return alert("Impossible de faire la mise à jour. Les images n'ont pas été telechargées.")
        }
        const signedArray = store.getState().uploadImage.signedRequestArray
        let data;
        if(editingAvatar === true && editingBackImage === true) {
            console.log("data for both only.......................")
            data = {
                memberId: getConnectedMember().id,
                avatarUrl: signedArray[0].url,
                backImageUrl: signedArray[1].url
            }
        } else if(editingBackImage) {
            console.log("data for backimage only.......................")
            data = {
                memberId: getConnectedMember().id,
                backImageUrl: signedArray[0].url
            }
        }else {
            console.log("data for avatar only.......................")
            data = {
                memberId: getConnectedMember().id,
                avatarUrl: signedArray[0].url,
            }
        }

        await dispatch(getImagesEdit(data))
        const error = store.getState().entities.member.error
        if(error !== null) {
            return alert("Nous n'avons pas pu mettre à jour vos images, veuillez reessayer plutard.")
        }
        alert("Les images ont été modifiées avec succès")
    }

    return (
        <>
        <Modal visible={editImagesModalVisible} transparent>
            <View style={styles.container}>
            </View>
            <View style={styles.imageForm}>

                {error !== null && <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <MaterialCommunityIcons name="shield-alert" size={20} color={defaultStyles.colors.rougeBordeau} />
                <AppText style={{
                    marginLeft: 5,
                    fontSize: 12,
                    color: defaultStyles.colors.rougeBordeau
                }}>{error}</AppText>
                </View>}
                <View style={{
                    position: 'absolute',
                    right: 20,
                    top: 20
                }}>
                    <TouchableOpacity onPress={closeModal}>
                        <MaterialCommunityIcons name="window-close" size={24} color={defaultStyles.colors.rougeBordeau} />
                    </TouchableOpacity>
                </View>
                <AppForm
                    initialValues={{
                        avatar: member?{url: member.avatar}: {},
                        backImage: member?{url: member.backImage}: {}
                    }}
                    validationSchema={validImages}
                    onSubmit={handleValidateImages}>
                <FormImagePicker label='Avatar:' name='avatar'/>
                <FormImagePicker label='Arrière plan:' name='backImage'/>
                <FormSubmitButton title='valider les images'/>
                </AppForm>
            </View>
        </Modal>
            <AppUploadModal closeModal={() => setUploadModal(false)} progress={progress} uploadModalVisible={uploadModal}/>
            </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: defaultStyles.colors.dark,
        opacity: 0.5,
        width: '100%',
        height: '100%'
    },
    imageForm: {
        alignItems:'center',
        justifyContent: 'center',
        position: 'absolute',
        height: 350,
        width: '100%',
        top: '30%',
        backgroundColor: defaultStyles.colors.white
    }
})
export default EditImagesModal;