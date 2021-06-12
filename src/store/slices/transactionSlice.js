import {createSlice} from "@reduxjs/toolkit";
import {apiRequested} from "../actionsCreators/apiActionCreator";

const transactionSlice = createSlice({
    name: 'transaction',
    initialState: {
        loading: false,
        error: null,
        list: [],
        reseauList: []
    },
    reducers: {
        transactionRequested: (state) => {
            state.loading = true
            state.error = null
        },
        transactionRequestFailed: (state,action) => {
            state.loading = false
            state.error = action.payload
        },
        transactionReceived: (state, action) => {
          state.loading = false
          state.error = null
          const newList = action.payload
          state.list = newList
        },
        transactionAdded: (state, action) => {
            state.loading = false
            state.error = null
            const newList = state.list
            newList.push(action.payload)
            state.list = newList
        },
        transactionUpdated: (state, action) => {
          state.loading = false
            state.error = null
            let selectedIndex = state.list.findIndex(item => item.id === action.payload.id)
            const newList = state.list
            newList[selectedIndex] = action.payload
            state.list = newList
        },
        reseauListPopulated: (state, action) => {
            state.reseauList = action.payload
        },
        reseauSelected: (state, action) => {
            let selectedReseau = state.reseauList.find(item => item.name.toLowerCase() === action.payload.name.toLowerCase())
            selectedReseau.selected = !selectedReseau.selected
            const others = state.reseauList.filter(item => item !== selectedReseau)
            others.forEach(reseau => reseau.selected = false)
        },
        transactionShownMore: (state, action) => {
            let selectedTransac = state.list.find(item => item.id === action.payload.id)
            selectedTransac.showMore = !selectedTransac.showMore
            const othersTransac = state.list.filter(transac => transac.id !== selectedTransac.id)
            othersTransac.forEach(item => item.showMore = false)
        }
    }
})

export default transactionSlice.reducer
const {transactionAdded, transactionReceived,
    reseauListPopulated, transactionRequested,
    transactionRequestFailed, reseauSelected,
    transactionShownMore, transactionUpdated} = transactionSlice.actions

const url  = '/transactions'

export const addTransaction = (data) => apiRequested({
    url,
    data,
    method: 'post',
    onStart: transactionRequested.type,
    onSuccess: transactionAdded.type,
    onError: transactionRequestFailed.type
})

export const getTransactionUpdate = (data) => apiRequested({
    url: url+'/update',
    data,
    method: 'patch',
    onStart: transactionRequested.type,
    onSuccess: transactionUpdated.type,
    onError: transactionRequestFailed.type
})

export const getUserTransactions = (data) => apiRequested({
    url: url+'/byUser',
    data,
    method: 'post',
    onStart: transactionRequested.type,
    onSuccess: transactionReceived.type,
    onError: transactionRequestFailed.type
})

export const getPopulateReseauList = (data) => dispatch => {
    dispatch(reseauListPopulated(data))
}

export const getReseauSelect = (data) => dispatch => {
    dispatch(reseauSelected(data))
}

export const showTransactionMore = (transaction) => dispatch => {
    dispatch(transactionShownMore(transaction))
}
