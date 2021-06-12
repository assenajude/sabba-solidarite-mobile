import React, {useState} from 'react';
import {ScrollView, ToastAndroid} from "react-native";
import * as Yup from 'yup'

import {AppForm, AppFormField, FormSubmitButton} from "../components/form";
import {useDispatch, useSelector, useStore} from "react-redux";
import {addNewCotisation} from "../store/slices/cotisationSlice";
import useCotisation from "../hooks/useCotisation";
import AppTimePicker from "../components/AppTimePicker";
import AppActivityIndicator from "../components/AppActivityIndicator";
import FormItemPicker from "../components/form/FormItemPicker";

const validCotisation = Yup.object().shape({
    typeCotisation: Yup.string(),
    montant: Yup.number().required('Indiquez un montant'),
    motif: Yup.string().min(5, 'Donnez un motif explicatif'),
    dateDebut: Yup.date(),
    dateFin: Yup.date()
})

function NewCotisationScreen(props) {
    const store = useStore()
    const dispatch = useDispatch()
    const {getMonthString} = useCotisation()

    const isLoading = useSelector(state => state.entities.cotisation.loading)
    const selectedAssociation = useSelector(state => state.entities.association.selectedAssociation)

    const [initMotif, setInitMotif] = useState(() => {
        let motif = ''
        const currentDate = new Date()
        const currentMonth = currentDate.getMonth() + 1
         motif = `Cotisation mensuelle du Mois de ${getMonthString(currentMonth)}`
        return motif
    })

    const handleAddCotisation = async (cotisation, {resetForm}) => {

            const debut = cotisation.dateDebut.getTime()
            const fin = cotisation.dateFin.getTime()

             const data = {
                 typeCotisation: cotisation.typeCotisation,
                 montant: cotisation.montant,
                 motif: cotisation.motif,
                 dateDebut: debut,
                 dateFin: fin,
                 associationId: selectedAssociation.id,
         }
             await dispatch(addNewCotisation(data))

         const error = store.getState().entities.cotisation.error
         if(error !== null) {
             ToastAndroid.showWithGravity("Erreur: Impossible de valider la cotisation",
                 ToastAndroid.LONG,
                 ToastAndroid.CENTER)
             return;
         }
         ToastAndroid.showWithGravityAndOffset("Succès: cotisation payée",
             ToastAndroid.LONG,
             ToastAndroid.BOTTOM,
             40,
             250
         )
         resetForm()
    }


    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
        <ScrollView contentContainerStyle={{paddingVertical: 20, paddingHorizontal: 20}}>
            <AppForm initialValues={{
                typeCotisation: 'mensuel',
                montant: '',
                motif: initMotif,
                dateDebut: new Date(),
                dateFin: new Date()
            }}
                     validationSchema={validCotisation}
                     onSubmit={handleAddCotisation}>
                <FormItemPicker label='Type Cotisation: ' name='typeCotisation' data={['mensuel', 'exceptionnel']}/>
                <AppFormField keyboardType='numeric' textAlign='center' width={200} name='montant' placeholder='montant'/>
                <AppFormField name='motif'/>
                <AppTimePicker name='dateDebut' label='Date de debut'/>
                <AppTimePicker name='dateFin' label='Date de fin'/>
                <FormSubmitButton title='Cotiser'/>
            </AppForm>
        </ScrollView>
        </>
    );

}

export default NewCotisationScreen;