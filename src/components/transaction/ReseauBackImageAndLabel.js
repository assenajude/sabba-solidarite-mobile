import React from 'react';
import {Image, View} from "react-native";
import AppText from "../AppText";

function ReseauBackImageAndLabel({reseau}) {
    return (
        <View style={{
            alignItems: 'center'
        }}>
            <Image
                resizeMode='stretch'
                source={reseau?reseau.image : require('../../../assets/icon.png')}
                style={{
                height: 200,
                width: '100%'
            }}/>
            <AppText style={{fontWeight: 'bold'}}>{reseau?reseau.name : 'Sabbat-Solidarité'}</AppText>
        </View>
    );
}

export default ReseauBackImageAndLabel;