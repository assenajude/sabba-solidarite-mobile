import React from 'react';
import {Image, ScrollView, View} from "react-native";
import AppText from "../AppText";

function ReseauBackImageAndLabel({reseauName, reseauImage}) {
    return (
        <View style={{
            alignItems: 'center'
        }}>
            <Image resizeMode='stretch' source={reseauImage} style={{
                height: 200,
                width: '100%'
            }}/>
            <AppText style={{fontWeight: 'bold'}}>{reseauName}</AppText>
        </View>
    );
}

export default ReseauBackImageAndLabel;