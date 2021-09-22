import React from 'react';
import {useFormikContext} from 'formik'
import ErrorMessage from "./ErrorMessage";
import {TextInput} from "react-native-paper";

function AppFormField({name,formFielRef,icon, ...otherProps}) {
    const {setFieldTouched, errors, touched, setFieldValue, values} = useFormikContext()
    return (
        <>
            <TextInput
                icon={icon}
                style={{marginVertical: 10}}
                ref={formFielRef}
                onBlur={() => setFieldTouched(name) }
                onChangeText={text => setFieldValue(name, text)}
                value={values[name]}
                left={icon?<TextInput.Icon name={icon}/> : null}
                {...otherProps}
            />
            <ErrorMessage  error={errors[name]} visible={touched[name]}/>
        </>
    );
}

export default AppFormField;