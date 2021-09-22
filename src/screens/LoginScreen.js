import React, {useRef, useState} from 'react';
import { StyleSheet, ScrollView, View} from "react-native";

import AppForm from "../components/form/AppForm";
import AppFormField from "../components/form/AppFormField";
import * as Yup from 'yup'
import FormSubmitButton from "../components/form/FormSubmitButton";
import {useDispatch, useSelector, useStore} from "react-redux";
import * as Linkin from 'expo-linking'
import {signin} from "../store/slices/authSlice";

import defaultStyles from '../utilities/styles'
import AppText from "../components/AppText";
import routes from "../navigation/routes";
import AppLogoInfo from "../components/AppLogoInfo";
import AppActivityIndicator from "../components/AppActivityIndicator";
import {getAllAssociation} from "../store/slices/associationSlice";
import useAuth from "../hooks/useAuth";
import {getConnectedUserAssociations} from "../store/slices/memberSlice";
import LoginFailedModal from "../components/user/LoginFailedModal";

const loginValidSchema = Yup.object().shape({
    info: Yup.string().required('Entrez votre adresse mail ou votre nom utilisateur'),
    password: Yup.string().min(4, 'Le mot de passe doit être de 4 caractères au moins').required("Le mot de passe est requis")
})

function LoginScreen({navigation, route}) {
    const whereToGo = route.params
    const store = useStore()
    const dispatch = useDispatch()
    const {isValidEmail, notifNavig} = useAuth()
    const isLoading = useSelector(state => state.auth.loading)
    const assoLoading = useSelector(state => state.entities.association.loading)

    const [loginFailed, setLoginFailed] = useState(false)

    const passRef = useRef()


    const  validateEmail = (email) => isValidEmail(email)

    const handleLogin = async (userData, {resetForm}) => {
            const valid = validateEmail(userData.info)
            let data = {}
            if(valid) {
                data = {
                    email: userData.info,
                    password: userData.password
                }
            } else {
                data = {
                    username: userData.info,
                    password: userData.password
                }
            }
        await dispatch(signin(data))
        const error = store.getState().auth.error
        if(error !== null) {
         setLoginFailed(true)
            return;
        }
        dispatch(getAllAssociation())
         dispatch(getConnectedUserAssociations())
        resetForm()
        if(whereToGo) {
          const currentParams =  await notifNavig(whereToGo)
            navigation.navigate(whereToGo.mainNavig, {screen: whereToGo.nestedNavig,params:currentParams})
        } else {
            navigation.navigate(routes.STARTER)
        }
    }

    return (
        <>
            <AppActivityIndicator visible={isLoading || assoLoading}/>
        <ScrollView
            contentContainerStyle={{
                marginVertical: 20,
                marginHorizontal: 20,
                paddingBottom:50
            }}>
            <View style={styles.logoInfoContainer}>
                <AppLogoInfo/>
            </View>
            <AppForm
                initialValues={{
                    info: '',
                    password: ''
                }}
                validationSchema={loginValidSchema}
                onSubmit={handleLogin}
            >
                <AppFormField
                    name='info'
                    icon='account'
                    keyboardType='email-address'
                    label='email ou username'
                    returnKeyType='next'
                    autoCapitalize='none'
                    onSubmitEditing={() => passRef.current.focus()}
                />
                <AppFormField
                    formFielRef={passRef}
                    autoCapitalize='none'
                    name='password'
                    icon='lock'
                    label='password'
                    secureTextEntry
                />
                <FormSubmitButton
                    title='Envoyer'
                    iconName='login'/>
            </AppForm>
            <View>
                <AppText style={{color: defaultStyles.colors.bleuFbi}} onPress={() => {
                    if(whereToGo) {
                        navigation.navigate(routes.CODE_LOGIN, whereToGo)
                    }else {
                        navigation.navigate(routes.CODE_LOGIN)
                    }
                }}>Se connecter avec code secret</AppText>
            </View>
            <View style={{
                marginVertical: 10,
            }}>
                <AppText>Vous n'avez pas de compte EMAIL?</AppText>
                <AppText
                    style={{color: defaultStyles.colors.bleuFbi}}
                    onPress={() => navigation.navigate(routes.REGISTER)}>Créez un</AppText>
            </View>
            <View style={{marginBottom: 20}}>
                <AppText>Mot de passe oublié?</AppText>
                <AppText
                    onPress={() => Linkin.openURL('tel:0708525827')}
                    style={{
                        color: defaultStyles.colors.bleuFbi
                    }}
                >Contactez nous.</AppText>
            </View>
        </ScrollView>
                <LoginFailedModal failModal={loginFailed} dismissModal={() => setLoginFailed(false)}/>
            </>
    );
}

const styles = StyleSheet.create({
    logoInfoContainer: {
        alignSelf:'center',
        alignItems: 'center',
        marginBottom: 40,
    }
})
export default LoginScreen;