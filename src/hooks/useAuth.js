import {useDispatch, useSelector, useStore} from "react-redux";
import {getAssociationCotisations} from "../store/slices/cotisationSlice";
import {getMemberInfos, getMembersCotisations, getSelectedAssociationMembers} from "../store/slices/memberSlice";
import {getAllVotes, getEngagementsByAssociation} from "../store/slices/engagementSlice";
import {getAssociationInfos} from "../store/slices/informationSlice";
import {getAllAssociation, getMemberRoles, setSelectedAssociation} from "../store/slices/associationSlice";
import {useCallback} from "react";
import {getPopulateReseauList, getUserTransactions} from "../store/slices/transactionSlice";
import {reseauData} from "../utilities/reseau.data";

let useAuth;
export default useAuth = () => {
    const dispatch = useDispatch()
    const store = useStore()
    const connectedUser = useSelector(state => state.auth.user)
    const userRoles = useSelector(state => state.auth.roles)
    const memberRoles = useSelector(state => state.entities.association.memberRoles)
    const associationMembers = useSelector(state => state.entities.member.list)

    const isValidEmail = (email) => {
        const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/
        return re.test(email);
    }

    const isAdmin = () => {
        let isMemberAdmin = false
        if(userRoles.length>0) {
        const adminIndex = userRoles.findIndex(role =>role === 'ROLE_ADMIN')
        if(adminIndex !== -1) {
            isMemberAdmin = true
        }
        }

        return isMemberAdmin
    }

   const isModerator = () => {
        let isModarat = false
        if(memberRoles.length>0) {
            const modIndex = memberRoles.findIndex(role =>role === 'ROLE_MODERATOR')
            if(modIndex !== -1) {
                isModarat = true
            }
        }
        return isModarat
    }

        const getInitAssociation = useCallback( async(currentAssociation) => {
            await dispatch(getSelectedAssociationMembers({associationId: currentAssociation.id}))
            dispatch(getEngagementsByAssociation({associationId:currentAssociation.id}))
            dispatch(getAssociationInfos({associationId: currentAssociation.id}))
            dispatch(getAssociationCotisations({associationId: currentAssociation.id}))
            dispatch(getMembersCotisations({associationId: currentAssociation.id}))
            dispatch(getAllVotes({associationId: currentAssociation.id}))
            const associationMembers = store.getState().entities.member.list
            if(associationMembers.length>0) {
                const currentMember = associationMembers.find(item => item.id === connectedUser.id)
                if(currentMember) {
                    dispatch(getMemberInfos({memberId: currentMember.member.id}))
                    dispatch(getMemberRoles({memberId: currentMember.member.id}))
                }
            }
        }, [])


    const notifNavig = async (whereToGo) => {
            let currentParams
            const currentType = whereToGo.otherParams.type
            const otherParamId = whereToGo.otherParams.id
            if(currentType === 'adhesion'){
                await dispatch(getAllAssociation())
                const associationList = store.getState().entities.association.list
                currentParams = associationList.find(asso => asso.id === otherParamId)
            }
            if(currentType === 'userCompte'){
                currentParams = store.getState().auth.user
            }
            if(currentType === 'transaction') {
                const justConnected = store.getState().auth.user
                dispatch(getPopulateReseauList(reseauData))
                await dispatch(getUserTransactions({userId: justConnected.id}))
                const lisTransactions = store.getState().entities.transaction.list
                currentParams = lisTransactions.find(transac => transac.id === otherParamId)
            }
            if(currentType === 'cotisation' || currentType === 'engagement') {
                await dispatch(getAllAssociation())
                const listAssociations = store.getState().entities.association.list
                const currentAssociation = listAssociations.find(asso => asso.id === otherParamId)
                dispatch(setSelectedAssociation(currentAssociation))
                await getInitAssociation(currentAssociation)
                currentParams = {screen: whereToGo.otherParams.screen}
            }
            return currentParams
    }
    const getConnectedMember = () => {
        const currentMember = associationMembers.find(item => item.id === connectedUser.id)
        return currentMember?.member
    }

    const getMemberUserCompte = () => {
        let selected = {}
        const currentMember = getConnectedMember()
        selected = associationMembers.find(item => item.id === currentMember.userId)
        return selected
    }

    const dataSorter = (data) => {
        let sorTable = data
        if (data && data.length >0) {
            sorTable.sort((a, b) => {
                if(a.createdAt > b.createdAt) return -1
                if(a.createdAt < b.createdAt) return 1
                return 0
            })
        }
        return sorTable
    }
    return {isAdmin,getMemberUserCompte, isModerator,getConnectedMember, dataSorter, getInitAssociation, isValidEmail, notifNavig}
}