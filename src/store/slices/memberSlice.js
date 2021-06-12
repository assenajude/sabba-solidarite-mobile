import {createSlice} from "@reduxjs/toolkit";
import {apiRequested} from "../actionsCreators/apiActionCreator";
import dayjs from "dayjs";

const memberSlice = createSlice({
    name: 'member',
    initialState: {
        loading:  false,
        error: null,
        list: [],
        memberAssociations: [],
        memberInfos: [],
        membersCotisations: {},
        randomIdentity: {},
        memberYearCotisations: [],
        selectedMonthCotisations: [],
        years: [],
        months: []
    },
    reducers: {
        memberRequested: (state,action) => {
            state.loading = true
            state.error = null
        },
        memberRequestFailed: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        allMembersReceived: (state, action) => {
         state.loading = false
         state.error = null
         state.list = action.payload
        },
        memberAssociationReceived: (state, action) => {
            state.loading = false
            state.error = null
            state.memberAssociations=  action.payload
        },

        memberAdded: (state, action) => {
            state.loading = false
            state.error = null
            const newAdded = action.payload
            state.list.push(newAdded.new)
            const random = {
                email: newAdded.new.email,
                password: newAdded.randomPass
            }
            state.randomIdentity = random
        },
        updateOne: (state, action) => {
            state.loading = false
            state.error = null
            const updatedIndex = state.list.findIndex(item => item.id === action.payload.id)
            state.list[updatedIndex] = action.payload
        },
        memberInfosReceived: (state, action) => {
            state.loading = false
            state.error = null
            const infos = action.payload
            state.memberInfos = infos
        },
        membersCotisationReceived: (state, action) => {
            state.loading = false
            state.error = null
            state.membersCotisations = action.payload
        },
        memberCotisationPayed: (state, action) => {
            state.loading = false
            state.error = null
            const selected = state.membersCotisations[action.payload.memberId]
            if(selected) state.membersCotisations[action.payload.memberId] = action.payload.cotisations
        },
        initTimeData: (state, action) => {
            state.years = action.payload.years
            state.months = action.payload.months
        },
        selectYear: (state, action) => {
            let selectedYear = state.years.find(item => item.year === action.payload.year)
            selectedYear.selected = true
            const otherItems = state.years.filter(item => item.year !== selectedYear.year)
            otherItems.forEach(item => item.selected = false)
            const newCotisationTab = []
            const memberCotisations = state.membersCotisations[action.payload.memberId]
            memberCotisations.forEach(cotisation => {
                const creationDate = cotisation.member_cotisation.paymentDate
                const creationYear = dayjs(creationDate).year()
                if(creationYear === selectedYear.year) {
                    newCotisationTab.push(cotisation)
                }
            })
            state.months.forEach(month => month.showDetail = false)
            state.memberYearCotisations = newCotisationTab
        },
        showMonthDetail: (state, action) => {
            const selectedCotisation = state.memberYearCotisations.filter(cotisation => {
                const cotisationdate = cotisation.member_cotisation.paymentDate
                const cotisationMonth = dayjs(cotisationdate).month()
                if(cotisationMonth === action.payload.number) return true
                return false
            })
            state.selectedMonthCotisations = selectedCotisation
            let selectedMonth = state.months.find(item => item.label === action.payload.label)
            selectedMonth.showDetail = !selectedMonth.showDetail
            const otherMonths = state.months.filter(item => item.label !== selectedMonth.label)
            otherMonths.forEach(item => item.showDetail = false)
        },
        showCotisationDetails: (state, action) => {
            let selectedCotisation = state.selectedMonthCotisations.find(cotisation => cotisation.id === action.payload.id)
            if(selectedCotisation) {
                selectedCotisation.showDetail = !selectedCotisation.showDetail
            }
            const others = state.selectedMonthCotisations.filter(cotisation => cotisation.id !== selectedCotisation.id)
            others.forEach(cotisation => cotisation.showDetail = false)
        },


    }
})

const {memberRequested, memberRequestFailed, memberAssociationReceived,
    memberAdded,updateOne, memberInfosReceived,
    allMembersReceived, memberCotisationPayed,
    membersCotisationReceived, showCotisationDetails,
    showMonthDetail, selectYear, initTimeData} = memberSlice.actions
export default memberSlice.reducer

const url = '/members'

export const getAllMembers = () => apiRequested({
    url,
    method: 'get',
    onStart: memberRequested.type,
    onSuccess: allMembersReceived.type,
    onError: memberRequestFailed.type
})

export const getMemberAssociations = () => apiRequested({
    url:url+'/associations',
    method: 'get',
    onStart: memberRequested.type,
    onSuccess: memberAssociationReceived.type,
    onError: memberRequestFailed.type
})

export const addNewMember = (data) => apiRequested({
    url,
    data,
    method: 'post',
    onStart: memberRequested.type,
    onSuccess: memberAdded.type,
    onError: memberRequestFailed.type
})


export const getUpdateOneMember = (data) => apiRequested({
    url:url+'/updateOne',
    data,
    method: 'patch',
    onStart: memberRequested.type,
    onSuccess: updateOne.type,
    onError: memberRequestFailed.type
})

export const getMemberInfos = (data) => apiRequested({
    url: url+'/informations',
    data,
    method: 'post',
    onStart: memberRequested.type,
    onSuccess: memberInfosReceived.type,
    onError: memberRequestFailed.type
})

export const readMemberInfos =(data) => apiRequested({
    url:url+'/readInfos',
    data,
    method: 'patch',
    onStart: memberRequested.type,
    onSuccess: memberInfosReceived.type,
    onError: memberRequestFailed.type
})

export const sendAdhesionMessage = (data) => apiRequested({
    url:url+'/sendAdhesionMessage',
    data,
    method: 'patch',
    onStart: memberRequested.type,
    onSuccess: allMembersReceived.type,
    onError: memberRequestFailed.type
})

export const respondToAdhesionMessage = (data) => apiRequested({
    url: url+'/respondToAdhesionMessage',
    data,
    method: 'patch',
    onStart: memberRequested.type,
    onSuccess: updateOne.type,
    onError: memberRequestFailed.type
})

export const getImagesEdit = (data) => apiRequested({
    url: url+'/editImages',
    data,
    method: 'patch',
    onStart: memberRequested.type,
    onSuccess: updateOne.type,
    onError: memberRequestFailed.type
})

export const payMemberCotisation = (data) => apiRequested({
    url: url+'/payCotisations',
    data,
    method: 'patch',
    onStart: memberRequested.type,
    onSuccess: memberCotisationPayed.type,
    onError: memberRequestFailed.type
})

export const getMembersCotisations = (data) => apiRequested({
    url: url+'/membersCotisations',
    data,
    method: 'post',
    onStart: memberRequested.type,
    onSuccess: membersCotisationReceived.type,
    onError: memberRequestFailed.type
})

export const populateTimeData = (data) => dispatch => {
    dispatch(initTimeData(data))
}

export const getYearSelected = (year) => dispatch => {
    dispatch(selectYear(year))
}

export const getMonthDetails = (month) => dispatch => {
    dispatch(showMonthDetail(month))
}

export const getCotisationDetails = (cotisation) => dispatch => {
    dispatch(showCotisationDetails(cotisation))
}

