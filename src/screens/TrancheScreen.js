import React from 'react';
import {ScrollView, View, StyleSheet} from "react-native";
import AppText from "../components/AppText";
import colors from "../utilities/colors";
import {useDispatch, useSelector} from "react-redux";
import AppAvatar from "../components/AppAvatar";
import routes from "../navigation/routes";
import TrancheItem from "../components/tranche/trancheItem";
import {getPayingTranche} from "../store/slices/engagementSlice";
import FundsInfor from "../components/engagement/FundsInfor";
import useAuth from "../hooks/useAuth";

function TrancheScreen({route, navigation}) {
    const {getConnectedMember} = useAuth()
    const selectedEngagement = useSelector(state => {
        const list= state.entities.engagement.list
        const selected = list.find(item => item.id === route.params.id)
        return selected
    })

    const dispatch = useDispatch()

    const selectedCreator = useSelector(state => {
        const list = state.entities.member.list
        const selected = list.find(item => item.id === selectedEngagement.Creator.userId)
        return selected
    })

    const selectedTranches = useSelector(state => {
        const list = state.entities.engagement.tranches
        const selected = list.filter(tranche => tranche.engagementId === selectedEngagement.id)
        return selected
    })


    const total = selectedEngagement.montant+selectedEngagement.interetMontant+selectedEngagement.penalityMontant
    const solde = selectedEngagement.solde
    const reste = total - solde

    const handlePaying = async (tranche) => {
        await dispatch(getPayingTranche(tranche))
    }

    return (
        <>
        <ScrollView contentContainerStyle={{
            paddingBottom: 50
        }}>
            <View style={styles.header}>
                <AppText style={{fontSize: 40}}>{selectedEngagement.libelle}</AppText>
            </View>
            <View style={styles.creator}>
                <AppText style={{marginRight: 10}}>Par</AppText>
                <AppAvatar
                    onPress={() => navigation.navigate(routes.MEMBER_DETAILS, selectedCreator)}
                    user={selectedCreator}/>
                <AppText style={{marginLeft: 10}}>{selectedCreator.username?selectedCreator.username : selectedCreator.email}</AppText>
            </View>
            <View style={styles.fonds}>
                <FundsInfor label='Total à rembourser' fund={total}/>
                <FundsInfor label='Total remboursé' fund={solde}/>
                <FundsInfor label='Reste à rembourser' fund={reste}/>
            </View>
            <View>
                <AppText style={styles.trancheLabel}>Tranches de payement</AppText>
                {selectedTranches.map((item, index) =>
                    <TrancheItem
                        isAuthorized={getConnectedMember().id === selectedEngagement.Creator.id}
                        engagementPaying={selectedEngagement.statut.toLowerCase() === 'paying'}
                        key={item.id.toString()}
                        tranche={item} numero={index+1}
                        payingTranche={() => handlePaying(item)}
                    />)}
            </View>
        </ScrollView>
            </>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 200,
        width: '100%',
        backgroundColor: colors.leger,
        alignItems: 'center',
        justifyContent: 'center'
    },
    creator: {
        flexDirection: 'row',
        marginLeft: 10,
        marginVertical: 10
    },
    fonds: {
        alignItems: 'center',
        width: '100%'
    },

    trancheLabel: {
        marginVertical: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: colors.leger,
        alignSelf:'center',
        marginHorizontal: 10}
})

export default TrancheScreen;