import React, {useRef} from 'react';
import {View,  ScrollView, StyleSheet} from "react-native";
import * as Yup from 'yup'

import AppLogoInfo from "../components/AppLogoInfo";
import AppForm from "../components/form/AppForm";
import AppFormField from "../components/form/AppFormField";
import FormSubmitButton from "../components/form/FormSubmitButton";
import AppText from "../components/AppText";
import defaultStyles from '../utilities/styles'
import routes from "../navigation/routes";
import {useDispatch, useSelector, useStore} from "react-redux";
import {register} from "../store/slices/authSlice";
import AppActivityIndicator from "../components/AppActivityIndicator";
import GradientScreen from "../components/GradientScreen";


const registerValidSchema = Yup.object().shape({
    username: Yup.string(),
    email: Yup.string().email("Email invalide").required("Email requis"),
    password: Yup.string().min(4,"Le mot de passe doit contenir au moins 4 caractères").required('le mot de passe est requis'),
    confirm:Yup.string().when("password", {
        is: val => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
            [Yup.ref("password")],
            "Les mots de passe  ne correspondent pas."
        )
    }).required("Veuillez confirmer le mot de passe.")
})

function RegisterScreen({navigation}) {
    const store = useStore()
    const dispatch = useDispatch()
    const isLoading = useSelector(state => state.auth.loading)

    const emailRef = useRef()
    const passRef = useRef()
    const confirmRef = useRef()

    const handleRegister = async (data, {resetForm}) => {
        await dispatch(register(data))
        const error = store.getState().auth.error
        if(error !== null)return alert("Une erreur est survenue. Veuillez reessayer plutard.")
        resetForm()
        navigation.navigate(routes.LOGIN)
    }

    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
        <GradientScreen>
            <ScrollView>
            <View style={styles.logoInfoContainer}>
               <AppLogoInfo/>
            </View>
        <View contentContainerStyle={styles.container}>
            <View style={{
                marginHorizontal: 20
            }}>
            <AppForm
                initialValues={{
                username: '',
                email: '',
                password: '',
                confirm: ''
            }}
                validationSchema={registerValidSchema}
                onSubmit={handleRegister}
            >
                <AppFormField
                    autoCapitalize='none'
                    name='username'
                    placeholder='pseudo'
                    icon='account'
                    returnKeyType='next'
                    onSubmitEditing={() => emailRef.current.focus()}
                />
                <AppFormField
                    autoCapitalize='none'
                    name='email'
                    placeholder='email'
                    icon='email'
                    keyboardType='email-address'
                    returnKeyType='next'
                    formFielRef={emailRef}
                    onSubmitEditing={() => passRef.current.focus()}
                />
                <AppFormField
                    autoCapitalize='none'
                    name='password'
                    placeholder='password'
                    icon='lock'
                    secureTextEntry
                    returnKeyType='next'
                    formFielRef={passRef}
                    onSubmitEditing={() => confirmRef.current.focus()}
                />
                <AppFormField
                    autoCapitalize='none'
                    name='confirm'
                    placeholder='confirm password'
                    icon='lock'
                    secureTextEntry
                    formFielRef={confirmRef}
                />
                <FormSubmitButton title='Valider'/>
            </AppForm>
            </View>

            <View style={{
                marginVertical: 20,
                marginHorizontal: 20
            }}>
                <AppText>Vous avez deja un compte EMAIL? </AppText>
                <AppText
                    style={{color: defaultStyles.colors.bleuFbi}}
                    onPress={() => navigation.navigate(routes.LOGIN)}
                >
                    Connectez-vous</AppText>
            </View>

            <View style={{
                marginBottom: 20,
                marginHorizontal: 20
            }}>
                <AppText>Vous preferez un compte PIN? </AppText>
                <AppText
                    style={{color: defaultStyles.colors.bleuFbi}}
                    onPress={() => navigation.navigate(routes.CODE_REGISTER)}
                >
                    Créer un</AppText>
            </View>
        </View>
            </ScrollView>
            </GradientScreen>
            </>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
        marginHorizontal: 20,
        paddingBottom: 40,
    },
    logoInfoContainer: {
        alignItems: 'center',
        width: '100%',
        marginBottom: 40
    }
})
export default RegisterScreen;