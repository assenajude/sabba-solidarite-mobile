import {createSlice} from "@reduxjs/toolkit";
import {apiRequested} from "../actionsCreators/apiActionCreator";

const engagementSlice = createSlice({
    name: 'engagement',
    initialState: {
        loading: false,
        error: null,
        list: [],
        tranches: [],
        votesList: {}
    },
    reducers: {
        engagementRequested: (state) => {
            state.loading = true
            state.error = null
        },
        engagementRequestFailed: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        engagementAdded: (state, action) => {
            state.loading = false
            state.error = null
            const addedIndex = state.list.findIndex(item => item.id === action.payload.id)
            if(addedIndex !== -1) {
                let newList = state.list
                newList[addedIndex] = action.payload
                state.list = newList
            } else {
                state.list.push(action.payload)
            }
        },
        engagementsReceived: (state, action) => {
            state.loading = false
            state.error = null
            const receiveds = action.payload
            state.list = receiveds
            const newTrancheTab = []
            receiveds.forEach(item => {
                const itemTranches = item.tranches
                if(itemTranches.length>0) {
                itemTranches.forEach(tranche => {
                    const isExiste = newTrancheTab.some(trch => trch.id === tranche.id)
                    if(!isExiste) newTrancheTab.push(tranche)
                })
                }
            })
            state.tranches = newTrancheTab
        },
        engagementVoted: (state, action) => {
          state.loading = false
            state.error = null
            state.votesList[action.payload.justVoted.id] = action.payload.engagementVotes
            const updatedIndex = state.list.findIndex(engage => engage.id === action.payload.justVoted.id)
            const newEngagements = state.list
            newEngagements[updatedIndex] = action.payload.justVoted
            state.list = newEngagements
        },
        engagementUpdated: (state, action) => {
          state.loading = false
          state.error = null
            const updatedIndex = state.list.findIndex(engage => engage.id === action.payload.id)
            if(updatedIndex !== -1) {
            const newEngagements = state.list
            newEngagements[updatedIndex] = action.payload
            state.list = newEngagements
            } else {
                state.list.push(action.payload)
            }
        },
        votesReceived: (state, action) => {
          state.error = null
          state.loading = false
          state.votesList = action.payload
        },
        showTranches :(state, action) => {
            let selected = state.list.find(item => item.id === action.payload.id)
            selected.showTranches = !selected.showTranches
        },
        showDetails: (state, action) => {
            let selectedEngage = state.list.find(engage => engage.id === action.payload.id)
            selectedEngage.showDetail = !selectedEngage.showDetail
            const others = state.list.filter(item => item.id !== selectedEngage.id)
            others.forEach(engagement => engagement.showDetail = false)
        },
        payingTranche: (state, action) => {
            let selectedTranche = state.tranches.find(tranche => tranche.id === action.payload.id)
            selectedTranche.paying = !selectedTranche.paying
        },
        tranchePayed: (state, action) => {
            state.loading = false
            state.error = null
            const updatedIndex = state.tranches.findIndex(item => item.id === action.payload.id)
            state.tranches[updatedIndex] = action.payload
        },
        engagementDeleted: (state, action) => {
            state.loading = false
            state.error = null
            const newList = state.list.filter(item => item.id !== action.payload.engagementId)
            state.list = newList
            const newTranchesList = state.tranches.filter(tranche => tranche.engagementId !== action.payload.engagementId)
            state.tranches = newTranchesList
             delete state.votesList[action.payload.engagementId]
        }
    }
})

export default engagementSlice.reducer
const {engagementAdded, engagementRequested, engagementRequestFailed,payingTranche, engagementUpdated,
    engagementsReceived, showDetails, engagementVoted, votesReceived,
    showTranches, tranchePayed, engagementDeleted} = engagementSlice.actions

const url = '/engagements'

export const addNewEngagement = (data) => apiRequested({
    url,
    data,
    method: 'post',
    onStart: engagementRequested.type,
    onSuccess: engagementAdded.type,
    onError: engagementRequestFailed.type
})

export const getEngagementsByAssociation = (data) => apiRequested({
    url: url+'/byAssociation',
    data,
    method: 'post',
    onStart: engagementRequested.type,
    onSuccess: engagementsReceived.type,
    onError: engagementRequestFailed.type
})

export const voteEngagement = (data) => apiRequested({
    url: url+'/vote',
    data,
    method: 'patch',
    onStart: engagementRequested.type,
    onSuccess: engagementVoted.type,
    onError: engagementRequestFailed.type
})

export const getAllVotes = (data) => apiRequested({
    url: url+'/allVotes',
    data,
    method: 'post',
    onStart: engagementRequested.type,
    onSuccess: votesReceived.type,
    onError: engagementRequestFailed.type
})

export const getTranchePayed = (data) => apiRequested({
    url: url+'/payTranche',
    data,
    method: 'patch',
    onStart: engagementRequested.type,
    onSuccess: tranchePayed.type,
    onError: engagementRequestFailed.type
})

export const getEngagementById = (data) => apiRequested({
    url: url+'/getById',
    data,
    method: 'post',
    onStart: engagementRequested.type,
    onSuccess: engagementUpdated.type,
    onError: engagementRequestFailed.type
})

export const getEngagementUpdate = (data) => apiRequested({
    url: url+'/update',
    data,
    method: 'patch',
    onStart: engagementRequested.type,
    onSuccess: engagementUpdated.type,
    onError: engagementRequestFailed.type
})

export const getEngagementDelete = (data) => apiRequested({
    url: url+'/deleteOne',
    data,
    method: 'delete',
    onStart: engagementRequested.type,
    onSuccess: engagementDeleted.type,
    onError: engagementRequestFailed.type
})

export const getEngagementDetail = (engagement) => dispatch => {
    dispatch(showDetails(engagement))
}

export const showEngagementTranches = (engagement) => dispatch => {
    dispatch(showTranches(engagement))
}

export const getPayingTranche =(tranche) => dispatch => {
    dispatch(payingTranche(tranche))
}
