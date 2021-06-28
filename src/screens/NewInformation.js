import React from 'react';
import {ScrollView, ToastAndroid} from "react-native";
import * as Yup from 'yup'
import {AppForm, AppFormField, FormSubmitButton} from "../components/form";
import AppTimePicker from "../components/AppTimePicker";
import {useDispatch, useSelector, useStore} from "react-redux";
import {addInfo} from "../store/slices/informationSlice";
import AppActivityIndicator from "../components/AppActivityIndicator";

const infoValid = Yup.object().shape({
    title: Yup.string().required("Le titre est requis.").min(5,"Le titre doit etre de 5 caractères au moins."),
    content: Yup.string(),
    dateDebut: Yup.date(),
    dateFin: Yup.date()
})
function NewInformationScreen(props) {
    const dispatch = useDispatch()
    const store = useStore()
    const cunrrentAssociation = useSelector(state => state.entities.association.selectedAssociation)
    const isLoading = useSelector(state => state.entities.information.loading)

    const handleSaveInfo = async (info, {resetForm}) => {
        const data = {
            title: info.title,
            content: info.content,
            dateDebut: info.dateDebut.getTime(),
            dateFin: info.dateFin.getTime(),
            associationId: cunrrentAssociation.id}
        await dispatch(addInfo(data))
        const error = store.getState().entities.information.error
        if(error !== null) {
            return alert("Une erreur est apparue, veuillez reessayer plutard.")
        }
        ToastAndroid.showWithGravity("Info ajoutée avec succès.",
            ToastAndroid.LONG,
            ToastAndroid.CENTER
        )
        resetForm()
    }
    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
        <ScrollView contentContainerStyle={{
            marginHorizontal: 20,
            marginTop: 40
        }}>
            <AppForm initialValues={{
                title: '',
                content: '',
                dateDebut: new Date(),
                dateFin: new Date()
            }}
                     validationSchema={infoValid}
                     onSubmit={handleSaveInfo}>
                <AppFormField name='title' placeholder='titre'/>
                <AppFormField name='content' placeholder='contenu'/>
                <AppTimePicker label='Date debut' name='dateDebut'/>
                <AppTimePicker label='Date fin' name='dateFin'/>
                <FormSubmitButton title='Ajouter'/>
            </AppForm>
        </ScrollView>
            </>
    );
}

export default NewInformationScreen;