import {useDispatch, useSelector, useStore} from "react-redux";
import {getAllCotisations} from "../store/slices/cotisationSlice";
import {getAllMembers, getMemberInfos, getMembersCotisations} from "../store/slices/memberSlice";
import {getAllVotes, getEngagementsByAssociation} from "../store/slices/engagementSlice";
import {getAssociationInfos} from "../store/slices/informationSlice";
import {getMemberRoles, getSelectedAssociationMembers} from "../store/slices/associationSlice";
import useManageAssociation from "./useManageAssociation";

let useAuth;
export default useAuth = () => {
    const dispatch = useDispatch()
    const store = useStore()
    const {associationValidMembers} = useManageAssociation()
    const connectedUser = useSelector(state => state.auth.user)
    const userRoles = useSelector(state => state.auth.roles)
    const memberRoles = useSelector(state => state.entities.association.memberRoles)
    const associationMembers = useSelector(state => state.entities.association.selectedAssociationMembers)

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

    const validMembers = (allMembers) => {
        let validList = []
        validList = allMembers.filter(item => {
            const isMember = item.member.relation.toLowerCase() === 'member'
            const isOnLeave = item.member.relation.toLowerCase() === 'onleave'
            if(isMember || isOnLeave) return true
        })
        return validList
    }


        const getInitAssociation = async(currentAssociation) => {
            await dispatch(getSelectedAssociationMembers({associationId: currentAssociation.id}))
             dispatch(getEngagementsByAssociation({associationId:currentAssociation.id}))
             dispatch(getAssociationInfos({associationId: currentAssociation.id}))
             dispatch(getAllCotisations({associationId: currentAssociation.id}))
            dispatch(getMembersCotisations({associationId: currentAssociation.id}))
             dispatch(getAllMembers())
              dispatch(getAllVotes({associationId: currentAssociation.id}))
            const members = store.getState().entities.association.selectedAssociationMembers
            const associationValidMembers = validMembers(members)
            if(associationValidMembers.length>0) {
                const currentMember = members.find(item => item.id === connectedUser.id)
                if(currentMember) {
                    dispatch(getMemberInfos({memberId: currentMember.member.id}))
                    dispatch(getMemberRoles({memberId: currentMember.member.id}))
                }
            }
        }


    const getMemberUserCompte = (member) => {
        const selected = associationMembers.find(item => item.member.id === member.id)
        return selected || {}
    }

    const getConnectedMember = () => {
            const currentMember = associationMembers.find(item => item.id === connectedUser.id)
            return currentMember || {}
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