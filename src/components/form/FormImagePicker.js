import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, View, TouchableOpacity, Alert} from "react-native";
import AppImagePicker from "../AppImagePicker";
import {useFormikContext} from "formik";
import AppText from "../AppText";

function FormImagePicker({name, label}) {
    const {values, setFieldValue} = useFormikContext()

    const isImage = values[name] !== '' && values[name] !== null && Object.keys(values[name]).length>0

    const handleDeleteImage = () => {
        Alert.alert("Attention", "voulez-vous supprimer l'image?",
            [{text: 'oui', onPress: () => {
                setFieldValue(name, null)
                }}, {text: 'non', onPress: () => {return;}}])
    }

    return (
        <View style={styles.container}>
            {label && <View style={{
                marginRight: 20
            }}>
                <AppText style={{fontWeight: 'bold'}}>{label}</AppText>
            </View>}
            <View>
                {!isImage && <View style={styles.imageContainer}>
                    <AppText style={{fontSize: 12}}>Ajouter une image</AppText>
                </View>
                }
             {isImage && <TouchableOpacity onPress={handleDeleteImage}>
             <Image style={styles.image} source={{uri: values[name].url}}/>
             </TouchableOpacity>
             }
            </View>
            <AppImagePicker cameraContainer={{
                marginHorizontal: 10
            }} onSelectImage={image => setFieldValue(name, image)}/>
        </View>
    );
}
const styles = StyleSheet.create({
    image: {
        width: 100,
        height: 100,
        borderRadius: 20,
        overflow: 'hidden'

    },
    container: {
        flexDirection: 'row',
        alignItems: "center",
        marginVertical: 10,
        marginHorizontal:10,
    },
    imageContainer: {
        width: 80,
        height: 80,
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
export default FormImagePicker;