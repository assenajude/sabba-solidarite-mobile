import React,{useState} from 'react';
import {View, FlatList, StyleSheet} from "react-native";
import AppText from "../components/AppText";
import {useDispatch, useSelector} from "react-redux";
import BackgroundWithAvatar from "../components/member/BackgroundWithAvatar";
import EngagementItem from "../components/engagement/EngagementItem";
import {
    getEngagementDetail,
    showEngagementTranches
} from "../store/slices/engagementSlice";
import ListItemSeparator from "../components/ListItemSeparator";
import useAuth from "../hooks/useAuth";
import AppAddNewButton from "../components/AppAddNewButton";
import routes from "../navigation/routes";
import AppActivityIndicator from "../components/AppActivityIndicator";

function ListEngagementScreen({route, navigation}) {
    const selectedMember = route.params
    const dispatch = useDispatch()
    const { getMemberUserCompte} = useAuth()

    const currentUser = useSelector(state => state.auth.user)
    const isLoading = useSelector(state => state.entities.engagement.loading)
    const [backImageLoading, setBackImageLoading] = useState(true)

    const memberEngagements = useSelector(state => {
        const list = state.entities.engagement.list
        const memberList = list.filter(engagement => engagement.creatorId === selectedMember.member.id)
        const validList = memberList.filter(item => {
            const isAccord = item.accord === true
            const isPaying = item.statut.toLowerCase() === 'paying'
            const isEnded = item.statut.toLowerCase() === 'ended'
            if(isAccord && isPaying || isEnded) return true
        })
        return validList
    })

    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
            <BackgroundWithAvatar
                onBackImageLoadEnd={() => setBackImageLoading(false)}
                onBackImageLoading={backImageLoading}
                selectedMember={selectedMember}/>
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
                              showTranches={item.showTranches}
                              getTranchesShown={() => {
                                  dispatch(showEngagementTranches(item))
                              }}
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