import React from 'react';
import {View, FlatList, StyleSheet} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'

import AppText from "../components/AppText";
import {useSelector} from "react-redux";
import MemberListItem from "../components/member/MemberListItem";
import defaultStyles from '../utilities/styles'
import ListItemSeparator from "../components/ListItemSeparator";
import useCotisation from "../hooks/useCotisation";
import useManageAssociation from "../hooks/useManageAssociation";
import AppHeaderGradient from "../components/AppHeaderGradient";
import AppAddNewButton from "../components/AppAddNewButton";
import routes from "../navigation/routes";
import useAuth from "../hooks/useAuth";

function EtatCotisationScreen({navigation}) {
    const {getConnectedMember} = useAuth()
    const {getMemberCotisations, notPayedCompter} = useCotisation()
    const {formatFonds, associationValidMembers} = useManageAssociation()
    const error = useSelector(state => state.entities.cotisation.error)


    return (
        <>
            <AppHeaderGradient/>
            {associationValidMembers().length === 0 && error === null && <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: 'center'
            }}>
                <AppText>Aucune cotisation trouvée</AppText>
                </View>}
            {associationValidMembers().length>0 && <FlatList data={associationValidMembers()}
                      keyExtractor={item => item.id.toString()}
                      ItemSeparatorComponent={ListItemSeparator}
                      renderItem={({item}) =>
                          <MemberListItem selectedMember={item}
                              getMemberDetails={() => navigation.navigate('MemberCotisationScreen',item)}>
                              <AppText style={{marginHorizontal: 10}}>({getMemberCotisations(item).cotisationLenght})</AppText>
                              <AppText style={{marginHorizontal: 10}}>{formatFonds(getMemberCotisations(item).totalCotisation)}</AppText>
                          <View style={styles.checker}>
                            {notPayedCompter(item.member) === 0 && <MaterialCommunityIcons name="account-check" size={24} color={defaultStyles.colors.vert} />}
                              {notPayedCompter(item.member) > 0 && <MaterialCommunityIcons name="account-alert" size={24} color="orange" />}
                          </View>
                      </MemberListItem>}
            />}

            <View style={styles.listButton}>
                <AppAddNewButton
                    compter={notPayedCompter(getConnectedMember()?.member)}
                    name='view-list'
                    onPress={() => navigation.navigate(routes.LIST_COTISATION)}/>
            </View>
        </>
    );
}
const styles = StyleSheet.create({
    checker: {
        position: 'absolute',
        right: 5,
        top: -35
    },
    listButton: {
        position: 'absolute',
        right: 15,
        bottom: 15
    }
})
export default EtatCotisationScreen;