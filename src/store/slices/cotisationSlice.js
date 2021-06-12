import {createSlice} from "@reduxjs/toolkit";
import {apiRequested} from "../actionsCreators/apiActionCreator";
import dayjs from "dayjs";

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
            state.list.push(action.payload)
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
        }
    }
})

export default cotisationSlice.reducer
const {
    cotisationAdded, cotisationRequested, cotisationMoreDetail,
    cotisationRequestFailed, cotisationReceived} = cotisationSlice.actions

const url = '/cotisations'

export const addNewCotisation =(data) => apiRequested({
    url,
    data,
    method: 'post',
    onStart: cotisationRequested.type,
    onSuccess: cotisationAdded.type,
    onError: cotisationRequestFailed.type
})

export const getAllCotisations = (associationId) => apiRequested({
    url: url+'/all',
    method: 'post',
    data: associationId,
    onStart: cotisationRequested.type,
    onSuccess: cotisationReceived.type,
    onError: cotisationRequestFailed.type
})

export const getCotisationMoreDetail = (cotisation) => dispatch => {
    dispatch(cotisationMoreDetail(cotisation))
}