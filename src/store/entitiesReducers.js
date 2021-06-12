import {combineReducers} from "redux";
import memberSlice from './slices/memberSlice'
import associationSlice from './slices/associationSlice'
import cotisationSlice from './slices/cotisationSlice'
import engagementSlice from './slices/engagementSlice'
import infoSlice from '../store/slices/informationSlice'
import transactionSlice from '../store/slices/transactionSlice'

export default combineReducers({
    member: memberSlice,
    association: associationSlice,
    cotisation: cotisationSlice,
    engagement: engagementSlice,
    information: infoSlice,
    transaction: transactionSlice
})