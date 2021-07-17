import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, View, StyleSheet, BackHandler} from "react-native";
import {useFocusEffect} from '@react-navigation/native'
import AssociationBackImage from "../components/association/AssociationBackImage";
import {useDispatch, useSelector, useStore} from "react-redux";

import {getAvatarUpdate} from "../store/slices/associationSlice";
import AppSimpleLabelWithValue from "../components/AppSimpleLabelWithValue";
import useManageAssociation from "../hooks/useManageAssociation";
import AppAddNewButton from "../components/AppAddNewButton";
import routes from "../navigation/routes";
import useAuth from "../hooks/useAuth";
import AppReglement from "../components/AppReglement";
import AppActivityIndicator from "../components/AppActivityIndicator";
import AppText from "../components/AppText";
import {getSelectedAssociationMembers} from "../store/slices/memberSlice";

function AssociationDetailScreen({route, navigation}) {
    const selectedAssociation = route.params
    const store = useStore()
    const dispatch = useDispatch()
    const {formatFonds} = useManageAssociation()
    const {isAdmin}= useAuth()

    const [associationState, setAssociationState] = useState(selectedAssociation)
    const [respoInfo, setRespoInfo] = useState(null)
    const [modInfo, setModInfo] = useState(null)

    const isLoading = useSelector(state => state.entities.association.loading)
    const currentAssociation = useSelector(state => {
        const allAssociation = state.entities.association.list
        const selected = allAssociation.find(item => item.id === selectedAssociation.id)
        return selected
    })

    const getInfos = useCallback(async () => {
        await dispatch(getSelectedAssociationMembers({associationId: selectedAssociation?.associationState?.id}))
        const memberList = store.getState().entities.member.list
        const respo = memberList.find(item => item.member.statut.toLowerCase() === 'responsable' || item.member.statut.toLowerCase() === 'president' || item.member.statut.toLowerCase() === 'président')
        const admin = memberList.find(item => item.member.statut.toLowerCase() === 'moderateur' || item.member.statut.toLowerCase() === 'administrateur')
        if(respo) setRespoInfo(respo.phone?respo.phone: respo.email)
        if(admin) setModInfo(admin.phone?admin.phone : admin.email)
    }, [])

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
        getInfos()
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
                <AppSimpleLabelWithValue label='Contact Responsable' labelValue={respoInfo !== null?respoInfo : 'pas de contact'}/>
                <AppSimpleLabelWithValue label='Contact Administrateur' labelValue={modInfo !== null?modInfo : 'pas de contact'}/>
                <View style={{
                    marginVertical: 10
                }}>
                    <AppText style={{fontWeight: 'bold'}}>Description</AppText>
                    <AppText>{associationState.description}</AppText>
                </View>
                  <AppReglement  association={associationState}/>
              </View>
              </ScrollView>
                {isAdmin() && <View style={{
                    position: 'absolute',
                    right: 10,
                    bottom: 5
                }}>
                    <AppAddNewButton
                        name='file-document-edit'
                        onPress={() => navigation.navigate(routes.NEW_ASSOCIATION, {selectedAssociation:associationState, edit: true})}/>
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