import React from 'react';
import {Modal, StyleSheet, View, TouchableOpacity} from "react-native";
import {ProgressBar} from "react-native-paper";
import defaultStyles from '../utilities/styles'
import LottieView from "lottie-react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons"
function AppUploadModal({progress, uploadModalVisible, closeModal}) {
    return (
        <Modal visible={uploadModalVisible} transparent>
            <View style={styles.container}>

            </View>
            <View style={styles.animation}>
                <LottieView
                    style={{width: 150}}
                    source={require('../../assets/animations/loading')}
                    autoPlay={true} loop={true} />
                <View>
                    <ProgressBar
                        style={{width: 200, height: 5}}
                        progress={progress} color={defaultStyles.colors.bleuFbi}
                    />
                </View>
                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                    <MaterialCommunityIcons  name='close' size={25} color={defaultStyles.colors.rougeBordeau} />
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    animation: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        position: 'absolute',
        height:'auto',
        width: '90%',
        backgroundColor: defaultStyles.colors.white,
        top: '30%',
        paddingBottom: 20
    },
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: defaultStyles.colors.dark,
        top: 50,
        opacity: 0.2,
    },
    closeButton: {
        position: 'absolute',
        right: 20,
        top: 20
    }
})
export default AppUploadModal;