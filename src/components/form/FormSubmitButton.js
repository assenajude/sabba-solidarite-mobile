import React from 'react';
import AppButton from "../AppButton";
import {useFormikContext} from "formik";

function FormSubmitButton({title, buttonStyle,iconName}) {
    const {handleSubmit} = useFormikContext()
    return (
        <AppButton
            icon={iconName}
            style={[{marginVertical: 40, marginHorizontal: 20},buttonStyle]}
            onPress={handleSubmit}
            title={title}
        />
    );
}

export default FormSubmitButton;