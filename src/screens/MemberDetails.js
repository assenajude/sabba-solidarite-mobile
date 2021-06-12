import React, {useState} from 'react';
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


function MemberDetails({route, navigation}) {
    const selectedMember = route.params

    const {isAdmin, isModerator} = useAuth()
    const {getMemberCotisations} = useCotisation()
    const {getMemberEngagementInfos} = useEngagement()
    const {formatFonds, formatDate} = useManageAssociation()

    const [editRoles, setEditRoles] = useState(false)

    const isAuthorized = isAdmin() || isModerator()


    return (
        <>
        <ScrollView contentContainerStyle={{paddingBottom: 20}}>


            <BackgroundWithAvatar selectedMember={selectedMember}/>
            {isAuthorized && <TouchableWithoutFeedback
                onPress={() => navigation.navigate(routes.EDIT_MEMBER, selectedMember)}>
                <View style={styles.editAccount}>
                    <MaterialCommunityIcons name="account-edit" size={24} color={defaultStyles.colors.rougeBordeau} />
                </View>
            </TouchableWithoutFeedback>}
            {isAdmin() && <TouchableWithoutFeedback
                onPress={() => setEditRoles(true)}>
                <View style={[styles.editAccount, {flexDirection: 'row', top: 150}]}>
                    <MaterialCommunityIcons name="account-edit" size={24} color={defaultStyles.colors.rougeBordeau} />
                    <AppText style={{color: defaultStyles.colors.rougeBordeau}}>edit roles</AppText>
                </View>
            </TouchableWithoutFeedback>}
            <View style={styles.statut}>
                <AppText style={{color: defaultStyles.colors.bleuFbi, fontSize: 20, fontWeight: 'bold'}}>{selectedMember.member.statut}</AppText>
            </View>
            <View style={{marginTop: 30}}>

                <AppLabelWithValue label='Fonds' value={formatFonds(selectedMember.member.fonds)}/>
                <AppLabelWithValue label='Nom' value={selectedMember.nom || "ajoutez votre nom"}/>
                <AppLabelWithValue label='Prenoms' value={selectedMember.prenom || "ajoutez votre prenom"}/>
                <AppLabelWithValue label='Telephone' value={selectedMember.phone || "ajoutez un numero de telephone"}/>
                <AppLabelWithValue label='Profession' value={selectedMember.profession || "Quelle est votre profession?"}/>
                <AppLabelWithValue label='Statut emploi' value={selectedMember.emploi || "Avez-vous un emploi?"}/>
                <AppLabelWithValue label='Autres adresses' value={selectedMember.adresse || "ajoutez une adresse (ex: votre ville)"}/>
                <AppLabelWithValue label="Date d'adhésion" value={formatDate(selectedMember.member.adhesionDate)}/>

            </View>
            <View>
                <TouchableWithoutFeedback
                    onPress={() =>
                        navigation.navigate('Cotisations', {
                            screen: 'MemberCotisationScreen',
                            initial: false,
                            params:selectedMember
                        })}>
                    <View style={styles.cotisation}>
                        <AppText style={{color: defaultStyles.colors.bleuFbi}}>Cotisations</AppText>
                        <AppText style={{color: defaultStyles.colors.bleuFbi}}>({getMemberCotisations(selectedMember).cotisationLenght})</AppText>
                        <AppText style={{color: defaultStyles.colors.bleuFbi}}>{formatFonds(getMemberCotisations(selectedMember).totalCotisation)}</AppText>
                        <MaterialCommunityIcons name="clipboard-play-multiple" size={24} color="black" />
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                    onPress={() => navigation.navigate('Engagements', {
                    screen : routes.LIST_ENGAGEMENT,
                    initial: false,
                    params:selectedMember
                })}>
                    <View style={styles.cotisation}>
                        <AppText style={{color: defaultStyles.colors.bleuFbi}}>Engagements</AppText>
                        <AppText style={{color: defaultStyles.colors.bleuFbi}}>({getMemberEngagementInfos(selectedMember).engagementLength})</AppText>
                        <AppText style={{color: defaultStyles.colors.bleuFbi}}>{formatFonds(getMemberEngagementInfos(selectedMember).engagementAmount)}</AppText>
                        <MaterialCommunityIcons name="clipboard-play-multiple" size={24} color="black" />
                    </View>
                 </TouchableWithoutFeedback>
            </View>
        </ScrollView>
            <EditRolesModal
                member={selectedMember.member}
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