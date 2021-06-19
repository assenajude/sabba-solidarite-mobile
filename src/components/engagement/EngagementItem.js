import React from 'react';
import {View,StyleSheet} from "react-native";
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
import AppIconButton from "../AppIconButton";


function EngagementItem({getEngagementDetails,getMembersDatails,selectedMember,engagement,tranches,renderRightActions,
                            onWaiting, engagementDetails, handleVoteUp, handleVoteDown, showAvatar=true,getMoreDetails,
                            allVoted, downVotes, upVotes, isVoting, validationDate, showTranches, getTranchesShown,
                            handlePayTranche, onChangeTrancheMontant, editTrancheMontant, deleteEngagement, editEngagement}) {

    const dispatch = useDispatch()
    const {formatFonds, formatDate} = useManageAssociation()

    return (
        <View>
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
                            <AppIconButton iconSize={24}
                                containerStyle={{width: 40, paddingHorizontal: 5}}
                                onPress={getTranchesShown}
                                iconName={showTranches?'minus':'plus'}/>
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
                    <AppIconButton
                        containerStyle={{alignSelf: 'center', marginLeft: 40}}
                        iconName='chevron-up'
                        onPress={getEngagementDetails}/>
                </View>}
                {showAvatar && <View style={styles.avatarContainer}>
                    <AppText style={{margin: 10, color: defaultStyles.colors.grey}}>Par</AppText>
                    <MemberItem avatarStyle={styles.avatar} selectedMember={selectedMember} getMemberDetails={getMembersDatails}/>
                </View>}
                <View style={styles.icon}>
                    {!engagementDetails &&
                        <AppIconButton
                            onPress={getEngagementDetails}
                            iconName='chevron-down'/>
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
            {onWaiting && <View style={styles.rejected}>
            </View>}
            {onWaiting && <View style={styles.waiting}>
                {engagement.statut === 'pending' &&
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                <AppText
                    style={{
                        color: defaultStyles.colors.vert,
                        fontWeight: 'bold'
                    }}>en attente</AppText>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                    <AppIconButton
                        containerStyle={{
                            margin: 10,
                            borderRadius: 30,
                            height: 60
                        }}
                        onPress={deleteEngagement}
                        iconColor={defaultStyles.colors.rougeBordeau}
                        iconName='delete-circle'/>

                     <AppIconButton
                         containerStyle={{
                             margin: 10,
                            borderRadius: 30,
                            height: 60
                         }}
                         onPress={editEngagement}
                        iconName='circle-edit-outline'/>

                    </View>
                </View>}
                {engagement.statut === 'rejected' && <View style={{
                    alignItems: 'center'
                }}>
                    <AppText
                        style={{
                            color: defaultStyles.colors.rougeBordeau,
                            fontWeight: 'bold'
                        }}>refusé</AppText>
                    <AppIconButton
                        containerStyle={{
                            margin: 10,
                            borderRadius: 30,
                            height: 60
                        }}
                        iconColor={defaultStyles.colors.rougeBordeau}
                        onPress={deleteEngagement}
                        iconName='delete-circle'/>
                </View>}
                </View>
               }
            </View>
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
    rejected: {
        position: 'absolute',
      height: '100%',
      width: '100%',
      backgroundColor: defaultStyles.colors.white,
      opacity: 0.6,
        zIndex: 5
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
    },
    waiting: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 20,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
export default EngagementItem;