import React, {useEffect} from 'react';
import {TouchableWithoutFeedback,Image, StyleSheet,View, Alert} from "react-native";


function AppAvatar({avatarStyle,source,onDelete}) {

    const isImage = Object.keys(source).length>0 && source?.uri !== null && source?.uri !== undefined

    return (
        <TouchableWithoutFeedback onPress={onDelete}>
            <View>
            {!isImage && <Image mode='contain' source={require('../../assets/silhouette.png')} style={[styles.avatar, avatarStyle]}/>}
            {isImage && <Image style={[styles.avatar, avatarStyle]} source={source}/>}
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    avatar: {
        height: 60,
        width: 60,
        borderRadius: 30
    }
})
export default AppAvatar;