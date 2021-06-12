import React,{useState} from 'react';
import {View, FlatList, StyleSheet} from "react-native";
import AppText from "../components/AppText";
import {useDispatch, useSelector} from "react-redux";
import BackgroundWithAvatar from "../components/member/BackgroundWithAvatar";
import EngagementItem from "../components/engagement/EngagementItem";
import {
    getEngagementDetail,
    getPayingTranche,
    showEngagementTranches
} from "../store/slices/engagementSlice";
import ListItemSeparator from "../components/ListItemSeparator";
import useAuth from "../hooks/useAuth";
import AppAddNewButton from "../components/AppAddNewButton";
import routes from "../navigation/routes";
import TrancheRightActions from "../components/tranche/TrancheRightActions";
import useEngagement from "../hooks/useEngagement";
import AppActivityIndicator from "../components/AppActivityIndicator";

function ListEngagementScreen({route, navigation}) {
    const selectedMember = route.params
    const {handlePayTranche} = useEngagement()
    const dispatch = useDispatch()
    const { getMemberUserCompte, getConnectedMember} = useAuth()

    const currentUser = useSelector(state => state.auth.user)
    const isLoading = useSelector(state => state.entities.engagement.loading)

    const allTranches = useSelector(state => state.entities.engagement.tranches)
    const memberEngagements = useSelector(state => {
        const list = state.entities.engagement.list
        const memberList = list.filter(engagement => engagement.creatorId === selectedMember.member.id)
        const validList = memberList.filter(item => item.accord === true)
        return validList
    })

    const [tranchePayMontant, setTranchePayMontant] = useState('')


    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
            <BackgroundWithAvatar selectedMember={selectedMember}/>
             <View style={{marginVertical: 20}}>
                 <ListItemSeparator/>
             </View>
            {memberEngagements.length > 0 &&
            <FlatList
                data={memberEngagements}
                keyExtractor={item => item.id.toString()}
                ItemSeparatorComponent={ListItemSeparator}
                renderItem={({item}) =>
                          <EngagementItem
                              getMoreDetails={() => navigation.navigate('MemberEngagementDetail', item)}
                              tranches={allTranches.filter(tranche => tranche.engagementId === item.id)}
                              showTranches={item.showTranches}
                              getTranchesShown={() => {
                                  dispatch(showEngagementTranches(item))
                              }}
                              handlePayTranche={(tranche) =>handlePayTranche(tranche.id, item.id, tranchePayMontant)}
                              editTrancheMontant={tranchePayMontant}
                              onChangeTrancheMontant={val => setTranchePayMontant(val)}
                              renderRightActions={(tranche) =>
                                  getConnectedMember().id === item.creatorId?<TrancheRightActions
                                      ended={tranche.montant===tranche.solde}
                                      isPaying={tranche.paying}
                                      payingTranche={() => {dispatch(getPayingTranche(tranche))}}
                                  />:null
                              }
                              engagement={item}
                              validationDate={item.updatedAt}
                              showAvatar={false}
                              engagementDetails={item.showDetail}
                              getEngagementDetails={() => dispatch(getEngagementDetail(item))}
                              selectedMember={getMemberUserCompte(selectedMember)}
                          />}
            />}
            {memberEngagements.length === 0 && <View style={{
                marginVertical: 20,
                marginHorizontal: 20
            }}>
                <AppText>Aucun engagement trouvé</AppText>
            </View>}

            {selectedMember.id === currentUser.id && <View style={styles.addNew}>
                <AppAddNewButton onPress={() => navigation.navigate(routes.NEW_ENGAGEMENT)}/>
            </View>}
        </>
    );
}

const styles = StyleSheet.create({
    arrowButton: {
        position: 'absolute',
        right:20,
        top: 100
    },
    addNew: {
        position: 'absolute',
        right: 5,
        bottom: 5
    }
})

export default ListEngagementScreen;