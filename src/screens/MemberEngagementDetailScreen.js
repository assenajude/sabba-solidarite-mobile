import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, TouchableWithoutFeedback} from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress'

import AppText from "../components/AppText";
import {useDispatch, useSelector} from "react-redux";
import BackgroundWithAvatar from "../components/member/BackgroundWithAvatar";
import defaultStyles from "../utilities/styles";
import useManageAssociation from "../hooks/useManageAssociation";
import AppLabelWithValue from "../components/AppLabelWithValue";
import TrancheItem from "../components/tranche/trancheItem";
import ListItemSeparator from "../components/ListItemSeparator";
import useEngagement from "../hooks/useEngagement";
import TrancheRightActions from "../components/tranche/TrancheRightActions";
import {getPayingTranche} from "../store/slices/engagementSlice";
import useAuth from "../hooks/useAuth";

function MemberEngagementDetailScreen({route}) {
    const selectedEngagement = route.params
    const dispatch = useDispatch()
    const {getConnectedMember} = useAuth()
    const {formatDate, formatFonds} = useManageAssociation()
    const {handlePayTranche} = useEngagement()

    const creatorMember = useSelector(state => {
        const membersList = state.entities.association.selectedAssociationMembers
        const selected = membersList.find(member => member.id === selectedEngagement.Creator.userId)
        return selected
    })
    const engagementTranches = useSelector(state => {
        const list = state.entities.engagement.tranches
        const selectedTranches = list.filter(tranche => tranche.engagementId === selectedEngagement.id)
        return selectedTranches
    })

    const [showTranches, setShowTranches] = useState(false)
    const [montantToPay, setMontantToPay] = useState('')


    useEffect(() => {
    }, [])


    return (
        <ScrollView contentContainerStyle={{
            paddingBottom: 20
        }}>
            <BackgroundWithAvatar selectedMember={creatorMember}/>
            {selectedEngagement.progression > 0 && <View style={{
                alignItems: 'center',
                marginVertical: 40
            }}>
                {selectedEngagement.progression>0 && selectedEngagement.progression<1 && <Progress.Bar progress={selectedEngagement.progression} width={200}/>}
                {selectedEngagement.progression === 1 && <MaterialCommunityIcons name="credit-card-check" size={40} color={defaultStyles.colors.vert}/>}
            </View>}
            <View style={styles.montantContainer}>
            <View style={styles.numberContainer}>
                <View elevation={5} style={styles.number}>
                    <AppText style={{fontWeight: 'bold'}}>{formatFonds(selectedEngagement.montant + selectedEngagement.interetMontant)}</AppText>
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

            <View>
                <TouchableWithoutFeedback onPress={() => setShowTranches(!showTranches)}>
                    <View style={styles.trancheLabelContainer}>
                        {!showTranches && <MaterialCommunityIcons name="plus" size={24} color="black" />}
                        {showTranches && <MaterialCommunityIcons name="minus" size={24} color="black" />}
                        <AppText style={{color: defaultStyles.colors.bleuFbi}}>Tranches({engagementTranches.length})</AppText>
                    </View>
                </TouchableWithoutFeedback>
                {showTranches && <View style={styles.trancheContainer}>
                    {engagementTranches.length === 0 && <AppText>Aucune tranche trouvés</AppText>}
                    {engagementTranches.length>0 && <View>
                        {engagementTranches.map((tranche, index) =>
                            <TrancheItem
                                key={tranche.id+index}
                                numero={index+1}
                                toPay={tranche.montant}
                                payed={tranche.solde}
                                payingTranche={tranche.paying}
                                datePayement={tranche.solde === tranche.montant?tranche.updatedAt : tranche.echeance}
                                handlePayTranche={() => handlePayTranche(tranche.id, selectedEngagement.id, montantToPay)}
                                onChangeTrancheMontant={val => setMontantToPay(val)}
                                trancheEditMontant={montantToPay}
                                payTranche={() => {
                                    dispatch(getPayingTranche(tranche))
                                }}
                                renderRightActions={() =>
                                    getConnectedMember().id === selectedEngagement.creatorId?<TrancheRightActions
                                        ended={tranche.montant===tranche.solde}
                                        isPaying={tranche.paying}
                                        payingTranche={() => dispatch(getPayingTranche(tranche))}
                                    />:null}
                            />)}
                    </View>
                    }
                </View>}
                <ListItemSeparator/>
            </View>
            <AppLabelWithValue label='Libellé' value={selectedEngagement.libelle}/>
            <AppLabelWithValue label='Montant' value={formatFonds(selectedEngagement.montant)}/>
            <AppLabelWithValue label='Interet' value={formatFonds(selectedEngagement.interetMontant)}/>
            <AppLabelWithValue label='Total à payer' value={formatFonds(selectedEngagement.interetMontant + selectedEngagement.montant)}/>
            <AppLabelWithValue label='Echeance' value={formatDate(selectedEngagement.echeance)}/>
            <AppLabelWithValue label='Type' value={selectedEngagement.typeEngagement}/>
        </ScrollView>
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