import React from 'react';
import {Text} from "react-native";
import defaultStyles from '../utilities/styles'

function AppText({style,children, ...otherProps}) {
    return (
        <Text style={[defaultStyles.text, style]} {...otherProps}>{children}</Text>
    );
}


export default AppText;