import React, {useEffect, useState} from 'react';
import {View, ScrollView, StyleSheet} from "react-native";

import AppText from "../components/AppText";
import useManageAssociation from "../hooks/useManageAssociation";
import AppAddNewButton from "../components/AppAddNewButton";
import routes from "../navigation/routes";
import defaultStyles from "../utilities/styles";
import AppLabelWithValue from "../components/AppLabelWithValue";
import AppLinkButton from "../components/AppLinkButton";
import useCotisation from "../hooks/useCotisation";
import useEngagement from "../hooks/useEngagement";
import BackgroundWithAvatar from "../components/member/BackgroundWithAvatar";
import useAuth from "../hooks/useAuth";
import {useDispatch,useStore} from "react-redux";
import {
    cancelChangingImage,
    changeMemberImage,
    getImagesEdit
} from "../store/slices/memberSlice";
import useUploadImage from "../hooks/useUploadImage";
import AppUploadModal from "../components/AppUploadModal";


function MemberCompteScreen({navigation}) {
    const store = useStore()
    const dispatch = useDispatch()
    const {dataTransformer, directUpload} = useUploadImage()
    const {isModerator, getConnectedMember,isAdmin, getMemberUserCompte} = useAuth()
    const {getMemberCotisations} = useCotisation()
    const {getMemberEngagementInfos} = useEngagement()
    const {formatFonds, formatDate, leaveAssociation} = useManageAssociation()

    let currentMember = getMemberUserCompte()

    const [progress, setProgress] = useState(0)
    const [uploadModal, setUploadModal] = useState(false)
    let [connectedMember, setConnectedMember] = useState(currentMember)
    const [editingAvatar, setEditingAvatar] = useState(false)
    const [avatarImage, setAvatarImage] = useState(null)
    const [backImage, setBackImage] = useState(null)
    const [editingBackImage, setEditingBackImage] = useState(false)


    const [selectingModal, setSelectingModal] = useState(false)
    const [selectingBackModal, setSelectingBackModal] = useState(false)

    const [backImageLoading, setBackImageLoading] = useState(currentMember.backImageLoading)

    const isAuthorized = isAdmin() || isModerator()

    const handleChangeAvatar = (image) => {
        setSelectingModal(false)
        setEditingAvatar(true)
        setAvatarImage(image)
        dispatch(changeMemberImage({...connectedMember, newAvatar: image.url}))
    }

    const handleChangeBackImage = (image) => {
        setSelectingBackModal(false)
        setEditingBackImage(true)
        setBackImage(image)
        dispatch(changeMemberImage({...connectedMember, backImage: image.url}))
    }

    const handleSaveImage = async (label) => {
        let imagesArray = []
        if(label === 'avatar') {
            imagesArray = [avatarImage]
        }
        if(label === 'backImage') {
            imagesArray = [backImage]
        }
        if(!imagesArray || imagesArray.length === 0) {
            return alert("Aucune image selectionnée.")
        }
        const transformedArray = dataTransformer(imagesArray)
        setProgress(0)
        setUploadModal(true)
        const result = await directUpload(transformedArray, imagesArray, (progress) => {
            setProgress(progress)
        })
        setUploadModal(false)
        if(result) {
            const signedArray = store.getState().uploadImage.signedRequestArray
            let data;
            if (label === 'backImage') {
                data = {
                    memberId: getConnectedMember().id,
                    backImageUrl: signedArray[0].url
                }
            }
            if (label === 'avatar') {
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
            setEditingAvatar(false)
            setEditingBackImage(false)
            const allMember = store.getState().entities.member.list
            const updated = allMember.find(item => item.id === connectedMember.id)
            currentMember = updated
            alert("Les images ont été modifiées avec succès")
        }else {
            return alert("Les images n'ont pu être validées veuillez reessayer plutard.")
        }
    }


    useEffect(() => {
            setConnectedMember(currentMember)
    }, [currentMember, getMemberUserCompte().avatarLoading, getMemberUserCompte().backImageLoading])
    return (
        <>
            <ScrollView contentContainerStyle={{paddingBottom: 20}}>
                <BackgroundWithAvatar
                    onBackImageLoadEnd={() => setBackImageLoading(false)}
                    onBackImageLoading={backImageLoading}
                    selectingBackImage={selectingBackModal}
                    onSelectingBackImage={() => setSelectingBackModal(true)}
                    onBackImageEditing={editingBackImage}
                    selectingAvatar={selectingModal}
                    onAvatarEditing={editingAvatar}
                    onCloseBackModal={() => setSelectingBackModal(false)}
                    onSelectingAvatar={() => setSelectingModal(true)}
                    onCloseSelectingModal={() => setSelectingModal(false)}
                    allowCamera={true}
                    onSaveBackImage={() => handleSaveImage('backImage')}
                    onSelectBackImage={handleChangeBackImage}
                    onCancelBackImage={() => {
                        dispatch(cancelChangingImage(connectedMember))
                        setEditingBackImage(false)
                    }}
                    saveAvatar={() => handleSaveImage('avatar')}
                    cancelAvatarChanging={() => {
                        dispatch(cancelChangingImage({...connectedMember, label:'avatar'}))
                        setEditingAvatar(false)
                    }}
                    onChangeMemberAvatar={handleChangeAvatar}
                    selectedMember={connectedMember}
                />
                <View style={styles.statut}>
                    <AppText style={{color: defaultStyles.colors.bleuFbi, fontSize: 22, fontWeight: 'bold'}}>{getConnectedMember()?.statut}</AppText>
                </View>
                <View style={{marginTop: 30}}>
                    <AppLabelWithValue label='Fonds' value={formatFonds(getConnectedMember().fonds)}/>
                    <AppLabelWithValue label="Date d'adhesion" value={formatDate(getConnectedMember().adhesionDate)}/>
                </View>
                <View style={{
                    marginVertical: 10,
                    marginHorizontal: 10
                }}>
                    <AppLinkButton label='Vos cotisations'
                                   onPress={() =>
                                       navigation.navigate('Cotisations', {
                                           screen: 'MemberCotisationScreen',
                                           initial: false,
                                           params:getMemberUserCompte()
                                       })}
                                   labelLength={getMemberCotisations(getConnectedMember()).cotisationLenght}
                                   totalAmount={getMemberCotisations(getConnectedMember()).totalCotisation}/>
                     <AppLinkButton label='Vos engagements'
                                    onPress={() => navigation.navigate('Engagements', {
                                        screen : routes.LIST_ENGAGEMENT,
                                        initial: false,
                                        params:getMemberUserCompte()
                                    })}
                                    labelLength={getMemberEngagementInfos(getConnectedMember()).engagementLength}
                                    totalAmount={getMemberEngagementInfos(getConnectedMember()).engagementAmount}/>
                </View>
            </ScrollView>
            {isAuthorized && <View style={styles.edit}>
                <AppAddNewButton name='account-edit'
                                 onPress={() => navigation.navigate('Members',{
                                     screen : routes.EDIT_MEMBER,
                                     params: getMemberUserCompte()
                                 })}/>
                <AppAddNewButton
                    buttonContainerStyle={{
                        backgroundColor: defaultStyles.colors.rougeBordeau,
                        marginVertical: 10
                    }}
                    name='account-minus'
                    onPress={() => leaveAssociation(getMemberUserCompte())}/>
            </View>}

          <AppUploadModal
              closeModal={() => setUploadModal(false)}
              progress={progress}
              uploadModalVisible={uploadModal}/>
        </>
    );
}

const styles = StyleSheet.create({
    avatar: {
        bottom: 2,
        position: 'absolute',
        left: 15,
    },
    camera: {
        padding: 10
    },
    cameraContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    cotisation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginVertical: 20
    },
    edit: {
      position: 'absolute',
        right: 5,
        bottom: 5,
        alignItems: 'center'
    },
    fontImage: {
        height: 200
    },
    mainInfo: {
        marginLeft:'25%',
        marginTop: 10,
    },
    statut: {
        alignItems: 'center',
        marginTop: 40
    }
})
export default MemberCompteScreen;