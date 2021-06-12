import {useDispatch, useSelector, useStore} from "react-redux";
import {ToastAndroid} from "react-native";
import {getEngagementById, getTranchePayed} from "../store/slices/engagementSlice";
import {getConnectedMember, getSelectedAssociation} from "../store/slices/associationSlice";
import useAuth from "./useAuth";

let useEngagement;
export default useEngagement = () => {
    const store = useStore()
    const dispatch = useDispatch()
    const {getConnectedMember: connectedMember} = useAuth()
    const currentAssociation = useSelector(state => state.entities.association.selectedAssociation)
    const currentUser = useSelector(state => state.auth.user)
    const listEngagement = useSelector(state => state.entities.engagement.list)
    const votingData = useSelector(state => state.entities.engagement.votesList)

    const getMemberEngagementInfos = (member) => {
        let engagementLength = 0
        let engagementAmount = 0
        const memberEngagements = listEngagement.filter(item => item.creatorId === member.member.id)
        const memberValidEngagements = memberEngagements.filter(engage => engage.accord === true)

         engagementLength = memberValidEngagements.length
        memberValidEngagements.forEach(engage => {
            engagementAmount += engage.montant
        })
        return {engagementLength, engagementAmount}
    }

    const getAssociationEngagementTotal = () => {
        let total = 0
        const validList = listEngagement.filter(engage => engage.accord === true)
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
        dispatch(getConnectedMember({associationId: currentAssociation.id, memberId: connectedMember().id}))
        dispatch(getSelectedAssociation({associationId: currentAssociation.id}))
        ToastAndroid.showWithGravity("Le payement a été effectué avec succès",
            ToastAndroid.CENTER,
            ToastAndroid.LONG)
    }

    return {getMemberEngagementInfos, getAssociationEngagementTotal, getEngagementVotesdData, handlePayTranche}
}