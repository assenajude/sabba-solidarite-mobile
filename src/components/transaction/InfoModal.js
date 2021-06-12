import React from 'react';
import {Modal, StyleSheet, View,TouchableOpacity, ScrollView} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import AppText from "../AppText";
import defaultStyles from "../../utilities/styles";
import {useSelector} from "react-redux";

function InfoModal({visible, closeInfoModal}) {
    const connectedUser = useSelector(state => state.auth.user)

    return (
        <Modal visible={visible} transparent>
            <View style={styles.container}>
            </View>
            <View style={styles.contentContainer}>
                <ScrollView>
                <View style={{alignItems: 'flex-end', padding: 10}}>
                    <TouchableOpacity onPress={closeInfoModal}>
                        <MaterialCommunityIcons name='close' size={24} color={defaultStyles.colors.rougeBordeau}/>
                    </TouchableOpacity>
                </View>
                <View style={{alignItems: 'center'}}>
                    <View style={{
                        flexDirection: 'row'
                    }}>
                        <AppText>Félicitation </AppText>
                       <AppText style={{fontWeight: 'bold'}}> {connectedUser.username}</AppText>

                    </View>
                    <AppText>Merci d'utiliser nos services.</AppText>
                </View>
                <View style={{
                    alignItems: 'center',
                    marginVertical: 30
                }}>
                    <AppText style={{color: defaultStyles.colors.bleuFbi, fontSize: 20}}>Informations</AppText>
                </View>
                    <View>
                        <View style={styles.infoLabel}>
                            <MaterialCommunityIcons name="circle-medium" size={24} color={defaultStyles.colors.or} />
                            <AppText>Rechargement de portefeuille</AppText>
                        </View>
                        <View style={{
                            alignItems: 'center'
                        }}>
                        <AppText style={{marginHorizontal: 5}}>Veuillez d'abord initier une transaction (depot) comme vous venez de le faire.
                            Ensuite effectuez un depot d'argent sur le numero qui vous a été indiqué selon le reseau choisi.
                            Dès reception et confirmation du depot à notre niveau, nous rechargeons votre portefeuille du montant reçu.
                        </AppText>
                        </View>
                    </View>
                    <View>
                        <View style={[styles.infoLabel, {marginTop: 20}]}>
                            <MaterialCommunityIcons name="circle-medium" size={24} color={defaultStyles.colors.or} />
                            <AppText>Retrait de fonds</AppText>
                        </View>
                        <View style={{
                            alignItems: 'center'
                        }}>
                        <AppText style={{marginHorizontal: 5}}>Veuillez d'abord initier une transaction (retrait) comme vous venez de le faire.
                            Dès reception de votre transaction, nous procédons à la verification. Si la transaction est valide après verification,
                            nous effectuons un depôt d'argent sur le numero que vous avez indiqué selon le reseau choisi.
                        </AppText>
                        </View>
                    </View>
                    <View style={{
                        alignItems: 'flex-end',
                        marginTop: 15,
                        marginRight: 30
                    }}>
                        <TouchableOpacity onPress={closeInfoModal}>
                          <AppText  style={{color: defaultStyles.colors.bleuFbi}}>OK</AppText>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        opacity: 0.5,
        backgroundColor: defaultStyles.colors.dark
    },
    contentContainer: {
        position: 'absolute',
        top: 50,
        width: '100%',
        height: '90%',
        backgroundColor: defaultStyles.colors.white
    },
    infoLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10
    }
})
export default InfoModal;