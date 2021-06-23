import React from "react";

export const navigationRef = React.createRef()

const  navigate = (route, params) =>
    navigationRef.current?.navigate(route, params)


export default {
    navigate
}