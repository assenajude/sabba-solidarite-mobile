import React, {useEffect, useState} from 'react';
import {View, ScrollView} from "react-native";
import AppLogoInfo from "../components/AppLogoInfo";
import AppKeyboard from "../components/AppKeyboard";
import AppCodeInput from "../components/AppCodeInput";
import AppText from "../components/AppText";
import defaultStyles from '../utilities/styles'
import routes from "../navigation/routes";
import {useDispatch, useSelector, useStore} from "react-redux";
import {signinByPin} from "../store/slices/authSlice";
import AppActivityIndicator from "../components/AppActivityIndicator";
import * as Linking from "expo-linking";
import LoginFailedModal from "../components/user/LoginFailedModal";
import useAuth from "../hooks/useAuth";
import {getAllAssociation} from "../store/slices/associationSlice";
import {getConnectedUserAssociations} from "../store/slices/memberSlice";
import AppTextInput from "../components/AppTextInput";

function CodeLoginScreen({navigation, route}) {
    const whereToGo = route.params

    const dispatch = useDispatch()
    const store = useStore()
    const {notifNavig} = useAuth()
    const [codeArray, setCodeArray] = useState([])
    const isLoading = useSelector(state => state.auth.loading)
    const [loginFailed, setLoginFailed] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState('')
    const [numberError, setNumberError] = useState(false)

    const handleLogin = async () => {
        if(phoneNumber.length === 0) {
             alert('Veuillez entrer votre numero de telephone svp.')
            setCodeArray([])
            return;
        }
        const stringNumber = codeArray.join('')
        await dispatch(signinByPin({codePin: stringNumber, phone: phoneNumber}))
        setCodeArray([])
        const error = store.getState().auth.error
        if(error !== null) {
           setLoginFailed(true)
            return;
        }
        dispatch(getAllAssociation())
        dispatch(getConnectedUserAssociations())
        if(whereToGo) {
            const currentParams =  await notifNavig(whereToGo)
            navigation.navigate(whereToGo.mainNavig, {screen: whereToGo.nestedNavig,params:currentParams})
        } else {
            navigation.navigate(routes.STARTER)
        }
    }
    useEffect(() => {
        if(codeArray.length === 4) {
            handleLogin()
        }
    }, [codeArray])

    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
        <ScrollView
            contentContainerStyle={{
            paddingBottom: 50
        }}>
            <View style={{
                marginVertical: 20
            }}>
            <AppLogoInfo/>
            </View>
            <View style={{
                marginHorizontal: 40,
                marginVertical: 40
            }}>
                <AppTextInput
                    onBlur={() => {
                        if(phoneNumber.length !== 10) {
                            setNumberError(true)
                        }else {
                            setNumberError(false)
                        }
                    }}
                    maxLength={10}
                    keyboardType='numeric'
                    label='Numero de telephone'
                    icon='cellphone'
                    value={phoneNumber}
                    onChangeText={val => setPhoneNumber(val)
                    }/>
                    {numberError && <AppText
                        style={{
                            color: defaultStyles.colors.rougeBordeau,
                            padding: 5,
                            backgroundColor: defaultStyles.colors.white}}>Le numero n'est pas correct</AppText>}
            </View>
            <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <View style={{
                    flexDirection: 'row'
                }}>
                    <AppCodeInput
                        isValid={String(codeArray[0]) && codeArray.length >= 1}
                        inputValue={String(codeArray[0])}/>
                    <AppCodeInput
                        isValid={String(codeArray[1]) && codeArray.length >= 2}
                        inputValue={String(codeArray[1])}/>
                    <AppCodeInput
                        isValid={String(codeArray[2]) && codeArray.length >= 3}
                        inputValue={String(codeArray[2])}/>
                    <AppCodeInput
                        isValid={String(codeArray[3]) && codeArray.length >= 4}
                        inputValue={String(codeArray[3])}/>
                </View>

                <AppKeyboard
                    deleteFocused={() => setCodeArray(() => {
                        const removedItem = codeArray.pop()
                        const newArray = codeArray.filter(item => item !== removedItem)
                        return newArray
                    })}
                    pressKey0={() => setCodeArray([...codeArray, 0])}
                    pressKey1={() => setCodeArray([...codeArray, 1])}
                    pressKey2={() => setCodeArray([...codeArray, 2])}
                    pressKey3={() => setCodeArray([...codeArray, 3])}
                    pressKey4={() => setCodeArray([...codeArray, 4])}
                    pressKey5={() => setCodeArray([...codeArray, 5])}
                    pressKey6={() => setCodeArray([...codeArray, 6])}
                    pressKey7={() => setCodeArray([...codeArray, 7])}
                    pressKey8={() => setCodeArray([...codeArray, 8])}
                    pressKey9={() => setCodeArray([...codeArray, 9])}
                />
            </View>
            <View style={{
                marginHorizontal: 20,
            }}>
                <View>
                    <AppText>Code PIN oublié?</AppText>
                    <AppText
                        style={{color: defaultStyles.colors.bleuFbi}}
                        onPress={() => Linking.openURL('tel:0708525827')}>Contactez nous.</AppText>
                </View>
                <View style={{
                    marginTop: 10
                }}>
                    <AppText>Pas de compte PIN?</AppText>
                    <AppText
                        onPress={() => navigation.navigate(routes.CODE_REGISTER)}
                        style={{color: defaultStyles.colors.bleuFbi}}>Créer un.</AppText>
                </View>
            </View>
        </ScrollView>
            <LoginFailedModal
                dismissModal={() => setLoginFailed(false)}
                failModal={loginFailed}/>
            </>
    );
}

export default CodeLoginScreen;