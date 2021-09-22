import React from 'react';
import {View, FlatList, StyleSheet, Alert, ToastAndroid} from "react-native";
import AppText from "../components/AppText";
import {useDispatch, useSelector, useStore} from "react-redux";
import EngagementItem from "../components/engagement/EngagementItem";
import useAuth from "../hooks/useAuth";
import defaultStyles from '../utilities/styles'
import {
 getEngagementDelete,
    getEngagementDetail,
    showEngagementTranches,
} from "../store/slices/engagementSlice";
import ListItemSeparator from "../components/ListItemSeparator";
import AppActivityIndicator from "../components/AppActivityIndicator";

import useManageAssociation from "../hooks/useManageAssociation";

function NewEngagementList({navigation}) {
    const dispatch = useDispatch()
    const  {dataSorter} = useAuth()
    const store = useStore()
    const {associationValidMembers} = useManageAssociation()

    const isLoading = useSelector(state => state.entities.engagement.loading)
    const allTranches = useSelector(state => state.entities.engagement.tranches)

    const validationEngagement = useSelector(state => {
        const list = state.entities.engagement.list
        let selectedList = []
        list.forEach(item => {
            if(item.accord === false || item.statut.toLowerCase() === 'pending') selectedList.push(item)
        })
        const sortedList = dataSorter(selectedList)
        return sortedList
    })


    const handleDeleteEngagement = (engagement) => {
        Alert.alert("Attention.", "Voulez-vous supprimer definitivement cet engagement?",
            [
                {
                    text: 'oui', onPress: async () => {
                       await dispatch(getEngagementDelete({engagementId: engagement.id}))
                        const error = store.getState().entities.engagement.error
                        if(error !== null) {
                            return alert("Impossible de faire la suppression. Une erreur est apparue.")
                        }
                       ToastAndroid.showWithGravity("Engagement supprimé.",
                           ToastAndroid.LONG,
                           ToastAndroid.CENTER)
                    }
                }, {
            text: 'non', onPress: () => {return;}
            }])
    }

    return (
        <>
           <AppActivityIndicator visible={isLoading}/>
            {validationEngagement.length=== 0 && <View style={styles.empty}>
                <AppText>Aucun engagement trouvé</AppText>
            </View>}
          {validationEngagement.length>0 && <FlatList
               data={validationEngagement}
               keyExtractor={item => item.id.toString()}
               ItemSeparatorComponent={ListItemSeparator}
               renderItem={({item}) =>
                   <EngagementItem
                       isEditable={true}
                       deletePending={() => handleDeleteEngagement(item)}
                       editEngagement={() => navigation.navigate('EditEngagementScreen', item)}
                       onWaiting={item.statut.toLowerCase() === 'pending' || item.statut.toLowerCase() === 'rejected'}
                       getMembersDatails={() => navigation.navigate('Members',{screen: 'MemberDetails', params: associationValidMembers().users.find(member => member.id === item.Creator.userId)})}
                       getMoreDetails={() => dispatch(getEngagementDetail(item))}
                       renderRightActions={() => <View>
                           <AppText style={{color: defaultStyles.colors.bleuFbi, fontSize:15, marginLeft: 20}}>voting...</AppText>
                       </View>}
                       engagement={item}
                       tranches={allTranches.filter(tranche => tranche.engagementId === item.id)}
                       showTranches={item.showTranches}
                       getTranchesShown={() => dispatch(showEngagementTranches(item))}
                       isVoting={item.accord===false}
                       getEngagementDetails={() => dispatch(getEngagementDetail(item))}
                       engagementDetails={item.showDetail}
                   selectedMember={associationValidMembers().users.find(member => member.id === item.Creator.userId)}
                   />}/>}
        </>
    );
}

const styles = StyleSheet.create({
    empty:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
export default NewEngagementList;