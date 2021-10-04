import React, {useCallback} from 'react';
import {FlatList, View, StyleSheet} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import ValidationTransactionItem from "../components/transaction/ValidationTransactionItem";
import useTransaction from "../hooks/useTransaction";
import useAuth from "../hooks/useAuth";
import {getPopulateReseauList, getUserTransactions, showTransactionMore} from "../store/slices/transactionSlice";
import routes from "../navigation/routes";
import AppErrorOrEmptyScreen from "../components/AppErrorOrEmptyScreen";
import AppAddNewButton from "../components/AppAddNewButton";
import AppActivityIndicator from "../components/AppActivityIndicator";
import ListItemSeparator from "../components/ListItemSeparator";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import {reseauData} from "../utilities/reseau.data";

function RetraitScreen({navigation}) {
    const dispatch = useDispatch()
    const {getReseau} = useTransaction()
    const {dataSorter} = useAuth()
    const error = useSelector(state => state.entities.transaction.error)
    const isLoading = useSelector(state => state.entities.transaction.loading)
    const retraitList = useSelector(state => {
        let retraits = []
        const list = state.entities.transaction.list
        retraits = list.filter(item => item.typeTransac.toLowerCase() === 'retrait')
       const retraitSorted = dataSorter(retraits)
        return retraitSorted
    })
    const getInitTransaction = useCallback(async () => {
        await dispatch(getPopulateReseauList(reseauData))
        await dispatch(getUserTransactions({creatorId: currentParams?.creatorId?currentParams.creatorId : currentUser.id}))
    }, [])

    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
            {retraitList.length === 0 && error === null && <AppErrorOrEmptyScreen message='Aucun retrait effectué.'/>}

            {error !== null && <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <AppText>Nous n'avons pas pu avoir accès au server.</AppText>
                <AppButton
                    title="Réessayer"
                    onPress={getInitTransaction}/>
            </View>
            }
            {error === null && retraitList.length >0 && <FlatList
                data={retraitList}
                keyExtractor={item => item.id.toString()}
                ItemSeparatorComponent={ListItemSeparator}
                renderItem={({item})=>
                    <ValidationTransactionItem
                        getCreatorDetails={() => navigation.navigate(routes.USER_COMPTE,item.user)}
                        getEditTransaction={() => navigation.navigate(routes.EDITI_TRANSACTION, item)}
                        getTransactionDetails={() => navigation.navigate(routes.VALIDATION_TRANSAC_DETAIL, item)}
                        getTransactionMore={() => dispatch(showTransactionMore(item))}
                        showMore={item.showMore}
                        reseau={getReseau(item.reseau)}
                        creatorUser={item.creatorType=== 'member'?item.member : item.user}
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