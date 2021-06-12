import React from 'react';
import {Modal, View, TouchableOpacity, StyleSheet, ToastAndroid} from "react-native";
import * as Yup from 'yup'

import defaultStyles from '../../utilities/styles'
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {AppForm, AppFormField, FormSubmitButton} from "../form";
import {useDispatch, useSelector, useStore} from "react-redux";
import {saveEditFund} from "../../store/slices/authSlice";

const validFund = Yup.object().shape({
    fonds: Yup.number()
})
function EditFundModal({editVisible, closeFundModal}) {
    const store = useStore()
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.auth.user)

    const handleValidFund = async (fund, {resetForm}) => {
        const data = {...fund, id: currentUser.id}
        await dispatch(saveEditFund(data))
        const error = store.getState().auth.error
        if(error !== null) {
            ToastAndroid.showWithGravityAndOffset("Erreur: Impossible de valider le fonds",
                ToastAndroid.LONG,
                ToastAndroid.TOP,
                500,
                200
                )
            return;
        }
        ToastAndroid.showWithGravityAndOffset("Succès: Le fonds a été ajouté",
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            100,
            400
        )
        resetForm()
    }

    return (
        <Modal visible={editVisible} transparent>
            <View style={styles.container}>

            </View>
            <View style={styles.content}>
                <View style={{
                    alignItems: 'flex-end',
                    padding: 20
                }}>
                    <TouchableOpacity onPress={closeFundModal}>
                        <MaterialCommunityIcons name="close" size={24} color={defaultStyles.colors.rougeBordeau} />
                    </TouchableOpacity>
                </View>
                <AppForm
                    validationSchema={validFund}
                    initialValues={{
                        fonds: ''
                    }}
                    onSubmit={handleValidFund} >
                    <AppFormField keyboardType='numeric' name='fonds' placeholder='fonds'/>
                    <FormSubmitButton title='valider'/>
                </AppForm>
            </View>
        </Modal>
    );
}

const styles =StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: defaultStyles.colors.dark,
        opacity: 0.5
    },
    content: {
        position: 'absolute',
        backgroundColor: defaultStyles.colors.white,
        height: 'auto',
        width: '100%',
        top: '30%',
        paddingVertical: 20,
        paddingHorizontal: 20
    }
})
export default EditFundModal;