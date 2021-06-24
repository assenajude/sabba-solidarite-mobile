import React from 'react';
import {FlatList, TouchableOpacity, View} from "react-native";
import {useDispatch, useSelector, useStore} from "react-redux";
import MemberListItem from "../components/member/MemberListItem";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import defaultStyles from '../utilities/styles'
import AppSwiper from "../components/AppSwiper";
import {getSelectedAssociationMembers, respondToAdhesionMessage} from "../store/slices/memberSlice";
import {getMemberRolesEdited} from "../store/slices/associationSlice";
import AppText from "../components/AppText";
import useManageAssociation from "../hooks/useManageAssociation";
import ListItemSeparator from "../components/ListItemSeparator";
import useAuth from "../hooks/useAuth";
import AppActivityIndicator from "../components/AppActivityIndicator";
import {getAssociationCotisations} from "../store/slices/cotisationSlice";
import {getEngagementsByAssociation} from "../store/slices/engagementSlice";

function NouvelleAdhesionScreen({navigation}) {
    const dispatch = useDispatch()
    const store = useStore()
    const {isAdmin, isModerator} = useAuth()
    const isAuthorized = isModerator() || isAdmin()

    const {getNewAdhesion, deleteMember} = useManageAssociation()

    const selectedAssociation = useSelector(state => state.entities.association.selectedAssociation)
    const associationLoading = useSelector(state => state.entities.association.loading)
    const memberLoading = useSelector(state => state.entities.member.loading)


    const handleRespondToDemand = async (member, response) => {
        await dispatch(respondToAdhesionMessage({
            userId: member.id,
            associationId:  selectedAssociation.id,
            adminResponse: response,
            info: member.member.statut.toLowerCase() === 'new'?"new":'old'
        }))
        const error = store.getState().entities.member.error
        if(error !== null) {
            return alert("Erreur: Nous avons rencontré une erreur, veuillez reessayer plutard.")
        }
        dispatch(getSelectedAssociationMembers({associationId: selectedAssociation.id}))
        if(response === 'rejected') {
            dispatch(getAssociationCotisations({associationId: selectedAssociation.id}))
            dispatch(getEngagementsByAssociation({associationId: selectedAssociation.id}))
        }
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
                       deleteMember={() => deleteMember(item)}
                       showMemberState={true}
                       label={item.member.statut?.toLowerCase() === 'new'?"refusé":"quitté"}
                       notMember={item.member?.relation.toLowerCase() === 'rejected'}
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