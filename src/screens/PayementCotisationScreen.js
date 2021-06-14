import React from 'react';
import {ToastAndroid, View, Alert, StyleSheet} from "react-native";
import * as Yup from 'yup'
import AppText from "../components/AppText";
import {AppForm, AppFormField, FormSubmitButton} from "../components/form";
import {payMemberCotisation} from "../store/slices/memberSlice";
import {getSelectedAssociation, getSelectedAssociationMembers} from "../store/slices/associationSlice";
import {useDispatch, useSelector, useStore} from "react-redux";
import AppActivityIndicator from "../components/AppActivityIndicator";

const validPayement = Yup.object().shape({
    montant: Yup.number()
})
function PayementCotisationScreen({route, navigation}) {
    const selectedCotisation = route.params
    const dispatch = useDispatch()
    const store = useStore()
    const isLoading = useSelector(state => state.entities.member.loading)
    const currentAssociation = useSelector(state => state.entities.association.selectedAssociation)
    const currentUser = useSelector(state => state.auth.user)
    const selectedMember = useSelector(state => {
        const list = state.entities.member.list
        const selected = list.find(item => item.userId === currentUser.id)
        return selected
    })

    const handlePayCotisation = async (cotisation, {resetForm}) => {
        const validMontant = Number(cotisation.montant)

        if(currentUser.wallet < validMontant) {
          Alert.alert("Alert", "Désolé, vous n'avez pas de fonds suffisant.",
              [{text: 'Recharger', onPress: () => {
                  return navigation.navigate('Starter', {screen: 'UserCompte'})

                  }}, {
              text: 'Retour', onPress: () => {return;}
              }])
        } else {
            const data = {
                memberId: selectedMember.id,
                cotisationId: selectedCotisation.id,
                montant: validMontant
            }
            await dispatch(payMemberCotisation(data))
            const error = store.getState().entities.member.error
            if(error !== null) {
                return alert("Désolé, nous n'avons pas pu effectuer le payement. Une erreur est apparue. Veuillez reessayer plutard.")
            }
            ToastAndroid.showWithGravity("Payement effectué avec succès.",
                ToastAndroid.LONG,
                ToastAndroid.CENTER)
            await dispatch(getSelectedAssociationMembers({associationId: currentAssociation.id}))
            await dispatch(getSelectedAssociation({associationId: currentAssociation.id}))
            resetForm()
            navigation.goBack()
        }

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
                <AppFormField name='montant' width={100}/>
                <FormSubmitButton title='Valider'/>
            </AppForm>
        </View>
            </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginVertical: 50,
    }
})
export default PayementCotisationScreen;