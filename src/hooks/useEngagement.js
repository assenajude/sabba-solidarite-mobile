import React from 'react'
import {useDispatch, useSelector, useStore} from "react-redux";
import {ToastAndroid, Alert} from "react-native";
import {
    getEngagementById,
    getEngagementDelete,
    getTranchePayed
} from "../store/slices/engagementSlice";
import {getSelectedAssociation} from "../store/slices/associationSlice";
import useAuth from "./useAuth";
import {getUserData} from "../store/slices/authSlice";
import {getConnectedMemberUser} from "../store/slices/memberSlice";
import useManageAssociation from "./useManageAssociation";

let useEngagement;
export default useEngagement = () => {
    const store = useStore()
    const dispatch = useDispatch()
    const {associationValidMembers} = useManageAssociation()
    const {dataSorter} = useAuth()
    const currentAssociation = useSelector(state => state.entities.association.selectedAssociation)
    const currentUser = useSelector(state => state.auth.user)
    const listEngagement = useSelector(state => state.entities.engagement.list)
    const votingData = useSelector(state => state.entities.engagement.votesList)
    const allTranches = useSelector(state => state.entities.engagement.tranches)

    const getMemberEngagementInfos = (member) => {
        let engagementLength = 0
        let engagementAmount = 0
        const memberEngagements = listEngagement.filter(item => item.creatorId === member.id)
        const memberValidEngagements = memberEngagements.filter(engage => engage.accord === true && engage.statut !== 'pending')
         engagementLength = memberValidEngagements.length
        memberValidEngagements.forEach(engage => {
            engagementAmount += engage.montant
        })
        return {engagementLength, engagementAmount}
    }

    const getAssociationEngagementTotal = () => {
        let total = 0
        const validList = listEngagement.filter(engage => engage.accord === true && engage.statut !== 'pending')
        const engagementLenght = validList.length
        validList.forEach(engage => {
            total += engage.montant
        })
        return {total, engagementLenght}
    }

    const getEngagementVotesdData = (engagement) => {
        let upVotes = 0
        let downVotes = 0
        const engagementVotes = votingData[engagement.id]
        if(engagementVotes && engagementVotes.length>0) {
        engagementVotes.forEach(item => {
            if(item.vote.typeVote.toLowerCase() === 'up') upVotes +=1
            else downVotes += 1
        })
        }
        return {upVotes, downVotes}
    }


    const handlePayTranche = async (trancheId, engagementId, montant) => {
        if(currentUser.wallet<montant) {
            return alert("Vous n'avez pas de fonds suffisant pour effectuer le payement.")
        }
        const data = {
            id: trancheId,
            montant,
            engagementId,
            userId: currentUser.id
        }
        await dispatch(getTranchePayed(data))
        const error = store.getState().entities.engagement.error
        if(error !== null) {
            return alert("Impossible de procceder au payement, une erreur est apparue. Veuillez reessayer plutard.")
        }
        dispatch(getEngagementById({engagementId: engagementId}))
        dispatch(getSelectedAssociation({associationId: currentAssociation.id}))
        dispatch(getConnectedMemberUser({associationId: currentAssociation.id}))
        dispatch(getUserData({userId: currentUser.id}))
        ToastAndroid.showWithGravity("Le payement a été effectué avec succès",
            ToastAndroid.CENTER,
            ToastAndroid.LONG)
    }

    const getEngagementTranches = (engagementId) => {
        let engageTranches = []
        const selectedTranches = allTranches.filter(tranch => tranch.engagementId = engagementId)
        engageTranches = selectedTranches
        return engageTranches
    }

    const getValidEngagementList = () => {
        const validList = listEngagement.filter(engage => {
            const isEngageValid = engage.accord === true && engage.statut === 'paying' || engage.statut === 'ended'
            const isMemberValid = associationValidMembers().users.some(member => member.id === engage.Creator.userId)
            if(isEngageValid && isMemberValid) return true
        })
        const sortedList = dataSorter(validList)
        return sortedList
    }

    const deleteEngagement = (engage) => {
        if(engage.statut.toLowerCase() === 'paying') {
            return alert("Vous n'êtes pas autorisés à supprimer cet engagement, il est encours de payement.")
        } else {
            Alert.alert("Attention!", "Voulez-vous supprimer cet engagement definitivement?", [{
                text: 'non', onPress: () => {return;}
            }, {
                text: 'oui', onPress: async() => {
                    await dispatch(getEngagementDelete({engagementId: engage.id}))
                    const error = store.getState().entities.engagement.error
                    if(error !== null) {
                        ToastAndroid.showWithGravity("Error: lors de la suppression, veuillez reessayer plutard.",
                            ToastAndroid.LONG,
                            ToastAndroid.CENTER)
                    }else {
                        ToastAndroid.showWithGravity("Engagement supprimé avec succès.",
                            ToastAndroid.LONG,
                            ToastAndroid.CENTER)
                    }
                }
            }])
        }
    }

    return {getMemberEngagementInfos, getAssociationEngagementTotal,deleteEngagement,
        getEngagementVotesdData, handlePayTranche, getEngagementTranches, getValidEngagementList}
}