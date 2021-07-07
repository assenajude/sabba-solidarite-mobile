import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, FlatList} from "react-native";
import useAuth from "../hooks/useAuth";
import AppAddNewButton from "../components/AppAddNewButton";
import routes from "../navigation/routes";
import {useDispatch, useSelector, useStore} from "react-redux";
import AppText from "../components/AppText";
import {getAllAssociation, mainAssociationImageLoaded} from "../store/slices/associationSlice";
import AppActivityIndicator from "../components/AppActivityIndicator";
import AssociationItem from "../components/association/AssociationItem";
import useManageAssociation from "../hooks/useManageAssociation";
import {sendAdhesionMessage, getConnectedUserAssociations} from "../store/slices/memberSlice";
import AppTextInput from "../components/AppTextInput";

function ListAssociationScreen({navigation, route}) {
    const shouldUpdate = route.params?.updated
    const store = useStore()
    const {isAdmin} = useAuth()
    const {getMemberRelationType, deleteAssociation} = useManageAssociation()
    const dispatch = useDispatch()

    const connectedMember = useSelector(state => state.auth.user)
    const isLoadding = useSelector(state=> state.entities.association.loading)
    const isMemberLoading = useSelector(state => state.entities.member.loading)
    const userAssociations = useSelector(state => state.entities.member.userAssociations)
    const deletedSuccess = useSelector(state => state.entities.association.deleteSuccess)

    const [selectedList, setSelectedList] = useState([])
    const [searchLabel, setSearchLabel] = useState('')
    const [searching, setSearching] = useState(false)
    const [updateList, setUpdateList] = useState(false)
    const [deleted, setDeleted] = useState(false)

    const handleDeleteOne = (ass) => {
        deleteAssociation(ass)
    }

    const handleSendAdhesionMessage = async(item) => {
        const data = {
            associationId: item.id,
            userId: connectedMember.id,
            relation: 'onDemand'
        }
        await dispatch(sendAdhesionMessage(data))
        const error = store.getState().entities.member.error
        if(error !== null) {
           return  alert("Votre message n'a pas été envoyé, veuillez reessayer plutard.")
        }
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


    const handleImageLoaded = async (asso) => {
        if(asso.imageLoading) {
            await dispatch(mainAssociationImageLoaded(asso))
            const newAssoState = store.getState().entities.association.list
            const selected = newAssoState.find(association => association.id == asso.id)
            const oldArray = selectedList.filter(item => item.id !== asso.id)
            const newArray = [...oldArray, selected]
            setSelectedList(newArray)
        }
    }


    useEffect(() => {
        getAssociationList()
        const unsubscribe = navigation.addListener('focus', () => {
            if(shouldUpdate) setUpdateList(true)
        })
        return () => unsubscribe
    }, [searchLabel, shouldUpdate, navigation, deleted, deletedSuccess])

    return (
        <>
            <AppActivityIndicator visible={isLoadding || isMemberLoading}/>
            <View style={{
                alignItems: 'center',
            }}>
                <AppTextInput
                    placeholder='nom ou description'
                    onChangeText={val => {
                        setSearching(true)
                        setSearchLabel(val)
                    }}
                    value={searchLabel}
                    style={{
                        height: 20
                    }}
                    width={200}
                    icon='book-search-outline'/>
            </View>
            {selectedList.length === 0 && !isLoadding && <View style={styles.emptyStyle}>
                <AppText>Aucune association trouvée</AppText>
            </View>}
            {selectedList.length > 0 &&
            <FlatList
                data={selectedList}
                keyExtractor={item => item.id.toString()}
                numColumns={2}
                renderItem={({item}) =>
                    <AssociationItem
                        onImageLoadEnd={() => handleImageLoaded(item)}
                        imageLoading={item.imageLoading}
                        deleteSelected={() => handleDeleteOne(item)}
                        association={item}
                        onPress={() => navigation.navigate(routes.ASSOCIATION_DETAILS,item)}
                        sendAdhesionMessage={() => handleSendAdhesionMessage(item)}
                        isMember={userAssociations.some(ass => ass.id === item.id)}
                        relationType={getMemberRelationType(item)}
                    />}
            />}
            {isAdmin() && <View style={styles.addNew}>
                <AppAddNewButton onPress={() => navigation.navigate(routes.NEW_ASSOCIATION)}/>
            </View>}
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