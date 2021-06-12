import React, {useState} from 'react';
import  {View, FlatList, StyleSheet} from "react-native";
import {useDispatch, useSelector} from "react-redux";

import MemberListItem from "../components/member/MemberListItem";
import AppText from "../components/AppText";
import useManageAssociation from "../hooks/useManageAssociation";
import ListItemSeparator from "../components/ListItemSeparator";
import routes from "../navigation/routes";
import defaultStyles from '../utilities/styles'
import AppAddNewButton from "../components/AppAddNewButton";
import EngagementItem from "../components/engagement/EngagementItem";
import useEngagement from "../hooks/useEngagement";
import {
    getEngagementDetail,
    getPayingTranche,
    showEngagementTranches
} from "../store/slices/engagementSlice";
import useAuth from "../hooks/useAuth";
import AppHeaderGradient from "../components/AppHeaderGradient";
import {Picker} from "@react-native-picker/picker";
import TrancheRightActions from "../components/tranche/TrancheRightActions";
import AppActivityIndicator from "../components/AppActivityIndicator";

function EtatEngagementScreen({navigation}) {
    const dispatch = useDispatch()
    const {getMemberUserCompte} = useAuth()
    const {formatFonds, associationValidMembers} = useManageAssociation()
    const {getMemberEngagementInfos, handlePayTranche} = useEngagement()

    const isLoading = useSelector(state => state.entities.engagement.loading)
    const currentUser = useSelector(state => state.auth.user)
    const connectedMember = useSelector(state => {
        const listMember = state.entities.association.selectedAssociationMembers
        const currentMember = listMember.find(item => item.id === currentUser.id)
        return currentMember
    })
    const engagements = useSelector(state => {
        const list = state.entities.engagement.list
        const validList = list.filter(item => item.accord === true)
        return validList
    })
    const allTranches = useSelector(state => state.entities.engagement.tranches)
    const [mainData, setMainData] = useState(engagements)
    const [pickerValue, setPickerValue] = useState('all')
    const [editTrancheMontant, setEditTrancheMontant] = useState('')

    const handleEngagementDetails = async (item) => {
        await dispatch(getEngagementDetail(item))
    }

    const handleChangeContent = (value) => {
        if(value.toLowerCase() === 'member') setMainData(associationValidMembers())
        else setMainData(engagements)
    }

    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
            <AppHeaderGradient/>
            <View>
                <Picker itemStyle={{fontWeight: 'bold'}} style={styles.picker} mode='dropdown' selectedValue={pickerValue} onValueChange={val => {
                    setPickerValue(val)
                    handleChangeContent(val)
                }}>
                    <Picker.Item label='Tous les engagements' value='all'/>
                    <Picker.Item label='Par membre' value='member'/>
                </Picker>
            </View>
            <View style={{
                marginVertical: 10
            }}>
                <ListItemSeparator/>
            </View>
            {mainData.length === 0 && <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 50
            }}>
                <AppText>Aucun engagements trouvé</AppText>
            </View>}
           {mainData.length>0 && <FlatList data={pickerValue.toLowerCase() === 'member'?associationValidMembers():engagements}
                     keyExtractor={item => item.id.toString()}
                     ItemSeparatorComponent={ListItemSeparator}
                     renderItem={({item}) => {
                         if(pickerValue.toLowerCase() === 'member') {
                           return  <MemberListItem selectedMember={item}
                               childrenStyle={{
                                   top: 25
                               }}
                               getMemberDetails={() => navigation.navigate(routes.LIST_ENGAGEMENT, item)}>
                               <AppText style={{marginHorizontal: 20}}>({getMemberEngagementInfos(item).engagementLength})</AppText>
                               <AppText>{formatFonds(getMemberEngagementInfos(item).engagementAmount)}</AppText>
                             </MemberListItem>
                         }

                         return <EngagementItem
                             getMoreDetails={() => navigation.navigate('MemberEngagementDetail', item)}
                             renderRightActions={(tranche) =>
                                 connectedMember.id === item.creatorId?<TrancheRightActions
                                 ended={tranche.montant===tranche.solde}
                                 isPaying={tranche.paying}
                                 payingTranche={() => {dispatch(getPayingTranche(tranche))}}
                             />:null
                             }
                             editTrancheMontant={editTrancheMontant}
                             onChangeTrancheMontant={val => setEditTrancheMontant(val)}
                             handlePayTranche={(tranche) =>handlePayTranche(tranche.id, item.id, editTrancheMontant)}
                             tranches={allTranches.filter(tranche => tranche.engagementId === item.id)}
                             showTranches={item.showTranches}
                             getTranchesShown={() => {
                                 dispatch(showEngagementTranches(item))
                             }}
                             engagement={item}
                             selectedMember={getMemberUserCompte(item.Creator)}
                             engagementDetails={item.showDetail}
                             getEngagementDetails={() => handleEngagementDetails(item)}
                         />

                     }}
           />}
           <View style={styles.addNew}>
               <AppAddNewButton name='vote' onPress={() => navigation.navigate('Engagements', {screen: routes.NEW_ENGAGEMENT_LIST})}/>
           </View>
        </>
    );
}



const styles = StyleSheet.create({
    addNew: {
      position: 'absolute',
      bottom: 5,
      right: 5
    },
    dropdown: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginHorizontal: 20,
        marginTop: 20,
        backgroundColor: defaultStyles.colors.white,
        paddingVertical: 15
    },
    dropdownContent: {
        backgroundColor: defaultStyles.colors.white,
        height: 'auto',
        width: '85%',
        alignItems: 'flex-start',
        alignSelf: 'center',
        paddingBottom: 20,
        paddingLeft: 30
    },
    picker: {
      width: 250,
        alignSelf: 'center'
    },
    dropdownText: {
        color: defaultStyles.colors.bleuFbi,
        marginTop: 20
    }
})
export default EtatEngagementScreen;