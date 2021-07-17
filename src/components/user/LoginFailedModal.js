import React from 'react';
import {Modal, View, StyleSheet, ScrollView} from "react-native";
import * as Linking from "expo-linking";
import defaultStyles from '../../utilities/styles'
import AppText from "../AppText";
import {number} from '../../utilities/supportNumber'
import AppIconButton from "../AppIconButton";
import AppIconWithLabelButton from "../AppIconWithLabelButton";

function LoginFailedModal({failModal, dismissModal}) {
    return (
        <Modal visible={failModal} transparent>
            <View style={styles.container}>

            </View>
            <View style={styles.contentStyle}>
            <ScrollView contentContainerStyle={styles.contentModal}>
                <AppIconButton
                    containerStyle={{
                        alignSelf: 'flex-end',
                        marginTop: 10,
                        marginBottom: 10
                    }}
                    onPress={dismissModal}
                    iconColor={defaultStyles.colors.rougeBordeau}
                    iconName='close'/>
                    <View style={{
                        flexDirection: 'row'
                    }}>
                        <AppText style={{
                            fontWeight: 'bold',
                            marginRight: 10
                        }}>Erreur:</AppText>
                        <AppText style={{
                            width: 300
                        }}>Vos paramètres de connexion ne sont pas corrects.</AppText>
                    </View>
                <AppText>Si cette erreur persiste, contactez notre support.</AppText>
                <AppText
                    onPress={() => Linking.openURL(`tel:${number}`)}
                    style={{color:defaultStyles.colors.bleuFbi}}>Contacter le support.</AppText>
                <AppIconWithLabelButton
                    iconName='eye-check'
                    label='ok'
                    buttonContainerStyle={{
                        alignSelf: 'flex-end',
                        marginTop: 10,
                        marginBottom: 10
                    }}
                    onPress={dismissModal}
                    iconColor={defaultStyles.colors.bleuFbi}
                    />
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
    contentModal: {
        alignSelf: "center",
        width: '100%',
        height: 200,
        marginVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: defaultStyles.colors.white
    },
    contentStyle: {
        position: 'absolute',
        top: "30%",
    }
})
export default LoginFailedModal;