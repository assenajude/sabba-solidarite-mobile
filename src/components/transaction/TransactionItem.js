import React from 'react';
import {View, StyleSheet, Image, TouchableOpacity, TextInput} from "react-native";
import AppText from "../AppText";
import {MaterialCommunityIcons} from '@expo/vector-icons'

import defaultStyles from '../../utilities/styles'

function TransactionItem({isSelected,onSelectReseau, item, montant, onChangeMontant,
                             onValidation,retraitNum, onChangeRetraitNum, isRetrait}) {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onSelectReseau}>
            <View style={styles.header}>
                <View style={styles.selected}>
                    {isSelected && <MaterialCommunityIcons name="checkbox-blank-circle" size={18} color={defaultStyles.colors.or} />}
                </View>
                <AppText style={styles.label}>{item.name}</AppText>
            </View>
            </TouchableOpacity>
            <Image resizeMode='stretch' source={item.image} style={styles.image}/>
            {isSelected && <View style={styles.infoContainer}>
                <View>
                    {!isRetrait && <View style={styles.numero}>
                        <AppText>N° dépôt: </AppText>
                        <AppText style={{color: defaultStyles.colors.rougeBordeau, fontWeight: 'bold', marginHorizontal: 20}}>{item.numero}</AppText>
                    </View>}
                    {isRetrait && <View style={styles.numero}>
                        <AppText>N° de retrait: </AppText>
                        <TextInput textAlign='center' placeholder='n° retrait' keyboardType='numeric' style={styles.montantInput} value={retraitNum} onChangeText={onChangeRetraitNum}/>
                    </View>}
                </View>
                <View style={styles.montant}>
                    <AppText>Montant: </AppText>
                    <TextInput textAlign='center' placeholder='montant' keyboardType='numeric' style={styles.montantInput} value={montant} onChangeText={onChangeMontant}/>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                        onPress={onValidation}>
                        <MaterialCommunityIcons name="page-next" size={30} color={defaultStyles.colors.bleuFbi} />
                        <AppText style={{color: defaultStyles.colors.bleuFbi}}>suivant</AppText>
                    </TouchableOpacity>
                </View>
            </View>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      marginVertical: 20
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical:5,
        marginHorizontal: 20
    },
    infoContainer: {
      marginVertical: 20,
        marginHorizontal: 20
    },
    image: {
        height: 200,
        width: '100%'
    },
    label: {
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
    selected: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 1
    }
})
export default TransactionItem;