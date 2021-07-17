import React, {useEffect, useRef, useState} from 'react';
import {navigationRef} from "./src/navigation/routeNavigation";
import MainNavigator from "./src/navigation/MainNavigator";
import {NavigationContainer} from "@react-navigation/native";
import useNotification from "./src/hooks/useNotification";
import * as Notifications from "expo-notifications";
import {useDispatch, useSelector} from "react-redux";
import {getAllAssociation} from "./src/store/slices/associationSlice";
import {getUserTransactions} from "./src/store/slices/transactionSlice";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});
function AppWrapper({getImageState}) {
    const dispatch = useDispatch()
    const {handleNotificationTaped} = useNotification()

    const imageState = useSelector(state => state.auth.welcomeImageReady)


    const [notification, setNotification] = useState({})
    const notificationListener = useRef();
    const responseListener = useRef();

    const handleReceivedListener = (notification) => {
        const data = notification.request.content.data
        if(data.notifType === 'adhesion') {
            dispatch(getAllAssociation())
        }
        if(data.notifType === 'transaction') {
            dispatch(getUserTransactions({}))
        }
        setNotification(notification)
    }

    const handleNotificationResponse = (response) => {
        handleNotificationTaped(response.notification.request.content)
    }

    const setImageState = () => {
        getImageState(imageState)
    }
    useEffect(() => {
        notificationListener.current = Notifications.addNotificationReceivedListener(handleReceivedListener);
        responseListener.current = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
        setImageState()
    }, [imageState])

    return (
        <NavigationContainer ref={navigationRef}>
            <MainNavigator/>
        </NavigationContainer>
    );
}

export default AppWrapper;