import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import configureStore from "./src/store/configureStore";
import {Provider} from "react-redux";
import {NavigationContainer} from "@react-navigation/native";
import MainNavigator from "./src/navigation/MainNavigator";
import logger from "./src/utilities/logger";
import OfflineNotice from "./src/components/OfflineNotice";

logger.start()

export default function App() {
  const store = configureStore()

  return (
        <Provider store={store}>
          <NavigationContainer>
            <MainNavigator/>
          </NavigationContainer>
            <OfflineNotice/>
        </Provider>
  );
}



