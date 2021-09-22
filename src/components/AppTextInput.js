import React from 'react';
import {TextInput} from "react-native-paper";

function AppTextInput({label, value,iconName, style,textInputRef,onChangeText, ...otherProps}) {
    return (
            <TextInput
                ref={textInputRef}
                style={style}
                label={label}
                value={value}
                onChangeText={onChangeText}
                left={iconName?<TextInput.Icon name={iconName}/> : null}
                {...otherProps}
            />

    );
}


export default AppTextInput;