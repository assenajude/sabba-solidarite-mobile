import React from 'react';
import {View, FlatList, StyleSheet, Alert, ToastAndroid} from "react-native";
import AppText from "../components/AppText";
import {useDispatch, useSelector, useStore} from "react-redux";
import EngagementItem from "../components/engagement/EngagementItem";
import useEngagement from "../hooks/useEngagement";
import useAuth from "../hooks/useAuth";
import defaultStyles from '../utilities/styles'
import {
    getAllVotes, getEngagementDelete,
    getEngagementDetail, getEngagementsByAssociation,
    showEngagementTranches,
    voteEngagement
} from "../store/slices/engagementSlice";
import ListItemSeparator from "../components/ListItemSeparator";
import AppActivityIndicator from "../components/AppActivityIndicator";
import {getSelectedAssociation} from "../store/slices/associationSlice";
import {getUserData} from "../store/slices/authSlice";
import {getConnectedMemberUser} from "../store/slices/memberSlice";

function NewEngagementList({navigation}) {
    const dispatch = useDispatch()
    const  {dataSorter} = useAuth()
    const store = useStore()
    const {getMemberUserCompte, getConnectedMember:connectedMember} = useAuth()
    const {getEngagementVotesdData} = useEngagement()

    const currentAssociation = useSelector(state => state.entities.association.selectedAssociation)
    const voting = useSelector(state => state.entities.engagement.votesList)
    const isLoading = useSelector(state => state.entities.engagement.loading)
    const allTranches = useSelector(state => state.entities.engagement.tranches)

    const validationEngagement = useSelector(state => {
        const list = state.entities.engagement.list
        let selectedList = []
        list.forEach(item => {
            if(item.accord === false) selectedList.push(item)
            else if (item.statut === 'pending') selectedList.push(item)
        })
        const sortedList = dataSorter(selectedList)
        return sortedList
    })

    const voteUp = async (item) => {
        const data = {
            id: item.id,
            typeVote: 'up',
            votorId: connectedMember().id,
            associationId: currentAssociation.id
        }
        dispatch(voteEngagement(data))
        dispatch(getAllVotes({associationId: currentAssociation.id}))
        dispatch(getSelectedAssociation({associationId: currentAssociation.id}))
        dispatch(getConnectedMemberUser({associationId: currentAssociation.id}))
        dispatch(getEngagementsByAssociation({associationId: currentAssociation.id}))
        dispatch(getUserData({userId: getMemberUserCompte().id}))

    }

    const voteDown = (item) => {
        const data = {
            id: item.id,
            typeVote: 'down',
            votorId: connectedMember().id,
            associationId: currentAssociation.id
        }
        dispatch(voteEngagement(data))
        dispatch(getAllVotes({associationId: currentAssociation.id}))
        dispatch(getEngagementsByAssociation({associationId: currentAssociation.id}))
    }

    const handleDeleteEngagement = (engagement) => {
        Alert.alert("Attention.", "Voulez-vous supprimer definitivement cet engagement?",
            [
                {
                    text: 'oui', onPress: async () => {
                       await dispatch(getEngagementDelete({engagementId: engagement.id}))
                        const error = store.getState().entities.engagement.error
                        if(error !== null) {
                            return alert("Impossible de faire la suppression. Une erreur est apparue.")
                        }
                       ToastAndroid.showWithGravity("Engagement supprimé.",
                           ToastAndroid.LONG,
                           ToastAndroid.CENTER)
                    }
                }, {
            text: 'non', onPress: () => {return;}
            }])
    }

    return (
        <>
           <AppActivityIndicator visible={isLoading}/>
            {validationEngagement.length=== 0 && <View style={styles.empty}>
                <AppText>Aucun engagement trouvé</AppText>
            </View>}
          {validationEngagement.length>0 && <FlatList
               data={validationEngagement}
               keyExtractor={item => item.id.toString()}
               ItemSeparatorComponent={ListItemSeparator}
               renderItem={({item}) =>
                   <EngagementItem
                       deleteEngagement={() => handleDeleteEngagement(item)}
                       editEngagement={() => navigation.navigate('EditEngagementScreen', item)}
                       onWaiting={item.statut.toLowerCase() === 'pending' || item.statut.toLowerCase() === 'rejected'}
                       getMembersDatails={() => navigation.navigate('Members',{screen: 'MemberDetails', params: getMemberUserCompte(item.Creator)})}
                       getMoreDetails={() => dispatch(getEngagementDetail(item))}
                       renderRightActions={() => <View>
                           <AppText style={{color: defaultStyles.colors.bleuFbi, fontSize:15, marginLeft: 20}}>voting...</AppText>
                       </View>}
                       engagement={item}
                       tranches={allTranches.filter(tranche => tranche.engagementId === item.id)}
                       showTranches={item.showTranches}
                       getTranchesShown={() => dispatch(showEngagementTranches(item))}
                       isVoting={item.accord===false}
                       upVotes={getEngagementVotesdData(item).upVotes}
                       downVotes={getEngagementVotesdData(item).downVotes}
                       allVoted={voting[item.id]?.length?voting[item.id].length:0}
                       handleVoteUp={() => voteUp(item)}
                       handleVoteDown={() => voteDown(item)}
                       getEngagementDetails={() => dispatch(getEngagementDetail(item))}
                       engagementDetails={item.showDetail}
                   selectedMember={getMemberUserCompte(item.Creator)}
                   />}/>}
        </>
    );
}

const styles = StyleSheet.create({
    empty:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
export default NewEngagementList;