import React from 'react';
import {ScrollView, ToastAndroid} from "react-native";
import {useDispatch, useSelector, useStore} from "react-redux";
import * as Yup from 'yup'

import {AppForm, AppFormField, FormSubmitButton} from "../components/form";
import {addNewEngagement, getEngagementsByAssociation} from "../store/slices/engagementSlice";
import AppTimePicker from "../components/AppTimePicker";
import FormItemPicker from "../components/form/FormItemPicker";
import AppActivityIndicator from "../components/AppActivityIndicator";
import useAuth from "../hooks/useAuth";

const validEngagement = Yup.object().shape({
    libelle: Yup.string(),
    montant: Yup.number().label("Entrez un montant correct svp."),
    echeance: Yup.date(),
    typeEngagement: Yup.string()
})
function NewEngagementScreen({navigation}) {
    const dispatch = useDispatch()
    const store = useStore()
    const {getConnectedMember} = useAuth()
    const currentAssociation = useSelector(state => state.entities.association.selectedAssociation)
    const isLoading = useSelector(state => state.entities.engagement.loading)

    const handleAddEngagement = async (engagement, {resetForm}) => {
         const montant = Number(engagement.montant)
                const dateEcheance = engagement.echeance.getTime()
                const data = {
                    libelle: engagement.libelle,
                    typeEngagement: engagement.typeEngagement,
                    montant: montant,
                    echeance: dateEcheance,
                    memberId: getConnectedMember().id,
                    associationId: currentAssociation.id}
                await dispatch(addNewEngagement(data))
         const error = store.getState().entities.cotisation.error
         if(error !== null) {
             return alert("Erreur: impossible d'envoyer votre engagement, veuillez reessayer plutard")
         }
         await dispatch(getEngagementsByAssociation({associationId: currentAssociation.id}))
         ToastAndroid.showWithGravityAndOffset('Engagement ajouté avec succès',
             ToastAndroid.LONG,
             ToastAndroid.BOTTOM,
             40,
             250
         )
         resetForm()
         navigation.navigate('NewEngagementList')
    }

    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
        <ScrollView contentContainerStyle={{
            marginHorizontal: 20,
            marginVertical: 20
        }}>
            <AppForm initialValues={{
                libelle: '',
                montant: '',
                typeEngagement: 'remboursable',
                echeance: new Date()
            }} validationSchema={validEngagement} onSubmit={handleAddEngagement}>
                <FormItemPicker label='Type engagement: ' data={['remboursable', 'non remboursable']} name='typeEngagement'/>
                <AppFormField name='libelle' placeholder='libelle' maxLength={50}/>
                <AppFormField keyboardType='numeric' name='montant' placeholder='montant'/>
                <AppTimePicker label='Echeance' name='echeance'/>
                <FormSubmitButton title='Ajouter'/>
            </AppForm>
        </ScrollView>
        </>
    );
}

export default NewEngagementScreen;