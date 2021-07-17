import React from 'react';
import {TouchableOpacity, View, StyleSheet} from "react-native";
import AppText from "../AppText";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import defaultStyles from "../../utilities/styles";
import useManageAssociation from "../../hooks/useManageAssociation";

function VoteItem({allVoted, handleVoteUp, upVotes,handleVoteDown, downVotes, getEngagementVotants}) {

    const {votorsNumber} = useManageAssociation()

    return (
        <View style={styles.voteContainer}>
            <AppText onPress={getEngagementVotants}
                style={{
                color:defaultStyles.colors.bleuFbi
            }}>Votants</AppText>

            <View style={{
                flexDirection: 'row',
                alignItems: 'center'
            }}>
            <View style={{
                flexDirection: 'row',
                marginRight: 20,
            }}>
                <AppText>{allVoted}</AppText>
                <AppText> / </AppText>
                <AppText>{votorsNumber()}</AppText>
            </View>
            <TouchableOpacity onPress={handleVoteUp}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <AppText style={{marginRight: 5}}>{upVotes}</AppText>
                    <MaterialCommunityIcons name="thumb-up" size={30} color={defaultStyles.colors.vert} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleVoteDown}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <MaterialCommunityIcons style={{marginLeft: 20}} name="thumb-down" size={30} color={defaultStyles.colors.rougeBordeau} />
                    <AppText style={{marginLeft: 5}}>{downVotes}</AppText>
                </View>
            </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    voteContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 20,

    }
})
export default VoteItem;