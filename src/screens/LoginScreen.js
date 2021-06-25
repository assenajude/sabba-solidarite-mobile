import React from 'react';
import { StyleSheet, ScrollView, View} from "react-native";

import AppForm from "../components/form/AppForm";
import AppFormField from "../components/form/AppFormField";
import * as Yup from 'yup'
import FormSubmitButton from "../components/form/FormSubmitButton";
import {useDispatch, useSelector, useStore} from "react-redux";
import {signin} from "../store/slices/authSlice";

import defaultStyles from '../utilities/styles'
import AppText from "../components/AppText";
import routes from "../navigation/routes";
import AppLogoInfo from "../components/AppLogoInfo";
import AppActivityIndicator from "../components/AppActivityIndicator";
import {getAllAssociation, setSelectedAssociation} from "../store/slices/associationSlice";
import {getPopulateReseauList, getUserTransactions} from "../store/slices/transactionSlice";
import {reseauData} from "../utilities/reseau.data";
import useAuth from "../hooks/useAuth";
import {getConnectedUserAssociations, getSelectedAssociationMembers} from "../store/slices/memberSlice";

const loginValidSchema = Yup.object().shape({
    info: Yup.string().required('Entrez votre adresse mail ou votre nom utilisateur'),
    password: Yup.string().min(5, 'Le mot de passe doit être de 5 caractères au moins').required("Le mot de passe est requis")
})

function LoginScreen({navigation, route}) {
    const whereToGo = route.params
    const store = useStore()
    const dispatch = useDispatch()
    const {getInitAssociation} = useAuth()
    const isLoading = useSelector(state => state.auth.loading)
    const assoLoading = useSelector(state => state.entities.association.loading)
    const transacLoading = useSelector(state => state.entities.transaction.loading)

    const  validateEmail = (email) => {
        const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/
        return re.test(email);
    }

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
        if(error !== null) return alert("Le mot de passe et/ou le pseudo n'est pas correct. Veuillez reessayer.")
        dispatch(getAllAssociation())
         dispatch(getConnectedUserAssociations())
        resetForm()
        if(whereToGo) {
            let currentParams
            const currentType = whereToGo.otherParams.type
            const otherParamId = whereToGo.otherParams.id
            if(currentType === 'adhesion'){
                await dispatch(getAllAssociation())
                const associationList = store.getState().entities.association.list
                currentParams = associationList.find(asso => asso.id === otherParamId)
            }
            if(currentType === 'transaction') {
                const justConnected = store.getState().auth.user
                dispatch(getPopulateReseauList(reseauData))
                await dispatch(getUserTransactions({userId: justConnected.id}))
                const lisTransactions = store.getState().entities.transaction.list
                currentParams = lisTransactions.find(transac => transac.id === otherParamId)
            }
            if(currentType === 'cotisation' || currentType === 'engagement') {
                await dispatch(getAllAssociation())
                const listAssociations = store.getState().entities.association.list
                const currentAssociation = listAssociations.find(asso => asso.id === otherParamId)
                dispatch(setSelectedAssociation(currentAssociation))
                await getInitAssociation(currentAssociation)
                currentParams = {screen: whereToGo.otherParams.screen}
            }
            navigation.navigate(whereToGo.mainNavig, {screen: whereToGo.nestedNavig,params:currentParams})
        } else {
            navigation.navigate(routes.STARTER)
        }
    }

    return (
        <>
            <AppActivityIndicator visible={isLoading || assoLoading || transacLoading}/>
            <View style={styles.logoInfoContainer}>
                <AppLogoInfo/>
            </View>
        <ScrollView
            contentContainerStyle={{
                marginVertical: 20,
                marginHorizontal: 20
            }}>
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
                    placeholder='email ou username'
                    returnKeyType='next'
                    autoCapitalize='none'
                />
                <AppFormField
                    autoCapitalize='none'
                    name='password'
                    icon='lock'
                    placeholder='password'
                    secureTextEntry
                />
                <FormSubmitButton title='Envoyer' iconName='login'/>
            </AppForm>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 20,
                marginHorizontal: 40
            }}>
                <AppText>Vous n'avez pas de compte? </AppText>
                <AppText
                    style={{color: defaultStyles.colors.bleuFbi}}
                    onPress={() => navigation.navigate(routes.REGISTER)}>Créez un</AppText>
            </View>
        </ScrollView>
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