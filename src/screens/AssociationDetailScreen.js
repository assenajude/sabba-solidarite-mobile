import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, View, StyleSheet, BackHandler} from "react-native";
import {useFocusEffect} from '@react-navigation/native'
import AssociationBackImage from "../components/association/AssociationBackImage";
import {useDispatch, useSelector, useStore} from "react-redux";

import {getAvatarUpdate} from "../store/slices/associationSlice";
import AppLabelWithValue from "../components/AppLabelWithValue";
import AppSimpleLabelWithValue from "../components/AppSimpleLabelWithValue";
import useManageAssociation from "../hooks/useManageAssociation";
import AppAddNewButton from "../components/AppAddNewButton";
import routes from "../navigation/routes";
import useAuth from "../hooks/useAuth";
import AppReglement from "../components/AppReglement";
import AppActivityIndicator from "../components/AppActivityIndicator";

function AssociationDetailScreen({route, navigation}) {
    const selectedAssociation = route.params
    const store = useStore()
    const dispatch = useDispatch()
    const {formatFonds} = useManageAssociation()
    const {isAdmin}= useAuth()

    const [associationState, setAssociationState] = useState(selectedAssociation)

    const isLoading = useSelector(state => state.entities.association.loading)
    const currentAssociation = useSelector(state => {
        const allAssociation = state.entities.association.list
        const selected = allAssociation.find(item => item.id === selectedAssociation.id)
        return selected
    })

   const handleSaveChanged = async (uploadResult) => {
        if(uploadResult) {
            const imageUrlArray = store.getState().uploadImage.signedRequestArray
            const data = {
                associationId: selectedAssociation.id,
                avatarUrl: imageUrlArray[0].url
            }
            await dispatch(getAvatarUpdate(data))
            const error = store.getState().entities.association.error
            if(error !== null) {
                return alert("Impossible de faire la mise à jour.")
            }
            alert("Mise à jour effectué avec succès")
        }
   }

   useFocusEffect(
       useCallback(() => {
           const onBackPress = () => {
               navigation.navigate(routes.ASSOCIATION_LIST)
               return true
           }
           BackHandler.addEventListener('hardwareBackPress', onBackPress)
           return () => {
               BackHandler.removeEventListener('hardwareBackPress', onBackPress)
           }
       }, [])
   )

    useEffect(() => {
        setAssociationState(currentAssociation)
    }, [currentAssociation.imageLoading])

    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
            <ScrollView>
              <AssociationBackImage
                  imageLoading={associationState.imageLoading}
                  uploadResult={handleSaveChanged} association={associationState}/>
              <View style={styles.info}>
                <AppSimpleLabelWithValue label='Cotisation' labelValue={formatFonds(associationState.cotisationMensuelle)}/>
                <AppSimpleLabelWithValue label='Frequence' labelValue={associationState.frequenceCotisation}/>
                  <AppReglement association={associationState}/>
                <AppLabelWithValue showLimit={false} label='Description' value={associationState.description}/>
              </View>
              </ScrollView>
                {isAdmin() && <View style={{
                    position: 'absolute',
                    right: 10,
                    bottom: 5
                }}>
                    <AppAddNewButton
                        name='file-document-edit'
                        onPress={() => navigation.navigate(routes.NEW_ASSOCIATION, {associationState, edit: true})}/>
                </View>}
        </>
    );
}

const styles = StyleSheet.create({
    info: {
      marginVertical: 40,
        marginHorizontal: 20
    },
})

export default AssociationDetailScreen;