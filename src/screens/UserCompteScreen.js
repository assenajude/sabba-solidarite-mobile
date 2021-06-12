import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Alert, Image} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import AppText from "../components/AppText";
import AppAvatar from "../components/AppAvatar";
import {useDispatch, useSelector, useStore} from "react-redux";
import defaultStyles from '../utilities/styles'
import LottieView from "lottie-react-native";
import useManageAssociation from "../hooks/useManageAssociation";
import AppButton from "../components/AppButton";
import AppSimpleLabelWithValue from "../components/AppSimpleLabelWithValue";
import routes from "../navigation/routes";
import AppImagePicker from "../components/AppImagePicker";
import useAuth from "../hooks/useAuth";
import EditFundModal from "../components/user/EditFundModal";
import ListItemSeparator from "../components/ListItemSeparator";
import {LinearGradient} from "expo-linear-gradient";
import useUploadImage from "../hooks/useUploadImage";
import {getUserImagesEdit} from "../store/slices/authSlice";
import AppUploadModal from "../components/AppUploadModal";
import AppShowImage from "../components/AppShowImage";


function UserCompteScreen({navigation}) {

    const store = useStore()
    const dispatch = useDispatch()
    const {isAdmin} = useAuth()
    const {formatFonds} = useManageAssociation()
    const {directUpload, dataTransformer} = useUploadImage()

    const selectedUser = useSelector(state => state.auth.user)
    const [avatarImage, setAvatarImage] = useState(selectedUser)
    const [pieceRecto, setPieceRecto] = useState(selectedUser)
    const [pieceVerso, setPieceVerso] = useState(selectedUser)
    const [editFund, setEditFund] = useState(false)
    const [progress, setProgress] = useState(0)
    const [uploadModal, setUploadModal] = useState(false)
    const [editing, setEditing] = useState(false)
    const [imageUrl, setImageUrl] = useState('')
    const [imageModal, setImageModal] = useState(false)

    const isNotPieceRecto = pieceRecto?.piece === null || Object.keys(pieceRecto).length === 0
    const isNotPieceVerso = pieceVerso?.piece === null || Object.keys(pieceVerso).length === 0

    const onChangeAvatar = (image) => {
        setAvatarImage(image)
        setEditing(true)
    }

    const deleteAvatarImage = () => {
        if(Object.keys(avatarImage).length === 0 || avatarImage.avatar === null) {
            return;
        }
        Alert.alert("Alert", "Que voulez-vous faire de l'image?", [{text: 'supprimer', onPress: () => {
            return setAvatarImage(selectedUser)
            }}, {text: 'afficher', onPress: () => {
                const url = avatarImage.avatar?avatarImage.avatar : avatarImage.url
                setImageUrl(url)
                setImageModal(true)
            }}])
    }

    const selectPieceRecto = (image) => {
        setPieceRecto(image)
        setEditing(true)
    }

    const selectPieceVerso = (image) => {
        setPieceVerso(image)
        setEditing(true)
    }

    const handleSaveImages = async () => {
        const validPiece = Object.keys(pieceRecto).length >0 && Object.keys(pieceVerso).length>0
        const validAvatar = Object.keys(avatarImage).length>0
        const imagesArray = [avatarImage, pieceRecto, pieceVerso]
        const transformedArray = dataTransformer(imagesArray)
        setProgress(0)
        setUploadModal(true)
        const result = await directUpload(transformedArray, imagesArray, (progress) => {
            setProgress(progress)
        })
        setUploadModal(false)
        if(!result) {
            return alert("Nous n'avons pas pu valider les images, veuillez reessayer plutard.")
        }
        const signedUrlArray = store.getState().uploadImage.signedRequestArray
        const data = {
            userId: selectedUser.id,
            avatarUrl: validAvatar?signedUrlArray[0].url : '',
            pieces: validPiece?[signedUrlArray[1].url, signedUrlArray[2].url] : []
        }
        await dispatch(getUserImagesEdit(data))
        const error = store.getState().auth.error
        if(error !== null) {
            return alert("Nous n'avons pas pu valider les images, veuillez reessayer plutard")
        }
        alert("Vos images ont été editées avec succès.")
    }

    const handleShowImage = (url) => {
        setImageUrl(url)
        setImageModal(true)
    }

    return (
        <>
        <ScrollView>
            <LinearGradient
                colors={['#860432', 'transparent']}
                style={styles.background}
            />
            <View>
            <View style={styles.header}>
                <View>
                    <AppAvatar source={{uri: avatarImage.avatar || avatarImage.url}} avatarStyle={styles.avatarStyle} user={selectedUser} onDelete={deleteAvatarImage}/>
                    <AppImagePicker
                        iconSize={20}
                        cameraStyle={{height: 40, width: 40}}
                        cameraContainer={{
                            position: 'absolute',
                            right: -20,
                            bottom: 10
                        }}
                        onSelectImage={onChangeAvatar}/>
                </View>
                <View style={{marginBottom: 30}}>
                    <AppText>{selectedUser.username}</AppText>
                    <AppText>{selectedUser.email}</AppText>
                </View>

            </View>
            </View>
            <View style={styles.walletContent}>
            <View style={styles.wallet}>
                <LottieView style={{ width: 150}} autoPlay={true} loop={true} source={require('../../assets/animations/wallet-animation')}/>
                <AppText style={styles.walletText}>{formatFonds(selectedUser.wallet)}</AppText>
            </View>
                <TouchableOpacity onPress={() => {
                    if (selectedUser.wallet <= 0) {
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
            <View style={styles.piece}>
                 <View>
                    {isNotPieceRecto &&  <View style={styles.pieceContent}>
                   <AppText style={{fontSize: 12}}>Choisir pièce recto</AppText>
                 </View>}
                    {pieceRecto !== null && <TouchableWithoutFeedback onPress={() => {
                        const url = selectedUser.piece?selectedUser.piece[0] : pieceRecto.url
                        handleShowImage(url)
                    }}>
                    <Image source={{uri: selectedUser.piece?pieceRecto.piece[0] : pieceRecto.url}} style={styles.pieceContent}/>
                    </TouchableWithoutFeedback>
                    }
                    <View style={styles.rectoCamera}>
                        <AppImagePicker cameraStyle={styles.cameraStyle} onSelectImage={selectPieceRecto}/>
                    </View>
                </View>
                <View>
                    {isNotPieceVerso && <View  style={styles.pieceContent}>
                  <AppText style={{fontSize: 12}}>Choisir pièce verso</AppText>
                  </View>}
                  {pieceVerso !== null && <TouchableWithoutFeedback onPress={() => {
                      const url = selectedUser.piece?selectedUser.piece[1] : pieceVerso.url
                      handleShowImage(url)
                  }}>
                  <Image source={{uri: selectedUser.piece?selectedUser.piece[1] : pieceVerso.url}} style={styles.pieceContent}/>
                  </TouchableWithoutFeedback>
                  }
                    <View style={styles.versoCamera}>
                        <AppImagePicker cameraStyle={styles.cameraStyle} onSelectImage={selectPieceVerso}/>
                    </View>
                </View>
            </View>
            <View style={{marginVertical: 10}}>
                <ListItemSeparator/>
            </View>
            <AppSimpleLabelWithValue label='Nom' labelValue={selectedUser.nom?selectedUser.nom:'renseignez votre nom'}/>
            <AppSimpleLabelWithValue label='Prenom' labelValue={selectedUser.prenom?selectedUser.prenom:'renseignez votre prenom'}/>
            <AppSimpleLabelWithValue label='Phone' labelValue={selectedUser.phone?selectedUser.phone:'renseignez votre phone'}/>
            <AppSimpleLabelWithValue label='Adresse' labelValue={selectedUser.adresse?selectedUser.adresse:'renseignez votre adresse'}/>

            <TouchableWithoutFeedback onPress={() => navigation.navigate(routes.EDIT_USER_COMPTE)}>
                <View elevation={10} style={styles.editInfo}>
                    <MaterialCommunityIcons name='account-edit' size={30} color={defaultStyles.colors.bleuFbi}/>
                    <AppText style={styles.editInfoButton}>Editer</AppText>
                </View>
            </TouchableWithoutFeedback>
            {editing && <View style={styles.editImage}>
                <AppButton onPress={handleSaveImages}
                    iconSize={20} title='Valider les images'
                    otherButtonStyle={styles.editImageButton}
                    iconName='content-save-edit'/>
            </View>}

            <TouchableOpacity onPress={() => navigation.navigate('Transaction')} style={styles.transaction}>
                <MaterialCommunityIcons name="wallet-outline" size={24} color="black" />
                <AppText style={{color: defaultStyles.colors.bleuFbi, fontWeight: 'bold', marginLeft: 5}}>Transactions</AppText>
            </TouchableOpacity>

        </ScrollView>
            <EditFundModal editVisible={editFund} closeFundModal={() => setEditFund(false)}/>
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
        width: 130,
        marginTop: -50,
        marginHorizontal: 10,
        borderRadius: 10
    },
    background: {
        height: 100,
        width: '100%',
    },
    cameraStyle: {
      height: 45,
      width: 45
    },
    editInfo:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginVertical: 20,
        marginHorizontal: 20
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
        flexDirection: 'row',
        alignItems: 'center'
    },
    transaction: {
        marginBottom: 20,
        marginHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center'
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
        height: 50,
        width: 150,
        backgroundColor: defaultStyles.colors.white
    },
})
export default UserCompteScreen;