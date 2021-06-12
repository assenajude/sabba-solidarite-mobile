import React from 'react';
import {View, Modal, TouchableOpacity, StyleSheet, FlatList} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import defaultStyles from '../../utilities/styles'
import AssociationItem from "./AssociationItem";
import AppText from "../AppText";
import {useSelector} from "react-redux";

function AssociationModal({visible, closeModal, associations, selectAssociation}) {

    const currentAssociation = useSelector(state => state.entities.association.selectedAssociation)

    return (
        <Modal visible={visible} transparent>
            <View style={styles.mainContainer}>

            </View>
            <View style={styles.modalContainer}>
                <TouchableOpacity style={{
                    alignSelf: 'flex-end',
                }} onPress={closeModal}>
                    <MaterialCommunityIcons
                        style={{fontWeight: 'bold'}} name="close" size={24}
                        color={defaultStyles.colors.rougeBordeau} />
                </TouchableOpacity>
                <View style={{alignItems: 'center', paddingVertical: 20}}>
                    <AppText style={{color: defaultStyles.colors.bleuFbi, fontWeight: 'bold'}}>Liste de vos associations</AppText>
                </View>
                <FlatList data={associations}
                          keyExtractor={item => item.id.toString()}
                          numColumns={2}
                          renderItem={({item}) =>
                              <AssociationItem
                                  borderStyle={item.id === currentAssociation.id?{borderWidth: 1, borderColor: defaultStyles.colors.bleuFbi}:{}}
                                  association={item}
                                  nom={item.nom} showState={false}
                                  onPress={() => selectAssociation(item)}/>}
                />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
       height: '100%',
        width: '100%',
        opacity: 0.7,
       backgroundColor: defaultStyles.colors.dark
    },
    modalContainer: {
        backgroundColor: defaultStyles.colors.white,
        height: '90%',
        width: '100%',
        top: 80,
        position: 'absolute',
        padding: 10
    },
    image: {
        height:80,
        width: 80,
        borderRadius: 40
    },
    associationContainer: {
        alignItems: 'center',
    },
    nom: {
        color: defaultStyles.colors.bleuFbi,
        width: 150,
        textAlign: 'center'
    }
})

export default AssociationModal;