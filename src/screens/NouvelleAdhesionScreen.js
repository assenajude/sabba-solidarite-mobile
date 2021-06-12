import React, {useState} from 'react';
import {FlatList, TouchableOpacity, View} from "react-native";
import {useDispatch, useSelector, useStore} from "react-redux";
import MemberListItem from "../components/member/MemberListItem";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import defaultStyles from '../utilities/styles'
import AppSwiper from "../components/AppSwiper";
import {getMemberAssociations, respondToAdhesionMessage} from "../store/slices/memberSlice";
import {getMemberRolesEdited, getSelectedAssociationMembers} from "../store/slices/associationSlice";
import AppText from "../components/AppText";
import useManageAssociation from "../hooks/useManageAssociation";
import ListItemSeparator from "../components/ListItemSeparator";
import useAuth from "../hooks/useAuth";
import AppActivityIndicator from "../components/AppActivityIndicator";

function NouvelleAdhesionScreen({navigation}) {
    const dispatch = useDispatch()
    const store = useStore()
    const {isAdmin, isModerator} = useAuth()
    const isAuthorized = isModerator() || isAdmin()

    const {getNewAdhesion} = useManageAssociation()

    const selectedAssociation = useSelector(state => state.entities.association.selectedAssociation)
    const associationLoading = useSelector(state => state.entities.association.loading)
    const memberLoading = useSelector(state => state.entities.member.loading)


    const handleRespondToDemand = async (member, response) => {
        await dispatch(respondToAdhesionMessage({
            userId: member.id,
            associationId:  selectedAssociation.id,
            adminResponse: response
        }))
        const error = store.getState().entities.member.error
        if(error !== null) {
            return alert("Erreur: impossible d'ajouter le membre")
        }
        dispatch(getMemberAssociations())
        dispatch(getMemberRolesEdited({memberId: member.member.id}))
        dispatch(getSelectedAssociationMembers({associationId: selectedAssociation.id}))
        return alert(response === 'member'?"Membre ajouté avec succès." : "La reponse de reject a été envoyée au demandeur.")
    }


    if(getNewAdhesion().length ===0) {
        return <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <AppText>Vous n'avez aucune demande d'adhesion</AppText>
        </View>
    }

    return (
        <>
            <AppActivityIndicator visible={memberLoading || associationLoading}/>
           <FlatList
               data={getNewAdhesion()}
               ItemSeparatorComponent={ListItemSeparator}
               keyExtractor={item => item.id.toString()}
               renderItem={({item}) =>
                   <MemberListItem
                       getMemberDetails={() => navigation.navigate('Members',{screen: 'MemberDetails', params: item})} selectedMember={item}
                       renderRightActions={() => isAuthorized?<AppSwiper>
                           <TouchableOpacity onPress={() => handleRespondToDemand(item, 'member')}>
                               <MaterialCommunityIcons style={{marginVertical: 10}} name="account-multiple-plus" size={24} color={defaultStyles.colors.vert} />
                           </TouchableOpacity>
                           <TouchableOpacity onPress={() => handleRespondToDemand(item, 'rejected')}>
                               <MaterialCommunityIcons style={{marginVertical: 10}} name="account-cancel" size={24} color={defaultStyles.colors.rougeBordeau} />
                           </TouchableOpacity>
                       </AppSwiper> : null
                       }
                   >
                   </MemberListItem>}/>
        </>
    );
}

export default NouvelleAdhesionScreen;