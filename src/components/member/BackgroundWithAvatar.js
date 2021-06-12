import React, {useState} from 'react';
import {Image, View, StyleSheet, TouchableWithoutFeedback} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import defaultStyles from "../../utilities/styles";
import MemberItem from "./MemberItem";
import AppImagePicker from "../AppImagePicker";
import AppCamera from "../AppCamera";

function BackgroundWithAvatar({getCompteDetails, fondStyle, selectedMember,onChangeImages, avatarStyle, showCamera}) {
    
    return (
        <View>
            {!selectedMember.member.backImage && <LinearGradient
                colors={['#860432', 'transparent']}
                style={styles.background}
            />}
            {selectedMember.member.backImage && <Image
                style={[styles.fontImage, fondStyle]}
                source={{uri: selectedMember.member.backImage}}/>}
            <MemberItem selectedMember={selectedMember} avatarStyle={avatarStyle} getMemberDetails={getCompteDetails}/>
            {showCamera &&
                <AppCamera
                    onPress={onChangeImages}
                    iconSize={20}
                    cameraStyle={{width:40, height: 40}}
                    cameraContainer={styles.camera}/>
            }
        </View>
    );
}
const styles = StyleSheet.create({
    avatar: {
        borderRadius: 30,
        bottom:30,
        position: 'absolute',
        height: 60,
        left: 30,
        width: 60
    },
    background: {
        height: 100,
        width: '100%',
    },
    cameraContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    camera: {
        position: 'absolute',
        right: 10,
        bottom: 25,
        height: 50,
        width: 50
    },
    fontImage: {
        height: 150
    },
    mainInfo: {
        marginLeft:'25%',
        marginTop: 10,
    }
})
export default BackgroundWithAvatar;