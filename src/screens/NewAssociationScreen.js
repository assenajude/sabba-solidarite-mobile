import React, {useEffect, useRef, useState} from 'react';
import {ScrollView,ToastAndroid, View, StyleSheet} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import * as Yup from 'yup'
import {AppForm, AppFormField, FormSubmitButton} from '../components/form'
import {addNewAssociation} from "../store/slices/associationSlice";
import {useDispatch, useSelector, useStore} from "react-redux";
import FormImagePicker from "../components/form/FormImagePicker";
import AppUploadModal from "../components/AppUploadModal";
import useUploadImage from "../hooks/useUploadImage";
import AppActivityIndicator from "../components/AppActivityIndicator";
import routes from "../navigation/routes";
import AppSwith from "../components/AppSwith";
import useAuth from "../hooks/useAuth";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import colors from "../utilities/colors";
import {Modal} from "react-native-paper";
import AppIconButton from "../components/AppIconButton";

const newAssociationValidSchema = Yup.object().shape({
    nom: Yup.string().required('Donner un nom à votre association'),
    description: Yup.string().required("Decrivez votre association"),
    telAdmin: Yup.string().required("Le numero administrateur est obligatoire").min(10, "Le numero doit être de 10 caractères"),
    cotisationMensuelle: Yup.number(),
    frequenceCotisation: Yup.string(),
    fondInitial: Yup.number(),
    seuilSecurite: Yup.number(),
    interetCredit: Yup.number(),
    avatar: Yup.object(),
    validatorsNumber: Yup.number(),
    penality: Yup.number(),
    individualQuotite: Yup.number()
})
function NewAssociationScreen({navigation, route}) {
    const selectedParams = route.params

    const {directUpload, dataTransformer} = useUploadImage()
    const store = useStore()
    const dispatch = useDispatch()
    const {isAdmin} = useAuth()

    const isLoading = useSelector(state => state.entities.association.loading)
    const [oldAssociation, setOldAssociation] = useState(null)
    const connectedUser = useSelector(state => state.auth.user)

    const [progress, setProgresss] = useState(0)
    const [uploadModal, setUploadModal] = useState(false)
    const [valid, setValid] = useState(false)
    const [hideModal, setHideModal] = useState(false)
    const [visible, setVisible] = useState(false)

    const descripRef = useRef()
    const cotisRef = useRef()
    const freqRef = useRef()
    const fondRef = useRef()
    const seuilRef = useRef()
    const interetRef = useRef()
    const validatorRef = useRef()
    const penalityRef = useRef()
    const quotiteRef = useRef()
    const telRef = useRef()

    const handleNewAssociation = async(data) => {
        const avatarArray = [data.avatar]
        const associationId = selectedParams?.selectedAssociation.id?selectedParams?.selectedAssociation.id : null
        const isImage = Object.keys(avatarArray[0])?.length !== 0 && avatarArray[0]?.url !== '' && avatarArray[0]?.url !== undefined
        let imageUploaded = false
        let isTheSameImage = false
        if(isImage) {
            if(oldAssociation && oldAssociation.avatar === avatarArray[0].url) {
                isTheSameImage = true
            } else {
                const transmedArray = await dataTransformer(avatarArray)
                setProgresss(0)
                setUploadModal(true)
                const result = await directUpload(transmedArray, avatarArray, (progress) => {
                    setProgresss(progress)
                })
                setUploadModal(false)
                if(result) imageUploaded = true
            }

        }
        const signedArray = store.getState().uploadImage.signedRequestArray
        const avatarUrl = imageUploaded? signedArray[0]?.url:selectedParams?selectedParams.selectedAssociation.avatar : isTheSameImage?oldAssociation.avatar : ''
        const newData = {
            creatorId: connectedUser.id,
            id: associationId,
            nom:data.nom,
            avatar:avatarUrl,
            description: data.description,
            telAdmin: data.telAdmin,
            cotisationMensuelle: Number(data.cotisationMensuelle),
            frequenceCotisation: data.frequenceCotisation,
            fondInitial: Number(data.fondInitial),
            seuilSecurite: Number(data.seuilSecurite),
            interetCredit: Number(data.interetCredit),
            validatorsNumber: data.validatorsNumber === ''?0:Number(data.validatorsNumber),
            penality: data.penality === ''?0:Number(data.penality),
            individualQuotite: data.individualQuotite === ''?0:Number(data.individualQuotite),
            validation: valid
        }
        await dispatch(addNewAssociation(newData))
        const error = store.getState().entities.association.error
        if(error !== null) return alert('error adding new association')
        ToastAndroid.showWithGravity("L'association a été ajoutée avec succès.", ToastAndroid.LONG, ToastAndroid.CENTER)
        navigation.navigate(routes.ASSOCIATION_LIST, {updated: true})
    }

    useEffect(() => {
        if(selectedParams) {
            setOldAssociation(selectedParams.selectedAssociation)
        }
    }, [])
    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
        <ScrollView
            contentContainerStyle={{
                padding: 10
            }}>
            <View style={styles.infoContainer}>
                <MaterialCommunityIcons
                    color={colors.orange}
                    name='information'
                    size={24} />
                <AppText style={{marginLeft:5}}>Avant de créer une association assurez-vous de consulter </AppText>
            </View>
            <AppButton
                onPress={() => setVisible(true)}
                style={styles.infoButton}
                title='la note de création'
                mode='text' />
            <AppForm
                initialValues={{
                    avatar: selectedParams?.selectedAssociation?.avatar !==''?{url: selectedParams?.selectedAssociation?.avatar}: {},
                    nom:selectedParams?.selectedAssociation?selectedParams?.selectedAssociation.nom : '',
                    description:selectedParams?.selectedAssociation?selectedParams?.selectedAssociation.description : '',
                    telAdmin:selectedParams?.selectedAssociation?selectedParams?.selectedAssociation.telAdmin : '',
                    cotisationMensuelle:selectedParams?.selectedAssociation?String(selectedParams?.selectedAssociation.cotisationMensuelle) : '',
                    frequenceCotisation: selectedParams?.selectedAssociation?selectedParams?.selectedAssociation.frequenceCotisation : '',
                    fondInitial: selectedParams?.selectedAssociation?String(selectedParams?.selectedAssociation.fondInitial) : '',
                    seuilSecurite: selectedParams?.selectedAssociation?String(selectedParams?.selectedAssociation.seuilSecurite) : '',
                    interetCredit: selectedParams?.selectedAssociation?String(selectedParams?.selectedAssociation.interetCredit) : '',
                    validatorsNumber: selectedParams?.selectedAssociation?String(selectedParams?.selectedAssociation.validationLenght) : '',
                    penality: selectedParams?.selectedAssociation?String(selectedParams?.selectedAssociation.penality) : '',
                    individualQuotite: selectedParams?.selectedAssociation?String(selectedParams?.selectedAssociation.individualQuotite) : ''
                }}
                validationSchema={newAssociationValidSchema}
                onSubmit={handleNewAssociation}
            >
                <FormImagePicker name='avatar'/>
                <AppFormField
                    returnKeyType='next'
                    onSubmitEditing={() => descripRef.current.focus()}
                    name='nom'
                    label='nom ou sigle'
                />
                <AppFormField
                    label='description ou signification du sigle'
                    returnKeyType='next'
                    onSubmitEditing={() => telRef.current.focus()}
                    formFielRef={descripRef}
                    name='description'/>
                    <AppFormField
                        keyboardType='numeric'
                        label="Numero administrateur"
                        maxLength={10}
                        returnKeyType='next'
                        onSubmitEditing={() => cotisRef.current.focus()}
                        formFielRef={telRef}
                        name='telAdmin'/>
                <AppFormField
                    keyboardType='numeric'
                    label="montant cotisation"
                    returnKeyType='next'
                    onSubmitEditing={() => freqRef.current.focus()}
                    formFielRef={cotisRef}
                    name='cotisationMensuelle'/>
                <AppFormField
                    label='frequence cotisation (ex: mensuelle)'
                    returnKeyType='next'
                    onSubmitEditing={() => fondRef.current.focus()}
                    formFielRef={freqRef}
                    name='frequenceCotisation'/>
                {isAdmin() && <AppFormField
                    returnKeyType='next'
                    onSubmitEditing={() => seuilRef.current.focus()}
                    formFielRef={fondRef}
                    name='fondInitial'
                    keyboardType='numeric'
                    label="fonds de depart"
                />}
                <AppFormField
                    placeholder='/100'
                    keyboardType='numeric'
                    label='seuil de securité des fonds'
                    returnKeyType='next'
                    onSubmitEditing={() => interetRef.current.focus()}
                    formFielRef={seuilRef}
                    name='seuilSecurite'/>
                <AppFormField
                    placeholder='/100'
                    keyboardType='numeric'
                    returnKeyType='next'
                    onSubmitEditing={() => validatorRef.current.focus()}
                    formFielRef={interetRef}
                    name='interetCredit'
                    label="taux d'intéret crédit"
                />
                <AppFormField
                    keyboardType='numeric'
                    formFielRef={validatorRef}
                    returnKeyType='next'
                    onSubmitEditing={() => penalityRef.current.focus()}
                    name='validatorsNumber'
                    label='nombre de validateurs de crédit'
                    />
                <AppFormField
                    placeholder='/100'
                    keyboardType='numeric'
                    formFielRef={penalityRef}
                    returnKeyType='next'
                    onSubmitEditing={() => quotiteRef.current.focus()}
                    name='penality'
                    label="pénalité mensuelle crédit"
                />
                <AppFormField
                    keyboardType='numeric'
                    formFielRef={quotiteRef}
                    name='individualQuotite'
                    label="Quotité individuelle"
                />
                <FormSubmitButton title="Créer"/>
            </AppForm>
            {isAdmin() && <AppSwith
                label='Validation'
                isEnabled={valid}
                toggleSwitch={() => setValid(!valid)}
            />}
        </ScrollView>
                <Modal
                    visible={visible}
                    onDismiss={() =>setVisible(false)}
                    contentContainerStyle={styles.containerStyle}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        <AppIconButton
                            onPress={() => setVisible(false)}
                            containerStyle={styles.closeButton}
                            iconName='close'
                            iconColor={colors.rougeBordeau}
                        />
                    <View style={styles.labelContainer}>
                        <AppText
                            style={styles.label}>Définition</AppText>
                        <AppText>Une association est pour nous, un groupement de personnes (physiques ou morales) autour d'une même idée en vue d'atteindre un objectif commun. </AppText>
                    </View>
                        <AppText style={{
                            alignSelf: 'center',
                            backgroundColor: colors.rougeBordeau,
                            color: colors.white,
                            padding: 10,
                            marginVertical: 10
                        }}>Désignation des champs</AppText>
                    <View style={styles.labelContainer}>
                        <AppText style={styles.label}>Nom/Sigle</AppText>
                        <AppText>C'est le nom de votre association, vous pouvez utiliser de préférence un sigle.</AppText>
                    </View>
                    <View style={styles.labelContainer}>
                        <AppText style={styles.label}>Description</AppText>
                        <AppText>Expliquez le sigle de votre association ou decrivez la amplement.</AppText>
                    </View>
                    <View style={styles.labelContainer}>
                        <AppText style={styles.label}>Numero adminitrateur</AppText>
                        <AppText>C'est le numero de téléphone du membre chargé de gérer techniquement votre association. C'est par défaut, le créateur de l'association.</AppText>
                    </View>
                    <View style={styles.labelContainer}>
                        <AppText style={styles.label}>Montant cotisation</AppText>
                        <AppText>C'est le montant que doit apporter chaque membre (si vous souhaitez constituer une caisse pour votre association.)</AppText>
                    </View>

                    <View style={styles.labelContainer}>
                        <AppText style={styles.label}>Fréquence cotisation</AppText>
                        <AppText>C'est la période regulière à laquelle les membres doivent faire cotisation (ex: mensuelle)</AppText>
                    </View>

                    <View style={styles.labelContainer}>
                        <AppText style={styles.label}>Seuil de securité des fonds</AppText>
                        <AppText>C'est le pourcentage de la caisse qui ne devait pas être utiliser.(ex: 50)</AppText>
                    </View>

                    <View style={styles.labelContainer}>
                        <AppText style={styles.label}>Taux d'intéret</AppText>
                        <AppText>C'est le taux d'interet (en pourcentage) que vous souhaiteriez appliquer sur les fonds prêtés aux membres (ex: 10).
                            Le membre emprunteur devra donc rembourser le montant emprunté plus les intérets.
                        </AppText>
                    </View>

                        <View style={styles.labelContainer}>
                        <AppText style={styles.label}>Nombre de validateurs de crédit</AppText>
                        <AppText>Chaque engagement (demande de crédit) est soumis au vote (validation) des membres.
                            Vous pouvez donc définir le nombre de membres devant valider un engagement.
                        </AppText>
                        </View>
                    <View style={styles.labelContainer}>
                        <AppText style={styles.label}>Pénalité mensuelle crédit</AppText>
                        <AppText>C'est la pénalité(mensuelle en pourcentage) infligée à tout membre qui ne rembourse pas son engagement à échéance.</AppText>
                    </View>

                    <View style={styles.labelContainer}>
                        <AppText style={styles.label}>Quotité individuelle</AppText>
                        <AppText>C'est la part de la caisse (en pourcentage) mise à la disposition des membres.</AppText>
                    </View>
                    </ScrollView>
                </Modal>
            <AppUploadModal closeModal={() => setUploadModal(false)} progress={progress} uploadModalVisible={uploadModal}/>
            </>
    );
}

const styles = StyleSheet.create({
    containerStyle: {
      backgroundColor: colors.white,
        top: -20,
        paddingHorizontal: 10
    },
    closeButton:{
        alignSelf: 'flex-end',
        marginHorizontal: 10,
        marginVertical: 10
    },
    infoButton:{
        alignSelf: 'flex-start',
        marginLeft: 30,
        marginBottom: 20
    },
    infoContainer: {
        flexDirection: 'row',
        marginHorizontal: 10,
        marginTop: 20
    },
    label: {
        fontWeight: 'bold',
        color:colors.bleuFbi
    },
    labelContainer: {
        marginBottom: 20
    }
})
export default NewAssociationScreen;