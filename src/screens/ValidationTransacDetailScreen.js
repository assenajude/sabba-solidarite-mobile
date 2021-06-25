import React, {useCallback,  useState} from 'react';
import {View, ScrollView, StyleSheet, BackHandler} from "react-native";
import {useFocusEffect} from "@react-navigation/native";
import AppText from "../components/AppText";
import ReseauBackImageAndLabel from "../components/transaction/ReseauBackImageAndLabel";
import useTransaction from "../hooks/useTransaction";
import AppHeaderGradient from "../components/AppHeaderGradient";
import defaultStyles from '../utilities/styles'
import AppSimpleLabelWithValue from "../components/AppSimpleLabelWithValue";
import useManageAssociation from "../hooks/useManageAssociation";
import AppAddNewButton from "../components/AppAddNewButton";
import useAuth from "../hooks/useAuth";
import routes from "../navigation/routes";
import MemberItem from "../components/member/MemberItem";
function ValidationTransacDetailScreen({route, navigation}) {
    const selectedTransaction = route.params
    const {getReseau} = useTransaction()
    const {isAdmin} = useAuth()
    const {formatFonds, formatDate} = useManageAssociation()
    const [selectedReseau, setSelectedReseau] = useState(getReseau(selectedTransaction.reseau))

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                const routeScreen = selectedTransaction.typeTransac.toLowerCase() === 'depot'?'Depot':'Retrait'
                navigation.navigate('Transaction', {screen: routeScreen})
                return true
            }
            BackHandler.addEventListener('hardwareBackPress', onBackPress)
            return () => {
                BackHandler.removeEventListener('hardwareBackPress', onBackPress)
            }
        }, [])
    )

    return (
        <>
        <ScrollView>
            <AppHeaderGradient/>
            <ReseauBackImageAndLabel reseauName={selectedReseau.name} reseauImage={selectedReseau.image}/>
            <View style={styles.numberContainer}>
            <View elevation={5} style={styles.number}>
                <AppText style={{fontWeight: 'bold'}}>{selectedTransaction.number}</AppText>
            </View>
            </View>
            <View style={{
                marginHorizontal: 20
            }}>
            <AppSimpleLabelWithValue label='Montant' labelValue={formatFonds(selectedTransaction.montant)}/>
            <AppSimpleLabelWithValue label='Numero' labelValue={selectedTransaction.numero}/>
            <AppSimpleLabelWithValue
                label='Type'
                labelValue={selectedTransaction.typeTransac.toLowerCase() === 'depot'?'Rechargement portefeuille' : 'Retrait de fonds'}/>
                <AppSimpleLabelWithValue label='Date émission' labelValue={formatDate(selectedTransaction.createdAt)}/>
                <AppSimpleLabelWithValue
                    label='Statut'
                    valueStyle={{color: selectedTransaction.statut.toLowerCase() ==='processing'? defaultStyles.colors.leger : selectedTransaction.statut.toLowerCase() === 'succeeded'? defaultStyles.colors.vert : defaultStyles.colors.rougeBordeau}}
                    labelValue={selectedTransaction.statut.toLowerCase() ==='processing'? 'en cours de traitement' : selectedTransaction.statut.toLowerCase() === 'succeeded'?'terminée avec succès' : 'échec'}/>
                <MemberItem
                    getMemberDetails={() => navigation.navigate(routes.USER_COMPTE, selectedTransaction.user)}
                    avatarStyle={{
                    marginVertical: 20
                }}
                    selectedMember={selectedTransaction.user} showPhone={true}/>
            </View>
        </ScrollView>
                {isAdmin() && <View style={styles.editTransaction}>
                    <AppAddNewButton onPress={() => navigation.navigate(routes.EDITI_TRANSACTION, selectedTransaction)} name='account-edit'/>
                </View>}
        </>
    );
}

const styles = StyleSheet.create({
    editTransaction:{
     position: 'absolute',
     right: 20,
     bottom: 20
    },
    number: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: defaultStyles.colors.white,
        borderRadius: 10,
        height: 50,
        width: 150
    },
    numberContainer: {
        alignSelf: 'center',
        alignItems: 'center',
        marginVertical: 40,
        backgroundColor: defaultStyles.colors.rougeBordeau,
        justifyContent: 'center',
        borderWidth: 1,
        height: 60,
        width: 160
    }
})
export default ValidationTransacDetailScreen;