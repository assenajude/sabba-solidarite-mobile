import React, {useEffect, useRef, useState} from 'react';
import {ScrollView,ToastAndroid} from "react-native";
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

const newAssociationValidSchema = Yup.object().shape({
    nom: Yup.string(),
    decription: Yup.string(),
    telAdmin: Yup.string().required("Le numero administrateur est obligatoire").max(10, "Le numero administrateur doit etre de 10 caractères maximum"),
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
                    label="Numero administrateur"
                    returnKeyType='next'
                    onSubmitEditing={() => cotisRef.current.focus()}
                    formFielRef={telRef}
                    name='telAdmin'/>
                <AppFormField
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
                    label="fonds de depart"
                />}
                <AppFormField
                    label='seuil de securité des fonds'
                    returnKeyType='next'
                    onSubmitEditing={() => interetRef.current.focus()}
                    formFielRef={seuilRef}
                    name='seuilSecurite'/>
                <AppFormField
                    returnKeyType='next'
                    onSubmitEditing={() => validatorRef.current.focus()}
                    formFielRef={interetRef}
                    name='interetCredit'
                    label="taux d'intéret crédit"
                />
                <AppFormField
                    formFielRef={validatorRef}
                    returnKeyType='next'
                    onSubmitEditing={() => penalityRef.current.focus()}
                    name='validatorsNumber'
                    label='nombre de validateurs de crédit'
                    />
                <AppFormField
                    formFielRef={penalityRef}
                    returnKeyType='next'
                    onSubmitEditing={() => quotiteRef.current.focus()}
                    name='penality'
                    label="pénalité mensuelle crédit"
                />
                <AppFormField
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
            <AppUploadModal closeModal={() => setUploadModal(false)} progress={progress} uploadModalVisible={uploadModal}/>
            </>
    );
}

export default NewAssociationScreen;