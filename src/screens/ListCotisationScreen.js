import React from 'react';
import {View, StyleSheet, FlatList} from "react-native";
import AppAddNewButton from "../components/AppAddNewButton";
import routes from "../navigation/routes";
import {useDispatch, useSelector} from "react-redux";
import ListItemSeparator from "../components/ListItemSeparator";
import ListCotisationItem from "../components/cotisation/ListCotisationItem";
import {getCotisationMoreDetail} from "../store/slices/cotisationSlice";
import useAuth from "../hooks/useAuth";

import AppActivityIndicator from "../components/AppActivityIndicator";
import useCotisation from "../hooks/useCotisation";
import AppErrorOrEmptyScreen from "../components/AppErrorOrEmptyScreen";

function ListCotisationScreen({navigation}) {
    const dispatch = useDispatch()
    const {isModerator, isAdmin, dataSorter} = useAuth()
    const {isCotisationPayed, deleteCotisation} = useCotisation()
    const isAuthorized = isAdmin() || isModerator()
    const listCotisations = useSelector(state => {
        let cotisations = []
          const list = state.entities.cotisation.list
        list.forEach(item => {
            cotisations.push(item)
        })
        const  cotisationSorted = dataSorter(cotisations)
        return cotisationSorted
    })
    const isLoading = useSelector(state => state.entities.cotisation.loading)


    const handleShowLessDetails = (cotisation) => {
        if(!cotisation.showMore) return;
        else dispatch(getCotisationMoreDetail(cotisation))
    }

    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
            {listCotisations.length === 0 && <AppErrorOrEmptyScreen message='Aucune cotisation trouvée.'/>}
            {listCotisations.length>0 && <FlatList
                data={listCotisations}
                keyExtractor={item => item.id.toString()}
                ItemSeparatorComponent={ListItemSeparator}
                renderItem={({item}) =>
                    <ListCotisationItem
                        deleteSelected={() => deleteCotisation(item.id)}
                        editSelected={() => navigation.navigate(routes.NEW_COTISATION, {...item, editing: true})}
                        isPayed={isCotisationPayed(item)}
                        payCotisation={() => {
                            navigation.navigate('PayementCotisation', item)
                        }
                        }
                        showCotisationLessDetail={() => handleShowLessDetails(item)}
                        showCotisationMore={() => dispatch(getCotisationMoreDetail(item))}
                        showMore={item.showMore}
                        cotisation={item}/>}
                />
            }
            {isAuthorized && <View style={styles.addNew}>
                <AppAddNewButton
                    onPress={() => navigation.navigate(routes.NEW_COTISATION)}/>
            </View>}
        </>
    );
}

const styles = StyleSheet.create({
    addNew: {
        position: 'absolute',
        right: 20,
        bottom: 20
    },
    modalContent: {
        alignItems: 'center',
        justifyContent: 'center'
    }
})
export default ListCotisationScreen;