import React from 'react';
import {View, StyleSheet, TouchableWithoutFeedback, TextInput} from "react-native";
import {Swipeable} from "react-native-gesture-handler";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import AppText from "../AppText";
import useManageAssociation from "../../hooks/useManageAssociation";
import defaultStyles from '../../utilities/styles'
import AppButton from "../AppButton";
import ListItemSeparator from "../ListItemSeparator";


function TrancheItem({numero, payed,payingTranche,renderRightActions,
                         toPay, datePayement, payTranche,handlePayTranche,
                         trancheEditMontant, onChangeTrancheMontant}) {
    const {formatDate, formatFonds} = useManageAssociation()


    return (
        <>
        <Swipeable
            renderRightActions={renderRightActions}>
        <View style={styles.container}>
            <View style={[styles.numero, {fontWeight: 'bold'}]}>
                <AppText style={styles.itemText}>{numero}</AppText>
            </View>
            <View style={styles.montant}>
                <AppText style={styles.itemText}>{payed}</AppText>
                <AppText style={{fontWeight: 'bold'}}> / </AppText>
                <AppText style={styles.itemText}>{formatFonds(toPay)}</AppText>
            </View>
            <View>
                <AppText style={styles.itemText}>{formatDate(datePayement)}</AppText>
            </View>
            {payed === toPay && <View style={{
                marginLeft: 10
            }}>
                <MaterialCommunityIcons name="credit-card-check" size={24} color={defaultStyles.colors.vert} />
            </View>}
        </View>
        </Swipeable>
            {payingTranche &&<View>
             <View elevation={10} style={{
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <TextInput textAlign='center'
                    keyboardType='numeric' style={{
                    borderWidth: 1,
                    width: 100,
                    marginVertical: 10,
                    paddingHorizontal:5,
                    borderRadius: 10
                }}
                    value={trancheEditMontant}
                    onChangeText={onChangeTrancheMontant}
                />
                <AppButton iconName='check' title='Payer' otherButtonStyle={{
                    height: 30,
                    width: 100,
                    marginLeft: 10
                }} textStyle={{fontSize: 15}} iconSize={20} onPress={handlePayTranche}/>
                <TouchableWithoutFeedback onPress={payTranche}>
                    <MaterialCommunityIcons style={{marginLeft: 20}} name="close-circle" size={24} color={defaultStyles.colors.rougeBordeau} />
                </TouchableWithoutFeedback>
            </View>
                <ListItemSeparator width={300}/>
            </View>}
            </>
    );
}

const styles = StyleSheet.create({
    container: {
       flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 40
    },
    itemText: {
      fontSize: 15
    },
    montant: {
      flexDirection: 'row',
        marginHorizontal: 5
    },
    numero: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 0.5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    swipeable: {
    }
})
export default TrancheItem;