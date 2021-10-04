import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import AppText from "../AppText";
import useManageAssociation from "../../hooks/useManageAssociation";
import defaultStyles from '../../utilities/styles'
import AppButton from "../AppButton";
import AppTextInput from "../AppTextInput";
import AppSimpleLabelWithValue from "../AppSimpleLabelWithValue";
import useEngagement from "../../hooks/useEngagement";
import AppActivityIndicator from "../AppActivityIndicator";
import {getStateUpdate} from "../../store/slices/associationSlice";
import {useDispatch} from "react-redux";


function TrancheItem({tranche={},engagementPaying,
                         payingTranche, isAuthorized}) {

    const dispatch = useDispatch()
    const {handlePayTranche} = useEngagement()
    const {formatDate, formatFonds} = useManageAssociation()

    const [montant, setMontant] = useState(String(tranche.montant))
    const [loading, setLoading] = useState(false)

    const handleTranchePayed = async () => {
        setLoading(true)
        await handlePayTranche(tranche.id, tranche.engagementId, Number(montant))
        dispatch(getStateUpdate({updating: true}))
        setLoading(false)
    }

    return (
        <>
            <AppActivityIndicator visible={loading}/>
        <View style={styles.container}>
            <TouchableOpacity
                onPress={payingTranche}
                style={styles.trancheItem}>
               {engagementPaying &&  <MaterialCommunityIcons size={30}
                    name={tranche.paying?'chevron-down' : 'chevron-right'}/>}
                <AppText>{formatFonds(tranche.montant)}</AppText>
                <AppText> {tranche.solde === tranche.montant?'payé le' : 'au'} </AppText>
                <AppText>{formatDate(tranche.solde === tranche.montant?tranche.updatedAt : tranche.echeance)}</AppText>
            </TouchableOpacity>
            {tranche.solde>0 && <View style={{
                position: 'absolute',
                top: 0,
                right: 0
            }}>
                <MaterialCommunityIcons
                    name="credit-card-check"
                    size={24}
                    color={tranche.solde === tranche.montant?defaultStyles.colors.vert : defaultStyles.colors.orange} />
            </View>}
        </View>
            {engagementPaying && tranche.paying &&
            <View style={{
                backgroundColor: defaultStyles.colors.white
            }}>
                <View style={{
                    marginHorizontal: 20
                }}>
                <AppSimpleLabelWithValue label='Total à payer' labelValue={formatFonds(tranche.montant)}/>
                <AppSimpleLabelWithValue label='Déjà payé' labelValue={formatFonds(tranche.solde)}/>
                <AppSimpleLabelWithValue label='Reste à payer' labelValue={formatFonds(tranche.montant - tranche.solde)}/>
                </View>
             {isAuthorized && tranche.solde !== tranche.montant && <View>
                 <AppTextInput
                     style={{marginVertical: 10,width: 200, alignSelf: 'center'}}
                     label='montant à payer'
                     onChangeText={val => setMontant(val)}
                     value={tranche.solde === tranche.montant?String(0) :montant}
                 />
                <AppButton
                    style={{alignSelf: 'center', marginVertical: 20, width: 200}}
                    iconName='check'
                    title='Payer'
                    onPress={handleTranchePayed}/>
            </View>}
            </View>}
            </>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
        alignItems: 'center'
    },
    itemText: {
      fontSize: 15
    },
    montant: {
      flexDirection: 'row',
        marginHorizontal: 5
    },
    numero: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 0.5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    trancheItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10
    }
})
export default TrancheItem;