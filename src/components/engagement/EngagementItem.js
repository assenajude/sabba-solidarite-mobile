import React from 'react';
import {View, TouchableOpacity, StyleSheet} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import AppText from "../AppText";
import useManageAssociation from "../../hooks/useManageAssociation";
import MemberItem from "../member/MemberItem";
import defaultStyles from '../../utilities/styles'
import VoteItem from "../vote/VoteItem";
import AppSimpleLabelWithValue from "../AppSimpleLabelWithValue";
import TrancheItem from "../tranche/trancheItem";
import {getPayingTranche} from "../../store/slices/engagementSlice";
import {useDispatch} from "react-redux";
import * as Progress from "react-native-progress";


function EngagementItem({getEngagementDetails,getMembersDatails,selectedMember,engagement,tranches,renderRightActions,
                            engagementDetails, handleVoteUp, handleVoteDown, showAvatar=true,
                            allVoted, downVotes, upVotes, isVoting, validationDate, showTranches, getTranchesShown,
                            handlePayTranche, onChangeTrancheMontant, editTrancheMontant, getMoreDetails}) {

    const dispatch = useDispatch()
    const {formatFonds, formatDate} = useManageAssociation()

    return (
        <>


            <View style={styles.container}>
                <View style={{
                    marginVertical: 10
                }}>
                    { engagement.progression>0 && engagement.progression<1 &&
                    <Progress.Bar
                        color={engagement.progression<0.5?defaultStyles.colors.rougeBordeau : defaultStyles.colors.bleuFbi}
                        progress={engagement.progression}
                        width={200}/>
                    }
                    {engagement.progression === 1 && <MaterialCommunityIcons name="credit-card-check" size={24} color={defaultStyles.colors.vert} />}
                </View>
                <AppText numberOfLines={2} style={{width: '50%', fontWeight: 'bold'}}>{engagement.libelle}</AppText>
                <View style={styles.montant}>
                    <AppText style={{fontSize: 15, fontWeight: 'bold'}}>{formatFonds(engagement.montant)}</AppText>
                </View>
                <View style={{marginVertical: 10 }}>
                    <AppText onPress={getMoreDetails} style={{color: defaultStyles.colors.bleuFbi}}> + Details</AppText>
                </View>
                {engagementDetails && <View>
                    <AppSimpleLabelWithValue label='Montant demandée' labelValue={formatFonds(engagement.montant)}/>
                    <AppSimpleLabelWithValue label='Montant Interet' labelValue={formatFonds(engagement.interetMontant)}/>
                    <AppSimpleLabelWithValue label='Total à rembourser' labelValue={formatFonds(engagement.montant+engagement.interetMontant)}/>
                    <AppSimpleLabelWithValue label='Date demande' labelValue={formatDate(engagement.createdAt)}/>
                    {validationDate && <AppSimpleLabelWithValue label='Date Validation' labelValue={formatDate(validationDate)}/>}
                    <AppSimpleLabelWithValue label='Date écheance' labelValue={formatDate(engagement.echeance)}/>
                    <View>
                        <View style={styles.trancheIcon}>
                            <TouchableOpacity onPress={getTranchesShown}>
                                {!showTranches && <MaterialCommunityIcons name="plus" size={24} color="black" />}
                                {showTranches && <MaterialCommunityIcons name="minus" size={24} color="black" />}
                            </TouchableOpacity>
                            <AppText style={{marginLeft: 10, color: defaultStyles.colors.bleuFbi}}>Tranches({tranches.length})</AppText>
                        </View>
                        {showTranches && <View style={styles.trancheContainer}>
                        {tranches.length > 0 && <View style={{
                            marginHorizontal: 20,
                            alignItems: 'center'
                        }}>
                            {tranches.map((item,index)=>
                                <TrancheItem
                                    handlePayTranche={() => handlePayTranche(item)}
                                    renderRightActions={() => renderRightActions(item)}
                                    trancheEditMontant={editTrancheMontant}
                                    onChangeTrancheMontant={onChangeTrancheMontant}
                                    payingTranche={item.paying}
                                    payTranche={() => {
                                        dispatch(getPayingTranche(item))
                                    }}
                                    key={item.id.toString()}
                                    numero={index+1}
                                    payed={item.solde}
                                    toPay={item.montant}
                                    datePayement={item.montant === item.solde?item.updatedAt:item.echeance} />
                                    )}

                        </View>}
                        {tranches.length === 0 && <AppText>aucune tranche de payement</AppText>}
                    </View>}
                    </View>
                    <View style={{
                        alignItems: 'center',
                        marginRight: 100,
                        width: 60,
                        paddingHorizontal: 15,
                        alignSelf: 'flex-end',
                        backgroundColor: defaultStyles.colors.white
                    }}>
                        <TouchableOpacity onPress={getEngagementDetails}>
                            <MaterialCommunityIcons name="chevron-up" size={30} color={defaultStyles.colors.dark} />
                        </TouchableOpacity>
                    </View>
                </View>}
                {showAvatar && <View style={styles.avatarContainer}>
                    <AppText style={{margin: 10, color: defaultStyles.colors.grey}}>Par</AppText>
                    <MemberItem avatarStyle={styles.avatar} selectedMember={selectedMember} getMemberDetails={getMembersDatails}/>
                </View>}
                <View style={styles.icon}>
                    {!engagementDetails &&
                    <TouchableOpacity onPress={getEngagementDetails}>
                        <MaterialCommunityIcons name="chevron-down" size={30} color={defaultStyles.colors.dark} />
                    </TouchableOpacity>
                    }
                </View>
            </View>
            {isVoting && <VoteItem
                downVotes={downVotes}
                upVotes={upVotes}
                allVoted={allVoted}
                handleVoteDown={handleVoteDown}
                handleVoteUp={handleVoteUp}
            />}
            </>
    );
}

const styles = StyleSheet.create({
    avatar:{
        height: 40,
        width: 40,
        borderRadius: 20
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10
    },
    container: {
        paddingHorizontal: 10,
        marginVertical: 40,
        marginTop: 10
    },
    detail:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginVertical: 10
    },
    icon: {
      position: 'absolute',
      right: 100,
      bottom: -30,
        backgroundColor: defaultStyles.colors.white,
        paddingHorizontal: 10
    },
    label: {
      fontWeight: '900'
    },
    montant: {
        position: 'absolute',
        right: 20,
        top: 10
    },
    trancheContainer: {
        borderWidth: 1,
        minHeight: 100,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20
    },
    trancheIcon: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    voteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginHorizontal: 20,
        marginTop: 20,
    }
})
export default EngagementItem;