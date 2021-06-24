import React from 'react';
import {View, FlatList, StyleSheet} from "react-native";
import MemberListItem from "../components/member/MemberListItem";
import AppText from "../components/AppText";
import ListItemSeparator from "../components/ListItemSeparator";
import AppHeaderGradient from "../components/AppHeaderGradient";
import useManageAssociation from "../hooks/useManageAssociation";

function MembersListScreen({navigation}) {
    const {associationValidMembers} = useManageAssociation()
    return (
        <>
            <AppHeaderGradient/>
            {associationValidMembers().members.length===0 && <View style={styles.emptyStyle}>
                <AppText>Aucun membre trouvé</AppText>
            </View>}

           {associationValidMembers().members?.length>0 &&
           <FlatList data={associationValidMembers().users}
                      keyExtractor={item => item.id.toString()}
                     ItemSeparatorComponent={ListItemSeparator}
                      renderItem={({item}) =>
                          <MemberListItem
                              showMemberState={true}
                              selectedMember={item}
                              childrenStyle={{top: 30}}
                              getMemberDetails={() => navigation.navigate('MemberDetails', item)}>
                              <AppText>{item.member.statut}</AppText>
                          </MemberListItem>
                      }
            />}
        </>
    );
}
const styles = StyleSheet.create({
    addNew: {
        position: 'absolute',
        bottom: 40,
        right: 20
    },
    emptyStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
export default MembersListScreen;