import React from 'react';
import configureStore from "./src/store/configureStore";
import {Provider} from "react-redux";
import logger from "./src/utilities/logger";
import OfflineNotice from "./src/components/OfflineNotice";
import AppWrapper from "./AppWrapper";

logger.start()


export default function App() {
  const store = configureStore()

  return (
        <Provider store={store}>
            <AppWrapper/>
            <OfflineNotice/>
        </Provider>
  );
}



