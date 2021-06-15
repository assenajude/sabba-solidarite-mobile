import React from 'react';
import {View} from "react-native";
import * as Yup from "yup"
import {useDispatch, useSelector, useStore} from "react-redux";

import {AppForm, AppFormField, FormSubmitButton} from "../components/form";
import FormItemPicker from "../components/form/FormItemPicker";
import useManageAssociation from "../hooks/useManageAssociation";
import {getEngagementUpdate} from "../store/slices/engagementSlice";
import {getSelectedAssociation, setSelectedAssociation} from "../store/slices/associationSlice";

const validEngagement = Yup.object().shape({
    libelle: Yup.string(),
    statut:Yup.string()
})
function EditEngagementScreen({route, navigation}) {
    const selectedEngagement = route.params
    const dispatch = useDispatch()
    const store = useStore()
    const {formatFonds} = useManageAssociation()

    const currentAssociation = useSelector(state => state.entities.association.selectedAssociation)

    const handleUpdateEngagement = async (engagement) => {
        const montant = selectedEngagement.montant
        const securityFund = currentAssociation.fondInitial * currentAssociation.seuilSecurite / 100
        const dispoFund = currentAssociation.fondInitial - securityFund

        if(dispoFund<montant) {
            return alert(`Le montant disponible pour les engagements est de : ${formatFonds(dispoFund)}. Vous ne pouvez pas excéder ce montant.`)
        }
        await dispatch(getEngagementUpdate({
            id: selectedEngagement.id,
            statut: engagement.statut,
            libelle: engagement.libelle
        }))
        const error = store.getState().entities.engagement.error
        if(error !==null) {
            return alert("Nous n'avons pas pu faire la mise à jour. Veuillez reessayer plutard.")
        }
        dispatch(getSelectedAssociation({associationId: currentAssociation.id}))
        navigation.goBack()
    }

    return (
        <View style={{
            alignItems: 'center',
            marginHorizontal: 20,
            marginVertical: 40
        }}>
            <AppForm
                initialValues={{
                    libelle: selectedEngagement.libelle,
                    statut: selectedEngagement.statut
                }}
                validationSchema={validEngagement}
                onSubmit={handleUpdateEngagement}>
                <FormItemPicker label='Statut' data={['voting', 'paying']} name='statut'/>
                <AppFormField name='libelle' placeholder='libellé'/>
                <FormSubmitButton title='Valider'/>
            </AppForm>
        </View>
    );
}

export default EditEngagementScreen;