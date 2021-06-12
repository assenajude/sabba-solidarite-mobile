import React from 'react';
import AppButton from "../AppButton";
import {useFormikContext} from "formik";

function FormSubmitButton({title, otherProps}) {
    const {handleSubmit} = useFormikContext()
    return (
        <AppButton otherButtonStyle={{width: '80%', alignSelf: 'center'}} title={title} onPress={handleSubmit} {...otherProps}/>
    );
}

export default FormSubmitButton;