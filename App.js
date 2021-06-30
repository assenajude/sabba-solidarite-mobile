import React, {useEffect} from 'react';
import configureStore from "./src/store/configureStore";
import {Provider} from "react-redux";
import logger from "./src/utilities/logger";
import OfflineNotice from "./src/components/OfflineNotice";
import AppWrapper from "./AppWrapper";
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {BackHandler, Alert} from "react-native";

logger.start()


export default function App() {
  const store = configureStore()

    useEffect(() => {
        const backAction = () => {
            Alert.alert('Alert!', "Voulez-vous quitter l'application?", [
                {
                    text: 'Non',
                    onPress: () => null,
                    style: 'cancel',
                },
                { text: 'Quitter', onPress: () => BackHandler.exitApp() },
            ]);
            return true;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove();
    }, []);

  return (
      <SafeAreaProvider>
        <Provider store={store}>
            <AppWrapper/>
            <OfflineNotice/>
        </Provider>
      </SafeAreaProvider>
  );
}



