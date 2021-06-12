import React from 'react';
import {ScrollView} from "react-native";
import * as Yup from 'yup'
import {AppForm, AppFormField, FormSubmitButton} from "../components/form";
import AppTimePicker from "../components/AppTimePicker";
import {useDispatch, useSelector} from "react-redux";
import {addInfo} from "../store/slices/informationSlice";

const infoValid = Yup.object().shape({
    title: Yup.string(),
    content: Yup.string(),
    dateDebut: Yup.date(),
    dateFin: Yup.date()
})
function NewInformationScreen(props) {
    const dispatch = useDispatch()
    const cunrrentAssociation = useSelector(state => state.entities.association.selectedAssociation)

    const handleSaveInfo = (info) => {
        const data = {
            title: info.title,
            content: info.content,
            dateDebut: info.dateDebut.getTime(),
            dateFin: info.dateFin.getTime(),
            associationId: cunrrentAssociation.id}
        dispatch(addInfo(data))
    }
    return (
        <ScrollView>
            <AppForm initialValues={{
                title: '',
                content: '',
                dateDebut: new Date(),
                dateFin: new Date()
            }}
                     validationSchema={infoValid}
                     onSubmit={handleSaveInfo}>
                <AppFormField name='title'/>
                <AppFormField name='content'/>
                <AppTimePicker label='Date debut' name='dateDebut'/>
                <AppTimePicker label='Date fin' name='dateFin'/>
                <FormSubmitButton title='Ajouter'/>
            </AppForm>
        </ScrollView>
    );
}

export default NewInformationScreen;