import {createSlice} from "@reduxjs/toolkit";
import api from "../middlewares/api";
import {apiRequested} from "../actionsCreators/apiActionCreator";

const informationSlice = createSlice({
    name: 'information',
    initialState: {
        loading:  false,
        error: null,
        list: []
    },
    reducers: {
        infoRequested: (state, action) => {
            state.loading = false
            state.error = null
        },
        infoRequestFailed: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        infoAdded: (state, action) => {
            state.loading = false
            state.error = null
            const newList = state.list
            newList.push(action.payload)
            state.list = newList
        },
        infoReceived: (state, action) => {
            state.loading = false
            state.error = null
            const received = action.payload
            state.list = received
        },
        showInfoDetail: (state, action) => {
            let selectedInfo = state.list.find(item => item.id === action.payload.id)
            if(selectedInfo) selectedInfo.showDetail = !selectedInfo.showDetail
            const othersInfo = state.list.filter(item => item.id !== action.payload.id)
            othersInfo.forEach(item => item.showDetail = false)
        }
    }
})

export default informationSlice.reducer
const {infoAdded, infoReceived, infoRequested,
    infoRequestFailed, showInfoDetail} = informationSlice.actions

const url = '/informations'

export const addInfo = (data) => apiRequested({
    url,
    data,
    method: 'post',
    onStart: infoRequested.type,
    onSuccess: infoAdded.type,
    onError: infoRequestFailed.type
})

export const getAssociationInfos = (data) => apiRequested({
    url:url+'/getAll',
    data,
    method:'post',
    onStart: infoRequested.type,
    onSuccess: infoReceived.type,
    onError: infoRequestFailed.type
})

export const showInfoDetails = (info) => dispatch => {
    dispatch(showInfoDetail(info))
}