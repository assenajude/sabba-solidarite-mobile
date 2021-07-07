import React, {useEffect} from 'react';
import {View, StyleSheet, TouchableWithoutFeedback} from "react-native";
import AppText from "../AppText";
import defaultStyles from '../../utilities/styles'
import AppAvatar from "../AppAvatar";
import {selectedMemberAvatarLoaded} from "../../store/slices/memberSlice";
import {useDispatch} from "react-redux";

function MemberItem({getMemberDetails, avatarStyle, selectedMember,deleteAvatar, showPhone=false}) {

    const dispatch = useDispatch()

    const handleImageLoadEnd = () => {
            if(selectedMember.avatarLoading){
                dispatch(selectedMemberAvatarLoaded(selectedMember))
            }
    }

    return (
        <TouchableWithoutFeedback onPress={getMemberDetails}>
        <View style={styles.container}>
            <AppAvatar
                avatarLoading={selectedMember.avatarLoading}
                onAvatarLoadEnd={() => handleImageLoadEnd()}
                source={{uri: selectedMember.member?selectedMember.member.avatar : selectedMember.avatar}}
                avatarStyle={avatarStyle} onDelete={deleteAvatar}/>
            <View style={styles.addressContainer}>
                <AppText style={styles.addressText}>{selectedMember.username}</AppText>
                <AppText style={styles.addressText}>{selectedMember.email?selectedMember.email:selectedMember.phone}</AppText>
                {showPhone  && <AppText style={styles.addressText}>{selectedMember.phone}</AppText>}
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