import {createSlice} from "@reduxjs/toolkit";
import {apiRequested} from "../actionsCreators/apiActionCreator";

const associationSlice = createSlice({
    name: 'association',
    initialState: {
        loading: false,
        error: null,
        list: [],
        selectedAssociation: {},
        memberRoles: [],
        editedRoleMessage: '',
        deleteSuccess: false,
        updated: false
    },
    reducers: {
        associationRequested: (state) => {
            state.loading = true
            state.error = null
        },
        associationRequestFailed: (state, action) => {
            state.loading = false
            state.error = action.payload
            state.deleteSuccess = false
        },
        associationReceived: (state, action) => {
            state.loading = false
            state.error = null
            const allAssociation = action.payload
            allAssociation.forEach(ass => ass.imageLoading = true)
            state.list = allAssociation
        },
        associationAdded: (state, action) => {
            state.loading = false
            state.error = null
            const addedIndex = state.list.findIndex(ass => ass.id === action.payload.id)
            if(addedIndex !== -1) {
                let newTab = state.list
                newTab[addedIndex] = action.payload
                newTab[addedIndex].imageLoading = true
                state.list = newTab
                if(state.selectedAssociation.id === action.payload.id) {
                    state.selectedAssociation = action.payload
                }
            }else {
                const newAdded = action.payload
                state.list.push(newAdded)

            }
            state.updated = true
        },
        selectedAssociationSet: (state, action) => {
            state.selectedAssociation = action.payload
        },
        associationUpdated: (state, action) => {
            state.loading = false
            state.error = null
            const updateIndex = state.list.findIndex(asso => asso.id === action.payload.id)
            state.list[updateIndex] = action.payload
            state.list[updateIndex].imageLoading = true
            if(state.selectedAssociation.id === action.payload.id) {
                state.selectedAssociation = action.payload
            }
            state.updated = true
        },

        memberRolesReceived: (state, action) => {
            state.loading = false
            state.error = null
            state.memberRoles = action.payload
        },
        rolesEdited: (state, action) => {
            state.loading = false
            state.error = null
            state.editedRoleMessage = action.payload.message
        },
        associationDeleted : (state, action) => {
            state.loading = false
            state.error = null
            state.deleteSuccess = true
            const newList = state.list.filter(ass => ass.id !== action.payload.associationId)
            state.list = newList
            state.updated = true
        },
        imageLoaded: (state, action) => {
            let selected = state.list.find(ass => ass.id === action.payload.id)
            selected.imageLoading = false
            if(selected.id === state.selectedAssociation.id) {
                state.selectedAssociation = selected
            }
            state.updated = true
        }

    }
})

const {associationAdded, associationReceived,
    associationRequested, associationRequestFailed,
    selectedAssociationSet, memberRolesReceived,
    rolesEdited, associationUpdated, associationDeleted, imageLoaded} = associationSlice.actions

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



export const getReglementUpdate = (data) => apiRequested({
    url:url+'/updateReglement',
    data,
    method: 'post',
    onStart: associationRequested.type,
    onSuccess: associationUpdated.type,
    onError: associationRequestFailed.type
})

export const getAssociationDelete = (data) => apiRequested({
    url:url+'/deleteOne',
    data,
    method: 'delete',
    onStart: associationRequested.type,
    onSuccess: associationDeleted.type,
    onError: associationRequestFailed.type
})


export const setSelectedAssociation = (association) => dispatch => {
    dispatch(selectedAssociationSet(association))
}

export const mainAssociationImageLoaded = (association) => dispatch => {
    dispatch(imageLoaded(association))
}