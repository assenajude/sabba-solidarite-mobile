import React, {useEffect, useState} from 'react';
import {View, StyleSheet,ScrollView, FlatList, ToastAndroid} from "react-native";
import AppAddNewButton from "../components/AppAddNewButton";
import routes from "../navigation/routes";
import {useDispatch, useSelector, useStore} from "react-redux";
import AppText from "../components/AppText";
import ListItemSeparator from "../components/ListItemSeparator";
import {payMemberCotisation} from "../store/slices/memberSlice";
import ListCotisationItem from "../components/cotisation/ListCotisationItem";
import {getCotisationMoreDetail} from "../store/slices/cotisationSlice";
import useAuth from "../hooks/useAuth";
import AppModal from "../components/AppModal";
import AppTextInput from "../components/AppTextInput";
import AppButton from "../components/AppButton";
import colors from "../utilities/colors";
import AppActivityIndicator from "../components/AppActivityIndicator";
import useCotisation from "../hooks/useCotisation";
import AppErrorOrEmptyScreen from "../components/AppErrorOrEmptyScreen";

function ListCotisationScreen({navigation}) {
    const dispatch = useDispatch()
    const store = useStore()
    const {isModerator, isAdmin, dataSorter} = useAuth()
    const {isCotisationPayed} = useCotisation()
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
    const isLoading = useSelector(state => state.entities.member.loading)
    const currentUser = useSelector(state => state.auth.user)
    const selectedMember = useSelector(state => {
        const list = state.entities.member.list
        const selected = list.find(item => item.userId === currentUser.id)
        return selected
    })

    const [payingModal, setPayingModal] = useState(false)
    const [selectedCotisation, setSelectedCotisation] = useState(null)
    const [montant, setMontant] = useState('')
    const [error, setError] = useState(null)

    const handlePayCotisation = async (cotisation) => {
        const validMontant = Number(montant)

        if(currentUser.wallet < validMontant) {
            setError("Vous n'avez pas de fonds suffisant.")
            return;
        }
        setPayingModal(false)
        const data = {
            memberId: selectedMember.id,
            cotisationId: cotisation.id,
            montant: montant
        }
        await dispatch(payMemberCotisation(data))
        const error = store.getState().entities.member.error
        if(error !== null) {
            return alert("Désolé, nous n'avons pas pu effectuer le payement. Une erreur est apparue. Veuillez reessayer plutard.")
        }
        ToastAndroid.showWithGravity("Payement effectué avec succès.",
            ToastAndroid.LONG,
            ToastAndroid.CENTER)
    }

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
                        isPayed={isCotisationPayed(item)}
                        payCotisation={() => {
                            setSelectedCotisation(item)
                            setMontant(String(item.montant))
                            setPayingModal(true)
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

            <AppModal
                contentStyle={{
                    height: '50%',
                    top: '20%'
                }}
                visible={payingModal}
                closeInfoModal={() => {
                    setPayingModal(false)
                    setError(null)
                }}>
                <ScrollView
                    contentContainerStyle={{
                        alignItems: 'center'
                    }}>
                    {error !== null && <AppText style={{fontSize: 13, color: colors.rougeBordeau}}>{error}</AppText>}
                <View style={styles.modalContent}>
                    <View style={{
                       marginVertical: 20,
                    }}>
                        <AppText style={{fontWeight: 'bold', fontSize: 20}}>Payement </AppText>
                    </View>
                    <AppText style={{
                        marginVertical: 30
                    }}>{selectedCotisation?.motif}</AppText>
                    <AppTextInput
                        onFocus={() => setError(null)}
                        keyboardType='numeric'
                        textAlign='center'
                        placeholder='montant'
                        width={150}
                        value={montant}
                        onChangeText={val => setMontant(val)}/>
                <AppButton
                    onPress={() => handlePayCotisation(selectedCotisation)}
                    otherButtonStyle={{
                        width: 200,
                    }} title='Valider'/>
                </View>
                </ScrollView>
            </AppModal>
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