import {combineReducers} from "redux";
import entitiesReducers from "./entitiesReducers";
import authSlice from './slices/authSlice'
import uploadImageSlice from './slices/uploadImageSlice'

export default combineReducers({
    entities: entitiesReducers,
    auth: authSlice,
    uploadImage: uploadImageSlice
})