import {useDispatch, useSelector, useStore} from "react-redux";
import dayjs from "dayjs";
import useAuth from "./useAuth";
import {Alert} from "react-native";
import {getCotisationDelete} from "../store/slices/cotisationSlice";

let useCotisation;
export default useCotisation = () => {
    const store = useStore()
    const dispatch = useDispatch()
    const {getConnectedMember} = useAuth()
    const associationCotisations = useSelector(state => state.entities.cotisation.list)
    const listCotisations = useSelector(state => state.entities.member.membersCotisations)
    const yearCotisations = useSelector(state => state.entities.member.memberYearCotisations)

    const getMonthString = (number) => {
        let monthString = ''
        switch(number) {
            case 1: monthString = 'Janvier';
            break;
            case 2: monthString = 'Fevrier';
            break;
            case 3: monthString = 'Mars';
            break;
            case 4: monthString = 'Avril';
            break;
            case 5: monthString = 'Mai';
            break;
            case 6: monthString = 'Juin';
            break;
            case 7: monthString = 'Juillet';
            break;
            case 8: monthString = 'Aout';
            break;
            case 9: monthString = 'Septembre';
            break;
            case 10: monthString = 'Octobre';
            break;
            case 11: monthString = 'Novembre';
            break;
            case 12: monthString = 'Decembre';
            break;
            default: monthString = 'Mois indefini';
            break;
        }
        return monthString
    }

    const getMonthCotisations = (month) => {
        const monthCotisations = yearCotisations.filter(cotisation => {
            const cotisationdate = cotisation.member_cotisation.paymentDate
            const cotisationMonth = dayjs(cotisationdate).month()
            if(cotisationMonth === month.number) return true
            return false
        })
        return monthCotisations
    }

    const getMonthTotal = (month) => {
        const selectedMonthCotisations = getMonthCotisations(month)
        let total = 0
        selectedMonthCotisations.forEach(cotisation => {
            total += cotisation.montant
        })
        return total
    }
    const getMemberCotisations = (member) => {
        let cotisationLenght = 0
        let totalCotisation = 0
        const memberCotisations = listCotisations[member.id]
        if(memberCotisations && memberCotisations.length>0) {
        cotisationLenght = memberCotisations.length
        memberCotisations.forEach(cotis => {
            totalCotisation += cotis.montant
        })
        }
        return {cotisationLenght, totalCotisation}
    }

    const getCurrentAssoCotisations = () => {
        let total = 0
        const currentCotisations = Object.values(listCotisations)
        const newTab = []
        currentCotisations.forEach(tab => {
            newTab.push(...tab)
        })
        const cotisLenght = newTab.length
        newTab.forEach(cotis => {
            total += cotis.montant
        })
        return {total, cotisLenght}
    }

    const isCotisationPayed = (cotisation) => {
        let isPayed = false
        const memberCotisations = listCotisations[getConnectedMember().id]
        if(memberCotisations && memberCotisations.length > 0) {
        const isCotisPayed = memberCotisations.some(cotis => cotis?.id === cotisation?.id && cotis.member_cotisation?.isPayed === true)
        if(isCotisPayed) isPayed = true
        }
        return isPayed
    }

    const notPayedCompter = (member) => {
        let compter = 0
        if(member){
            const memberCotisation = listCotisations[member.id]
            if(memberCotisation) {
            const notPayedArray = associationCotisations.filter(cotis => !memberCotisation.some(select => select.id === cotis.id))
            if(notPayedArray && notPayedArray.length>0) compter = notPayedArray.length
            }
        }

        return compter
    }

    const deleteCotisation = (cotisationId) => {
        Alert.alert("Attention", "voulez-vous supprimer definitivement cette cotisation.", [{
            text: 'non', onPress: () => {return;}
        }, {
            text: 'oui', onPress: async() => {
                await dispatch(getCotisationDelete({cotisationId}))
                const error = store.getState().entities.cotisation.error
                if(error !== null) {
                    return alert("Erreur lors de la suppression. Veuillez reessayer plutard.")
                }
                alert("La cotisation a été supprimée avec succès.")
            }
        }])

    }

return {getMonthString, getMonthCotisations,
    getMonthTotal, getMemberCotisations,deleteCotisation,
    getCurrentAssoCotisations, isCotisationPayed, notPayedCompter}
}