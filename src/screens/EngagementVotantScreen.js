import React, {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet} from "react-native";
import AppText from "../components/AppText";
import ListItemSeparator from "../components/ListItemSeparator";
import MemberItem from "../components/member/MemberItem";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import defaultStyles from "../utilities/styles";
import useManageAssociation from "../hooks/useManageAssociation";

function EngagementVotantScreen({route, navigation}) {
    const selected = route.params

    const {formatFonds} = useManageAssociation()
    const [selectedEngagement, setSelectedEngagement] = useState(selected?.engagement)
    const [votants, setVotants] = useState(selected?.votants)

    useEffect(() => {
        setSelectedEngagement(selected?.engagement)
        setVotants(selected?.votants)
    }, [])

    return (
        <>
          <View style={styles.engagement}>
              <AppText style={{fontWeight: 'bold', width: '60%'}}>{selectedEngagement.libelle}</AppText>
              <AppText style={{fontWeight: 'bold'}}>{formatFonds(selectedEngagement.montant)}</AppText>
          </View>
            <ListItemSeparator/>
            <AppText style={{alignSelf: 'center', marginVertical: 20, fontWeight: 'bold'}}>Votants</AppText>
           {votants?.length === 0 && <View style={{
               flex: 1,
               justifyContent: 'center',
               alignItems: 'center'
           }}>
                <AppText>Aucun votant trouvé.</AppText>
            </View>}
            {votants?.length > 0 && <FlatList
                data={votants}
                keyExtractor={item => item.id.toString()}
                ItemSeparatorComponent={ListItemSeparator}
                renderItem={({item}) => <View>
                    <MemberItem
                        getMemberDetails={() => navigation.navigate('Members',{screen: 'MemberDetails', params: item})}
                        selectedMember={item}/>
                    <View style={{
                        position: 'absolute',
                        top: -10,
                        right: 20,
                        marginVertical: 20
                    }}>
                        {item.typeVote === 'up' && <MaterialCommunityIcons name="thumb-up" size={25} color={defaultStyles.colors.vert}/>}
                        {item.typeVote === 'down' && <MaterialCommunityIcons name="thumb-down" size={25} color={defaultStyles.colors.rougeBordeau}/>}
                    </View>
                </View>}
            />}
        </>
    );
}

const styles = StyleSheet.create({
    engagement: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginVertical: 20
    }
})
export default EngagementVotantScreen;