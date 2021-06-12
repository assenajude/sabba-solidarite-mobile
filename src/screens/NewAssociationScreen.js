import React, {useState} from 'react';
import {ScrollView, Alert} from "react-native";
import * as Yup from 'yup'
import {AppForm, AppFormField, FormSubmitButton} from '../components/form'
import {addNewAssociation} from "../store/slices/associationSlice";
import {useDispatch, useStore} from "react-redux";
import FormImagePicker from "../components/form/FormImagePicker";
import AppUploadModal from "../components/AppUploadModal";
import useUploadImage from "../hooks/useUploadImage";

const newAssociationValidSchema = Yup.object().shape({
    nom: Yup.string(),
    decription: Yup.string(),
    cotisationMensuelle: Yup.number(),
    frequenceCotisation: Yup.string(),
    fondInitial: Yup.number(),
    seuilSecurite: Yup.number(),
    interetCredit: Yup.number(),
    avatar: Yup.object()
})
function NewAssociationScreen({navigation, route}) {
    const selectedAssociation = route.params

    const {directUpload, dataTransformer} = useUploadImage()
    const store = useStore()
    const dispatch = useDispatch()

    const [progress, setProgresss] = useState(0)
    const [uploadModal, setUploadModal] = useState(false)

    const handleNewAssociation = async(data) => {
        const avatarArray = [data.avatar]
        let newData = {}
        if(Object.keys(avatarArray[0]).length === 0) {
            newData = {
                nom:data.nom,
                avatar: '',
                description: data.description,
                cotisationMensuelle: data.cotisationMensuelle,
                frequenceCotisation: data.frequenceCotisation,
                fondInitial: data.fondInitial,
                seuilSecurite: data.seuilSecurite,
                interetCredit: data.interetCredit
            }
        } else {
            const transmedArray = dataTransformer(avatarArray)
            setProgresss(0)
            setUploadModal(true)
            const result = await directUpload(transmedArray, avatarArray, (progress) => {
                setProgresss(progress)
            })
            setUploadModal(false)
            if(!result) {
                Alert.alert("Erreur", "Les images n'ont pas été telechargées, voulez-vous continuer?",
                    [{text: 'oui', onPress: () => {
                            newData = {
                                nom:data.nom,
                                avatar: '',
                                description: data.description,
                                cotisationMensuelle: data.cotisationMensuelle,
                                frequenceCotisation: data.frequenceCotisation,
                                fondInitial: data.fondInitial,
                                seuilSecurite: data.seuilSecurite,
                                interetCredit: data.interetCredit
                            }
                        }}, {text: 'non', onPress: () => {
                            return;
                        }}])
            }
            const signedArray = store.getState().uploadImage.signedRequestArray
            const avatarUrl = signedArray[0].url
            newData = {
                nom:data.nom,
                avatar: avatarUrl,
                description: data.description,
                cotisationMensuelle: data.cotisationMensuelle,
                frequenceCotisation: data.frequenceCotisation,
                fondInitial: data.fondInitial,
                seuilSecurite: data.seuilSecurite,
                interetCredit: data.interetCredit
            }
        }
        await dispatch(addNewAssociation(newData))
        const error = store.getState().entities.association.error
        if(error !== null) return alert('error adding new association')
        alert("success!!!")
        navigation.goBack()
    }
    return (
        <>
        <ScrollView
            contentContainerStyle={{
                padding: 10
            }}>
            <AppForm
                initialValues={{
                    avatar: selectedAssociation?{url: selectedAssociation.avatar}: {},
                    nom:selectedAssociation?selectedAssociation.nom : '',
                    description:selectedAssociation?selectedAssociation.description : '',
                    cotisationMensuelle:selectedAssociation?String(selectedAssociation.cotisationMensuelle) : '',
                    frequenceCotisation: selectedAssociation?selectedAssociation.frequenceCotisation : '',
                    fondInitial: selectedAssociation?String(selectedAssociation.fondInitial) : '',
                    seuilSecurite: selectedAssociation?String(selectedAssociation.seuilSecurite) : '',
                    interetCredit: selectedAssociation?String(selectedAssociation.interetCredit) : ''
                }}
                validationSchema={newAssociationValidSchema}
                onSubmit={handleNewAssociation}
            >
                <FormImagePicker name='avatar'/>
                <AppFormField name='nom' placeholder='nom'/>
                <AppFormField name='description' placeholder='description'/>
                <AppFormField name='cotisationMensuelle' placeholder='cotisation mensuelle'/>
                <AppFormField name='frequenceCotisation' placeholder='frequence cotisation'/>
                <AppFormField name='fondInitial' placeholder='fonds initial'/>
                <AppFormField name='seuilSecurite' placeholder='Seuil de securité'/>
                <AppFormField name='interetCredit' placeholder='taux de credit
                '/>
                <FormSubmitButton title='Ajouter'/>
            </AppForm>
        </ScrollView>
            <AppUploadModal progress={progress} uploadModalVisible={uploadModal}/>
            </>
    );
}

export default NewAssociationScreen;