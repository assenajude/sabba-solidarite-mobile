import {createSlice} from "@reduxjs/toolkit";
import {apiRequested} from "../actionsCreators/apiActionCreator";

const associationSlice = createSlice({
    name: 'association',
    initialState: {
        loading: false,
        error: null,
        list: [],
        selectedAssociation: {},
        selectedAssociationMembers: [],
        memberRoles: []
    },
    reducers: {
        associationRequested: (state) => {
            state.loading = true
            state.error = null
        },
        associationRequestFailed: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        associationReceived: (state, action) => {
            state.loading = false
            state.error = null
            state.list = action.payload
        },
        associationAdded: (state, action) => {
            state.loading = false
            state.error = null
            const newAdded = action.payload
            state.list.push(newAdded)
        },
        selectedAssociationSet: (state, action) => {
            state.selectedAssociation = action.payload
        },
        associationMembersReceived: (state, action) => {
            state.loading = false
            state.error = null
            state.selectedAssociationMembers = action.payload
        },
        associationUpdated: (state, action) => {
            state.loading = false
            state.error = null
            const updateIndex = state.list.findIndex(asso => asso.id === action.payload.id)
            state.list[updateIndex] = action.payload
            if(state.selectedAssociation.id === action.payload.id) state.selectedAssociation = action.payload
        },
        connectedMemberUpdated:(state, action) => {
            state.loading = false
            state.error = null
            const memberIndex = state.selectedAssociationMembers.findIndex(member => member.id === action.payload.id)
            const newMembers = state.selectedAssociationMembers
            newMembers[memberIndex] = action.payload
            state.selectedAssociationMembers = newMembers
        },
        memberRolesReceived: (state, action) => {
            state.loading = false
            state.error = null
            state.memberRoles = action.payload
        },
        rolesEdited: (state, action) => {
            state.loading = false
            state.error = null
            const editedIndex = state.memberRoles.findIndex(item => item.id === action.payload.id)
            state.memberRoles[editedIndex] = action.payload
        }

    }
})

const {associationAdded, associationReceived,
    associationRequested, associationRequestFailed,
    selectedAssociationSet, associationMembersReceived, memberRolesReceived,
    rolesEdited, associationUpdated, connectedMemberUpdated} = associationSlice.actions

export default associationSlice.reducer

const url = '/associations'

export const getAllAssociation = () => apiRequested({
    url,
    method: 'get',
    onStart: associationRequested.type,
    onSuccess: associationReceived.type,
    onError: associationRequestFailed.type
})

export const addNewAssociation = (data) => apiRequested({
    url,
    data,
    method: 'post',
    onStart: associationRequested.type,
    onSuccess: associationAdded.type,
    onError: associationRequestFailed.type
})


export const getSelectedAssociationMembers = (data) => apiRequested({
    url:url+'/members',
    data,
    method: 'post',
    onStart: associationRequested.type,
    onSuccess: associationMembersReceived.type,
    onError: associationRequestFailed.type
})
export const getMemberRoles = (data) => apiRequested({
    url:url+'/members/roles',
    data,
    method: 'post',
    onStart: associationRequested.type,
    onSuccess: memberRolesReceived.type,
    onError: associationRequestFailed.type
})

export const getMemberRolesEdited = (data) => apiRequested({
    url:url+'/editRoles',
    data,
    method: 'patch',
    onStart: associationRequested.type,
    onSuccess: rolesEdited.type,
    onError: associationRequestFailed.type
})
export const getAvatarUpdate = (data) => apiRequested({
    url:url+'/updateAvatar',
    data,
    method: 'patch',
    onStart: associationRequested.type,
    onSuccess: associationUpdated.type,
    onError: associationRequestFailed.type
})

export const getSelectedAssociation = (data) => apiRequested({
    url:url+'/selectedAssociation',
    data,
    method: 'post',
    onStart: associationRequested.type,
    onSuccess: associationUpdated.type,
    onError: associationRequestFailed.type
})

export const getConnectedMember = (data) => apiRequested({
    url:url+'/connectedMember',
    data,
    method: 'post',
    onStart: associationRequested.type,
    onSuccess: connectedMemberUpdated.type,
    onError: associationRequestFailed.type
})


export const setSelectedAssociation = (association) => dispatch => {
    dispatch(selectedAssociationSet(association))
}