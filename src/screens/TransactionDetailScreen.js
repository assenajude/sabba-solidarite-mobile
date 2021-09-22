import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, ScrollView, Alert} from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppText from "../components/AppText";
import defaultStyle from '../utilities/styles'
import AppLabelWithValue from "../components/AppLabelWithValue";
import useManageAssociation from "../hooks/useManageAssociation";
import AppButton from "../components/AppButton";
import AppSwith from "../components/AppSwith";
import {useDispatch, useSelector, useStore} from "react-redux";
import AppActivityIndicator from "../components/AppActivityIndicator";
import {addTransaction} from "../store/slices/transactionSlice";
import routes from "../navigation/routes";
import ReseauBackImageAndLabel from "../components/transaction/ReseauBackImageAndLabel";
import InfoModal from "../components/transaction/InfoModal";

function TransactionDetailScreen({route, navigation}) {
    const transactionInfos = route.params
    const dispatch = useDispatch()
    const store = useStore()
    const {formatFonds} = useManageAssociation()

    const selectedUser = useSelector(state => state.auth.user)
    const isLoading = useSelector(state => state.entities.transaction.loading)
    const [isEnabled, setIsEnabled] = useState(false)
    const [noteInfoModal, setNoteInfoModal] = useState(false)

    const scrollRef = useRef()

    const toggleSwitch = () => setIsEnabled(prevState => !prevState)


    const handleValidateTransaction = async () => {
        const data = {
            creatorId: transactionInfos.reseau.creatorId?transactionInfos.reseau.creatorId : selectedUser.id,
            mode: 'externe',
            creatorType: transactionInfos.reseau.creatorType,
            libelle: transactionInfos.isRetrait? 'Retrait de fonds' : 'Rechargement de portefeuille',
            montant:Number(transactionInfos.montant),
            reseau: transactionInfos.reseau.name,
            type : transactionInfos.isRetrait?'retrait' : 'depot',
            numero: transactionInfos.isRetrait? transactionInfos.retraitNum : transactionInfos.reseau.numero
        }
        await dispatch(addTransaction(data))
        const error = store.getState().entities.transaction.error
        if(error !== null) {
            return alert("Nous sommes désolés de n'avoir pas pu valider votre transaction." +
                " Veuillez reessayer plutard ou nous contacter si l'erreur persiste.")
        }
        Alert.alert('Félicitation', "Votre transaction a été recue et est en cours de traitement. Cependant nous vous conseillons de consulter la note d'information.",
            [{text: 'transactions', onPress: () => navigation.navigate(routes.TRANSACTION, {screen: transactionInfos.isRetrait?'Retrait':'Depot'})}, {text: "informations", onPress: () => setNoteInfoModal(true)}])
    }

    useEffect(() => {
        if(isEnabled){
            scrollRef.current.scrollToEnd()
            alert("Cher utilisateur vous êtes sur le point de valider une transaction, " +
                "pour éviter tout désagrement, assurez-vous d'avoir bien vérifié les informations avant de valider." +
                " Assurez-vous aussi de disposer plus que le montant spécifié pour d'éventuels frais de transaction. Merci")
        }
     }, [isEnabled])




    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
        <ScrollView ref={scrollRef}>
            <ReseauBackImageAndLabel
                reseau={transactionInfos.reseau}
            />
                <View style={{marginTop:50}}>
                    <AppLabelWithValue label='Type de la transaction' value={transactionInfos.isRetrait?'Retrait de fonds' : 'Rechargement de portefeuille'}/>
                    <AppLabelWithValue label='Numero' value={transactionInfos.isRetrait?transactionInfos.retraitNum: transactionInfos.reseau.numero}/>
                    <AppLabelWithValue label='Montant' value={formatFonds(transactionInfos.montant)}/>
                    <AppSwith
                        label="Je suis d'accord"
                        isEnabled={isEnabled}
                        toggleSwitch={toggleSwitch}/>
                </View>

            {isEnabled &&
            <AppButton
                style={{
                    width:300,
                    alignSelf: 'center',
                    marginVertical: 50
                }}
                title='Valider'
                onPress={handleValidateTransaction}/>}
        </ScrollView>
            <InfoModal visible={noteInfoModal} closeInfoModal={() => {
                setNoteInfoModal(false)
                navigation.navigate(routes.TRANSACTION)
            }}/>
        </>
    );
}

export default TransactionDetailScreen;