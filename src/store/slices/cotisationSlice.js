import {createSlice} from "@reduxjs/toolkit";
import {apiRequested} from "../actionsCreators/apiActionCreator";

const cotisationSlice = createSlice({
    name: 'cotisation',
    initialState: {
        loading: false,
        error: null,
        list: []
    },
    reducers: {
        cotisationRequested: (state, action) => {
            state.loading = true
            state.error = null
        },
        cotisationRequestFailed: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        cotisationAdded: (state, action) => {
          state.loading = false
          state.error = null
            const addedIndex = state.list.findIndex(added => added.id === action.payload.id)
            if(addedIndex !== -1) {
                state.list[addedIndex] = action.payload
            } else {
                const newList = state.list
                newList.push(action.payload)
                state.list = newList
            }
        },
        cotisationReceived: (state, action) => {
          state.loading = false
          state.error = null
          state.list = action.payload
        },
        cotisationMoreDetail: (state, action) => {
            let selected = state.list.find(cotis => cotis.id === action.payload.id)
            selected.showMore = !selected.showMore
            const others = state.list.filter(cotis => cotis.id !== action.payload.id)
            others.forEach(cotisation => cotisation.showMore = false)
        },
        cotisationDeleted: (state, action) => {
            state.loading = false
            state.error = null
            const newList = state.list.filter(cotis => cotis.id !== action.payload.cotisationId)
            state.list = newList
        }
    }
})

export default cotisationSlice.reducer
const {
    cotisationAdded, cotisationRequested, cotisationMoreDetail,
    cotisationRequestFailed, cotisationReceived, cotisationDeleted} = cotisationSlice.actions

const url = '/cotisations'

export const addNewCotisation =(data) => apiRequested({
    url,
    data,
    method: 'post',
    onStart: cotisationRequested.type,
    onSuccess: cotisationAdded.type,
    onError: cotisationRequestFailed.type
})

export const getAssociationCotisations = (data) => apiRequested({
    url: url+'/byAssociation',
    method: 'post',
    data,
    onStart: cotisationRequested.type,
    onSuccess: cotisationReceived.type,
    onError: cotisationRequestFailed.type
})

export const getCotisationDelete = (data) => apiRequested({
    url: url+'/deleteOne',
    method: 'delete',
    data,
    onStart: cotisationRequested.type,
    onSuccess: cotisationDeleted.type,
    onError: cotisationRequestFailed.type
})

export const getCotisationMoreDetail = (cotisation) => dispatch => {
    dispatch(cotisationMoreDetail(cotisation))
}