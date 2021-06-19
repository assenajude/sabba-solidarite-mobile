import {Platform} from 'react-native'
import Constants from "expo-constants/src/Constants";
import * as Notifications from 'expo-notifications'
import routes from "../navigation/routes";
import navigation from '../navigation/routeNavigation'
import {useStore} from "react-redux";
let useNotification;
export default useNotification = () => {

    const store = useStore()

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

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
        return token
    };

    const handleNotificationTaped =  (response) => {
        const data = response.data
        const notifType = data.notifType
        const user = store.getState().auth.user
        if(Object.keys(user).length === 0) {
            navigation.navigate('Auth', {screen: routes.LOGIN})
        } else {
            if(notifType === 'adhesion') {
                navigation.navigate('Starter',{screen: routes.ASSOCIATION_LIST})
            }
            if(notifType === 'transaction') {
                if(data.mode === 'depot') navigation.navigate("Transaction", {screen: 'Depot'})
                if(data.mode === 'retrait') navigation.navigate("Transaction", {screen: 'Retrait'})
            }
        }
    }

    return  {registerForPushNotificationsAsync, handleNotificationTaped}
}