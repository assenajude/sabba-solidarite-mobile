import React from 'react';
import {View,StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Image} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import AppText from "../AppText";
import useManageAssociation from "../../hooks/useManageAssociation";
import MemberItem from "../member/MemberItem";
import defaulStyles from '../../utilities/styles'
import LottieView from 'lottie-react-native'
import AppButton from "../AppButton";
import useAuth from "../../hooks/useAuth";

function ValidationTransactionItem({reseau,getEditTransaction, transaction, creatorUser, showMore,
                                       getTransactionMore, getTransactionDetails}) {
    const {formatFonds, formatDate} = useManageAssociation()
    const {isAdmin} = useAuth()
    return (
        <View style={styles.container}>
            <View style={styles.date}>
                {transaction.statut.toLowerCase() === 'processing' &&  <View>
                    <LottieView
                        source={require('../../../assets/animations/transaction-process')}
                        style={{
                            height: 100,
                            width: 100
                        }}
                        loop={true}
                        autoPlay={true}/>
                        <AppText style={{
                            position: 'absolute',
                            bottom: -5,
                            left: 5,
                            color: defaulStyles.colors.grey
                        }}>traitement...</AppText>
                </View>
                }


                {transaction.statut.toLowerCase() === 'succeed' && <MaterialCommunityIcons name="credit-card-check" size={30} color={defaulStyles.colors.vert} />}
                {transaction.statut.toLowerCase() === 'failed' && <MaterialCommunityIcons name="credit-card-off" size={24} color={defaulStyles.colors.rougeBordeau} />}
                <AppText style={{fontWeight: 'bold'}}>{formatDate(transaction.createdAt)}</AppText>
            </View>
            <View>
                <View>
                    <View style={styles.transacInfo}>
                        <AppText style={{width: 150, fontWeight: 'bold'}}>{transaction.libelle}</AppText>
                        <AppText style={{fontWeight: 'bold'}}>{formatFonds(transaction.montant)}</AppText>
                    </View>
                    {!showMore && <View style={styles.showMoreUp}>
                        <TouchableOpacity onPress={getTransactionMore}>
                            <MaterialCommunityIcons
                                name="chevron-down-box-outline" size={30}
                                color="black" />
                        </TouchableOpacity>
                    </View>}
                </View>
                {showMore && <View>
                    <View style={styles.reseauContainer}>
                        <AppText >Reseau</AppText>
                        <View style={styles.reseauDetail}>
                            <Image resizeMode='contain' style={{height: 30,width: 30}} source={reseau.image}/>
                            <AppText style={{marginLeft: 5}}>{reseau.name}</AppText>
                        </View>
                    </View>
                    <View style={styles.reseauContainer}>
                        <AppText>N° Transaction</AppText>
                        <View style={styles.reseauDetail}>
                            <MaterialCommunityIcons name="card-account-phone" size={24} color="black" />
                            <AppText style={{marginLeft: 5}}>{transaction.numero}</AppText>
                        </View>
                    </View>
                    {isAdmin() && <AppButton
                        onPress={getEditTransaction}
                        iconName='account-edit'
                        title='editer'
                        otherButtonStyle={styles.editButton}/>}
                </View>}
            </View>
            <View style={styles.creator}>
                <AppText>par</AppText>
                <MemberItem showPhone={true} selectedMember={creatorUser}/>
            </View>
            <View style={{marginTop: 20}}>
            <TouchableWithoutFeedback onPress={getTransactionDetails}>
                <AppText style={{color: defaulStyles.colors.bleuFbi}}> + détails</AppText>
            </TouchableWithoutFeedback>
            </View>

            {showMore && <View style={styles.showMoreDown}>
                <TouchableOpacity onPress={getTransactionMore}>
                <MaterialCommunityIcons
                    name="chevron-up-box-outline" size={30}
                    color="black" />
                </TouchableOpacity>
            </View>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      marginVertical: 20,
        marginHorizontal: 20
    },
    creator: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    date: {
      flexDirection: 'row',
        justifyContent: 'space-between',
    },
    editButton: {height: 25,
        width: 100,
        padding: 5,
        alignSelf: 'flex-end'
    },
    image :{
        height: 200,
        width: '100%'
    },
    reseauDetail: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    reseauContainer: {
      flexDirection: 'row',
      alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10
    },
    showMoreUp: {
      position: 'absolute',
      right: 20,
      top: 40
    },
    showMoreDown: {
      position: 'absolute',
      right: 20,
      bottom: 10
    },
    transacInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10
    }
})
export default ValidationTransactionItem;