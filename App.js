import React, {useEffect, useState} from 'react';
import configureStore from "./src/store/configureStore";
import {Provider} from "react-redux";
import {Provider as PaperProvider} from 'react-native-paper'
import logger from "./src/utilities/logger";
import OfflineNotice from "./src/components/OfflineNotice";
import AppWrapper from "./AppWrapper";
import {BackHandler, Alert} from "react-native";
import AppLoading from 'expo-app-loading'

logger.start()


export default function App() {
  const store = configureStore()

    const [isReady, setIsReady] = useState(false)

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


  if(!isReady) {
      return <AppLoading
          startAsync={() => null}
          onFinish={() => setIsReady(true)}
          onError={(error) => console.log(error)}/>
    }
  return (
        <Provider store={store}>
            <PaperProvider>
            <AppWrapper/>
            <OfflineNotice/>
            </PaperProvider>
        </Provider>
  );
}



