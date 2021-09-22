import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import AppText from "../components/AppText";
import { useSelector, useStore} from "react-redux";
import BackgroundWithAvatar from "../components/member/BackgroundWithAvatar";
import defaultStyles from "../utilities/styles";
import useManageAssociation from "../hooks/useManageAssociation";
import AppLabelWithValue from "../components/AppLabelWithValue";
import AppActivityIndicator from "../components/AppActivityIndicator";
import {ProgressBar} from "react-native-paper";
import AppButton from "../components/AppButton";
import routes from "../navigation/routes";

function MemberEngagementDetailScreen({route, navigation}) {
    let selectedEngagement = route.params
    const {formatDate, formatFonds} = useManageAssociation()

    const creatorMember = useSelector(state => {
        const membersList = state.entities.member.list
        const selected = membersList.find(member => member.id === selectedEngagement.Creator.userId)
        return selected
    })
    const engagementTranches = useSelector(state => {
        const list = state.entities.engagement.tranches
        const selectedTranches = list.filter(tranche => tranche.engagementId === selectedEngagement.id)
        return selectedTranches
    })

    return (
        <>
        <ScrollView contentContainerStyle={{
            paddingBottom: 20
        }}>
            <BackgroundWithAvatar selectedMember={creatorMember}/>
            {selectedEngagement.progression > 0 && <View style={{
                alignItems: 'center',
                marginVertical: 40
            }}>
                {selectedEngagement.progression>0 && selectedEngagement.progression<1 &&
                <ProgressBar progress={selectedEngagement.progression} style={{width: 200, height: 5}}/>}
                {selectedEngagement.progression === 1 && <MaterialCommunityIcons name="credit-card-check" size={40} color={defaultStyles.colors.vert}/>}
            </View>}
            <View style={styles.montantContainer}>
            <View style={styles.numberContainer}>
                <View elevation={5} style={styles.number}>
                    <AppText style={{fontWeight: 'bold'}}>{formatFonds(selectedEngagement.montant+selectedEngagement.interetMontant+selectedEngagement.penalityMontant)}</AppText>
                </View>
                <View style={styles.label}>
                    <AppText style={{color: defaultStyles.colors.white}}>Net à payer</AppText>
                </View>
            </View>

                <View style={styles.numberContainer}>
                <View elevation={5} style={styles.number}>
                    <AppText style={{fontWeight: 'bold'}}>{formatFonds(selectedEngagement.solde)}</AppText>
                </View>
                    <View style={styles.label}>
                        <AppText style={{color: defaultStyles.colors.white}}>payé</AppText>
                    </View>
            </View>
            </View>
            <AppButton
               style={{alignSelf: 'flex-start'}}
                onPress={() => navigation.navigate(routes.TRANCHE, {...selectedEngagement, tranches : engagementTranches})}
                mode='text'
                title={`Tranches payement (${engagementTranches.length})`}
            />
            <AppLabelWithValue label='Libellé' value={selectedEngagement.libelle}/>
            <AppLabelWithValue label='Montant' value={formatFonds(selectedEngagement.montant)}/>
            <AppLabelWithValue label='Interet' value={formatFonds(selectedEngagement.interetMontant)}/>
            <AppLabelWithValue label='Montant Penalité' value={formatFonds(selectedEngagement.penalityMontant)}/>
            <AppLabelWithValue label='Total à rembourser' value={formatFonds(selectedEngagement.montant+selectedEngagement.interetMontant+selectedEngagement.penalityMontant)}/>
            <AppLabelWithValue label='Echeance' value={formatDate(selectedEngagement.echeance)}/>
            <AppLabelWithValue label='Type' value={selectedEngagement.typeEngagement}/>
        </ScrollView>
            </>
    );
}

const styles = StyleSheet.create({
    label: {
      position: 'absolute',
      top: -20,
        alignItems: 'center',
        backgroundColor: defaultStyles.colors.bleuFbi,
        right: 0,
        left: 0
    },
    montantContainer: {
      flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    number: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: defaultStyles.colors.white,
        borderRadius: 10,
        height: 50,
        width: 150
    },
    numberContainer: {
        marginVertical: 40,
        marginHorizontal: 10,
        backgroundColor: defaultStyles.colors.grey,
        justifyContent: 'center',
        borderWidth: 1,
        height: 60,
        width: 160
    },
    trancheContainer: {
      marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    trancheLabelContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: 20,
        marginVertical: 20
    }
})
export default MemberEngagementDetailScreen;