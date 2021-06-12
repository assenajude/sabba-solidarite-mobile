import React, {useState, useEffect} from 'react';
import {FlatList} from "react-native";
import AppHeaderGradient from "../components/AppHeaderGradient";
import {useDispatch, useSelector} from "react-redux";
import { getReseauSelect} from "../store/slices/transactionSlice";
import TransactionItem from "../components/transaction/TransactionItem";
import ListItemSeparator from "../components/ListItemSeparator";
import routes from "../navigation/routes";

function NewTransactionScreen({route, navigation}) {
    const typeTransaction = route.params
    const dispatch = useDispatch()

    const reseauList = useSelector(state => state.entities.transaction.reseauList)
    const [retraitTransac, setRetraitTransac] = useState(false)
    const [montant, setMontant] = useState('')
    const [numRetrait, setNumRetrait] = useState('')


    const handleValidateMontant = (reseau) => {
        if(Number(montant)<0) {
            return alert("Veuillez specifier un montant superieur à zero et/ou un numero de retrait (pour les retraits) avant de continuer.")
        }
        const transInfos = {
            reseau,
            montant,
            retraitNum: numRetrait,
           isRetrait: retraitTransac,
            mode: retraitTransac?'Retrait' : 'Depôt'
        }
        navigation.navigate(routes.TRANSACTION_DETAIL, transInfos)
        setMontant('')
        dispatch(getReseauSelect(reseau))
    }

    useEffect(() => {
        const transLabel = typeTransaction.typeTrans.toLowerCase()
        const isRetrait = transLabel.indexOf('retrait') !== -1
        setRetraitTransac(isRetrait)

    }, [])
    return (
        <>
            <AppHeaderGradient/>
        <FlatList
            data={reseauList}
            keyExtractor={item => item.name}
            ItemSeparatorComponent={ListItemSeparator}
            renderItem={({item}) =>
                <TransactionItem
                    retraitNum={numRetrait}
                    onChangeRetraitNum={val => setNumRetrait(val)}
                    isRetrait={retraitTransac}
                    item={item}
                    montant={montant}
                    onChangeMontant={(val) => setMontant(val)}
                    onValidation={() => handleValidateMontant(item)}
                    onSelectReseau={() => dispatch(getReseauSelect(item))}
                    isSelected={item.selected}/>
            }
        />
        </>
    );
}

export default NewTransactionScreen;