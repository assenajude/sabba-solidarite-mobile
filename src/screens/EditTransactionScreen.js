import React from 'react';
import {ScrollView} from "react-native";
import * as Yup from 'yup'
import {AppForm, AppFormField, FormSubmitButton} from "../components/form";
import FormItemPicker from "../components/form/FormItemPicker";
import {useDispatch, useSelector, useStore} from "react-redux";
import {getTransactionUpdate} from "../store/slices/transactionSlice";
import AppActivityIndicator from "../components/AppActivityIndicator";

const validTransaction = Yup.object().shape({
    libelle: Yup.string(),
    montant: Yup.number(),
    reseau: Yup.string(),
    typeTransac: Yup.string(),
    numero: Yup.string(),
    statut: Yup.string()
})
function EditTransactionScreen({route, navigation}) {
    const selectedTransaction = route.params
    const dispatch = useDispatch()
    const store = useStore()
    const isLoading = useSelector(state => state.entities.transaction.loading)


    const handleSubmitTransaction = async (transaction) => {
        const data = {...transaction, transactionId: selectedTransaction.id,userId: selectedTransaction.user.id}
        await dispatch(getTransactionUpdate(data))
        const error = store.getState().entities.transaction.error
        if(error !== null) {
            return alert("Une erreur est apparue. Veuillez reessayer plutard.")
        }
        alert("Transaction mise à jour avec succès.")
        navigation.navigate('Transaction')
    }
    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
            <ScrollView contentContainerStyle={{
                marginVertical: 20,
                marginHorizontal: 20
            }}>
                <AppForm
                    validationSchema={validTransaction}
                    initialValues={{
                        libelle: selectedTransaction?selectedTransaction.libelle: '',
                        montant: selectedTransaction? String(selectedTransaction.montant) : '',
                        reseau: selectedTransaction? selectedTransaction.reseau : '',
                        typeTransac: selectedTransaction?selectedTransaction.typeTransac : '',
                        numero: selectedTransaction? selectedTransaction.numero : '',
                        statut: selectedTransaction? selectedTransaction.statut : ''
                    }}
                    onSubmit={handleSubmitTransaction}>
                    <FormItemPicker  name='statut' label='Statut' data={["processing", "succeed", "failed"]}/>
                    <AppFormField name='libelle'/>
                    <AppFormField name='reseau'/>
                    <AppFormField name='montant'/>
                    <AppFormField name='typeTransac'/>
                    <AppFormField name='numero'/>
                    <FormSubmitButton title='Valider'/>
                </AppForm>
            </ScrollView>
        </>
    );
}

export default EditTransactionScreen;