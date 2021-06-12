import React from 'react';
import {View} from "react-native";
import {Picker} from "@react-native-picker/picker";
import {useFormikContext} from "formik";
import AppText from "../AppText";

function FormItemPicker({data, name,label,...otherProps}) {
const {setFieldValue, values} = useFormikContext()

    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
        }}>
            <AppText style={{fontWeight: 'bold'}}>{label}</AppText>
        <Picker style={{
            width: 200
        }} mode='dropdown' selectedValue={values[name]} onValueChange={val => setFieldValue(name, val)} {...otherProps}>
            {data.map(item =><Picker.Item key={item.toString()} label={item} value={item}/>)}
        </Picker>
        </View>
    );
}

export default FormItemPicker;