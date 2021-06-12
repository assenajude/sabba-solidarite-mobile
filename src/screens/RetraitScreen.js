import React from 'react';
import {FlatList, View, StyleSheet} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import ValidationTransactionItem from "../components/transaction/ValidationTransactionItem";
import useTransaction from "../hooks/useTransaction";
import useAuth from "../hooks/useAuth";
import {showTransactionMore} from "../store/slices/transactionSlice";
import routes from "../navigation/routes";
import AppErrorOrEmptyScreen from "../components/AppErrorOrEmptyScreen";
import AppAddNewButton from "../components/AppAddNewButton";

function RetraitScreen({navigation}) {
    const dispatch = useDispatch()
    const {getReseau} = useTransaction()
    const {dataSorter} = useAuth()

    const error = useSelector(state => state.entities.transaction.error)
    const retraitList = useSelector(state => {
        let retraits = []
        const list = state.entities.transaction.list
        retraits = list.filter(item => item.typeTransac.toLowerCase() === 'retrait')
       const retraitSorted = dataSorter(retraits)
        return retraitSorted
    })

    return (
        <>
            {retraitList.length === 0 && error === null && <AppErrorOrEmptyScreen message='Aucun retrait effectué.'/>}

            {error !== null && <AppErrorOrEmptyScreen message="Nous n'avons pas pu avoir accès au server une erreur est apparue."/>}
            {error === null && retraitList.length >0 && <FlatList
                data={retraitList}
                keyExtractor={item => item.id.toString()}
                renderItem={({item})=>
                    <ValidationTransactionItem
                        getEditTransaction={() => navigation.navigate(routes.EDITI_TRANSACTION, item)}
                        getTransactionDetails={() => navigation.navigate(routes.VALIDATION_TRANSAC_DETAIL, item)}
                        getTransactionMore={() => dispatch(showTransactionMore(item))}
                        showMore={item.showMore}
                        reseau={getReseau(item.reseau)}
                        creatorUser={item.user}
                        transaction={item}/>}
            />}
            <View style={styles.addNew}>
            <AppAddNewButton
                onPress={() => navigation.navigate(routes.NEW_TRANSACTION, {typeTrans: 'Retrait de fonds'})}/>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    addNew: {
        position: 'absolute',
        right: 15,
        bottom: 15
    }
})
export default RetraitScreen;