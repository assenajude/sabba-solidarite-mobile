import React from 'react';
import {TouchableOpacity, View, StyleSheet} from "react-native";
import AppText from "../AppText";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import defaultStyles from "../../utilities/styles";
import {useSelector} from "react-redux";

function VoteItem({allVoted, handleVoteUp, upVotes,handleVoteDown, downVotes}) {
    const memberToVote = useSelector(state => {
        const list  = state.entities.association.selectedAssociationMembers
        const voteNumber = list.length / 2
        return Math.ceil(voteNumber)
    })

    return (
        <View style={styles.voteContainer}>
            <View style={{
                flexDirection: 'row',
                marginRight: 20
            }}>
                <AppText>{allVoted}</AppText>
                <AppText> / </AppText>
                <AppText>{memberToVote}</AppText>
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
    );
}

const styles = StyleSheet.create({
    voteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginHorizontal: 20,
        marginVertical: 20,

    }
})
export default VoteItem;