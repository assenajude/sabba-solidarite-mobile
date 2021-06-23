import {useDispatch, useSelector, useStore} from "react-redux";
import {getAssociationCotisations} from "../store/slices/cotisationSlice";
import {getMemberInfos, getMembersCotisations, getSelectedAssociationMembers} from "../store/slices/memberSlice";
import {getAllVotes, getEngagementsByAssociation} from "../store/slices/engagementSlice";
import {getAssociationInfos} from "../store/slices/informationSlice";
import {getMemberRoles} from "../store/slices/associationSlice";
import {useCallback} from "react";

let useAuth;
export default useAuth = () => {
    const dispatch = useDispatch()
    const store = useStore()
    const connectedUser = useSelector(state => state.auth.user)
    const userRoles = useSelector(state => state.auth.roles)
    const memberRoles = useSelector(state => state.entities.association.memberRoles)
    const associationMembers = useSelector(state => state.entities.member.list)

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
    return {isAdmin,getMemberUserCompte, isModerator,getConnectedMember, dataSorter, getInitAssociation}
}