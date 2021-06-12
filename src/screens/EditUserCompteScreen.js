import React from 'react';
import {ScrollView, Alert} from "react-native";
import * as Yup from 'yup'
import {AppForm, AppFormField, FormSubmitButton} from "../components/form";
import {useDispatch, useSelector, useStore} from "react-redux";
import {saveEditInfo} from "../store/slices/authSlice";
import AppActivityIndicator from "../components/AppActivityIndicator";


const validInfo = Yup.object().shape({
    nom: Yup.string(),
    prenom: Yup.string(),
    username: Yup.string(),
    email: Yup.string().email("email invalide"),
    phone: Yup.string(),
    profession: Yup.string(),
    emploi: Yup.string(),
    adresse: Yup.string()
})
function EditUserCompteScreen({navigation}) {
    const dispatch = useDispatch()
    const store = useStore()

    const currentUser = useSelector(state => state.auth.user)
    const isLoading = useSelector(state => state.auth.loading)

    const saveUserEdit = async (userInfo) => {
        const data = {...userInfo, id: currentUser.id}
        await dispatch(saveEditInfo(data))
        const error = store.getState().auth.error
        if(error !== null) {
            return alert("Nous n'avons pas pu mettre à jour vos infos. Veuillez reessayer plutard")
        }
        Alert.alert("Felicitation:", "Vos infos ont été mises à jour avec succès.", [{text: 'ok', onPress: () => {
            navigation.goBack()
            }}])
    }

    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
        <ScrollView>
           <AppForm
               validationSchema={validInfo}
               initialValues={{
                   nom: currentUser.nom,
                   prenom: currentUser.prenom,
                   username: currentUser.username,
                   email: currentUser.email,
                   phone: currentUser.phone,
                   profession: currentUser.profession,
                   emploi: currentUser.emploi,
                   adresse: currentUser.adresse
               }} onSubmit={saveUserEdit}>
               <AppFormField name='nom' placeholder='nom'/>
               <AppFormField name='prenom' placeholder='prenom'/>
               <AppFormField name='username' placeholder='pseudo'/>
               <AppFormField name='email' placeholder='email'/>
               <AppFormField name='phone' placeholder='telephone'/>
               <AppFormField name='profession' placeholder='profession'/>
               <AppFormField name='emploi' placeholder='emploi'/>
               <AppFormField name='adresse' placeholder='autres adresses (ville-quartier)'/>
               <FormSubmitButton title='Valider'/>
           </AppForm>
        </ScrollView>
            </>
    );
}

export default EditUserCompteScreen;