import React, {useEffect, useRef, useState} from 'react';
import {View, ScrollView, TouchableOpacity, TextInput, StyleSheet} from "react-native";
import AppText from "../components/AppText";
import ReseauBackImageAndLabel from "../components/transaction/ReseauBackImageAndLabel";
import defaultStyles from "../utilities/styles";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import useTransaction from "../hooks/useTransaction";
import routes from "../navigation/routes";
import {getReseauSelect} from "../store/slices/transactionSlice";
import {useDispatch, useSelector} from "react-redux";
import AppIconButton from "../components/AppIconButton";
import AppTextInput from "../components/AppTextInput";
import AppButton from "../components/AppButton";
import FundsInfor from "../components/engagement/FundsInfor";

function SelectedTransactionReseauScreen({route, navigation}) {
    const dispatch = useDispatch()
    const selectedReseau = route.params
    const connectedUser = useSelector(state => state.auth.user)


    const {getRetraitRecentNumber} = useTransaction()
    const [recentNumbers, setRecentNumbers] = useState([])
    const [montant, setMontant] = useState(0)
    const [numRetrait, setNumRetrait] = useState('')
    const [yValue, setYValue] = useState(0)

    const [showRecent, setShowRecent] = useState(false)

    const recentScroller = useRef()

    const solde = selectedReseau.isRetrait && selectedReseau.creatorType === 'member'?selectedReseau.fondTotal : connectedUser.wallet

    const goNext = () => {
        if(Number(montant)<= 0) {
            return alert("Veuillez saisir un montant superieur à zero.")
        }
        if(selectedReseau.isRetrait && Number(montant)>solde) {
            return alert("Vous ne pouvez pas choisir un montant supérieur à votre solde disponible.")
        }
        const isNumWrong = numRetrait === '' || numRetrait.length<10
        if(selectedReseau.isRetrait && isNumWrong ) {
            return alert("Le numero de retrait n'est pas correct.")
        }
        const transInfos = {
            reseau: selectedReseau,
            montant,
            retraitNum: numRetrait,
            isRetrait: selectedReseau.isRetrait,
            mode: selectedReseau.isRetrait?'Retrait' : 'Depôt'
        }
        navigation.navigate(routes.TRANSACTION_DETAIL, transInfos)
        setMontant('')
        dispatch(getReseauSelect(selectedReseau))
    }


    useEffect(() => {
        setRecentNumbers(getRetraitRecentNumber(selectedReseau.name))
    }, [])

    return (
        <ScrollView contentContainerStyle={{
            paddingBottom: 50
        }}>
            <ReseauBackImageAndLabel
                reseau={selectedReseau}
            />
            <View style={styles.infoContainer}>
                {selectedReseau.isRetrait && recentNumbers.length > 0 &&
                <TouchableOpacity
                    onPress={() => setShowRecent(!showRecent)}
                    style={styles.recent}>
                    <AppText>Choisir un numero récent</AppText>
                    <MaterialCommunityIcons name={showRecent?'chevron-down': 'chevron-right'} size={30}/>
                </TouchableOpacity>
                }
                {showRecent && <View
                    style={{
                        marginBottom: 50,
                        backgroundColor: defaultStyles.colors.leger
                }}>
                    <View style={{
                        height: 100
                    }}>
                        <ScrollView
                            onScroll={event => setYValue(event.nativeEvent.contentOffset.y)}
                            ref={recentScroller}
                            contentContainerStyle={{
                            alignItems: 'center',
                        }}
                        >
                            {recentNumbers.map((number, index) =>
                                <TouchableOpacity style={{
                                    marginVertical: 10
                                }} onPress={() => setNumRetrait(number)}
                                                  key={index.toString()}>
                                    <AppText>{number}</AppText>
                                </TouchableOpacity>)}
                        </ScrollView>
                    </View>
                    {recentNumbers.length>2 && <View style={{
                        position: 'absolute',
                        left: 20,
                        top: 40
                    }}>
                        <AppIconButton
                            onPress={() => recentScroller.current.scrollTo({x:0,y:yValue-20})
                            }
                            containerStyle={styles.iconButton}
                            iconName='chevron-left' />
                    </View>}

                   {recentNumbers.length>2 && <View style={{
                        position: 'absolute',
                        right: 20,
                        top: 40
                    }}>
                        <AppIconButton
                            onPress={() => recentScroller.current.scrollTo({x:0,y:yValue+20})}
                            containerStyle={styles.iconButton}
                            iconName='chevron-right' />
                    </View>}
                </View>}
                <View style={{
                    alignItems: 'center'
                }}>
                   {selectedReseau.isRetrait &&  <FundsInfor
                        label='Solde disponible'
                        fund={solde}
                    />}
                    {!selectedReseau.isRetrait &&
                    <View style={styles.numero}>
                        <AppText>N° dépôt: </AppText>
                        <AppText style={{color: defaultStyles.colors.rougeBordeau, fontWeight: 'bold', marginHorizontal: 20}}>{selectedReseau.numero}</AppText>
                    </View>}
                    {selectedReseau.isRetrait &&
                        <AppTextInput
                            maxLength={10}
                            style={{width: 250, alignSelf: 'center'}}
                            label='Numero de retrait'
                            keyboardType='numeric'
                            value={numRetrait}
                            onChangeText={val => setNumRetrait(val)}/>
                            }
                </View>
                    <AppTextInput
                        label='Montant'
                        style={{width: 250, marginVertical: 20, alignSelf: 'center'}}
                        keyboardType='numeric'
                        value={String(montant)}
                        onChangeText={value => setMontant(value)}/>
                        <AppButton
                            onPress={goNext}
                            style={{
                                marginTop: 20,
                                width: 300,
                                alignSelf: 'center'
                            }}
                            iconName='page-next'
                            title='suivant'
                        />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    iconButton: {
        width: 40,
        height: 40,
        paddingHorizontal: 0
    },
    infoContainer: {
        marginVertical: 40,
        marginHorizontal: 20
    },
    montantInput: {
        width: 120,
        borderWidth: 1,
        marginHorizontal: 20,
        paddingHorizontal: 5,
        borderRadius: 20,
        alignItems: 'center',
        padding: 2
    },
    recent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 40
    }
})
export default SelectedTransactionReseauScreen;