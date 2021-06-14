import React from 'react';
import {ScrollView, View, StyleSheet, TouchableOpacity} from "react-native";
import AssociationBackImage from "../components/association/AssociationBackImage";
import {useDispatch, useStore} from "react-redux";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {getAvatarUpdate} from "../store/slices/associationSlice";
import AppLabelWithValue from "../components/AppLabelWithValue";
import AppSimpleLabelWithValue from "../components/AppSimpleLabelWithValue";
import useManageAssociation from "../hooks/useManageAssociation";
import AppText from "../components/AppText";
import defaultStyles from "../utilities/styles";
import AppAddNewButton from "../components/AppAddNewButton";
import routes from "../navigation/routes";
import useAuth from "../hooks/useAuth";
import AppDocumentPicker from "../components/AppDocumentPicker";

function AssociationDetailScreen({route, navigation}) {
    const selectedAssociation = route.params
    const store = useStore()
    const dispatch = useDispatch()
    const {formatFonds} = useManageAssociation()
    const {isAdmin}= useAuth()

    const getReglementDocument = () => {

    }


   const handleSaveChanged = async (uploadResult) => {
        if(uploadResult) {
            const imageUrlArray = store.getState().uploadImage.signedRequestArray
            const data = {
                associationId: selectedAssociation.id,
                avatarUrl: imageUrlArray[0].url
            }
            await dispatch(getAvatarUpdate(data))
            const error = store.getState().association.error
            if(error !== null) {
                return alert("Impossible de faire la mise à jour.")
            }
            alert("Mise à jour avec succès")
        }
   }

    return (
        <>
            <ScrollView>
              <AssociationBackImage  uploadResult={handleSaveChanged} association={selectedAssociation}/>
              <View style={styles.info}>
                <AppSimpleLabelWithValue label='Cotisation' labelValue={formatFonds(selectedAssociation.cotisationMensuelle)}/>
                <AppSimpleLabelWithValue label='Frequence' labelValue={selectedAssociation.frequenceCotisation}/>
                  <View style={styles.reglement}>
                      <AppText style={{color: defaultStyles.colors.bleuFbi}}> Reglement intérieur</AppText>
                         <AppDocumentPicker/>
                  </View>
                <AppLabelWithValue showLimit={false} label='Description' value={selectedAssociation.description}/>
              </View>
              </ScrollView>
                {isAdmin() && <View style={{
                    position: 'absolute',
                    right: 10,
                    bottom: 5
                }}>
                    <AppAddNewButton
                        name='file-document-edit'
                        onPress={() => navigation.navigate(routes.NEW_ASSOCIATION, {selectedAssociation, edit: true})}/>
                </View>}
        </>
    );
}

const styles = StyleSheet.create({
    info: {
      marginVertical: 40,
        marginHorizontal: 20
    },
    reglement: {
        marginVertical: 10,
        marginHorizontal: 15,
        flexDirection: 'row'
    },
})

export default AssociationDetailScreen;