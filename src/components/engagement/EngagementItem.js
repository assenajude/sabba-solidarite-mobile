import React from 'react';
import {View,StyleSheet,ToastAndroid} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import AppText from "../AppText";
import useManageAssociation from "../../hooks/useManageAssociation";
import MemberItem from "../member/MemberItem";
import defaultStyles from '../../utilities/styles'
import VoteItem from "../vote/VoteItem";
import AppSimpleLabelWithValue from "../AppSimpleLabelWithValue";
import {
    voteEngagement
} from "../../store/slices/engagementSlice";
import {useDispatch, useSelector, useStore} from "react-redux";
import AppIconButton from "../AppIconButton";
import useAuth from "../../hooks/useAuth";
import routes from "../../navigation/routes";
import {useNavigation} from '@react-navigation/native'
import useEngagement from "../../hooks/useEngagement";
import {getSelectedAssociation, getStateUpdate} from "../../store/slices/associationSlice";
import {ProgressBar} from "react-native-paper";
import AppButton from "../AppButton";
import ListItemSeparator from "../ListItemSeparator";


function EngagementItem({getEngagementDetails,getMembersDatails,selectedMember,engagement,isEditable=false,
                            onWaiting, engagementDetails,showAvatar=true,getMoreDetails,
                            isVoting, validationDate,showSeparator,
                            editEngagement, deletePending}) {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const store = useStore()
    const { formatFonds, formatDate} = useManageAssociation()
    const {isAdmin, isModerator,getConnectedMember:connectedMember} = useAuth()
    const isAuthorized = isModerator() || isAdmin()
    const {deleteEngagement, getEngagementVotesdData, getEngagementVotans} = useEngagement()

    const tranches = useSelector(state => {
        const list = state.entities.engagement.tranches
        const selectedTranches = list.filter(item => item.engagementId === engagement.id)
        return selectedTranches
    })
    const currentAssociation = useSelector(state => state.entities.association.selectedAssociation)


    const {downVotes, upVotes } = getEngagementVotesdData(engagement)

    const handleDeleteEngagement = async (engage) => {
        await deleteEngagement(engage)
    }



    const voteUp = async (item) => {
        const data = {
            id: item.id,
            typeVote: 'up',
            votorId: connectedMember().id,
            associationId: currentAssociation.id
        }
        await dispatch(voteEngagement(data))
        const error = store.getState().entities.engagement.error
        if(error !== null) {
           return  alert("Nous n'avons pas pu enregistrer votre vote. Veuillez reessayer plutard.")
        }
        ToastAndroid.showWithGravity('Vous avez voté avec succès.', ToastAndroid.LONG, ToastAndroid.CENTER)
        dispatch(getStateUpdate({updating: true}))

    }

    const voteDown = async (item) => {
        const data = {
            id: item.id,
            typeVote: 'down',
            votorId: connectedMember().id,
            associationId: currentAssociation.id
        }
        await dispatch(voteEngagement(data))
        const error = store.getState().entities.engagement.error
        if(error !== null) {
            alert("Nous n'avons pas pu enregistrer votre vote. Veuillez reessayer plutard.")
        }else {
            ToastAndroid.showWithGravity('Vous avez voté avec succès.', ToastAndroid.LONG, ToastAndroid.CENTER)
        }
    }

    const handleGetVotants = () => {
        const votants = getEngagementVotans(engagement.id)
        const params = {engagement:engagement, votants}
        navigation.navigate('Engagements',{screen:routes.VOTANT,params:params})
    }

    const total = engagement.montant+engagement.interetMontant+engagement.penalityMontant
    const reste = total - engagement.solde
    return (
        <>
            {showSeparator && <ListItemSeparator/>}
            <View style={styles.container}>
                <View style={{
                    marginVertical: 10
                }}>
                    { engagement.progression>0 && engagement.progression<1 &&
                    <ProgressBar

                        color={engagement.progression<0.5?defaultStyles.colors.rougeBordeau : defaultStyles.colors.orange}
                        progress={engagement.progression}
                        style={{width: 200, height: 5}}
                    />
                    }
                    {engagement.progression === 1 && <MaterialCommunityIcons name="credit-card-check" size={24} color={defaultStyles.colors.vert} />}
                </View>
                <AppText numberOfLines={2} style={{width: '50%', fontWeight: 'bold'}}>{engagement.libelle}</AppText>
                <View style={styles.montant}>
                    <AppText style={{fontSize: 15, fontWeight: 'bold'}}>{formatFonds(engagement.montant)}</AppText>
                </View>

                <View style={styles.details}>
                    <AppButton
                        mode='text'
                        title='+ Details'
                        onPress={getMoreDetails}
                    />
                    <AppIconButton
                        iconSize={30}
                        containerStyle={{width: 70,height: 30}}
                        iconName={engagementDetails?'chevron-up' : 'chevron-down'}
                        onPress={getEngagementDetails}/>
                </View>
                {engagementDetails && <View>
                    <AppSimpleLabelWithValue label='Montant demandée' labelValue={formatFonds(engagement.montant)}/>
                    <AppSimpleLabelWithValue label='Montant Interet' labelValue={formatFonds(engagement.interetMontant)}/>
                    <AppSimpleLabelWithValue label='Montant Penalité' labelValue={formatFonds(engagement.penalityMontant)}/>
                    <AppSimpleLabelWithValue label='Total à rembourser' labelValue={formatFonds(total)}/>
                    <AppSimpleLabelWithValue label='Total remboursé' labelValue={formatFonds(engagement.solde)}/>
                    <AppSimpleLabelWithValue label='Reste à rembourser' labelValue={formatFonds(reste)}/>
                    <AppSimpleLabelWithValue label='Date demande' labelValue={formatDate(engagement.createdAt)}/>
                    {validationDate && <AppSimpleLabelWithValue label='Date Validation' labelValue={formatDate(validationDate)}/>}
                    <AppSimpleLabelWithValue label='Date écheance' labelValue={formatDate(engagement.echeance)}/>

                    <View
                        style={{
                        marginVertical: 10,
                            alignItems: 'flex-start'
                    }}>
                        {!isVoting &&
                            <AppButton
                                title='Voir les votants'
                                mode='text'
                                onPress={handleGetVotants}
                            />
                        }
                        <AppButton
                            onPress={() => navigation.navigate(routes.TRANCHE, {...engagement, tranches})}
                            mode='text'
                            title={`Tranches payement (${tranches.length})`}
                        />
                    </View>

                    {isAuthorized && <View style={{
                        alignItems:'center',
                        flexDirection: 'row',
                        justifyContent: 'flex-end'
                    }}>
                       {isEditable && <AppIconButton onPress={() => navigation.navigate(routes.NEW_ENGAGEMENT, {...engagement, editing: true})}
                                       containerStyle={[styles.iconContainer, {marginHorizontal:20}]}
                                       iconName='circle-edit-outline'/>}
                        <AppIconButton
                            onPress={() => handleDeleteEngagement(engagement)}
                            containerStyle={styles.iconContainer}
                            iconColor={defaultStyles.colors.rougeBordeau}
                            iconName='delete'/>
                    </View>}
                </View>}
                {showAvatar && <View style={styles.avatarContainer}>
                    <AppText style={{margin: 10, color: defaultStyles.colors.grey}}>Par</AppText>
                    <MemberItem avatarStyle={styles.avatar} selectedMember={selectedMember} getMemberDetails={getMembersDatails}/>
                </View>}
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
                    {isAuthorized && <View style={{
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

                    </View>}
                </View>}
                {engagement.statut === 'rejected' && <View style={{
                    alignItems: 'center'
                }}>
                    <AppText
                        style={{
                            color: defaultStyles.colors.rougeBordeau,
                            fontWeight: 'bold'
                        }}>refusé</AppText>
                    {isAuthorized && <AppIconButton
                        containerStyle={{
                            margin: 10,
                            borderRadius: 30,
                            height: 60
                        }}
                        iconColor={defaultStyles.colors.rougeBordeau}
                        onPress={deletePending}
                        iconName='delete-circle'/>}
                </View>}
                </View>
               }
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
    },
    details: {
        marginVertical: 20,
        marginRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'}
})
export default EngagementItem;