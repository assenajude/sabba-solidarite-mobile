import React from 'react';
import {Modal, StyleSheet, View, TouchableOpacity} from "react-native";
import * as Progress from "react-native-progress";
import defaultStyles from '../utilities/styles'
import LottieView from "lottie-react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons"
function AppUploadModal({progress, uploadModalVisible, closeModal}) {
    return (
        <Modal visible={uploadModalVisible} transparent>
            <View style={styles.container}>

            </View>
            <View style={styles.animation}>
                <LottieView style={{height: 100, width: 200}} source={require('../../assets/animations/loading')} autoPlay={true} loop={true} />
                <View>
                    <Progress.Bar progress={progress} color={defaultStyles.colors.rougeBordeau} width={200}/>
                </View>
                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                    <MaterialCommunityIcons  name='close' size={24} color={defaultStyles.colors.rougeBordeau} />
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    animation: {
        alignItems: 'center',
        position: 'absolute',
        height: 200,
        width: '100%',
        backgroundColor: defaultStyles.colors.white,
        top: '30%'
    },
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: defaultStyles.colors.dark,
        top: 50,
        opacity: 0.5,
        marginBottom: 20
    },
    closeButton: {
        position: 'absolute',
        right: 20,
        top: 20
    }
})
export default AppUploadModal;