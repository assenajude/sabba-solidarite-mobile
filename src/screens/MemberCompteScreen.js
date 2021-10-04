import React, {useCallback, useEffect, useState} from 'react';
import {View, ScrollView, StyleSheet, Alert} from "react-native";

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
import {useDispatch, useSelector, useStore} from "react-redux";
import {
    cancelChangingImage,
    changeMemberImage, getConnectedMemberUser,
    getImagesEdit, getMemberQuotiteSet, getMemberStateUpdate
} from "../store/slices/memberSlice";
import useUploadImage from "../hooks/useUploadImage";
import AppUploadModal from "../components/AppUploadModal";
import MemberQuotite from "../components/member/MemberQuotite";
import AppIconButton from "../components/AppIconButton";
import {getUserTransactions} from "../store/slices/transactionSlice";
import {getSelectedAssociation} from "../store/slices/associationSlice";
import AppActivityIndicator from "../components/AppActivityIndicator";


function MemberCompteScreen({navigation}) {
    const store = useStore()
    const dispatch = useDispatch()
    const {dataTransformer, directUpload} = useUploadImage()
    const {isModerator, getConnectedMember,isAdmin, getMemberUserCompte, getMemberStatut} = useAuth()
    const {getMemberCotisations} = useCotisation()
    const {getMemberEngagementInfos} = useEngagement()
    const {formatFonds, formatDate, leaveAssociation, memberQuotite} = useManageAssociation()
    const currentAssociation = useSelector(state => state.entities.association.selectedAssociation)
    const [transactions, setTransactions] = useState([])
    const [totalTransactions, setTotalTransactions] = useState(0)
    const [loading, setLoading] = useState(false)

    let currentMember = getMemberUserCompte()

    const handleWithdrow = () => {
        if(getConnectedMember().fonds<0) {
            return alert("Vous n'avez pas de fonds à retirer.")
        }
        Alert.alert("Information!", "Indiquez nous le compte de destination du fonds svp.",
            [{
            text: 'Mon portefeuille',
                onPress: () =>
                    navigation.navigate(routes.MEMBER_RETRAIT, getMemberUserCompte())
            }, {
            text: 'Numero externe',
                onPress: () =>
                    navigation.navigate(
                        routes.NEW_TRANSACTION,
                        {
                            typeTrans: 'Retrait de fonds',
                            creatorId: getConnectedMember().id,
                            creatorType: 'member',
                            userId: getMemberUserCompte().id,
                            fondTotal: getConnectedMember().fonds
                        })
            }])
    }

    const [progress, setProgress] = useState(0)
    const [uploadModal, setUploadModal] = useState(false)
    let [connectedMember, setConnectedMember] = useState({})
    const [editingAvatar, setEditingAvatar] = useState(false)
    const [avatarImage, setAvatarImage] = useState(null)
    const [backImage, setBackImage] = useState(null)
    const [editingBackImage, setEditingBackImage] = useState(false)


    const [selectingModal, setSelectingModal] = useState(false)
    const [selectingBackModal, setSelectingBackModal] = useState(false)

    const [backImageLoading, setBackImageLoading] = useState(true)

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
            setLoading(true)
            await dispatch(getImagesEdit(data))
            setLoading(false)
            const error = store.getState().entities.member.error
            if(error !== null) {
                return alert("Nous n'avons pas pu mettre à jour vos images, veuillez reessayer plutard.")
            }
            setEditingAvatar(false)
            setEditingBackImage(false)
            const allMember = store.getState().entities.member.list
            const updated = allMember.find(item => item.id === connectedMember.id)
            currentMember = updated
            if(currentMember.backImageLoading) setBackImageLoading(true)
            alert("Les images ont été modifiées avec succès")
        }else {
            return alert("Les images n'ont pu être validées veuillez reessayer plutard.")
        }
    }

    const getMemberTransactions = useCallback(async () => {
        setLoading(true)
        await dispatch(getUserTransactions({creatorId : getConnectedMember().id}))
        setLoading(false)
        const memberTransactions = store.getState().entities.transaction.list
        const transacMontant = () => {
            let montant = 0
            for(let transac of memberTransactions) {
                montant += transac.montant
            }
            return montant
        }
        setTotalTransactions(transacMontant())
        setTransactions(memberTransactions)
    }, [])

    const getAssociation = useCallback(async () => {
        setLoading(true)
        await dispatch(getSelectedAssociation({associationId: currentAssociation.id}))
        setLoading(true)
    }, [])

    const getMemberData = () => {
        const memberUpate = store.getState().entities.member.updating
        const assoStateUpdate = store.getState().entities.association.updating
        if(assoStateUpdate) {
            getAssociation()
        }
        if(memberUpate) {
            getMemberTransactions()
            dispatch(getConnectedMemberUser({associationId: currentAssociation.id}))
            dispatch(getMemberStateUpdate({updating: false}))
        }

            dispatch(getMemberQuotiteSet({quotite:memberQuotite()}))
    }


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus',() => getMemberData())
        if(getConnectedMember()) {
            setConnectedMember(currentMember)
        }
        return unsubscribe
    }, [navigation, currentMember, getMemberUserCompte()?.avatarLoading, getMemberUserCompte()?.backImageLoading])

    if(!getConnectedMember() && Object.keys(connectedMember).length === 0) {
        return (
            <View style={{
                flex:1,
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: 20
            }}>
                <AppText>Vous n'êtes pas connecté entant que membre de cette association.</AppText>
            </View>
        )
    }

    return (
        <>
            <AppActivityIndicator visible={loading}/>
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
                    <AppText style={{color: defaultStyles.colors.bleuFbi, fontSize: 22, fontWeight: 'bold'}}>{getMemberStatut(getConnectedMember().statut)}</AppText>
                </View>
                <View style={{marginTop: 30}}>
                    <View>
                        <AppLabelWithValue
                            label='Fonds'
                            value={formatFonds(getConnectedMember().fonds)}/>
                        <AppIconButton
                            onPress={handleWithdrow}
                            iconColor={defaultStyles.colors.white}
                            iconSize={30}
                            containerStyle={[styles.withdrow, {backgroundColor: getConnectedMember().fonds>0?defaultStyles.colors.vert : defaultStyles.colors.rougeBordeau}]}
                            iconName='credit-card-minus'
                        />
                    </View>
                    <MemberQuotite/>
                    <AppLabelWithValue label="Date d'adhesion" value={formatDate(getConnectedMember().adhesionDate)}/>
                </View>
                <View style={{
                    marginVertical: 10,
                    marginHorizontal: 10
                }}>
                    <AppLinkButton
                        label='Vos cotisations'
                        onPress={() =>
                            navigation.navigate('Cotisations', {
                                screen: 'MemberCotisationScreen',
                                initial: false,
                                params:getMemberUserCompte()
                            })}
                        labelLength={getMemberCotisations(getConnectedMember()).cotisationLenght}
                        totalAmount={getMemberCotisations(getConnectedMember()).totalCotisation}/>
                     <AppLinkButton
                         label='Vos engagements'
                         onPress={() => navigation.navigate('Engagements', {
                             screen : routes.LIST_ENGAGEMENT,
                             initial: false,
                             params:getMemberUserCompte()
                         })}
                         labelLength={getMemberEngagementInfos(getConnectedMember()).engagementLength}
                         totalAmount={getMemberEngagementInfos(getConnectedMember()).engagementAmount}/>

                         <AppLinkButton
                             label='Vos transactions'
                             onPress={() => {
                                 const params = getConnectedMember().id
                                 navigation.navigate(routes.TRANSACTION, {creatorId:params})
                             }}
                             labelLength={transactions.length}
                              totalAmount={totalTransactions}
                         />
                </View>
            </ScrollView>
             <View style={styles.edit}>
                 {isAuthorized &&
                 <AppAddNewButton
                     name='account-edit'
                     onPress={() => navigation.navigate('Members',{
                         screen : routes.EDIT_MEMBER,
                         params: getMemberUserCompte()
                     })}/>}
                <AppAddNewButton
                    buttonContainerStyle={{
                        backgroundColor: defaultStyles.colors.rougeBordeau,
                        marginVertical: 10
                    }}
                    name='account-minus'
                    onPress={() => leaveAssociation(getMemberUserCompte())}/>
            </View>

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
        bottom: -5,
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
    },
    withdrow: {
        position :'absolute',
        right: 10,
        height: 60,
        width: 60,
        borderRadius: 30,
        top: 0,
    }
})
export default MemberCompteScreen;