import React from 'react';
import {TouchableOpacity} from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker'


function AppDocumentPicker(props) {

    const getReglementDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync()
            console.log(result);
        } catch (e) {
            throw new Error(e)
        }
    }

    return (
        <TouchableOpacity onPress={getReglementDocument}>
            <MaterialCommunityIcons name="upload-outline" size={24} color="black" />
        </TouchableOpacity>
    );
}

export default AppDocumentPicker;