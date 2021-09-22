import React, {useRef} from 'react';
import {ScrollView, Alert} from "react-native";
import * as Yup from 'yup'
import {AppForm, AppFormField, FormSubmitButton} from "../components/form";
import {useDispatch, useSelector, useStore} from "react-redux";
import {saveEditInfo} from "../store/slices/authSlice";
import AppActivityIndicator from "../components/AppActivityIndicator";
import routes from "../navigation/routes";


const validInfo = Yup.object().shape({
    nom: Yup.string().required("Le nom est requis."),
    prenom: Yup.string().required("Le prenom est requis"),
    username: Yup.string().nullable(),
    email: Yup.string().email("email invalide"),
    phone: Yup.string().label("Vous devez choisir un numero de telephone").length(10, "Le numero de telephone doit etre de 10 chiffres").required("Le numero de telephone est requis"),
    profession: Yup.string().nullable(),
    emploi: Yup.string().label("L'emploi doit être de type chaine de caractère").nullable(),
    adresse: Yup.string().required("L'adresse est requise")
})
function EditUserCompteScreen({navigation, route}) {
    const dispatch = useDispatch()
    const store = useStore()

    // const currentUser = useSelector(state => state.auth.user)
    const currentUser = route.params
    const isLoading = useSelector(state => state.auth.loading)
    const nameRef = useRef()
    const userNameRef = useRef()
    const emailRef = useRef()
    const phoneRef = useRef()
    const professionRef = useRef()
    const emploiRef = useRef()
    const adresseRef = useRef()

    const saveUserEdit = async (userInfo) => {
        const data = {...userInfo, id: currentUser.id}
        await dispatch(saveEditInfo(data))
        const error = store.getState().auth.error
        if(error !== null) {
            return alert("Nous n'avons pas pu mettre à jour vos infos. Veuillez reessayer plutard")
        }
        Alert.alert("Felicitation:", "Vos infos ont été mises à jour avec succès.", [{text: 'ok', onPress: () => {
            const updatedUser = store.getState().auth.user
            navigation.navigate(routes.USER_COMPTE, updatedUser)
            }}])
    }

    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
        <ScrollView
            contentContainerStyle={{
                marginHorizontal: 20,
                marginVertical: 20,
                paddingBottom: 40
            }}>
           <AppForm
               validationSchema={validInfo}
               initialValues={{
                   nom: currentUser.nom?currentUser.nom: '',
                   prenom: currentUser.prenom?currentUser.prenom : '',
                   username: currentUser.username,
                   email: currentUser.email,
                   phone: currentUser.phone?currentUser.phone : '',
                   profession: currentUser.profession,
                   emploi: currentUser.emploi,
                   adresse: currentUser.adresse?currentUser.adresse : ''
               }} onSubmit={saveUserEdit}>
               <AppFormField
                   onSubmitEditing={() => nameRef.current.focus()}
                   returnKeyType='next'  name='nom' placeholder='nom'/>
               <AppFormField
                   onSubmitEditing={() => userNameRef.current.focus()}
                   returnKeyType='next' formFielRef={nameRef} name='prenom' placeholder='prenom'/>
               <AppFormField
                   onSubmitEditing={() => emailRef.current.focus()}
                   returnKeyType='next' formFielRef={userNameRef} name='username' placeholder='pseudo'/>
               <AppFormField
                   keyboardType='email-address'
                   onSubmitEditing={() => phoneRef.current.focus()}
                   returnKeyType='next' formFielRef={emailRef} name='email' placeholder='email'/>
               <AppFormField
                   onSubmitEditing={() => professionRef.current.focus()}
                   returnKeyType='next' formFielRef={phoneRef} name='phone'  placeholder='telephone'/>
               <AppFormField
                   onSubmitEditing={() => emploiRef.current.focus()}
                   returnKeyType='next' formFielRef={professionRef} name='profession' placeholder='profession'/>
               <AppFormField
                   onSubmitEditing={() => adresseRef.current.focus()}
                   returnKeyType='next' formFielRef={emploiRef} name='emploi' placeholder='emploi'/>
               <AppFormField name='adresse' formFielRef={adresseRef} placeholder='autres adresses (ville-quartier)'/>
               <FormSubmitButton title='Valider'/>
           </AppForm>
        </ScrollView>
            </>
    );
}

export default EditUserCompteScreen;