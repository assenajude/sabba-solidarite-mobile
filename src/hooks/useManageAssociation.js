import {useDispatch, useSelector, useStore} from "react-redux";
import dayjs from "dayjs";
import {Alert} from "react-native";
import {
    getAssociationLeave,
    getConnectedUserAssociations,
    getMemberDelete,
    sendAdhesionMessage
} from "../store/slices/memberSlice";
import {getEngagementsByAssociation} from "../store/slices/engagementSlice";
import {getAssociationCotisations} from "../store/slices/cotisationSlice";
import {getAllAssociation, getAssociationDelete} from "../store/slices/associationSlice";
import useAuth from "./useAuth";

let useManageAssociation;
export default useManageAssociation = () => {
    const store = useStore()
    const dispatch = useDispatch()
    const currentAssociation = useSelector(state => state.entities.association.selectedAssociation)
        const engagementsList = useSelector(state => state.entities.engagement.list)
    const associationMembers = useSelector(state => state.entities.member.list)
    const userAssociations = useSelector(state => state.entities.member.userAssociations)
    const connectedUser = useSelector(state => state.auth.user)


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
        let quotite = 0
        const securityFund = currentAssociation.fondInitial * currentAssociation.seuilSecurite / 100
        quotite = currentAssociation.fondInitial - securityFund
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
        return {investAmount, depenseAmount, gain, quotite}
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

    const deleteAssociation = (association) => {
        if(association.fondInitial !== 0) {
            return alert("Vous n'êtes pas autorisé à supprimer cette association.")
        }

        Alert.alert("Attention", "Etes-vous sûr de supprimer definitivement cette association ? Cette operation est irreversible, voulez-vous vraiment?", [{
            text: 'non', onPress: () => {return;}
        }, {
            text: 'oui', onPress: async() => {
                await dispatch(getAssociationDelete({associationId: association.id}))
                const error = store.getState().entities.association.error
                if(error !== null)  {
                    return alert("Impossible de faire la suppression, une erreur est apparue.")
                }
                dispatch(getAllAssociation())
                dispatch(getConnectedUserAssociations())
                alert("L'association a été supprimé avec succès.")
            }
        }])
    }

    const sendAdhesionMessageToAssociation = (association) => {
        Alert.alert("Alert", "Voulez-vous adherer à cette association?", [{
            text: 'oui', onPress: async() => {
                const data = {
                    associationId: association.id,
                    userId: connectedUser.id,
                    relation: 'onDemand'
                }
                await dispatch(sendAdhesionMessage(data))
                const error = store.getState().entities.member.error
                if(error !== null) {
                    return  alert("Votre message n'a pas été envoyé, veuillez reessayer plutard.")
                }
            }
        }, {
            text: 'non', onPress: () => {return;}
        }])

    }

    const memberQuotite = () => {
        let quotite = 0
        if(currentAssociation.individualQuotite > 0) {
            quotite = getManagedAssociationFund().quotite * currentAssociation.individualQuotite / 100
        }else{
            quotite = getManagedAssociationFund().quotite
        }
        return quotite
    }

    return {getMemberRelationType, formatFonds,votorsNumber,leaveAssociation, deleteMember,sendAdhesionMessageToAssociation,
        formatDate, associationValidMembers, getNewAdhesion, getManagedAssociationFund, deleteAssociation, memberQuotite}
}