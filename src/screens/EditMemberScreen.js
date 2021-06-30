import React from 'react';
import {ScrollView, ToastAndroid} from "react-native";
import * as Yup from 'yup'

import {AppForm, AppFormField, FormSubmitButton} from "../components/form";
import {useDispatch, useSelector, useStore} from "react-redux";
import {getUpdateOneMember} from "../store/slices/memberSlice";
import AppTimePicker from "../components/AppTimePicker";
import AppActivityIndicator from "../components/AppActivityIndicator";

const validMember = Yup.object().shape({
    statut: Yup.string(),
    relation: Yup.string(),
    adhesionDate: Yup.date()
})
function EditMemberScreen({route, navigation}) {
    const store = useStore()
    const selectEdited = route.params
    const dispatch = useDispatch()
    const isLoading = useSelector(state => state.entities.member.loading)

    const handleAddMember = async (member) => {
        let data;
        const dateAdhesion = member.adhesionDate
            data = {
                statut: member.statut,
                relation: member.relation,
                adhesionDate:dateAdhesion.getTime(),
                currentMemberId: selectEdited.member.id
        }
            await dispatch(getUpdateOneMember(data))

        const error = store.getState().entities.member.error
        if (error !== null) {
            return alert('error: impossible de sauvegarder vos données.')
        }else {
            ToastAndroid.showWithGravityAndOffset(
                'Données sauvegardées avec succès',
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
                25,
                50
            );
            navigation.navigate('Members', {screen: 'List'})
        }
    }

    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
        <ScrollView contentContainerStyle={{padding: 20}}>
            <AppForm
                initialValues={{
                    statut: selectEdited? selectEdited.member.statut : '',
                    relation: selectEdited?selectEdited.member.relation: '',
                    adhesionDate: selectEdited?new Date(selectEdited.member.adhesionDate):new Date()
                }}
                validationSchema={validMember}
                onSubmit={handleAddMember}
            >
                <AppFormField name='statut' placeholder='statut'/>
                <AppFormField name='relation' placeholder='type relation'/>
                <AppTimePicker label='date adhesion' name='adhesionDate'/>
                <FormSubmitButton title='Ajouter'/>
            </AppForm>
        </ScrollView>
        </>
    );
}

export default EditMemberScreen;