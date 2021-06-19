import React, {useEffect, useState, useRef} from 'react';
import configureStore from "./src/store/configureStore";
import {Provider} from "react-redux";
import {NavigationContainer} from "@react-navigation/native";
import MainNavigator from "./src/navigation/MainNavigator";
import * as Notifications from 'expo-notifications';

import logger from "./src/utilities/logger";
import OfflineNotice from "./src/components/OfflineNotice";
import useNotification from "./src/hooks/useNotification";
import {navigationRef} from './src/navigation/routeNavigation'

logger.start()

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});
export default function App() {
  const store = configureStore()
    const {handleNotificationTaped} = useNotification()

    const [notification, setNotification] = useState({})
    const notificationListener = useRef();
    const responseListener = useRef();

    const handleReceivedLister = (notification) => {
        setNotification(notification)
    }

    const handleNotificationResponse = (response) => {
        handleNotificationTaped(response.notification.request.content)
    }

    useEffect(() => {
        notificationListener.current = Notifications.addNotificationReceivedListener(handleReceivedLister);
        responseListener.current = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };

    }, [])

  return (
        <Provider store={store}>
          <NavigationContainer ref={navigationRef}>
            <MainNavigator/>
          </NavigationContainer>
            <OfflineNotice/>
        </Provider>
  );
}



