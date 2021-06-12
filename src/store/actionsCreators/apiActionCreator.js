import {createAction} from "@reduxjs/toolkit";

export const apiRequested = createAction('api/requested')
export const apiRequestSuccess = createAction('api/requestSuccess')
export const apiRequestFailed = createAction('api/requestFailed')