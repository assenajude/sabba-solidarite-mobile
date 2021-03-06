import React from 'react';
import {Modal, StyleSheet, View} from "react-native";
import * as Yup from 'yup'

import {AppForm, FormSubmitButton} from "../form";
import AppButton from "../AppButton";
import defaultStyles from '../../utilities/styles'
import {useDispatch, useStore} from "react-redux";
import {getMemberRolesEdited} from "../../store/slices/associationSlice";
import FormItemPicker from "../form/FormItemPicker";



const validRoles = Yup.object().shape({
    roles: Yup.string()
})
function EditRolesModal({editRoles, dismissModal, member}) {

    const dispatch = useDispatch()
    const store = useStore()

    const handleEditRoles = async (role) => {
        const data = {
            memberId: member.id,
            roles: [role.roles]
        }
        await dispatch(getMemberRolesEdited(data))
        const error = store.getState().entities.association.error
        if(error !== null) {
           return  alert("Error editing the roles")
        }
        alert("Role édité avec succès")
    }


    return (
        <Modal visible={editRoles} transparent>
            <View style={styles.container}>
                <View style={{
                    alignSelf: 'flex-end',
                    margin: 20
                }}>
                    <AppButton
                        style={{backgroundColor: defaultStyles.colors.rougeBordeau}}
                        onPress={dismissModal}
                        title='fermer'
                    />
                </View>
            <View style={styles.formContainer}>
                <AppForm
                    validationSchema={validRoles}
                    initialValues={{
                        roles: 'moderator'
                    }}
                    onSubmit={handleEditRoles} >
                    <FormItemPicker label='Roles' name='roles' data={['moderator', 'admin']}/>
                    <FormSubmitButton title='Editer'/>
                </AppForm>
            </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '80%',
        top: 80,
        bottom: 20,
        backgroundColor: defaultStyles.colors.white
    },
    formContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})
export default EditRolesModal;