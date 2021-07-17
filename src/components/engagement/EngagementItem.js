import React, {useEffect, useState} from 'react';
import {View,StyleSheet} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import AppText from "../AppText";
import useManageAssociation from "../../hooks/useManageAssociation";
import MemberItem from "../member/MemberItem";
import defaultStyles from '../../utilities/styles'
import VoteItem from "../vote/VoteItem";
import AppSimpleLabelWithValue from "../AppSimpleLabelWithValue";
import TrancheItem from "../tranche/trancheItem";
import {
    getPayingTranche,
    voteEngagement
} from "../../store/slices/engagementSlice";
import {useDispatch, useSelector} from "react-redux";
import * as Progress from "react-native-progress";
import AppIconButton from "../AppIconButton";
import useAuth from "../../hooks/useAuth";
import routes from "../../navigation/routes";
import {useNavigation} from '@react-navigation/native'
import useEngagement from "../../hooks/useEngagement";
import {getSelectedAssociation} from "../../store/slices/associationSlice";
import {getConnectedMemberUser} from "../../store/slices/memberSlice";
import {getUserData} from "../../store/slices/authSlice";
import TrancheRightActions from "../tranche/TrancheRightActions";


function EngagementItem({getEngagementDetails,getMembersDatails,selectedMember,engagement,isEditable=false,
                            onWaiting, engagementDetails,showAvatar=true,getMoreDetails,
                            isVoting, validationDate, showTranches, getTranchesShown,
                            editEngagement, deletePending}) {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const {votorsNumber, formatFonds, formatDate} = useManageAssociation()
    const {isAdmin, isModerator,getMemberUserCompte, getConnectedMember:connectedMember} = useAuth()
    const isAuthorized = isModerator() || isAdmin()
    const {deleteEngagement, getEngagementVotesdData, handlePayTranche, getEngagementVotans} = useEngagement()

    const tranches = useSelector(state => {
        const list = state.entities.engagement.tranches
        const selectedTranches = list.filter(item => item.engagementId === engagement.id)
        return selectedTranches
    })
    const currentAssociation = useSelector(state => state.entities.association.selectedAssociation)


    const [upVotes, setUpVotes] = useState(getEngagementVotesdData(engagement).upVotes)
    const [downVotes, setDownVotes] = useState(getEngagementVotesdData(engagement).downVotes)
    const [tranchePayMontant, setTranchePayMontant] = useState('')
    const [allVoted, setAllVoted] = useState(upVotes+downVotes)

    const handleDeleteEngagement = async (engage) => {
        await deleteEngagement(engage)
    }



    const voteUp = (item) => {
        const data = {
            id: item.id,
            typeVote: 'up',
            votorId: connectedMember().id,
            associationId: currentAssociation.id
        }
        dispatch(voteEngagement(data))
        if(allVoted === votorsNumber() && getEngagementVotesdData(engagement).upVotes > getEngagementVotesdData(engagement).downVotes) {
            dispatch(getSelectedAssociation({associationId: currentAssociation.id}))
            dispatch(getConnectedMemberUser({associationId: currentAssociation.id}))
            dispatch(getUserData({userId: getMemberUserCompte().id}))
        }


    }

    const voteDown = (item) => {
        const data = {
            id: item.id,
            typeVote: 'down',
            votorId: connectedMember().id,
            associationId: currentAssociation.id
        }
        dispatch(voteEngagement(data))
    }

    const handleGetVotants = () => {
        const params = {engagement:engagement, votants:getEngagementVotans(engagement.id)}
        navigation.navigate('Engagements',{screen:routes.VOTANT,params:params})
    }

    useEffect(() => {
        setUpVotes(getEngagementVotesdData(engagement).upVotes)
        setDownVotes(getEngagementVotesdData(engagement).downVotes)
        setAllVoted(upVotes+downVotes)

    }, [getEngagementVotesdData(engagement).upVotes, getEngagementVotesdData(engagement).downVotes])

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
                    <AppSimpleLabelWithValue label='Montant Penalité' labelValue={formatFonds(engagement.penalityMontant)}/>
                    <AppSimpleLabelWithValue label='Total à rembourser' labelValue={formatFonds(engagement.montant+engagement.interetMontant+engagement.penalityMontant)}/>
                    <AppSimpleLabelWithValue label='Date demande' labelValue={formatDate(engagement.createdAt)}/>
                    {validationDate && <AppSimpleLabelWithValue label='Date Validation' labelValue={formatDate(validationDate)}/>}
                    <AppSimpleLabelWithValue label='Date écheance' labelValue={formatDate(engagement.echeance)}/>
                    {!isVoting && <View style={{
                        marginVertical: 10,
                        marginBottom: 20
                    }}>
                        <AppText onPress={handleGetVotants}
                                 style={{color: defaultStyles.colors.bleuFbi}}>Voir les votants</AppText>
                    </View>}
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
                                    handlePayTranche={() =>handlePayTranche(item.id, engagement.id, tranchePayMontant)}
                                    renderRightActions={() =>
                                        connectedMember().id === engagement.creatorId?<TrancheRightActions
                                            ended={item.montant===item.solde}
                                            isPaying={item.paying}
                                            payingTranche={() => {dispatch(getPayingTranche(item))}}
                                        />:null
                                    }
                                    trancheEditMontant={tranchePayMontant}
                                    onChangeTrancheMontant={val => setTranchePayMontant(val)}
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
                    {isAuthorized && <View style={{
                        alignItems:'center',
                        flexDirection: 'row',
                        justifyContent: 'flex-end'
                    }}>
                       {isEditable && <AppIconButton onPress={() => navigation.navigate(routes.NEW_ENGAGEMENT, {...engagement, editing: true})}
                                       containerStyle={[styles.iconContainer, {marginHorizontal:20}]}
                                       iconName='circle-edit-outline'/>}
                        <AppIconButton onPress={() => handleDeleteEngagement(engagement)}
                                       containerStyle={styles.iconContainer}
                                       iconColor={defaultStyles.colors.rougeBordeau}
                                       iconName='delete'/>
                    </View>}
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
                getEngagementVotants={handleGetVotants}
                downVotes={downVotes}
                upVotes={upVotes}
                allVoted={getEngagementVotesdData(engagement).upVotes+getEngagementVotesdData(engagement).downVotes}
                handleVoteUp={() => voteUp(engagement)}
                handleVoteDown={() => voteDown(engagement)}
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
                        onPress={deletePending}
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
                        onPress={deletePending}
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
    iconContainer: {
        paddingHorizontal: 0,
        height: 50,
        width: 50,
        borderRadius: 25,
        marginVertical: 10
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