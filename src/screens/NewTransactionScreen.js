import React, {useState, useEffect} from 'react';
import {FlatList} from "react-native";
import AppHeaderGradient from "../components/AppHeaderGradient";
import {useDispatch, useSelector} from "react-redux";
import { getReseauSelect} from "../store/slices/transactionSlice";
import TransactionItem from "../components/transaction/TransactionItem";
import ListItemSeparator from "../components/ListItemSeparator";

function NewTransactionScreen({route, navigation}) {
    const typeTransaction = route.params
    const dispatch = useDispatch()

    const reseauList = useSelector(state => state.entities.transaction.reseauList)
    const [retraitTransac, setRetraitTransac] = useState(false)

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
                    isSelected={item.selected}
                    item={item}
                    onSelectReseau={() => {
                        dispatch(getReseauSelect(item))
                        navigation.navigate('SelectedReseau',{...item, isRetrait: retraitTransac})
                    }}
                />
            }
        />
        </>
    );
}

export default NewTransactionScreen;