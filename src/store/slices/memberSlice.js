import {createSlice} from "@reduxjs/toolkit";
import {apiRequested} from "../actionsCreators/apiActionCreator";
import dayjs from "dayjs";

const memberSlice = createSlice({
    name: 'member',
    initialState: {
        loading:  false,
        error: null,
        list: [],
        memberInfos: [],
        membersCotisations: {},
        randomIdentity: {},
        memberYearCotisations: [],
        selectedMonthCotisations: [],
        years: [],
        months: [],
        userAssociations: []
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
            const allMembers = action.payload
            allMembers.forEach(member => {
                member.avatarLoading = true
                member.backImageLoading = true
            })
            state.list = allMembers
        },
        updateOne: (state, action) => {
            state.loading = false
            state.error = null
            const updatedIndex = state.list.findIndex(item => item.id === action.payload.id)
            let selected = state.list[updatedIndex]
            let updated = action.payload
            if(selected.member.avatar !== action.payload.member.avatar){
                updated.avatarLoading = true
            }
            if(selected.member.backImage !== updated.member.backImage) {
                updated.backImageLoading = true
            }
            state.list[updatedIndex] = updated

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
        userAssociationsReceived: (state, action) => {
            state.loading = false
            state.error = null
            const newAssociations = action.payload
            newAssociations.forEach(ass => {
                if(ass.avatar.length>0) {
                    ass.imageLoading = true
                }else {
                    ass.imageLoading = false
                }

            })
            state.userAssociations = action.payload

        },
        memberDeleted: (state, action) => {
         state.loading = false
            state.error = null
            const newState = state.list.filter(member => member.id !== action.payload.userId)
            state.list = newState
        },
        imageLoaded: (state, action) => {
            const selectedIndex = state.userAssociations.findIndex(ass => ass.id === action.payload.id)
            state.userAssociations[selectedIndex].imageLoading = false
        },
        memberAvatarLoaded: (state, action) => {
            let selectedMember = state.list.find(member => member.id === action.payload.id)
            selectedMember.avatarLoading = false
        },
        memberBackImageLoaded: (state, action) => {
            let selectedMember = state.list.find(member => member.id === action.payload.id)
            selectedMember.backImageLoading = false
        },
        imageChanged:(state, action) => {
            let selectedMember = state.list.find(item => item.id === action.payload.id)
            if(action.payload.newAvatar) {
                selectedMember.member.oldAvatar = selectedMember.member.avatar
                selectedMember.member.avatar = action.payload.newAvatar
                selectedMember.avatarLoading = true
            } else {
                selectedMember.member.oldBackImage = selectedMember.member.backImage
                selectedMember.member.backImage = action.payload.backImage
                selectedMember.backImageLoading = true
            }

        },
        imageChangingCanceled:(state, action) => {
            let selectedMember = state.list.find(item => item.id === action.payload.id)
            if(action.payload.label === 'avatar') {
                selectedMember.member.avatar = selectedMember.member.oldAvatar
                selectedMember.avatarLoading = true

            }else {
                selectedMember.member.backImage = selectedMember.member.oldBackImage
                selectedMember.backImageLoading = true
            }
        }
    }
})

const {memberRequested, memberRequestFailed, userAssociationsReceived,
    updateOne, memberInfosReceived,
    allMembersReceived, memberCotisationPayed,
    membersCotisationReceived, showCotisationDetails, imageChanged, imageChangingCanceled, memberBackImageLoaded,
    showMonthDetail, selectYear, initTimeData, memberDeleted, imageLoaded, memberAvatarLoaded} = memberSlice.actions
export default memberSlice.reducer

const url = '/members'

export const getConnectedUserAssociations = () => apiRequested({
    url:url+'/associations',
    method: 'get',
    onStart: memberRequested.type,
    onSuccess: userAssociationsReceived.type,
    onError: memberRequestFailed.type
})

export const getSelectedAssociationMembers = (data) => apiRequested({
    url:url+'/byAssociation',
    data,
    method: 'post',
    onStart: memberRequested.type,
    onSuccess: allMembersReceived.type,
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
    onSuccess: userAssociationsReceived.type,
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

export const getConnectedMemberUser = (data) => apiRequested({
    url: url+'/connectedMemberUser',
    method: 'post',
    data,
    onStart: memberRequested.type,
    onSuccess: updateOne.type,
    onError: memberRequestFailed.type
})

export const getAssociationLeave = (data) => apiRequested({
    url: url+'/leaveAssociation',
    method: 'patch',
    data,
    onStart: memberRequested.type,
    onSuccess: updateOne.type,
    onError: memberRequestFailed.type
})

export const getMemberDelete = (data) => apiRequested({
    url: url+'/deleteMember',
    method: 'delete',
    data,
    onStart: memberRequested.type,
    onSuccess: memberDeleted.type,
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

export const associationImageLoaded = (association) => dispatch => {
    dispatch(imageLoaded(association))
}

export const selectedMemberAvatarLoaded = (member) => dispatch =>{
    dispatch(memberAvatarLoaded(member))
}

export const selectedMemberBackImageLoaded = (member) => dispatch =>{
    dispatch(memberBackImageLoaded(member))
}

export const changeMemberImage = (data) => dispatch => {
    dispatch(imageChanged(data))
}

export const cancelChangingImage = (data) => dispatch => {
    dispatch(imageChangingCanceled(data))
}