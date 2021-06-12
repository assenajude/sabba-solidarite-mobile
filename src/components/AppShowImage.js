import React from 'react';
import {Modal, View, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback} from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import defaultStyles from '../utilities/styles'

function AppShowImage({imageModalVisible, imageUrl, closeImageModal}) {
    return (
        <Modal transparent  visible={imageModalVisible}>
            <View style={styles.backgroundView}>
            </View>

            <View style={styles.imageContainer}>
                <TouchableWithoutFeedback onPress={closeImageModal}>
                <Image resizeMode='contain' source={{uri: imageUrl}} style={styles.image} />
                </TouchableWithoutFeedback>
                <TouchableOpacity onPress={closeImageModal} style={styles.closeButton}>
                    <MaterialCommunityIcons name="close" size={30} color={defaultStyles.colors.rougeBordeau} />
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    closeButton: {
        position: 'absolute',
        right: 20,
        top:40
    },
    backgroundView: {
        height: '100%',
        width: '100%',
        opacity: 0.5,
        backgroundColor: defaultStyles.colors.dark
    },
    image: {
      width: '100%',
      height: '100%'
    },
    imageContainer: {
        position: 'absolute',
        width: '100%',
        height: '80%',
        top: 50
    }
})
export default AppShowImage;