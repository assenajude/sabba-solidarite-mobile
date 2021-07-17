import React, {useEffect, useState} from 'react';
import {View, ScrollView, StyleSheet,BackHandler, TouchableOpacity, TouchableWithoutFeedback, Alert, Image} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import AppText from "../components/AppText";
import AppAvatar from "../components/AppAvatar";
import {useDispatch, useSelector, useStore} from "react-redux";
import defaultStyles from '../utilities/styles'
import LottieView from "lottie-react-native";
import useManageAssociation from "../hooks/useManageAssociation";
import AppSimpleLabelWithValue from "../components/AppSimpleLabelWithValue";
import routes from "../navigation/routes";
import AppImagePicker from "../components/AppImagePicker";
import useAuth from "../hooks/useAuth";
import EditFundModal from "../components/user/EditFundModal";
import ListItemSeparator from "../components/ListItemSeparator";
import {LinearGradient} from "expo-linear-gradient";
import useUploadImage from "../hooks/useUploadImage";
import {getUserData, getUserImagesEdit} from "../store/slices/authSlice";
import AppUploadModal from "../components/AppUploadModal";
import AppShowImage from "../components/AppShowImage";
import AppIconWithLabelButton from "../components/AppIconWithLabelButton";
import AppImageValidator from "../components/AppImageValidator";
import AppActivityIndicator from "../components/AppActivityIndicator";


function UserCompteScreen({navigation, route}) {
    let selectedUser = route.params
    const store = useStore()
    const dispatch = useDispatch()
    const {isAdmin} = useAuth()
    const {formatFonds} = useManageAssociation()
    const {directUpload, dataTransformer} = useUploadImage()
    const authLoding = useSelector(state => state.auth.loading)
    const initRecto = {imageData: null, url:selectedUser.piece? selectedUser.piece[0]:null}
    const initVerso = {imageData: null, url:selectedUser.piece? selectedUser.piece[1]:null}

    const [currentUser, setCurrentUser] = useState(selectedUser)
    const [avatarImage, setAvatarImage] = useState({imageData: null, url: selectedUser.avatar?selectedUser.avatar:null})
    const [pieceRecto, setPieceRecto] = useState(initRecto)
    const [pieceVerso, setPieceVerso] = useState(initVerso)
    const [editFund, setEditFund] = useState(false)
    const [progress, setProgress] = useState(0)
    const [uploadModal, setUploadModal] = useState(false)
    const [imageUrl, setImageUrl] = useState('')
    const [imageModal, setImageModal] = useState(false)
    const [selectedAvatarLoading, setSelectedAvatarLoading]= useState(selectedUser.avatarLoading)
    const [selectedRectoLoading, setSelectedRectoLoading]= useState(true)
    const [selectedVersoLoading, setSelectedVersoLoading]= useState(true)
    const [editingAvatar, setEditingAvatar] = useState(false)
    const [editingPiece, setEditingPiece] = useState(false)

    const [changingAvatar, setChangingAvatar] = useState(false)
    const [changingRecto, setChangingRecto] = useState(false)
    const [editingRecto, setEditingRecto] = useState(false)
    const [editingVerso, setEditingVerso] = useState(false)
    const [changingVerso, setChangingVerso] = useState(false)

    const onChangeAvatar = (image) => {
        setChangingAvatar(false)
        setAvatarImage(image)
        setEditingAvatar(true)
    }

    const handleCancelAvatar = () => {
        setAvatarImage(selectedUser)
        setEditingAvatar(false)
    }

    const handleCancelPiece = () => {
        setEditingPiece(false)
        setEditingVerso(false)
        setEditingRecto(false)
        setPieceRecto(initRecto)
        setPieceVerso(initVerso)
    }

    const deleteAvatarImage = () => {
        if(avatarImage.url ===  null) {
            return;
        }
        Alert.alert("Alert", "Que voulez-vous faire de l'image?", [{text: 'supprimer', onPress: () => {
            return setAvatarImage({imageData: null, url: selectedUser.url})
            }}, {text: 'afficher', onPress: () => {
                setImageUrl(avatarImage.url)
                setImageModal(true)
            }}])
    }

    const selectPieceRecto = (image) => {
        setPieceRecto(image)
        setEditingRecto(true)
        setChangingRecto(false)
    }

    const selectPieceVerso = (image) => {
        setPieceVerso(image)
        setEditingVerso(true)
        setChangingVerso(false)

    }

    const handleSaveImages = async () => {
        const isPieceRecto = pieceRecto.url !== null
        const isPieceVerso = pieceVerso.url !== null
        const validPiece = isPieceRecto && isPieceVerso
        const validAvatar = avatarImage.url !== null
        let imagesArray = []
        if(validPiece && editingPiece && validAvatar && editingAvatar) {
            imagesArray = [avatarImage, pieceRecto, pieceVerso]
        } else if (validAvatar && editingAvatar && !editingPiece) {
            imagesArray = [avatarImage]
        } else if(validPiece && editingPiece && !editingAvatar) {
            imagesArray = [pieceRecto, pieceVerso]
        }else {
           return alert('Veuillez choisir des images correctes.')
        }
        const transformedArray = dataTransformer(imagesArray)
        setProgress(0)
        setUploadModal(true)
        const result = await directUpload(transformedArray, imagesArray, (progress) => {
            setProgress(progress)
        })
        setUploadModal(false)
        if(result) {
            const signedUrlArray = store.getState().uploadImage.signedRequestArray
            let newData;
            let data = {userId: selectedUser.id};
            if(editingAvatar && validAvatar && editingPiece && validPiece) {
                 newData = {
                    ...data,
                    avatarUrl:signedUrlArray[0].url,
                    pieces: [signedUrlArray[1].url, signedUrlArray[2].url]
                }
                data = newData
            }
           if(validPiece && editingPiece  && !editingAvatar) {
               newData = {
                    ...data,
                   pieces: [signedUrlArray[0].url, signedUrlArray[1].url]
               }

               data = newData
            }
           if(editingAvatar && validAvatar && !editingPiece) {
               newData = {
                    ...data,
                   avatarUrl:signedUrlArray[0].url
               }
               data = newData
            }
            await dispatch(getUserImagesEdit(data))
            setEditingAvatar(false)
            setEditingPiece(false)
            const error = store.getState().auth.error
            if(error !== null) {
                return alert("Erreur lors de la mise à jour de vos images. Veuillez reessayer plutard.")
            }
            const updatedUser = store.getState().auth.user
            selectedUser = updatedUser
            alert("Vos images ont été editées avec succès.")
        }else {
            return alert("Nous n'avons pas pu valider les images, veuillez reessayer plutard.")
        }

    }

    const handleShowImage = (url) => {
        if(url) {
            setImageUrl(url)
            setImageModal(true)
        }
    }

    const backAction = () => {
        navigation.navigate(routes.STARTER)
    }

    const getConnectedUserData = async (user) => {
        await dispatch(getUserData({userId: user.id}))
        const justConnected = store.getState().auth.user
        setCurrentUser(justConnected)
    }

    useEffect(() => {
        if(!isAdmin() && selectedUser) {
         getConnectedUserData(selectedUser)
        }else {
            setCurrentUser(selectedUser)
        }
        if(editingRecto && editingVerso) {
            setEditingPiece(true)
        }
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, [editingRecto, editingVerso, selectedUser])

    return (
        <>
            <AppActivityIndicator visible={authLoding}/>
        <ScrollView>
            <LinearGradient
                colors={['#860432', 'transparent']}
                style={styles.background}
            >
                <View style={[styles.headerContainer, {backgroundColor:selectedAvatarLoading?defaultStyles.colors.lightGrey: defaultStyles.colors.white}]}>
                        <AppAvatar
                            onAvatarLoadEnd={() => setSelectedAvatarLoading(false)}
                            avatarLoading={selectedAvatarLoading}
                            source={{uri: avatarImage.url}} avatarStyle={styles.avatarStyle} user={currentUser} onDelete={deleteAvatarImage}/>
                </View>
                <View style={{
                    position: 'absolute',
                    top: 10,
                    right:editingAvatar? 10:50
                }}>
                    <AppImagePicker
                        cancelImage={handleCancelAvatar}
                        saveImage={handleSaveImages}
                        selectingImage={changingAvatar}
                        onImageEditing={editingAvatar}
                        onPressCloseButton={() => setChangingAvatar(false)}
                        onPressCamera={() => setChangingAvatar(true)}
                        iconSize={20}
                        cameraStyle={{height: 40, width: 40}}
                        onSelectImage={onChangeAvatar}/>
                </View>
                <View
                    style={{
                        alignSelf:'center',
                        marginBottom: 30,
                        marginTop: 10,
                        marginLeft: 50
                    }}>
                    <AppText>{currentUser.username}</AppText>
                    <AppText>{currentUser.email}</AppText>
                    <AppText>{currentUser.phone}</AppText>
                </View>
            </LinearGradient>

            <View style={styles.walletContent}>
            <View style={styles.wallet}>
                <LottieView style={{ width: 150}} autoPlay={true} loop={true} source={require('../../assets/animations/wallet-animation')}/>
                <AppText style={styles.walletText}>{formatFonds(currentUser.wallet)}</AppText>
            </View>
                <TouchableOpacity onPress={() => {
                    if (currentUser.wallet <= 0) {
                        return alert("Vous n'avez pas fonds à retirer.")
                    }
                    navigation.navigate(routes.NEW_TRANSACTION, {typeTrans: 'Retrait de fonds'})
                }}>
                    <View  style={styles.exportFund}>
                        <MaterialCommunityIcons
                            name='export' size={30}
                            color={defaultStyles.colors.bleuFbi}/>
                         <AppText style={{
                             color: defaultStyles.colors.bleuFbi,
                             fontWeight: 'bold'
                         }}>Retirer</AppText>
                    </View>
                </TouchableOpacity>
                <View style={styles.editFund}>
                    <TouchableOpacity onPress={() => isAdmin()?setEditFund(true): navigation.navigate(routes.NEW_TRANSACTION, {typeTrans: 'Rechargement porteffeuille'})}>
                        <MaterialCommunityIcons name="credit-card-plus" size={30} color={defaultStyles.colors.vert} />
                    </TouchableOpacity>
                </View>
            </View>
            <View>
            <View style={styles.piece}>
                 <View>
                    {pieceRecto.url === null &&  <View style={styles.pieceContent}>
                   <AppText style={{fontSize: 12}}>Choisir pièce recto</AppText>
                 </View>}
                    {pieceRecto.url !== null && <TouchableWithoutFeedback
                        onPress={() => handleShowImage(pieceRecto.url)}>
                    <Image
                        onLoadEnd={() => setSelectedRectoLoading(false)}
                        source={{uri:pieceRecto.url}}
                        style={styles.pieceContent}/>
                    </TouchableWithoutFeedback>
                    }
                    {pieceRecto.url !== null && selectedRectoLoading && <View style={styles.pieceLoadingContainer}>
                        <LottieView
                            style={styles.pieceLoading}
                            source={require('../../assets/animations/image-loading')}
                            loop={true} autoPlay={true}/>
                    </View>}
                    <View style={styles.rectoCamera}>
                        <AppImagePicker
                            iconSize={20}
                            onPressCloseButton={() => setChangingRecto(false)}
                            onPressCamera={() => setChangingRecto(true)}
                            selectingImage={changingRecto}
                            cameraStyle={styles.cameraStyle}
                            onSelectImage={selectPieceRecto}/>
                    </View>
                </View>
                <View>
                    {pieceVerso.url === null && <View  style={styles.pieceContent}>
                  <AppText style={{fontSize: 12}}>Choisir pièce verso</AppText>
                  </View>}
                  {pieceVerso.url !== null && <TouchableWithoutFeedback onPress={() => handleShowImage(pieceVerso.url)}>
                  <Image
                      onLoadEnd={() => setSelectedVersoLoading(false)}
                      source={{uri: pieceVerso.url}}
                      style={styles.pieceContent}/>
                  </TouchableWithoutFeedback>
                  }
                    {pieceVerso.url !== null && selectedVersoLoading && <View style={styles.pieceLoadingContainer}>
                        <LottieView
                            style={styles.pieceLoading}
                            source={require('../../assets/animations/image-loading')}
                            loop={true} autoPlay={true}/>
                    </View>}
                    <View style={styles.versoCamera}>
                        <AppImagePicker iconSize={20}
                            selectingImage={changingVerso}
                            onPressCamera={() => setChangingVerso(true)}
                            onPressCloseButton={() => setChangingVerso(false)}
                            cameraStyle={styles.cameraStyle} onSelectImage={selectPieceVerso}/>
                    </View>
                </View>
            </View>
                {editingPiece && <AppImageValidator
                    saveImage={handleSaveImages} cancelImage={handleCancelPiece}/>}
            </View>
            <View style={{marginVertical: 10}}>
                <ListItemSeparator/>
            </View>
            <View style={{
                marginHorizontal: 20
            }}>
            <AppSimpleLabelWithValue label='Nom' labelValue={currentUser.nom?currentUser.nom:'renseignez votre nom'}/>
            <AppSimpleLabelWithValue label='Prenom' labelValue={currentUser.prenom?currentUser.prenom:'renseignez votre prenom'}/>
            <AppSimpleLabelWithValue label='Phone' labelValue={currentUser.phone?currentUser.phone:'renseignez votre phone'}/>
            <AppSimpleLabelWithValue label='Profession' labelValue={currentUser.profession?currentUser.profession:'renseignez votre profession ou formation'}/>
            <AppSimpleLabelWithValue label='Emploi' labelValue={currentUser.emploi?currentUser.emploi:'renseignez votre emploi'}/>
            <AppSimpleLabelWithValue label='Adresse' labelValue={currentUser.adresse?currentUser.adresse:'renseignez votre adresse'}/>
            </View>
            <View style={styles.params}>
                <AppIconWithLabelButton
                    onPress={() => navigation.navigate('Transaction')}
                    label='Transactions'
                    iconName='wallet-outline'/>
                    <View>
                        <AppIconWithLabelButton
                            label='Edit Infos'
                            onPress={() => navigation.navigate(routes.EDIT_USER_COMPTE)}
                            iconName='account-edit'/>
                        <AppIconWithLabelButton
                            buttonContainerStyle={{
                                marginVertical: 10,
                                marginBottom: 10
                            }}
                            label='Paramètres'
                            onPress={() => navigation.navigate(routes.PARAMS)}
                            iconName='account-settings'/>
                    </View>

            </View>

        </ScrollView>
            <EditFundModal
                fundResult={(result) => {
                    if(result) {
                        const newUser = store.getState().auth.user
                        selectedUser = newUser
                    }
                }}
                editVisible={editFund}
                closeFundModal={() => setEditFund(false)}/>
            <AppUploadModal progress={progress} uploadModalVisible={uploadModal}/>
            <AppShowImage
                closeImageModal={() => setImageModal(false)}
                imageModalVisible={imageModal}
                imageUrl={imageUrl}/>
        </>
    );
}

const styles = StyleSheet.create({
    avatarCamera: {
        height: 50,
        width: 50,
        borderRadius: 10,
        marginTop: 20,
        padding: 10,
        backgroundColor: defaultStyles.colors.white
    },
    avatarStyle:{
        height: 200,
        width: 200,
        borderRadius: 100,
    },
    background: {
        height: 300,
        width: '100%',
    },
    cameraStyle: {
      height: 40,
      width: 40
    },
    editInfoButton: {
        color: defaultStyles.colors.bleuFbi,
        fontWeight: 'bold',
        marginLeft: 10
    },
    editImage: {
        position: 'absolute',
        top: 10,
        right: 10,

    },
    editImageButton: {
        height: 30,
        padding: 5,
        alignItems: 'center'
    },
    editFund: {
     position: 'absolute',
     right: 10,
     top: 10
    },
    exportFund: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20
    },
    header: {
        position: 'absolute',
        alignSelf: 'center',
        top: 40
    },
    headerContainer: {
        height: 200,
        width: 200,
        marginVertical: 10,
        marginHorizontal: 10,
        borderRadius:100,
        alignSelf: 'center',
        alignItems: 'center',
    },
    params:{
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        marginVertical: 10
    },
    pieceLoading: {
      height: 100,
      width: 100
    },
    pieceLoadingContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: defaultStyles.colors.lightGrey
    },

    versoCamera: {
        position: 'absolute',
        bottom: -20,
        right: -5
    },
    rectoCamera: {
        position: 'absolute',
        left: -5,
        bottom: -20
    },
    wallet: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    walletContent: {
        borderWidth: 1,
        borderColor: defaultStyles.colors.bleuFbi,
        marginHorizontal: 20,
        marginVertical: 20,
        borderRadius: 20
    },
    walletText: {
        color: defaultStyles.colors.or,
        fontWeight: 'bold',
        fontSize: 20
    },
    piece: {
        marginVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pieceContent: {
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 80,
        width: 150,
        backgroundColor: defaultStyles.colors.white
    },
})
export default UserCompteScreen;