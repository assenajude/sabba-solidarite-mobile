import React, {useCallback,  useState} from 'react';
import {View, ScrollView, StyleSheet, BackHandler, Alert, ToastAndroid} from "react-native";
import {useFocusEffect} from "@react-navigation/native";
import AppText from "../components/AppText";
import ReseauBackImageAndLabel from "../components/transaction/ReseauBackImageAndLabel";
import useTransaction from "../hooks/useTransaction";
import defaultStyles from '../utilities/styles'
import AppSimpleLabelWithValue from "../components/AppSimpleLabelWithValue";
import useManageAssociation from "../hooks/useManageAssociation";
import AppAddNewButton from "../components/AppAddNewButton";
import useAuth from "../hooks/useAuth";
import routes from "../navigation/routes";
import MemberItem from "../components/member/MemberItem";
import {getTransactionCancel, getTransactionDelete} from "../store/slices/transactionSlice";
import {useDispatch, useSelector, useStore} from "react-redux";
import AppActivityIndicator from "../components/AppActivityIndicator";
function ValidationTransacDetailScreen({route, navigation}) {
    const selectedTransaction = route.params
    const dispatch = useDispatch()
    const store = useStore()
    const {getReseau} = useTransaction()
    const {isAdmin} = useAuth()
    const {formatFonds, formatDate} = useManageAssociation()
    const isLoading = useSelector(state => state.entities.transaction.loading)
    const [selectedReseau, setSelectedReseau] = useState(getReseau(selectedTransaction?.reseau))
    const selectedAssociation = useSelector(state => {
        const list = state.entities.association.list
        const selected = list.find(item => item.id === selectedTransaction.member?.associationId)
        return selected
    })


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

    const handleDeleteOne = () => {
        Alert.alert("Attention!", "Voulez-vous supprimer definitivement cette transaction?", [{
            text: 'oui', onPress: async () => {
                await dispatch(getTransactionDelete({transactionId: selectedTransaction.id}))
                const error = store.getState().entities.transaction.error
                if(error !== null) {
                    ToastAndroid.showWithGravity('Erreur lors de la suppression.', ToastAndroid.LONG, ToastAndroid.CENTER)
                    return;
                }else {
                    ToastAndroid.showWithGravity('Transaction supprimer avec succès', ToastAndroid.LONG, ToastAndroid.CENTER)
                    const routeScreen = selectedTransaction.typeTransac.toLowerCase() === 'depot'?'Depot':'Retrait'
                    navigation.navigate('Transaction', {screen: routeScreen})
                }
            }
        }, {
            text: 'non',
            onPress: () => {return;}
        }])
    }

    const handleCancelOne = () => {
        Alert.alert("Attention!", "Voulez-vous annuler cette transaction?", [{
            text: 'oui', onPress: async () => {
                await dispatch(getTransactionCancel(selectedTransaction))
                const error = store.getState().entities.transaction.error
                if(error !== null) {
                    ToastAndroid.showWithGravity("Erreur lors de l'annulation", ToastAndroid.LONG, ToastAndroid.CENTER)
                    return;
                }else {
                    ToastAndroid.showWithGravity('Transaction annulée avec succès', ToastAndroid.LONG, ToastAndroid.CENTER)
                    const routeScreen = selectedTransaction.typeTransac.toLowerCase() === 'depot'?'Depot':'Retrait'
                    navigation.navigate('Transaction', {screen: routeScreen})
                }
            }
        }, {
            text: 'non',
            onPress: () => {return;}
        }])
    }

    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
        <ScrollView contentContainerStyle={{
            paddingBottom: 40
        }}>
            <ReseauBackImageAndLabel reseau={selectedReseau}/>
            <View style={styles.numberContainer}>
            <View elevation={5} style={styles.number}>
                <AppText style={{fontWeight: 'bold'}}>{selectedTransaction.number}</AppText>
            </View>
            </View>
            <View>
            {selectedTransaction.creatorType === 'member' &&
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 20
                }}>
                    <AppText>Dans </AppText>
                    <AppText style={{fontWeight: 'bold'}}>{selectedAssociation?.nom}</AppText>
                </View>}

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
                <AppSimpleLabelWithValue label='Date Validation' labelValue={formatDate(selectedTransaction.updatedAt)}/>
                <AppSimpleLabelWithValue
                    label='Statut'
                    valueStyle={{color: selectedTransaction.statut.toLowerCase() ==='processing'? defaultStyles.colors.leger : selectedTransaction.statut.toLowerCase() === 'succeeded'? defaultStyles.colors.vert : defaultStyles.colors.rougeBordeau}}
                    labelValue={selectedTransaction.statut.toLowerCase() ==='processing'? 'en cours de traitement' : selectedTransaction.statut.toLowerCase() === 'succeeded'?'terminée avec succès' : 'échec'}/>
                {selectedTransaction.user &&
                <MemberItem
                    getMemberDetails={() => navigation.navigate(routes.USER_COMPTE, selectedTransaction.user)}
                    avatarStyle={{
                    marginVertical: 20
                }}
                    selectedMember={selectedTransaction.user} showPhone={true}/>}
            </View>
        </ScrollView>
                {isAdmin() && <View style={styles.editTransaction}>
                    <AppAddNewButton onPress={() => navigation.navigate(routes.EDITI_TRANSACTION, selectedTransaction)} name='account-edit'/>
                    <AppAddNewButton
                        buttonContainerStyle={{marginVertical: 10, backgroundColor: defaultStyles.colors.rougeBordeau}}
                        name='delete' onPress={handleDeleteOne}/>
                    <AppAddNewButton onPress={handleCancelOne}
                        buttonContainerStyle={{backgroundColor: defaultStyles.colors.rougeBordeau}} name='cancel'/>
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