import {createSlice} from "@reduxjs/toolkit";
import {apiRequested} from "../actionsCreators/apiActionCreator";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        loading: false,
        error: null,
        isLoggedIn: false,
        user: {},
        roles: [],
        allUsers: [],
        token: null,
        randomCode: null,
        changeCredentialMessage: null
    },
    reducers: {
        authRequested: (state, action) => {
            state.loading =  true
            state.error = null
        },
        authRequestFailed: (state, action) => {
            state.loading = false
            state.error = action.payload.message? action.payload.message: action.payload
        },
        authRequestSuccess: (state,action) => {
            state.loading = false
            state.error = null
            let newUser = action.payload.user
            if(newUser && Object.keys(newUser).length>0) {
            newUser.avatarLoading = true
            state.user = newUser
            state.roles = action.payload.roles
            state.token = action.payload.accessToken
            }
        },
        userUpdated: (state, action) => {
          state.loading = false,
          state.error = null
            let newUpdated = action.payload
            newUpdated.avatarLoading = true
          state.user = newUpdated
        },
        logout: (state) => {
            state.loading = false
            state.error = null
            state.isLoggedIn = false
            state.user = {}
            state.roles = []
            state.allUsers = []
            state.token = null
        },
        allUserReceived: (state, action) => {
            state.loading = false
            state.error = null
            const allUsers = action.payload
            allUsers.forEach(user => user.avatarLoading = true)
            state.allUsers = allUsers
        },
        credentialsReset: (state, action) => {
            state.loading = false
            state.error = null
            if (action.payload.randomCode) state.randomCode = action.payload.randomCode
           if(action.payload.message) state.changeCredentialMessage = action.payload.message
        },
        avatarLoaded: (state, action) => {
            const allUsers = state.allUsers
            let selectedUser
            if(allUsers.length>0) {
               selectedUser = allUsers.find(user => user.id === action.payload.id)
            }else {
                selectedUser = state.user
            }
            selectedUser.avatarLoading = false
            if(selectedUser.id === state.user.id && selectedUser.avatarLoading !== state.user.avatarLoading) {
                state.user = selectedUser
            }
        }

    }

})

const {authRequested, authRequestFailed, authRequestSuccess,
     logout, userUpdated, allUserReceived, credentialsReset, avatarLoaded} = authSlice.actions
export default authSlice.reducer

const url = '/auth'

export const register = (data) => apiRequested({
    url: url+'/signup',
    data,
    method: 'post',
    onStart: authRequested.type,
    onSuccess: authRequestSuccess.type,
    onError: authRequestFailed.type
})

export const signin = (data) => apiRequested({
    url:url+'/signin',
    data,
    method: 'post',
    onStart: authRequested.type,
    onSuccess: authRequestSuccess.type,
    onError: authRequestFailed.type
})

export const registerByPin = (data) => apiRequested({
    url: url+'/signupByPin',
    data,
    method: 'post',
    onStart: authRequested.type,
    onSuccess: authRequestSuccess.type,
    onError: authRequestFailed.type
})

export const signinByPin = (data) => apiRequested({
    url:url+'/signinByPin',
    data,
    method: 'post',
    onStart: authRequested.type,
    onSuccess: authRequestSuccess.type,
    onError: authRequestFailed.type
})
export const saveEditInfo = (data) => apiRequested({
    url:'/user/editInfo',
    data,
    method: 'patch',
    onStart: authRequested.type,
    onSuccess: userUpdated.type,
    onError: authRequestFailed.type
})
export const saveEditFund = (data) => apiRequested({
    url:'/user/editFund',
    data,
    method: 'patch',
    onStart: authRequested.type,
    onSuccess: userUpdated.type,
    onError: authRequestFailed.type
})

export const getUserImagesEdit = (data) => apiRequested({
    url:'/user/editImages',
    data,
    method: 'patch',
    onStart: authRequested.type,
    onSuccess: userUpdated.type,
    onError: authRequestFailed.type
})

export const getUserAllUsers = () => apiRequested({
    url:'/user/allUsers',
    method: 'get',
    onStart: authRequested.type,
    onSuccess: allUserReceived.type,
    onError: authRequestFailed.type
})

export const getUserData = (data) => apiRequested({
    url:'/user/userData',
    method: 'post',
    data,
    onStart: authRequested.type,
    onSuccess: userUpdated.type,
    onError: authRequestFailed.type
})

export const getNotificationTokenUpdate = (data) => apiRequested({
    url:'/user/pushNotifications',
    method: 'post',
    data,
    onStart: authRequested.type,
    onSuccess: userUpdated.type,
    onError: authRequestFailed.type
})

export const resetCredentials = (data) => apiRequested({
    url:'/user/resetCredentials',
    method: 'patch',
    data,
    onStart: authRequested.type,
    onSuccess: credentialsReset.type,
    onError: authRequestFailed.type
})
export const changeCredentials = (data) => apiRequested({
    url:'/user/changeCredentials',
    method: 'patch',
    data,
    onStart: authRequested.type,
    onSuccess: credentialsReset.type,
    onError: authRequestFailed.type
})


export const getLogout = () => dispatch => {
    dispatch(logout())
}

export const connectedUserAvatarLoaded = (user) => dispatch => {
    dispatch(avatarLoaded(user))
}