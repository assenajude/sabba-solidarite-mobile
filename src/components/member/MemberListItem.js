import React from 'react';
import {View,StyleSheet, TouchableOpacity} from "react-native";
import * as Progress from "react-native-progress";
import Swipeable from "react-native-gesture-handler/Swipeable";

import MemberItem from "./MemberItem";

function MemberListItem({selectedMember,getMemberDetails,progress=0.4,showProgress=false,
                            childrenStyle, renderRightActions,deleteAvatar,avatarStyle, children}) {
    return (
        <Swipeable renderRightActions={renderRightActions}>
        <TouchableOpacity onPress={getMemberDetails}>
        <View>
            {showProgress && <View style={styles.progress}>
                <Progress.Bar progress={progress} width={200} />
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
    );
}

const styles = StyleSheet.create({
    mainContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 20
    },
    progress: {
        position: 'absolute',
        left:'25%',
        top: 5
    }
})

export default MemberListItem;