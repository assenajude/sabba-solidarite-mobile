import React, {useCallback, useEffect} from 'react';
import {FlatList, StyleSheet, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import ValidationTransactionItem from "../components/transaction/ValidationTransactionItem";
import useTransaction from "../hooks/useTransaction";
import ListItemSeparator from "../components/ListItemSeparator";
import useAuth from "../hooks/useAuth";
import {getUserTransactions, showTransactionMore} from "../store/slices/transactionSlice";
import routes from "../navigation/routes";
import AppErrorOrEmptyScreen from "../components/AppErrorOrEmptyScreen";
import AppAddNewButton from "../components/AppAddNewButton";
import AppActivityIndicator from "../components/AppActivityIndicator";

function DepotScreen({navigation}) {
    const dispatch = useDispatch()
    const {getReseau} = useTransaction()
    const {dataSorter}  = useAuth()
    const currentUser = useSelector(state => state.auth.user)
    const isLoading = useSelector(state => state.entities.transaction.loading)
    const depotList = useSelector(state => {
        let depots = []
        const list = state.entities.transaction.list
        depots = list.filter(item => item.typeTransac.toLowerCase() === 'depot')
        const depotSorted = dataSorter(depots)
        return depotSorted
    })
    const error = useSelector(state => state.entities.transaction.error)

    const getInitTransaction = useCallback(async () => {
        await dispatch(getUserTransactions({userId: currentUser.id}))
    }, [])

    useEffect(() => {
        getInitTransaction()
    }, [])

    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
             {depotList.length === 0 && error === null && <AppErrorOrEmptyScreen message='Aucun depôt effectué.'/> }
            {error !== null && <AppErrorOrEmptyScreen message="Nous n'avons pas pu avoir accès au server une erreur est apparue."/>}
           {depotList.length>0 && error === null && <FlatList
               data={depotList}
               keyExtractor={item => item.id.toString()}
               ItemSeparatorComponent={ListItemSeparator}
               renderItem={({item}) =>
                   <ValidationTransactionItem
                       getCreatorDetails={() => navigation.navigate(routes.USER_COMPTE, item.user)}
                       getEditTransaction={() => navigation.navigate(routes.EDITI_TRANSACTION, item)}
                       getTransactionDetails={() => navigation.navigate(routes.VALIDATION_TRANSAC_DETAIL, item)}
                       getTransactionMore={() => dispatch(showTransactionMore(item))}
                       reseau={getReseau(item.reseau)}
                       showMore={item.showMore}
                       creatorUser={item.user}
                       transaction={item}
                   />}
           />}
           <View style={styles.addNew}>
               <AppAddNewButton
                   onPress={() => navigation.navigate(routes.NEW_TRANSACTION, {typeTrans: 'Rechargement porteffeuille'})}/>
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
export default DepotScreen;