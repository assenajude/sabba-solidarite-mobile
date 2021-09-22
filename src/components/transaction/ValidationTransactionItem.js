import React from 'react';
import {View,StyleSheet, TouchableWithoutFeedback, Image} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import AppText from "../AppText";
import useManageAssociation from "../../hooks/useManageAssociation";
import MemberItem from "../member/MemberItem";
import defaulStyles from '../../utilities/styles'
import LottieView from 'lottie-react-native'
import AppButton from "../AppButton";
import useAuth from "../../hooks/useAuth";
import AppIconButton from "../AppIconButton";
import useTransaction from "../../hooks/useTransaction";

function ValidationTransactionItem({reseau,getEditTransaction, transaction, creatorUser, showMore,
                                       getTransactionMore, getTransactionDetails, getCreatorDetails}) {
    const {formatFonds, formatDate} = useManageAssociation()
    const {isAdmin} = useAuth()
    const {getCreatorUser} = useTransaction()


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
                            color: defaulStyles.colors.grey,
                            fontSize: 15
                        }}>traitement...</AppText>
                </View>
                }


                {transaction.statut.toLowerCase() === 'succeeded' && <MaterialCommunityIcons name="credit-card-check" size={30} color={defaulStyles.colors.vert} />}
                {transaction.statut.toLowerCase() === 'failed' && <MaterialCommunityIcons name="credit-card-off" size={24} color={defaulStyles.colors.rougeBordeau} />}
                <AppText style={{fontWeight: 'bold'}}>{formatDate(transaction.createdAt)}</AppText>
            </View>
            <View>
                <View>
                    <View style={styles.transacInfo}>
                        <AppText style={{width: 150, fontWeight: 'bold'}}>{transaction.libelle}</AppText>
                        <AppText style={{fontWeight: 'bold'}}>{formatFonds(transaction.montant)}</AppText>
                    </View>
                </View>
                {showMore && <View>
                    <View style={styles.reseauContainer}>
                        <AppText >Reseau</AppText>
                        <View style={styles.reseauDetail}>
                            <Image resizeMode='contain' style={{height: 30,width: 30}} source={reseau && reseau.image?reseau.image : require('./../../../assets/icon.png')}/>
                            {reseau && <AppText style={{marginLeft: 5}}>{reseau.name}</AppText>}
                            {!reseau && <AppText style={{marginLeft: 5}}>sabbat wallet</AppText>}
                        </View>
                    </View>
                    {reseau && <View style={styles.reseauContainer}>
                        <AppText>N° Transaction</AppText>
                        <View style={styles.reseauDetail}>
                            <MaterialCommunityIcons name="card-account-phone" size={24} color="black" />
                            <AppText style={{marginLeft: 5}}>{transaction.numero}</AppText>
                        </View>
                    </View>}
                    {isAdmin() &&
                    <AppButton
                        style={{alignSelf: 'flex-end'}}
                        onPress={getEditTransaction}
                        iconName='account-edit'
                        title='editer'
                    />}
                </View>}
            </View>
            {isAdmin() && creatorUser && <View style={styles.creator}>
                <AppText style={{marginHorizontal: 5}}>par</AppText>
                <MemberItem
                    getMemberDetails={getCreatorDetails}
                    showPhone={true}
                    selectedMember={getCreatorUser(transaction)}/>
            </View>}
            <View style={{marginTop: 20}}>
            <TouchableWithoutFeedback onPress={getTransactionDetails}>
                <AppText style={{color: defaulStyles.colors.bleuFbi}}> + détails</AppText>
            </TouchableWithoutFeedback>
            </View>
            <View style={styles.showMoreDown}>
                <AppIconButton
                    onPress={getTransactionMore}
                    containerStyle={{
                        width: 60,
                        backgroundColor: defaulStyles.colors.leger
                    }}
                    iconColor={defaulStyles.colors.black}
                    iconSize={30}
                    iconName={showMore?'chevron-up' : 'chevron-down'}
                />
            </View>
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