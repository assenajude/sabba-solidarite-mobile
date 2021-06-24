import {useDispatch, useSelector, useStore} from "react-redux";
import dayjs from "dayjs";
import {Alert} from "react-native";
import {getAssociationLeave, getMemberDelete} from "../store/slices/memberSlice";
import {getEngagementsByAssociation} from "../store/slices/engagementSlice";
import {getAssociationCotisations} from "../store/slices/cotisationSlice";

let useManageAssociation;
export default useManageAssociation = () => {
    const store = useStore()
    const dispatch = useDispatch()
    const currentAssociation = useSelector(state => state.entities.association.selectedAssociation)
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
                const isLeaving = item.member.relation.toLowerCase() === 'onleave'
                if(isNew || isRejected || isLeaving) return true
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

    const leaveAssociation = (member) => {
        Alert.alert("Attention!", "Voulez-vous quitter definitivement l'associaiton?", [{
            text: 'non', onPress: () => {return;}
        }, {
            text: 'oui', onPress: async () => {
                await dispatch(getAssociationLeave({associationId: currentAssociation.id, userId: member.id}))
                const error = store.getState().entities.member.error
                if(error !== null) {
                    return  alert("Une erreur est apparue, veuillez reessayer plutard.")
                }
                alert(`votre demande de quitter l'association ${currentAssociation.nom} est en cours de traitement.`)
            }
        }] )

    }

    const deleteMember = (member) => {
        Alert.alert("Attention", "Etes-vous sûr de supprimer definitivement ce membre? Cette operation est irreversible, voulez-vous vraiment?", [{
            text: 'non', onPress: () => {return;}
        }, {
            text: 'oui', onPress: async() => {
                await dispatch(getMemberDelete({memberId: member.member.id, associationId: currentAssociation.id}))
                const error = store.getState().entities.member.error
                if(error !== null)  {
                    return alert("Impossible de faire la suppression, une erreur est apparue.")
                }
                dispatch(getEngagementsByAssociation({associationId: currentAssociation.id}))
                dispatch(getAssociationCotisations({associationId: currentAssociation.id}))
                alert("Le membre a été supprimé avec succès.")
            }
        }])
    }

    return {getMemberRelationType, formatFonds,votorsNumber,leaveAssociation, deleteMember,
        formatDate, associationValidMembers, getNewAdhesion, getManagedAssociationFund}
}