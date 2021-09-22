import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, FlatList} from "react-native";
import useAuth from "../hooks/useAuth";
import AppAddNewButton from "../components/AppAddNewButton";
import routes from "../navigation/routes";
import {useDispatch, useSelector, useStore} from "react-redux";
import AppText from "../components/AppText";
import {getAllAssociation} from "../store/slices/associationSlice";
import AppActivityIndicator from "../components/AppActivityIndicator";
import AssociationItem from "../components/association/AssociationItem";
import useManageAssociation from "../hooks/useManageAssociation";
import {getConnectedUserAssociations} from "../store/slices/memberSlice";
import AppSearchBar from "../components/AppSearchBar";

function ListAssociationScreen({navigation, route}) {
    const shouldUpdate = route.params?.updated
    const store = useStore()
    const {getMemberRelationType, deleteAssociation, sendAdhesionMessageToAssociation} = useManageAssociation()
    const dispatch = useDispatch()

    const isLoadding = useSelector(state=> state.entities.association.loading)
    const isMemberLoading = useSelector(state => state.entities.member.loading)
    const userAssociations = useSelector(state => state.entities.member.userAssociations)
    const deletedSuccess = useSelector(state => state.entities.association.deleteSuccess)
    const updated = useSelector(state => state.entities.association.updated)

    const [selectedList, setSelectedList] = useState([])
    const [searchLabel, setSearchLabel] = useState('')
    const [searching, setSearching] = useState(false)
    const [updateList, setUpdateList] = useState(false)
    const [deleted, setDeleted] = useState(false)

    const handleDeleteOne = (ass) => {
        deleteAssociation(ass)
    }

    const getAssociationList = useCallback(async () => {
            if(!searching || updateList === true) {
                await dispatch(getAllAssociation())
                await dispatch(getConnectedUserAssociations())
                setUpdateList(false)
            }
            const associationList = store.getState().entities.association.list
            if(searchLabel.length === 0) {
                setSelectedList(associationList)
            } else {
                const filteredList = associationList.filter(association => {
                    const searchString = association.nom+' '+association.description
                    const normalizeInfos = searchString.toLowerCase()
                    const normalizeTerme = searchLabel.toLowerCase()
                    if(normalizeInfos.search(normalizeTerme) !== -1) return true
                })
                setSelectedList(filteredList)
            }

    }, [searchLabel, updateList, navigation, deleted, deletedSuccess])



    useEffect(() => {
        getAssociationList()
        const unsubscribe = navigation.addListener('focus', () => {
            if(shouldUpdate) setUpdateList(true)
        })
        return () => unsubscribe
    }, [searchLabel, shouldUpdate, navigation, deleted, deletedSuccess, updated])

    return (
        <>
            <AppActivityIndicator visible={isLoadding || isMemberLoading}/>
            <AppSearchBar
                placeholder='Chercher une association'
                onChangeText={val =>{
                    setSearching(true)
                    setSearchLabel(val)
                }}
                value={searchLabel}
            />
            {selectedList.length === 0 && !isLoadding && <View style={styles.emptyStyle}>
                <AppText>Aucune association trouvée</AppText>
            </View>}
            {selectedList.length > 0 &&
            <FlatList
                contentContainerStyle={{
                    alignItems: 'center',
                    paddingBottom: 50
                }}
                data={selectedList}
                keyExtractor={item => item.id.toString()}
                numColumns={2}
                renderItem={({item}) =>
                    <AssociationItem
                        deleteSelected={() => handleDeleteOne(item)}
                        association={item}
                        onPress={() => navigation.navigate(routes.ASSOCIATION_DETAILS,item)}
                        sendAdhesionMessage={() => sendAdhesionMessageToAssociation(item)}
                        isMember={userAssociations.some(ass => ass.id === item.id)}
                        relationType={getMemberRelationType(item)}
                    />}
            />}
            <View style={styles.addNew}>
                <AppAddNewButton onPress={() => navigation.navigate(routes.NEW_ASSOCIATION)}/>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    addNew: {
        position: 'absolute',
        bottom: 20,
        right: 20
    },
    emptyStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
export default ListAssociationScreen;