import apiClient from "../../api/http-common";
import * as actions from '../actionsCreators/apiActionCreator'

const api = store => next => async action => {
    if(action.type !== actions.apiRequested.type) return next (action)
    const {url, data, method,onStart, onSuccess, onError} = action.payload
    if(onStart) store.dispatch({type: onStart})
    next(action)
    try {
        const authToken = store.getState().auth.token
        const response = await apiClient.axiosInstance.request({
        url,
        data,
        method,
        headers: {'x-access-token':authToken}
    })
        store.dispatch({type: onSuccess, payload: response.data})
    } catch (e) {
        store.dispatch({type: onError, payload: e.message})
    }

}

export default api