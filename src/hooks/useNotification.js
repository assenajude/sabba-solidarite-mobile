import Constants from "expo-constants/src/Constants";
import * as Notifications from 'expo-notifications'
import routes from "../navigation/routes";
import navigation from '../navigation/routeNavigation'
import {useDispatch, useStore} from "react-redux";
import {setSelectedAssociation} from "../store/slices/associationSlice";
import useAuth from "./useAuth";
import {getUserTransactions} from "../store/slices/transactionSlice";
let useNotification;
export default useNotification = () => {
    const store = useStore()
    const dispatch = useDispatch()
    const {getInitAssociation, isAdmin} = useAuth()

    const registerForPushNotificationsAsync = async () => {
        let token = ''
        if (Constants.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
             token = (await Notifications.getExpoPushTokenAsync()).data;
        } else {
            alert('Must use physical device for Push Notifications');
        }

        return token
    };

    const handleNotificationTaped =  async (response) => {
        const currentUser = store.getState().auth.user
        const isUserConnected = Object.keys(currentUser).length > 0
        let routeParams
        const data = response.data
        const notifType = data.notifType
        if(notifType === 'adhesion') {
            if(isUserConnected) {
            const associationList = store.getState().entities.association.list
            const selectedAssociation = associationList.find(ass => ass.id === data.associationId)
                navigation.navigate('Starter',{screen: routes.ASSOCIATION_DETAILS, params: selectedAssociation})
            } else {

                routeParams = {screen: routes.LOGIN,params: {mainNavig: 'Starter', nestedNavig: routes.ASSOCIATION_DETAILS, otherParams: {type: data.notifType, id: data.associationId}}}
                navigation.navigate('Auth', routeParams)
            }
            }
        if(notifType === 'transaction') {
            if(!isAdmin()) {
                return;
            }
            if (isUserConnected) {
                await dispatch(getUserTransactions({userId: currentUser.id}))
                const transactionList = store.getState().entities.transaction.list
            const selectedTransaction = transactionList.find(transac => transac.id === data.transactionId)
                navigation.navigate("Starter",{
                    screen: "ValidationTransacDetail",
                    params: selectedTransaction})
            }
            else {
                routeParams = {
                    screen: routes.LOGIN,
                    params: {mainNavig: 'Starter', nestedNavig: routes.VALIDATION_TRANSAC_DETAIL, otherParams: {type: data.notifType, id: data.transactionId}}
                }
                navigation.navigate("Auth", routeParams)
            }
        }
        if(notifType === 'param') {
            navigation.navigate("Auth")
        }
        if(notifType === 'userCompte') {
            if(isUserConnected) {
                navigation.navigate('Starter',{screen: 'UserCompte', params: currentUser})

            }else {
                routeParams = {
                    screen: routes.LOGIN,
                    params: {mainNavig: 'Starter', nestedNavig: routes.USER_COMPTE, otherParams: {type: data.notifType}}
                }
                navigation.navigate("Auth", routeParams)
            }
        }
        if(notifType === 'cotisation') {
            if(isUserConnected) {
                const listAssociations = store.getState().entities.association.list
                const currentAssociation = listAssociations.find(asso => asso.id === data.associationId)
                dispatch(setSelectedAssociation(currentAssociation))
                await getInitAssociation(currentAssociation)
                navigation.navigate('BottomTab', {screen: 'Cotisations', params: {screen: "ListCotisation"}})
            } else {
                routeParams = {
                    screen: routes.LOGIN,
                    params: {mainNavig: 'BottomTab', nestedNavig: 'Cotisations', otherParams: {screen: 'ListCotisation', type: data.notifType, id: data.associationId}}
                }
                navigation.navigate('Auth', routeParams)
            }
        }
        if(notifType === 'engagement') {
            if(isUserConnected) {
                const listAssociations = store.getState().entities.association.list
                const currentAssociation = listAssociations.find(asso => asso.id === data.associationId)
                dispatch(setSelectedAssociation(currentAssociation))
               await getInitAssociation(currentAssociation)
                navigation.navigate('BottomTab', {screen: 'Engagements', params: {screen: "NewEngagementList"}})
            } else {
                routeParams = {
                    screen: routes.LOGIN,
                    params: {mainNavig: 'BottomTab', nestedNavig: 'Engagements', otherParams: {screen: 'NewEngagementList', type: data.notifType, id: data.associationId}}
                }
                navigation.navigate('Auth', routeParams)
            }
        }
    }

    return  {registerForPushNotificationsAsync, handleNotificationTaped}
}