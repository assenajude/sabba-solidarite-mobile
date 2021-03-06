import React, {useEffect, useState} from 'react';
import {View, ScrollView, StyleSheet, TouchableWithoutFeedback} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'

import defaultStyles from '../utilities/styles'
import AppText from "../components/AppText";
import useManageAssociation from "../hooks/useManageAssociation";
import BackgroundWithAvatar from "../components/member/BackgroundWithAvatar";
import routes from "../navigation/routes";
import useCotisation from "../hooks/useCotisation";
import useEngagement from "../hooks/useEngagement";
import useAuth from "../hooks/useAuth";
import EditRolesModal from "../components/member/EditRolesModal";
import AppLabelWithValue from "../components/AppLabelWithValue";
import AppIconWithLabelButton from "../components/AppIconWithLabelButton";
import AppAddNewButton from "../components/AppAddNewButton";
import MemberQuotite from "../components/member/MemberQuotite";


function MemberDetails({route, navigation}) {
    const selectedMember = route.params

    const {isAdmin, isModerator, getMemberUserCompte, getMemberStatut} = useAuth()
    const {getMemberCotisations} = useCotisation()
    const {getMemberEngagementInfos} = useEngagement()
    const {formatFonds, formatDate, leaveAssociation} = useManageAssociation()
    const [currentMemberState, setCurrentMemberState] = useState(selectedMember)

    const [editRoles, setEditRoles] = useState(false)
    const [backImageLoading, setBackImageLoading] = useState(true)

    const isAuthorized = isAdmin() || isModerator()
    const isTheSameUser = getMemberUserCompte().id === selectedMember.id
    const canQuitMember = isAuthorized || isTheSameUser



    useEffect(() => {
        setCurrentMemberState(selectedMember)
    }, [selectedMember])

    return (
        <>
        <ScrollView contentContainerStyle={{paddingBottom: 20}}>
            <BackgroundWithAvatar
                onBackImageLoadEnd={() => setBackImageLoading(false)}
                onBackImageLoading={backImageLoading}
                selectedMember={currentMemberState}/>
            <View
                style={{
                    alignItems: 'flex-end',
                    marginRight: 10
                }}>
            {isAuthorized &&
           <AppIconWithLabelButton
               buttonContainerStyle={{
               marginVertical: 10
               }}
               labelStyle={{color: defaultStyles.colors.rougeBordeau}}
               onPress={() => navigation.navigate(routes.EDIT_MEMBER, currentMemberState)}
               iconName='account-edit'
               iconColor={defaultStyles.colors.rougeBordeau}
               label='edit member'/>
            }
            {isAdmin() &&
           <AppIconWithLabelButton

               iconColor={defaultStyles.colors.rougeBordeau}
               label='edit roles'
               onPress={() => setEditRoles(true)}
               iconName='account-edit'
               labelStyle={{color: defaultStyles.colors.rougeBordeau}}/>
            }
            </View>
            <View style={styles.statut}>
                <AppText style={{color: defaultStyles.colors.bleuFbi, fontSize: 20, fontWeight: 'bold'}}>{getMemberStatut(currentMemberState.member.statut)}</AppText>
            </View>
            <View style={{marginTop: 30}}>
                {canQuitMember && <AppLabelWithValue label='Fonds' value={formatFonds(currentMemberState.member.fonds)}/>}
                <MemberQuotite/>
                <AppLabelWithValue label='Nom' value={currentMemberState.nom || "ajoutez votre nom"}/>
                <AppLabelWithValue label='Prenoms' value={currentMemberState.prenom || "ajoutez votre prenom"}/>
                <AppLabelWithValue label='Telephone' value={currentMemberState.phone || "ajoutez un numero de telephone"}/>
                <AppLabelWithValue label='Profession' value={currentMemberState.profession || "Quelle est votre profession?"}/>
                <AppLabelWithValue label='Statut emploi' value={currentMemberState.emploi || "Avez-vous un emploi?"}/>
                <AppLabelWithValue label='Autres adresses' value={currentMemberState.adresse || "ajoutez une adresse (ex: votre ville)"}/>
                <AppLabelWithValue label="Date d'adh??sion" value={formatDate(currentMemberState.member.adhesionDate)}/>

            </View>
            <View>
                <TouchableWithoutFeedback
                    onPress={() =>
                        navigation.navigate('Cotisations', {
                            screen: 'MemberCotisationScreen',
                            initial: false,
                            params:currentMemberState
                        })}>
                    <View style={styles.cotisation}>
                        <AppText style={{color: defaultStyles.colors.bleuFbi}}>Cotisations</AppText>
                        <AppText style={{color: defaultStyles.colors.bleuFbi}}>({getMemberCotisations(currentMemberState.member).cotisationLenght})</AppText>
                        <AppText style={{color: defaultStyles.colors.bleuFbi}}>{formatFonds(getMemberCotisations(currentMemberState.member).totalCotisation)}</AppText>
                        <MaterialCommunityIcons name="clipboard-play-multiple" size={24} color="black" />
                    </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                    onPress={() => navigation.navigate('Engagements', {
                    screen : routes.LIST_ENGAGEMENT,
                    initial: false,
                    params:currentMemberState
                })}>
                    <View style={styles.cotisation}>
                        <AppText style={{color: defaultStyles.colors.bleuFbi}}>Engagements</AppText>
                        <AppText style={{color: defaultStyles.colors.bleuFbi}}>
                            ({getMemberEngagementInfos(currentMemberState.member).engagementLength})
                        </AppText>
                        <AppText style={{color: defaultStyles.colors.bleuFbi}}>
                            {formatFonds(getMemberEngagementInfos(currentMemberState.member).engagementAmount)}</AppText>
                        <MaterialCommunityIcons name="clipboard-play-multiple" size={24} color="black" />
                    </View>
                 </TouchableWithoutFeedback>
            </View>
        </ScrollView>
            {canQuitMember &&
            <AppAddNewButton
                buttonContainerStyle={{
                    backgroundColor: defaultStyles.colors.rougeBordeau,
                    marginVertical: 10,
                    position: 'absolute',
                    bottom: -5,
                    right: 10
                }}
                name='account-minus'
                onPress={() => leaveAssociation(currentMemberState)}/>}
            <EditRolesModal
                member={currentMemberState.member}
                editRoles={editRoles}
                dismissModal={() => setEditRoles(false)}/>
        </>
    );
}

const styles = StyleSheet.create({
    camera: {
      padding: 10
    },
    cotisation: {
      flexDirection: 'row',
      justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginVertical: 20
    },
    detailContainer: {
      flexDirection: 'row',
        paddingVertical: 15,
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },
    editAccount: {
        position: 'absolute',
        top: 200,
        right: 20,
    },
    statut: {
        alignItems: 'center',
        marginTop: 40
    }
})
export default MemberDetails;