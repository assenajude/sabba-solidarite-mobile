import React from 'react';
import {useFormikContext} from 'formik'
import AppTextInput from "../AppTextInput";
import ErrorMessage from "./ErrorMessage";

function AppFormField({name,formFielRef, ...otherProps}) {
    const {setFieldTouched, errors, touched, setFieldValue, values} = useFormikContext()
    return (
        <>
            <AppTextInput
                textInputRef={formFielRef}
                onBlur={() => setFieldTouched(name) }
                onChangeText={text => setFieldValue(name, text)}
                value={values[name]}
                {...otherProps}
            />
            <ErrorMessage error={errors[name]} visible={touched[name]}/>
        </>
    );
}

export default AppFormField;