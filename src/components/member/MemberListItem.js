import React from 'react';
import {View,StyleSheet, TouchableOpacity} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import defaultStyles from '../../utilities/styles'
import {MaterialCommunityIcons} from '@expo/vector-icons'

import MemberItem from "./MemberItem";
import AppText from "../AppText";
import AppIconButton from "../AppIconButton";
import {ProgressBar} from "react-native-paper";
import useAuth from "../../hooks/useAuth";

function MemberListItem({selectedMember,getMemberDetails,progress=0.4,showProgress=false,showMemberState=false,
                            childrenStyle, renderRightActions,deleteAvatar,avatarStyle, notMember, label, deleteMember, children}) {
    return (
        <View style={{
            marginVertical: 5
        }}>
            {showMemberState && <View style={{
                alignItems: 'flex-end',
                marginHorizontal: 10
            }}>
                {selectedMember.member.relation.toLowerCase() === "ondemand" && <MaterialCommunityIcons name="account-plus" size={24} color={defaultStyles.colors.bleuFbi} />}
                {selectedMember.member.relation.toLowerCase() === "onleave" && <MaterialCommunityIcons name="account-minus" size={24} color={defaultStyles.colors.rougeBordeau} />}
            </View>}
        <Swipeable renderRightActions={renderRightActions}>
        <TouchableOpacity onPress={getMemberDetails}>
        <View>
            {showProgress && <View style={styles.progress}>
                <ProgressBar progress={progress} style={{width:200, height: 5}} />
            </View>}
        <View style={styles.mainContent}>
           <MemberItem selectedMember={selectedMember} deleteAvatar={deleteAvatar}
               getMemberDetails={getMemberDetails} avatarStyle={avatarStyle}/>

        </View>
            <View style={[{
                flexDirection: 'row',
                position: 'absolute',
                right: 10,
                top: 60
            }, childrenStyle]}>
                {children}
            </View>
        </View>
        </TouchableOpacity>
        </Swipeable>
            {notMember && <View style={styles.notMember}>
            </View>}
            {notMember && <View style={styles.deleteNotMember}>
                <AppText style={{color: defaultStyles.colors.rougeBordeau}}>{label}</AppText>
                <AppIconButton
                    onPress={deleteMember}
                    iconSize={30}
                    containerStyle={{
                        paddingHorizontal: 0,
                        height: 50,
                        width: 50,
                        borderRadius: 25
                    }}
                    iconName='account-remove'
                    iconColor={defaultStyles.colors.rougeBordeau}/>
            </View>}
        </View>
    );
}

const styles = StyleSheet.create({
    deleteNotMember: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center'
    },
    mainContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 20
    },
    notMember: {
      position: 'absolute',
        opacity: 0.7,
        width: '100%',
        height: '100%',
      backgroundColor: defaultStyles.colors.white
    },
    progress: {
        position: 'absolute',
        left:'25%',
        top: 5
    }
})

export default MemberListItem;