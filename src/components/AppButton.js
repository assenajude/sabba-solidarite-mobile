import React from 'react';
import {Button} from "react-native-paper";

function AppButton({title,onPress, style,iconName,contentStyle, mode='contained',height=50, ...props}) {
    return (
        <Button
            icon={iconName}
            onPress={onPress}
            style={style}
            contentStyle={[{height: height}, contentStyle]}
            mode={mode}
            {...props}>
            {title}
        </Button>
    );
}

export default AppButton;