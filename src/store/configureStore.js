import {configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import routeReducers from "./routeReducers";
import api from './middlewares/api'

export default function () {
    return configureStore({
        reducer: routeReducers,
        middleware: [
            ...getDefaultMiddleware(),
            api
        ]

    })
}