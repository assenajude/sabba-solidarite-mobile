import React, {useEffect, useCallback, useState} from 'react';
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
import {getMemberAssociations, sendAdhesionMessage} from "../store/slices/memberSlice";
import AppTextInput from "../components/AppTextInput";

function ListAssociationScreen({navigation}) {
    const store = useStore()
    const {isAdmin} = useAuth()
    const {getMemberRelationType, getAssociatonAllMembers} = useManageAssociation()
    const dispatch = useDispatch()

    const connectedMember = useSelector(state => state.auth.user)
    const isLoadding = useSelector(state=> state.entities.association.loading)
    const isMemberLoading = useSelector(state => state.entities.member.loading)

    const [selectedList, setSelectedList] = useState([])
    const [searchLabel, setSearchLabel] = useState('')
    const [searching, setSearching] = useState(false)

    const handleSendAdhesionMessage = async(item) => {
        const data = {
            associationId: item.id,
            userId: connectedMember.id,
            relation: 'onDemand'
        }
        await dispatch(sendAdhesionMessage(data))
        await dispatch(getMemberAssociations())
        const error = store.getState().entities.member.error
        if(error !== null) {
           return  alert("Votre message n'a pas été envoyé, veuillez reessayer plutard.")
        }
    }

    const getAssociationList = async () => {
        if(!searching) {
        await dispatch(getAllAssociation())
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
    }

    useEffect(() => {
        getAssociationList()
    }, [searchLabel])

    return (
        <>
            <AppActivityIndicator visible={isLoadding || isMemberLoading}/>
            <View style={{
                alignItems: 'center',
            }}>
                <AppTextInput
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
                        association={item}
                        onPress={() => navigation.navigate(routes.ASSOCIATION_DETAILS,item)}
                        sendAdhesionMessage={() => handleSendAdhesionMessage(item)}
                        isMember={getAssociatonAllMembers(item)?.some(member => member.userId === connectedMember.id)}
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