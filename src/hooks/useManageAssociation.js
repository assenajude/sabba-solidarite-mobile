import {useSelector} from "react-redux";
import dayjs from "dayjs";
import useAuth from "./useAuth";

let useManageAssociation;
export default useManageAssociation = () => {
    const {validMembers} = useAuth()
    const currentAssociation = useSelector(state => state.entities.association.selectedAssociation)
    const connectedMember = useSelector(state => state.auth.user)
        const engagementsList = useSelector(state => state.entities.engagement.list)
    const associationMembers = useSelector(state => state.entities.member.list)
    const userAssociations = useSelector(state => state.entities.member.userAssociations)


    const getMemberRelationType = (association) => {
        let associationType = "noRelation"
        const selectedAssociation = userAssociations.find(ass => ass.id === association.id)
        if(selectedAssociation) {
            associationType = selectedAssociation.member?.relation
        }
     return associationType
    }
    const formatFonds = (fonds) => {
        const formated = fonds?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
        return `${formated} XOF`
    }

    const formatDate = (date) => {
        let formated = ''
        if(date) {
            formated = dayjs(date).format('DD/MM/YYYY HH:mm:ss')
        }
        return formated

    }

    const associationValidMembers = () => {
        let validList = []
        validList = associationMembers.filter(item => item.member.relation.toLowerCase() === 'member' || item.member.relation.toLowerCase() === 'onleave')
        const validMembers = validList.map(user => user.member)
        return {users: validList, members: validMembers}
    }


    const getNewAdhesion = () => {
            const adhesionList = associationMembers.filter(item => {
                const isNew = item.member.relation.toLowerCase() === 'ondemand'
                const isRejected = item.member.relation.toLowerCase() === 'rejected'
                if(isNew || isRejected) return true
            })
            return adhesionList
    }

    const getManagedAssociationFund = () => {
        let investAmount = 0
        let depenseAmount = 0
        let gain = 0
        const validList = engagementsList.filter(engage => engage.accord === true)
        if(validList.length>0) {
        validList.forEach(item => {
            if(item.typeEngagement.toLowerCase() === 'remboursable') {
                if(item.statut.toLowerCase() === 'paying' || item.statut.toLowerCase() === 'ended') {
                investAmount += item.montant
                }
                if(item.statut.toLowerCase() === 'ended') {
                    gain += item.interetMontant
                }
            } else depenseAmount += item.montant
        })
        }
        return {investAmount, depenseAmount, gain}
    }

    const votorsNumber = () => {
        let number = 0
        if(currentAssociation.validationLenght>0) {
            number = currentAssociation.validationLenght
        } else {
            const membersLengtht = associationValidMembers().members.length
            if(membersLengtht <= 10) {
                number = membersLengtht
            } else {
                const numberToVote = Math.ceil(membersLengtht / 3)
                number = numberToVote
            }
        }
        return number
    }

    return {getMemberRelationType, formatFonds,votorsNumber,
        formatDate, associationValidMembers, getNewAdhesion, getManagedAssociationFund}
}