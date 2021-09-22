import React from 'react';
import {ToastAndroid, View, Alert, StyleSheet} from "react-native";
import * as Yup from 'yup'
import AppText from "../components/AppText";
import {AppForm, AppFormField, FormSubmitButton} from "../components/form";
import {payMemberCotisation} from "../store/slices/memberSlice";
import {getStateUpdate} from "../store/slices/associationSlice";
import {useDispatch, useSelector, useStore} from "react-redux";
import AppActivityIndicator from "../components/AppActivityIndicator";
import useAuth from "../hooks/useAuth";

const validPayement = Yup.object().shape({
    montant: Yup.number()
})
function PayementCotisationScreen({route, navigation}) {
    const selectedCotisation = route.params
    const dispatch = useDispatch()
    const store = useStore()
    const {getConnectedMember} = useAuth()
    const isLoading = useSelector(state => state.entities.member.loading)
    const currentUser = useSelector(state => state.auth.user)


    const handlePayCotisation = async (cotisation, {resetForm}) => {
        const validMontant = Number(cotisation.montant)
            if(currentUser.wallet < validMontant) {
                Alert.alert("Alert", "Désolé, vous n'avez pas de fonds suffisant.",
                    [{text: 'Recharger', onPress: () => {
                            return navigation.navigate('Starter', {screen: 'UserCompte', params: currentUser})

                        }}, {
                        text: 'Plutard', onPress: () => {return;}
                    }])
            } else {
                const data = {
                    memberId: getConnectedMember().id,
                    cotisationId: selectedCotisation.id,
                    montant: validMontant
                }
                await dispatch(payMemberCotisation(data))
                const error = store.getState().entities.member.error
                if(error !== null) {
                    return alert("Désolé, nous n'avons pas pu effectuer le payement. Veuillez reessayer plutard.")
                }
                ToastAndroid.showWithGravity("Payement effectué avec succès.",
                    ToastAndroid.LONG,
                    ToastAndroid.CENTER)
                dispatch(getStateUpdate({updating: true}))
                resetForm()
                navigation.goBack()
            }

     /*   Alert.alert("Demande!", "Quel compte souhaiteriez-vous utiliser pour payer votre cotisation?",
            [{
            text: 'Mon portefeuille', onPress: async () =>
            }, {
            text: 'Compte externe', onPress: () => {
                return alert("Cette fonctionnalité est en developpement, veuillez utiliser votre portefeuille ou reessayer plutard.")
                }
            }])*/
    }

    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
        <View style={styles.container}>
            <AppText style={{
                fontWeight: 'bold',
                marginVertical: 20
            }}>{selectedCotisation.motif}</AppText>
            <AppForm
                initialValues={{
                montant: selectedCotisation?String(selectedCotisation.montant): ''
            }}
                validationSchema={validPayement}
                onSubmit={handlePayCotisation}>
                <AppFormField
                    style={{width: 200, marginVertical: 20}}
                    label='montant'
                    name='montant'/>
                <FormSubmitButton
                    buttonStyle={{width: 250}}
                    title='Payer'/>
            </AppForm>
        </View>
            </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 20,
        marginHorizontal: 20,
        alignItems: 'center'
    }
})
export default PayementCotisationScreen;