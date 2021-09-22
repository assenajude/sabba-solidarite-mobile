import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableWithoutFeedback} from "react-native";
import AppText from "../AppText";
import defaultStyles from '../../utilities/styles'
import AppAvatar from "../AppAvatar";

function MemberItem({getMemberDetails, selectedMember,deleteAvatar, showPhone=false}) {

    const currentUser = selectedMember

    return (
        <TouchableWithoutFeedback onPress={getMemberDetails}>
        <View style={styles.container}>
            <AppAvatar
                size={50}
                user={selectedMember.member?selectedMember.member : selectedMember}
                onPress={deleteAvatar}
            />
            <View style={styles.addressContainer}>
                <AppText style={styles.addressText}>{currentUser.username || ''}</AppText>
                <AppText style={styles.addressText}>{currentUser.email?currentUser.email:currentUser.phone}</AppText>
                {showPhone  && <AppText style={styles.addressText}>{currentUser.phone}</AppText>}
            </View>
        </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    addressContainer: {
      alignItems: 'flex-start',
        marginLeft: 10
    },
    addressText: {
      color: defaultStyles.colors.grey,
        fontWeight: '100',
        fontSize: 15
    },
    avatar: {
        height: 60,
        width: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10
    }
})
export default MemberItem;