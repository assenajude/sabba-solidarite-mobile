import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native'
import FundsInfor from "../components/engagement/FundsInfor";
import AppButton from "../components/AppButton";
import AppTextInput from "../components/AppTextInput";
import {useDispatch, useSelector, useStore} from "react-redux";
import {addTransaction} from "../store/slices/transactionSlice";
import AppActivityIndicator from "../components/AppActivityIndicator";
import {getMemberStateUpdate} from "../store/slices/memberSlice";

function MemberRetraitScreen({route}) {
    const selectedMember = route.params
    const [montant, setMontant] = useState('')
    const dispatch = useDispatch()
    const store = useStore()

    const loading = useSelector(state => state.entities.transaction.loading)

    const handleValidateRetrait = async () => {
        if(Number(montant)<= 0) {
            return alert("Veuillez choisir un montant valide.")
        }
        if(Number(montant)>selectedMember.member.fonds) {
            return alert('Le montant ne doit etre superieur au solde disponible.')
        }
        const data = {
            creatorId: selectedMember.member.id,
            montant: Number(montant),
            mode: 'interne',
            libelle: 'Retrait interne de fonds',
            type: 'retrait',
            reseau: 'sabbat wallet',
            creatorType: 'member'
        }
        await dispatch(addTransaction(data))
        const error = store.getState().entities.transaction.error
        if(error !== null) {
            alert("Erreur lors la validation de votre transaction, veuillez reessayer plutard.")
        }else {
            alert("Votre transaction a effectuée avec succès.")
            setMontant('')
            dispatch(getMemberStateUpdate({updating: true}))
        }
    }

    return (
        <>
            <AppActivityIndicator visible={loading}/>
        <View style={styles.container}>
            <FundsInfor
                fund={selectedMember.member.fonds}
                label='Fonds disponible'
            />
            <AppTextInput
                keyboardType='numeric'
                style={styles.montant}
                onChangeText={val => setMontant(val)}
                value={montant}
                label='Montant à retirer'
            />
            <AppButton
                style={styles.button}
                onPress={handleValidateRetrait}
                title='Valider'
            />
        </View>
            </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    montant: {
        width: 250,
        marginTop: 20
    },
    button: {
        marginTop: 50,
        width: 300
    }
})


export default MemberRetraitScreen;