import React, {useEffect, useRef, useState} from 'react';
import {View, ScrollView, TouchableOpacity, TextInput, StyleSheet} from "react-native";
import AppText from "../components/AppText";
import ReseauBackImageAndLabel from "../components/transaction/ReseauBackImageAndLabel";
import defaultStyles from "../utilities/styles";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import useTransaction from "../hooks/useTransaction";
import routes from "../navigation/routes";
import {getReseauSelect} from "../store/slices/transactionSlice";
import {useDispatch} from "react-redux";
import AppHeaderGradient from "../components/AppHeaderGradient";
import AppIconButton from "../components/AppIconButton";

function SelectedTransactionReseauScreen({route, navigation}) {
    const dispatch = useDispatch()
    const selectedReseau = route.params


    const {getRetraitRecentNumber} = useTransaction()
    const [recentNumbers, setRecentNumbers] = useState([])
    const [montant, setMontant] = useState(0)
    const [numRetrait, setNumRetrait] = useState('')
    const [yValue, setYValue] = useState(0)

    const recentScroller = useRef()


    const goNext = () => {
        if(Number(montant)<= 0) {
            return alert("Veuillez saisir un montant superieur à zero.")
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

    const nextScrolling = () => {
        setYValue(yValue+20)
        recentScroller.current.scrollTo({x:0,y:yValue})
    }

    useEffect(() => {
        setRecentNumbers(getRetraitRecentNumber(selectedReseau.name))
    }, [])

    return (
        <ScrollView>
            <AppHeaderGradient/>
            <ReseauBackImageAndLabel
                reseauImage={selectedReseau.image}
                reseauName={selectedReseau.name}/>
            <View style={styles.infoContainer}>
                {selectedReseau.isRetrait && recentNumbers.length>0 && <View
                    style={{
                    marginBottom: 20,
                    borderWidth: 0.5
                }}>
                    <View>
                        <AppText style={{fontWeight: 'bold'}}>Numeros recents:</AppText>
                    </View>
                    <View style={{
                        height: 100
                    }}>
                        <ScrollView onScroll={event => setYValue(event.nativeEvent.contentOffset.y)}
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
                <View>
                    {!selectedReseau.isRetrait && <View style={styles.numero}>
                        <AppText>N° dépôt: </AppText>
                        <AppText style={{color: defaultStyles.colors.rougeBordeau, fontWeight: 'bold', marginHorizontal: 20}}>{selectedReseau.numero}</AppText>
                    </View>}
                    {selectedReseau.isRetrait && <View style={styles.numero}>
                        <AppText>N° de retrait: </AppText>
                        <TextInput
                            textAlign='center'
                            placeholder='n° retrait'
                            keyboardType='numeric'
                            style={styles.montantInput}
                            value={numRetrait}
                            onChangeText={val => setNumRetrait(val)}/>
                    </View>}
                </View>
                <View style={styles.montant}>
                    <AppText>Montant: </AppText>
                    <TextInput
                        textAlign='center'
                        placeholder='montant'
                        keyboardType='numeric'
                        style={styles.montantInput}
                        value={String(montant)}
                        onChangeText={value => setMontant(value)}/>
                </View>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginVertical: 30,
                        justifyContent: 'flex-end',
                        marginHorizontal: 20
                    }}
                    onPress={goNext}>
                    <MaterialCommunityIcons name="page-next" size={30} color={defaultStyles.colors.bleuFbi} />
                    <AppText style={{color: defaultStyles.colors.bleuFbi}}>suivant</AppText>
                </TouchableOpacity>
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
    montant: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 20,
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
    numero: {
        flexDirection: 'row',
        alignItems: 'center',

    },
})
export default SelectedTransactionReseauScreen;