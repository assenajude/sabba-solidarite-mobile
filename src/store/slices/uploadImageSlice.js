import {apiRequested} from "../actionsCreators/apiActionCreator";
import {createSlice} from "@reduxjs/toolkit";

const uploadImageSlice = createSlice({
    name: 'uploadImage',
    initialState: {
        list: [],
        loading: false,
        error: null,
        signedRequestArray: []
    },
    reducers:{
        s3_requested: (state, action) => {
            state.error = null
            state.loading = true
        },
        s3_signedCreated: (state, action) => {
            state.loading = false
            state.error = null
            const signedReq = action.payload
            state.signedRequestArray = signedReq
        },
        s3_requestFailed: (state, action) => {
            state.loading = false
            state.error = action.payload
        }
    }
})

export default uploadImageSlice.reducer
const {s3_requested, s3_requestFailed, s3_signedCreated} = uploadImageSlice.actions

const url= '/uploadFile/s3_upload'

export const getSignedUrl = (data) => apiRequested({
    url,
    data,
    method: 'post',
    onStart: s3_requested.type,
    onSuccess: s3_signedCreated.type,
    onError: s3_requestFailed.type

})