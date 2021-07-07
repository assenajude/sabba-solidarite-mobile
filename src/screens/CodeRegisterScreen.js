import React, {useRef} from 'react';
import {View, KeyboardAvoidingView, Platform} from "react-native";
import * as Yup from 'yup'
import AppLogoInfo from "../components/AppLogoInfo";
import {AppForm, AppFormField, FormSubmitButton} from "../components/form";
import {useDispatch, useSelector, useStore} from "react-redux";
import {registerByPin} from "../store/slices/authSlice";
import AppActivityIndicator from "../components/AppActivityIndicator";
import routes from "../navigation/routes";
import AppText from "../components/AppText";
import colors from "../utilities/colors";
import GradientScreen from "../components/GradientScreen";

const validRegister = Yup.object().shape({
    pin: Yup.string().length(4, 'Le code pin doit être de 4 chiffre'),
    confirmPin: Yup.string().when("pin", {
        is: val => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
            [Yup.ref("pin")],
            "Les codes pin ne correspondent pas"
        )
    }).required("Veuillez confirmer le code pin."),
    phone: Yup.string().length(10, "Le numero de telephone doit être de 10 chiffre.").required("Numero de telephone requis")
})
function CodeRegisterScreen({navigation}) {
    const dispatch = useDispatch()
    const store = useStore()
    const isLoading = useSelector(state => state.auth.loading)

    const pinRef = useRef()
    const confirmRef = useRef()
    const phoneRef = useRef()

    const handleCodeRegister = async (data) => {
        const registerData = {
            codePin: data.pin,
            phone: data.phone
        }
        await dispatch(registerByPin(registerData))
        const error = store.getState().auth.error
        if(error !== null) {
            return alert("Une erreur est apparue, veuillez reessayer plutard.")
        }
        navigation.navigate(routes.CODE_LOGIN)
    }

    return (
        <GradientScreen>
            <AppActivityIndicator visible={isLoading}/>
       <KeyboardAvoidingView
           style={{
               marginVertical: 40
           }}
           behavior={Platform.OS === "ios" ? "padding" : "height"}>
           <View style={{
               marginVertical: 30
           }}>
               <AppLogoInfo/>
           </View>
           <View style={{
               marginHorizontal: 20,
               alignItems: 'center'
           }}>
               <AppForm
                   initialValues={{
                       pin: '',
                       confirmPin: '',
                       phone: ''
                   }}
                   validationSchema={validRegister}
                   onSubmit={handleCodeRegister}>
                   <AppFormField
                       textAlign='center'
                       placeholder='code pin'
                       width={200}
                       secureTextEntry
                       onSubmitEditing={() => confirmRef.current.focus()}
                       returnKeyType='next'
                       keyboardType='numeric'
                       name='pin'
                       formFielRef={pinRef}/>
                   <AppFormField
                       textAlign='center'
                       placeholder='confirm code pin'
                       width={200}
                       secureTextEntry
                       onSubmitEditing={() => phoneRef.current.focus()}
                       returnKeyType='next'
                       keyboardType='numeric'
                       name='confirmPin' formFielRef={confirmRef}/>
                   <AppFormField
                       textAlign='center'
                       placeholder='numero telephone'
                       width={300}
                       keyboardType='numeric'
                       name='phone' formFielRef={phoneRef}/>
                   <FormSubmitButton title='Valider'/>
               </AppForm>
           </View>

           <View style={{
               marginVertical: 20,
               marginHorizontal: 20
           }}>
               <AppText>Vous avez un compte PIN?</AppText>
               <AppText
                   onPress={() => navigation.navigate(routes.CODE_LOGIN)}
                   style={{color: colors.bleuFbi}}>Connectez-vous.</AppText>
           </View>
       </KeyboardAvoidingView>
            </GradientScreen>
    );
}

export default CodeRegisterScreen;